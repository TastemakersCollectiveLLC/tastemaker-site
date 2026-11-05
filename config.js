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
  var META_VERIFICATION = '';
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
      serviceArea: 'Los Angeles and Southern California',
      tagline: 'Custom menus for every event and every diet.',
      /* The display form. The tel: and sms: hrefs are derived from its
         digits below, so the three can never disagree. */
      phone: '(213) 293-8518',
      email: 'hello@tastemakerscollective.us',
      /* Street address, when there is one to publish. Empty means the
         structured data carries the city and state only. */
      address: '',
      /* Public profiles. Each one renders as a footer link under Connect
         and joins sameAs in the structured data only when it is filled in.
         Paste the full https:// profile URL. */
      /* TODO: handle to be supplied. */
      INSTAGRAM_URL: '',
      /* TODO: handle to be supplied. */
      FACEBOOK_URL: '',
      /* TODO: handle to be supplied. */
      LINKEDIN_URL: ''
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
      { route: 'onSet', label: 'On set' },
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
      about: 'About Tastemakers Collective',
      contact: 'Contact Tastemakers Collective',
      reviews: 'Reviews',
      onSet: 'Production and on set catering in Los Angeles',
      vegan: 'Vegan catering in Los Angeles',
      glutenFree: 'Gluten-free catering in Los Angeles',
      notFound: 'Page not found'
    },

    titles: {
      home: 'Tastemakers Collective | Catering and Events in Los Angeles'
    },

    /* Home's h1 is the wordmark plus this line, set under COLLECTIVE in
       the small amethyst capitals, so the heading names the service and
       the city. Chosen by Danny 9/26/2026, option A. */
    homeH1Line: 'Catering and events in Los Angeles',

    /* One meta description per page, 120 to 155 characters, built only
       from copy already on the site. The build asserts the length. */
    descriptions: {
      home: 'A Los Angeles catering and events company. Custom menus for every event and every diet: weddings, corporate events, festivals and drop-off catering.',
      order: 'Drop-off catering from Tastemakers Collective in Los Angeles. Pick a date, a delivery window and a guest count. Delivered ready to serve.',
      weddings: 'Wedding catering in Los Angeles. Custom menus, a tasting once booked, full service in any style. Every dietary need handled dish by dish.',
      corporate: 'Corporate catering in Los Angeles. Office lunch delivered, meetings, company parties and client dinners. Every dish labeled for dietary needs.',
      events: 'Catering for private parties, celebrations and milestones in Los Angeles. Custom menus and full service. Built around any dietary needs and allergies.',
      vending: 'Festival vending and event hospitality. Food vending, staff meals and artist hospitality, with our own setup, staff and equipment.',
      about: 'Tastemakers Collective is a Los Angeles catering and events company working across Southern California and festivals across the state.',
      contact: 'Contact Tastemakers Collective about catering, events, festival vending or drop-off catering in Los Angeles. Call or text (213) 293-8518.',
      onSet: 'Production catering in Los Angeles. Crew breakfast and lunch delivered to location on your schedule, labeled for every diet. COI on request.',
      vegan: 'Vegan catering in Los Angeles. Custom menus for every event and every diet. Built around any dietary needs and allergies.',
      glutenFree: 'Gluten-free catering in Los Angeles. Custom menus for every event and every diet. Built around any dietary needs and allergies.',
      reviews: 'Reviews from Tastemakers Collective clients. Cooked an event with us? We would love to hear from you. Catering and events in Los Angeles.'
    },

    /* Interior page heroes: eyebrow, one supporting line, and the small
       amethyst styles row on the service pages. The heading is h1 above. */
    heroes: {
      order: {
        eyebrow: 'Order',
        intro: 'Drop-off catering for offices and gatherings. Boxed meals or pans, delivered ready to serve.'
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
        intro: 'Tell us about your event and we&rsquo;ll get back to you. Serving Los Angeles and Southern California.'
      },
      reviews: {
        eyebrow: 'Reviews',
        intro: 'Reviews from our clients. Cooked an event with us? We would love to hear from you.'
      },
      onSet: {
        eyebrow: 'On set',
        intro: 'Crew meals delivered to location on your schedule.'
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
      events: '',
      vending: ''
    },

    /* ============================================
       PAGE SECTIONS, Danny's copy, in page order
       Each section is a heading with a paragraph, a list, or both, and an
       optional button. A list item written "Label: text" shows the label
       in white. Rendered by sections() in build/templates.js.
       ============================================ */
    weddingsPage: [
      { heading: 'How we work',
        list: [
          'Inquiry: send the date, the venue, the guest count and any dietary needs.',
          'Consultation: a call to talk through the food, the service style and how the day runs. The consultation and the custom menu are free.',
          'Custom menu and quote: we write a menu for your wedding and send a quote.',
          'Tasting: a tasting is available once you book.'
        ] },
      { heading: 'Service styles',
        body: 'Plated, family style, buffet or stations. Any of them, or a mix across the evening.' },
      { heading: 'What is included',
        list: [
          'A menu written for your wedding',
          'Chef team and service staff through the event',
          'Our own cooking equipment, setup and breakdown',
          'Bar service as an add-on: bartenders and house-made mixers; you supply the alcohol'
        ] },
      { heading: 'Dietary needs',
        body: 'Every menu is built around your guests. Vegan, gluten free and dairy free options are on every menu, every dish is labeled on the day, and halal is available on request.' },
      { heading: 'Deposit and timing',
        list: [
          'A 50% deposit holds the date.',
          'Events booked on short notice are paid in full at signing.'
        ] }
    ],

    onSetPage: [
      { heading: 'What we do',
        list: [
          'Walking breakfast at call',
          'Hot lunch or boxed lunch within the meal window',
          'Artist and talent hospitality'
        ] },
      { heading: 'How it runs',
        list: [
          'You send call time, meal time, crew count, location and dietary counts.',
          'We deliver to location and set, or stay and serve.',
          'Every dish is labeled for dietary needs and allergens.',
          'Meals are timed to your meal window.'
        ] },
      { heading: 'Dietary needs',
        body: 'Vegan, gluten free and dairy free options are built into every crew menu. Allergen counts from your sheet are matched dish by dish.' },
      { heading: 'Insurance and permits',
        body: 'General liability insurance with a certificate naming the production as additional insured, available on request. Permitted by LA County Public Health. Prepared in a permitted commercial kitchen.' }
    ],

    /* The On set quote form, posted with form_source onset. */
    onSetForm: {
      projectTypes: ['Music video', 'Photo shoot', 'Commercial', 'Branded content', 'Film or TV', 'Other'],
      union: ['Union', 'Non-union', 'Not sure'],
      powerWater: ['Yes', 'No', 'Not sure'],
      serviceStyles: ['Drop-off', 'Staffed buffet', 'Boxed meals', 'Walking breakfast']
    },

    corporatePage: [
      { heading: 'Office lunch',
        body: 'Lunch delivered to the office, ready to serve. Menus rotate so the team is not eating the same thing every week. Every dish is labeled for dietary needs and allergens. Send a request on the Order page.',
        button: { label: 'Order drop-off', href: '/order' } },
      { heading: 'Meetings and all-day events',
        body: 'Breakfast, lunch and breaks timed to the agenda. Delivered and set, or staffed through the day.' },
      { heading: 'Company events and client dinners',
        body: 'Holiday parties, launches, team dinners and client dinners, plated, family style, buffet or stations, cooked and served by our team.' },
      { heading: 'Dietary needs',
        body: 'Every menu is built around the dietary needs and allergies in the room. Vegan, gluten free and dairy free options are on every menu, every dish is labeled, and halal is available on request.' },
      /* TODO: minimum, lead time and starting price to be added when the lunch packages are published. */
      { heading: 'How ordering works',
        list: [
          'Drop-off: send a request on the Order page.',
          'Staffed events: send an inquiry with the date, place, guest count and dietary needs. We reply with a custom menu and a quote. The menu and consultation are free.'
        ] },
      /* TODO: bar package details and pricing to follow. */
      { heading: 'Bar',
        body: 'Bar service is available as an add-on. We provide bartenders and house-made mixers; you supply the alcohol from a shopping list we give you.' },
      { heading: 'Who cooks',
        body: 'Our kitchen is led by a chef with seventeen years in fine dining kitchens and more than a decade cooking for artist hospitality and crews at music festivals. Permitted by LA County Public Health, ServSafe certified, prepared in a permitted commercial kitchen.' }
    ],

    /* Home Who we are: the headline and paragraphs under the hero. */
    homeWho: {
      headline: 'A Los Angeles catering and events company.',
      body: [
        'We cook modern Italian food with California produce, for offices, weddings, private parties, productions on set and music festivals.',
        'Our specialty is food for people with dietary restrictions, cooked from whole foods. Vegan, gluten free and dairy free options are on every menu, every dish is labeled, and halal is available on request.',
        'Our kitchen is led by a chef with seventeen years in fine dining kitchens and more than a decade cooking for artist hospitality and crews at music festivals.'
      ]
    },

    /* Home services cards. Six, three by two on desktop. */
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
      },
      {
        route: 'onSet',
        title: 'On set',
        desc: 'Crew breakfast and lunch delivered to location on your schedule.',
        styles: 'Walking breakfast &nbsp;&middot;&nbsp; Hot lunch &nbsp;&middot;&nbsp; Boxed lunch'
      },
      {
        route: 'order',
        title: 'Drop-off',
        desc: 'Lunch for offices and gatherings in boxed meals or pans, delivered ready to serve.',
        styles: 'Boxed meals &nbsp;&middot;&nbsp; Pans'
      }
    ],

    /* The service list, as the structured data and llms.txt describe it. */
    serviceList: [
      { route: 'weddings', name: 'Wedding catering', desc: 'Custom menus and full service for weddings. Plated, family style, buffet or stations.' },
      { route: 'corporate', name: 'Corporate catering', desc: 'Office lunches, meetings and company events in Los Angeles.' },
      { route: 'events', name: 'Event catering', desc: 'Catering for private parties, celebrations and milestones.' },
      { route: 'vending', name: 'Festival vending and event hospitality', desc: 'Food vending, staff meals and artist hospitality at festivals and large events.' },
      { route: 'order', name: 'Drop-off catering', desc: 'Drop-off catering for offices and gatherings.' },
      { route: 'onSet', name: 'Production and on set catering', desc: 'Crew meals delivered to location on your schedule.' }
    ],

    /* The dietary pages: one paragraph each until the new menu lands,
       so no dish names appear anywhere on the site. */
    dietaryPages: [
      { route: 'vegan', name: 'Vegan catering', diet: 'https://schema.org/VeganDiet',
        body: 'Vegan, gluten free and dairy free options are on every menu and every dish is labeled for dietary needs and allergens. Tell us the dietary needs in the room and we build the menu around them.' },
      { route: 'glutenFree', name: 'Gluten-free catering', diet: 'https://schema.org/GlutenFreeDiet',
        body: 'Vegan, gluten free and dairy free options are on every menu and every dish is labeled for dietary needs and allergens. Tell us the dietary needs in the room and we build the menu around them.' }
    ],

    /* The subjects the business knows, for the structured data. */
    knowsAbout: ['Catering', 'Wedding catering', 'Corporate catering', 'Event catering', 'Festival food vending',
                 'Drop-off catering', 'Production catering', 'Vegan catering', 'Gluten-free catering',
                 'Dairy-free catering', 'Bar service'],

    /* Shared by Weddings and Events, which run the same process. */
    process: [
      { title: 'Inquiry', desc: 'You tell us the date, the place, the guest count and any dietary needs.' },
      { title: 'Consultation', desc: 'We talk through the food, the service style and how the day runs.' },
      { title: 'Custom menu', desc: 'We write a menu for your event and quote it. The menu and consultation are free.' },
      { title: 'Event day', desc: 'We handle the food and the service from start to finish.' }
    ],


    /* Three. "Cooking: We cook your food." was a tile that said nothing a
       catering page needs saying, and it was only there to make four. */
    included: [
      { title: 'Menu design', desc: 'A menu written for your event, not picked off a list.' },
      { title: 'Service staff', desc: 'Our staff serve the food through the event.' },
      { title: 'Setup and breakdown', desc: 'We set up our own equipment and break it down when we are done.' },
      { title: 'Bar service as an add-on', desc: 'Bartenders and house-made mixers; you supply the alcohol.' }
    ],

    /* The one line that replaces the service style definitions. */
    serviceStylesLine: 'Plated, family style, buffet or stations. Any of them, or a mix across the evening.',
    dietaryNote: 'Every menu is built around your guests. Vegan, gluten free and dairy free options are on every menu, every dish is labeled on the day, and halal is available on request.',

    /* Two, not three. A third "Milestones" tile repeated "anniversaries"
       from the tile beside it and existed only to fill a row. */
    eventTypes: [
      { title: 'Private parties', desc: 'Dinners and parties at home or at a venue.' },
      { title: 'Celebrations', desc: 'Birthdays, anniversaries and milestones.' }
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
      { title: 'Staff meals and meal tickets', desc: 'We feed your crew and staff.' },
      { title: 'Artist hospitality', desc: 'We cook for green rooms and artist areas.' }
    ],

    vendingPast: [
      { title: 'Warehouse music events', desc: 'Los Angeles' },
      { title: 'Outdoor pop-ups', desc: 'Los Angeles' }
    ],

    /* Drop-off order request. Lead time is in hours so the date picker can
       compute its own minimum. */
    order: {
      /* The one line above the form. */
      note: 'Send the details below and we reply with a menu and a quote. Orders need at least 48 hours notice.',
      leadTimeHours: 48,
      deliveryWindows: ['11:00', '11:30', '12:00', '12:30', '1:00'],
      guestCounts: ['Under 20', '20 to 30', '30 to 50', '50 to 75', '75 to 100', 'More than 100']
    },

    /* About. Company only, no personal credentials. */
    aboutWhatWeDo: [
      { title: 'Catering', desc: 'Custom menus cooked and served at your event.' },
      { title: 'Drop-off', desc: 'Boxed meals and pans delivered ready to serve.' },
      { title: 'On set', desc: 'Crew breakfast and lunch delivered to location.' },
      { title: 'Events', desc: 'Corporate events, private parties and celebrations.' },
      { title: 'Festival vending', desc: 'Food vending, staff meals and artist hospitality.' },
      { title: 'Bar service', desc: 'Bartenders and house-made mixers. You supply the alcohol.' },
      { title: 'Pop-ups', desc: 'One-night events we run ourselves.' },
      { title: 'Supper clubs', desc: 'Private dinners announced to our guest list.' }
    ],

    aboutWhoWeAre: 'Tastemakers Collective is a chef-driven catering, events and food vending company in Los Angeles cooking modern Italian food with California produce. Our specialty is food for people with dietary restrictions, cooked from whole foods. Our kitchen is led by a chef with seventeen years in fine dining kitchens in California and more than a decade cooking for artist hospitality, green rooms and crews at music festivals. We cook from a permitted commercial kitchen in Los Angeles.',
    /* No permit or policy numbers here. */
    aboutCredentials: [
      'Permitted by LA County Public Health',
      'ServSafe certified manager',
      '$2M general liability insurance, certificate available on request',
      'Licensed California LLC'
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
        reviews: 'Book your event.',
        vegan: 'Book your event.',
        glutenFree: 'Book your event.',
        onSet: 'Book production catering.'
      },
      buttons: {
        home:      { primary: 'Book', secondary: 'Order drop-off' },
        order:     { primary: 'Book' },
        weddings:  { primary: 'Book', type: 'wedding' },
        corporate: { primary: 'Book', secondary: 'Order drop-off', type: 'corporate' },
        events:    { primary: 'Book', secondary: 'Order drop-off', type: 'private-party' },
        vending:   { primary: 'Book', secondary: 'Order drop-off', type: 'vending', style: 'vending' },
        about:     { primary: 'Book' },
        reviews:   { primary: 'Book' },
        vegan:     { primary: 'Book' },
        onSet:     { primary: 'Book', type: 'production' },
        glutenFree: { primary: 'Book' }
      }
    },

    /* Phone sticky bar: the pages where a visitor is deciding. Every route
       in it gets Book; Order is dropped where drop-off is not what that
       visitor came for. */
    stickyRoutes: ['weddings', 'corporate', 'events', 'vending', 'onSet'],
    stickyBookOnly: ['weddings', 'onSet'],

    /* Contact form. The prefill maps turn a query value into the option a
       visitor would have picked, so a Book button carries its page's
       context. Anything not listed here is ignored and the form opens
       plain. */
    contactForm: {
      eventTypes: ['Wedding', 'Corporate event', 'Private party', 'Celebration',
                   'Festival or event vending', 'Production or on set', 'Other'],
      serviceStyles: ['Plated catering', 'Buffet catering', 'Family style catering',
                      'Action stations', 'Drop-off catering', 'Vending', 'Dry hire bar', 'Not sure yet'],
      guestCounts: ['Under 25', '25 to 50', '50 to 100', '100 to 200', '200 to 500', 'More than 500'],
      typeFromQuery: {
        wedding: 'Wedding',
        corporate: 'Corporate event',
        'private-party': 'Private party',
        celebration: 'Celebration',
        vending: 'Festival or event vending',
        production: 'Production or on set',
        other: 'Other'
      },
      styleFromQuery: {
        plated: 'Plated catering',
        buffet: 'Buffet catering',
        'family-style': 'Family style catering',
        stations: 'Action stations',
        'drop-off': 'Drop-off catering',
        vending: 'Vending',
        bar: 'Dry hire bar'
      },
      /* The extra questions a vending enquiry needs. */
      vendingType: 'Festival or event vending',
      powerWater: ['Yes', 'No', 'Not sure']
    },

    /* Contact page FAQ. Decided facts only; rendered below the form and
       carried as FAQPage structured data on /contact alone. */
    faq: [
      { q: 'How does booking work?',
        a: 'Send an inquiry with the date, the place, the guest count and any dietary needs. We reply with a custom menu and a quote. The menu and consultation are free.' },
      { q: 'How does the deposit work?',
        a: 'A 50% deposit holds the date. Events booked on short notice are paid in full at signing.' },
      { q: 'Do you offer tastings?',
        a: 'A tasting is available once a wedding is booked.' },
      { q: 'Can you handle dietary restrictions and allergies?',
        a: 'That is our specialty. Vegan, gluten free and dairy free options are on every menu, every dish is labeled for dietary needs and allergens, and halal is available on request.' },
      { q: 'How does drop-off work?',
        a: 'Boxed meals or pans, delivered ready to serve. Send a request on the Order page at least 48 hours ahead.' },
      { q: 'Do you deliver plated food?',
        a: 'No. Nothing plated or assembled is delivered. Boards and spreads are built on site by our staff.' },
      { q: 'Do you offer bar service?',
        a: 'Yes, as an add-on. We provide bartenders and house-made mixers; you supply the alcohol from a shopping list we give you.' },
      { q: 'Where do you work?',
        a: 'Los Angeles and Southern California, plus festivals across California.' },
      { q: 'Can you provide a certificate of insurance?',
        a: 'Yes. We carry $2M general liability insurance and the certificate can name your event or production as additional insured.' }
    ],

    /* The review form. Enabled 11/4/2026: the deployed backend writes
       form_source review to the reviews tab and emails hello@. While
       enabled is false the page is noindex, unlinked, absent from the
       sitemap, and its controls are disabled. Reviews are published by
       hand only, never by anything automatic. */
    reviewForm: {
      enabled: true,
      ratings: ['5', '4', '3', '2', '1']
    },

    footer: {
      tagline: 'Custom menus for every event and every diet. Catering, events and festival vending across Los Angeles and Southern California.',
      columns: [
        {
          heading: 'Services',
          links: [
            { route: 'weddings', label: 'Weddings' },
            { route: 'corporate', label: 'Corporate' },
            { route: 'events', label: 'Events' },
            { route: 'vending', label: 'Vending' },
            { route: 'onSet', label: 'On set' },
            { route: 'order', label: 'Order' },
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
            { route: 'reviews', label: 'Reviews' },
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
    META_VERIFICATION: META_VERIFICATION,
    INDEXNOW_KEY: INDEXNOW_KEY
  };
});
