/* ============================================
   TASTEMAKERS COLLECTIVE
   Client-side router and page templates
   ============================================ */

(function () {
  'use strict';

  /* ============================================
     FORM ENDPOINT
     ONE endpoint, shared by BOTH forms: the Google Apps Script web app in
     apps-script/Code.gs, deployed from the hello@ Workspace. It writes
     every submission to a spreadsheet, one tab per form_source, and
     emails hello@tastemakerscollective.us. Nothing is ever dropped there:
     a honeypot hit is written and sent with a flag.

     The site posts JSON as a plain string with no Content-Type header, so
     the browser sends it as text/plain and makes no CORS preflight, which
     a web app cannot answer. Google replies with a redirect to
     script.googleusercontent.com carrying {"ok":true} or
     {"ok":false,"error":"..."}; fetch follows it.

     The two forms are told apart by the hidden form_source field they
     each carry: "contact" for the booking enquiry on #/contact and
     "order" for the drop-off request on #/order. The script names the
     tab and the email subject from it.
     ============================================ */
  const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyyHqJLrDdlsNhMX8yK0lq0hC232ooJ1g3FqA0oK34SsQrmTcpPQC_S30ENrFhWGEISTQ/exec';

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
      tagline: 'Custom menus for every event and every diet.',
      /* The display form. The tel: and sms: hrefs are derived from its
         digits below, so the three can never disagree. */
      phone: '(213) 293-8518',
      email: 'hello@tastemakerscollective.us'
    },

    /* Main navigation, in display order. One entry may carry cta: true,
       which renders it as the outlined button at the end of the bar. */
    nav: [
      { route: 'home', label: 'Home' },
      { route: 'order', label: 'Order' },
      { route: 'weddings', label: 'Weddings' },
      { route: 'corporate', label: 'Corporate' },
      { route: 'events', label: 'Events' },
      { route: 'vending', label: 'Vending' },
      /* In the nav since 9/21/2026. On a text only site the menus are the
         only evidence of the food, and a couple or a buyer wants that
         before the process. */
      { route: 'menus', label: 'Menus' },
      { route: 'about', label: 'About' },
      { route: 'contact', label: 'Book', cta: true }
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
      corporate: 'Corporate Catering | Tastemakers Collective',
      events: 'Event Catering | Tastemakers Collective',
      vending: 'Festival Vending and Event Hospitality | Tastemakers Collective',
      about: 'About | Tastemakers Collective',
      contact: 'Contact | Tastemakers Collective'
    },

    /* One meta description per route. The router writes these into the head
       on navigation. Crawlers see the home one in the served HTML. */
    descriptions: {
      home: 'A Los Angeles catering and events company. Custom menus for every event and every diet: weddings, corporate events, festivals and drop-off catering.',
      menus: 'Example menus from past Tastemakers Collective pop-ups and private dining. Every menu is custom.',
      order: 'Request drop-off catering from Tastemakers Collective in Los Angeles. Pick a date, a delivery window and a guest count.',
      weddings: 'Wedding catering in Los Angeles. Custom menus, full service, plated, family style, buffet or stations.',
      corporate: 'Corporate catering in Los Angeles. Office lunches, meetings, company events and client dinners.',
      events: 'Catering for private parties, celebrations and milestones in Los Angeles. Custom menus and full service.',
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
      /* styles is the small amethyst row under the intro, the same one the
         Home service cards carry, so a service page names its service
         styles before the visitor scrolls. */
      weddings: {
        eyebrow: 'Weddings',
        title: 'Wedding catering',
        intro: 'Custom menus and full service for your wedding day.',
        styles: 'Plated &nbsp;&middot;&nbsp; Family style &nbsp;&middot;&nbsp; Buffet &nbsp;&middot;&nbsp; Stations'
      },
      corporate: {
        eyebrow: 'Corporate',
        title: 'Corporate catering',
        intro: 'Office lunches, meetings, company events and client dinners.',
        styles: 'Plated &nbsp;&middot;&nbsp; Family style &nbsp;&middot;&nbsp; Buffet &nbsp;&middot;&nbsp; Stations &nbsp;&middot;&nbsp; Drop-off'
      },
      events: {
        eyebrow: 'Events',
        title: 'Event catering',
        intro: 'Private parties, celebrations and milestones.',
        styles: 'Plated &nbsp;&middot;&nbsp; Family style &nbsp;&middot;&nbsp; Buffet &nbsp;&middot;&nbsp; Stations'
      },
      vending: {
        eyebrow: 'Vending',
        title: 'Festival vending and event hospitality',
        intro: 'Food vending, staff meals and artist hospitality for festivals and events.',
        styles: 'Public vending &nbsp;&middot;&nbsp; Staff meals &nbsp;&middot;&nbsp; Artist hospitality'
      },
      about: {
        eyebrow: 'About',
        title: 'About Tastemakers Collective',
        intro: 'Tastemakers Collective is a Los Angeles catering and events company. Custom menus for every event and every diet.'
      },
      contact: {
        eyebrow: 'Contact',
        title: 'Book us',
        intro: 'Tell us about your event and we&rsquo;ll get back to you. Serving Los Angeles.'
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
              { name: 'Duck Tacos', detail: 'Blue corn tortilla, roasted duck, hoisin, cucumber, daikon, scallion, chili oil.' },
              { name: 'Beef &amp; Black Bean Tacos', detail: 'Blue corn tortilla, sliced beef, black bean garlic, white onion, red bell pepper, celery, scallion.' },
              { name: 'General Tso&rsquo;s Tofu', detail: 'Koji-marinated tofu fried in potato starch, roasted red pepper puree, orange, rice vinegar, coconut sugar, ginger, garlic, dried chiles, red bell pepper, white onion, toasted sesame.', tags: ['Vegan'] },
              { name: 'Longevity Noodles', detail: 'Shanghai noodles, shiitake, Chinese chive, carrot, napa cabbage, bean sprouts, scallion oil, garlic, ginger, sesame.' },
              { name: 'Dumplings', detail: 'Crispy fried gyoza, veggie or beef, chili oil, black vinegar, scallion oil, sambal.' },
              { name: 'Cucumber Salad', detail: 'Smashed Persian cucumber, wood ear mushroom, daikon, cilantro, scallion, toasted peanuts, fried garlic, black and white sesame, coconut aminos, ginger rice vinaigrette, black vinegar, sesame oil, chili oil, Thai chili.', tags: ['Vegan', 'Gluten free'] }
            ]
          },
          {
            title: 'Smash burgers and fries',
            items: [
              { name: 'Single Smash', detail: 'Potato roll, smashed beef patty, American cheese, house sauce, pickle, white onion, chiles.' },
              { name: 'Double Smash', detail: 'Potato roll, two smashed beef patties, double American cheese, house sauce, pickle, white onion, chiles.' },
              { name: 'Fries', detail: 'Fried in corn oil, house seasoning blend.' },
              { name: 'Feral Fries', detail: 'Fries, American cheese, caramelized onion, house sauce, chopped chiles.' }
            ]
          },
          {
            title: 'Grilled wraps and salads',
            items: [
              { name: 'Grilled Chicken Wrap', detail: 'Spinach herb tortilla, marinated grilled chicken, ginger cardamom rice, scallion oil, spring mix, mango, Persian cucumber, cherry tomato, Thai chili, celery, red onion, cilantro, basil, mint, lemon, lime.' },
              { name: 'Kofta Beef Wrap', detail: 'Roasted red pepper tortilla, beef kofta with caramelized onion, tomato, gochugaru, mustard seed, coriander, fennel, cumin and allspice, seared cherry tomato, toum, hummus, pickled shallot, cucumber, scallion, mint, ginger cardamom rice, spring mix.' },
              { name: 'Vegan Green Caesar', detail: 'Lacinato kale, arugula, cashew and oat milk caesar, basil, lemon, garlic, toum, lemon-cured cucumber ribbons, lemon supremes, lemon sunflower seeds, parsley, dill.', tags: ['Vegan'] },
              { name: 'Pan de Elote', detail: 'Sweet corn, cornmeal, date sugar, olive oil, date syrup, ginger, raspberry compote, chamomile lavender, freeze-dried raspberry.', tags: ['Vegan', 'Gluten free'] }
            ]
          },
          {
            title: 'Thai street tacos',
            items: [
              { name: 'Panang Beef Barbacoa', detail: 'Beef chuck, panang curry, coconut milk, fish sauce, coconut sugar, makrut lime leaf, caramelized green cabbage, fried Thai basil, peanuts, dried mango and chile manzano sauce.' },
              { name: 'Chicken Satay Tacos', detail: 'Corn tortilla, coconut-marinated chicken, Madras curry, green papaya, green cabbage, carrot, cucumber, Roma tomato, lime, fish sauce, peanut sauce of coconut cream, tamarind, makrut lime leaf, galangal, ginger and lemongrass.' },
              { name: 'Crispy Maitake Tacos', detail: 'Maitake and king trumpet mushrooms, potato starch, coconut aminos, tamarind, coconut sugar, roasted mushroom glaze, kombu, avocado, kiwi, serrano, Thai basil, mint, scallion, lime.' },
              { name: 'Thai Elote', detail: 'Charred corn, cashew lime aioli, makrut lime leaf, garlic, cilantro, chile lime dust, gochugaru, scallion, mint, Thai basil.' }
            ]
          },
          {
            title: 'Italian sandwiches and snacks',
            items: [
              { name: 'Bruschetta', detail: 'Grilled baguette, garlic, herb and lemon peel oil, tomato, shallot, basil, balsamic, lemon zest.', tags: ['Vegan'] },
              { name: 'Crispy Gnocchi', detail: 'Gluten-free gnocchi seared in the wok, parsnip puree, leek soubise, basil, or tomato sauce.', tags: ['Vegan', 'Gluten free'] },
              { name: 'Mortadella Sandwich', detail: 'Toasted ciabatta, pistachio lemon pesto, stracciatella, pistachio crumble, mortadella, arugula.' },
              { name: 'Caprese Sandwich', detail: 'Toasted ciabatta, fresh mozzarella, salted Roma tomato, basil, olive oil, balsamic, prosciutto on request.' },
              { name: 'Hot Meatball Sub', detail: 'Ciabatta, meatballs braised in marinara and roasted scrap jus, torched provolone.' },
              { name: 'Cucumber Salad', detail: 'Oblique cucumber, grape tomato, lemon-cured shallot, ciliegine, basil, arugula, balsamic vinaigrette.' }
            ]
          },
          {
            title: 'Noodle bowls',
            items: [
              { name: 'Noodle Bowl', detail: 'Yakisoba noodles, napa cabbage, sugar snap peas, red bell pepper, shiitake, teriyaki chicken thigh or mushroom, pineapple chile salsa.' }
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
              { name: 'Duck Caesar', detail: 'Duck confit, duck fat caesar dressing, no anchovy, duck fat croutons, manchego, romaine, lemon supremes.' },
              { name: 'Spring Garden', detail: 'Butter lettuce, tomatoes peeled and brined in lemon and basil, lemon-pickled shallot, cucumber ribbons, dill, sunflower seeds, champagne yuzu date vinaigrette.', tags: ['Vegan', 'Gluten free'] },
              { name: 'King Crab Louie', detail: 'Whole king crab leg, seven-minute egg, gochugaru and orange Louie, dijon, rice vinegar, cornichon, shallot, heirloom tomato, avocado, lemon.' }
            ]
          },
          {
            title: 'Vegetables',
            items: [
              { name: 'Potatoes Barigoule', detail: 'Pearl potatoes in coriander fennel stock, Castelvetrano olives, braised artichoke, roasted fennel, napa cabbage, white wine, olive brine, caramelized lemon, chervil, parsley.', tags: ['Vegan', 'Gluten free'] }
            ]
          },
          {
            title: 'Proteins',
            items: [
              { name: 'Salmon', detail: 'Salmon, prosecco beurre blanc on salmon dashi with kombu, bonito, leek, turnip and parsnip, radish, leek, sundried tomato.' },
              { name: 'Duck Breast', detail: 'Duck breast, vanilla amontillado jus, cherry gastrique with red wine vinegar, mirin, pink peppercorn and thyme, three-texture corn, parsnip, hazelnut, pea shoots.' },
              { name: 'Chateaubriand', detail: 'Beef tenderloin crusted in espresso, black garlic, gochugaru, orange zest and smoked salt, demi of roasted bones, burnt turnip, roasted orange, maitake, parsnip, shallot, amontillado, green peppercorns.' },
              { name: 'Lobster Tortelloni', detail: 'House pasta filled with leek, turnip and trumpet mushroom, clarified lobster consomm&eacute;, claw meat, Japanese turnip, charred leek, chili oil of Aleppo, annatto, garlic and coriander.' }
            ]
          }
        ]
      }
    ],

    /* Five dishes named in the Home hero, so the food is on the page
       before the visitor scrolls. Real dishes from the menus below, in
       Danny's order. Static: it is a line of type, not a ticker. */
    heroDishes: ['Duck Tacos', 'Panang Beef Barbacoa', 'Lobster Tortelloni',
                 'Crispy Maitake Tacos', 'Chateaubriand'],

    /* Home services cards. */
    services: [
      {
        route: 'weddings',
        title: 'Weddings',
        desc: 'Custom menus and full service for your wedding day. We design the menu around you.',
        styles: 'Plated &nbsp;&middot;&nbsp; Family style &nbsp;&middot;&nbsp; Buffet &nbsp;&middot;&nbsp; Stations'
      },
      {
        route: 'corporate',
        title: 'Corporate',
        desc: 'Office lunches, meetings, company events and client dinners.',
        styles: 'Office lunch &nbsp;&middot;&nbsp; Meetings &nbsp;&middot;&nbsp; Company events'
      },
      {
        route: 'events',
        title: 'Events',
        desc: 'Private parties, celebrations and milestones. Every menu is built around the crowd and the occasion.',
        styles: 'Private parties &nbsp;&middot;&nbsp; Celebrations &nbsp;&middot;&nbsp; Milestones'
      },
      {
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

    /* Three. "Cooking: We cook your food." was a tile that said nothing a
       catering page needs saying, and it was only there to make four. */
    included: [
      { title: 'Menu design', desc: 'A menu written for your event, not picked off a list.' },
      { title: 'Service staff', desc: 'Our staff serve the food through the event.' },
      { title: 'Setup and breakdown', desc: 'We set up our own equipment and break it down when we are done.' }
    ],

    includedNote: 'We handle the food. We do not provide bar service, linens or decor.',
    dietaryNote: 'Menus are built around any dietary needs and allergies. Tell us what they are in your inquiry.',

    /* Two, not three. A third "Milestones" tile repeated "anniversaries"
       from the tile beside it and existed only to fill a row. */
    eventTypes: [
      { title: 'Private parties', desc: 'Dinners and parties at home or at a venue.' },
      { title: 'Celebrations', desc: 'Birthdays, anniversaries and milestones.' }
    ],

    corporateTypes: [
      { title: 'Office lunches', desc: 'Lunch brought in for the team.' },
      { title: 'Meetings and all-day events', desc: 'Food through the day, timed to the agenda.' },
      { title: 'Company parties', desc: 'Holiday parties, launches and team celebrations.' },
      { title: 'Client dinners', desc: 'Dinner for clients and guests.' }
    ],

    /* Corporate adds drop-off to the shared list. */
    corporateStyles: [
      { title: 'Plated', desc: 'Courses plated in the kitchen and brought to each seat.' },
      { title: 'Family style', desc: 'Large shared dishes set down on the table.' },
      { title: 'Buffet', desc: 'Guests serve themselves from a set line.' },
      { title: 'Stations', desc: 'Separate stations, cooked and served in front of guests.' },
      { title: 'Drop-off', desc: 'Delivered ready to serve, with nothing to set up.' }
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
    /* Two verbs only. Book takes a date and a quote, Order is drop-off.
       One primary and one secondary per page, never more. */
    cta: {
      kicker: 'Contact',
      headlines: {
        home: 'Book your event.',
        order: 'Book your event.',
        weddings: 'Book your wedding.',
        corporate: 'Book your office lunch or event.',
        events: 'Book your event.',
        vending: 'Book us for your festival or event.',
        about: 'Work with us.',
        menus: 'Book your event.'
      },
      buttons: {
        home:      { primary: 'Book', secondary: 'Order drop-off' },
        order:     { primary: 'Book' },
        weddings:  { primary: 'Book', secondary: 'Order drop-off', type: 'wedding' },
        corporate: { primary: 'Book', secondary: 'Order drop-off', type: 'corporate' },
        events:    { primary: 'Book', secondary: 'Order drop-off', type: 'private-party' },
        vending:   { primary: 'Book', secondary: 'Order drop-off', type: 'vending', style: 'vending' },
        about:     { primary: 'Book' },
        menus:     { primary: 'Book an event', secondary: 'Order drop-off' }
      }
    },

    /* Phone sticky bar. Every route in it gets Book; Order is dropped where
       drop-off is not what that visitor came for. */
    stickyBookOnly: ['weddings'],

    /* Contact form. The prefill maps turn a query value into the option a
       visitor would have picked, so a Book button carries its page's
       context. Anything not listed here is ignored and the form opens
       plain. */
    contactForm: {
      eventTypes: ['Wedding', 'Corporate event', 'Private party', 'Celebration',
                   'Festival or event vending', 'Other'],
      serviceStyles: ['Plated catering', 'Buffet catering', 'Family style catering',
                      'Action stations', 'Drop-off catering', 'Vending', 'Not sure yet'],
      typeFromQuery: {
        wedding: 'Wedding',
        corporate: 'Corporate event',
        'private-party': 'Private party',
        celebration: 'Celebration',
        vending: 'Festival or event vending',
        other: 'Other'
      },
      styleFromQuery: {
        plated: 'Plated catering',
        buffet: 'Buffet catering',
        'family-style': 'Family style catering',
        stations: 'Action stations',
        'drop-off': 'Drop-off catering',
        vending: 'Vending'
      },
      /* The extra questions a vending enquiry needs. */
      vendingType: 'Festival or event vending',
      powerWater: ['Yes', 'No', 'Not sure']
    },

    footer: {
      tagline: 'Custom menus for every event and every diet. Catering, events and festival vending across Los Angeles.',
      columns: [
        {
          heading: 'Services',
          links: [
            { route: 'weddings', label: 'Weddings' },
            { route: 'corporate', label: 'Corporate' },
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
  /* One number, three forms. Everything after the country code is the
     display string stripped to digits: (213) 293-8518 -> +12132938518. */
  const PHONE_E164 = '+1' + B.phone.replace(/\D/g, '');
  B.phoneHref = 'tel:' + PHONE_E164;
  B.smsHref = 'sms:' + PHONE_E164;

  const main = document.getElementById('tmc-main');
  const shell = document.querySelector('.tmc');
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

  /* The skip link keeps href="#tmc-main" so it still works with JavaScript
     off, but a hash router reads that as a route, finds no page called
     tmc-main and falls back to Home. Landing a keyboard visitor on the
     homepage is the opposite of skipping to the content they are on, so
     move focus directly and leave the address bar alone. */
  const skipLink = document.querySelector('.tmc-skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function (e) {
      e.preventDefault();
      main.focus();
    });
  }

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
  function options(list) {
    return list.map(function (o) { return '<option>' + o + '</option>'; }).join('');
  }

  function pageHero(route) {
    const h = CONFIG.heroes[route];
    return (
      '<section class="tmc-page-hero tmc-page-hero-' + route + '">' +
        '<div class="tmc-page-hero-inner">' +
          '<div class="tmc-page-eyebrow">' + h.eyebrow + '</div>' +
          '<span class="tmc-page-rule"></span>' +
          '<h1 class="tmc-page-title">' + h.title + '</h1>' +
          (h.intro ? '<p class="tmc-page-intro">' + h.intro + '</p>' : '') +
          (h.styles ? '<div class="tmc-page-styles">' + h.styles + '</div>' : '') +
        '</div>' +
      '</section>'
    );
  }

  /* A Book link carrying its page's context, so the contact form opens
     with the right answers already chosen. */
  function bookHref(cfg) {
    let q = '';
    if (cfg && cfg.type) q += 'type=' + cfg.type;
    if (cfg && cfg.style) q += (q ? '&' : '') + 'style=' + cfg.style;
    return '#/contact' + (q ? '?' + q : '');
  }

  function ctaButtons(route) {
    const cfg = CONFIG.cta.buttons[route] || { primary: 'Book' };
    let html = '<div class="tmc-cta-actions">' +
      '<a class="tmc-btn tmc-btn-primary" href="' + bookHref(cfg) + '" data-nav="contact">' +
        cfg.primary + ' <span class="tmc-arrow">&rarr;</span></a>';
    if (cfg.secondary) {
      html += '<a class="tmc-btn tmc-btn-secondary" href="#/order" data-nav="order">' +
        cfg.secondary + ' <span class="tmc-arrow">&rarr;</span></a>';
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

  /* Framed tiles. */
  function tiles(items, cols) {
    return '<div class="tmc-block-grid cols-' + cols + '">' +
      items.map(function (item) {
        return '<div class="tmc-block-item">' +
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

  /* The in-page Menus pointer, used by Home, Weddings, Corporate, Events
     and Order. Menus is in the main nav as well. */
  /* label is passed only on Home, where the sections either side of it
     carry kickers. The interior pages have none, so it stays empty there. */
  function menusBlock(label) {
    return block(
      label || '',
      'Example menus',
      CONFIG.heroes.menus.intro,
      '<div class="tmc-block-cta">' +
        '<a class="tmc-service-menu-link" href="#/menus" data-nav="menus">See the menus <span class="tmc-arrow">&rarr;</span></a>' +
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
          '<h3 class="tmc-service-title">' + s.title + '</h3>' +
          '<p class="tmc-service-desc">' + s.desc + '</p>' +
          '<div class="tmc-service-styles">' + s.styles + '</div>' +
          '<a class="tmc-service-menu-link" href="' + href(s.route) + '" data-nav="' + s.route + '">' +
            s.title + ' <span class="tmc-arrow">&rarr;</span></a>' +
        '</div>';
      }).join('');

      return (
        '<section class="tmc-hero">' +
          /* The lockup IS the page heading, so it carries the h1 rather
             than Home having no h1 at all. No visible change: the class
             keeps every style and the reset below kills the default margin.
             aria-label gives assistive tech the name in one piece, because
             the visible text is split across animated spans. */
          '<h1 class="tmc-brand-stack" aria-label="Tastemakers Collective">' +
            '<span class="tmc-brand-line" id="brand-line-1"></span>' +
            '<span class="tmc-brand-sub-row" aria-hidden="true">' +
              '<span class="tmc-brand-rule"></span>' +
              '<span class="tmc-brand-sub">COLLECTIVE</span>' +
              '<span class="tmc-brand-rule"></span>' +
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
          '</div>' +
        '</section>' +

        menusBlock('Menus') +
        contactBand('home')
      );
    },

    menus: function () {
      function renderSection(section) {
        return '<section class="tmc-menu-section">' +
          '<h2 class="tmc-menu-section-heading">' + section.section + '</h2>' +
          section.groups.map(function (group) {
            return '<div class="tmc-menu-group">' +
              '<h3 class="tmc-menu-section-title">' + group.title + '</h3>' +
              '<div class="tmc-menu-items">' +
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
              '</div>' +
            '</div>';
          }).join('') +
        '</section>';
      }

      /* The Book and Order pair sits under the first menu section and
         again at the end, so the page always offers a way to act. It is
         the same pair both times: one action to book, one to order. */
      /* A couple from Weddings or a buyer from Corporate or Events wants
         the private dining menus first, not the taco pop-ups. From Home,
         Vending or a direct link the pop-ups lead, as before. */
      const leadWithPrivate = ['weddings', 'corporate', 'events'].indexOf(previousRoute) > -1;
      const ordered = CONFIG.menus.slice();
      if (leadWithPrivate) {
        ordered.sort(function (a, b) {
          return (a.section === 'Private dining' ? 0 : 1) - (b.section === 'Private dining' ? 0 : 1);
        });
      }
      const sections = ordered.map(function (section) { return renderSection(section); });
      return pageHero('menus') +
        '<div class="tmc-menu-detail">' + sections[0] + '</div>' +
        '<section class="tmc-primary-cta-band">' +
          '<div class="tmc-primary-cta-inner">' +
            '<div class="tmc-primary-cta-label">' + CONFIG.cta.kicker + '</div>' +
            '<h2 class="tmc-primary-cta-headline">' + CONFIG.cta.headlines.menus + '</h2>' +
            ctaButtons('menus') +
          '</div>' +
        '</section>' +
        '<div class="tmc-menu-detail">' + sections.slice(1).join('') + '</div>' +
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
          /* DROP-OFF ORDER form. Shares the one endpoint with the booking
             enquiry form on #/contact; form_source="order" is what separates
             the two in the spreadsheet and the inbox. */
          '<form class="tmc-form" id="tmc-order-form" autocomplete="on">' +
            '<input type="hidden" name="form_source" value="order">' +
            '<input class="tmc-hp" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">' +
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
              '<p class="tmc-form-status" role="alert" aria-live="assertive" hidden></p>' +
              '<button type="submit" class="tmc-form-submit">Send order request</button>' +
            '</div>' +
          '</form>' +
        '</section>' +
        menusBlock() +
        contactBand('order');
    },

    weddings: function () {
      return pageHero('weddings') +
        block('', 'How it works', '', tiles(CONFIG.process, 4)) +
        block('', 'Service styles', '', tiles(CONFIG.serviceStyles, 4)) +
        block('', 'What is included', '',
          tiles(CONFIG.included, 3),
          '<p class="tmc-block-note">' + CONFIG.includedNote + '</p>') +
        block('', 'Dietary needs', CONFIG.dietaryNote) +
        menusBlock() +
        contactBand('weddings');
    },

    corporate: function () {
      return pageHero('corporate') +
        block('', 'What we cater', '', tiles(CONFIG.corporateTypes, 4)) +
        block('', 'How it works', '', tiles(CONFIG.process, 4)) +
        block('', 'Service styles', '', tiles(CONFIG.corporateStyles, 5)) +
        block('', 'What is included', '',
          tiles(CONFIG.included, 3),
          '<p class="tmc-block-note">' + CONFIG.includedNote + '</p>') +
        block('', 'Dietary needs', CONFIG.dietaryNote) +
        menusBlock() +
        contactBand('corporate');
    },

    events: function () {
      return pageHero('events') +
        block('', 'Event types', '', tiles(CONFIG.eventTypes, 2)) +
        block('', 'How it works', '', tiles(CONFIG.process, 4)) +
        block('', 'Service styles', '', tiles(CONFIG.serviceStyles, 4)) +
        block('', 'What is included', '',
          tiles(CONFIG.included, 3),
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

    contact: function (params) {
      /* The three steps of the form. The order they appear in depends on
         how the visitor arrived: from a Book button the event type is
         already chosen, so The event leads as before. Opened plain, the
         easy step comes first: a name and an email before any question
         that needs thinking about, which is where people were leaving. */
      const eventStep =
        '<div class="tmc-form-step">' +
          '<h3>The event</h3>' +
          '<div class="tmc-form-field"><label for="f-event-type">Event type</label>' +
            '<select id="f-event-type" name="event_type" required>' + options(CONFIG.contactForm.eventTypes) + '</select></div>' +
          '<div class="tmc-form-field"><label for="f-style">Service style</label>' +
            '<select id="f-style" name="service_style" required>' + options(CONFIG.contactForm.serviceStyles) + '</select></div>' +
          /* Shown only for a vending enquiry. Disabled while hidden so
             the fields do not post empty values. */
          '<div class="tmc-vending-only" id="f-vending" hidden>' +
            '<div class="tmc-form-field"><label for="f-attendance">Expected attendance</label>' +
              '<input id="f-attendance" name="attendance" type="text" disabled></div>' +
            '<div class="tmc-form-field"><label for="f-hours">Load-in and service hours</label>' +
              '<input id="f-hours" name="service_hours" type="text" disabled></div>' +
            '<div class="tmc-form-field"><label for="f-power">Power and water on site</label>' +
              '<select id="f-power" name="power_water" disabled>' + options(CONFIG.contactForm.powerWater) + '</select></div>' +
          '</div>' +
          '<div class="tmc-form-field"><label for="f-date">Date</label><input id="f-date" name="date" type="text" placeholder="Date or flexible"></div>' +
          '<div class="tmc-form-field"><label for="f-location">Location</label><input id="f-location" name="location" type="text" placeholder="Venue, neighborhood, or TBD"></div>' +
          '<div class="tmc-form-field"><label for="f-guests">Guest count</label><select id="f-guests" name="guests"><option>Under 25</option><option>25 to 50</option><option>50 to 100</option><option>100 to 200</option><option>200 to 500</option><option>More than 500</option></select></div>' +
        '</div>';
      const detailsStep =
        '<div class="tmc-form-step">' +
          '<h3>Details</h3>' +
          '<div class="tmc-form-field"><label for="f-dietary">Dietary needs and allergies</label><textarea id="f-dietary" name="dietary" rows="3"></textarea></div>' +
          '<div class="tmc-form-field"><label for="f-budget">Budget (optional)</label><input id="f-budget" name="budget" type="text"></div>' +
        '</div>';
      const contactStep =
        '<div class="tmc-form-step">' +
          '<h3>Contact</h3>' +
          '<div class="tmc-form-field"><label for="f-name">Name</label><input id="f-name" name="name" type="text" required></div>' +
          '<div class="tmc-form-field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" required></div>' +
          '<div class="tmc-form-field"><label for="f-phone">Phone</label><input id="f-phone" name="phone" type="tel"></div>' +
          '<div class="tmc-form-field"><label for="f-notes">Additional notes</label><textarea id="f-notes" name="notes" rows="3"></textarea></div>' +
        '</div>';
      /* The status line and the button always close the last step. */
      const tail =
        '<p class="tmc-form-status" role="alert" aria-live="assertive" hidden></p>' +
        '<button type="submit" class="tmc-form-submit">Send inquiry</button>';
      const prefilled = !!(params && CONFIG.contactForm.typeFromQuery[params.type]);
      const steps = prefilled
        ? [eventStep, detailsStep, contactStep]
        : [contactStep, eventStep, detailsStep];
      const last = steps.length - 1;
      steps[last] = steps[last].replace(/<\/div>$/, tail + '</div>');

      return (
        pageHero('contact') +
        '<section class="tmc-contact-block">' +
          '<div class="tmc-contact-grid">' +
            '<div class="tmc-contact-card"><div class="tmc-contact-label">Email</div><p class="tmc-contact-value"><a href="mailto:' + B.email + '">' + B.email.replace('@', '<wbr>@') + '</a></p></div>' +
            '<div class="tmc-contact-card"><div class="tmc-contact-label">Call or text</div><p class="tmc-contact-value"><a href="' + B.phoneHref + '">' + B.phone + '</a></p></div>' +
          '</div>' +
        '</section>' +
        '<section class="tmc-body">' +
          /* BOOKING ENQUIRY form. Shares the one endpoint with the drop-off
             order form on #/order; form_source="contact" is what separates
             the two in the spreadsheet and the inbox. */
          '<form class="tmc-form" id="tmc-inquiry-form" autocomplete="on">' +
            '<input type="hidden" name="form_source" value="contact">' +
            /* Honeypot. Off screen rather than display:none, so a
               bot still sees a fillable field, and out of the tab order so a
               person never lands on it. */
            '<input class="tmc-hp" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">' +
            steps.join('') +
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
            /* The only break the address is allowed. wbr offers the
               opportunity before the @; the stylesheet forbids every other
               one, so it reads whole or splits into local part and domain,
               never mid word. */
            '<a href="mailto:' + B.email + '">' +
              B.email.replace('@', '<wbr>@') + '</a>' +
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

  /* Preselect from the query a Book button carried. Anything unrecognised
     is ignored and the form simply opens plain. */
  function applyPrefill(params) {
    const form = CONFIG.contactForm;
    const pick = function (id, wanted) {
      if (!wanted) return;
      const el = document.getElementById(id);
      if (!el) return;
      for (let i = 0; i < el.options.length; i++) {
        if (el.options[i].textContent === wanted) { el.selectedIndex = i; return; }
      }
    };
    pick('f-event-type', form.typeFromQuery[params.type]);
    pick('f-style', form.styleFromQuery[params.style]);
    syncVendingFields();
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

  /* === STICKY ACTION BAR ===
     Mobile only, and only on the pages where a visitor is deciding. It
     appears once the hero is behind them and hides again as the footer
     arrives, so it never sits over the footer. Under reduced motion it is
     simply present from the start, with no transition. */
  const STICKY_ROUTES = ['weddings', 'corporate', 'events', 'vending', 'menus'];
  let stickyScrollHandler = null;
  let glowScrollHandler = null;

  /* === HERO GLOW ===
     Home only. The wash is a CSS pseudo-element; all this does is write
     --hero-glow so it fades out as the hero leaves. Under reduced motion no
     handler is bound at all and the stylesheet's fallback holds it at full
     strength, which is a static glow rather than a missing one. */
  function setupHeroGlow() {
    if (glowScrollHandler) {
      window.removeEventListener('scroll', glowScrollHandler);
      window.removeEventListener('resize', glowScrollHandler);
      glowScrollHandler = null;
    }
    const hero = main.querySelector('.tmc-hero');
    if (!hero) return;
    if (prefersReducedMotion()) {
      hero.style.setProperty('--hero-glow', '1');
      return;
    }
    const update = function () {
      const r = hero.getBoundingClientRect();
      const travel = (r.height || 1) * 0.7;
      let t = 1 - (-r.top) / travel;
      t = t < 0 ? 0 : (t > 1 ? 1 : t);
      hero.style.setProperty('--hero-glow', t.toFixed(3));
    };
    glowScrollHandler = update;
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  function setupStickyBar(route) {
    if (stickyScrollHandler) {
      window.removeEventListener('scroll', stickyScrollHandler);
      window.removeEventListener('resize', stickyScrollHandler);
      stickyScrollHandler = null;
    }
    const existing = document.getElementById('tmc-sticky-bar');
    if (existing) existing.remove();
    if (STICKY_ROUTES.indexOf(route) === -1) return;

    const cfg = CONFIG.cta.buttons[route] || {};
    const bar = document.createElement('div');
    bar.id = 'tmc-sticky-bar';
    bar.className = 'tmc-sticky-bar';
    bar.innerHTML =
      '<a class="tmc-btn tmc-btn-primary" href="' + bookHref(cfg) + '" data-nav="contact">Book</a>' +
      (CONFIG.stickyBookOnly.indexOf(route) === -1
        ? '<a class="tmc-btn tmc-btn-secondary" href="#/order" data-nav="order">Order</a>'
        : '');
    document.body.appendChild(bar);

    const hero = main.querySelector('.tmc-page-hero');
    const foot = main.querySelector('.tmc-footer');

    /* Read geometry rather than trusting an observer's opinion. The bar
       shows once the hero is above the fold and hides the moment the
       footer appears, so it can never sit over the footer. */
    const update = function () {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const heroR = hero ? hero.getBoundingClientRect() : null;
      const footR = foot ? foot.getBoundingClientRect() : null;
      const pastHero = !heroR || heroR.bottom <= 0;
      const footerInView = !!footR && footR.top < vh;
      bar.classList.toggle('is-shown', pastHero && !footerInView);
    };

    if (prefersReducedMotion()) {
      /* A static bar, no reveal and no transition. It still steps aside
         for the footer. */
      const staticUpdate = function () {
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const footR = foot ? foot.getBoundingClientRect() : null;
        bar.classList.toggle('is-shown', !(footR && footR.top < vh));
      };
      stickyScrollHandler = staticUpdate;
      staticUpdate();
    } else {
      stickyScrollHandler = update;
      update();
    }

    window.addEventListener('scroll', stickyScrollHandler, { passive: true });
    window.addEventListener('resize', stickyScrollHandler);
  }

  /* === SCROLL REVEAL ===
     Sections and cards fade up as they enter the viewport, once each, with a
     small stagger between siblings. The hidden state is added by this code
     and never lives in the stylesheet, so with JavaScript off, or with
     IntersectionObserver missing, or under prefers-reduced-motion, every
     element is simply visible from the start. Only opacity and transform
     animate, so nothing reflows. */
  /* Sections whose top hairline draws in from the left. */
  const RULE_TARGETS = '.tmc-block, .tmc-primary-cta-band';

  /* One animation group per section. The group is what gets observed. */
  const GROUP_TARGETS = ['.tmc-why', '.tmc-section-header', '.tmc-services-wrap',
    '.tmc-wwd-section', '.tmc-block', '.tmc-primary-cta-band', '.tmc-menu-section',
    '.tmc-body', '.tmc-contact-block', '.tmc-page-hero'].join(',');

  /* Claimed last, so nothing in a group is left invisible. */
  const LEFTOVER_TARGETS = ['.tmc-block-cta', '.tmc-service-menu-link',
    '.tmc-cta-actions', '.tmc-menu-section-heading', '.tmc-page-rule'].join(',');

  let revealObserver = null;
  let enterTimer = null;

  /* The route the visitor was on before this one. Menus uses it to lead
     with the section that answers the page they came from. */
  let previousRoute = null;
  let currentRoute = null;

  function prefersReducedMotion() {
    return window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* Elements that lead a section and set its timing. */
  const KICKER_TARGETS = '.tmc-why-label, .tmc-section-label, .tmc-page-eyebrow,' +
    '.tmc-wwd-tile-label, .tmc-block-label, .tmc-primary-cta-label';
  const HEADING_TARGETS = 'h1, h2, .tmc-menu-section-title';
  const CARD_TARGETS = '.tmc-service-block, .tmc-wwd-tile, .tmc-block-item,' +
    '.tmc-list-item, .tmc-contact-card, .tmc-form-step, .tmc-menu-back-card';

  /* Splits a heading into one masked wrapper per rendered line, so each
     line can rise from behind its own mask. Words are wrapped, measured by
     their offsetTop, then regrouped; this has to happen after layout
     because where the lines fall depends on the width. Anything with
     element children is left alone, which is what keeps the animated
     wordmark out of this. */
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
      /* The leading space is KEPT, so the heading's textContent still reads
         as the original sentence. A space at the start of a block level
         line is collapsed away by normal white space processing, so it
         costs nothing visually. */
      inner.textContent = row.words.join('');
      line.appendChild(inner);
      el.appendChild(line);
    });
    el.dataset.tmcSplit = '1';
    return rows.length;
  }

  function setupReveal() {
    if (revealObserver) {
      revealObserver.disconnect();
      revealObserver = null;
    }
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) return;

    const rules = [].slice.call(main.querySelectorAll(RULE_TARGETS));
    rules.forEach(function (el) { el.classList.add('tmc-rule'); });

    /* Each section is one group: it is observed as a whole and its parts
       are given delays relative to each other, so a kicker, its heading and
       its paragraphs read as one gesture rather than three. */
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

      /* Body copy follows the heading, each paragraph 60ms behind the last. */
      let bi = 0;
      [].forEach.call(group.querySelectorAll('p, .tmc-block-note, .tmc-list-item-desc,' +
        '.tmc-service-styles, .tmc-page-styles, .tmc-menu-item-desc'), function (b) {
        if (b.closest('.tmc-anim-card') || b.closest('.tmc-menu-item')) return;
        b.classList.add('tmc-anim-fade', 'is-pre');
        b.style.setProperty('--d', (base + bi * 60) + 'ms');
        bi++;
      });

      /* Cards draw their frame, then fill. Siblings in a row follow 90ms
         apart. */
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

      /* Menu dishes run in sequence, capped so a long menu never feels
         like it is loading. */
      let di = 0;
      [].forEach.call(group.querySelectorAll('.tmc-menu-item'), function (dish) {
        dish.classList.add('tmc-anim-dish', 'is-pre');
        dish.style.setProperty('--d', (base + Math.min(di, 14) * 40) + 'ms');
        di++;
      });

      /* Anything the classifier did not claim still fades in, so nothing is
         ever left invisible. */
      [].forEach.call(group.querySelectorAll(LEFTOVER_TARGETS), function (el) {
        if (el.classList.contains('tmc-anim-kicker') ||
            el.classList.contains('tmc-anim-fade') ||
            el.classList.contains('tmc-anim-card') ||
            el.classList.contains('tmc-anim-dish') ||
            el.closest('.tmc-anim-card') ||
            el.querySelector('.tmc-anim-line')) return;
        el.classList.add('tmc-reveal', 'is-pre');
        el.style.setProperty('--d', base + 'ms');
      });
    });

    const all = groups.concat(rules);

    revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        play(entry.target);
        obs.unobserve(entry.target);
        /* Release the masks once the lines have arrived, so a later
           reflow can never clip a descender. */
        const lines = entry.target.querySelectorAll('.tmc-anim-line');
        if (lines.length) {
          setTimeout(function () {
            [].forEach.call(lines, function (l) { l.classList.add('is-done'); });
          }, 1400);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -6% 0px' });

    all.forEach(function (el) { revealObserver.observe(el); });

    /* Failsafe, measured rather than assumed. A working observer reveals
       whatever is on screen within a frame. If a group is still hidden
       while its box sits inside the viewport, the observer is not doing its
       job here, so drop it and show everything. Text must never be left
       invisible waiting on an API.

       It cannot give up after one look. On Home the hero fills the
       viewport, so at 600ms no group is on screen yet and there is nothing
       to judge. The check therefore repeats on scroll until either the
       observer proves itself by revealing something, or it does not and
       everything is shown. */
    /* Playing a group means taking the pre state off its parts. What is
       left is each element's ordinary CSS, so a group that has played can
       never be invisible, whatever happens to transitions afterwards. */
    const play = function (group) {
      group.classList.add('is-in');
      const pre = group.querySelectorAll('.is-pre');
      [].forEach.call(pre, function (el) { el.classList.remove('is-pre'); });
      if (group.classList.contains('is-pre')) group.classList.remove('is-pre');
      const lines = group.querySelectorAll('.tmc-anim-line');
      if (lines.length) {
        setTimeout(function () {
          [].forEach.call(lines, function (l) { l.classList.add('is-done'); });
        }, 1400);
      }
    };

    /* Last line of defence. Whatever the observer, the failsafe or a
       transition does, nothing stays marked pre for more than three
       seconds. Transitions are suspended for the swap so the element lands
       on its final value in one step: starting a transition here would
       just hand the problem to an animation clock that may be throttled
       for content the browser is not painting. */
    const ANIMATED = '.tmc-anim-fade, .tmc-anim-dish, .tmc-anim-kicker, .tmc-reveal,' +
      '.tmc-anim-card, .tmc-anim-card > *, .tmc-anim-line > span';
    setTimeout(function () {
      const parts = [].slice.call(main.querySelectorAll(ANIMATED));
      const pre = [].slice.call(main.querySelectorAll('.is-pre'));
      if (!parts.length && !pre.length) return;
      /* Transitions are suspended for the swap, so every element lands on
         its final value in one step. Removing the pre class on its own is
         not enough: that starts a transition, and a transition is only
         guaranteed to finish while the browser is actually painting the
         page. Anything mid flight is snapped to the end here instead. */
      parts.forEach(function (el) { el.style.transition = 'none'; });
      pre.forEach(function (el) { el.classList.remove('is-pre'); });
      void main.offsetWidth;
      /* setTimeout rather than requestAnimationFrame: a frame callback
         does not fire for a page the browser is not rendering, which is
         the very case this is here to cover. */
      setTimeout(function () {
        parts.forEach(function (el) { el.style.transition = ''; });
      }, 60);
    }, 3000);

    let verified = false;
    const revealAll = function () {
      if (revealObserver) { revealObserver.disconnect(); revealObserver = null; }
      all.forEach(play);
      window.removeEventListener('scroll', verify);
    };
    const verify = function () {
      if (verified) return;
      if (all.some(function (el) { return el.classList.contains('is-in'); })) {
        /* something was revealed, so the observer works here */
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

  /* === ROUTER === */
  /* #/contact?type=wedding splits into a route and its parameters. */
  function parseHash() {
    const raw = window.location.hash.replace(/^#\//, '').replace(/^#/, '');
    const cut = raw.indexOf('?');
    const route = (cut === -1 ? raw : raw.slice(0, cut)) || 'home';
    const params = {};
    if (cut > -1) {
      raw.slice(cut + 1).split('&').forEach(function (pair) {
        if (!pair) return;
        const eq = pair.indexOf('=');
        const key = decodeURIComponent(eq === -1 ? pair : pair.slice(0, eq));
        const val = eq === -1 ? '' : decodeURIComponent(pair.slice(eq + 1));
        if (key) params[key] = val;
      });
    }
    return { route: route === '/' ? 'home' : route, params: params };
  }

  function getRouteFromHash() {
    return parseHash().route;
  }

  function render(route, params) {
    /* Retired route: rewrite the address bar, which fires hashchange and
       brings us straight back here with the current route. */
    if (CONFIG.redirects[route]) {
      window.location.replace(href(CONFIG.redirects[route]));
      return;
    }

    const page = pages[route] ? route : 'home';
    previousRoute = currentRoute;
    currentRoute = page;
    main.innerHTML = pages[page](params || {}) + footerHtml();
    /* The outgoing page has already faded; this brings the new one up. */
    main.classList.remove('is-leaving');
    if (!prefersReducedMotion()) {
      main.classList.remove('is-entering');
      void main.offsetWidth;            /* restart the animation */
      main.classList.add('is-entering');
      /* Taken off again once it has played. Leaving it on would keep an
         animation rule pointed at every top level section for the life of
         the page, which is how a section ends up stuck at its from state. */
      if (enterTimer) clearTimeout(enterTimer);
      enterTimer = setTimeout(function () {
        enterTimer = null;
        main.classList.remove('is-entering');
      }, 480);
    }
    renderNav(page);
    applyLeadTime();
    applyPrefill(params || {});
    setupStickyBar(page);
    setupHeroGlow();
    setupReveal();
    /* Drives the per route ground tint in the stylesheet. */
    if (shell) shell.setAttribute('data-route', page);
    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: 'instant' });

    /* A hash route swaps the document without a page load, so nothing moves
       focus on its own. Without this a keyboard or screen reader visitor is
       left wherever the old page had them, usually mid-nav, and hears
       nothing about the page they just opened. Prefer the h1 so the new
       page announces itself by name; fall back to main. Neither is in the
       tab order, so the next Tab still lands on the first real control. */
    const heading = main.querySelector('h1');
    const target = heading || main;
    if (heading && !heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    if (page === 'home') setTimeout(animateBrand, 50);
    document.title = CONFIG.titles[page] || CONFIG.titles.home;
    setMeta('description', CONFIG.descriptions[page] || CONFIG.descriptions.home);
  }

  /* === FORM HANDLER ===
     One shared submit path for every form on the site. Everything the
     request needs travels in the form itself, including the hidden
     form_source, so this function never needs a per-form field list. */

  /* The subject of the fallback email, by form. */
  const MAILTO_SUBJECTS = {
    contact: 'New inquiry from tastemakerscollective.us',
    order: 'New drop-off order request'
  };

  /* Every field the form would post, as one object of strings. FormData
     already leaves out disabled controls, which is how the vending-only
     questions stay out of a non-vending enquiry. */
  function formToObject(form) {
    const data = {};
    new FormData(form).forEach(function (value, key) {
      data[key] = typeof value === 'string' ? value : String(value);
    });
    return data;
  }

  /* Builds a prefilled mailto from whatever visible fields the form has, so
     a failed request still gets the visitor's answers to us. */
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

    if (button) {
      button.disabled = true;
      button.textContent = 'Sending';
    }
    if (status) {
      status.hidden = true;
      status.textContent = '';
    }

    /* One submit path for both forms. Which form this is rides along in the
       hidden form_source field, so nothing here is per-form. JSON as a
       plain string and no Content-Type header: see FORM_ENDPOINT. */
    const payload = JSON.stringify(formToObject(form));

    /* Success needs a reply that parses and says ok. A network error, a
       non-2xx status, a body that is not JSON, ok:false, or no reply within
       15 seconds all land in the catch below. The fetch is aborted on
       timeout where the browser supports it; the race covers the rest. */
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    let timer = null;
    const timedOut = new Promise(function (ignore, reject) {
      timer = setTimeout(function () {
        if (controller) controller.abort();
        reject(new Error('No response within 15 seconds'));
      }, 15000);
    });
    const request = fetch(FORM_ENDPOINT, {
      method: 'POST',
      body: payload,
      signal: controller ? controller.signal : undefined
    });
    /* If the race loses on timeout, the aborted fetch still rejects later;
       this keeps that from surfacing as an unhandled rejection. */
    request.catch(function () {});

    Promise.race([request, timedOut])
      .then(function (response) {
        if (!response.ok) throw new Error('Form endpoint returned ' + response.status);
        return response.json();
      })
      .then(function (reply) {
        if (!reply || reply.ok !== true) {
          throw new Error(reply && reply.error ? reply.error : 'Form endpoint did not confirm');
        }
        /* The form is replaced, so focus would fall back to body and a
           screen reader would hear nothing. Announce the message and put
           focus on it, so the next Tab continues from here. */
        const host = form.parentNode;
        host.innerHTML =
          '<div class="tmc-form-success" role="status" aria-live="polite" tabindex="-1">' +
            '<h3>Thanks. We&rsquo;ll get back to you soon.</h3>' +
          '</div>';
        const done = host.querySelector('.tmc-form-success');
        if (done) done.focus({ preventScroll: true });
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
      })
      .then(function () { clearTimeout(timer); });
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

  document.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'f-event-type') syncVendingFields();
  });

  document.addEventListener('submit', function (e) {
    if (!e.target || !e.target.classList.contains('tmc-form')) return;
    e.preventDefault();
    handleFormSubmit(e.target);
  });

  /* === INIT === */
  /* On navigation the outgoing page fades before the new one is built, so
     routes feel connected rather than snapping. Under reduced motion the
     swap is immediate. The delay is short enough that nothing waits on it:
     120ms is below the threshold where a tap stops feeling instant. */
  let leaveTimer = null;
  window.addEventListener('hashchange', function () {
    const parsed = parseHash();
    if (prefersReducedMotion()) {
      render(parsed.route, parsed.params);
      return;
    }
    if (leaveTimer) clearTimeout(leaveTimer);
    main.classList.add('is-leaving');
    leaveTimer = setTimeout(function () {
      leaveTimer = null;
      render(parsed.route, parsed.params);
    }, 120);
  });

  window.addEventListener('resize', syncNavHeight);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncNavHeight);
  }

  const first = parseHash();
  render(first.route, first.params);
  syncNavHeight();
})();
