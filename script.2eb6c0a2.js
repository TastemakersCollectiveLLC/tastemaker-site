/* ============================================
   TASTEMAKERS COLLECTIVE
   Enhancement script

   Every page is complete HTML before this runs. This file only adds what
   needs a running browser: the phone menu, form submission, the contact
   prefill, the sticky Book bar, the hero glow and the typographic motion.
   Nothing here creates content, and with it absent every page still
   reads, links and posts.

   Copy and settings live in config.js, loaded before this as window.TMC.
   ============================================ */
(function () {
  'use strict';

  const TMC = window.TMC;
  if (!TMC) return;
  const CONFIG = TMC.CONFIG;
  const FORM_ENDPOINT = TMC.FORM_ENDPOINT;
  const B = CONFIG.business;

  const shell = document.querySelector('.tmc');
  const main = document.getElementById('tmc-main');
  const route = shell ? shell.getAttribute('data-route') : '';
  const mobileMenu = document.getElementById('tmc-mobile-menu');
  const mobileToggle = document.getElementById('tmc-mobile-toggle');

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* === NAV === */
  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
  }
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function () {
      const open = mobileMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(open));
    });
    mobileMenu.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) closeMobileMenu();
    });
  }

  /* The sticky header height drives both the hero offset and the top of the
     mobile menu. Measured rather than hardcoded, because the lockup and the
     nav button both change height once the webfonts land. */
  function syncNavHeight() {
    const nav = document.querySelector('.tmc-nav');
    if (!nav) return;
    document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
  }
  window.addEventListener('resize', syncNavHeight);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncNavHeight);
  syncNavHeight();

  /* The skip link is a plain in-page anchor now. Moving focus explicitly
     still helps browsers that scroll without focusing. */
  const skipLink = document.querySelector('.tmc-skip-link');
  if (skipLink && main) {
    skipLink.addEventListener('click', function (e) {
      e.preventDefault();
      main.focus();
    });
  }

  /* === QUERY === */
  function query() {
    const params = {};
    window.location.search.replace(/^\?/, '').split('&').forEach(function (pair) {
      if (!pair) return;
      const eq = pair.indexOf('=');
      const key = decodeURIComponent(eq === -1 ? pair : pair.slice(0, eq));
      const val = eq === -1 ? '' : decodeURIComponent(pair.slice(eq + 1));
      if (key) params[key] = val;
    });
    return params;
  }

  /* === BRAND ANIMATION === */
  function animateBrand() {
    const line1 = document.getElementById('brand-line-1');
    if (!line1 || line1.children.length) return;
    const word = line1.textContent.trim();
    line1.innerHTML = word.split('').map(function (c, i) {
      return '<span style="animation-delay:' + (i * 0.05) + 's">' + c + '</span>';
    }).join('');
  }

  /* === CONTACT FORM STATE ===
     The vending questions only make sense for a vending enquiry, so they
     are hidden and disabled the rest of the time. Disabled means they are
     never posted, rather than posted empty. */
  function syncVendingFields() {
    const type = document.getElementById('f-event-type');
    const wrap = document.getElementById('f-vending');
    if (!type || !wrap) return;
    const show = type.value === CONFIG.contactForm.vendingType;
    wrap.hidden = !show;
    wrap.querySelectorAll('input, select').forEach(function (el) { el.disabled = !show; });
  }

  /* Preselect from the query a Book button carried, and when the event
     type is recognised put The event step first, since that visitor's hard
     question is already answered. Anything unrecognised is ignored and the
     form stays in its plain order. */
  function applyPrefill(params) {
    const form = document.getElementById('tmc-inquiry-form');
    if (!form) return;
    const cf = CONFIG.contactForm;
    const pick = function (id, wanted) {
      if (!wanted) return false;
      const el = document.getElementById(id);
      if (!el) return false;
      for (let i = 0; i < el.options.length; i++) {
        if (el.options[i].textContent === wanted) { el.selectedIndex = i; return true; }
      }
      return false;
    };
    const typed = pick('f-event-type', cf.typeFromQuery[params.type]);
    pick('f-style', cf.styleFromQuery[params.style]);
    if (typed) {
      const contactStep = form.querySelector('[data-step="contact"]');
      const detailsStep = form.querySelector('[data-step="details"]');
      const eventStep = form.querySelector('[data-step="event"]');
      if (contactStep && detailsStep && eventStep) {
        /* event, details, contact: the status line and the button move to
           the step that is now last */
        form.insertBefore(eventStep, contactStep);
        form.insertBefore(detailsStep, contactStep);
        const status = form.querySelector('.tmc-form-status');
        const button = form.querySelector('button[type="submit"]');
        if (status) contactStep.appendChild(status);
        if (button) contactStep.appendChild(button);
      }
    }
    syncVendingFields();
  }

  /* The order date picker cannot offer a date inside the lead time. Set on
     the input itself so the browser's own calendar greys the days out. */
  function applyLeadTime() {
    const input = document.getElementById('o-date');
    if (!input) return;
    const earliest = new Date(Date.now() + CONFIG.order.leadTimeHours * 3600 * 1000);
    input.min = earliest.getFullYear() + '-' +
      ('0' + (earliest.getMonth() + 1)).slice(-2) + '-' +
      ('0' + earliest.getDate()).slice(-2);
    input.value = '';
  }

  /* === MENUS ===
     A couple from Weddings or a buyer from Corporate or Events wants the
     private dining menus first, not the taco pop-ups. The HTML leads with
     pop-ups; when the referrer is one of those three pages the two
     sections swap. */
  function orderMenus() {
    const lead = document.getElementById('tmc-menu-lead');
    const rest = document.getElementById('tmc-menu-rest');
    if (!lead || !rest) return;
    let from = '';
    try { from = new URL(document.referrer).pathname.replace(/\/$/, ''); } catch (ignore) {}
    if (['/weddings', '/corporate', '/events'].indexOf(from) === -1) return;
    const priv = rest.querySelector('[data-section="Private dining"]');
    const pop = lead.querySelector('[data-section="Pop-up menus"]');
    if (!priv || !pop) return;
    lead.appendChild(priv);
    rest.insertBefore(pop, rest.firstChild);
  }

  /* === STICKY ACTION BAR ===
     Mobile only, and only on the pages where a visitor is deciding. It
     appears once the hero is behind them and hides again as the footer
     arrives, so it never sits over the footer. */
  function setupStickyBar() {
    if (CONFIG.stickyRoutes.indexOf(route) === -1) return;
    const cfg = CONFIG.cta.buttons[route] || {};
    let q = '';
    if (cfg.type) q += 'type=' + cfg.type;
    if (cfg.style) q += (q ? '&' : '') + 'style=' + cfg.style;
    const bar = document.createElement('div');
    bar.id = 'tmc-sticky-bar';
    bar.className = 'tmc-sticky-bar';
    bar.innerHTML =
      '<a class="tmc-btn tmc-btn-primary" href="/contact' + (q ? '?' + q : '') + '">Book</a>' +
      (CONFIG.stickyBookOnly.indexOf(route) === -1
        ? '<a class="tmc-btn tmc-btn-secondary" href="/order">Order</a>'
        : '');
    document.body.appendChild(bar);

    const hero = document.querySelector('.tmc-page-hero');
    const foot = document.querySelector('.tmc-footer');
    const update = function () {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const heroR = hero ? hero.getBoundingClientRect() : null;
      const footR = foot ? foot.getBoundingClientRect() : null;
      const pastHero = !heroR || heroR.bottom <= 0;
      const footerInView = !!footR && footR.top < vh;
      bar.classList.toggle('is-shown', pastHero && !footerInView);
    };
    const staticUpdate = function () {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const footR = foot ? foot.getBoundingClientRect() : null;
      bar.classList.toggle('is-shown', !(footR && footR.top < vh));
    };
    const handler = prefersReducedMotion() ? staticUpdate : update;
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
  }

  /* === HERO GLOW ===
     Home only. The wash is a CSS pseudo-element; all this does is write
     --hero-glow so it fades out as the hero leaves. */
  function setupHeroGlow() {
    const hero = document.querySelector('.tmc-hero');
    if (!hero) return;
    if (prefersReducedMotion()) { hero.style.setProperty('--hero-glow', '1'); return; }
    const update = function () {
      const r = hero.getBoundingClientRect();
      const travel = (r.height || 1) * 0.7;
      let t = 1 - (-r.top) / travel;
      t = t < 0 ? 0 : (t > 1 ? 1 : t);
      hero.style.setProperty('--hero-glow', t.toFixed(3));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  /* === TYPOGRAPHIC MOTION ===
     Sections and cards fade up as they enter the viewport, once each. The
     hidden state is a class this code adds, never the stylesheet's own, so
     with JavaScript off, IntersectionObserver missing, or reduced motion,
     every element is simply visible from the start. */
  const RULE_TARGETS = '.tmc-block, .tmc-primary-cta-band';
  const GROUP_TARGETS = ['.tmc-why', '.tmc-section-header', '.tmc-services-wrap',
    '.tmc-wwd-section', '.tmc-block', '.tmc-primary-cta-band', '.tmc-menu-section',
    '.tmc-body', '.tmc-contact-block', '.tmc-page-hero', '.tmc-trust'].join(',');
  const LEFTOVER_TARGETS = ['.tmc-block-cta', '.tmc-service-menu-link',
    '.tmc-cta-actions', '.tmc-menu-section-heading', '.tmc-page-rule', '.tmc-trust-list'].join(',');
  const KICKER_TARGETS = '.tmc-why-label, .tmc-section-label, .tmc-page-eyebrow,' +
    '.tmc-wwd-tile-label, .tmc-block-label, .tmc-primary-cta-label';
  const HEADING_TARGETS = 'h1, h2, .tmc-menu-section-title';
  const CARD_TARGETS = '.tmc-service-block, .tmc-wwd-tile, .tmc-block-item,' +
    '.tmc-list-item, .tmc-contact-card, .tmc-form-step, .tmc-menu-back-card';

  /* Splits a heading into one masked wrapper per rendered line. Anything
     with element children is left alone, which keeps the wordmark out. */
  function splitLines(el) {
    if (el.children.length || el.dataset.tmcSplit) return 0;
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    if (!text) return 0;
    const words = text.split(' ');
    el.textContent = '';
    words.forEach(function (w, i) {
      const sp = document.createElement('span');
      sp.textContent = (i ? ' ' : '') + w;
      el.appendChild(sp);
    });
    const rows = [];
    [].forEach.call(el.children, function (sp) {
      const top = sp.offsetTop;
      const row = rows[rows.length - 1];
      if (row && Math.abs(row.top - top) < 4) row.words.push(sp.textContent);
      else rows.push({ top: top, words: [sp.textContent] });
    });
    el.textContent = '';
    rows.forEach(function (row) {
      const line = document.createElement('span');
      line.className = 'tmc-anim-line is-pre';
      const inner = document.createElement('span');
      inner.textContent = row.words.join('');
      line.appendChild(inner);
      el.appendChild(line);
    });
    el.dataset.tmcSplit = '1';
    return rows.length;
  }

  function setupReveal() {
    if (!main || !('IntersectionObserver' in window) || prefersReducedMotion()) return;

    const rules = [].slice.call(main.querySelectorAll(RULE_TARGETS));
    rules.forEach(function (el) { el.classList.add('tmc-rule'); });

    const groups = [].slice.call(main.querySelectorAll(GROUP_TARGETS));
    groups.forEach(function (group) {
      let base = 0;
      [].forEach.call(group.querySelectorAll(KICKER_TARGETS), function (k) {
        k.classList.add('tmc-anim-kicker', 'is-pre');
        k.style.setProperty('--d', '0ms');
        base = 60;
      });
      [].forEach.call(group.querySelectorAll(HEADING_TARGETS), function (h) {
        if (h.closest('.tmc-anim-card')) return;
        const n = splitLines(h);
        if (!n) return;
        [].forEach.call(h.children, function (line, i) {
          line.firstChild.style.setProperty('--d', (base + i * 80) + 'ms');
        });
        base += (n - 1) * 80 + 80;
      });
      let bi = 0;
      [].forEach.call(group.querySelectorAll('p, .tmc-block-note, .tmc-list-item-desc,' +
        '.tmc-service-styles, .tmc-page-styles, .tmc-menu-item-desc'), function (b) {
        if (b.closest('.tmc-anim-card') || b.closest('.tmc-menu-item')) return;
        b.classList.add('tmc-anim-fade', 'is-pre');
        b.style.setProperty('--d', (base + bi * 60) + 'ms');
        bi++;
      });
      let ci = 0;
      [].forEach.call(group.querySelectorAll(CARD_TARGETS), function (c) {
        c.classList.add('tmc-anim-card', 'is-pre');
        c.style.setProperty('--d', (base + Math.min(ci, 5) * 90) + 'ms');
        if (!c.querySelector('.tmc-sheen')) {
          const sh = document.createElement('span');
          sh.className = 'tmc-sheen';
          sh.setAttribute('aria-hidden', 'true');
          c.appendChild(sh);
        }
        ci++;
      });
      let di = 0;
      [].forEach.call(group.querySelectorAll('.tmc-menu-item'), function (dish) {
        dish.classList.add('tmc-anim-dish', 'is-pre');
        dish.style.setProperty('--d', (base + Math.min(di, 14) * 40) + 'ms');
        di++;
      });
      [].forEach.call(group.querySelectorAll(LEFTOVER_TARGETS), function (el) {
        if (el.classList.contains('tmc-anim-kicker') || el.classList.contains('tmc-anim-fade') ||
            el.classList.contains('tmc-anim-card') || el.classList.contains('tmc-anim-dish') ||
            el.closest('.tmc-anim-card') || el.querySelector('.tmc-anim-line')) return;
        el.classList.add('tmc-reveal', 'is-pre');
        el.style.setProperty('--d', base + 'ms');
      });
    });

    const all = groups.concat(rules);
    const play = function (group) {
      group.classList.add('is-in');
      [].forEach.call(group.querySelectorAll('.is-pre'), function (el) { el.classList.remove('is-pre'); });
      group.classList.remove('is-pre');
      const lines = group.querySelectorAll('.tmc-anim-line');
      if (lines.length) {
        setTimeout(function () { [].forEach.call(lines, function (l) { l.classList.add('is-done'); }); }, 1400);
      }
    };

    let revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        play(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -6% 0px' });
    all.forEach(function (el) { revealObserver.observe(el); });

    /* Last line of defence: nothing stays marked pre for more than three
       seconds, and the swap suspends transitions so every element lands on
       its final value in one step. */
    const ANIMATED = '.tmc-anim-fade, .tmc-anim-dish, .tmc-anim-kicker, .tmc-reveal,' +
      '.tmc-anim-card, .tmc-anim-card > *, .tmc-anim-line > span';
    setTimeout(function () {
      const parts = [].slice.call(main.querySelectorAll(ANIMATED));
      const pre = [].slice.call(main.querySelectorAll('.is-pre'));
      if (!parts.length && !pre.length) return;
      parts.forEach(function (el) { el.style.transition = 'none'; });
      pre.forEach(function (el) { el.classList.remove('is-pre'); });
      void main.offsetWidth;
      setTimeout(function () { parts.forEach(function (el) { el.style.transition = ''; }); }, 60);
    }, 3000);

    /* Failsafe, measured rather than assumed: if a group sits inside the
       viewport and is still hidden, the observer is not doing its job here,
       so show everything. Re-checked on scroll until proven either way. */
    let verified = false;
    const revealAll = function () {
      if (revealObserver) { revealObserver.disconnect(); revealObserver = null; }
      all.forEach(play);
      window.removeEventListener('scroll', verify);
    };
    const verify = function () {
      if (verified) return;
      if (all.some(function (el) { return el.classList.contains('is-in'); })) {
        verified = true;
        window.removeEventListener('scroll', verify);
        return;
      }
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const stuck = all.some(function (el) {
        const r = el.getBoundingClientRect();
        return r.height > 0 && r.top < vh && r.bottom > 0;
      });
      if (stuck) revealAll();
    };
    setTimeout(verify, 600);
    window.addEventListener('scroll', verify, { passive: true });
  }

  /* The page fades up once on arrival. */
  function pageIn() {
    if (!main || prefersReducedMotion()) return;
    main.classList.add('is-entering');
    setTimeout(function () { main.classList.remove('is-entering'); }, 480);
  }

  /* === FORMS ===
     One shared submit path for every form on the site. Everything the
     request needs travels in the form itself, including the hidden
     form_source, so this function never needs a per-form field list. */
  const MAILTO_SUBJECTS = {
    contact: 'New inquiry from tastemakerscollective.us',
    order: 'New drop-off order request',
    review: 'Review for Tastemakers Collective'
  };

  function formToObject(form) {
    const data = {};
    new FormData(form).forEach(function (value, key) {
      data[key] = typeof value === 'string' ? value : String(value);
    });
    return data;
  }

  function mailtoFallback(form) {
    const fd = new FormData(form);
    const lines = [];
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      if (!el.name || el.type === 'hidden' || el.disabled) return;
      if (el.classList.contains('tmc-hp')) return;
      const label = el.id ? form.querySelector('label[for="' + el.id + '"]') : null;
      lines.push((label ? label.textContent : el.name) + ': ' + (fd.get(el.name) || ''));
    });
    const source = fd.get('form_source');
    return 'mailto:' + B.email +
      '?subject=' + encodeURIComponent(MAILTO_SUBJECTS[source] || 'Website inquiry') +
      '&body=' + encodeURIComponent(lines.join('\n'));
  }

  function handleFormSubmit(form) {
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('.tmc-form-status');
    const buttonLabel = button ? button.textContent : '';
    if (button) { button.disabled = true; button.textContent = 'Sending'; }
    if (status) { status.hidden = true; status.textContent = ''; }

    /* JSON as a plain string and no Content-Type header: see FORM_ENDPOINT
       in config.js. Success needs a reply that parses and says ok. */
    const payload = JSON.stringify(formToObject(form));
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    let timer = null;
    const timedOut = new Promise(function (ignore, reject) {
      timer = setTimeout(function () {
        if (controller) controller.abort();
        reject(new Error('No response within 15 seconds'));
      }, 15000);
    });
    const request = fetch(FORM_ENDPOINT, { method: 'POST', body: payload, signal: controller ? controller.signal : undefined });
    request.catch(function () {});

    Promise.race([request, timedOut])
      .then(function (response) {
        if (!response.ok) throw new Error('Form endpoint returned ' + response.status);
        return response.json();
      })
      .then(function (reply) {
        if (!reply || reply.ok !== true) throw new Error(reply && reply.error ? reply.error : 'Form endpoint did not confirm');
        track('form_submit', { form_source: formToObject(form).form_source || '' });
        const host = form.parentNode;
        host.innerHTML =
          '<div class="tmc-form-success" role="status" aria-live="polite" tabindex="-1">' +
            '<h3>Thanks. We&rsquo;ll get back to you soon.</h3>' +
          '</div>';
        const done = host.querySelector('.tmc-form-success');
        if (done) done.focus({ preventScroll: true });
      })
      .catch(function () {
        if (button) { button.disabled = false; button.textContent = buttonLabel; }
        if (status) {
          status.hidden = false;
          status.innerHTML =
            'That did not send. Email us at <a href="mailto:' + B.email + '">' + B.email + '</a> ' +
            'or <a href="' + mailtoFallback(form) + '">open an email with your answers filled in</a>.';
        }
      })
      .then(function () { clearTimeout(timer); });
  }

  document.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'f-event-type') syncVendingFields();
  });
  document.addEventListener('submit', function (e) {
    const form = e.target;
    if (!form || !form.classList.contains('tmc-form')) return;
    e.preventDefault();
    /* A disabled form (the review form until its handler is live) never posts. */
    if (form.getAttribute('data-enabled') === 'false') return;
    handleFormSubmit(form);
  });

  /* === MEASUREMENT, gated ===
     While GA4_ID and META_PIXEL_ID are empty nothing loads and track() is
     a no-op. The event names are wired now so that filling in an id is
     the whole change. */
  function track(name, params) {
    if (TMC.GA4_ID && typeof window.gtag === 'function') window.gtag('event', name, params || {});
    if (TMC.META_PIXEL_ID && typeof window.fbq === 'function') window.fbq('trackCustom', name, params || {});
  }
  function loadAnalytics() {
    if (TMC.GA4_ID) {
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(TMC.GA4_ID);
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', TMC.GA4_ID);
    }
    if (TMC.META_PIXEL_ID) {
      /* the standard pixel bootstrap, loaded only when an id exists */
      (function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
        t = b.createElement(e); t.async = true; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', TMC.META_PIXEL_ID);
      window.fbq('track', 'PageView');
    }
  }

  /* === INIT === */
  function init() {
    loadAnalytics();
    pageIn();
    applyLeadTime();
    applyPrefill(query());
    orderMenus();
    setupStickyBar();
    setupHeroGlow();
    setupReveal();
    if (route === 'home') setTimeout(animateBrand, 50);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
