# Tastemakers Collective Site

Static site. No build step. Drop into any static host. The main site is a
single page at the root, and `card/` is a standalone contact page that the
printed business card QR codes point to.

## Files
- `index.html`: single-page shell with SEO meta, OG tags, JSON-LD schema
- `styles.css`: complete design system and all page styles
- `script.js`: CONFIG object, client-side router, page templates, form handler
- `card/index.html`: standalone contact page at `/card`, self contained with its own inline CSS
- `card/tastemakers.vcf`: vCard the Save contact button downloads
- `robots.txt`: allows everything, points at the sitemap
- `sitemap.xml`: lists `/` and `/card`, the only two real URLs
- `vercel.json`: sets `trailingSlash: false` so `/card` serves without a redirect

## Editing content

Everything editable lives in the `CONFIG` object at the top of `script.js`:
business details, the nav, retired routes, per-route titles and meta
descriptions, page heroes, the menus, the service and process lists, the
closing CTA headlines and the footer. Change copy there, not in the page
templates below it. Colors and fonts are CSS custom properties at the top
of `styles.css`.

## Deploy

1. Commit the site files (plus this README) to the root of the GitHub repo at `github.com/TastemakersCollectiveLLC/tastemaker-site`.
2. Vercel is already connected, so it auto-deploys on push, usually within a minute.
3. Domains `tastemakerscollective.us` and `www.tastemakerscollective.us` are already attached, with DNS at Namecheap and SSL issued by Vercel.

## How routing works

Hash-based routing (`#/weddings`, `#/menus`, and so on) so the site is a
single HTML file that works on any static host without server-side
rewrites. No 404s on direct URLs, no routing config needed.

Routes: `home`, `order`, `weddings`, `events`, `vending`, `about`,
`contact`, `menus`. Menus is reachable from the pages and the footer but
is deliberately not in the main nav.

Retired routes forward to their closest current page, so old links and
search results keep working: `#/inquire` to `#/contact`,
`#/menu-catering` to `#/events`, `#/menu-vending` to `#/vending`,
`#/menu-private-chef` to `#/contact`.

Because hash routes are one document to a crawler, the sitemap lists only
`/` and `/card`. Per-route titles and meta descriptions are set by the
router at navigation time.

## Forms

Contact and Order both post to the Google Apps Script web app in
`apps-script/` through one shared submit function, as JSON with a plain
`fetch`. Each form carries its own hidden `form_source`. The submit button
disables while sending. On success the form is replaced with a
confirmation. On failure the form is kept, the button is re-enabled, and
an error offers `hello@tastemakerscollective.us` plus a mailto prefilled
from the answers already typed in.

To add a third form, give it `class="tmc-form"`, its own hidden
`form_source`, a field named `email`, a
`p.tmc-form-status` and a submit button. No JavaScript changes needed.

## Update workflow

Edit files directly on GitHub through the web UI, or push from a clone.
Every commit auto-deploys.

## Known placeholders to fill in

- Favicon: add `favicon.ico` and link it in `<head>`. Needs the logo file.
- OG image: add a 1200x630 PNG to the repo root and uncomment the `og:image` meta.
- Instagram: the footer link was removed rather than left dead. Add it back once the handle is confirmed.
- Phone: `BUSINESS_PHONE` lives in `CONFIG.business`. Change it there and in `card/tastemakers.vcf` together.
- Order page: currently a drop-off request form. It becomes a clickable order-from menu once the menu matrix exists.
