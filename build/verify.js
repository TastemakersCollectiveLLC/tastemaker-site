/* ============================================
   TASTEMAKERS COLLECTIVE
   Verify a deployed (or locally served) copy of the site

     node build/verify.js https://www.tastemakerscollective.us

   Fetches every page as GPTBot and as ClaudeBot, prints one row per page
   (the J table: status, h1, title length, description length, body
   characters without JavaScript, JSON-LD types), then follows every link
   on every page: each internal href must answer 200 and each external
   href must answer 200. Exits non-zero on any failure.

   No packages. Node 18 or later (uses the built-in fetch).
   ============================================ */
'use strict';

const BASE = (process.argv[2] || 'https://www.tastemakerscollective.us').replace(/\/$/, '');
const PAGES = ['/', '/weddings', '/corporate', '/events', '/vending', '/order', '/menus', '/about', '/contact', '/reviews', '/card'];
const AGENTS = ['GPTBot', 'ClaudeBot'];

const failures = [];
function fail(m) { failures.push(m); }

function entities(s) {
  return s.replace(/&nbsp;/g, ' ').replace(/&middot;/g, '·').replace(/&rsquo;/g, '’').replace(/&eacute;/g, 'é')
    .replace(/&rarr;/g, '→').replace(/&copy;/g, '©').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}
function textOf(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  const body = m ? m[1] : html.replace(/[\s\S]*<body[^>]*>/, '');
  return entities(body.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ').trim();
}

async function get(url, ua) {
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ' + ua + '/1.0)' }, redirect: 'manual' });
  return { status: r.status, body: await r.text(), location: r.headers.get('location') };
}

(async () => {
  const rows = [];
  const links = new Map();   /* href -> first page it was seen on */

  for (const p of PAGES) {
    const seen = {};
    for (const ua of AGENTS) seen[ua] = await get(BASE + p, ua);
    const r = seen.GPTBot;
    if (r.status !== 200) fail(p + ': status ' + r.status);
    if (seen.ClaudeBot.status !== 200 || seen.ClaudeBot.body !== r.body) fail(p + ': ClaudeBot does not get the same page as GPTBot');
    const html = r.body;
    const h1m = html.match(/<h1([^>]*)>([\s\S]*?)<\/h1>/);
    let h1 = '';
    if (h1m) {
      const aria = h1m[1].match(/aria-label="([^"]+)"/);
      h1 = aria ? aria[1] : entities(h1m[2].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
    }
    const title = entities((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '');
    const desc = entities((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
    const text = textOf(html);
    let types = [];
    const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
    blocks.forEach(b => {
      try {
        const g = JSON.parse(b.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, ''));
        types = types.concat((g['@graph'] || [g]).map(n => n['@type']));
      } catch (e) { fail(p + ': JSON-LD does not parse'); }
    });
    const indexable = /index,follow/.test(html);
    if (indexable && p !== '/card') {
      if (text.length <= 400) fail(p + ': ' + text.length + ' characters without JavaScript');
      if (h1 && p !== '/' && text.indexOf(h1) === -1) fail(p + ': h1 not in the body text');
      if (desc.length < 120 || desc.length > 155) fail(p + ': description ' + desc.length);
    }
    rows.push({ p, status: r.status, h1, title: title.length, desc: desc.length, text: text.length, types: types.join(', ') || 'none', robots: indexable ? 'index' : (p === '/card' ? 'none set' : 'noindex') });
    (html.match(/<a [^>]*href="([^"]+)"/g) || []).forEach(a => {
      const href = a.match(/href="([^"]+)"/)[1];
      if (/^(mailto:|tel:|sms:|#)/.test(href)) return;
      if (!links.has(href)) links.set(href, p);
    });
  }

  /* every link on every page */
  const linkRows = [];
  for (const [href, from] of links) {
    const url = /^https?:/.test(href) ? href : BASE + href;
    let status;
    try { status = (await get(url, 'GPTBot')).status; } catch (e) { status = 'error ' + e.message; }
    const internal = !/^https?:/.test(href) || href.indexOf(BASE) === 0;
    if (status !== 200) fail((internal ? 'internal' : 'external') + ' link ' + href + ' (on ' + from + ') answered ' + status);
    linkRows.push([internal ? 'internal' : 'external', href, status]);
  }

  console.log('J TABLE  ' + BASE);
  console.log('page        status  robots   title  desc  text  h1  |  JSON-LD');
  rows.forEach(r => console.log(
    r.p.padEnd(11) + ' ' + String(r.status).padEnd(7) + ' ' + r.robots.padEnd(8) + ' ' + String(r.title).padStart(5) + ' ' +
    String(r.desc).padStart(5) + ' ' + String(r.text).padStart(5) + '  ' + r.h1 + '  |  ' + r.types));
  console.log('');
  console.log('links: ' + linkRows.length + ' distinct, ' + linkRows.filter(l => l[0] === 'internal').length + ' internal, ' +
    linkRows.filter(l => l[0] === 'external').length + ' external, all answering ' + (failures.some(f => / link /.test(f)) ? 'NOT all 200' : '200'));
  linkRows.filter(l => l[0] === 'external').forEach(l => console.log('  external ' + l[1] + '  ' + l[2]));
  console.log('');
  if (failures.length) { failures.forEach(f => console.log('FAIL  ' + f)); console.log(failures.length + ' FAILED'); process.exit(1); }
  console.log('VERIFY OK');
})().catch(e => { console.error(e); process.exit(1); });
