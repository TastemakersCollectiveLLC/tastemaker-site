/* ============================================
   TASTEMAKERS COLLECTIVE
   Static build

     node build/build.js

   Reads config.js and build/templates.js, writes one HTML file per page
   at the repo root, content-hashed copies of styles.css, script.js and
   config.js, sitemap.xml, robots.txt, llms.txt, llms-full.txt and
   404.html. Then it checks what it wrote and exits non-zero if any check
   fails, so a broken page never reaches a commit.

   No packages. Node 18 or later.
   ============================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const T = require('./templates.js');
const TMC = require('../config.js');
const CONFIG = TMC.CONFIG;
const SITE = CONFIG.siteUrl;

const failures = [];
function fail(msg) { failures.push(msg); console.log('  FAIL  ' + msg); }
function ok(msg) { console.log('  ok    ' + msg); }
function read(rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }
function write(rel, content) { fs.writeFileSync(path.join(ROOT, rel), content.replace(/\r\n/g, '\n'), 'utf8'); }

/* ---------- 1. assets with a content hash ---------- */
function hashed(src, ext) {
  const body = read(src);
  const hash = crypto.createHash('sha256').update(body).digest('hex').slice(0, 8);
  const base = src.replace(/\.[^.]+$/, '');
  const name = base + '.' + hash + '.' + ext;
  /* drop stale hashed copies of the same source */
  fs.readdirSync(ROOT).forEach(f => {
    if (new RegExp('^' + base + '\\.[a-f0-9]{8}\\.' + ext + '$').test(f) && f !== name) fs.unlinkSync(path.join(ROOT, f));
  });
  write(name, body);
  return name;
}
console.log('assets');
const assets = {
  css: hashed('styles.css', 'css'),
  script: hashed('script.js', 'js'),
  config: hashed('config.js', 'js')
};
Object.keys(assets).forEach(k => ok(assets[k]));

/* ---------- 2. pages ---------- */
console.log('pages');
const built = [];
T.PAGES.forEach(page => {
  const html = T.document(page, assets);
  write(page.file, html);
  const text = T.textOf(html.replace(/[\s\S]*<main[^>]*>/, '').replace(/<footer[\s\S]*$/, ''));
  built.push({ route: page.route, path: page.path, file: page.file, html, text, page });
  ok(page.file + '  ' + html.length + ' bytes');
});

/* ---------- 2b. /card and its vCard, from CONFIG.business ---------- */
console.log('card');
const cardHtml = T.cardPage(read('build/card.template.html'), assets);
write('card/index.html', cardHtml.replace(/<!-- Template for \/card\.[^>]*-->/, '<!-- Written by build/build.js from build/card.template.html. Edit the template. -->'));
ok('card/index.html');
write('card/tastemakers.vcf', T.vcard());
ok('card/tastemakers.vcf');

/* ---------- 3. sitemap, robots, llms, 404 ---------- */
console.log('site files');
const now = new Date();
const today = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
const sitemapPages = built.filter(b => b.page.indexable !== false && !b.page.unlisted);
const urls = sitemapPages.map(b => ({ loc: T.absolute(b.path), priority: b.route === 'home' ? '1.0' : '0.8' }))
  .concat([{ loc: T.absolute(T.CARD.path), priority: '0.5' }]);
write('sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<!-- One URL per real page. Written by build/build.js; do not edit by hand. -->\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(u => '  <url>\n    <loc>' + u.loc + '</loc>\n    <lastmod>' + today + '</lastmod>\n    <priority>' + u.priority + '</priority>\n  </url>').join('\n') +
  '\n</urlset>\n');
ok('sitemap.xml  ' + urls.length + ' URLs, lastmod ' + today);

