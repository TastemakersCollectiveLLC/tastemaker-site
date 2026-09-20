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
      menus: 'Example Menus | Tastemakers Collective',
      order: 'Drop-off Catering | Tastemakers Collective',
      weddings: 'Wedding Catering | Tastemakers Collective',
      events: 'Event Catering | Tastemakers Collective',
      vending: 'Festival Vending and Event Hospitality | Tastemakers Collective',
      about: 'About | Tastemakers Collective',
      contact: 'Contact | Tastemakers Collective'
    },

    /* One meta description per route. The router writes these into the head
       on navigation. Crawlers see the home one in the served HTML. */
    descriptions: {
      home: 'Tastemakers Collective is a Los Angeles catering and events company. Fine dining for all diets: weddings, corporate events, festivals and drop-off catering.',
      menus: 'Example menus from past Tastemakers Collective pop-ups and private dining. Every menu is custom.',
      order: 'Request drop-off catering from Tastemakers Collective in Los Angeles. Pick a date, a delivery window and a guest count.',
      weddings: 'Wedding catering in Los Angeles. Custom menus, full service, plated, family style, buffet or stations.',
      events: 'Catering for corporate events, private parties and celebrations in Los Angeles. Custom menus and full service.',
      vending: 'Festival vending and event hospitality. Food vending, staff meals and artist hospitality, with our own setup, staff and equipment.',
      about: 'Tastemakers Collective is a Los Angeles catering and events company working across Southern California and festivals across the state.',
      contact: 'Contact Tastemakers Collective about catering, events, festival vending or drop-off catering in Los Angeles.'
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
      },
      menus: {
        eyebrow: 'Menus',
        title: 'Menus',
        intro: 'Every menu is custom. These are examples from past events.'
      }
    },

    /* ============================================
       MENUS
       Danny's dish names and component lists as they were served. Event
       names, venues, dates, prices, suppliers, ingredient brands and prep
       notes are stripped. Vegan and gluten free are marked only where the
       source says so. The forthcoming menu matrix replaces or extends this
       array; no other code has to change when it does.
       ============================================ */
    menus: [
      {
        section: 'Pop-up menus',
        groups: [
          {
            title: 'Lunar New Year street menu',
            items: [
              { name: 'Duck Tacos', detail: 'Blue corn tacos, Peking-style duck, hoisin, cucumber, daikon, scallion, chili oil.' },
              { name: 'Beef &amp; Black Bean Tacos', detail: 'Blue corn tacos, velveted eye round, black bean garlic, celery, red bell, scallion.' },
              { name: 'General Tso&rsquo;s Tofu', detail: 'Koji-marinated crispy tofu, red bell pepper puree, orange, rice vinegar, coconut sugar, ginger, garlic, chiles japones.', tags: ['Vegan'] },
              { name: 'Longevity Noodles', detail: 'Shanghai noodles, shiitake, Chinese chive, carrot, bean sprouts, scallion oil, sesame.' },
              { name: 'Dumplings', detail: 'Crispy fried gyoza, veggie or beef, with chili oil, black vinegar, scallion oil and chili sambal.' },
              { name: 'Cucumber Salad', detail: 'Smashed Persian cucumber, wood ear mushroom, daikon, cilantro, scallion, soy-free soy sauce, black vinegar, sesame oil, chili oil, fried garlic, peanuts, sesame.', tags: ['Vegan', 'Gluten free'] }
            ]
          },
          {
            title: 'Smash burgers and fries',
            items: [
              { name: 'Single Smash' },
              { name: 'Double Smash' },
              { name: 'Fries' },
              { name: 'Feral Fries', detail: 'Cheese, caramelized onions, house sauce, chopped chiles.' }
            ]
          },
          {
            title: 'Wraps and salads',
            items: [
              { name: 'Grilled Chicken Wrap', detail: 'Koji-marinated chicken, ginger cardamom rice.' },
              { name: 'Kofta Beef Wrap' },
              { name: 'Vegan Green Caesar', tags: ['Vegan'] },
              { name: 'Chicken Caesar' },
              { name: 'Pan de Elote', detail: 'Date, ginger and raspberry compote, lavender.', tags: ['Vegan', 'Gluten free'] }
            ]
          },
          {
            title: 'Thai tacos',
            items: [
              { name: 'Panang Beef Barbacoa' },
              { name: 'Chicken Satay Tacos' },
              { name: 'Crispy Maitake Tacos' },
              { name: 'Thai Elote' }
            ]
          },
          {
            title: 'Italian',
            items: [
              { name: 'Bruschetta', detail: 'Garlic, herb and lemon crostini oil, tomato-shallot-basil salsa, balsamic, lemon zest.', tags: ['Vegan'] },
              { name: 'Crispy Gnocchi', detail: 'Seared gnocchi, parsnip-leek soubise or tomato sauce.', tags: ['Vegan', 'Gluten free'] },
              { name: 'Mortadella Sandwich', detail: 'Toasted ciabatta, pesto, stracciatella, pistachio crumble, mortadella, arugula.' },
              { name: 'Caprese Sandwich', detail: 'Fresh mozzarella, salted roma, basil chiffonade, olive oil, balsamic.' },
              { name: 'Hot Meatball Sub', detail: 'Toasted ciabatta, torched provolone, meatballs braised in scrap jus and marinara.' },
              { name: 'Cucumber Salad', detail: 'Oblique cucumbers, grape tomatoes, cured shallot, ciliegine, basil, arugula, balsamic vinaigrette.' }
            ]
          },
          {
            title: 'Noodle bowls',
            items: [
              { name: 'Noodle Bowl', detail: 'Chicken thigh or mushroom, cabbage, carrots, thick noodles.' }
            ]
          }
        ]
      },
      {
        section: 'Private dining',
        groups: [
          {
            title: 'Salads',
            items: [
              { name: 'Duck Caesar', detail: 'Dry cured duck breast, manchego, coconut aminos Caesar, MCT croutons.' },
              { name: 'Spring Garden', detail: 'Butter lettuce, cured cherry tomatoes, Persian cucumber ribbons, pickled shallot, dill, champagne-yuzu-date vinaigrette, sunflower seeds.', tags: ['Vegan', 'Gluten free'] },
              { name: 'King Crab Louie', detail: 'Whole king crab leg, jammy egg, MCT aioli with gochugaru and orange zest, heirloom tomato, avocado, lemon.' }
            ]
          },
          {
            title: 'Vegetables',
            items: [
              { name: 'Potatoes Barigoule', detail: 'Pearl potatoes seared with Castelvetrano olives, braised artichoke hearts, roasted fennel and napa cabbage, caramelized lemon, white wine and olive brine sauce.', tags: ['Vegan', 'Gluten free'] }
            ]
          },
          {
            title: 'Proteins',
            items: [
              { name: 'Salmon', detail: 'Crispy skin, prosecco-dashi beurre blanc, breakfast radish, seared leek, sundried tomato.' },
              { name: 'Duck Breast', detail: 'Salt and white pepper cure, slow rendered skin, vanilla-amontillado jus, cherry gastrique, three texture corn, hazelnuts, pea shoots.' },
              { name: 'Chateaubriand', detail: 'Grass-fed tenderloin, espresso-black garlic-gochugaru crust, orange-maitake demi, whole roasted maitakes, green peppercorns.' },
              { name: 'Lobster Tortelloni', detail: 'House pasta, leek-turnip-trumpet filling, clarified lobster consomme, claws, Japanese turnip, charred leek, lobster chili oil, micro cilantro.' }
            ]
          }
        ]
      }
    ],

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
        desc: 'Corporate events, private parties and celebrations. Every menu is built around the crowd and the occasion.',
        styles: 'Corporate &nbsp;&middot;&nbsp; Private parties &nbsp;&middot;&nbsp; Celebrations'
      },
      {
        number: '03',
        route: 'vending',
        title: 'Vending',
        desc: 'Festival food vending, staff meals and artist hospitality.',
        styles: 'Festivals &nbsp;&middot;&nbsp; Staff meals &nbsp;&middot;&nbsp; Artist hospitality'
      }
    ],

    /* Shared by Weddings and Events, which run the same process. */
    process: [
      { title: 'Inquiry', desc: 'You tell us the date, the place, the guest count and any dietary needs.' },
      { title: 'Consultation', desc: 'We talk through the food, the service style and how the day runs.' },
      { title: 'Custom menu', desc: 'We write a menu for your event and quote it.' },
      { title: 'Event day', desc: 'We handle the food and the service from start to finish.' }
    ],

    serviceStyles: [
      { title: 'Plated', desc: 'Courses plated in the kitchen and brought to each seat.' },
      { title: 'Family style', desc: 'Large shared dishes set down on the table.' },
      { title: 'Buffet', desc: 'Guests serve themselves from a set line.' },
      { title: 'Stations', desc: 'Separate stations, cooked and served in front of guests.' }
    ],

    included: [
      { title: 'Menu design', desc: 'A menu written for your event, not picked off a list.' },
      { title: 'Cooking', desc: 'We cook your food.' },
      { title: 'Service staff', desc: 'Our staff serve the food through the event.' },
      { title: 'Setup and breakdown', desc: 'We set up our own equipment and break it down when we are done.' }
    ],

    includedNote: 'We handle the food. We do not provide bar service, linens or decor.',
    dietaryNote: 'Menus are built around any dietary needs and allergies. Tell us what they are in your inquiry.',

    eventTypes: [
      { title: 'Corporate events', desc: 'Company meals, meetings and team events.' },
      { title: 'Private parties', desc: 'Dinners and parties at home or at a venue.' },
      { title: 'Celebrations', desc: 'Birthdays, anniversaries and milestones.' }
    ],

    /* Vending. No rates anywhere, and no permit claims. The liability
       insurance line is the active general liability policy on file. Past
       events are event type and city only, with no artist, promoter or
       venue names. */
    vendingBrings: [
      { title: 'Our own setup', desc: 'We bring our own equipment and run our own station.' },
      { title: 'Our own staff', desc: 'We staff the service ourselves.' },
      { title: 'A menu per event', desc: 'We build the menu around the event and the crowd.' },
      { title: 'Liability insurance', desc: 'We carry general liability insurance and can add your event as additional insured.' }
    ],

    vendingWays: [
      { title: 'Public food vending', desc: 'We sell food to guests at your event.' },
      { title: 'Staff meals and meal tickets', desc: 'We feed your crew, billed by meal ticket or by head.' },
      { title: 'Artist hospitality', desc: 'We cook for green rooms and artist areas.' }
    ],

    vendingPast: [
      { title: 'Warehouse music events', desc: 'Los Angeles' },
      { title: 'Outdoor pop-ups', desc: 'Los Angeles' }
    ],

    /* Drop-off order request. Lead time is in hours so the date picker can
       compute its own minimum. */
    order: {
      leadTimeHours: 48,
      deliveryWindows: ['11:00', '11:30', '12:00', '12:30', '1:00'],
      guestCounts: ['20 to 30', '30 to 50', '50 to 75', '75 to 100', 'More than 100']
    },

    /* About. Company only, no personal credentials. */
    aboutWhatWeDo: [
      { title: 'Catering', desc: 'Custom menus cooked and served at your event.' },
      { title: 'Events', desc: 'Corporate events, private parties and celebrations.' },
      { title: 'Festival vending', desc: 'Food vending, staff meals and artist hospitality.' },
      { title: 'Pop-ups', desc: 'One-night events we run ourselves.' },
      { title: 'Supper clubs', desc: 'Private dinners announced to our guest list.' }
    ],

    aboutWhereWeWork: 'Los Angeles and Southern California, plus festivals across California.',

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
        about: 'Work with us.',
        menus: 'Book your event.'
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
            { route: 'order', label: 'Order' },
            { route: 'menus', label: 'Menus' }
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

  /* A plain section: kicker, heading, optional intro, then a body. */
  function block(label, heading, intro, body, extra) {
    return '<section class="tmc-block">' +
      '<div class="tmc-block-head">' +
        (label ? '<div class="tmc-block-label">' + label + '</div>' : '') +
        '<h2 class="tmc-block-heading">' + heading + '</h2>' +
        (intro ? '<p class="tmc-block-intro">' + intro + '</p>' : '') +
      '</div>' +
      (body || '') +
      (extra || '') +
    '</section>';
  }

  /* Framed tiles. Pass step: true to number them 01, 02, 03. */
  function tiles(items, cols, numbered) {
    return '<div class="tmc-block-grid cols-' + cols + '">' +
      items.map(function (item, i) {
        return '<div class="tmc-block-item">' +
          (numbered ? '<div class="tmc-block-step tmc-service-number">' +
            ('0' + (i + 1)).slice(-2) + '</div>' : '') +
          '<h3 class="tmc-block-item-title">' + item.title + '</h3>' +
          '<p class="tmc-block-item-desc">' + item.desc + '</p>' +
        '</div>';
      }).join('') +
    '</div>';
  }

  /* Unframed rows, for lists that read better without boxes. */
  function rows(items) {
    return '<div class="tmc-list">' +
      items.map(function (item) {
        return '<div class="tmc-list-item">' +
          '<div class="tmc-list-item-title">' + item.title + '</div>' +
          '<p class="tmc-list-item-desc">' + item.desc + '</p>' +
        '</div>';
      }).join('') +
    '</div>';
  }

  /* The Menus pointer, used by Weddings, Events and Order. Menus is
     deliberately not in the main nav. */
  function menusBlock() {
    return block(
      '',
      'Example menus',
      CONFIG.heroes.menus.intro,
      '<div class="tmc-block-cta">' +
        '<a class="tmc-service-menu-link" href="#/menus" data-nav="menus">See the menus &rarr;</a>' +
      '</div>'
    );
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
          '<p class="tmc-why-body">We cook for music festivals, corporate events, weddings and private dinners.</p>' +
        '</section>' +

        '<section class="tmc-credibility">' +
          '<div class="tmc-credibility-inner">' +
            '<div class="tmc-cred-item">' +
              '<div class="tmc-cred-label">Experience</div>' +
              '<div class="tmc-cred-text">Over a decade catering artist green rooms at music events.</div>' +
            '</div>' +
            '<div class="tmc-cred-item">' +
              '<div class="tmc-cred-label">Specialty</div>' +
              '<div class="tmc-cred-text">VIP and artist hospitality at music festivals.</div>' +
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
            '<p class="tmc-wwd-intro">When we\'re not cooking for clients, we run our own events.</p>' +
          '</div>' +
          '<div class="tmc-wwd-grid">' +
            '<div class="tmc-wwd-tile">' +
              '<div>' +
                '<div class="tmc-wwd-tile-label">One-night events</div>' +
                '<h3 class="tmc-wwd-tile-title">Pop-Ups</h3>' +
              '</div>' +
              '<div class="tmc-wwd-tile-desc">Themed one-night dinners and pop-ups. Fixed menu, one night only.</div>' +
            '</div>' +
            '<div class="tmc-wwd-tile">' +
              '<div>' +
                '<div class="tmc-wwd-tile-label">Recurring dinners</div>' +
                '<h3 class="tmc-wwd-tile-title">Supper Clubs</h3>' +
              '</div>' +
              '<div class="tmc-wwd-tile-desc">Private dinners announced to our guest list.</div>' +
            '</div>' +
            '<div class="tmc-wwd-tile">' +
              '<div>' +
                '<div class="tmc-wwd-tile-label">Festival presence</div>' +
                '<h3 class="tmc-wwd-tile-title">Vending</h3>' +
              '</div>' +
              '<div class="tmc-wwd-tile-desc">We vend at festivals and markets under our own name.</div>' +
            '</div>' +
          '</div>' +
        '</section>' +

        menusBlock() +
        contactBand('home')
      );
    },

    menus: function () {
      const body = CONFIG.menus.map(function (section) {
        return '<section class="tmc-menu-section">' +
          '<h2 class="tmc-menu-section-heading">' + section.section + '</h2>' +
          section.groups.map(function (group) {
            return '<div class="tmc-menu-group">' +
              '<div class="tmc-menu-section-title">' + group.title + '</div>' +
              group.items.map(function (item) {
                return '<div class="tmc-menu-item">' +
                  '<div class="tmc-menu-item-name">' + item.name + '</div>' +
                  (item.detail ? '<div class="tmc-menu-item-desc">' + item.detail + '</div>' : '') +
                  (item.tags && item.tags.length
                    ? '<div class="tmc-menu-tags">' + item.tags.map(function (t) {
                        return '<span class="tmc-menu-tag">' + t + '</span>';
                      }).join('') + '</div>'
                    : '') +
                '</div>';
              }).join('') +
            '</div>';
          }).join('') +
        '</section>';
      }).join('');

      return pageHero('menus') +
        '<div class="tmc-menu-detail">' + body + '</div>' +
        contactBand('menus');
    },

    /* The interim Order page: a drop-off request form.
       TODO: once Danny's menu matrix exists, this page becomes a clickable
       menu customers order from directly. The form below is what stands in
       until then. */
    order: function () {
      const windows = CONFIG.order.deliveryWindows.map(function (w) {
        return '<option>' + w + '</option>';
      }).join('');
      const counts = CONFIG.order.guestCounts.map(function (c) {
        return '<option>' + c + '</option>';
      }).join('');

      return pageHero('order') +
        '<section class="tmc-body">' +
          '<form class="tmc-form" id="tmc-order-form" autocomplete="on">' +
            '<input type="hidden" name="form_source" value="order">' +
            '<input type="hidden" name="_subject" value="New drop-off order request">' +
            '<div class="tmc-form-step">' +
              '<h3>Delivery</h3>' +
              '<div class="tmc-form-field"><label for="o-date">Date</label>' +
                '<input id="o-date" name="date" type="date" required></div>' +
              '<div class="tmc-form-field"><label for="o-window">Delivery window</label>' +
                '<select id="o-window" name="delivery_window" required>' + windows + '</select></div>' +
              '<div class="tmc-form-field"><label for="o-address">Delivery address or area</label>' +
                '<input id="o-address" name="address" type="text" required></div>' +
              '<div class="tmc-form-field"><label for="o-guests">Guest count</label>' +
                '<select id="o-guests" name="guests" required>' + counts + '</select></div>' +
            '</div>' +
            '<div class="tmc-form-step">' +
              '<h3>Food</h3>' +
              '<div class="tmc-form-field"><label for="o-dietary">Dietary needs and allergies</label>' +
                '<textarea id="o-dietary" name="dietary" rows="3"></textarea></div>' +
              '<div class="tmc-form-field"><label for="o-notes">Notes</label>' +
                '<textarea id="o-notes" name="notes" rows="3"></textarea></div>' +
            '</div>' +
            '<div class="tmc-form-step">' +
              '<h3>Contact</h3>' +
              '<div class="tmc-form-field"><label for="o-name">Name</label>' +
                '<input id="o-name" name="name" type="text" required></div>' +
              '<div class="tmc-form-field"><label for="o-email">Email</label>' +
                '<input id="o-email" name="email" type="email" required></div>' +
              '<div class="tmc-form-field"><label for="o-phone">Phone</label>' +
                '<input id="o-phone" name="phone" type="tel"></div>' +
              '<p class="tmc-form-status" role="alert" hidden></p>' +
              '<button type="submit" class="tmc-form-submit">Send order request</button>' +
            '</div>' +
          '</form>' +
        '</section>' +
        menusBlock() +
        contactBand('order');
    },

    weddings: function () {
      return pageHero('weddings') +
        block('', 'How it works', '', tiles(CONFIG.process, 4, true)) +
        block('', 'Service styles', '', tiles(CONFIG.serviceStyles, 4)) +
        block('', 'What is included', '',
          rows(CONFIG.included),
          '<p class="tmc-block-note">' + CONFIG.includedNote + '</p>') +
        block('', 'Dietary needs', CONFIG.dietaryNote) +
        menusBlock() +
        contactBand('weddings');
    },

    events: function () {
      return pageHero('events') +
        block('', 'Event types', '', tiles(CONFIG.eventTypes, 3)) +
        block('', 'How it works', '', tiles(CONFIG.process, 4, true)) +
        block('', 'Service styles', '', tiles(CONFIG.serviceStyles, 4)) +
        block('', 'What is included', '',
          rows(CONFIG.included),
          '<p class="tmc-block-note">' + CONFIG.includedNote + '</p>') +
        block('', 'Dietary needs', CONFIG.dietaryNote) +
        menusBlock() +
        contactBand('events');
    },
    vending: function () {
      return pageHero('vending') +
        block('', 'What we bring', '', tiles(CONFIG.vendingBrings, 4)) +
        block('', 'Ways we work', '', tiles(CONFIG.vendingWays, 3)) +
        block('', 'Past events', '', rows(CONFIG.vendingPast)) +
        contactBand('vending');
    },
    about: function () {
      return pageHero('about') +
        block('', 'What we do', '', rows(CONFIG.aboutWhatWeDo)) +
        block('', 'Where we work', CONFIG.aboutWhereWeWork) +
        contactBand('about');
    },

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

  /* The order date picker cannot offer a date inside the lead time. Set on
     the input itself so the browser's own calendar greys the days out. */
  function applyLeadTime() {
    const input = document.getElementById('o-date');
    if (!input) return;
    const earliest = new Date(Date.now() + CONFIG.order.leadTimeHours * 3600 * 1000);
    const iso = earliest.getFullYear() + '-' +
      ('0' + (earliest.getMonth() + 1)).slice(-2) + '-' +
      ('0' + earliest.getDate()).slice(-2);
    input.min = iso;
    input.value = '';
  }

  /* Rewrites a head meta tag in place. The tag already exists in the
     served HTML, so crawlers that do not run scripts still get the home
     description. */
  function setMeta(name, content) {
    const tag = document.querySelector('meta[name="' + name + '"]');
    if (tag) tag.setAttribute('content', content);
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
    applyLeadTime();
    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (page === 'home') setTimeout(animateBrand, 50);
    document.title = CONFIG.titles[page] || CONFIG.titles.home;
    setMeta('description', CONFIG.descriptions[page] || CONFIG.descriptions.home);
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
