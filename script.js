/* ============================================
   TASTEMAKER COLLECTIVE
   Client-side router and page templates
   ============================================ */

(function () {
  'use strict';

  const main = document.getElementById('tmc-main');
  const mobileMenu = document.getElementById('tmc-mobile-menu');
  const mobileToggle = document.getElementById('tmc-mobile-toggle');

  mobileToggle.addEventListener('click', function () {
    const open = mobileMenu.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', String(open));
  });

  /* === BRAND ANIMATION === */
  function animateBrand() {
    const word1 = 'TASTEMAKER';
    const word2 = 'Collective';
    const line1 = document.getElementById('brand-line-1');
    const line2 = document.getElementById('brand-line-2');
    if (!line1 || !line2) return;
    line1.innerHTML = word1
      .split('')
      .map(function (c, i) {
        return '<span style="animation-delay:' + (i * 0.05) + 's">' + c + '</span>';
      })
      .join('');
    line2.innerHTML = word2
      .split('')
      .map(function (c, i) {
        return '<span style="animation-delay:' + (0.6 + i * 0.04) + 's">' + c + '</span>';
      })
      .join('');
  }

  /* === PAGE TEMPLATES === */
  const pages = {
    home: function () {
      return (
        '<section class="tmc-hero">' +
          '<div class="tmc-brand-stack">' +
            '<div class="tmc-brand-line" id="brand-line-1"></div>' +
            '<div class="tmc-brand-line line-2" id="brand-line-2"></div>' +
            '<div class="tmc-brand-underline"></div>' +
          '</div>' +
          '<div class="tmc-hero-tagline">We make memorable experiences through cuisine.</div>' +
          '<div class="tmc-hero-sub">Los Angeles</div>' +
        '</section>' +

        '<section class="tmc-why">' +
          '<div class="tmc-why-label">Why we exist</div>' +
          '<h2 class="tmc-why-headline">Events are made of memory.<br>The food should match.</h2>' +
          '<p class="tmc-why-body">Our team\'s training runs through Michelin-awarded kitchens, and we bring that level of care and intentionality to every event we work. Music festivals, corporate activations, weddings, and private dinners alike.</p>' +
          '<p class="tmc-why-body">We go above and beyond to make sure every bite becomes part of the memory. Custom-curated menus. Intentional sourcing. Real cooking for the rooms and fields that don\'t usually get it.</p>' +
        '</section>' +

        '<section class="tmc-credibility">' +
          '<div class="tmc-credibility-inner">' +
            '<div class="tmc-cred-item">' +
              '<div class="tmc-cred-label">Training</div>' +
              '<div class="tmc-cred-text">Michelin-awarded kitchens</div>' +
            '</div>' +
            '<div class="tmc-cred-item">' +
              '<div class="tmc-cred-label">Experience</div>' +
              '<div class="tmc-cred-text">Decades catering artist green rooms at music events</div>' +
            '</div>' +
            '<div class="tmc-cred-item">' +
              '<div class="tmc-cred-label">Specialty</div>' +
              '<div class="tmc-cred-text">Custom-curated VIP activations at music festivals</div>' +
            '</div>' +
          '</div>' +
        '</section>' +

        '<section class="tmc-section-header">' +
          '<div class="tmc-section-label">Services</div>' +
          '<h2 class="tmc-section-heading">What we offer.</h2>' +
        '</section>' +

        '<div class="tmc-services-wrap">' +
          '<div class="tmc-service-block">' +
            '<div class="tmc-service-number">01</div>' +
            '<h3 class="tmc-service-title">Catering.</h3>' +
            '<p class="tmc-service-desc">Corporate dinners, private events, and weddings from 20 to 500 guests. Every menu is custom-curated around the crowd, the occasion, and the room. We handle the menu, kitchen, service, rentals, and dietary needs.</p>' +
            '<div class="tmc-service-styles">Family style &nbsp;&middot;&nbsp; Buffet style &nbsp;&middot;&nbsp; Plated</div>' +
            '<a class="tmc-service-menu-link" href="#/menu-catering" data-nav="menu-catering">Sample menu &rarr;</a>' +
          '</div>' +

          '<div class="tmc-service-block">' +
            '<div class="tmc-service-number">02</div>' +
            '<h3 class="tmc-service-title">Vending.</h3>' +
            '<p class="tmc-service-desc">Festival vending, brand activations, and large-event operations. Unique menus tailored to every event we attend. Custom-curated VIP areas for staff and artists. Full mobile setup, permits, commissary logistics, and a kitchen built for volume without sacrificing what goes on the plate.</p>' +
            '<div class="tmc-service-styles">Festivals &nbsp;&middot;&nbsp; Activations &nbsp;&middot;&nbsp; VIP &amp; artist hospitality</div>' +
            '<a class="tmc-service-menu-link" href="#/menu-vending" data-nav="menu-vending">Sample menu &rarr;</a>' +
          '</div>' +

          '<div class="tmc-service-block">' +
            '<div class="tmc-service-number">03</div>' +
            '<h3 class="tmc-service-title">Private Chef.</h3>' +
            '<p class="tmc-service-desc">In-home service for individuals, families, and ongoing engagements. Private dinners, weekly meal planning, and prep. A chef at your table or in your kitchen, cooking what you want, the way you want it.</p>' +
            '<div class="tmc-service-styles">Private dining &nbsp;&middot;&nbsp; Meal planning &nbsp;&middot;&nbsp; Meal prep</div>' +
            '<a class="tmc-service-menu-link" href="#/menu-private-chef" data-nav="menu-private-chef">Sample menu &rarr;</a>' +
          '</div>' +
        '</div>' +

        '<section class="tmc-primary-cta-band">' +
          '<div class="tmc-primary-cta-inner">' +
            '<div class="tmc-primary-cta-label">Ready when you are</div>' +
            '<h2 class="tmc-primary-cta-headline">Book us<br>for your next event.</h2>' +
            '<a class="tmc-primary-cta-btn" href="#/inquire" data-nav="inquire">Start an inquiry &rarr;</a>' +
          '</div>' +
        '</section>' +

        '<section class="tmc-wwd-section">' +
          '<div class="tmc-wwd-header">' +
            '<div class="tmc-section-label">What we do</div>' +
            '<h2 class="tmc-section-heading" style="margin-top:18px">Beyond the booking.</h2>' +
            '<p class="tmc-wwd-intro">When we\'re not cooking for clients, we run our own programming. These are the nights and operations where Tastemaker sets the menu.</p>' +
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
              '<div class="tmc-wwd-tile-desc">We run our own vending at festivals and markets under the Tastemaker banner, alongside the vending we provide as a service to larger events.</div>' +
            '</div>' +
          '</div>' +
        '</section>' +

        '<section class="tmc-inquire-band">' +
          '<div class="tmc-inquire-inner">' +
            '<h2 class="tmc-inquire-headline">Still have questions?</h2>' +
            '<div class="tmc-inquire-email">hello@tastemakerscollective.us</div>' +
            '<a class="tmc-inquire-btn-band" href="#/inquire" data-nav="inquire">Start an inquiry &rarr;</a>' +
          '</div>' +
        '</section>'
      );
    },

    'menu-catering': function () {
      return menuDetailPage('Catering', 'Catering. Sample menu.', 'Every event gets its own menu. This is a reference.', [
        { section: 'Canap&eacute;s', items: [['Hamachi crudo', 'yuzu, shiso, puffed quinoa'], ['Beef tartare', 'crispy potato, horseradish cream'], ['Burrata', 'peach, basil, aged balsamic, sea salt']] },
        { section: 'First course', items: [['Heirloom tomato', 'burrata, torn herbs, bread crisp'], ['Tuna crudo', 'citrus, chili, olive oil']] },
        { section: 'Main', items: [['Wood-grilled branzino', 'lemon, capers, brown butter, fennel'], ['Short rib', 'polenta, gremolata, charred onion']] },
        { section: 'Dessert', items: [['Olive oil cake', 'citrus, cr&egrave;me fra&icirc;che'], ['Chocolate tart', 'salted caramel, hazelnut']] }
      ]);
    },

    'menu-vending': function () {
      return menuDetailPage('Vending', 'Vending. Sample menu.', 'A festival vending menu. Unique menus are built for every event.', [
        { section: 'The line', items: [['Smash burger', 'double patty, American cheese, shredded lettuce, house sauce'], ['Pulled pork sandwich', 'slaw, pickles, soft bun'], ['Crispy chicken bao', 'spicy mayo, pickled cucumber, herbs']] },
        { section: 'Plant-based', items: [['Kimchi grilled cheese', 'aged cheddar, sourdough'], ['Crispy tofu bowl', 'ginger rice, scallion, sesame']] },
        { section: 'Sides', items: [['Truffle fries', 'parmesan, chives'], ['Fresno chili corn', 'lime, cotija']] }
      ]);
    },

    'menu-private-chef': function () {
      return menuDetailPage('Private Chef', 'Private chef. Sample menu.', 'A multi-course tasting menu for in-home service.', [
        { section: 'Amuse', items: [['Oyster', 'mignonette, cucumber granita']] },
        { section: 'First', items: [['Sea bream crudo', 'yuzu, fennel pollen, olive oil']] },
        { section: 'Second', items: [['Handmade agnolotti', 'brown butter, sage, parmesan']] },
        { section: 'Main', items: [['Duck breast', 'plum, star anise, charred radicchio']] },
        { section: 'Cheese', items: [['Selection of three', 'local honey, seeded crackers']] },
        { section: 'Dessert', items: [['Dark chocolate custard', 'olive oil, sea salt, shortbread']] }
      ]);
    },

    inquire: function () {
      return (
        '<section class="tmc-page-hero">' +
          '<div class="tmc-page-eyebrow">Inquire</div>' +
          '<h1 class="tmc-page-title">Event inquiry.</h1>' +
        '</section>' +
        '<section class="tmc-body">' +
          '<form id="tmc-inquiry-form" autocomplete="on">' +
            '<div class="tmc-form-step">' +
              '<h3>The event</h3>' +
              '<div class="tmc-form-field"><label for="f-type">Type</label><select id="f-type" name="type" required><option>Catering</option><option>Vending</option><option>Private chef</option><option>Other</option></select></div>' +
              '<div class="tmc-form-field"><label for="f-date">Date</label><input id="f-date" name="date" type="text" placeholder="Date or flexible"></div>' +
              '<div class="tmc-form-field"><label for="f-location">Location</label><input id="f-location" name="location" type="text" placeholder="Venue, neighborhood, or TBD"></div>' +
              '<div class="tmc-form-field"><label for="f-guests">Guest count</label><select id="f-guests" name="guests"><option>Under 25</option><option>25 to 50</option><option>50 to 100</option><option>100 to 200</option><option>200 to 500</option><option>500+</option></select></div>' +
            '</div>' +
            '<div class="tmc-form-step">' +
              '<h3>Details</h3>' +
              '<div class="tmc-form-field"><label for="f-budget">Budget</label><select id="f-budget" name="budget"><option>Not sure yet</option><option>Under $10K</option><option>$10K to 25K</option><option>$25K to 50K</option><option>$50K to 100K</option><option>$100K+</option></select></div>' +
              '<div class="tmc-form-field"><label for="f-dietary">Dietary or cuisine notes</label><textarea id="f-dietary" name="dietary" rows="3"></textarea></div>' +
            '</div>' +
            '<div class="tmc-form-step">' +
              '<h3>Contact</h3>' +
              '<div class="tmc-form-field"><label for="f-name">Name</label><input id="f-name" name="name" type="text" required></div>' +
              '<div class="tmc-form-field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" required></div>' +
              '<div class="tmc-form-field"><label for="f-phone">Phone</label><input id="f-phone" name="phone" type="tel"></div>' +
              '<div class="tmc-form-field"><label for="f-notes">Additional notes</label><textarea id="f-notes" name="notes" rows="3"></textarea></div>' +
              '<button type="submit" class="tmc-form-submit">Send inquiry</button>' +
            '</div>' +
          '</form>' +
        '</section>'
      );
    },

    contact: function () {
      return (
        '<section class="tmc-page-hero">' +
          '<div class="tmc-page-eyebrow">Contact</div>' +
          '<h1 class="tmc-page-title">Contact.</h1>' +
          '<p class="tmc-page-intro">For event inquiries, use the <a href="#/inquire" data-nav="inquire">Inquire page</a>.</p>' +
        '</section>' +
        '<section class="tmc-contact-block">' +
          '<div class="tmc-contact-card"><div class="tmc-contact-label">Email</div><p class="tmc-contact-value">hello@tastemakerscollective.us</p></div>' +
          '<div class="tmc-contact-card"><div class="tmc-contact-label">Instagram</div><p class="tmc-contact-value">@tastemakerscollective</p></div>' +
          '<div class="tmc-contact-card"><div class="tmc-contact-label">Serving</div><p class="tmc-contact-value">Los Angeles</p></div>' +
        '</section>'
      );
    }
  };

  /* === MENU DETAIL HELPER === */
  function menuDetailPage(title, heading, intro, sections) {
    let menuHtml = '';
    sections.forEach(function (s) {
      menuHtml += '<div class="tmc-menu-section-title">' + s.section + '</div>';
      s.items.forEach(function (i) {
        menuHtml += '<div class="tmc-menu-item"><div class="tmc-menu-item-name">' + i[0] + '</div><div class="tmc-menu-item-desc">' + i[1] + '</div></div>';
      });
    });
    return (
      '<section class="tmc-page-hero">' +
        '<div class="tmc-page-eyebrow">' + title + '</div>' +
        '<h1 class="tmc-page-title">' + heading + '</h1>' +
        '<p class="tmc-page-intro">' + intro + '</p>' +
      '</section>' +
      '<section class="tmc-menu-detail">' +
        menuHtml +
        '<div class="tmc-menu-back-card">' +
          '<a class="tmc-form-submit" href="#/inquire" data-nav="inquire" style="width:auto;padding:14px 30px;display:inline-block">Start inquiry</a>' +
          '<div style="margin-top:18px"><a class="tmc-back-link" href="#/" data-nav="home">&larr; Back</a></div>' +
        '</div>' +
      '</section>'
    );
  }

  /* === FOOTER === */
  const footer =
    '<footer class="tmc-footer">' +
      '<div class="tmc-footer-grid">' +
        '<div>' +
          '<div class="tmc-footer-brand">TASTEMAKER COLLECTIVE</div>' +
          '<div class="tmc-footer-tag">We make memorable experiences through cuisine. Catering, vending, and private chef across Los Angeles.</div>' +
        '</div>' +
        '<div class="tmc-footer-col">' +
          '<h4>Services</h4>' +
          '<a href="#/menu-catering" data-nav="menu-catering">Catering</a>' +
          '<a href="#/menu-vending" data-nav="menu-vending">Vending</a>' +
          '<a href="#/menu-private-chef" data-nav="menu-private-chef">Private Chef</a>' +
        '</div>' +
        '<div class="tmc-footer-col">' +
          '<h4>Site</h4>' +
          '<a href="#/" data-nav="home">Home</a>' +
          '<a href="#/inquire" data-nav="inquire">Inquire</a>' +
          '<a href="#/contact" data-nav="contact">Contact</a>' +
        '</div>' +
        '<div class="tmc-footer-col">' +
          '<h4>Connect</h4>' +
          '<a href="mailto:hello@tastemakerscollective.us">hello@tastemakerscollective.us</a>' +
          '<a href="#">Instagram</a>' +
        '</div>' +
      '</div>' +
      '<div class="tmc-footer-bottom">' +
        '<div>&copy; 2026 Tastemaker Collective LLC</div>' +
        '<div>All rights reserved</div>' +
      '</div>' +
    '</footer>';

  /* === ROUTER === */
  function getRouteFromHash() {
    const hash = window.location.hash.replace(/^#\//, '').replace(/^#/, '');
    if (!hash || hash === '/' || hash === '') return 'home';
    return hash;
  }

  function render(page) {
    const renderer = pages[page] || pages.home;
    main.innerHTML = renderer() + footer;
    mobileMenu.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    window.scrollTo({ top: 0, behavior: 'instant' });
    attachListeners();
    if (page === 'home') setTimeout(animateBrand, 50);

    // update document title for each route
    const titles = {
      home: 'Tastemaker Collective | Culinary Collective in Los Angeles',
      inquire: 'Inquire | Tastemaker Collective',
      contact: 'Contact | Tastemaker Collective',
      'menu-catering': 'Catering Sample Menu | Tastemaker Collective',
      'menu-vending': 'Vending Sample Menu | Tastemaker Collective',
      'menu-private-chef': 'Private Chef Sample Menu | Tastemaker Collective'
    };
    document.title = titles[page] || titles.home;
  }

  function attachListeners() {
    document.querySelectorAll('[data-nav]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        const target = el.getAttribute('data-nav');
        window.location.hash = '#/' + (target === 'home' ? '' : target);
      });
    });

    const form = document.getElementById('tmc-inquiry-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        handleFormSubmit(form);
      });
    }
  }

  /* === FORM HANDLER ===
     Currently builds a mailto: link from submission data so the site works
     from day one without a backend. Swap this for a fetch() to a form
     endpoint (Formspree, Vercel serverless function, etc.) when ready. */
  function handleFormSubmit(form) {
    const fd = new FormData(form);
    const subject = 'New event inquiry: ' + (fd.get('type') || '') + ' - ' + (fd.get('name') || '');
    const body =
      'Event type: ' + (fd.get('type') || '') + '\n' +
      'Date: ' + (fd.get('date') || '') + '\n' +
      'Location: ' + (fd.get('location') || '') + '\n' +
      'Guest count: ' + (fd.get('guests') || '') + '\n' +
      'Budget: ' + (fd.get('budget') || '') + '\n' +
      'Dietary: ' + (fd.get('dietary') || '') + '\n\n' +
      'Name: ' + (fd.get('name') || '') + '\n' +
      'Email: ' + (fd.get('email') || '') + '\n' +
      'Phone: ' + (fd.get('phone') || '') + '\n\n' +
      'Notes:\n' + (fd.get('notes') || '');
    const href = 'mailto:hello@tastemakerscollective.us?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    window.location.href = href;

    const wrap = form.parentNode;
    wrap.innerHTML =
      '<div class="tmc-form-success">' +
        '<h3>Opening your email client.</h3>' +
        '<p>Your inquiry is being drafted in a new email to hello@tastemakerscollective.us. ' +
        'If nothing happens, email us directly.</p>' +
      '</div>';
  }

  /* === INIT === */
  window.addEventListener('hashchange', function () {
    render(getRouteFromHash());
  });

  render(getRouteFromHash());
})();
