# No Limit Roofing — Website

A static marketing + local-SEO site for **No Limit Roofing**, a roofing contractor serving the Michiana region (South Bend / Mishawaka / Plymouth, IN) since 2010. **The live site (launched Oct 2026) is four pages plus a 404: Home, Storm Damage, Roof Replacement and Asphalt Shingle Roofing.** The original 48-page SEO build (services, city pages, Learning Center blog) is shelved, not deleted — see "Current status" below. Full history in `CHANGELOG.md`.

Live repo: https://github.com/justjoe19/NoLimitRoofing

## Current status: LIVE at https://nolimitroofingin.com (launched 2026-10-07) — read this first

**Live scope: `/` (home), `/storm-damage.html`, `/roof-replacement.html`, `/asphalt-shingle-roofing.html`, plus the 404.** All four content pages are indexable and in the sitemap (`sitemap-index.xml`); only the 404 is `noindex`. The pages are used at their real URLs; there are no alias URLs (`/storm-damage-inspection` and `/new-roof-estimate` were removed and 404). The asphalt shingle page is an addition beyond the original three (see CHANGELOG Session 41); its content is adapted from the shelved `src/content/services/asphalt-shingle-roofing.md`.

**Everything else is shelved, not deleted.** The other page sources sit in `src/pages/` but are in `.gitignore` and untracked, so Netlify never builds them (`public/admin/` is shelved the same way). The full 48-page site is kept at git tag `full-site-48-pages` (restore with `git checkout full-site-48-pages -- src/pages public/admin`). To bring a page back: remove its line from `.gitignore`, `git add` it, and restore its nav/footer/home links. **A local `npm run build` still builds the shelved pages (about 50), but Netlify only builds tracked files.** To check what will really deploy, build from a clean copy of tracked files (`git ls-files -co --exclude-standard`): it gives 5 pages. Note the shelved pages still say "GAF factory-certified" in many places (the live site says CertainTeed; see below).

### How the live site is put together

- **Hosting:** Netlify project `no-limit-roofing` (repo `justjoe19/NoLimitRoofing`, branch `main` auto-deploys in about 15 seconds). Primary domain `nolimitroofingin.com`; `www` redirects to it; `no-limit-roofing.netlify.app` still works.
- **Domain and DNS:** registered at GoDaddy (renews every Oct 13; paid through Oct 13, 2027). DNS is hosted by **Netlify DNS** (nameservers `dns1.p02.nsone.net` … `dns4.p02.nsone.net`). Records in the Netlify zone: the two Netlify-managed apex/`www` records; five Google MX records (`aspmx.l.google.com` priority 1, `alt1`/`alt2` priority 5, `alt3`/`alt4` priority 10); TXT `v=spf1 include:_spf.google.com ~all`; the `google-site-verification` TXT; and the Mailgun DKIM TXT `k1._domainkey.mg`. The client says nobody uses email on the domain; the MX records were kept as insurance and can be removed later. The old agency's Cloudflare zone is no longer used.
- **HTTPS:** Let's Encrypt, issued and renewed automatically by Netlify as long as the domain keeps pointing at Netlify. If a certificate ever fails, check Netlify → Domain management → HTTPS and "Verify DNS configuration".
- **Forms:** one Netlify form named `contact`, used by all four pages. **Form detection must stay enabled** (Netlify → Forms); it was off until launch day, which meant submissions were not captured. Each submission emails the client's sales address through a Netlify "Email notification" (Forms → Form submission notifications). The hidden `source` field says which page it came from: `homepage`, `storm-damage-lp`, `roof-estimate-lp`, `shingles-lp`. See "Contact form" below.
- **Old WordPress URLs** (about 50) are 301-redirected to `/` in `netlify.toml`; unknown URLs get the custom `404.html`.
- **Header / nav:** `BaseLayout.astro` renders `src/components/Header.astro` on every page: logo, links to Home, Storm Damage, Roof Replacement and Asphalt Shingles (current page underlined), phone, one button, and a hamburger drawer on phones. To go back to the nav-less bar (logo, phone, button), swap `Header` for `landing/LandingHeader.astro` in `BaseLayout.astro`.
- **Certification wording:** the footer and "Why choose" text say **"CertainTeed factory-certified"** at the client's request (they previously said GAF). The client is responsible for the claims on the pages; get changes to claims confirmed in writing.

