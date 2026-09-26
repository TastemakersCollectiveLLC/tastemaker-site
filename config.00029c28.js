/* ============================================
   TASTEMAKERS COLLECTIVE
   CONFIG: every editable piece of the site, in one object

   Read by two things. The build (build/build.js, Node) renders every page
   from it, so a copy edit here changes the HTML on the next build. The
   browser (script.js) reads it for the form endpoint, the sticky bar, the
   contact prefill and the analytics constants. Change copy here and
   nowhere else, then run the build.

   Loads as window.TMC in a browser and as module.exports in Node.
   ============================================ */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TMC = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ============================================
     FORM ENDPOINT
     ONE endpoint, shared by every form: the Google Apps Script web app in
     apps-script/Code.gs, deployed from the hello@ Workspace. It writes
     every submission to a spreadsheet, one tab per form_source, and
     emails hello@tastemakerscollective.us. Nothing is ever dropped there:
     a honeypot hit is written and sent with a flag.

     The site posts JSON as a plain string with no Content-Type header, so
     the browser sends it as text/plain and makes no CORS preflight, which
     a web app cannot answer. Google replies with a redirect to
     script.googleusercontent.com carrying {"ok":true} or
     {"ok":false,"error":"..."}; fetch follows it.
     ============================================ */
  var FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyyHqJLrDdlsNhMX8yK0lq0hC232ooJ1g3FqA0oK34SsQrmTcpPQC_S30ENrFhWGEISTQ/exec';

  /* ============================================
     MEASUREMENT, gated
     Both empty on purpose. While either is empty nothing is loaded, no
     request is made and every tracking call is a no-op. Fill in the id
     and rebuild to switch one on.
     ============================================ */
  var GA4_ID = '';
  var META_PIXEL_ID = '';
  /* Google Search Console. Paste only the content value of the
     google-site-verification meta tag here; the build then writes the tag
     into every page head. Empty means no tag. */
  var GSC_VERIFICATION = '';
  /* IndexNow. The build hosts this key as /<key>.txt, which is how the
     search engines that share IndexNow confirm the site is ours, and
     build/indexnow.js submits the sitemap URLs with it after each push.
     Public by design; it grants nothing beyond announcing our own URLs. */
  var INDEXNOW_KEY = 'b02557f74d6091d7f396c794d077595e';

  var CONFIG = {
    /* The canonical origin. Canonical links, Open Graph URLs, the sitemap,
       the structured data and llms.txt all build from it. */
    siteUrl: 'https://www.tastemakerscollective.us',

    business: {
      name: 'Tastemakers Collective',
      legalName: 'Tastemakers Collective LLC',
      city: 'Los Angeles',
      /* The service area as it may be stated today. Danny supplies the
         full list later; until then it is Los Angeles only. */
      serviceArea: 'Los Angeles, CA',
      tagline: 'Custom menus for every event and every diet.',
      /* The display form. The tel: and sms: hrefs are derived from its
         digits below, so the three can never disagree. */
      phone: '(213) 293-8518',
      email: 'hello@tastemakerscollective.us',
      /* Street address, when there is one to publish. Empty means the
         structured data carries the city and state only. */
      address: '',
      /* Public profiles. Empty until the Instagram handle lands; the
         structured data carries sameAs as an empty list until then. */
      sameAs: []
    },

    /* The trust strip, on every page above the footer. Exact wording. */
    trust: [
      'Permitted by LA County Public Health.',
      'Prepared in a permitted commercial kitchen.',
      '$2M general liability insurance.',
      'ServSafe certified manager.',
      'Certificate of insurance available on request.'
    ],

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

    /* Retired hash routes. Printed cards, old links and search results
       still point at these, so the redirect script in every page head
       forwards each one to its closest current page. */
    redirects: {
      inquire: 'contact',
      'menu-catering': 'events',
      'menu-vending': 'vending',
      'menu-private-chef': 'contact'
    },

    /* One h1 per page, naming the service and the city. The page title is
       the h1 plus " | Tastemakers Collective", except Home, which keeps its
       own. The h1 is also the hero heading on every inner page. */
    h1: {
      home: 'Tastemakers Collective',
      weddings: 'Wedding catering in Los Angeles',
      corporate: 'Corporate catering in Los Angeles',
      events: 'Event catering in Los Angeles',
      vending: 'Festival and event food vending',
      order: 'Drop-off catering orders',
      menus: 'Menus',
      about: 'About Tastemakers Collective',
      contact: 'Contact Tastemakers Collective',
      reviews: 'Reviews',
      vegan: 'Vegan catering in Los Angeles',
      glutenFree: 'Gluten-free catering in Los Angeles',
      notFound: 'Page not found'
    },

    titles: {
      home: 'Tastemakers Collective | Catering and Events in Los Angeles'
    },

    /* One meta description per page, 120 to 155 characters, built only
       from copy already on the site. The build asserts the length. */
    descriptions: {
      home: 'A Los Angeles catering and events company. Custom menus for every event and every diet: weddings, corporate events, festivals and drop-off catering.',
      menus: 'Example menus from past Tastemakers Collective pop-ups and private dining. Every menu is custom. Built around any dietary needs and allergies.',
      order: 'Drop-off catering from Tastemakers Collective in Los Angeles. Pick a date, a delivery window and a guest count. Delivered ready to serve.',
      weddings: 'Wedding catering in Los Angeles. Custom menus, full service, plated, family style, buffet or stations. Built around any dietary needs and allergies.',
      corporate: 'Corporate catering in Los Angeles. Office lunches, meetings, company events and client dinners. Plated, family style, buffet, stations or drop-off.',
      events: 'Catering for private parties, celebrations and milestones in Los Angeles. Custom menus and full service. Built around any dietary needs and allergies.',
      vending: 'Festival vending and event hospitality. Food vending, staff meals and artist hospitality, with our own setup, staff and equipment.',
      about: 'Tastemakers Collective is a Los Angeles catering and events company working across Southern California and festivals across the state.',
      contact: 'Contact Tastemakers Collective about catering, events, festival vending or drop-off catering in Los Angeles. Call or text (213) 293-8518.',
      vegan: 'Vegan catering in Los Angeles. Custom menus for every event and every diet. Built around any dietary needs and allergies.',
      glutenFree: 'Gluten-free catering in Los Angeles. Custom menus for every event and every diet. Built around any dietary needs and allergies.',
      /* noindex while the form is disabled, so the length rule is not applied */
      reviews: 'Reviews for Tastemakers Collective, a Los Angeles catering and events company.'
    },

    /* Interior page heroes: eyebrow, one supporting line, and the small
       amethyst styles row on the service pages. The heading is h1 above. */
    heroes: {
      order: {
        eyebrow: 'Order',
        intro: 'Drop-off catering for offices and gatherings.'
      },
      weddings: {
        eyebrow: 'Weddings',
        intro: 'Custom menus and full service for your wedding day.',
        styles: 'Plated &nbsp;&middot;&nbsp; Family style &nbsp;&middot;&nbsp; Buffet &nbsp;&middot;&nbsp; Stations'
      },
      corporate: {
        eyebrow: 'Corporate',
        intro: 'Office lunches, meetings, company events and client dinners.',
        styles: 'Plated &nbsp;&middot;&nbsp; Family style &nbsp;&middot;&nbsp; Buffet &nbsp;&middot;&nbsp; Stations &nbsp;&middot;&nbsp; Drop-off'
      },
      events: {
        eyebrow: 'Events',
        intro: 'Private parties, celebrations and milestones.',
        styles: 'Plated &nbsp;&middot;&nbsp; Family style &nbsp;&middot;&nbsp; Buffet &nbsp;&middot;&nbsp; Stations'
      },
      vending: {
        eyebrow: 'Vending',
        intro: 'Food vending, staff meals and artist hospitality for festivals and events.',
        styles: 'Public vending &nbsp;&middot;&nbsp; Staff meals &nbsp;&middot;&nbsp; Artist hospitality'
      },
      about: {
        eyebrow: 'About',
        intro: 'Tastemakers Collective is a Los Angeles catering and events company. Custom menus for every event and every diet.'
      },
      contact: {
        eyebrow: 'Contact',
        intro: 'Tell us about your event and we&rsquo;ll get back to you. Serving Los Angeles.'
      },
      menus: {
        eyebrow: 'Menus',
        intro: 'Every menu is custom. These are examples from past events.'
      },
      reviews: {
        eyebrow: 'Reviews',
        intro: ''
      },
      /* The dietary pages: the tag word as the eyebrow, the tagline as the
         supporting line. */
      vegan: {
        eyebrow: 'Vegan',
        intro: 'Custom menus for every event and every diet.'
      },
      glutenFree: {
        eyebrow: 'Gluten free',
        intro: 'Custom menus for every event and every diet.'
      }
    },

    /* Danny's paragraphs for the service pages go here when they arrive,
       one per page, plain text. Empty means the page renders without the
       paragraph and nothing else changes. */
    /* Danny's allergy-handling sentences for the dietary pages. Empty means
       nothing renders; no allergen or cross-contact claim is ever made on
       his behalf. */
    allergyNote: {
      vegan: '',
      glutenFree: ''
    },

    pageCopy: {
      weddings: '',
      corporate: '',
      events: '',
      vending: ''
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
       before the visitor scrolls. Real dishes from the menus above, in
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

    /* The service list, as the structured data and llms.txt describe it. */
    serviceList: [
      { route: 'weddings', name: 'Wedding catering', desc: 'Custom menus and full service for weddings. Plated, family style, buffet or stations.' },
      { route: 'corporate', name: 'Corporate catering', desc: 'Office lunches, meetings and company events in Los Angeles.' },
      { route: 'events', name: 'Event catering', desc: 'Catering for private parties, celebrations and milestones.' },
      { route: 'vending', name: 'Festival vending and event hospitality', desc: 'Food vending, staff meals and artist hospitality at festivals and large events.' },
      { route: 'order', name: 'Drop-off catering', desc: 'Drop-off catering for offices and gatherings.' }
    ],

    /* The dietary pages. Each lists the dishes carrying its tag in the menus
       above, and nothing else. */
    dietaryPages: [
      { route: 'vegan', tag: 'Vegan', name: 'Vegan catering', diet: 'https://schema.org/VeganDiet' },
      { route: 'glutenFree', tag: 'Gluten free', name: 'Gluten-free catering', diet: 'https://schema.org/GlutenFreeDiet' }
    ],

    /* The subjects the business knows, for the structured data. */
    knowsAbout: ['Catering', 'Wedding catering', 'Corporate catering', 'Event catering', 'Festival food vending',
                 'Drop-off catering', 'Vegan catering', 'Gluten-free catering'],

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

    /* Vending. No rates anywhere, and no permit claims beyond the trust
       strip. The liability insurance line is the active general liability
       policy on file. Past events are event type and city only, with no
       artist, promoter or venue names. */
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
        menus: 'Book your event.',
        reviews: 'Book your event.',
        vegan: 'Book your event.',
        glutenFree: 'Book your event.'
      },
      buttons: {
        home:      { primary: 'Book', secondary: 'Order drop-off' },
        order:     { primary: 'Book' },
        weddings:  { primary: 'Book', secondary: 'Order drop-off', type: 'wedding' },
        corporate: { primary: 'Book', secondary: 'Order drop-off', type: 'corporate' },
        events:    { primary: 'Book', secondary: 'Order drop-off', type: 'private-party' },
        vending:   { primary: 'Book', secondary: 'Order drop-off', type: 'vending', style: 'vending' },
        about:     { primary: 'Book' },
        menus:     { primary: 'Book an event', secondary: 'Order drop-off' },
        reviews:   { primary: 'Book' },
        vegan:     { primary: 'Book' },
        glutenFree: { primary: 'Book' }
      }
    },

    /* Phone sticky bar: the pages where a visitor is deciding. Every route
       in it gets Book; Order is dropped where drop-off is not what that
       visitor came for. */
    stickyRoutes: ['weddings', 'corporate', 'events', 'vending', 'menus'],
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
      guestCounts: ['Under 25', '25 to 50', '50 to 100', '100 to 200', '200 to 500', 'More than 500'],
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

    /* The review form. enabled stays false until the reviews handler is
       published; while false the page is noindex, unlinked, absent from
       the sitemap, and its controls are disabled. */
    reviewForm: {
      enabled: false,
      ratings: ['5', '4', '3', '2', '1']
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
            { route: 'menus', label: 'Menus' },
            { route: 'vegan', label: 'Vegan catering' },
            { route: 'glutenFree', label: 'Gluten-free catering' }
          ]
        },
        {
          heading: 'Site',
          links: [
            { route: 'home', label: 'Home' },
            { route: 'about', label: 'About' },
            { route: 'contact', label: 'Contact' },
            { route: 'card', label: 'Card' }
          ]
        }
      ]
    }
  };

  /* One number, three forms. Everything after the country code is the
     display string stripped to digits: (213) 293-8518 -> +12132938518. */
  var B = CONFIG.business;
  B.phoneE164 = '+1' + B.phone.replace(/\D/g, '');
  B.phoneHref = 'tel:' + B.phoneE164;
  B.smsHref = 'sms:' + B.phoneE164;

  return {
    CONFIG: CONFIG,
    FORM_ENDPOINT: FORM_ENDPOINT,
    GA4_ID: GA4_ID,
    META_PIXEL_ID: META_PIXEL_ID,
    GSC_VERIFICATION: GSC_VERIFICATION,
    INDEXNOW_KEY: INDEXNOW_KEY
  };
});
