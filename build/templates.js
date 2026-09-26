/* ============================================
   TASTEMAKERS COLLECTIVE
   Page templates for the static build

   Every function here returns an HTML string built from CONFIG. Nothing
   in this file holds copy: headings, sentences and labels come from
   config.js, so an edit there is an edit to every page on the next build.
   Node only; the browser never loads this.
   ============================================ */
'use strict';

const TMC = require('../config.js');
const CONFIG = TMC.CONFIG;
const B = CONFIG.business;
const SITE = CONFIG.siteUrl;
const SUFFIX = ' | ' + B.name;

/* The pages the build writes, in the order they appear in the sitemap and
   in llms.txt. path is the clean URL; file is what Vercel serves for it. */
const PAGES = [
  { route: 'home',      path: '/',          file: 'index.html' },
  { route: 'weddings',  path: '/weddings',  file: 'weddings.html' },
  { route: 'corporate', path: '/corporate', file: 'corporate.html' },
  { route: 'events',    path: '/events',    file: 'events.html' },
  { route: 'vending',   path: '/vending',   file: 'vending.html' },
  { route: 'order',     path: '/order',     file: 'order.html' },
  { route: 'menus',     path: '/menus',     file: 'menus.html' },
  { route: 'about',     path: '/about',     file: 'about.html' },
  { route: 'contact',   path: '/contact',   file: 'contact.html' },
  { route: 'reviews',   path: '/reviews',   file: 'reviews.html', indexable: false },
  { route: 'notFound',  path: '/404',       file: '404.html',     indexable: false, unlisted: true }
];

/* /card is hand written and lives in card/index.html as it always has;
   it is listed here only so the sitemap and llms.txt know about it. */
const CARD = { route: 'card', path: '/card', file: 'card/index.html', title: 'Tastemakers Collective card' };

function pathFor(route) {
  if (route === 'home') return '/';
  if (route === 'card') return '/card';
  return '/' + route;
}
function absolute(path) { return SITE + (path === '/' ? '/' : path); }