### Landing-page layout (shared sections)

Every page follows the same layout from the client's storm-damage mockup, with its own copy: hero with the lead form on the right, trust strip, a white "checklist + before/after slider + five-step process" section, a dark six-photo tile strip (Storm, Roof and Shingle pages; the home page keeps its four linked "Complete Roofing Solutions" cards), the insurance section, "Why choose" band, reviews, and a closing banner with the four service icons and the service-area line. Details are in "Landing pages and shared sections" below.

### Photos

All placeholder slots were filled on 2026-10-07. Slider pairs: `storm-damage-before/after.webp` (Storm page) and `roof-replacement-before/after.webp` (Home, Roof and Shingle pages share one pair). Tree and gutter tiles: `service-tree-damage.webp`, `service-gutter-damage.webp`. The tile strips on the Roof and Shingle pages use existing library photos. The photos look computer-generated; if they are not real jobs the client should be told (misleading-advertising risk), or they should be labelled as illustrations or replaced.

### Ongoing checklist

- [x] Domain connected, HTTPS issued, nameservers switched, `www` redirect, forms tested, notification email set (2026-10-07).
- [x] Search Console Domain property, sitemap submitted, Google Business Profile website updated, client confirmed the claims on the pages.
- [ ] Calendar: domain renewal at GoDaddy (Oct 13, 2027); glance at the Netlify certificate in early December and again before each expiry (they renew themselves, about every 60 days).
- [ ] After launch, look at the **Spam** tab in Netlify → Forms after a week or two, in case real leads were filtered.
- [ ] Optional/client: GA4 or Google Ads conversion tracking. No code is needed first; the form posts a `source` field and phone buttons are plain `tel:` links to hook onto.
- [ ] Optional: structured data still lists a Plymouth location in the home JSON-LD; add opening hours if the client supplies them.

The full-site checklist below applies only if the shelved pages are re-enabled.

## Earlier project status (Session 39, full-site era — background only)

