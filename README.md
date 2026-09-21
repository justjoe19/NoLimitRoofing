# No Limit Roofing — Website

A static marketing + local-SEO site for **No Limit Roofing**, a roofing contractor serving the Michiana region (South Bend / Mishawaka / Plymouth, IN) since 2010. Built to replace [nolimitroofingin.com](https://nolimitroofingin.com) with a faster, more modern, lead-capture-focused design, and being expanded per a client-provided Website Design + SEO Build Brief into a full service/location-page SEO architecture. Currently 48 pages: 5 of the original 6 content pages + 404 (the Projects/gallery page was removed — see CHANGELOG Session 14), 3 service-group hubs, 13 service pages, 10 city pages, and a 15-article Learning Center blog the client can write their own posts for (see "Learning Center & CMS" below). Full history in `CHANGELOG.md`.

Live repo: https://github.com/justjoe19/NoLimitRoofing

## Project status (updated Session 29 — read this first if picking the project back up)

**Site direction**: mid-restyle. The client sent a reference mockup (different site's homepage) asking to match its look — Sessions 25-28 rebuilt the visual system (dark/orange palette, bold uppercase type, a real logo, dark nav bar) and the homepage's structure (trust strip, services grid, "Why Choose" stat section, a real testimonial carousel) to match it, while deliberately keeping this site's own real content, copy, and service focus rather than copying the mockup's insurance-claim-heavy messaging (explicitly declined by the client — see CHANGELOG Session 26).

**Local commits not yet pushed to GitHub**: as of Session 29, `main` is ahead of `origin/main` — check `git log --oneline origin/main..HEAD` before assuming the live repo (and therefore Netlify, once connected) reflects the latest work. This project's standing rule is to only push when explicitly asked.

**Genuinely open items, most blocked on the client, not on more dev work**:
- **Netlify Identity + Git Gateway** still need enabling in the Netlify dashboard (account-level, can't be done from code) before `/admin` (Decap CMS) actually works for the client — see "Learning Center & CMS" below.
- **Analytics (GA4) and Google Search Console** aren't wired up — need a GA4 property ID and Google account access from the client.
- **Live Google Reviews widget** — currently a static grid of real, verified testimonials; going live needs API credentials tied to the client's Google Business Profile.
- **No real commercial-job photo exists anywhere** — checked this project's own assets, the original 16 client photos, every page of the live site, Facebook, and LinkedIn (Session 24). The Commercial pages' hero/content image is a real photo but below-ideal resolution with no higher-res source available. Don't swap in a residential photo to "solve" this — ask the client for a real commercial job photo instead.
- **3 photo categories from the original Session 6 brief are still missing**: a CertainTeed RoofRunner install shot, a branded truck photo, an office photo. No substitute has been used for these.
- **Mobile-viewport visual QA is incomplete for the Session 25-28 restyle** — `resize_window` wasn't reliably affecting real viewport width this arc (see Known gotchas), so verification leaned on Lighthouse's mobile-emulated audit rather than an actual hands-on mobile walkthrough. Worth a manual check before treating the restyle as fully done.
- **Project Gallery and an "Insurance Claims" nav item were deliberately left out** of the restyle (client confirmed, Session 26) — Project Gallery was removed earlier (Session 14) for lack of real project content to show; revisit either if the client's priorities change.

## Tech stack

- **[Astro](https://astro.build)** (static output, no server) — layouts + components replace hand-duplicated HTML. 48 pages built from `src/pages/*.astro` (including 3 dynamic routes driven by content collections) plus a 404 page.
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

Shared markup — header, footer, nav, cert badge row — lives once each in `src/components/` and `src/layouts/BaseLayout.astro`, not duplicated per page. Page-specific content lives directly in each `src/pages/*.astro` file. When editing shared structure (nav links, footer, etc.), there is exactly one file to change, not seven.

URLs are unchanged from the original static site (`/about.html`, not `/about`) — `astro.config.mjs` sets `build.format: "file"` specifically to preserve this, so no redirects were needed for this migration.

## Project structure

```
src/
  content.config.ts     Zod schemas for the `services`, `locations` and
                        `learningCenter` content collections (src/content/).
  content/
    services/*.md        13 leaf service pages (frontmatter: hero copy,
                        highlights, FAQs, related links; body = long copy).
    locations/*.md        10 city pages, same shape.
    learning-center/*.md  Blog posts. Editable via the site (developer) or
                        through Decap CMS at /admin (the client) — see
                        "Learning Center & CMS" below. No `slug` frontmatter
                        field — the filename IS the URL slug (entry.id).
  layouts/
    BaseLayout.astro   <head> (meta/OG/schema/favicons), skip-link, Header,
                        <main> slot, Footer, mobile call bar, main.js tag.
  components/
    Header.astro        Nav + mobile drawer toggle + the single "Services"
                        dropdown (Roofing/Storm Damage/Commercial as three
                        grouped columns — a mega-menu, not three separate
                        top-level dropdowns). Built on <details>/<summary>
                        (same pattern as the FAQ accordion); main.js adds
                        click-outside/Escape/link-click closing on top.
                        Sets aria-current from the current URL.
    Footer.astro         Full site footer + the sticky mobile call bar.
    CertBadges.astro     Static, evenly-spaced manufacturer-badge row —
                        never wraps, shrinks together as the viewport
                        narrows (used on Home and About).
  styles/
    global.css          Tailwind source — design tokens (@theme) + component
                        classes (@layer components), e.g. .btn, .card, .hero.
                        `.article-body` holds the Learning Center's markdown
                        prose rules (headings/lists/links) since the base
                        layer strips default spacing/list-styles site-wide.
  pages/
    index.astro, about.astro, services.astro,   5 of the original 6 pages
    areas.astro, contact.astro, 404.astro        (gallery.astro/Projects was
                                                   removed — Session 14).
    roofing/index.astro, storm-damage/index.astro,   Group hub pages —
    commercial/index.astro                            hand-written, list
                                                        that group's services
                                                        from the collection.
    [group]/[slug].astro   ONE dynamic route rendering all 13 service leaf
                        pages from the `services` collection, keyed by each
                        entry's `group`/`slug` frontmatter — not 3 separate
                        template files.
    service-areas/[slug].astro   Dynamic route rendering all 10 city pages
                        from the `locations` collection.
    learning-center/index.astro, learning-center/[slug].astro   Blog index
                        + article template, from the `learningCenter`
                        collection.

public/                  Served as-is, unprocessed — same convention as the
                        old repo root.
  admin/index.html, admin/config.yml   Decap CMS — see "Learning Center &
                        CMS" below. config.yml is currently scoped to the
                        `learning-center` collection only.
  images/*.webp          All site imagery, WebP only.
  images/*-hero.webp      Extra-compressed variants used as full-bleed hero
                          backgrounds (see "Hero images" below).
  images/badge-*.webp     Manufacturer certification badges.
  images/learning-center/  Where Decap CMS saves images the client uploads
                          through the article editor. Not committed while
                          empty — Decap/git will recreate it the first time
                          someone uploads an image through /admin.
  images/nlr-logo.{png,webp}  Company logo — the client's real recreated
                          artwork (Session 28), background removed. png kept
                          for JSON-LD/og:image use. Aspect ratio is 500:232;
                          if this file is ever replaced again, check the new
                          ratio against the hardcoded width/height attrs in
                          Header.astro, Footer.astro and 404.astro — they
                          don't derive automatically and will distort the
                          logo if left stale (this exact mistake happened
                          twice already, see CHANGELOG Sessions 25 and 28).
  js/main.js              Mobile nav, contact/quick-inspection form
                          validation + AJAX submit (generic — handles any
                          data-netlify form on the page, not hardcoded to
                          one form id), nav dropdown close behavior, lite
                          YouTube embed, header scroll shadow. No dependencies.
  favicon.ico, favicon-*.png,  Favicon set generated from the client's real
  apple-touch-icon.png,        recreated logo (Session 28) — a crop of just
  icon-192.png, icon-512.png   the roof/window icon mark on a solid dark
                                background (the full wordmark doesn't read
                                at 16-32px). Originally sourced from the old
                                site's actual favicon (Session 1); superseded
                                once the client sent real logo artwork.
  site.webmanifest, robots.txt   sitemap.xml is no longer a static file here
                                — @astrojs/sitemap generates sitemap-index.xml
                                and sitemap-0.xml at build time from the
                                actual page set, so it can't go stale.

integrations/fix-sitemap-urls.mjs   Local Astro integration, runs after
                        @astrojs/sitemap. The sitemap plugin builds URLs
                        from Astro's route patterns ("/about"), with no
                        awareness of build.format:"file" — left alone it
                        would point Google at URLs that 404. This appends
                        .html to every sitemap entry except the homepage.

astro.config.mjs, tsconfig.json, netlify.toml
package.json, package-lock.json   Astro + Tailwind Vite plugin only.
```

## Design system

Defined in `src/styles/global.css` under `@theme` (Tailwind v4's CSS-first config — there is no `tailwind.config.js`). **Restyled in Session 25** to match a client-supplied reference mockup; these are the current, live values:

| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#0c1115` | Primary dark bg (header, footer, dark sections) |
| `--color-ink-soft` | `#161c21` | Dark bg, one step lighter (trust strip, hero gradient mid-stop) |
| `--color-ink-softer` | `#232b31` | Dark bg, lightest step (hero gradient bottom-stop) |
| `--color-paper` | `#ffffff` | Card/content backgrounds |
| `--color-fog` | `#f2f3f5` | Light section background |
| `--color-mist` | `#e4e7eb` | Borders |
| `--color-steel` | `#545d68` | Secondary/muted text |
| `--color-accent` | `#e56115` | Brand orange — large text, icons, glows (3.47:1 on white; fails AA for body text, see gotcha below) |
| `--color-accent-dark` | `#b84c0f` | Button backgrounds, small/normal-weight text on light backgrounds (5.15:1 on white — use this, not `--color-accent`, for anything under ~18px) |
| `--color-accent-light` | `#f0813a` | Text/icons on dark backgrounds (7.14:1 on `--color-ink`) |

Desktop nav breakpoint is `lg` (1024px) — below that, the hamburger drawer takes over. Container max-width is 1200px (`.container`). The header (`.site-header`) is dark (Session 27), not white — if you add new nav-adjacent elements, style them for a dark bg by default.

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

## Learning Center & CMS

The Learning Center (`/learning-center.html` + `src/pages/learning-center/[slug].astro`) is a blog, backed by the `learningCenter` content collection (`src/content/learning-center/*.md`) and editable through **Decap CMS** at `/admin` — a free, git-based CMS with no database and no server code: the client fills out a form in the browser, Decap commits a markdown file to this repo, and Netlify rebuilds the site automatically, same as any other push.

**One-time setup required in the Netlify dashboard before `/admin` will actually work** (I can't do this myself — it's account-level config, not code):
1. Site settings → Identity → **Enable Identity**.
2. Site settings → Identity → **Registration** → set to "Invite only" (so random people can't self-register as editors).
3. Site settings → Identity → Services → **Git Gateway** → Enable. This is what lets Decap commit to the repo on the client's behalf without giving them a real GitHub account or credentials.
4. Identity tab → **Invite users** → send the client an invite at their email. They'll set a password and can then log in at `yoursite.com/admin`.

Until that's done, `/admin` will load (it's just a static page) but the login form has nothing to authenticate against.

**What the client can do**: create, edit and delete Learning Center articles — title, cover photo, publish date, and the article body via a markdown editor — without touching code or GitHub directly. New articles default to "draft" (hidden from the live site) so a half-finished post can't accidentally go live; the client unchecks that when it's ready. `publish_mode: editorial_workflow` in `public/admin/config.yml` also means changes go through a draft → review → publish flow in the CMS UI rather than committing straight to `main` on every keystroke-save.

**Scope**: the CMS is currently wired to the `learning-center` collection only. Extending it to services, locations, reviews or FAQs later just means adding another `collections` entry to `public/admin/config.yml` with matching fields — the pattern is already established.

## Business facts reference

So future edits don't have to re-derive these from the old site:

- **Phone**: (574) 360-0525
- **Founded**: 2010. **Owner**: Jonathan Smith, 25+ years experience.
- **Offices**: Mishawaka, IN and Plymouth, IN (regional offices — no public street addresses, city-level only). An Ohio location is referenced as "opening soon" with no further detail.
- **Service area**: St. Joseph County IN, LaPorte County IN, Marshall County IN, Berrien County MI, Cass County MI, Greater South Bend–Elkhart region.
- **Certifications**: GAF Certified, IKO RoofPro (Select & Preferred), Owens Corning, Malarkey, Atlas, CertainTeed Shingle Master, SRS TopShield PRO.
- **Social**: Facebook `/NoLimitRoofingIN`, LinkedIn `/company/no-limit-roofing-indiana`, YouTube (playlist linked in footer).
- **Reviews**: 5.0★ average. The testimonials on Home/About are verbatim quotes pulled from the original site (K. Hall, L. Bauer, D. Beery, S. Wilcox, S. Rosado, S. Zellers) — don't paraphrase or invent new ones without a real source.
- **Roofs completed**: 1000+ — confirmed real by the client (Session 25), used as a homepage trust stat.
- **No published business hours** — the site deliberately avoids stating specific hours (none were published on the original site). Copy instead says "call anytime for emergencies" / "we respond same business day."

## Testing

```bash
npx astro check                    # type/content-collection errors across every .astro file
npm run build && npm run preview   # serve the actual production build
# Lighthouse (run against the preview server — check astro preview's
# terminal output for the actual port, it isn't always 4321)
npx lighthouse http://localhost:4321/ --chrome-flags="--headless" --only-categories=performance,accessibility,best-practices,seo
```

Always test against `npm run preview` (the real static build), not `npm run dev` (Astro's dev server does extra work per request and won't give representative Lighthouse numbers).

Current scores (last verified Session 28, after the Session 25-28 restyle/homepage-rebuild/logo work): most pages hit a literal 100/100/100/100; the homepage sits at 98-99 Performance depending on the run. That's not a bug — Lighthouse's own LCP sub-diagnostics score it as already optimized; the homepage is legitimately the heaviest page on the site by design (16+ sections after Session 26's rebuild), and the score comes down to sub-second timing noise under Lighthouse's simulated mobile CPU throttle. **A single Lighthouse score under 100 is expected noise, not a regression — always re-run at least once before treating a dip as real**, and expect the real Netlify CDN to score at or above whatever a local `astro preview` run shows.

Two useful one-off scripts from Session 10's audit (not committed — recreate from `CHANGELOG.md` if needed): a Python script that parses every page in `dist/` for missing/duplicate titles, meta descriptions, H1 issues, heading-hierarchy skips, and missing image alt/dimensions; and one that crawls every internal `href` in `dist/` against the actual built file set to catch broken links (excluding `/admin/`, which isn't a content page).

For anything beyond a quick sanity check, `puppeteer-core` (installed with `npm install --no-save puppeteer-core`, pointed at the system Chrome via `executablePath`) is useful for scripted viewport sweeps and screenshots — see git history / CHANGELOG for example scripts. Don't commit it to `package.json`; it's a diagnostic tool, not a site dependency.

## Known gotchas / lessons learned

- **`.main-nav ul a` must stay scoped to `ul`.** A bare `.main-nav a` selector will also match any other link nested inside `.main-nav` (e.g. the phone link or the "Free Estimate" button), and its specificity can silently override that element's own color/display styles. This caused two real, hard-to-spot bugs this project (a nav CTA button rendering with dark text on an orange background, and a phone number failing to hide at the wrong breakpoint). If you add a new element inside `.main-nav` that isn't a plain nav-list link, double check it isn't accidentally styled by `.main-nav ul a`.
- **Avoid scroll-triggered reveal/fade-in animations.** One was added and then removed — it caused a Lighthouse color-contrast failure (audit caught text mid-opacity-transition) and made page content dependent on IntersectionObserver timing/JS succeeding. If you want scroll animations back, make sure there's a hard fallback that guarantees content becomes visible even if JS fails or an observer never fires.
- **`og:image` tags must point at files that actually exist.** All JPG fallbacks were deleted at one point (site is WebP-only) without updating the `og:image`/JSON-LD `image` meta tags, which broke social-share previews on every page for a while. Each page's `og:image` now points at that page's own hero `-hero.webp` file — keep them in sync if you change a hero photo.
- **Check that image filenames/alt text match what's actually in the photo.** `attic-insulation-installation.webp` was originally misnamed `roofing-project-gallery.webp` and got used with a "Siding Repair & Replacement" caption on the Services page — wrong content, not just a wrong filename. Look at the actual photo before reusing it somewhere new.
- **Favicon and logo are the client's real artwork**, not invented — originally the old site's actual favicon (Session 1), now regenerated from the client's recreated logo file (Session 28) once they sent one. If either the logo or favicon ever needs to change again, get the real asset from the client rather than designing a placeholder — and if you're extracting one from a screenshot/mockup as a stopgap (as Session 25 did before the real file arrived), say so explicitly and flag it as temporary, since it'll be visibly softer than real artwork.
- **A brand color swap needs a contrast check, not just a screenshot check.** Session 25's new brand orange (`--color-accent`, sampled directly from the client's mockup) looked fine by eye but only measures 3.47:1 against white — Lighthouse caught 6 real failures (every primary button, the mobile call bar) once it was used for body-sized text, where the old orange's 5.38:1 had been passing. Use `--color-accent-dark` for text/button-backgrounds under ~18px on light backgrounds; save the brighter `--color-accent` for large text, icons, and glows. Run Lighthouse's accessibility category after *any* palette change — don't trust visual inspection alone.
- **The Read/screenshot tool composites transparent PNGs onto a dark backdrop by default.** After chroma-keying a logo's background to transparent, it can look completely unchanged in a preview — that's the tool's rendering, not a failed edit. Verify by sampling the actual alpha channel at a background pixel, or by compositing onto white before trusting the result.
- **`resize_window` (browser automation) has been unreliable for testing real mobile viewports in this project** — calls report success but `window.innerWidth` doesn't change. Until that's fixed, use Lighthouse (which runs its own mobile-emulated audit) for a real mobile signal, and/or constrain a `.container`'s own width via injected CSS as a rough visual check — but that only tests container-width-driven behavior (like the cert-badge row's flex-shrink), not real viewport-width media queries (`sm:`/`lg:` Tailwind variants), so it can give false confidence on breakpoint-driven layout.

## Deployment

Connect this repo to Netlify. `netlify.toml` already configures:
- Build command: `npm run build`
- Publish directory: `dist`
- Cache headers (immutable long-cache for fingerprinted `/_astro/*` assets and images, short for HTML)
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`, etc.)

No environment variables or secrets are required.