function esc(s) {
  return String(s).replace(/&(?![a-z#0-9]+;)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
/* Text for attributes and JSON: entities resolved, tags gone. */
function plain(s) {
  return String(s)
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&middot;/g, '·').replace(/&rsquo;/g, '’')
    .replace(/&eacute;/g, 'é').replace(/&amp;/g, '&').replace(/&rarr;/g, '→')
    .replace(/\s+/g, ' ').trim();
}

function h1For(route) { return CONFIG.h1[route]; }
function titleFor(route) { return CONFIG.titles[route] || (h1For(route) + SUFFIX); }
function descriptionFor(route) { return CONFIG.descriptions[route] || CONFIG.descriptions.home; }

/* ============================================
   HEAD
   ============================================ */

/* Sends an old hash URL to its page. #/weddings -> /weddings, the four
   retired routes forward, #/contact?type=x keeps its query, and an unknown
   route lands on Home, as the old router did. Inline and first in the head
   so it runs before anything paints, and again on hashchange, so a #/route
   typed onto a page that is already open is forwarded too. */
function redirectScript() {
  const known = PAGES.filter(p => !p.unlisted).map(p => p.route === 'home' ? '' : p.route);
  return '<script>(function(){function go(){var h=location.hash;if(!h||h.indexOf("#/")!==0)return;' +
    'var m=' + JSON.stringify(CONFIG.redirects) + ',k=' + JSON.stringify(known) + ';' +
    'var r=h.slice(2),q="",i=r.indexOf("?");if(i>-1){q=r.slice(i);r=r.slice(0,i);}' +
    'while(r.slice(-1)==="/")r=r.slice(0,-1);if(m[r])r=m[r];if(k.indexOf(r)===-1)r="";' +
    'location.replace((r===""?"/":"/"+r)+q);}go();addEventListener("hashchange",go);})();</script>';
}

function head(page, assets, extra) {
  const route = page.route;
  const title = titleFor(route);
  const desc = descriptionFor(route);
  const url = absolute(page.path);
  const indexable = page.indexable !== false;
  return [
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '<meta name="theme-color" content="#231F20">',
    '<title>' + esc(title) + '</title>',
    '<meta name="description" content="' + esc(desc) + '">',
    indexable
      ? '<meta name="robots" content="index,follow,max-image-preview:large">'
      : '<meta name="robots" content="noindex,nofollow">',
    '<link rel="canonical" href="' + url + '">',
    redirectScript(),
    '<!-- Interim mark: TC in Playfair Display, amethyst on the site black, drawn',
    '     from the wordmark. Replaced when the real logo lands. -->',
    '<link rel="icon" href="/favicon.ico" sizes="32x32">',
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
    '<meta property="og:type" content="website">',
    '<meta property="og:title" content="' + esc(title) + '">',
    '<meta property="og:description" content="' + esc(desc) + '">',
    '<meta property="og:url" content="' + url + '">',
    '<meta property="og:site_name" content="' + esc(B.name) + '">',
    '<meta property="og:image" content="' + SITE + '/og-image.png">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta property="og:image:alt" content="' + esc(B.name + '. ' + B.tagline) + '">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + esc(title) + '">',
    '<meta name="twitter:description" content="' + esc(desc) + '">',
    '<meta name="twitter:image" content="' + SITE + '/og-image.png">',
    '<meta name="twitter:image:alt" content="' + esc(B.name + '. ' + B.tagline) + '">',
    '<!-- Fonts are served from this origin, so there is no third-party',
    '     preconnect and no stylesheet round trip before they can start. Both are',
    '     preloaded because the wordmark and body copy need them immediately.',
    '     font-display: swap lives in the stylesheet, so text is never invisible. -->',
    '<link rel="preload" href="/fonts/playfair-latin.woff2" as="font" type="font/woff2" crossorigin>',
    '<link rel="preload" href="/fonts/montserrat-latin.woff2" as="font" type="font/woff2" crossorigin>',
    '<link rel="stylesheet" href="/' + assets.css + '">',
    '<script type="application/ld+json">' + JSON.stringify(jsonLd(page), null, 2) + '</script>',
    '<!-- Both deferred: the page is complete without them and nothing waits on them. -->',
    '<script defer src="/' + assets.config + '"></script>',
    '<script defer src="/' + assets.script + '"></script>',
    extra || ''
  ].join('\n');
}

/* ============================================
   STRUCTURED DATA, one graph per page
   ============================================ */
function jsonLd(page) {
  const route = page.route;
  const url = absolute(page.path);
  const orgId = SITE + '/#organization';
  const siteId = SITE + '/#website';

  const organization = {
    '@type': 'Organization',
    '@id': orgId,
    name: B.name,
    legalName: B.legalName,
    url: SITE + '/',
    logo: SITE + '/apple-touch-icon.png',
    telephone: B.phoneE164,
    email: B.email,
    areaServed: B.serviceArea,
    /* Empty until the Instagram handle lands. */
    sameAs: B.sameAs.slice()
  };
  const foodEstablishment = {
    '@type': 'FoodEstablishment',
    '@id': SITE + '/#foodestablishment',
    name: B.name,
    url: SITE + '/',
    telephone: B.phoneE164,
    email: B.email,
    servesCuisine: 'Californian',
    areaServed: B.serviceArea,
    address: { '@type': 'PostalAddress', addressLocality: B.city, addressRegion: 'CA', addressCountry: 'US' },
    parentOrganization: { '@id': orgId },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: CONFIG.serviceList.map(s => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, description: s.desc, url: absolute(pathFor(s.route)) }
      }))
    }
  };
  const website = {
    '@type': 'WebSite',
    '@id': siteId,
    url: SITE + '/',
    name: B.name,
    publisher: { '@id': orgId }
  };
  const pageTypes = { about: 'AboutPage', contact: 'ContactPage' };
  const webpage = {
    '@type': pageTypes[route] || 'WebPage',
    '@id': url + '#webpage',
    url: url,
    name: titleFor(route),
    description: descriptionFor(route),
    isPartOf: { '@id': siteId },
    about: { '@id': orgId },
    inLanguage: 'en-US'
  };
  const graph = [organization, foodEstablishment, website, webpage];

  if (route !== 'home') {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: h1For(route), item: url }
      ]
    });
  }
  const service = CONFIG.serviceList.filter(s => s.route === route)[0];
  if (service) {
    graph.push({
      '@type': 'Service',
      '@id': url + '#service',
      name: service.name,
      description: service.desc,
      serviceType: service.name,
      provider: { '@id': orgId },
      areaServed: B.serviceArea,
      url: url
    });
  }
  if (route === 'menus') {
    graph.push({
      '@type': 'Menu',
      '@id': url + '#menu',
      name: 'Example menus',
      description: plain(CONFIG.heroes.menus.intro),
      url: url,
      hasMenuSection: CONFIG.menus.map(section => ({
        '@type': 'MenuSection',
        name: section.section,
        hasMenuSection: section.groups.map(group => ({
          '@type': 'MenuSection',
          name: group.title,
          hasMenuItem: group.items.map(item => {
            const mi = { '@type': 'MenuItem', name: plain(item.name), description: plain(item.detail || '') };
            const diets = [];
            (item.tags || []).forEach(t => {
              if (t === 'Vegan') diets.push('https://schema.org/VeganDiet');
              if (t === 'Gluten free') diets.push('https://schema.org/GlutenFreeDiet');
            });
            if (diets.length) mi.suitableForDiet = diets;
            return mi;
          })
        }))
      }))
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

/* ============================================
   SHARED CHROME
   ============================================ */
function navHtml(items, current) {
  return items.map(item =>
    '<a href="' + pathFor(item.route) + '"' + (item.route === current ? ' aria-current="page"' : '') + '>' + item.label + '</a>'
  ).join('');
}

function nav(current) {
  const links = CONFIG.nav.filter(i => !i.cta);
  const cta = CONFIG.nav.filter(i => i.cta)[0];
  return (
    '<nav class="tmc-nav" aria-label="Primary">' +
      '<a class="tmc-logo" href="/" aria-label="' + esc(B.name) + ', home">' +
        '<span class="tmc-logo-word">TASTEMAKERS</span>' +
        '<span class="tmc-logo-sub-row"><span class="tmc-logo-sub">COLLECTIVE</span><span class="tmc-logo-rule"></span></span>' +
      '</a>' +
      '<div class="tmc-nav-links" id="tmc-nav-links">' + navHtml(links, current) + '</div>' +
      '<div class="tmc-nav-cta" id="tmc-nav-cta">' +
        (cta ? '<a class="tmc-nav-btn" href="' + pathFor(cta.route) + '"' + (cta.route === current ? ' aria-current="page"' : '') + '>' + cta.label + '</a>' : '') +
      '</div>' +
      '<button class="tmc-mobile-toggle" id="tmc-mobile-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="tmc-mobile-menu">' +
        '<span></span><span></span><span></span>' +
      '</button>' +
    '</nav>' +
    '<div class="tmc-mobile-menu" id="tmc-mobile-menu">' + navHtml(CONFIG.nav, current) + '</div>'
  );
}

/* The trust strip, above the footer on every page. Exact wording from
   CONFIG.trust, each fact its own item. */
function trustStrip() {
  return (
    '<section class="tmc-trust" aria-label="Permits and insurance">' +
      '<ul class="tmc-trust-list">' +
        CONFIG.trust.map(t => '<li>' + t + '</li>').join('') +
      '</ul>' +
    '</section>'
  );
}

function footer() {
  const cols = CONFIG.footer.columns.map(col =>
    '<div class="tmc-footer-col"><h4>' + col.heading + '</h4>' +
      col.links.map(l => '<a href="' + pathFor(l.route) + '">' + l.label + '</a>').join('') +
    '</div>'
  ).join('');
  return (
    '<footer class="tmc-footer">' +
      '<div class="tmc-footer-grid">' +
        '<div>' +
          '<div class="tmc-footer-brand">TASTEMAKERS COLLECTIVE</div>' +
          '<div class="tmc-footer-tag">' + CONFIG.footer.tagline + '</div>' +
        '</div>' +
        cols +
        '<div class="tmc-footer-col"><h4>Connect</h4>' +
          /* The only break the address is allowed: before the @. */
          '<a href="mailto:' + B.email + '">' + B.email.replace('@', '<wbr>@') + '</a>' +
          '<a href="' + B.phoneHref + '">' + B.phone + '</a>' +
        '</div>' +
      '</div>' +
      '<div class="tmc-footer-bottom">' +
        '<div>&copy; 2026 ' + B.legalName + '</div>' +
        '<div>All rights reserved</div>' +
      '</div>' +
    '</footer>'
  );
}

/* ============================================
   PAGE PARTS
   ============================================ */
function options(list) { return list.map(o => '<option>' + o + '</option>').join(''); }

function pageHero(route) {
  const h = CONFIG.heroes[route];
  return (
    '<section class="tmc-page-hero tmc-page-hero-' + route + '">' +
      '<div class="tmc-page-hero-inner">' +
        '<div class="tmc-page-eyebrow">' + h.eyebrow + '</div>' +
        '<span class="tmc-page-rule"></span>' +
        '<h1 class="tmc-page-title">' + h1For(route) + '</h1>' +
        (h.intro ? '<p class="tmc-page-intro">' + h.intro + '</p>' : '') +
        (h.styles ? '<div class="tmc-page-styles">' + h.styles + '</div>' : '') +
      '</div>' +
    '</section>'
  );
}

/* Danny's paragraph for a service page, when it exists. The slot is a
   marked, empty section until then, so the build output shows exactly
   where the copy lands and nothing invented stands in for it. */
function copySlot(route) {
  const text = (CONFIG.pageCopy || {})[route] || '';
  if (!text) return '<!-- COPY SLOT: CONFIG.pageCopy.' + route + ' is empty. Danny\'s paragraph renders here as a .tmc-block with one <p> when it lands. -->';
  return '<section class="tmc-block"><p class="tmc-block-intro tmc-page-copy">' + text + '</p></section>';
}

function bookHref(cfg) {
  let q = '';
  if (cfg && cfg.type) q += 'type=' + cfg.type;
  if (cfg && cfg.style) q += (q ? '&' : '') + 'style=' + cfg.style;
  return '/contact' + (q ? '?' + q : '');
}

function ctaButtons(route) {
  const cfg = CONFIG.cta.buttons[route] || { primary: 'Book' };
  let html = '<div class="tmc-cta-actions">' +
    '<a class="tmc-btn tmc-btn-primary" href="' + bookHref(cfg) + '">' + cfg.primary + ' <span class="tmc-arrow">&rarr;</span></a>';
  if (cfg.secondary) {
    html += '<a class="tmc-btn tmc-btn-secondary" href="/order">' + cfg.secondary + ' <span class="tmc-arrow">&rarr;</span></a>';
  }
  return html + '</div>';
}

function contactBand(route) {
  return (
    '<section class="tmc-primary-cta-band">' +
      '<div class="tmc-primary-cta-inner">' +
        '<div class="tmc-primary-cta-label">' + CONFIG.cta.kicker + '</div>' +
        '<h2 class="tmc-primary-cta-headline">' + CONFIG.cta.headlines[route] + '</h2>' +
        ctaButtons(route) +
      '</div>' +
    '</section>'
  );
}

function block(label, heading, intro, body, extra) {
  return '<section class="tmc-block">' +
    '<div class="tmc-block-head">' +
      (label ? '<div class="tmc-block-label">' + label + '</div>' : '') +
      '<h2 class="tmc-block-heading">' + heading + '</h2>' +
      (intro ? '<p class="tmc-block-intro">' + intro + '</p>' : '') +
    '</div>' + (body || '') + (extra || '') +
  '</section>';
}

function tiles(items, cols) {
  return '<div class="tmc-block-grid cols-' + cols + '">' +
    items.map(item => '<div class="tmc-block-item"><h3 class="tmc-block-item-title">' + item.title + '</h3><p class="tmc-block-item-desc">' + item.desc + '</p></div>').join('') +
  '</div>';
}

function rows(items) {
  return '<div class="tmc-list">' +
    items.map(item => '<div class="tmc-list-item"><div class="tmc-list-item-title">' + item.title + '</div><p class="tmc-list-item-desc">' + item.desc + '</p></div>').join('') +
  '</div>';
}

/* The in-page Menus pointer. Every service page links to Menus here and
   to Contact in the closing band. */
function menusBlock(label) {
  return block(label || '', 'Example menus', CONFIG.heroes.menus.intro,
    '<div class="tmc-block-cta"><a class="tmc-service-menu-link" href="/menus">See the menus <span class="tmc-arrow">&rarr;</span></a></div>');
}

function honeypot() {
  /* Off screen rather than display:none, so a bot still sees a fillable
     field, and out of the tab order so a person never lands on it. */
  return '<input class="tmc-hp" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">';
}

/* ============================================
   PAGES
   ============================================ */
const pages = {
  home() {
    const cards = CONFIG.services.map(s =>
      '<div class="tmc-service-block">' +
        '<h3 class="tmc-service-title">' + s.title + '</h3>' +
        '<p class="tmc-service-desc">' + s.desc + '</p>' +
        '<div class="tmc-service-styles">' + s.styles + '</div>' +
        '<a class="tmc-service-menu-link" href="' + pathFor(s.route) + '">' + s.title + ' <span class="tmc-arrow">&rarr;</span></a>' +
      '</div>').join('');
    return (
      '<section class="tmc-hero">' +
        /* The lockup IS the page heading. script.js splits the letters for
           the reveal; without it the word is simply there. */
        '<h1 class="tmc-brand-stack" aria-label="' + esc(B.name) + '">' +
          '<span class="tmc-brand-line" id="brand-line-1">TASTEMAKERS</span>' +
          '<span class="tmc-brand-sub-row" aria-hidden="true">' +
            '<span class="tmc-brand-rule"></span><span class="tmc-brand-sub">COLLECTIVE</span><span class="tmc-brand-rule"></span>' +
          '</span>' +
        '</h1>' +
        '<div class="tmc-hero-tagline">' + B.tagline + '</div>' +
        '<div class="tmc-hero-sub">' + B.city + '</div>' +
        '<div class="tmc-hero-dishes">' + CONFIG.heroDishes.join(' &nbsp;&middot;&nbsp; ') + '</div>' +
      '</section>' +
      '<section class="tmc-why">' +
        '<div class="tmc-why-label">Who we are</div>' +
        '<h2 class="tmc-why-headline">A Los Angeles catering and events company.</h2>' +
        '<p class="tmc-why-body">We cook for music festivals, corporate events, weddings and private dinners.</p>' +
        '<p class="tmc-why-body">Over a decade cooking for artist green rooms, VIP areas and staff at music festivals.</p>' +
      '</section>' +
      '<section class="tmc-section-header">' +
        '<div class="tmc-section-label">Services</div>' +
        '<h2 class="tmc-section-heading is-list">Catering Events Vending</h2>' +
      '</section>' +
      '<div class="tmc-services-wrap"><div class="tmc-services-grid">' + cards + '</div></div>' +
      '<section class="tmc-wwd-section">' +
        '<div class="tmc-wwd-header">' +
          '<div class="tmc-section-label">Our events</div>' +
          '<h2 class="tmc-section-heading" style="margin-top:18px">Pop-ups and supper clubs</h2>' +
          '<p class="tmc-wwd-intro">When we&rsquo;re not cooking for clients, we run our own events.</p>' +
        '</div>' +
        '<div class="tmc-wwd-grid">' +
          '<div class="tmc-wwd-tile"><div><div class="tmc-wwd-tile-label">One-night events</div><h3 class="tmc-wwd-tile-title">Pop-Ups</h3></div><div class="tmc-wwd-tile-desc">Themed one-night dinners and pop-ups. Fixed menu, one night only.</div></div>' +
          '<div class="tmc-wwd-tile"><div><div class="tmc-wwd-tile-label">Recurring dinners</div><h3 class="tmc-wwd-tile-title">Supper Clubs</h3></div><div class="tmc-wwd-tile-desc">Private dinners announced to our guest list.</div></div>' +
        '</div>' +
      '</section>' +
      menusBlock('Menus') +
      contactBand('home')
    );
  },

  menus() {
    const renderSection = section =>
      '<section class="tmc-menu-section" data-section="' + esc(section.section) + '">' +
        '<h2 class="tmc-menu-section-heading">' + section.section + '</h2>' +
        section.groups.map(group =>
          '<div class="tmc-menu-group">' +
            '<h3 class="tmc-menu-section-title">' + group.title + '</h3>' +
            '<div class="tmc-menu-items">' +
              group.items.map(item =>
                '<div class="tmc-menu-item">' +
                  '<div class="tmc-menu-item-name">' + item.name + '</div>' +
                  (item.detail ? '<div class="tmc-menu-item-desc">' + item.detail + '</div>' : '') +
                  (item.tags && item.tags.length ? '<div class="tmc-menu-tags">' + item.tags.map(t => '<span class="tmc-menu-tag">' + t + '</span>').join('') + '</div>' : '') +
                '</div>').join('') +
            '</div>' +
          '</div>').join('') +
      '</section>';
    const sections = CONFIG.menus.map(renderSection);
    /* Pop-ups lead in the HTML. script.js puts Private dining first when
       the visitor came from Weddings, Corporate or Events. The Book and
       Order pair sits under the first section and again at the end. */
    return pageHero('menus') +
      '<div class="tmc-menu-detail" id="tmc-menu-lead">' + sections[0] + '</div>' +
      '<section class="tmc-primary-cta-band">' +
        '<div class="tmc-primary-cta-inner">' +
          '<div class="tmc-primary-cta-label">' + CONFIG.cta.kicker + '</div>' +
          '<h2 class="tmc-primary-cta-headline">' + CONFIG.cta.headlines.menus + '</h2>' +
          ctaButtons('menus') +
        '</div>' +
      '</section>' +
      '<div class="tmc-menu-detail" id="tmc-menu-rest">' + sections.slice(1).join('') + '</div>' +
      '<section class="tmc-block"><div class="tmc-block-head"><h2 class="tmc-block-heading">Catering, events and vending</h2></div>' +
        '<div class="tmc-block-cta tmc-service-links">' +
          CONFIG.serviceList.map(s => '<a class="tmc-service-menu-link" href="' + pathFor(s.route) + '">' + s.name + ' <span class="tmc-arrow">&rarr;</span></a>').join('') +
        '</div>' +
      '</section>' +
      contactBand('menus');
  },

  order() {
    return pageHero('order') +
      '<section class="tmc-body">' +
        '<form class="tmc-form" id="tmc-order-form" autocomplete="on">' +
          '<input type="hidden" name="form_source" value="order">' + honeypot() +
          '<div class="tmc-form-step"><h3>Delivery</h3>' +
            '<div class="tmc-form-field"><label for="o-date">Date</label><input id="o-date" name="date" type="date" required></div>' +
            '<div class="tmc-form-field"><label for="o-window">Delivery window</label><select id="o-window" name="delivery_window" required>' + options(CONFIG.order.deliveryWindows) + '</select></div>' +
            '<div class="tmc-form-field"><label for="o-address">Delivery address or area</label><input id="o-address" name="address" type="text" required></div>' +
            '<div class="tmc-form-field"><label for="o-guests">Guest count</label><select id="o-guests" name="guests" required>' + options(CONFIG.order.guestCounts) + '</select></div>' +
          '</div>' +
          '<div class="tmc-form-step"><h3>Food</h3>' +
            '<div class="tmc-form-field"><label for="o-dietary">Dietary needs and allergies</label><textarea id="o-dietary" name="dietary" rows="3"></textarea></div>' +
            '<div class="tmc-form-field"><label for="o-notes">Notes</label><textarea id="o-notes" name="notes" rows="3"></textarea></div>' +
          '</div>' +
          '<div class="tmc-form-step"><h3>Contact</h3>' +
            '<div class="tmc-form-field"><label for="o-name">Name</label><input id="o-name" name="name" type="text" required></div>' +
            '<div class="tmc-form-field"><label for="o-email">Email</label><input id="o-email" name="email" type="email" required></div>' +
            '<div class="tmc-form-field"><label for="o-phone">Phone</label><input id="o-phone" name="phone" type="tel"></div>' +
            '<p class="tmc-form-status" role="alert" aria-live="assertive" hidden></p>' +
            '<button type="submit" class="tmc-form-submit">Send order request</button>' +
          '</div>' +
        '</form>' +
      '</section>' +
      menusBlock() +
      contactBand('order');
  },

  weddings() {
    return pageHero('weddings') + copySlot('weddings') +
      block('', 'How it works', '', tiles(CONFIG.process, 4)) +
      block('', 'Service styles', '', tiles(CONFIG.serviceStyles, 4)) +
      block('', 'What is included', '', tiles(CONFIG.included, 3), '<p class="tmc-block-note">' + CONFIG.includedNote + '</p>') +
      block('', 'Dietary needs', CONFIG.dietaryNote) +
      menusBlock() + contactBand('weddings');
  },

  corporate() {
    return pageHero('corporate') + copySlot('corporate') +
      block('', 'What we cater', '', tiles(CONFIG.corporateTypes, 4)) +
      block('', 'How it works', '', tiles(CONFIG.process, 4)) +
      block('', 'Service styles', '', tiles(CONFIG.corporateStyles, 5)) +
      block('', 'What is included', '', tiles(CONFIG.included, 3), '<p class="tmc-block-note">' + CONFIG.includedNote + '</p>') +
      block('', 'Dietary needs', CONFIG.dietaryNote) +
      menusBlock() + contactBand('corporate');
  },

  events() {
    return pageHero('events') + copySlot('events') +
      block('', 'Event types', '', tiles(CONFIG.eventTypes, 2)) +
      block('', 'How it works', '', tiles(CONFIG.process, 4)) +
      block('', 'Service styles', '', tiles(CONFIG.serviceStyles, 4)) +
      block('', 'What is included', '', tiles(CONFIG.included, 3), '<p class="tmc-block-note">' + CONFIG.includedNote + '</p>') +
      block('', 'Dietary needs', CONFIG.dietaryNote) +
      menusBlock() + contactBand('events');
  },

  vending() {
    return pageHero('vending') + copySlot('vending') +
      block('', 'What we bring', '', tiles(CONFIG.vendingBrings, 4)) +
      block('', 'Ways we work', '', tiles(CONFIG.vendingWays, 3)) +
      block('', 'Past events', '', rows(CONFIG.vendingPast)) +
      menusBlock() + contactBand('vending');
  },

  about() {
    return pageHero('about') +
      block('', 'What we do', '', rows(CONFIG.aboutWhatWeDo)) +
      block('', 'Where we work', CONFIG.aboutWhereWeWork) +
      contactBand('about');
  },

  contact() {
    const f = CONFIG.contactForm;
    /* Contact leads in the HTML. When a Book button carried ?type=, script.js
       moves The event first, because that visitor's hard question is already
       answered. Without JavaScript the plain order stands. */
    const contactStep =
      '<div class="tmc-form-step" data-step="contact"><h3>Contact</h3>' +
        '<div class="tmc-form-field"><label for="f-name">Name</label><input id="f-name" name="name" type="text" required></div>' +
        '<div class="tmc-form-field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" required></div>' +
        '<div class="tmc-form-field"><label for="f-phone">Phone</label><input id="f-phone" name="phone" type="tel"></div>' +
        '<div class="tmc-form-field"><label for="f-notes">Additional notes</label><textarea id="f-notes" name="notes" rows="3"></textarea></div>' +
      '</div>';
    const eventStep =
      '<div class="tmc-form-step" data-step="event"><h3>The event</h3>' +
        '<div class="tmc-form-field"><label for="f-event-type">Event type</label><select id="f-event-type" name="event_type" required>' + options(f.eventTypes) + '</select></div>' +
        '<div class="tmc-form-field"><label for="f-style">Service style</label><select id="f-style" name="service_style" required>' + options(f.serviceStyles) + '</select></div>' +
        '<div class="tmc-vending-only" id="f-vending" hidden>' +
          '<div class="tmc-form-field"><label for="f-attendance">Expected attendance</label><input id="f-attendance" name="attendance" type="text" disabled></div>' +
          '<div class="tmc-form-field"><label for="f-hours">Load-in and service hours</label><input id="f-hours" name="service_hours" type="text" disabled></div>' +
          '<div class="tmc-form-field"><label for="f-power">Power and water on site</label><select id="f-power" name="power_water" disabled>' + options(f.powerWater) + '</select></div>' +
        '</div>' +
        '<div class="tmc-form-field"><label for="f-date">Date</label><input id="f-date" name="date" type="text" placeholder="Date or flexible"></div>' +
        '<div class="tmc-form-field"><label for="f-location">Location</label><input id="f-location" name="location" type="text" placeholder="Venue, neighborhood, or TBD"></div>' +
        '<div class="tmc-form-field"><label for="f-guests">Guest count</label><select id="f-guests" name="guests">' + options(f.guestCounts) + '</select></div>' +
      '</div>';
    const detailsStep =
      '<div class="tmc-form-step" data-step="details"><h3>Details</h3>' +
        '<div class="tmc-form-field"><label for="f-dietary">Dietary needs and allergies</label><textarea id="f-dietary" name="dietary" rows="3"></textarea></div>' +
        '<div class="tmc-form-field"><label for="f-budget">Budget (optional)</label><input id="f-budget" name="budget" type="text"></div>' +
        '<p class="tmc-form-status" role="alert" aria-live="assertive" hidden></p>' +
        '<button type="submit" class="tmc-form-submit">Send inquiry</button>' +
      '</div>';
    return pageHero('contact') +
      '<section class="tmc-contact-block"><div class="tmc-contact-grid">' +
        '<div class="tmc-contact-card"><div class="tmc-contact-label">Email</div><p class="tmc-contact-value"><a href="mailto:' + B.email + '">' + B.email.replace('@', '<wbr>@') + '</a></p></div>' +
        '<div class="tmc-contact-card"><div class="tmc-contact-label">Call or text</div><p class="tmc-contact-value"><a href="' + B.phoneHref + '">' + B.phone + '</a></p></div>' +
      '</div></section>' +
      '<section class="tmc-body">' +
        '<form class="tmc-form" id="tmc-inquiry-form" autocomplete="on">' +
          '<input type="hidden" name="form_source" value="contact">' + honeypot() +
          contactStep + eventStep + detailsStep +
        '</form>' +
      '</section>';
  },

  reviews() {
    const r = CONFIG.reviewForm;
    const off = r.enabled ? '' : ' disabled';
    return pageHero('reviews') +
      '<section class="tmc-body">' +
        (r.enabled ? '' : '<p class="tmc-form-note">The review form is not open yet.</p>') +
        '<form class="tmc-form" id="tmc-review-form" autocomplete="on" data-enabled="' + (r.enabled ? 'true' : 'false') + '">' +
          '<input type="hidden" name="form_source" value="review">' + honeypot() +
          '<fieldset class="tmc-fieldset"' + off + '>' +
            '<div class="tmc-form-step"><h3>Your review</h3>' +
              '<div class="tmc-form-field"><label for="r-name">Name</label><input id="r-name" name="name" type="text" required></div>' +
              '<div class="tmc-form-field"><label for="r-email">Email</label><input id="r-email" name="email" type="email" required></div>' +
              '<div class="tmc-form-field"><label for="r-event">Your event</label><input id="r-event" name="event" type="text"></div>' +
              '<div class="tmc-form-field"><label for="r-rating">Rating</label><select id="r-rating" name="rating" required>' + options(r.ratings) + '</select></div>' +
              '<div class="tmc-form-field"><label for="r-review">Your review</label><textarea id="r-review" name="review" rows="5" required></textarea></div>' +
              '<div class="tmc-form-field tmc-form-check"><input id="r-consent" name="consent" type="checkbox" value="yes"><label for="r-consent">OK to publish this review with my first name</label></div>' +
              '<p class="tmc-form-status" role="alert" aria-live="assertive" hidden></p>' +
              '<button type="submit" class="tmc-form-submit"' + off + '>Send review</button>' +
            '</div>' +
          '</fieldset>' +
        '</form>' +
      '</section>' +
      contactBand('reviews');
  },

  notFound() {
    return (
      '<section class="tmc-page-hero tmc-page-hero-notFound">' +
        '<div class="tmc-page-hero-inner">' +
          '<h1 class="tmc-page-title">' + h1For('notFound') + '</h1>' +
          '<p class="tmc-page-intro">Call or text <a href="' + B.phoneHref + '">' + B.phone + '</a> or email <a href="mailto:' + B.email + '">' + B.email + '</a>.</p>' +
          '<div class="tmc-cta-actions"><a class="tmc-btn tmc-btn-primary" href="/">Home <span class="tmc-arrow">&rarr;</span></a><a class="tmc-btn tmc-btn-secondary" href="/menus">Menus <span class="tmc-arrow">&rarr;</span></a></div>' +
        '</div>' +
      '</section>'
    );
  }
};

/* ============================================
   THE DOCUMENT
   ============================================ */
function document_(page, assets) {
  const route = page.route;
  const body = pages[route]();
  return '<!DOCTYPE html>\n<html lang="en">\n<head>\n' + head(page, assets) + '\n</head>\n<body>\n' +
    '<div class="tmc" data-route="' + route + '">\n' +
    '  <a class="tmc-skip-link" href="#tmc-main">Skip to content</a>\n' +
    nav(route) + '\n' +
    '  <main id="tmc-main" tabindex="-1">\n' + body + '\n' + trustStrip() + '\n  </main>\n' +
    footer() + '\n' +
    '</div>\n' +
    '<!-- Vercel Web Analytics. Deferred, so it never blocks rendering. The path\n' +
    '     is served by Vercel only, so on localhost it simply 404s and nothing\n' +
    '     runs. Reporting starts once Analytics is enabled in the dashboard. -->\n' +
    '<script defer src="/_vercel/insights/script.js"></script>\n' +
    '</body>\n</html>\n';
}

/* ============================================
   TEXT, for llms.txt and the no-JavaScript check
   ============================================ */
function textOf(html) {
  return plain(html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ').replace(/<\/(p|div|h[1-6]|li|section|tr)>/gi, '$&\n'));
}

function llmsTxt() {
  const lines = [];
  lines.push('# ' + B.name);
  lines.push('');
  lines.push('> ' + B.tagline);
  lines.push('');
  lines.push(B.name + ' is a Los Angeles catering and events company. We cook for music festivals, corporate events, weddings and private dinners. Over a decade cooking for artist green rooms, VIP areas and staff at music festivals.');
  lines.push('');
  lines.push('## What we do');
  lines.push('');
  CONFIG.serviceList.forEach(s => lines.push('- ' + s.name + ': ' + s.desc + ' ' + absolute(pathFor(s.route))));
  lines.push('');
  lines.push('## Contact');
  lines.push('');
  lines.push('- Phone: ' + B.phone);
  lines.push('- Email: ' + B.email);
  lines.push('- Service area: ' + B.city);
  lines.push('');
  lines.push('## Pages');
  lines.push('');
  PAGES.filter(p => p.indexable !== false).forEach(p => lines.push('- [' + plain(h1For(p.route)) + '](' + absolute(p.path) + '): ' + descriptionFor(p.route)));
  lines.push('- [' + CARD.title + '](' + absolute(CARD.path) + '): Phone, text, email and a vCard to save.');
  lines.push('');
  lines.push('## Permits and insurance');
  lines.push('');
  CONFIG.trust.forEach(t => lines.push('- ' + t));
  lines.push('');
  lines.push('## Full text');
  lines.push('');
  lines.push('- ' + SITE + '/llms-full.txt');
  return lines.join('\n') + '\n';
}

function llmsFullTxt(builtPages) {
  const out = ['# ' + B.name + ': full site text', '', 'Generated by the build from the published pages. ' + B.tagline, ''];
  builtPages.forEach(p => {
    out.push('## ' + plain(h1For(p.route)) + ' (' + absolute(p.path) + ')');
    out.push('');
    out.push(p.text);
    out.push('');
  });
  return out.join('\n') + '\n';
}

module.exports = { PAGES, CARD, pathFor, absolute, plain, esc, h1For, titleFor, descriptionFor, jsonLd, document: document_, textOf, llmsTxt, llmsFullTxt };
