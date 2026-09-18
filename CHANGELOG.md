# Changelog

Not a formal semver changelog — this project has no version releases. It's a running log of major work sessions and *why* decisions were made, so future work (by me or anyone else) doesn't have to reconstruct context from scratch. Newest entries first.

## Session 7 — Content collections, homepage rebuild, 13 service pages, 5 city pages

Built out the Phase 1 content called for in the Design + SEO Build Brief, on top of the Astro scaffold from Session 6: content collections, a rebuilt homepage, all core SEO service pages, and the first 5 priority city pages.

**Photo audit, before using anything**: the client sent 16 images alongside the brief. Only 5 turned out to be real usable photography — 3 drone/aerial finished-roof shots, 1 real crew-on-roof photo, 1 elevated shingle-detail shot. The other 11 were branded promotional/ad graphics (bold yellow/black templates with a cartoon mascot and baked-in headline text) — genuinely the client's own brand material (same mascot as the real, monochrome site logo, just the full-color original), but not usable as web photography: wrong format, text baked in, and a louder style than the brief's own "premium black/charcoal" direction calls for. The 5 real photos were resized and re-encoded to WebP (matching the project's existing `cwebp` convention, including `-hero` extra-compressed variants) and used for the new homepage hero and several service/city hero images. **Still missing, per the brief's own photo table**: a CertainTeed RoofRunner installation photo, a branded truck photo, and an office photo — none were in what was sent, so no substitute was used for those (the README's own "Known gotchas" section already documents what happens when a wrong photo gets relabeled to fit a slot it doesn't belong in).

**Content collections** (`src/content.config.ts`, Astro's Content Layer API): a `services` collection (zod-validated: hero copy, highlights, FAQs, related links, body) and a `locations` collection, same shape. This is what makes 13 service pages and 5 city pages come from one template each instead of 18 hand-written files — see README's "Project structure" for the exact file layout.

**Pages built**, matching brief §5's core-SEO-pages table exactly (16 rows → 3 hand-written hub pages + 13 collection-driven leaf pages via one dynamic `[group]/[slug].astro` route): Roofing (Residential hub, Replacement, Repair, Emergency Repair, Inspections, Asphalt Shingle), Storm Damage (hub, Hail, Wind), Commercial (hub, Repair, Replacement, TPO, EPDM, Roof Coatings, Maintenance). Plus 5 city pages (`service-areas/[slug].astro`, brief's Phase 1 list: South Bend, Mishawaka, Granger, Elkhart, Niles), cross-linked from the existing `areas.html`.

**Homepage rebuilt** per brief §3's full structure — hero, trust strip, "what brought you here" problem-selector cards, real-projects gallery, the No Limit Roof Check™ 4-step process, a roofing-system explainer, Storm Center, a dark Commercial section, reviews, About/local proof, service-area map+chips, FAQ, and a short final-CTA form. Deliberately scoped down from the brief in a few places, called out here rather than faked:
- **Reviews stayed a static grid** of the 6 real, already-sourced testimonials — no "live Google Reviews" widget, since that needs a real API integration this session doesn't have credentials for.
- **No before/after slider or review carousel** — the brief asks for both, but they're genuine interactive-island work (see the Astro migration plan) better done as a follow-up than bolted on here. Also intentionally did **not** bring back scroll-triggered reveal animation — CHANGELOG Session 3 already documents why that was removed (a real Lighthouse accessibility failure).
- **"Real Projects" section links to the existing gallery**, not a new case-study engine — that's explicitly Phase 2 in the brief's own build order (§14), and building it now would mean either fabricating project data or shipping an empty template.
- **Roofing-system explainer** uses the real shingle-detail photo with honest, generic "what's under the shingles" copy — not labeled as a CertainTeed RoofRunner photo, since that specific photo wasn't provided (see photo audit above).
- Compliance guardrails from brief §15 were followed throughout: no invented review counts, project counts, or certifications beyond what's already verified in the README's business-facts reference; hail/wind-damage copy explicitly does not promise insurance claim outcomes, only that damage will be documented.

**Navigation rebuilt** to match brief §4/§16: Roofing/Storm Damage/Commercial became dropdown menus, built on `<details>/<summary>` (same accessible, JS-free pattern the FAQ accordion already used) rather than a JS-driven mega-menu. "Resources" (Learning Center) was left out of the nav since no Learning Center pages exist yet — a nav item with nothing behind it isn't better than no nav item.

**Two real bugs found and fixed while building the nav**, not just cosmetic:
1. The dropdown CSS used `.nav-dropdown > summary` (direct-child selector), but the actual DOM is `<li class="nav-dropdown"><details><summary>` — `summary` is a *grandchild*, not a direct child, so the rule silently never matched and every dropdown rendered as an unstyled native disclosure triangle. Fixed by switching to a descendant selector.
2. Setting `open={isGroupActive(...)}` on `<details>` was meant to visually mark the current section active, but `open` on `<details>` doesn't just style it — it expands the panel, which then sat `position: absolute` on top of the page's H1 on every page in that section. Separated "active styling" (`aria-current` on `<summary>`, styled like the other nav links) from "open state" (left alone, closed by default).
3. **Nav breakpoint bumped from `lg` (1024px) to `xl` (1280px)**, deliberately, and reusing the exact 1280px value Session 2 originally used for the same reason before Session 3 brought it back down: measuring actual rendered width, the dropdown-enlarged nav no longer fit at 1024px (confirmed via a live browser check, not guessed) — even the site's 1200px content container cap couldn't be widened past this without the nav wrapping. If nav content shrinks again later, this can likely come back down.

**Sitemap**: added `@astrojs/sitemap` and removed the hand-maintained `public/sitemap.xml` (was already stale, only listing 6 of the site's now 28 pages) — `sitemap-index.xml`/`sitemap-0.xml` are generated at build time from the real route set, so they can't drift again. `robots.txt` updated to point at the new filename.

**Verified before calling this done**: full `npm run build` (28 pages, zero errors), a script crawling every built page's internal `href`s against the actual output file set (zero broken links), and a live browser pass — homepage, a service leaf page, the commercial hub, a city page, dropdown interaction, active-state styling, no console errors.

**Not done, deliberately** (see brief §14 Phase 2/3, and the gaps called out above): Decap CMS wiring, Learning Center pages, the project case-study engine, live Google Reviews integration, before/after slider, review carousel, remaining Phase 2/3 city pages, and the three missing photo categories (RoofRunner install, branded truck, office).

## Session 6 — Migrate to Astro (Phase 1 of the SEO/design rebuild)

The client sent over a full Website Design + SEO Build Brief plus real project photography (drone/aerial roof shots, crew, branded truck, office, CertainTeed RoofRunner install), specifying a much larger site: ~15 core SEO service pages, a 60-mile city-page architecture across Northern Indiana + Southwest Michigan, a project case-study engine, a Learning Center, and a CMS so staff can add content. The existing plain-HTML site (7 hand-duplicated pages) doesn't scale to that — every new page or shared-markup change meant touching every file by hand.

Chose **Astro** over a React/Next SPA: the brief's own requirements (Core Web Vitals, crawlability, 100 Lighthouse) are exactly what a client-rendered SPA works against, and the real problem was templating/content-scaling, not interactivity. Astro ships zero JS by default, supports component/layout reuse, and can host framework islands later for the few genuinely interactive pieces the brief wants (before/after slider, review carousel) without turning the whole site into an app. Content collections + a git-based CMS (Decap, planned) are the intended answer to "staff can add projects/photos/FAQs/reviews."

**This session was step 1 only — scaffold + a 1:1 migration, no new content yet** — done first specifically to prove the move is safe before building anything new on top:

- Added Astro (`astro`, `@tailwindcss/vite`) and Tailwind v4 now runs through Astro's Vite pipeline instead of the standalone Tailwind CLI — `npm run build:css` / `watch:css` are gone; `npm run dev` / `build` / `preview` replace them.
- Moved all 6 pages + 404 into `src/pages/*.astro`, all shared markup (header, footer, mobile call bar, nav, cert-badge marquee) into `src/layouts/BaseLayout.astro` and `src/components/`. Page-specific content (hero copy, cards, testimonials, FAQ, schema) stayed inline per page — no content-collection abstraction yet, to keep this step's diff to "same output, different file organization."
- Set `build.format: "file"` in `astro.config.mjs` specifically so output URLs stay `/about.html` etc., identical to the pre-migration site — no redirect map was needed for this step.
- `public/js/main.js` (mobile nav, form validation/submit, lite YouTube embed, header shadow) ported verbatim and is still loaded as one global `<script src="/js/main.js">` — it wasn't converted to a framework island, since none of that behavior needs per-page data.
- Fixed one real bug surfaced by the migration: `Header.astro`'s `aria-current="page"` logic compared against `Astro.url.pathname`, which resolves to `/index.html` for the homepage under `build.format: "file"` (not `/`) — the Home nav link silently lost its active state until this was special-cased.
- Verified via `npm run build` + `npm run preview` + browser check (desktop and 390px mobile, hamburger drawer, 404 route, no console errors) that output is visually and structurally equivalent to the pre-migration site before removing the old static files.
- Updated `netlify.toml` (`build.format`/publish dir → `dist`, cache headers → `/_astro/*` immutable) and README for the new build system.

Not done yet, deliberately deferred to later Phase 1/2 sessions per the brief's own build order: new homepage sections, the 15 service pages, city pages, project case studies, Learning Center, Decap CMS wiring, `@astrojs/sitemap`.

## Session 5 — Certification logo marquee, bigger nav logo, call bar breakpoint fix

- Removed the "Factory Certified By" label from the home trust bar.
- All 8 manufacturer badges (home page was missing IKO Preferred and SRS TopShield PRO) now show full-color at all times, as a continuously auto-scrolling marquee instead of a wrapping grid — pauses on hover/focus, falls back to a static wrapped row for `prefers-reduced-motion` users.
- Increased the nav logo size now that the wordmark next to it is gone (removed in Session 3).
- The sticky "Call Now" bar now shows any time the nav is collapsed to a hamburger (<1024px), not just on phones (<720px) — it was previously only tied to the phone breakpoint, leaving tablets with a hamburger nav but no persistent call CTA.

## Session 4 — Git setup

- Initialized the git repo (it hadn't existed before — the project was built entirely as local files) and pushed the full site to `https://github.com/justjoe19/NoLimitRoofing.git` as the initial commit.
- Added `README.md` and this `CHANGELOG.md`.

## Session 3 — Header rework, content fixes, and a fragility cleanup

Requested changes:
- Removed the "No Limit Roofing / Michiana Roofing Contractor" wordmark from the header, keeping just the logo, to give nav links more room.
- Removed the "Contact" nav link, replaced it with the phone number as plain text (no icon).
- Removed the dark "topbar" strip above the main header entirely (it had held the phone, a trust line, and social icons — added in Session 2 specifically to solve a nav-wrap bug).
- Replaced the static image in the "Why Homeowners Choose Us" section with the video (previously in its own standalone section).
- Removed the standalone "See Us In Action" video section (merged into the above).
- General ask: review the whole site's styling for a "modern, professional, expensive" feel.

Because the topbar and phone/logo were gone, the header got much lighter, so the desktop-nav breakpoint could come back down from the 1280px workaround (Session 2) to a standard `lg` (1024px) — verified with a scripted width sweep, no wrap anywhere from 320px to 1400px.

**Real bugs found and fixed during the styling review** (not just cosmetic pass):

1. **`.main-nav a` catching the CTA button.** Same root cause as the Session 2 phone-wrap bug, different symptom: the "Free Estimate" button in the header is technically also an `<a>` inside `.main-nav`, so the nav-link color rule was overriding its white text with dark gray. Fixed the same way — scoped the selector to `.main-nav ul a` so it can only match actual nav-list links.
2. **Scroll-reveal animation caused a real Lighthouse failure.** The fade/slide-in-on-scroll effect (added in Session 2) intermittently failed a color-contrast audit because Lighthouse's crawl caught an element mid-opacity-transition. A synthetic `scrollTo()`-loop test also produced false "nothing ever became visible" results — turned out to be an artifact of rapid programmatic scrolling fighting `scroll-behavior: smooth`, not a real bug, but investigating it exposed the deeper problem: if JS ever failed to run, `.reveal` elements (including the main CTA band) would stay permanently invisible. Rather than keep patching around it (tried a `<noscript>` fallback + a JS safety timeout first), removed the whole reveal system. The "expensive" feel now comes from static polish (shadows, hover lifts, real photography, quote marks) instead of scroll animation.
3. **Broken `og:image` on every page.** All six pages' Open Graph / JSON-LD image tags pointed at `.jpg` files that no longer existed (the JPG fallbacks were deleted in Session 2 when the site went WebP-only) — social share previews were broken sitewide. Fixed by pointing each page's `og:image` at that page's own hero photo instead of a single shared image (an upgrade, not just a fix).
4. **Mislabeled image used with a false caption.** `roofing-project-gallery.webp` (named early on, before its content was closely checked) is actually a photo of attic insulation being installed, not a roofing/siding project. It was captioned "Siding Repair & Replacement" on the Services page and tagged "Siding & Roofing" in the Gallery grid — actively wrong, not just an unclear filename. Renamed the file to `attic-insulation-installation.webp` (+ `-hero` variant), fixed it onto the correct "Insulation Installation" card, and gave the (unlabeled) siding card an honest alt text using a different photo instead of overclaiming what's shown.

## Session 2 — Tailwind migration + polish pass

Migrated the whole site from a single hand-written `css/styles.css` to **Tailwind CSS v4**, per request. Chose the "component classes + `@apply`" approach over utility-classes-in-HTML — Tailwind became the build engine and design-token system, but the HTML kept its existing semantic class names (`.btn-primary`, `.service-card`, etc.), which meant far less churn across 7 pages and much lower risk of introducing visual regressions mid-migration.

Also addressed in this session:
- **Phone number wrapping in the nav** — root-caused to `.header-phone` losing a CSS specificity fight against `.main-nav a`. Fixed by scoping selectors and moving the phone into a dedicated topbar strip above the main nav row (later removed in Session 3 once the header had more room without it).
- Added a hero background image per page (previously plain gradient), a lightweight click-to-load YouTube embed, a bigger nav logo, and general visual polish (deeper shadows, button hover lift, testimonial quote marks).
- **Two real rendering bugs caught during QA**, both from the same underlying cause: `backdrop-filter` on the sticky header was creating a new CSS containing block, which broke the mobile nav drawer's `position: fixed` (rendered nowhere near where it should). Removed `backdrop-filter`, kept a solid translucent header background. Separately, the desktop nav-link underline (`::after`) wasn't stretching to full width because the `<a>` was `display: inline` by default; fixed with `display: inline-block`.
- Found and fixed a horizontal-overflow bug on narrow phones (~360px and below) introduced by the bigger logo — the header's `flex-shrink: 0` brand block didn't leave room for the hamburger button. Fixed with a responsive max-width cap on the wordmark and a smaller logo size below the `sm` breakpoint.

## Session 1 — Initial build

Built the full 6-page site from scratch to replace `nolimitroofingin.com`, using content, branding, and photography pulled from the live original site (via `WebFetch` and browser automation) — company history, services, service-area counties, certifications, and verbatim customer testimonials.

Key decisions:
- **Plain static HTML/CSS/JS, no framework** — a 6-page brochure site doesn't need one, and it kept the path to a perfect Lighthouse score simple.
- **System font stack, no webfonts** — eliminates font-load network cost and font-swap layout shift entirely; was a deciding factor in hitting 100 Performance on most pages without extra tuning.
- **WebP-only images**, converted and compressed from the original site's photos via `cwebp`; JPG fallbacks were initially kept then deleted once WebP-only was deemed safe (browser support is effectively universal) — this later caused the `og:image` bug fixed in Session 3.
- **Netlify Forms** for the contact form, chosen over Formspree/a custom backend since the user confirmed Netlify as the hosting target.
- Favicon and all icon sizes were generated from the **original site's actual favicon** (fetched via its `/favicon.ico` redirect), not a custom mark, per explicit request.
- Real testimonial quotes, business facts (founding year, owner name, certifications, service counties) were fetched from the live site rather than invented — see `README.md` → "Business facts reference" for the compiled list.