write('robots.txt', [
  '# Everyone is welcome, and the assistants that read for people are named',
  '# so there is no doubt.',
  'User-agent: *',
  'Allow: /',
  '',
  'User-agent: GPTBot',
  'User-agent: ClaudeBot',
  'User-agent: Claude-Web',
  'User-agent: PerplexityBot',
  'User-agent: Google-Extended',
  'User-agent: Bingbot',
  'User-agent: Applebot',
  'Allow: /',
  '',
  'Sitemap: ' + SITE + '/sitemap.xml',
  ''
].join('\n'));
ok('robots.txt');

write('llms.txt', T.llmsTxt());
const llmsLines = read('llms.txt').split('\n').length;
ok('llms.txt  ' + llmsLines + ' lines');
write('llms-full.txt', T.llmsFullTxt(built.filter(b => b.page.indexable !== false)));
ok('llms-full.txt');

/* ---------- 4. checks ---------- */
console.log('checks');

/* A. complete without JavaScript: body text over 400 characters and the h1 in it */
built.forEach(b => {
  if (b.page.unlisted) return;
  const h1 = (b.html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '';
  const h1Text = T.plain(h1) || T.plain((b.html.match(/<h1[^>]*aria-label="([^"]+)"/) || [])[1] || '');
  const count = (b.html.match(/<h1[\s>]/gi) || []).length;
  if (count !== 1) fail(b.file + ': ' + count + ' h1 elements');
  /* Indexable pages only: /reviews carries no copy by design while it is
     noindex and unlinked, and the rule exists for what crawlers receive. */
  if (b.page.indexable !== false && b.text.length <= 400) fail(b.file + ': body text is ' + b.text.length + ' characters without JavaScript');
  if (h1Text && b.text.indexOf(h1Text) === -1) fail(b.file + ': body text does not contain the h1 "' + h1Text + '"');
});
ok('every page: one h1, over 400 characters of body text without JavaScript, h1 present in it');

/* B. title and description */
built.forEach(b => {
  if (b.page.unlisted) return;
  const title = T.plain((b.html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '');
  const desc = (b.html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  const expectTitle = T.titleFor(b.route);
  if (title !== expectTitle) fail(b.file + ': title "' + title + '" is not "' + expectTitle + '"');
  if (b.page.indexable !== false && (desc.length < 120 || desc.length > 155)) fail(b.file + ': description is ' + desc.length + ' characters');
  if (!/<meta name="robots" content="index,follow,max-image-preview:large">/.test(b.html) && b.page.indexable !== false) fail(b.file + ': robots meta missing');
  if (!new RegExp('<link rel="canonical" href="' + T.absolute(b.path).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '">').test(b.html)) fail(b.file + ': canonical wrong');
});
ok('titles, descriptions 120 to 155, robots meta, canonicals');

/* C. structured data parses, and each page's types are printed */
built.forEach(b => {
  const blocks = b.html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  if (blocks.length !== 1) { fail(b.file + ': ' + blocks.length + ' JSON-LD blocks'); return; }
  let graph;
  try {
    graph = JSON.parse(blocks[0].replace(/^<script[^>]*>/, '').replace(/<\/script>$/, ''));
  } catch (e) { fail(b.file + ': JSON-LD does not parse: ' + e.message); return; }
  const types = (graph['@graph'] || []).map(n => n['@type']);
  const txt = JSON.stringify(graph);
  if (/"price"|"offers"|priceCurrency/.test(txt)) fail(b.file + ': JSON-LD carries a price or an offer');
  if (/AggregateRating|"Review"|FAQPage/.test(txt)) fail(b.file + ': JSON-LD carries rating, review or FAQ markup');
  console.log('        ' + b.file.padEnd(16) + types.join(', '));
});
ok('JSON-LD parses on every page, no prices, no ratings, no FAQ');

/* D. house rules on the built output. The one dollar sign allowed is the
   trust strip's own. */
const TRUST_DOLLAR = '$2M general liability insurance';
const outputs = built.map(b => b.file).concat(['llms.txt', 'llms-full.txt', 'sitemap.xml', 'robots.txt', assets.css, assets.script, assets.config, 'card/index.html', 'card/tastemakers.vcf']);
outputs.forEach(f => {
  const s = read(f);
  if (/279-271-1170|2792711170/.test(s)) fail(f + ': old phone number');
  if (/Tastemaker (?!Collective)|Tastemaker Collective(?!s)|\bTastemaker\b(?!s)/.test(s.replace(/Tastemakers/g, ''))) fail(f + ': Tastemaker without the S');
  if (/michelin/i.test(s)) fail(f + ': Michelin');
  if (/\bwook\b/i.test(s)) fail(f + ': Wook');
  if (/\u2014/.test(s)) fail(f + ': em dash');
  const dollars = (s.match(/\$/g) || []).length;
  const allowed = (s.split(TRUST_DOLLAR).length - 1);
  /* script.js and config.js legitimately use $ in regexes; only page and text outputs are held to the rule */
  if (!/\.js$/.test(f) && dollars > allowed) fail(f + ': ' + (dollars - allowed) + ' dollar sign(s) besides the trust strip');
});
ok('no old number, no Tastemaker without the S, no Michelin, no Wook, no em dash, no $ outside the trust strip');

/* E. internal links resolve to a built file, and the trust strip and footer are on every page */
const known = new Set(T.PAGES.map(p => p.path).concat(['/card', '/card/tastemakers.vcf', '/sitemap.xml', '/llms.txt']));
built.forEach(b => {
  const hrefs = (b.html.match(/href="([^"]+)"/g) || []).map(h => h.slice(6, -1));
  hrefs.forEach(h => {
    if (/^(https?:|mailto:|tel:|sms:|#)/.test(h)) return;
    const p = h.split('?')[0].split('#')[0];
    if (/\.(css|js|png|svg|ico|woff2)$/.test(p)) { if (!fs.existsSync(path.join(ROOT, p.replace(/^\//, '')))) fail(b.file + ': asset missing ' + p); return; }
    if (!known.has(p)) fail(b.file + ': link to ' + h + ' has no page');
  });
  if (b.html.indexOf('class="tmc-trust"') === -1) fail(b.file + ': no trust strip');
  if (b.html.indexOf('class="tmc-footer"') === -1) fail(b.file + ': no footer');
  CONFIG.trust.forEach(t => { if (b.html.indexOf(t) === -1) fail(b.file + ': trust strip missing "' + t + '"'); });
});
ok('every internal link resolves, trust strip and footer on every page');

/* I. no orphans: every indexable page, and /card, is linked from at least
   one OTHER page. /reviews is exempt while its form is disabled. */
const linkedFrom = {};
built.forEach(b => {
  const targets = new Set((b.html.match(/href="(\/[^"?#]*)/g) || []).map(h => h.slice(6)));
  targets.forEach(t => { if (t !== b.path) (linkedFrom[t] = linkedFrom[t] || []).push(b.path); });
});
T.PAGES.filter(p => p.indexable !== false).map(p => p.path).concat(['/card']).forEach(p => {
  if (!linkedFrom[p] || !linkedFrom[p].length) fail('orphan: nothing links to ' + p);
});
const serviceRoutes = ['/weddings', '/corporate', '/events', '/vending', '/order'];
built.filter(b => serviceRoutes.indexOf(b.path) > -1).forEach(b => {
  const body = b.html.slice(b.html.indexOf('<main'), b.html.indexOf('</main>'));
  if (body.indexOf('href="/menus"') === -1) fail(b.file + ': body does not link to Menus');
  if (!/href="\/contact[?"]/.test(body)) fail(b.file + ': body does not link to Contact');
});
const menusBody = built.filter(b => b.path === '/menus')[0].html;
serviceRoutes.forEach(r => { if (menusBody.indexOf('href="' + r + '"') === -1) fail('menus.html does not link to ' + r); });
const homeBody = built[0].html.slice(built[0].html.indexOf('<main'), built[0].html.indexOf('</main>'));
serviceRoutes.forEach(r => { if (homeBody.indexOf('href="' + r + '"') === -1) fail('index.html body does not link to ' + r); });
const footerHtml = built[0].html.slice(built[0].html.indexOf('<footer'));
T.PAGES.filter(p => p.indexable !== false).map(p => p.path).concat(['/card']).forEach(p => {
  if (footerHtml.indexOf('href="' + p + '"') === -1) fail('footer does not list ' + p);
});
ok('no orphans; service pages link to Menus and Contact in the body; Menus and Home link to all five; the footer lists every page');

/* G. with every measurement constant empty, no page carries a third party script */
if (!TMC.GA4_ID && !TMC.META_PIXEL_ID) {
  built.concat([{ file: 'card/index.html', html: read('card/index.html') }]).forEach(b => {
    const srcs = (b.html.match(/<script[^>]+src="([^"]+)"/g) || []).map(m => m.match(/src="([^"]+)"/)[1]);
    srcs.forEach(src => { if (/^https?:/.test(src)) fail(b.file + ': third party script ' + src); });
    if (/googletagmanager|connect\.facebook\.net|google-site-verification/.test(b.html) && !TMC.GSC_VERIFICATION) fail(b.file + ': measurement markup present while the constants are empty');
  });
  ok('measurement constants empty: no third party script, no pixel, no verification tag on any page or /card');
}

/* F. the reviews page stays out of the index, the nav and the sitemap until enabled */
if (!CONFIG.reviewForm.enabled) {
  const rv = built.filter(b => b.route === 'reviews')[0];
  if (!/noindex/.test(rv.html)) fail('reviews.html is indexable while its form is disabled');
  if (!/<fieldset class="tmc-fieldset" disabled>/.test(rv.html)) fail('reviews.html form is not disabled');
  if (read('sitemap.xml').indexOf('/reviews') > -1) fail('sitemap lists /reviews while disabled');
  built.forEach(b => { if (b.route !== 'reviews' && / href="\/reviews"/.test(b.html)) fail(b.file + ' links to /reviews while disabled'); });
  ok('reviews: noindex, disabled fieldset, out of the sitemap, unlinked');
}

/* G. the redirect script knows every page and every retired route */
const home = built[0].html;
['weddings', 'corporate', 'events', 'vending', 'order', 'menus', 'about', 'contact'].forEach(r => {
  if (home.indexOf('"' + r + '"') === -1) fail('redirect script does not know ' + r);
});
Object.keys(CONFIG.redirects).forEach(r => { if (home.indexOf('"' + r + '":"' + CONFIG.redirects[r] + '"') === -1) fail('redirect script does not forward ' + r); });
ok('hash redirect script covers every page and every retired route');

/* H. llms.txt under 120 lines, nothing but site facts */
if (llmsLines > 120) fail('llms.txt is ' + llmsLines + ' lines');
ok('llms.txt under 120 lines');

/* ---------- report ---------- */
console.log('');
console.log('descriptions');
built.forEach(b => {
  if (b.page.unlisted) return;
  const d = T.descriptionFor(b.route);
  console.log('  ' + String(d.length).padStart(3) + '  ' + b.route.padEnd(10) + d);
});
console.log('');
console.log('pages');
console.log('  ' + 'file'.padEnd(16) + 'text chars'.padStart(11) + '  h1');
built.forEach(b => {
  if (b.page.unlisted) return;
  console.log('  ' + b.file.padEnd(16) + String(b.text.length).padStart(11) + '  ' + T.plain(T.h1For(b.route)));
});
console.log('');
if (failures.length) {
  console.log(failures.length + ' FAILED');
  process.exit(1);
}
console.log('BUILD OK: ' + built.length + ' pages, ' + urls.length + ' sitemap URLs');
