(function (root, factory) {
var api = factory();
if (typeof module === 'object' && module.exports) module.exports = api;
else root.TMC = api;
})(typeof self !== 'undefined' ? self : this, function () {
'use strict';
var FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyyHqJLrDdlsNhMX8yK0lq0hC232ooJ1g3FqA0oK34SsQrmTcpPQC_S30ENrFhWGEISTQ/exec';
var GA4_ID = '';
var META_PIXEL_ID = '';
var META_VERIFICATION = '';
var INDEXNOW_KEY = 'b02557f74d6091d7f396c794d077595e';
var CONFIG = {
siteUrl: 'https://www.tastemakerscollective.us',
business: {
name: 'Tastemakers Collective',
legalName: 'Tastemakers Collective LLC',
city: 'Los Angeles',
serviceArea: 'Los Angeles and Southern California',
tagline: 'Custom menus for every event and every diet.',
phone: '(213) 293-8518',
email: 'hello@tastemakerscollective.us',
address: '',
INSTAGRAM_URL: '',
FACEBOOK_URL: '',
LINKEDIN_URL: ''
},
trust: [
'Permitted by LA County Public Health.',
'Prepared in a permitted commercial kitchen.',
'$2M general liability insurance.',
'ServSafe certified manager.',
'Certificate of insurance available on request.'
],
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
redirects: {
inquire: 'contact',
'menu-catering': 'events',
'menu-vending': 'vending',
'menu-private-chef': 'contact'
},
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
homeH1Line: 'Catering and events in Los Angeles',
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
vegan: {
eyebrow: 'Vegan',
intro: 'Custom menus for every event and every diet.'
},
glutenFree: {
eyebrow: 'Gluten free',
intro: 'Custom menus for every event and every diet.'
}
},
allergyNote: {
vegan: '',
glutenFree: ''
},
pageCopy: {
events: '',
vending: ''
},
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
{ heading: 'How ordering works',
list: [
'Drop-off: send a request on the Order page.',
'Staffed events: send an inquiry with the date, place, guest count and dietary needs. We reply with a custom menu and a quote. The menu and consultation are free.'
] },
{ heading: 'Bar',
body: 'Bar service is available as an add-on. We provide bartenders and house-made mixers; you supply the alcohol from a shopping list we give you.' },
{ heading: 'Who cooks',
body: 'Our kitchen is led by a chef with seventeen years in fine dining kitchens and more than a decade cooking for artist hospitality and crews at music festivals. Permitted by LA County Public Health, ServSafe certified, prepared in a permitted commercial kitchen.' }
],
homeWho: {
headline: 'A Los Angeles catering and events company.',
body: [
'We cook modern California Italian food for offices, weddings, private parties, productions on set and music festivals.',
'Our specialty is food for people with dietary restrictions, cooked from whole foods. Vegan, gluten free and dairy free options are on every menu, every dish is labeled, and halal is available on request.',
'Our kitchen is led by a chef with seventeen years in fine dining kitchens and more than a decade cooking for artist hospitality and crews at music festivals.'
]
},
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
serviceList: [
{ route: 'weddings', name: 'Wedding catering', desc: 'Custom menus and full service for weddings. Plated, family style, buffet or stations.' },
{ route: 'corporate', name: 'Corporate catering', desc: 'Office lunches, meetings and company events in Los Angeles.' },
{ route: 'events', name: 'Event catering', desc: 'Catering for private parties, celebrations and milestones.' },
{ route: 'vending', name: 'Festival vending and event hospitality', desc: 'Food vending, staff meals and artist hospitality at festivals and large events.' },
{ route: 'order', name: 'Drop-off catering', desc: 'Drop-off catering for offices and gatherings.' },
{ route: 'onSet', name: 'Production and on set catering', desc: 'Crew meals delivered to location on your schedule.' }
],
dietaryPages: [
{ route: 'vegan', name: 'Vegan catering', diet: 'https://schema.org/VeganDiet',
body: 'Vegan, gluten free and dairy free options are on every menu and every dish is labeled for dietary needs and allergens. Tell us the dietary needs in the room and we build the menu around them.' },
{ route: 'glutenFree', name: 'Gluten-free catering', diet: 'https://schema.org/GlutenFreeDiet',
body: 'Vegan, gluten free and dairy free options are on every menu and every dish is labeled for dietary needs and allergens. Tell us the dietary needs in the room and we build the menu around them.' }
],
knowsAbout: ['Catering', 'Wedding catering', 'Corporate catering', 'Event catering', 'Festival food vending',
'Drop-off catering', 'Production catering', 'Vegan catering', 'Gluten-free catering',
'Dairy-free catering', 'Bar service'],
process: [
{ title: 'Inquiry', desc: 'You tell us the date, the place, the guest count and any dietary needs.' },
{ title: 'Consultation', desc: 'We talk through the food, the service style and how the day runs.' },
{ title: 'Custom menu', desc: 'We write a menu for your event and quote it. The menu and consultation are free.' },
{ title: 'Event day', desc: 'We handle the food and the service from start to finish.' }
],
included: [
{ title: 'Menu design', desc: 'A menu written for your event, not picked off a list.' },
{ title: 'Service staff', desc: 'Our staff serve the food through the event.' },
{ title: 'Setup and breakdown', desc: 'We set up our own equipment and break it down when we are done.' },
{ title: 'Bar service as an add-on', desc: 'Bartenders and house-made mixers; you supply the alcohol.' }
],
serviceStylesLine: 'Plated, family style, buffet or stations. Any of them, or a mix across the evening.',
dietaryNote: 'Every menu is built around your guests. Vegan, gluten free and dairy free options are on every menu, every dish is labeled on the day, and halal is available on request.',
eventTypes: [
{ title: 'Private parties', desc: 'Dinners and parties at home or at a venue.' },
{ title: 'Celebrations', desc: 'Birthdays, anniversaries and milestones.' }
],
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
order: {
note: 'Send the details below and we reply with a menu and a quote. Orders need at least 48 hours notice.',
leadTimeHours: 48,
deliveryWindows: ['11:00', '11:30', '12:00', '12:30', '1:00'],
guestCounts: ['Under 20', '20 to 30', '30 to 50', '50 to 75', '75 to 100', 'More than 100']
},
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
aboutWhoWeAre: 'Tastemakers Collective is a chef-driven catering, events and food vending company in Los Angeles cooking modern California Italian food. Our specialty is food for people with dietary restrictions, cooked from whole foods. Our kitchen is led by a chef with seventeen years in fine dining kitchens in California and more than a decade cooking for artist hospitality, green rooms and crews at music festivals. We cook from a permitted commercial kitchen in Los Angeles.',
aboutCredentials: [
'Permitted by LA County Public Health',
'ServSafe certified manager',
'$2M general liability insurance, certificate available on request',
'Licensed California LLC'
],
aboutWhereWeWork: 'Los Angeles and Southern California, plus festivals across California.',
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
stickyRoutes: ['weddings', 'corporate', 'events', 'vending', 'onSet'],
stickyBookOnly: ['weddings', 'onSet'],
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
vendingType: 'Festival or event vending',
powerWater: ['Yes', 'No', 'Not sure']
},
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
