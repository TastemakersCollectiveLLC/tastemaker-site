# Tastemakers Collective, site rules

Danny's standing rules for tastemakerscollective.us. They override defaults.
Always "Tastemakers" with the S. No em dashes anywhere, copy or comments.

## Who we are and what we sell

Chef-driven catering, events and food vending company in Los Angeles.
Executive chef: seventeen years in fine dining kitchens in California, more
than a decade cooking artist hospitality, green rooms and crew meals at music
festivals. Permitted shared commercial kitchen in Los Angeles (never name the
kitchen, or any permit, policy or license number). Contact everywhere:
hello@tastemakerscollective.us and (213) 293-8518, call or text.

We sell, all real:
- Weddings: custom menu, consultation, full service, plated, family style,
  buffet or stations, tasting once booked.
- Corporate: office lunch drop-off, meetings and all-day events, company
  parties, client dinners.
- Private events: parties, celebrations, milestones.
- Drop-off: boxed meals or pans, delivered ready to serve. Nothing plated or
  assembled is delivered; boards and spreads are built on site by our staff.
- On set: walking breakfast at call, hot or boxed lunch in the meal window,
  artist and talent hospitality, delivered or staffed.
- Festival vending, crew and staff meals, artist hospitality.
- Dry hire bar add-on: we provide bartenders and house-made mixers; the
  client buys all alcohol from a shopping list we give them.
- Pop-ups and supper clubs we run ourselves.

NOT offered: private chef. Never add or imply it ("private dinners" for
clients counts as implying it; our own supper clubs are fine).

Food identity: modern Italian and Italian-adjacent, with California produce.
Eastern techniques are an unstated influence only, never named as a style,
and never the word fusion. Menu sections and dish names use American English
nomenclature; no Italian section names. Pantry: pork and shellfish are
allowed; halal is available on request. Specialty: food for people with
dietary restrictions, cooked from whole foods.

The example menus are removed from the site (11/4/2026); /menus 301s to /.
The Menus page returns later as the orderable catch-all menu. Until then no
dish names appear anywhere on the site.

## Who each page is for

- Home: anyone deciding in ten seconds whether we cook for their kind of
  event and their guests' diets.
- Corporate and Order: office managers, EAs, HR at 20 to 300 person
  companies. On time, every diet covered and labeled, menus rotate, easy.
- Weddings: couples and planners. Their menu, the tasting, the deposit,
  every guest's diet.
- Events: private party hosts, same as weddings but lighter.
- On set: production coordinators. Call times, meal windows, crew counts,
  delivery to location, a COI naming the production.
- Vending: festival producers. Our own setup, staff and insurance.
- About and Reviews: anyone checking we are real and credentialed.

## DECIDED facts, fine to state

- 50% deposit holds a date; short-notice events are paid in full at signing.
- Custom menu and consultation are free. Tasting once a wedding is booked.
- Every dish labeled for dietary needs and allergens. Vegan, gluten free and
  dairy free options on every menu. Halal is available on request.
- Drop-off is boxed meals or pans, ready to serve, at least 48 hours notice.
- Dry hire bar as described above.
- Service area: Los Angeles and Southern California, plus festivals across
  California.
- $2M general liability insurance; the certificate can name an event or
  production as additional insured. Permitted by LA County Public Health.
  ServSafe certified manager. Licensed California LLC.

## NOT DECIDED, never state or imply

Any price, per-person rate, minimum spend or minimum headcount. Package names
or contents. Delivery fees or zones. Tasting fee. Response-time promises.
Net terms, invoicing, billing method or payment methods. Cancellation or
refund terms. Final count deadlines or change cutoffs. Rentals, plateware,
glassware, ice, linens, decor or bar equipment. Staffing ratios. Separate
allergen preparation or any cross-contact guarantee. Second meal or craft
service on set. Nut free as a claim, or halal as anything stronger than
available on request.
Checkout will someday run on Clover; it is never mentioned on the site.

## Voice

"We", never "I". The service is the hero; the chef gets at most one line per
page. Plain, literal, short sentences. Headings name the section; no slogans,
hooks, "elevate", "curated", "seamless", "not an afterthought", exclamation
marks. Never define plated, buffet or family style. No prices. Never invent
dishes, stats, testimonials, clients, handles or URLs. No restaurant,
Michelin, artist, promoter, venue, supplier or facility names. The tagline
stays: "Custom menus for every event and every diet."

## Code facts

- Every editable string lives in CONFIG in config.js. Page templates in
  build/templates.js read CONFIG and hold no copy.
- Build with `node build/build.js`, then `node build/verify.js
  https://www.tastemakerscollective.us` after deploy, before calling a push
  done. The build fails on house-rule violations; keep its checks honest.
- Meta descriptions: 155 characters or under (build warns over 155, fails
  over 200 or under 120 on indexable pages).
- Never break: reduced-motion behavior, the mobile sticky bars, ?type= and
  ?style= prefill on /contact, the _gotcha honeypot, clean URLs without
  trailing slashes.
- Forms post JSON to the Apps Script FORM_ENDPOINT with NO Content-Type
  header; success only on ok:true. The backend is apps-script/Code.gs,
  bound to the Tastemakers Website Inquiries sheet.
- THE FIELDS RULE: any commit that adds, renames or removes a form field's
  name attribute must update FIELDS in apps-script/Code.gs in the same
  commit, and Danny must paste and deploy a new version. Changing only a
  visible label on the site needs nothing in Code.gs.
- After every push: byte-check production against the local build, run
  verify.js, run `node build/indexnow.js` and log the response code.

## Open items waiting on Danny

- INSTAGRAM_URL, FACEBOOK_URL, LINKEDIN_URL in config.js (empty, TODO).
- META_VERIFICATION (Search Console), GA4_ID, META_PIXEL_ID (empty).
- allergyNote.vegan and allergyNote.glutenFree (empty; no allergen claim is
  ever written on his behalf).
- Corporate lunch packages and bar package details, with prices (TODOs in
  config.js corporatePage).
- Clover checkout through the business bank, later; not Square, not now.
