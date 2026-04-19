# Tastemaker Collective — Site

Static site. Three files. No build step. Drop into any static host.

## Files
- `index.html` — single-page shell with SEO meta, OG tags, JSON-LD schema
- `styles.css` — complete design system and all page styles
- `script.js` — client-side router, page templates, form handler

## Deploy

1. Commit all three files (plus this README) to the root of the GitHub repo at `github.com/TastemakersCollectiveLLC/tastemaker-site`.
2. Vercel is already connected, so it auto-deploys on push. First deploy lands at `tastemaker-site.vercel.app` (or similar) within ~60 seconds.
3. In Vercel project → Domains → Add `tastemakerscollective.us` and `www.tastemakerscollective.us`.
4. Vercel will show the DNS records to add at Namecheap. Typically:
   - `A` record: `@` → `76.76.21.21`
   - `CNAME` record: `www` → `cname.vercel-dns.com`
5. Add those records in Namecheap → Advanced DNS. Propagation: 10 min to 1 hour.
6. Vercel auto-issues SSL once DNS resolves. Site is live.

## How routing works

Uses hash-based routing (`#/inquire`, `#/menu-catering`, etc.) so the site is a single HTML file that works on any static host without server-side rewrites. No 404s on direct URLs, no routing config needed.

## Inquiry form

Currently opens the user's email client with a pre-filled message to `hello@tastemakerscollective.us`. Works from day one with zero backend.

When ready to upgrade, swap `handleFormSubmit` in `script.js` for a `fetch()` call to:
- **Formspree** (free tier, easiest)
- **Vercel serverless function** (free, integrates with the existing deploy)
- **Google Workspace Apps Script** (uses the email you already have)

## Update workflow

Edit files directly on GitHub through the web UI. Every commit auto-deploys in ~60 seconds.

## Known placeholders to fill in

- Instagram link in footer (`href="#"`)
- Instagram handle on `/contact` — currently `@tastemakerscollective`, verify and update
- OG image — add `og-image.jpg` (1200x630) to repo root, uncomment `og:image` meta when ready
- Favicon — add `favicon.ico` and link it in `<head>`
