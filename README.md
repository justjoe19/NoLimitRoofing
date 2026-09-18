# No Limit Roofing — Website

A static marketing + local-SEO site for **No Limit Roofing**, a roofing contractor serving the Michiana region (South Bend / Mishawaka / Plymouth, IN) since 2010. Built to replace [nolimitroofingin.com](https://nolimitroofingin.com) with a faster, more modern, lead-capture-focused design, and being expanded per a client-provided Website Design + SEO Build Brief into a full service/location-page SEO architecture (currently 28 pages: the original 6 content pages + 404, 3 service-group hubs, 13 service pages, and 5 city pages, with more city and Learning Center pages planned — see `CHANGELOG.md`).

Live repo: https://github.com/justjoe19/NoLimitRoofing

## Tech stack

- **[Astro](https://astro.build)** (static output, no server) — layouts + components replace hand-duplicated HTML. 28 pages built from `src/pages/*.astro` (including 3 dynamic routes driven by content collections) plus a 404 page.
- **Tailwind CSS v4** via `@tailwindcss/vite` — source lives in `src/styles/global.css` (uses `@theme`/`@layer`, CSS-first config, no `tailwind.config.js`), compiled automatically as part of the Astro build. No separate CSS build step, no build artifact to avoid hand-editing.
- **Vanilla JS** (`public/js/main.js`, no dependencies, loaded on every page) — mobile nav drawer, contact form validation + submission, lite YouTube embed, header scroll shadow.
- **System font stack only** — no webfonts, by design. Zero font-load network cost, zero layout shift from font swap.
- **Images** — WebP only, optimized with `cwebp`, served from `public/images/`. Real company/project photography plus manufacturer certification badges (GAF, IKO, Owens Corning, Malarkey, Atlas, CertainTeed, SRS).
- **Netlify Forms** for the contact form (no backend). See [Contact form](#contact-form) below.
- **Deployment**: Netlify. `netlify.toml` already sets the build command (`npm run build`, publishing `dist/`) and cache/security headers.

## Quick start

```bash
npm install     # installs Astro + the Tailwind Vite plugin
npm run dev      # starts the Astro dev server (prints the local URL)
```

```bash
npm run build    # builds the static site into dist/
npm run preview  # serves the dist/ build locally, for a production-accurate check
```

Shared markup — header, footer, nav, cert-badge marquee — lives once each in `src/components/` and `src/layouts/BaseLayout.astro`, not duplicated per page. Page-specific content lives directly in each `src/pages/*.astro` file. When editing shared structure (nav links, footer, etc.), there is exactly one file to change, not seven.

URLs are unchanged from the original static site (`/about.html`, not `/about`) — `astro.config.mjs` sets `build.format: "file"` specifically to preserve this, so no redirects were needed for this migration.

## Project structure

```
src/
  content.config.ts     Zod schemas for the `services` and `locations`
                        content collections (src/content/).
  content/
    services/*.md        13 leaf service pages (frontmatter: hero copy,
                        highlights, FAQs, related links; body = long copy).
    locations/*.md        5 priority city pages, same shape.
  layouts/
    BaseLayout.astro   <head> (meta/OG/schema/favicons), skip-link, Header,
                        <main> slot, Footer, mobile call bar, main.js tag.
  components/
    Header.astro        Nav + mobile drawer toggle + the Roofing/Storm
                        Damage/Commercial dropdowns (<details>/<summary>,
                        same accessible pattern as the FAQ accordion — no
                        JS required). Sets aria-current from the current URL.
    Footer.astro         Full site footer + the sticky mobile call bar.
    CertMarquee.astro    The auto-scrolling manufacturer-badge strip
                        (used on Home and About).
  styles/
    global.css          Tailwind source — design tokens (@theme) + component
                        classes (@layer components), e.g. .btn, .card, .hero.
  pages/
    index.astro, about.astro, services.astro,   The original 6 pages + 404.
    gallery.astro, areas.astro, contact.astro,
    404.astro
    roofing/index.astro, storm-damage/index.astro,   Group hub pages —
    commercial/index.astro                            hand-written, list
                                                        that group's services
                                                        from the collection.
    [group]/[slug].astro   ONE dynamic route rendering all 13 service leaf
                        pages from the `services` collection, keyed by each
                        entry's `group`/`slug` frontmatter — not 3 separate
                        template files.
    service-areas/[slug].astro   Dynamic route rendering all 5 city pages
                        from the `locations` collection.

public/                  Served as-is, unprocessed — same convention as the
                        old repo root.
  images/*.webp          All site imagery, WebP only.
  images/*-hero.webp      Extra-compressed variants used as full-bleed hero
                          backgrounds (see "Hero images" below).
  images/badge-*.webp     Manufacturer certification badges.
  images/nlr-logo.{png,webp}  Company logo (png kept for JSON-LD/og:image use).
  js/main.js              Mobile nav, contact form, lite YouTube embed,
                          header scroll shadow. No dependencies.
  favicon.ico, favicon-*.png,  Favicon set generated FROM THE ORIGINAL
  apple-touch-icon.png,        SITE's actual favicon (a portrait of their
  icon-192.png, icon-512.png   roofer mascot) — not a custom mark.
  site.webmanifest, robots.txt   sitemap.xml is no longer a static file here
                                — @astrojs/sitemap generates sitemap-index.xml
                                and sitemap-0.xml at build time from the
                                actual page set, so it can't go stale.

astro.config.mjs, tsconfig.json, netlify.toml
package.json, package-lock.json   Astro + Tailwind Vite plugin only.
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

The form on `src/pages/contact.astro` posts to **Netlify Forms** — no backend code. Relevant bits:

- `data-netlify="true"` + `name="contact"` on the `<form>` — Netlify's build-time scanner needs this to be present in the *built* static HTML, which it is (Astro renders it at build time, same as before).
- `netlify-honeypot="company-website"` + a hidden `company-website` field — spam trap.
- `public/js/main.js` progressively enhances the form: client-side validation, then an AJAX `fetch` POST with a normal-form fallback if JS fails.
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
npm run build && npm run preview   # serve the actual production build
# Lighthouse (run against the preview server, all 6 pages)
npx lighthouse http://localhost:4321/ --chrome-flags="--headless" --only-categories=performance,accessibility,best-practices,seo
```

Always test against `npm run preview` (the real static build), not `npm run dev` (Astro's dev server does extra work per request and won't give representative Lighthouse numbers).

Current scores as of the last static-HTML version: 98–100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO on every page. Re-verify after the Astro migration before trusting these — the markup output is intended to be byte-for-byte equivalent, but re-run Lighthouse to confirm rather than assuming.

For anything beyond a quick sanity check, `puppeteer-core` (installed with `npm install --no-save puppeteer-core`, pointed at the system Chrome via `executablePath`) is useful for scripted viewport sweeps and screenshots — see git history / CHANGELOG for example scripts. Don't commit it to `package.json`; it's a diagnostic tool, not a site dependency.

## Known gotchas / lessons learned

- **`.main-nav ul a` must stay scoped to `ul`.** A bare `.main-nav a` selector will also match any other link nested inside `.main-nav` (e.g. the phone link or the "Free Estimate" button), and its specificity can silently override that element's own color/display styles. This caused two real, hard-to-spot bugs this project (a nav CTA button rendering with dark text on an orange background, and a phone number failing to hide at the wrong breakpoint). If you add a new element inside `.main-nav` that isn't a plain nav-list link, double check it isn't accidentally styled by `.main-nav ul a`.
- **Avoid scroll-triggered reveal/fade-in animations.** One was added and then removed — it caused a Lighthouse color-contrast failure (audit caught text mid-opacity-transition) and made page content dependent on IntersectionObserver timing/JS succeeding. If you want scroll animations back, make sure there's a hard fallback that guarantees content becomes visible even if JS fails or an observer never fires.
- **`og:image` tags must point at files that actually exist.** All JPG fallbacks were deleted at one point (site is WebP-only) without updating the `og:image`/JSON-LD `image` meta tags, which broke social-share previews on every page for a while. Each page's `og:image` now points at that page's own hero `-hero.webp` file — keep them in sync if you change a hero photo.
- **Check that image filenames/alt text match what's actually in the photo.** `attic-insulation-installation.webp` was originally misnamed `roofing-project-gallery.webp` and got used with a "Siding Repair & Replacement" caption on the Services page — wrong content, not just a wrong filename. Look at the actual photo before reusing it somewhere new.
- **Favicon is the client's real favicon**, pulled directly from `nolimitroofingin.com/favicon.ico` (which redirects to their actual icon file) — not a custom-designed mark. If the client ever rebrands, source a new one from them rather than inventing one.

## Deployment

Connect this repo to Netlify. `netlify.toml` already configures:
- Build command: `npm run build`
- Publish directory: `dist`
- Cache headers (immutable long-cache for fingerprinted `/_astro/*` assets and images, short for HTML)
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`, etc.)

No environment variables or secrets are required.