**Session 39 summary**: SEO content depth and internal linking (unique city pages, expanded service pages, linked Learning Center articles), the Google rating shown as text/graphic only, mobile layout fixes, and a **[Go-live checklist](#go-live-checklist-added-session-39--everything-still-needed-beforeat-launch) below — that is the main list of what is left.** Client decisions worth knowing: never write a "5-star" rating anywhere on the site (the decorative star graphic above the reviews is fine; the homepage says "Highly rated on Google" with no number); keep the old WordPress site out of client-facing material; the client owns the Google accounts and the developer helps with the DNS change. `.city-facts-to-verify.txt` (untracked, local only) lists the city-page facts the client should confirm. Full details in `CHANGELOG.md` (Session 39). The session 38 notes follow.


**Site direction**: restyle and branding overhaul are complete and stable. Sessions 25-28 rebuilt the visual system (dark/orange palette, bold uppercase type, a real logo, dark nav bar) and homepage structure to match a client-supplied reference mockup. Sessions 30-37 handled steady-state maintenance, photography upgrades, and navigation contrast fixes. **Session 38 completed a major branding and copy refinement**:
- **Removal of all "restoration" references**: Per explicit client directive, all mentions of "restoration" were removed across the entire site (copy, meta descriptions, image alts, and JSON-LD schemas), reframing the messaging around residential & commercial roofing, repair, and insurance claims/storm damage support.
- **Ultra-HD mascot logo**: Replaced the previous 1024px logo with a crisp, subpixel anti-aliased 2040×1124 asset (`nlr-logo.png` / `nlr-logo.webp`) generated from the 2048×1132 master source (`source_assets/IMG_4104.png`), complete with clean interior knockouts (hose loops, between legs, beneath nail gun).
- **Contractor head favicon suite**: Generated a dedicated crop of the contractor mascot's head across all tab favicons (transparent `.ico` and 16/32/48px `.png`) and mobile app icons (180px apple-touch-icon, 192/512px PWA icons on brand `#0c1115`).
- **Responsive logo sizing**: Sized up the logo in the header (`h-14 sm:h-16 lg:h-20`), footer (`h-16 sm:h-20` standalone, removing redundant text), homepage Why Choose section (`max-w-[430px]`), and pre-footer CTA (`h-20 sm:h-24 lg:h-28`) for visual balance and readability.

**Watch for changes made outside this project's normal workflow.** Session 30 had to review and partially revert a large external commit that reintroduced two nav items the client had explicitly declined. It happened again in Session 36 (a batch photo-generation script + new Areas page icons) — that one was reviewed and kept, with only a couple of missed `alt`/dimension attributes fixed. **When picking this project back up, always check `git log` for commits you don't recognize before assuming the tree matches what's documented here**, and review them the same way: confirm every change actually applied, check for anything the client previously declined, rebuild and re-run the SEO/broken-link checks before trusting it.

**Deployed and live**: connected to Netlify — `https://no-limit-roofing.netlify.app` reflects `main` on every push and currently scores Desktop 100/100/100/100, Mobile ~97-98/100/100/100 (Lighthouse, see Testing below). **(Historical, Session 38: the real custom domain `nolimitroofingin.com` was not yet pointed at this Netlify site; it was connected on 2026-10-07, see "Current status".)** [Original text:] **the real custom domain, `nolimitroofingin.com`, was NOT yet pointed at this Netlify site** — as of Session 38 it still resolves to the client's old WordPress/Divi site. Someone needs to add the custom domain in Netlify's dashboard and repoint the domain's DNS to it before this project is actually the live public site.

**Genuinely open items, most blocked on the client, not on more dev work**:
- **The domain cutover above** — biggest remaining item. Netlify has the correct build; DNS/domain just isn't pointed at it yet.
- **Netlify Identity + Git Gateway** still need enabling in the Netlify dashboard (account-level, can't be done from code) before `/admin` (Decap CMS) actually works for the client — see "Learning Center & CMS" below.
- **Analytics (GA4) and Google Search Console** aren't wired up — need a GA4 property ID and Google account access from the client.
- **Live Google Reviews widget** — currently a static grid of real, verified testimonials; going live needs API credentials tied to the client's Google Business Profile.
- **No real commercial-job photo exists anywhere** — checked this project's own assets, the original 16 client photos, every page of the live site, Facebook, and LinkedIn (Session 24). The Commercial pages' hero/content image is a real photo but below-ideal resolution with no higher-res source available. Don't swap in a residential photo to "solve" this — ask the client for a real commercial job photo instead.
- **3 photo categories from the original Session 6 brief are still missing**: a CertainTeed RoofRunner install shot, a branded truck photo, an office photo. No substitute has been used for these.
- **One leftover branded graphic used as a plain thumbnail**: `service-roof-overlay.webp` (Services page, "Roof Overlay" card) is the client's own before/after project-gallery graphic — logo and a "BEFORE" inset baked into the image — being used at small grid-card size. Not wrong, just busy; would benefit from a plain unbranded overlay photo if one ever becomes available (Session 36).
- **Project Gallery and an "Insurance Claims" nav item were deliberately left out** of the restyle (client confirmed, Session 26) — Project Gallery was removed earlier (Session 14) for lack of real project content to show; revisit either if the client's priorities change.

## Full-site go-live checklist (Session 39 — applies only if the shelved pages are re-enabled)

The site itself is built and deployed to `https://no-limit-roofing.netlify.app`. What remains is account/DNS/content work, mostly on the client's side. The client-facing explainer is a separate Google Doc ("No Limit Roofing: Website SEO Guide").

**Before launch — content the client must confirm or supply**
- [ ] Client reads through the 10 city pages and confirms the local facts (kept in an untracked local file, `.city-facts-to-verify.txt`, deliberately not committed). Includes process claims such as cleanup and how active leaks are prioritized.
- [ ] Client skims the 6 commercial service pages (TPO, EPDM, coatings, repair, replacement, maintenance) — they include a generic "questions to ask any roofer" list and a white-EPDM mention that should match how the company actually works.
- [ ] Confirm whether the Mishawaka street address (1911 Clover Rd, Suite 10) is public. It is in the homepage JSON-LD, but the README below says offices are city-level only. Decide once, then make the site, Google Business Profile and directories match exactly.
- [ ] Confirm the "Ohio location opening soon" line on `/areas` is still accurate.
- [ ] Real job photos labeled with the city (for city pages and the Business Profile); a real commercial-job photo; and the still-missing RoofRunner, branded truck and office photos.

**Before launch — accounts and settings**
- [ ] Netlify: enable **Identity + Git Gateway** so the client can post at `/admin` (Decap CMS).
- [ ] Netlify Forms: set up **email/webhook notifications** for the contact form. Right now submissions only land in the dashboard's Forms tab, so leads could sit unseen. Send a real test submission end to end.
- [ ] Client creates/owns a Google account (business account preferred) for Search Console, GA4 and the Business Profile.
- [ ] GA4 property created and its measurement ID added to the site (not wired in yet).
- [ ] Google Business Profile: find or claim the listing, remove duplicates, start verification early (a postcard can take about a week).

**Launch day**
- [ ] Netlify: add `nolimitroofingin.com` as the primary domain; update DNS (do this with the client on a call); wait for HTTPS. Use the apex domain (no www) with www forwarding to it, since canonicals and the sitemap assume no www. Confirm `no-limit-roofing.netlify.app` forwards to the real domain.
- [ ] **Redirects (internal only, do not put in client materials):** list the old WordPress site's URLs before cutover and add a 301 in `netlify.toml` for any that differ from the new ones. Only `/home` and `/index` redirect today.
- [ ] Search Console: add a **Domain** property, verify with the DNS TXT record (same DNS session), submit `sitemap-index.xml` (should show 47 pages), and request indexing for Home, Services, Contact and a few city pages.
- [ ] Verify live: `/robots.txt` lists the sitemap, padlock on every page, canonicals point at `nolimitroofingin.com`, only the 404 is `noindex`.
- [ ] Google Business Profile: set the website field to the new domain **after** the switch; name/address/phone must match the site exactly; primary category Roofing contractor; service areas; hours; services; photos; copy the review link.
- [ ] Link GA4 to Search Console.

**First month**
- [ ] Watch Search Console Indexing → Pages (new pages take days to weeks; anything "Crawled, currently not indexed" after a month may be too thin), Sitemaps, Performance, Enhancements (FAQ and breadcrumb markup).
- [ ] Expect ranking movement for a few weeks after a domain switch.
- [ ] Re-run Lighthouse on the live domain (goal: keep desktop 100 / mobile ~97+).

**Ongoing (client)**
- [ ] Ask every happy customer for a Google review and take 2–3 job photos with the town noted; monthly Business Profile post; one Learning Center article every month or two; quarterly review of pages with impressions but few clicks.
- [ ] Keep the homepage's "Highly rated on Google" line honest — it deliberately shows no number. Testimonials on Home/About are verbatim quotes from the original site, not a live Google feed; a live reviews widget still needs API credentials tied to the Business Profile.

## Landing pages and shared sections

The four live content pages are built from shared components. Page files only pass copy and image paths in.

- `src/components/landing/LandingPage.astro` — the page shell (`BaseLayout` with the `landing` prop gives the sticky call bar). Props: `seo`, `schema`, `source`, `ctaLabel`, `heroImage`, `eyebrow`, `h1Lines`, `subhead`, `body`, `primaryCta`, `callout`, `trust`, optional `cards` and `process` (the older three-card and four-step sections; omit them when a page fills the slot instead), `why`, `form`, and `bottomServices` (adds the service icons and area line to the closing banner). It has a named slot `after-trust` (rendered after the trust strip) and a default slot (rendered after the process section).
- `src/components/LeadForm.astro` — the lead form card, shown in the **hero** of the home page and all landing pages (it was moved up from the bottom at the client's request; the closing banner keeps a button back to `#inspection`). One instance per page: its ids (`lead-form`, `lead-sent`, `name`, …) are used by `main.js`.
- `src/components/landing/AfterSection.astro` — checklist + before/after slider (range input; pass `beforeImg`/`afterImg`, placeholders render when omitted) + numbered process. Used on all four pages.
- `src/components/landing/TileStrip.astro` — dark band with six photo tiles (a tile with `img: null` renders a placeholder). Used on Storm, Roof and Shingle.
- `src/components/InsuranceSection.astro` — "We Work With Your Insurance Company" band (stock inspector photo, four bullets, "Why homeowners choose" list). Deliberately has no warranty claim and no star rating.
- `src/components/ServicesRow.astro`, `ServiceArea.astro` — the four service icons and the "Serving South Bend, Mishawaka, Elkhart…" line in the closing banner.
- Hero layout: the `.hero-lead*` rules in `global.css` (text and callout on the left, form on the right on desktop; text, form, callout stacked on phones). The closing-banner grid rule is `.split.lp-cta-3` in `global.css`.

Page files: `src/pages/index.astro` (its own hero and sections, using `LeadForm`, `AfterSection`, `InsuranceSection`), `storm-damage.astro`, `roof-replacement.astro`, `asphalt-shingle-roofing.astro` (also keeps its own "What goes under the shingles" and FAQ sections in the default slot). To add a landing page: copy `roof-replacement.astro`, change the copy, `source`, schema and canonical, and add a link in `Footer.astro` and `Header.astro`.

**Mobile checks that were done:** no sideways scroll at 320–430px, form fields at 16px (stops iOS zooming on focus), footer links and the call link about 44px tall. If you add form fields, keep them at 16px on phones.

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
    LeadForm.astro       The lead form card (hero of every live page).
    InsuranceSection.astro, ServicesRow.astro, ServiceArea.astro
                        Shared bands for the live pages — see "Landing pages
                        and shared sections" above.
    landing/            LandingPage.astro (page shell), AfterSection.astro,
                        TileStrip.astro, LandingHeader/LandingFooter.astro
                        (the last two are currently unused).
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
  images/nlr-logo.{png,webp}  Company logo — generated from the master 2048×1132
                          artwork (source_assets/IMG_4104.png, Session 38)
                          at 2040×1124 with subpixel alpha anti-aliasing and
                          negative space cutouts (hose loops, between legs,
                          beneath nail gun). PNG kept for JSON-LD/og:image use.
                          Intrinsic aspect ratio is ~180:99 (~1.815:1); if this
                          file is ever replaced again, check the new ratio
                          against the hardcoded width/height attrs in
                          Header.astro (180×99), Footer.astro (180×99),
                          404.astro (180×99), and index.astro (420×232 and
                          300×166) — they don't derive automatically.
  js/main.js              Mobile nav, contact/quick-inspection form
                          validation + AJAX submit (generic — handles any
                          data-netlify form on the page, not hardcoded to
                          one form id), nav dropdown close behavior, lite
                          YouTube embed, header scroll shadow. No dependencies.
  favicon.ico, favicon-*.png,  Favicon set generated from a close crop of the
  apple-touch-icon.png,        contractor mascot's head with backwards cap
  icon-192.png, icon-512.png   (Session 38). Generates clean micro-scale
                                rendering in browser tabs (multi-res .ico and
                                16/32/48px transparent .png) and mobile/PWA
                                icons (180px apple-touch-icon, 192/512px
                                icons on brand #0c1115 tile).
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

All four live pages use one component, `src/components/LeadForm.astro`, which posts to **Netlify Forms** (no backend code). Relevant bits:

- `name="contact"` + `data-netlify="true"` on the `<form>`, plus a hidden `form-name` field; Netlify's deploy-time scanner needs these in the built static HTML. **Netlify strips `data-netlify` and `netlify-honeypot` from the published HTML once form detection has processed the form**, so `main.js` also selects forms by the hidden `form-name` field. Do not rely on the `data-netlify` attribute in scripts.
- **Form detection must be on** (Netlify → Forms → Form detection), and the site must be redeployed after turning it on, or no submissions are captured.
- Spam: a honeypot field named `bot-field` (hidden off-screen, `tabindex="-1"`, `autocomplete="off"`, `aria-hidden`), plus Netlify's built-in spam filtering (filtered submissions go to the Spam tab, not to email). A name like "website" was avoided because browsers autofill it. No CAPTCHA by design (it costs real leads); add Netlify reCAPTCHA only if spam gets through.
- `public/js/main.js` progressively enhances the form: client-side validation, an AJAX `fetch` POST (with a normal-form fallback if JS fails), a "Request received" panel that replaces the form, and a **"Send another request"** button on that panel that restores a blank form.
- The hidden `source` field tags the page (`homepage`, `storm-damage-lp`, `roof-estimate-lp`, `shingles-lp`).
- Notifications: Forms → Form submission notifications has one email notification for new submissions (the client's sales address, subject "New website lead: No Limit Roofing"). A test submission emails the client, so warn them first.

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
- **Reviews**: shown on the Home page as the text "Highly rated on Google" (no number, so it never goes stale; no aggregateRating schema — Google ignores self-published ratings, so it was removed). The testimonials on Home/About are verbatim quotes pulled from the original site (K. Hall, L. Bauer, D. Beery, S. Wilcox, S. Rosado, S. Zellers) — don't paraphrase or invent new ones without a real source.
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

Current scores (last verified Session 36, against the live Netlify site): Desktop is a clean 100/100/100/100 on the homepage. Mobile runs 97-99 Performance / 100 Accessibility / 100 Best Practices / 100 SEO, with 0ms Total Blocking Time and 0 Cumulative Layout Shift — that couple-point mobile/desktop performance gap is inherent to Lighthouse's mobile preset (it simulates a slow 4G connection plus a 4x CPU slowdown; desktop uses light throttling), not a real site deficiency. **A single Lighthouse score under 100 is expected noise, not a regression — always re-run at least once before treating a dip as real.**

Two useful one-off scripts from Session 10's audit (not committed — recreate from `CHANGELOG.md` if needed): a Python script that parses every page in `dist/` for missing/duplicate titles, meta descriptions, H1 issues, heading-hierarchy skips, and missing image alt/dimensions; and one that crawls every internal `href` in `dist/` against the actual built file set to catch broken links (excluding `/admin/`, which isn't a content page).

For anything beyond a quick sanity check, `puppeteer-core` (installed with `npm install --no-save puppeteer-core`, pointed at the system Chrome via `executablePath`) is useful for scripted viewport sweeps and screenshots — see git history / CHANGELOG for example scripts. Don't commit it to `package.json`; it's a diagnostic tool, not a site dependency.

## Known gotchas / lessons learned

- **Netlify strips `data-netlify` from the published HTML after form detection, and form detection is off by default.** At launch the forms silently captured nothing until detection was enabled, and then the script's `form[data-netlify]` selector stopped matching. `main.js` now keys off the hidden `form-name` field, and detection is on (Netlify → Forms). A deploy is required after enabling detection before the form shows up as active.
- **Check DNS before and after a nameserver change.** The old DNS lived in the previous agency's Cloudflare account (no access), so records had to be rebuilt from an export file before the nameservers were switched; email (MX) records were kept even though nobody uses them. `host -t NS nolimitroofingin.com 8.8.8.8` shows propagation; Netlify's HTTPS "DNS verification failed" message can lag the public resolvers by an hour or two.
- **One component, many pages.** The hero form, insurance band, after-section and tile strip are shared. A change there changes every page, so check all four (and phone width) after touching `LeadForm`, `AfterSection`, `TileStrip` or `LandingPage`. Scoped `<style>` rules inside Astro components lost to `.split`'s Tailwind rule in one case; the closing-banner grid rule therefore lives in `global.css`.
- **Photos can look finished but still need a human check.** The before/after and damage photos appear computer-generated; confirm with the client that they may be shown as real jobs.
- **A Claude Code auto-mode permission check blocks entering DNS records and similar domain changes from the browser tool.** DNS records were entered by hand in Netlify; nameserver and form settings were changed through the dashboard with the user present.

- **`.main-nav ul a` must stay scoped to `ul`.** A bare `.main-nav a` selector will also match any other link nested inside `.main-nav` (e.g. the phone link or the "Free Estimate" button), and its specificity can silently override that element's own color/display styles. This caused two real, hard-to-spot bugs this project (a nav CTA button rendering with dark text on an orange background, and a phone number failing to hide at the wrong breakpoint). If you add a new element inside `.main-nav` that isn't a plain nav-list link, double check it isn't accidentally styled by `.main-nav ul a`.
- **Avoid scroll-triggered reveal/fade-in animations.** One was added and then removed — it caused a Lighthouse color-contrast failure (audit caught text mid-opacity-transition) and made page content dependent on IntersectionObserver timing/JS succeeding. If you want scroll animations back, make sure there's a hard fallback that guarantees content becomes visible even if JS fails or an observer never fires.
- **`og:image` tags must point at files that actually exist.** All JPG fallbacks were deleted at one point (site is WebP-only) without updating the `og:image`/JSON-LD `image` meta tags, which broke social-share previews on every page for a while. Each page's `og:image` now points at that page's own hero `-hero.webp` file — keep them in sync if you change a hero photo.
- **Check that image filenames/alt text match what's actually in the photo.** `attic-insulation-installation.webp` was originally misnamed `roofing-project-gallery.webp` and got used with a "Siding Repair & Replacement" caption on the Services page — wrong content, not just a wrong filename. Look at the actual photo before reusing it somewhere new.
- **Favicon and logo are generated from master artwork**, not placeholders — the logo is generated from the 2048×1132 master source (`source_assets/IMG_4104.png`, Session 38) at 2040×1124 with interior negative space knockouts, and the favicon suite is generated from a high-contrast crop of the contractor mascot's head. If the logo is ever updated or re-exported, keep the intrinsic aspect ratio (~180:99) and update the corresponding `width` and `height` attributes across `Header.astro`, `Footer.astro`, `404.astro`, and `index.astro` to avoid distortion.
- **Do not use the word "restoration" in site copy**: The client explicitly directed removing all references to "restoration" from the site copy, meta descriptions, image alt tags, and JSON-LD schema (Session 38). Frame services as residential and commercial roofing, roof repair, storm damage repairs, and insurance claims assistance.
- **Astro telemetry in sandboxed/CLI environments**: Running `npm run build` or `npx astro check` may fail with an `EPERM` error if Astro attempts to write global telemetry state to `~/Library/Preferences/astro/config.json`. Prefix CLI commands with `ASTRO_TELEMETRY_DISABLED=1` (e.g., `ASTRO_TELEMETRY_DISABLED=1 npm run build`) to ensure clean execution.
- **A brand color swap needs a contrast check, not just a screenshot check.** Session 25's new brand orange (`--color-accent`, sampled directly from the client's mockup) looked fine by eye but only measures 3.47:1 against white — Lighthouse caught 6 real failures (every primary button, the mobile call bar) once it was used for body-sized text, where the old orange's 5.38:1 had been passing. Use `--color-accent-dark` for text/button-backgrounds under ~18px on light backgrounds; save the brighter `--color-accent` for large text, icons, and glows. Run Lighthouse's accessibility category after *any* palette change — don't trust visual inspection alone.
- **The Read/screenshot tool composites transparent PNGs onto a dark backdrop by default.** After chroma-keying a logo's background to transparent, it can look completely unchanged in a preview — that's the tool's rendering, not a failed edit. Verify by sampling the actual alpha channel at a background pixel, or by compositing onto white before trusting the result.
- **`resize_window` (browser automation) has been unreliable for testing real mobile viewports in this project** — calls report success but `window.innerWidth` doesn't change. Until that's fixed, use Lighthouse (which runs its own mobile-emulated audit) for a real mobile signal, and/or constrain a `.container`'s own width via injected CSS as a rough visual check — but that only tests container-width-driven behavior (like the cert-badge row's flex-shrink), not real viewport-width media queries (`sm:`/`lg:` Tailwind variants), so it can give false confidence on breakpoint-driven layout.
- **A single color rule serving two different-background contexts is a recurring failure pattern in this nav — five separate real bugs now (Sessions 32-33, 36, 37 ×2).** Each had the same shape: a color rule was written as if only one background existed, but the same element renders on a light background in one context (desktop dropdown popover) and a dark one in another (mobile nav sheet) — and this isn't limited to resting/hover: Session 37 was `[aria-current="page"]` (the "you are here" state), which is easy to forget entirely since it's invisible until you actually click into a page reachable from the dropdown and reopen it. Whenever a nav rule sets a color for *any* state (resting, `:hover`, `[aria-current="page"]`, `:focus`), check it's been given an explicit value for *both* the mobile and desktop context, not just the one you were looking at — assume it's wrong until proven otherwise, and verify with computed styles or the compiled CSS output, not a single screenshot.
- **A scripted image swap (find/replace on `src`) won't update `alt` text or `width`/`height` attributes.** Session 36's photo-replacement batch used exactly this pattern — correct new photo, stale caption. `.service-card .media`'s fixed `aspect-[4/3]` + `object-cover` means a wrong `width`/`height` is cosmetically harmless, but a mismatched `alt` is a real accessibility/SEO defect. After any bulk image swap, grep for the changed `src` values and manually check the `alt` text next to each one actually describes the new photo.

## Deployment

Connected to Netlify — `main` auto-deploys to `https://no-limit-roofing.netlify.app` on every push. `netlify.toml` configures:
- Build command: `npm run build`
- Publish directory: `dist`
- Cache headers (immutable long-cache for fingerprinted `/_astro/*` assets and images, short for HTML)
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`, etc.)

No environment variables or secrets are required.

**The custom domain `nolimitroofingin.com` is connected** (primary domain, `www` redirects to it) and DNS is hosted by Netlify DNS; see "Current status" above for the records, HTTPS and renewals. No secrets or environment variables are needed.

**`/images/*`'s immutable cache-control has a real gotcha**: if you ever replace an image's *content* while keeping the same filename (as opposed to adding a new file), browsers that already cached the old one under that URL will keep serving it for up to a year — `immutable` tells them not to even revalidate. A normal refresh won't fix it; only a hard reload (Cmd+Shift+R) or clearing site data will. This bit us in Session 36 right after a logo swap. If a client reports "I don't see the update" right after a deploy, check this before assuming it's a build or deploy problem.
