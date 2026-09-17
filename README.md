# No Limit Roofing — Website

A six-page static marketing site for **No Limit Roofing**, a roofing contractor serving the Michiana region (South Bend / Mishawaka / Plymouth, IN) since 2010. Built to replace [nolimitroofingin.com](https://nolimitroofingin.com) with a faster, more modern, lead-capture-focused design.

Live repo: https://github.com/justjoe19/NoLimitRoofing

## Tech stack

- **Plain static HTML** — no JS framework, no bundler beyond Tailwind's CLI. 6 content pages + a 404 page.
- **Tailwind CSS v4** — source lives in `css/input.css` (uses `@theme`/`@layer`, CSS-first config, no `tailwind.config.js`), compiled to `css/styles.css`. Never hand-edit `styles.css` — it's a build artifact.
- **Vanilla JS** (`js/main.js`, no dependencies) — mobile nav drawer, contact form validation + submission, lite YouTube embed, header scroll shadow.
- **System font stack only** — no webfonts, by design. Zero font-load network cost, zero layout shift from font swap.
- **Images** — WebP only, optimized with `cwebp`. Real company/project photography plus manufacturer certification badges (GAF, IKO, Owens Corning, Malarkey, Atlas, CertainTeed, SRS).
- **Netlify Forms** for the contact form (no backend). See [Contact form](#contact-form) below.
- **Deployment**: Netlify. `netlify.toml` already sets the build command and cache/security headers.

## Quick start

```bash
npm install                 # installs tailwindcss + @tailwindcss/cli only
npm run build:css           # compiles css/input.css -> css/styles.css
python3 -m http.server 8099 # serve the site locally
# open http://localhost:8099/
```

While actively editing styles:

```bash
npm run watch:css           # rebuilds css/styles.css on every save
```

There is no other build step. HTML files are edited directly; there's no templating — shared markup (header, footer, nav) is duplicated across each page by hand. When editing shared structure (e.g. nav links, footer), grep across all 7 HTML files and update each one.

## Project structure

```
index.html, about.html, services.html,      6 content pages + 404.
gallery.html, areas.html, contact.html,
404.html

css/
  input.css        Tailwind source — design tokens (@theme) + component
                    classes (@layer components), e.g. .btn, .card, .hero
  styles.css        Compiled output. Do not hand-edit.

js/
  main.js           Mobile nav, contact form, lite YouTube embed, header
                    scroll shadow. No dependencies.

images/
  *.webp            All site imagery, WebP only.
  *-hero.webp        Extra-compressed variants used as full-bleed hero
                     backgrounds (see "Hero images" below).
  badge-*.webp       Manufacturer certification badges.
  nlr-logo.{png,webp}  Company logo (png kept for JSON-LD/og:image use).

favicon.ico, favicon-*.png,  Favicon set generated FROM THE ORIGINAL
apple-touch-icon.png,        SITE's actual favicon (a portrait of their
icon-192.png, icon-512.png   roofer mascot) — not a custom mark.

site.webmanifest, robots.txt, sitemap.xml, netlify.toml
package.json, package-lock.json   Tailwind CLI only.
```

## Design system

Defined in `css/input.css` under `@theme`:

| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#14171a` | Primary dark / body text |
| `--color-fog` | `#f5f6f8` | Light section background |
| `--color-mist` | `#e4e7eb` | Borders |
| `--color-steel` | `#545d68` | Secondary/muted text |
| `--color-accent` | `#c23a0e` | Brand orange — CTAs, links, accents |
| `--color-accent-dark` | `#9c2f0a` | Accent hover state |

Desktop nav breakpoint is `lg` (1024px) — below that, the hamburger drawer takes over. Container max-width is 1200px (`.container`).

### Hero images

Each page's hero section sets its background photo via a CSS custom property set inline, so the shared `.hero` rule (gradient overlay + pattern) stays in one place:

```html
<section class="hero" style="--hero-image:url(&quot;/images/some-photo-hero.webp&quot;)">
```

To change a page's hero photo: swap that URL, add/update the matching `<link rel="preload" as="image" ... fetchpriority="high">` in `<head>` (keeps LCP fast), and update that page's `og:image` meta tag to match (see [Known gotchas](#known-gotchas--lessons-learned)).

## Contact form

The form on `contact.html` posts to **Netlify Forms** — no backend code. Relevant bits:

- `data-netlify="true"` + `name="contact"` on the `<form>` — Netlify's build-time scanner detects this from the static HTML.
- `netlify-honeypot="company-website"` + a hidden `company-website` field — spam trap.
- `js/main.js` progressively enhances the form: client-side validation, then an AJAX `fetch` POST with a normal-form fallback if JS fails.
- Submissions land in the Netlify dashboard (Forms tab) once deployed. No email/webhook is wired up yet — set that up in Netlify's UI if you want notifications.

## Business facts reference

So future edits don't have to re-derive these from the old site:

- **Phone**: (574) 360-0525
- **Founded**: 2010. **Owner**: Jonathan Smith, 25+ years experience.
- **Offices**: Mishawaka, IN and Plymouth, IN (regional offices — no public street addresses, city-level only). An Ohio location is referenced as "opening soon" with no further detail.
- **Service area**: St. Joseph County IN, LaPorte County IN, Marshall County IN, Berrien County MI, Cass County MI, Greater South Bend–Elkhart region.
- **Certifications**: GAF Certified, IKO RoofPro (Select & Preferred), Owens Corning, Malarkey, Atlas, CertainTeed Shingle Master, SRS TopShield PRO.
- **Social**: Facebook `/NoLimitRoofingIN`, LinkedIn `/company/no-limit-roofing-indiana`, YouTube (playlist linked in footer).
- **Reviews**: 5.0★ average. The testimonials on Home/About are verbatim quotes pulled from the original site (K. Hall, L. Bauer, D. Beery, S. Wilcox, S. Rosado, S. Zellers) — don't paraphrase or invent new ones without a real source.
- **No published business hours** — the site deliberately avoids stating specific hours (none were published on the original site). Copy instead says "call anytime for emergencies" / "we respond same business day."

## Testing

```bash
# Lighthouse (run against the local server, all 6 pages)
npx lighthouse http://localhost:8099/ --chrome-flags="--headless" --only-categories=performance,accessibility,best-practices,seo
```

Current scores: 98–100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO on every page.

**Known flakiness**: `python3 -m http.server` is single-threaded and occasionally drops a connection under Lighthouse's concurrent image fetches (`ERR_CONNECTION_RESET` / `ERR_SOCKET_NOT_CONNECTED`), causing a spurious Performance or Best Practices dip. This is a dev-server artifact, not a real bug — always re-run before treating a local Lighthouse dip as real. It will not happen on Netlify's production CDN.

For anything beyond a quick sanity check, `puppeteer-core` (installed with `npm install --no-save puppeteer-core`, pointed at the system Chrome via `executablePath`) is useful for scripted viewport sweeps and screenshots — see git history / CHANGELOG for example scripts. Don't commit it to `package.json`; it's a diagnostic tool, not a site dependency.

## Known gotchas / lessons learned

- **`.main-nav ul a` must stay scoped to `ul`.** A bare `.main-nav a` selector will also match any other link nested inside `.main-nav` (e.g. the phone link or the "Free Estimate" button), and its specificity can silently override that element's own color/display styles. This caused two real, hard-to-spot bugs this project (a nav CTA button rendering with dark text on an orange background, and a phone number failing to hide at the wrong breakpoint). If you add a new element inside `.main-nav` that isn't a plain nav-list link, double check it isn't accidentally styled by `.main-nav ul a`.
- **Avoid scroll-triggered reveal/fade-in animations.** One was added and then removed — it caused a Lighthouse color-contrast failure (audit caught text mid-opacity-transition) and made page content dependent on IntersectionObserver timing/JS succeeding. If you want scroll animations back, make sure there's a hard fallback that guarantees content becomes visible even if JS fails or an observer never fires.
- **`og:image` tags must point at files that actually exist.** All JPG fallbacks were deleted at one point (site is WebP-only) without updating the `og:image`/JSON-LD `image` meta tags, which broke social-share previews on every page for a while. Each page's `og:image` now points at that page's own hero `-hero.webp` file — keep them in sync if you change a hero photo.
- **Check that image filenames/alt text match what's actually in the photo.** `attic-insulation-installation.webp` was originally misnamed `roofing-project-gallery.webp` and got used with a "Siding Repair & Replacement" caption on the Services page — wrong content, not just a wrong filename. Look at the actual photo before reusing it somewhere new.
- **Favicon is the client's real favicon**, pulled directly from `nolimitroofingin.com/favicon.ico` (which redirects to their actual icon file) — not a custom-designed mark. If the client ever rebrands, source a new one from them rather than inventing one.

## Deployment

Connect this repo to Netlify. `netlify.toml` already configures:
- Build command: `npm run build:css`
- Publish directory: `.` (repo root)
- Cache headers (long-cache for images, short for HTML/CSS/JS)
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`, etc.)

No environment variables or secrets are required.
