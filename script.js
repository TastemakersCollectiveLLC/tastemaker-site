/* ============================================
   TASTEMAKERS COLLECTIVE
   Client-side router and page templates
   ============================================ */

(function () {
  'use strict';

  /* ============================================
     CONFIG
     Every editable piece of the site lives in this one object: business
     details, the nav, retired routes, page copy, the services cards, the
     closing CTA and the footer. Change copy here and nowhere else.
     ============================================ */
  const CONFIG = {
    business: {
      name: 'Tastemakers Collective',
      legalName: 'Tastemakers Collective LLC',
      city: 'Los Angeles',
      tagline: 'Fine dining for all diets.',
      phone: '279-271-1170',
      phoneHref: 'tel:+12792711170',
      smsHref: 'sms:+12792711170',
      email: 'hello@tastemakerscollective.us'
    },

    /* Formspree. Notifications land in hello@tastemakerscollective.us.
       Posted to with a plain fetch, no Formspree script library. */
    formEndpoint: 'https://formspree.io/f/xkjgorkq',

    /* Main navigation, in display order. One entry may carry cta: true,
       which renders it as the outlined button at the end of the bar. */
    nav: [
      { route: 'home', label: 'Home' },
      { route: 'order', label: 'Order' },
      { route: 'weddings', label: 'Weddings' },
      { route: 'events', label: 'Events' },
      { route: 'vending', label: 'Vending' },
      { route: 'about', label: 'About' },
      { route: 'contact', label: 'Contact', cta: true }
    ],

    /* Retired routes. Printed cards, old links and search results still point
       at these, so each one forwards to its closest current page. */
    redirects: {
      inquire: 'contact',
      'menu-catering': 'events',
      'menu-vending': 'vending',
      'menu-private-chef': 'contact'
    },

    titles: {
      home: 'Tastemakers Collective | Catering and Events in Los Angeles',
      order: 'Drop-off Catering | Tastemakers Collective',
      weddings: 'Wedding Catering | Tastemakers Collective',
      events: 'Event Catering | Tastemakers Collective',
      vending: 'Festival and Event Vending | Tastemakers Collective',
      about: 'About | Tastemakers Collective',
      contact: 'Contact | Tastemakers Collective'
    },

    /* Interior page heroes: eyebrow, headline, one supporting line. */
    heroes: {
      order: {
        eyebrow: 'Order',
        title: 'Drop-off catering',
        intro: 'Drop-off catering for offices and gatherings.'
      },
      weddings: {
        eyebrow: 'Weddings',
        title: 'Wedding catering',
        intro: 'Custom menus and full service for your wedding day.'
      },
      events: {
        eyebrow: 'Events',
        title: 'Event catering',
        intro: 'Corporate events, private parties and celebrations.'
      },
      vending: {
        eyebrow: 'Vending',
        title: 'Festival vending and event hospitality',
        intro: 'Food vending, staff meals and artist hospitality for festivals and events.'
      },
      about: {
        eyebrow: 'About',
        title: 'About Tastemakers Collective',
        intro: 'Tastemakers Collective is a Los Angeles catering and events company. Fine dining for all diets.'
      },
      contact: {
        eyebrow: 'Contact',
        title: 'Contact us',
        intro: 'Tell us about your event and we&rsquo;ll get back to you.'
      }
    },

    /* Home services cards. */
    services: [
      {
        number: '01',
        route: 'weddings',
        title: 'Weddings',
        desc: 'Custom menus and full service for your wedding day. We design the menu around you.',
        styles: 'Plated &nbsp;&middot;&nbsp; Family style &nbsp;&middot;&nbsp; Buffet &nbsp;&middot;&nbsp; Stations'
      },
      {
        number: '02',
        route: 'events',
        title: 'Events',
        desc: 'Corporate events, private parties and celebrations. Every menu is custom-curated around the crowd, the occasion and the room.',
        styles: 'Corporate &nbsp;&middot;&nbsp; Private parties &nbsp;&middot;&nbsp; Celebrations'
      },
      {
        number: '03',
        route: 'vending',
        title: 'Vending',
        desc: 'Festival vending, brand activations and large-event operations. Unique menus for every event, plus custom VIP areas for staff and artists.',
        styles: 'Festivals &nbsp;&middot;&nbsp; Activations &nbsp;&middot;&nbsp; Artist hospitality'
      }
    ],

    /* Closing band. One per page, always pointing at Contact. */
    cta: {
      kicker: 'Contact',
      label: 'Contact us',
      headlines: {
        home: 'Book your event.',
        order: 'Request drop-off catering.',
        weddings: 'Book your wedding.',
        events: 'Book your event.',
        vending: 'Book us for your festival or event.',
        about: 'Work with us.'
      }
    },

    footer: {
      tagline: 'Fine dining for all diets. Catering, events and festival vending across Los Angeles.',
      columns: [
        {
          heading: 'Services',
          links: [
            { route: 'weddings', label: 'Weddings' },
            { route: 'events', label: 'Events' },
            { route: 'vending', label: 'Vending' },
            { route: 'order', label: 'Order' }
          ]
        },
        {
          heading: 'Site',
          links: [
            { route: 'home', label: 'Home' },
            { route: 'about', label: 'About' },
            { route: 'contact', label: 'Contact' }
          ]
        }
      ]
    }
  };

  const B = CONFIG.business;

  const main = document.getElementById('tmc-main');
  const navLinks = document.getElementById('tmc-nav-links');
  const navCta = document.getElementById('tmc-nav-cta');
  const mobileMenu = document.getElementById('tmc-mobile-menu');
  const mobileToggle = document.getElementById('tmc-mobile-toggle');

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
  }

  /* The sticky header height drives both the hero offset and the top of the
     mobile menu. Measured rather than hardcoded, because the lockup and the
     nav button both change height once the webfonts land. */
  function syncNavHeight() {
    const nav = document.querySelector('.tmc-nav');
    if (!nav) return;
    document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
  }

  mobileToggle.addEventListener('click', function () {
    const open = mobileMenu.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', String(open));
  });

  /* === HELPERS === */
  function href(route) {
    return '#/' + (route === 'home' ? '' : route);
  }

  function navHtml(items, current) {
    return items.map(function (item) {
      return '<a href="' + href(item.route) + '" data-nav="' + item.route + '"' +
        (item.route === current ? ' aria-current="page"' : '') +
        '>' + item.label + '</a>';
    }).join('');
  }

  function renderNav(current) {
    navLinks.innerHTML = navHtml(CONFIG.nav.filter(function (i) { return !i.cta; }), current);

    const cta = CONFIG.nav.filter(function (i) { return i.cta; })[0];
    navCta.innerHTML = cta
      ? '<a class="tmc-nav-btn" href="' + href(cta.route) + '" data-nav="' + cta.route + '"' +
        (cta.route === current ? ' aria-current="page"' : '') + '>' + cta.label + '</a>'
      : '';

    mobileMenu.innerHTML = navHtml(CONFIG.nav, current);
  }

  /* Interior page hero. Full bleed section, centred inner column, with a
     short amethyst rule under the eyebrow echoing the card lockup. */
  function pageHero(route) {
    const h = CONFIG.heroes[route];
    return (
      '<section class="tmc-page-hero">' +
        '<div class="tmc-page-hero-inner">' +
          '<div class="tmc-page-eyebrow">' + h.eyebrow + '</div>' +
          '<span class="tmc-page-rule"></span>' +
          '<h1 class="tmc-page-title">' + h.title + '</h1>' +
          (h.intro ? '<p class="tmc-page-intro">' + h.intro + '</p>' : '') +
        '</div>' +
      '</section>'
    );
  }

  function contactBand(route) {
    return (
      '<section class="tmc-primary-cta-band">' +
        '<div class="tmc-primary-cta-inner">' +
          '<div class="tmc-primary-cta-label">' + CONFIG.cta.kicker + '</div>' +
          '<h2 class="tmc-primary-cta-headline">' + CONFIG.cta.headlines[route] + '</h2>' +
          '<a class="tmc-primary-cta-btn" href="#/contact" data-nav="contact">' +
            CONFIG.cta.label + ' &rarr;</a>' +
        '</div>' +
      '</section>'
    );
  }

  /* An interior page is a hero plus the closing band. Steps 4 to 8 add the
     body sections between them. */
  function simplePage(route) {
    return pageHero(route) + contactBand(route);
  }

  /* === BRAND ANIMATION === */
  function animateBrand() {
    const line1 = document.getElementById('brand-line-1');
    if (!line1) return;
    line1.innerHTML = 'TASTEMAKERS'
      .split('')
      .map(function (c, i) {
        return '<span style="animation-delay:' + (i * 0.05) + 's">' + c + '</span>';
      })
      .join('');
  }

  /* === PAGE TEMPLATES === */
  const pages = {
    home: function () {
      const cards = CONFIG.services.map(function (s) {
        return '<div class="tmc-service-block">' +
          '<div class="tmc-service-number">' + s.number + '</div>' +
          '<h3 class="tmc-service-title">' + s.title + '</h3>' +
          '<p class="tmc-service-desc">' + s.desc + '</p>' +
          '<div class="tmc-service-styles">' + s.styles + '</div>' +
          '<a class="tmc-service-menu-link" href="' + href(s.route) + '" data-nav="' + s.route + '">' +
            s.title + ' &rarr;</a>' +
        '</div>';
      }).join('');

      return (
        '<section class="tmc-hero">' +
          '<div class="tmc-brand-stack">' +
            '<div class="tmc-brand-line" id="brand-line-1"></div>' +
            '<div class="tmc-brand-sub-row">' +
              '<span class="tmc-brand-rule"></span>' +
              '<span class="tmc-brand-sub">COLLECTIVE</span>' +
              '<span class="tmc-brand-rule"></span>' +
            '</div>' +
          '</div>' +
          '<div class="tmc-hero-tagline">' + B.tagline + '</div>' +
          '<div class="tmc-hero-sub">' + B.city + '</div>' +
          '<span class="tmc-hero-cue" aria-hidden="true"></span>' +
        '</section>' +

        '<section class="tmc-why">' +
          '<div class="tmc-why-label">Who we are</div>' +
          '<h2 class="tmc-why-headline">A Los Angeles catering and events company.</h2>' +
          '<p class="tmc-why-body">We bring care and intentionality to every event we work. Music festivals, corporate activations, weddings and private dinners alike.</p>' +
        '</section>' +

        '<section class="tmc-credibility">' +
          '<div class="tmc-credibility-inner">' +
            '<div class="tmc-cred-item">' +
              '<div class="tmc-cred-label">Experience</div>' +
              '<div class="tmc-cred-text">Over a decade catering artist green rooms at music events.</div>' +
            '</div>' +
            '<div class="tmc-cred-item">' +
              '<div class="tmc-cred-label">Specialty</div>' +
              '<div class="tmc-cred-text">Custom-curated VIP activations at music festivals.</div>' +
            '</div>' +
          '</div>' +
        '</section>' +

        '<section class="tmc-section-header">' +
          '<div class="tmc-section-label">Services</div>' +
          '<h2 class="tmc-section-heading">Catering, events and vending</h2>' +
        '</section>' +

        '<div class="tmc-services-wrap">' +
          '<div class="tmc-services-grid">' + cards + '</div>' +
        '</div>' +

        '<section class="tmc-wwd-section">' +
          '<div class="tmc-wwd-header">' +
            '<div class="tmc-section-label">Our events</div>' +
            '<h2 class="tmc-section-heading" style="margin-top:18px">Pop-ups and supper clubs</h2>' +
            '<p class="tmc-wwd-intro">When we\'re not cooking for clients, we run our own programming. These are the nights and operations where Tastemakers Collective sets the menu.</p>' +
          '</div>' +
          '<div class="tmc-wwd-grid">' +
            '<div class="tmc-wwd-tile">' +
              '<div>' +
                '<div class="tmc-wwd-tile-label">One-night events</div>' +
                '<h3 class="tmc-wwd-tile-title">Pop-Ups</h3>' +
              '</div>' +
              '<div class="tmc-wwd-tile-desc">Themed concept dinners, guest residencies at partner venues, and brand collaborations. Fixed menu, limited seats, one night only.</div>' +
            '</div>' +
            '<div class="tmc-wwd-tile">' +
              '<div>' +
                '<div class="tmc-wwd-tile-label">Recurring dinners</div>' +
                '<h3 class="tmc-wwd-tile-title">Supper Clubs</h3>' +
              '</div>' +
              '<div class="tmc-wwd-tile-desc">Our own ongoing dinner series. Intimate, curated, and announced to guests directly. The place we cook without a client brief.</div>' +
            '</div>' +
            '<div class="tmc-wwd-tile">' +
              '<div>' +
                '<div class="tmc-wwd-tile-label">Festival presence</div>' +
                '<h3 class="tmc-wwd-tile-title">Vending</h3>' +
              '</div>' +
              '<div class="tmc-wwd-tile-desc">We run our own vending at festivals and markets under the Tastemakers Collective banner, alongside the vending we provide as a service to larger events.</div>' +
            '</div>' +
          '</div>' +
        '</section>' +

        contactBand('home')
      );
    },

    order: function () { return simplePage('order'); },
    weddings: function () { return simplePage('weddings'); },
    events: function () { return simplePage('events'); },
    vending: function () { return simplePage('vending'); },
    about: function () { return simplePage('about'); },

    contact: function () {
      return (
        pageHero('contact') +
        '<section class="tmc-contact-block">' +
          '<div class="tmc-contact-grid">' +
            '<div class="tmc-contact-card"><div class="tmc-contact-label">Email</div><p class="tmc-contact-value"><a href="mailto:' + B.email + '">' + B.email + '</a></p></div>' +
            '<div class="tmc-contact-card"><div class="tmc-contact-label">Phone</div><p class="tmc-contact-value"><a href="' + B.phoneHref + '">' + B.phone + '</a></p></div>' +
            '<div class="tmc-contact-card"><div class="tmc-contact-label">Text</div><p class="tmc-contact-value"><a href="' + B.smsHref + '">' + B.phone + '</a></p></div>' +
            '<div class="tmc-contact-card"><div class="tmc-contact-label">Serving</div><p class="tmc-contact-value">' + B.city + '</p></div>' +
          '</div>' +
        '</section>' +
        '<section class="tmc-body">' +
          '<form class="tmc-form" id="tmc-inquiry-form" autocomplete="on">' +
            '<input type="hidden" name="form_source" value="contact">' +
            '<input type="hidden" name="_subject" value="New inquiry from tastemakerscollective.us">' +
            '<div class="tmc-form-step">' +
              '<h3>The event</h3>' +
              '<div class="tmc-form-field"><label for="f-type">Type</label><select id="f-type" name="type" required><option>Wedding</option><option>Event</option><option>Vending</option><option>Drop-off</option><option>Other</option></select></div>' +
              '<div class="tmc-form-field"><label for="f-date">Date</label><input id="f-date" name="date" type="text" placeholder="Date or flexible"></div>' +
              '<div class="tmc-form-field"><label for="f-location">Location</label><input id="f-location" name="location" type="text" placeholder="Venue, neighborhood, or TBD"></div>' +
              '<div class="tmc-form-field"><label for="f-guests">Guest count</label><select id="f-guests" name="guests"><option>Under 25</option><option>25 to 50</option><option>50 to 100</option><option>100 to 200</option><option>200 to 500</option><option>More than 500</option></select></div>' +
            '</div>' +
            '<div class="tmc-form-step">' +
              '<h3>Details</h3>' +
              '<div class="tmc-form-field"><label for="f-dietary">Dietary needs and allergies</label><textarea id="f-dietary" name="dietary" rows="3"></textarea></div>' +
              '<div class="tmc-form-field"><label for="f-budget">Budget (optional)</label><input id="f-budget" name="budget" type="text"></div>' +
            '</div>' +
            '<div class="tmc-form-step">' +
              '<h3>Contact</h3>' +
              '<div class="tmc-form-field"><label for="f-name">Name</label><input id="f-name" name="name" type="text" required></div>' +
              '<div class="tmc-form-field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" required></div>' +
              '<div class="tmc-form-field"><label for="f-phone">Phone</label><input id="f-phone" name="phone" type="tel"></div>' +
              '<div class="tmc-form-field"><label for="f-notes">Additional notes</label><textarea id="f-notes" name="notes" rows="3"></textarea></div>' +
              '<p class="tmc-form-status" role="alert" hidden></p>' +
              '<button type="submit" class="tmc-form-submit">Send inquiry</button>' +
            '</div>' +
          '</form>' +
        '</section>'
      );
    }
  };

  /* === FOOTER === */
  function footerHtml() {
    const cols = CONFIG.footer.columns.map(function (col) {
      return '<div class="tmc-footer-col">' +
        '<h4>' + col.heading + '</h4>' +
        col.links.map(function (l) {
          return '<a href="' + href(l.route) + '" data-nav="' + l.route + '">' + l.label + '</a>';
        }).join('') +
        '</div>';
    }).join('');

    return (
      '<footer class="tmc-footer">' +
        '<div class="tmc-footer-grid">' +
          '<div>' +
            '<div class="tmc-footer-brand">TASTEMAKERS COLLECTIVE</div>' +
            '<div class="tmc-footer-tag">' + CONFIG.footer.tagline + '</div>' +
          '</div>' +
          cols +
          '<div class="tmc-footer-col">' +
            '<h4>Connect</h4>' +
            '<a href="mailto:' + B.email + '">' + B.email + '</a>' +
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

  /* === ROUTER === */
  function getRouteFromHash() {
    const hash = window.location.hash.replace(/^#\//, '').replace(/^#/, '');
    if (!hash || hash === '/') return 'home';
    return hash;
  }

  function render(route) {
    /* Retired route: rewrite the address bar, which fires hashchange and
       brings us straight back here with the current route. */
    if (CONFIG.redirects[route]) {
      window.location.replace(href(CONFIG.redirects[route]));
      return;
    }

    const page = pages[route] ? route : 'home';
    main.innerHTML = pages[page]() + footerHtml();
    renderNav(page);
    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (page === 'home') setTimeout(animateBrand, 50);
    document.title = CONFIG.titles[page] || CONFIG.titles.home;
  }

  /* === FORM HANDLER ===
     One shared submit path for every form on the site. Contact uses it now,
     Order joins it in Step 7. Everything the request needs travels in the
     form itself, including the hidden form_source and _subject, so this
     function never needs a per-form field list. */

  /* Builds a prefilled mailto from whatever visible fields the form has, so
     a failed request still gets the visitor's answers to us. */
  function mailtoFallback(form) {
    const fd = new FormData(form);
    const lines = [];
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      if (!el.name || el.type === 'hidden') return;
      const label = el.id ? form.querySelector('label[for="' + el.id + '"]') : null;
      lines.push((label ? label.textContent : el.name) + ': ' + (fd.get(el.name) || ''));
    });
    return 'mailto:' + B.email +
      '?subject=' + encodeURIComponent(fd.get('_subject') || 'Website inquiry') +
      '&body=' + encodeURIComponent(lines.join('\n'));
  }

  function handleFormSubmit(form) {
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('.tmc-form-status');
    const buttonLabel = button ? button.textContent : '';

    if (button) {
      button.disabled = true;
      button.textContent = 'Sending';
    }
    if (status) {
      status.hidden = true;
      status.textContent = '';
    }

    fetch(CONFIG.formEndpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Form endpoint returned ' + response.status);
        form.parentNode.innerHTML =
          '<div class="tmc-form-success">' +
            '<h3>Thanks. We&rsquo;ll get back to you soon.</h3>' +
          '</div>';
      })
      .catch(function () {
        if (button) {
          button.disabled = false;
          button.textContent = buttonLabel;
        }
        if (status) {
          status.hidden = false;
          status.innerHTML =
            'That did not send. Email us at ' +
            '<a href="mailto:' + B.email + '">' + B.email + '</a> ' +
            'or <a href="' + mailtoFallback(form) + '">open an email with your answers filled in</a>.';
        }
      });
  }

  /* === EVENT DELEGATION ===
     Bound once on the document rather than per render. The nav and the
     mobile menu live outside #tmc-main and survive every render, so
     re-binding them on each render used to stack up duplicate handlers. */
  document.addEventListener('click', function (e) {
    const el = e.target.closest ? e.target.closest('[data-nav]') : null;
    if (!el) return;
    e.preventDefault();
    /* Closed here as well as in render(), because tapping the link for the
       page you are already on changes no hash and fires no hashchange. */
    closeMobileMenu();
    window.location.hash = href(el.getAttribute('data-nav'));
  });

  document.addEventListener('submit', function (e) {
    if (!e.target || !e.target.classList.contains('tmc-form')) return;
    e.preventDefault();
    handleFormSubmit(e.target);
  });

  /* === INIT === */
  window.addEventListener('hashchange', function () {
    render(getRouteFromHash());
  });

  window.addEventListener('resize', syncNavHeight);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncNavHeight);
  }

  render(getRouteFromHash());
  syncNavHeight();
})();
