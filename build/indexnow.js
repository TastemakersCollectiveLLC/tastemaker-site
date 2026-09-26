/* ============================================
   TASTEMAKERS COLLECTIVE
   IndexNow submission

     node build/indexnow.js

   Run after every push, once the deploy is live. Confirms the key file
   is served at the site root, then submits every URL in the live
   sitemap to api.indexnow.org, which shares it with the participating
   search engines (Bing, Yandex, Seznam, Naver and others). Prints the
   response code; 200 and 202 both mean accepted. Log it in the work log.

   No packages. Node 18 or later.
   ============================================ */
'use strict';

const TMC = require('../config.js');
const SITE = TMC.CONFIG.siteUrl;
const KEY = TMC.INDEXNOW_KEY;

(async () => {
  if (!KEY) { console.log('INDEXNOW_KEY is empty in config.js; nothing submitted.'); process.exit(1); }
  const keyLocation = SITE + '/' + KEY + '.txt';

  const k = await fetch(keyLocation + '?cb=' + Date.now());
  const served = (await k.text()).trim();
  if (k.status !== 200 || served !== KEY) {
    console.log('Key file not live yet: ' + keyLocation + ' answered ' + k.status + '. Push, wait for the deploy, then run again.');
    process.exit(1);
  }

  const sm = await (await fetch(SITE + '/sitemap.xml?cb=' + Date.now())).text();
  const urlList = (sm.match(/<loc>([^<]+)<\/loc>/g) || []).map(l => l.replace(/<\/?loc>/g, ''));
  if (!urlList.length) { console.log('No URLs found in the live sitemap.'); process.exit(1); }

  const body = { host: new URL(SITE).host, key: KEY, keyLocation: keyLocation, urlList: urlList };
  const r = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body)
  });
  const text = (await r.text()).trim();
  console.log('IndexNow: ' + r.status + ' ' + (r.statusText || '') + ' for ' + urlList.length + ' URLs');
  if (text) console.log(text.slice(0, 300));
  process.exit(r.status === 200 || r.status === 202 ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
