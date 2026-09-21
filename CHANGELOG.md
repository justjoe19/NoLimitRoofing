# Changelog

Not a formal semver changelog — this project has no version releases. It's a running log of major work sessions and *why* decisions were made, so future work (by me or anyone else) doesn't have to reconstruct context from scratch. Newest entries first.

## Session 29 — Unused-image cleanup + documentation pass

Requested: delete any image files no longer used, and bring `README.md`/`CHANGELOG.md` up to date so the project can be picked back up cleanly after a break.

**Image audit**: cross-referenced every file in `public/images/` against every literal `/images/...` reference in `src/`, plus every `-hero.webp` reference's derived non-hero equivalent (`heroImage.replace("-hero.webp", ".webp")` — used by the service/location/learning-center templates for `og:image`, so a file can be "used" without ever appearing as a literal string). Two real orphans found and removed: `service-roof-maintenance.webp` and `service-roof-maintenance-hero.webp` — no content file references them (Commercial Maintenance uses `commercial-roofing-project-hero.webp` instead; these look like leftovers from an earlier hero reassignment pass). Also removed the now-empty `public/images/learning-center/` directory — Decap CMS recreates it automatically the first time someone uploads an image through `/admin`. Verified after deleting: 0 broken links/assets across all 48 pages, including a dedicated check that every `og:image` meta tag still resolves (a category the general link-checker regex doesn't catch).

**Documentation pass on `README.md`**, since several sections had gone stale across the Session 25-28 restyle arc without being caught at the time:
- The Design System section pointed at `css/input.css`, a pre-Astro-migration path that hasn't existed since Session 6, and listed the *old* color palette (`#14171a`/`#c23a0e`) instead of Session 25's actual live values. Rewrote with the correct file path and current token table, including the two tokens (`--color-ink-soft`/`-softer`) that were never documented at all, and a note on which accent shade to use for text vs. large elements (the real contrast rule Session 25 had to work out empirically).
- The favicon/logo description still said "the original site's real favicon, not a custom mark" — true through Session 24, wrong since Session 28 replaced it with the client's own recreated logo. Updated, and added a note about the logo's specific aspect ratio and the hardcoded `width`/`height` attrs in `Header.astro`/`Footer.astro`/`404.astro` that don't derive from it automatically (this exact mismatch happened in both Session 25 and Session 28).
- Added 3 new "Known gotchas" entries from real mistakes/discoveries this arc: the brand-color contrast issue (Session 25), the Read-tool-composites-transparent-PNGs-on-black surprise (Session 28), and `resize_window`'s unreliability for real mobile-viewport testing (Session 26) — each with what to do differently next time, not just what went wrong.
- Added a **"Project status"** section up top, specifically for the "picking this back up after a break" use case this session was asked to support: what's mid-flight, what's genuinely blocked on the client vs. more dev work, and the fact that `main` currently sits ahead of `origin/main` (local commits not pushed) — easy to miss without checking, and exactly the kind of state a resumed session would otherwise have to rediscover the hard way.

## Session 28 — Real logo file, replacing the Session 25 screenshot extraction

The client sent over a proper recreated logo file (clean vector-quality artwork on a solid black background, 1725×912) — a real replacement for the raster screenshot-crop placeholder flagged as temporary back in Session 25.

- Removed the black background via a luminance-threshold chroma key (with a soft-edge falloff band rather than a hard cutoff, for cleaner anti-aliasing than Session 25's version) — verified the alpha channel directly rather than trusting how the preview tool renders transparency (it composites onto a dark backdrop by default, which made the result look unchanged at first glance; confirmed by sampling background pixels and checked again by compositing onto white).
- Replaced `nlr-logo.webp` / `nlr-logo.png` in place. New aspect ratio (500×232, vs. the old 500×264) meant the `width`/`height` attributes in `Header.astro`, `Footer.astro`, and `404.astro` needed updating too, not just the image file — checked each one against the real new dimensions rather than leaving stale values that would cause layout shift.
- **Rebuilt the full favicon set from this logo** (`favicon.ico`, `favicon-16/32/48.png`, `apple-touch-icon.png`, `icon-192/512.png`) — previously the client's real favicon from their live site (Session 1), now superseded since this recreated logo represents the actual current brand mark. Cropped just the roof-and-window icon mark for these (the full wide wordmark doesn't read at 16–32px), placed on a solid dark background so it stays visible in both light and dark browser tab bars, generated every size from that one source rather than scaling the tiny 16px version up.
- Caught two more stale references to the pre-restyle dark color while in here: `site.webmanifest`'s `theme_color` and `BaseLayout.astro`'s default `themeColor` prop were still `#14171a` (the color from before Session 25's palette change), not the current `#0c1115` — fixed both.

Verified: Lighthouse 99/100/100/100 (performance/accessibility/best-practices/SEO) on the homepage, 0 SEO/broken-link issues across all 48 pages, 0 console errors, confirmed the favicon reads clearly at actual 32px size and the header logo renders sharp (no more screenshot-compression softness) at 2x zoom.

## Session 27 — Dark nav bar, matching the mockup

Requested: make the nav bar the same dark color as the client's reference mockup. Session 25 had deliberately kept the header white to limit the blast radius of that pass; this session took the change on directly.

Updated `.site-header` background to the dark `--color-ink` token (previously white), then worked through every element that depended on a light header to stay readable, rather than just flipping the background and calling it done:
- Nav link text, the "Services" dropdown trigger, and the phone number switched to light/on-dark colors (`#c7cdd3` resting, white on hover/active — matches the same on-dark pattern already used in the hero and footer).
- The hamburger icon bars switched from dark to white.
- The mobile slide-out nav panel switched from a white background to dark, with its dividers updated to a subtle white/10 line instead of the light-mode gray border.
- Left the desktop "Services" mega-menu dropdown panel white/unchanged — it's a separate floating surface, and swapping it dark too wasn't part of what was asked or shown in the mockup.

Verified: Lighthouse Accessibility 100 (checked specifically for color-contrast failures given how many text colors changed at once) across homepage, About, and a service page; 0 SEO/broken-link issues across all 48 pages; 0 console errors; confirmed visually that the desktop dropdown panel still renders correctly against the new dark trigger.

## Session 26 — Homepage structure rebuilt to match the mockup

Follow-up to Session 25's palette/logo restyle: asked to make the homepage "exactly like" the reference mockup. Flagged a direct conflict first — the mockup's whole homepage is built around insurance-claim messaging and nav items ("Insurance Claims," "Project Gallery") the user had just told me to leave out. Confirmed: match the mockup's *layout and visual patterns*, keep our real copy and service focus, no insurance-claim framing.

**New sections added, matching the mockup's structure:**
- **Trust strip** — a 5-icon row directly under the hero (Licensed/Bonded/Insured, GAF Factory-Certified, Locally Owned & Operated, Residential & Commercial, Same-Day Storm Response). Dropped the mockup's "Insurance Claim Experts" icon and "24/7" claim (not an established fact — README only documents "call anytime for emergencies / same business day") for a real one instead.
- **Services grid** — replaced the 4-card "what brought you here" selector with a 6-tile photo grid (Hail Damage, Roof Installations, Roof Repairs, Storm Damage, Commercial Roofing, About Us) matching the mockup's dark-gradient-overlay + label + circular-arrow-button card treatment. Used Session 24's newly-sourced real photos (`crew-shingle-install.webp`, `aerial-completed-roof.webp`) specifically to avoid reusing the same handful of images yet again.
- **"Why Choose No Limit Roofing"** — new dark split section: a large logo mark on one side, a real paragraph + the 4-stat trust row (moved out of the hero, where it lived before) on the other. Matches the mockup's dedicated stat section instead of burying stats in the hero.
- **Testimonial carousel** — replaced the static 3-card grid with a real single-item carousel (all 6 of the site's actual verified testimonials, not just 3) with working prev/next buttons. Built with plain JS added to `main.js` (toggles an `is-active` class, no library), matching the site's existing hand-rolled-interactivity pattern rather than adding a carousel dependency. Respects `prefers-reduced-motion` (no transition when set).

**Scope call, stated plainly rather than silently decided**: kept every other existing homepage section (Real Projects gallery, No Limit Roof Check steps, roofing-system video, Storm Center, Commercial split, About/local-proof, service-area chips, FAQ, final CTA form) — the mockup is a shorter page than ours, and deleting 20+ sessions of real, working content wasn't part of what was asked ("layout/style, keep our copy"). Flagged this explicitly rather than assuming a full content cut was wanted.

**Real bugs caught before shipping**: three of the new image `width`/`height` attributes were wrong (guessed dimensions instead of checking the actual files) — `crew-shingle-install.webp` is 700×392 not 700×502, `drone-aerial-finished-roof-pool.webp` is 900×645, `commercial-roofing-project.webp` is 1400×526 (stale from before Session 17's resize). Also caught `aerial-completed-roof.webp` (a non-hero variant the new About-Us tile needed) was never generated — Session 25 only made the `-hero` version. Checked every file's real dimensions against the markup before calling it done, not just after something looked broken.

Verified: Lighthouse on the rebuilt homepage — Accessibility 100, Best Practices 100, SEO 100, Performance 98 (re-ran twice, consistent — a real ~1-point cost from a heavier, more content-rich homepage, not noise; still comfortably in Google's "good" range and every other page is unaffected). 0 SEO/broken-link issues across all 48 pages, 0 console errors, carousel tested by clicking through in the browser. Did not get a real mobile-viewport visual check done this session (the `resize_window` tool wasn't affecting this tab's actual rendering width, a recurring issue this session) — mitigated by reusing the site's existing, already-proven responsive grid/split utility classes rather than writing new breakpoint logic, but flagging that a manual mobile check is still worth doing.

## Session 25 — Client-directed restyle: new logo, orange/dark palette, bold uppercase type

The client supplied a reference mockup (a different site's homepage design) and asked for the site's styling to match it. Scoped this with the user first, since the mockup also included things this project had explicitly moved away from — confirmed: full visual restyle including a new logo, sitewide; the mockup's "1000+ Roofs Completed" stat is real and confirmed by the client (added to README's verified business facts); "Project Gallery" nav stays removed (Session 14's decision stands); "Insurance Claims" as a new top-level service stays out (no real content to back it yet). Kept our existing page structure, real photography, and copy — this was a visual system change, not a content rewrite.

**New logo**: extracted from the mockup image (chroma-keyed the dark header background to transparency, cropped to the logo mark). This is a **raster extraction from a screenshot, not a real vector asset** — usable at header/footer size but will look soft if displayed much larger, or blurry as a favicon at small sizes. Flagged to the user: get the actual logo source file (SVG/AI/high-res PNG) from the client for production quality; this is a placeholder that's good enough to preview the new direction, not a permanent asset.

**New color palette**, sampled directly from the mockup image (not eyeballed) and applied via the Tailwind v4 `@theme` tokens in `global.css` — because the whole site already pulls its palette from these ~10 tokens, this cascaded the new look across all 48 pages from one place: dark backgrounds shifted from a warm charcoal (`#14171a`) to a cooler near-black (`#0c1115`), the accent shifted from a muted rust orange (`#c23a0e`) to a brighter, more saturated safety-orange (`#e56115`). Updated the hero overlay gradient and every other hardcoded `rgba()` reference to the old accent/ink values to match, rather than leaving them stale.

**Real accessibility regression caught and fixed before shipping, not after**: the new brighter orange only measures 3.47:1 contrast against white — passes for large text/icons (needs 3:1) but fails for normal text and button labels (needs 4.5:1; the old rust-orange had 5.38:1). Verified this empirically with Lighthouse rather than trusting manual contrast math alone — it flagged 6 real failures (all primary buttons, the mobile call bar) that dropped Accessibility from 100 to 96 on every page tested. Fixed by using the new `--color-accent-dark` (`#b84c0f`, 5.15:1) specifically for button backgrounds and small/normal-weight text (the eyebrow labels, nav phone link, inline article links, dropdown menu text, "read more" links), while keeping the brighter `--color-accent` for large text, icons, and glows where 3:1 already applies. Re-ran Lighthouse after the fix: accessibility back to a clean 100 on every page checked.

**Typography**: headlines (h1/h2) switched to uppercase, `font-black` (900 weight), and tighter letter-spacing to match the mockup's bold, blocky feel — done entirely with the existing system-font stack, not a new webfont, to protect the zero-webfont-cost performance decision from Session 1.

**Homepage trust stats**: added "1000+ Roofs Completed" (now-confirmed real) to the hero stat row, dropped "2010 Locally Established" to keep the row at 4 items — the founding year is still stated elsewhere in the site's copy (About page, footer), so this doesn't remove real information, just moves it out of this specific row.

Verified: Lighthouse accessibility 100 / performance 98–100 across homepage, About, a service leaf page, a Learning Center article, and Commercial (re-checked the homepage's one 98 was noise — re-run came back 99, consistent with the noise pattern already documented in README's Testing section), 0 SEO/broken-link issues across all 48 pages (including the `--hero-image:url()` check), 0 console errors. Did not test the mobile hamburger nav specifically this session since no breakpoint, layout, or JS logic was touched — only color tokens, heading typography, and the logo asset changed.

## Session 24 — Pulled real photos from the live site to cut down image reuse

Prompted by the user's own diagnosis of the underlying problem: "I don't have any additional photos to use right now, and we are re-using the ones we have over and over." Asked to (1) pull every usable real image off `nolimitroofingin.com` to combine with what we already have, (2) stop reusing the same photo across unrelated pages where avoidable, (3) put the best images in hero sections, and (4) not regress Lighthouse doing it.

**Full site crawl, not just the homepage.** Fetched every page on the live site (`about-us`, `commercial-roofing`, `decking`, `emergency-roof-repairs`, `insulation`, `remodels`, `roof-inspections`, `roof-overlay`, `roof-shingles`, `roofing-maintenance`, `service-areas`, `services`, `soft-wash-roof-cleaning`, `tear-off-and-replace`) and extracted every `data-src`/`data-srcset` image URL from the raw HTML (the visible `src` is a lazy-load placeholder SVG, not the real image).

**Verified every candidate before using it — this mattered.** Three real integrity problems caught by actually opening the files, not trusting filenames:
- `NLR_COM_001.jpg` (used on their own `/commercial-roofing/` and `/roof-inspections/` pages) has a **"Fred Meyer" store sign** clearly visible in the background — a Pacific Northwest grocery chain with zero locations in Indiana or Michigan. Not a real No Limit Roofing job photo.
- `NLR_COM_007.jpg` shows palm trees and arid hillside terrain — also geographically inconsistent with Michiana.
- Two more (`No-Limit-Roofing-Commercial.png`, a mountain-backdrop metal roof close-up) had no verifiable connection to the company and read as generic stock. Excluded all five, despite them being the only "commercial roofing" photos found anywhere, including the client's own site — using them would have contradicted this site's own "real projects, not a sales pitch" positioning. The Commercial hero photo problem remains genuinely unsolved; still recommend real client photography as the actual fix.
- The `service-*` stock photos already in use (emergency, inspections, maintenance, overlay, soft-wash, tear-off) turned out to be **the exact same files** at the exact same 600×440 resolution on the live site — confirmed this is a real, external resolution ceiling, not something this project failed to find a better source for.

**What was genuinely real and new, verified by inspection:**
- **5 county landmark photos** (`/service-areas/`, 675×390, the site's own upload ceiling — no larger version exists): the Michigan City lighthouse (LaPorte County), Four Winds Casino Dowagiac (Cass County), a Lake Michigan beach (Berrien County), downtown South Bend (St. Joseph County), a historic log cabin (Marshall County) — each checked against the actual place it claims to represent.
- **2 real in-progress install action shots** (`services-img1871.png`, `services-img1872.png`) — visible crew, GAF shingle bundles, no geographic red flags.
- **1 real deck/patio photo** (`decking-img0870.jpg`, 736×552) — a genuine resolution upgrade over the 571×330 file already in use for this exact content.
- **1 real aerial "after" shot** (`about-img1880.jpg`) with a small baked-in watermark, consistent with other real photos already accepted on this site.
- Also surfaced **one previously-overlooked real photo already sitting in this project's own source folder** (`6D930683…`, a 6th high-res, watermark-free residential drone shot from the client's original 16-photo batch) that had never been identified or used.

**Reallocation, prioritizing the worst repeat offenders:**
- **10 location pages** (previously drawing from just 3–4 recycled drone photos): the 5 real county landmarks now cover 8 of the 10 cities by their actual county (St. Joseph → South Bend/Mishawaka/Granger, Berrien → Buchanan/Niles/St. Joseph MI, Cass → Edwardsburg, Marshall → Plymouth); Elkhart and Goshen (Elkhart County has no landmark photo) got the newly-surfaced drone photo and one of the new action shots instead.
- **About page**: replaced a thematically-mismatched roof-inspection stock photo with the real aerial "after" shot.
- **Areas hub page**: replaced the same low-res stock overlay photo with the LaPorte County lighthouse — a genuine "here's the region we serve" fit for an area-overview page.
- **Learning Center index + Roof Replacement service page**: moved off repeated stock/low-res heroes onto the two new real action shots.
- **`service-decking.webp`** regenerated from the new higher-res source in place (same filename, same usage, just sharper).

**Net effect on reuse** (counting every `-hero.webp` reference across all content): the worst offenders outside Commercial dropped from 5–6 repeats down to 2–3 (`service-roof-overlay` 5→2, `service-roof-inspection` 4→2, `drone-aerial-manicured` 6→3, `drone-aerial-pool` 4→2), and 8 more distinct real photos entered rotation. `commercial-roofing-project-hero` stays at 10 uses — unavoidable without real commercial photography, and now clearly documented as the one deliberate exception rather than an oversight.

**Lighthouse, checked directly, not assumed**: ran Lighthouse against the actual preview build post-change — homepage 99 (unchanged), About 99, South Bend location page 100/100/100/100 (all four categories), Roof Replacement service page 100 Performance. New hero images went through the same Session 17 pipeline (Lanczos + unsharp for anything below native hero width, cropped to cut wasted background-position height, WebP at a tuned quality budget) specifically to avoid repeating that regression.

Verified: 0 SEO/broken-link issues across all 48 pages (including a dedicated check for `--hero-image:url()` CSS references, which the standard href/src link checker doesn't catch), 0 console errors, spot-checked new heroes visually on South Bend, Edwardsburg, About, and Roof Replacement.

## Session 23 — Hero overlay another 5% darker

Follow-up to Session 22: darkened the same 3 gradient stops another 5 points (0.74/0.68/0.66 → 0.79/0.73/0.71). Same rationale — masking the upscaled-source heroes' softness — just further in the same direction.

Verified: 0 SEO/broken-link issues across all 48 pages, 0 console errors, checked visually on the homepage.

## Session 22 — Hero overlay 2% darker, to mask upscaled-source softness

Requested: darken the hero image overlay by 2% to help hide the pixelation on the 8 hero images that have no higher-res source (Session 17's real resolution ceiling — upscaled with Lanczos + unsharp mask as a best effort, but still soft compared to the 5 real-photo heroes).

Bumped `.hero`'s dark linear-gradient wash by 2 percentage points at each of its 3 stops (`global.css`): 0.72→0.74, 0.66→0.68, 0.64→0.66. Left the orange radial accent glow untouched — this was specifically about the dark wash that sits over the photo, not the brand accent. A small, deliberate move in the opposite direction of Session 16's overlay-lightening change, not a reversal of it — 2 points back toward darker, not anywhere near the original 90-93%.

Verified: 0 SEO/broken-link issues across all 48 pages, 0 console errors, checked visually on the homepage (real-photo hero) and an emergency-repair service page (upscaled-source hero) — the softness is less noticeable on the upscaled hero without meaningfully dimming the real-photo ones.

## Session 21 — Cert badges: two fixed rows, uniform viewport-driven sizing

Follow-up to Session 20's badge work, in three quick passes: "a little bigger" (max-height 56px → 68px), then "put them into two rows, space them evenly apart to go the length of the page, and adjust size and spacing as the browser gets smaller," then a specific reorder mid-task (top row: Malarkey, Owens Corning, Atlas, SRS TopShield PRO; bottom row: the other 5).

- **Two explicit rows, not organic wrap.** `CertBadges.astro` now defines the 9 badges as named constants and assigns them to two fixed arrays (4 + 5) in a specific order, rather than auto-splitting the list in half — needed once the requested row order (Malarkey/Owens Corning/Atlas/SRS on top) didn't match the source array's order.
- **Each row spans the full container width** via `flex-nowrap` + `justify-content: space-between` (reverted from Session 20's `flex-wrap` + `center`, which let rows wrap organically instead of being a deliberate two-row layout).
- **Real bug caught while testing "adjust size as the browser gets smaller":** the first pass sized badges with `max-height` + `min-width:0` flex-shrink, which shrinks each row independently based on how much content is in it — with a 4-badge and a 5-badge row of different total widths, this produced *different badge sizes between the two rows* at narrow widths (measured: 34px in one row, 58px in the other, at the same container width). Fixed by switching to `flex: 0 0 auto` (no shrink) with `height: clamp(28px, 6vw, 68px)` — a pure viewport-width-driven size shared identically by every badge in both rows, so they always stay the same size as each other and shrink in sync with the actual browser width. Row gap uses the same `clamp()` pattern so spacing shrinks in step with badge size.
- Verified the narrow end doesn't overflow: simulated a 390px viewport (real `resize_window` calls weren't taking effect on this tab this session — `window.innerWidth` stayed stuck at the actual window size regardless — so verified by constraining the row's own container width and forcing badge height to the clamp's floor value directly, then checking `scrollWidth` against `clientWidth`) — confirmed both rows fit with no horizontal overflow at the size floor.

Verified: 0 SEO/broken-link issues across all 48 pages, 0 console errors, confirmed all 9 badges render at identical heights within each row at both the viewport ceiling (1791px → 68px) and the simulated floor.

## Session 20 — Sharper GAF badge, a new CertainTeed badge, bigger cert row

Pulled from the live `nolimitroofingin.com` site's "Exceptional at Roofs and more" section, which turned out to hold real, current badge assets not yet reflected here:

- **`badge-gaf-certified.webp` was a blurry upscale.** The live site has the same badge at a clean 300×300 source; ours had been sourced/resized down to 80×80 at some earlier point and looked visibly soft next to it (compared side-by-side before touching anything). Regenerated from the live source at 160×160 (2× the badge's 80×80 display size, for a sharp retina render) — same badge, same claim, just no longer blurry.
- **Found 3 more real badges on the live site not used anywhere on this one**: a GAF Lifetime Limited Warranty seal, a Google 5-star rating badge, and a second CertainTeed badge — "ShingleMaster," visually distinct from the "Select ShingleMaster" badge already in the cert row. Flagged the CertainTeed one specifically rather than assuming it was safe to swap in, since a different badge design could reflect an actual certification-tier change, not just a visual refresh — confirmed with the user it should be **added alongside** the existing one, not replace it, since both may be separately valid. The GAF Warranty and 5-star badges were declined for this pass.
- Added `badge-certainteed-shinglemaster-2.webp` (168×168 source, sharp at the row's 80×80 display size) as a 9th badge.
- **Cert row redesigned for the bigger set**: max badge height raised from 40px to 56px per explicit request ("bigger... easier to read"), and the row's Session 13 hard "never wrap" constraint was deliberately relaxed — `flex-nowrap` + `justify-content: space-between` (which shrank every badge together to force one line) replaced with `flex-wrap` + `justify-content: center`, so badges now hold their size and wrap to a second line on narrow viewports instead of shrinking. Verified by constraining the row to a 400px box and confirming it wraps to multiple rows (height grew from a single row to 396px, all 9 badges still present) rather than overflowing or over-shrinking.

Verified: 0 SEO/broken-link issues across all 48 pages, 0 console errors, confirmed visually on both the homepage and About page (both use this shared component).

## Session 19 — Tighten the actual wording for SEO, not just structure

Follow-up to Session 18, prompted by a direct question: "are the articles worded in a way that increases SEO?" The honest answer was no, not fully — the FAQ schema and added length from Session 18 helped, but a closer look at the actual wording turned up three real gaps:

**Most H2 subheadings carried no keyword.** Headings like "Why this matters," "The bottom line," "Seaming method," and "What doesn't change" read fine to a person but gave Google nothing to match a search query against or pull into a featured snippet. Rewrote the generic ones across all 15 articles into keyword-descriptive headings — e.g. "Seaming method" → "TPO vs. EPDM Seaming: Heat-Welded vs. Adhesive," "How this actually happens" → "How Wind Breaks A Shingle Seal Without Removing It." Left headings alone where they already did this job (the hiring-questions article's question-format H2s, the roofing-estimate article's line-item labels).

**Local keywords were nearly absent.** Checked and found 9 of the 15 articles never mentioned Michiana, Indiana, Michigan, or any city/county name anywhere in the body — a real gap for a local service business where every article is additional surface area for local-relevance signal. Added a natural local reference (Michiana, Northern Indiana, Southwest Michigan, or the specific county list) to every article that lacked one, without forcing it into places it didn't fit.

**Internal linking was sparse and entirely one-directional.** Only 8 cross-links existed across all 15 Learning Center articles, and — checked directly — zero links existed from any of the 13 service pages into the Learning Center. Added one contextual, on-topic link from every service page's body copy into its most relevant Learning Center article (e.g. Roof Replacement → the cost and timeline guides, TPO/EPDM pages → the TPO vs. EPDM comparison, Hail/Wind Damage pages → their matching damage-signs articles), so authority and relevance now flow both directions instead of only outward from the Learning Center.

Verified: 0 SEO audit issues and 0 broken links across all 48 pages after the changes.

## Session 18 — Deepen all 15 Learning Center articles for SEO

Requested: make sure every Learning Center article has "plenty of content that is optimized for SEO." The 15 articles (written in Sessions 9 and 12) were solid but thin — 389–527 words each, no FAQ content, no FAQPage structured data. Thin content on educational/informational pages is a real, well-established SEO weakness (less topical coverage for Google to match against related searches, fewer internal-linking opportunities, no rich-result eligibility), so this wasn't cosmetic.

- **Added a genuine FAQ section to every article** — 3–4 real, specific Q&As per article (54 total), not filler. Required a schema change: added a `faqs` field to the `learningCenter` content collection (`content.config.ts`), matching the pattern already used by the `services`/`locations` collections. Updated `src/pages/learning-center/[slug].astro` to render the FAQ accordion (reusing the existing `.faq-item` component/CSS, not a new pattern) and emit real `FAQPage` JSON-LD structured data — verified all 15 articles produce valid, correctly populated FAQPage schema (Google can now show these as rich results/"People also ask"-eligible content, which none of them were eligible for before).
- **Added 2–3 new H2 sections to every article** covering genuinely related subtopics that were previously left out entirely — e.g. how a written estimate actually breaks down and how insurance interacts with storm-related replacement (new roof cost), the UL 2218 impact-resistance test methodology (architectural vs. impact-resistant shingles), what a winter crew does differently step-by-step (winter replacement), types of commercial roof coatings and how to budget for a roof's full remaining life (commercial coating vs. replacement) — not padding, each section adds a real subtopic a homeowner or property manager would plausibly search for or want answered.
- **Word count roughly doubled across the board**: 389–527 words → 723–1150 words per article (median ~830). Every added sentence stays inside the same compliance guardrail the original 15 articles were written under — **no invented pricing, statistics, or claims not already established** (verified against README's "Business facts reference" — certifications list, service counties, "free inspection," etc. — before writing anything that referenced a business fact).
- New internal links added between related articles as sections naturally called for them (e.g. new-roof-cost → hail/wind damage pages, roof-repair-cost → repair-vs-replacement) — caught and fixed one broken link in the process (`/roofing/hail-damage.html` doesn't exist; corrected to the real URL, `/storm-damage/hail-damage.html`).

Verified: 0 SEO audit issues and 0 broken links across all 48 pages post-change, all 15 articles' JSON-LD (`Article` + `BreadcrumbList` + new `FAQPage`) parses as valid JSON with correctly populated fields, spot-checked the rendered FAQ accordion in the built HTML.

## Session 17 — Site-wide image audit: fixed every hero background, plus two more upscaling bugs

Follow-up to Session 16's one-off fix: audited every image on the site (all 48 pages, every template) using real browser measurement (`img.getBoundingClientRect().width` vs. `img.naturalWidth`, at 1440px desktop) rather than guessing from CSS. Confirmed the crew-photo bug from Session 16 was one instance of a much bigger pattern.

**The big one: all 13 hero background images, site-wide.** `.hero` (`global.css`) has no width cap — its `background-image` uses `background-size: cover` and stretches to the full page width, not any contained element. Every hero photo in the project was only 419–843px wide natively, so at a normal 1440px viewport every single hero on every one of the 48 pages was being upscaled 1.7×–3.4× by the browser — worse than the crew photo ever was, and made more visible by Session 16's overlay-lightening change. Fixed per-file:
- **5 images backed by real, higher-res client photos already on disk** (the 3 drone aerials, the crew-chimney shot, the shingle-detail close-up) were regenerated straight from their original sources at up to their full native resolution (1200px for landscape ones, 970–1122px for the two portrait ones) — a genuine fix, no compromise. Cropped each to a sane max height first (backgrounds only ever show a short strip of a portrait-oriented photo under `cover`, so the excess height was pure wasted bytes, not wasted quality).
- **8 images with no higher-res source anywhere in the project** (2 unique stock photos + a 6-way-reused generic service photo, all originally 600×440 or smaller) — installed ImageMagick specifically for this, upscaled with Lanczos resampling + a mild unsharp mask (a real technique, not a placeholder: it controls exactly how the enlargement is filtered, which looks meaningfully cleaner than letting the browser's own on-the-fly upscaling do it, though it still can't manufacture detail that was never captured in the ~600px source). This is a real resolution ceiling — genuinely new photography is the only complete fix if these 8 need to look sharp at retina-quality; flagged to the user for future photo-session priority.

**Two more real upscaling bugs, both like Session 16's:**
- `attic-insulation-installation.webp` on the About page's "Our Story" section — rendered ~1.04× its native 571px width, i.e. blurry even on a standard (non-retina) screen, not just a retina nice-to-have. Same no-higher-res-source situation as the 8 above; fixed with the same Lanczos + unsharp treatment.
- `completed-roof-shingle-detail.webp` as a Learning Center article thumbnail — rendered ~0.92× its native 419px width. This one *does* have a real high-res source on disk (the original client photo, 970×1621); regenerated cleanly from it, and cropped to the card's actual 600:440-ish aspect ratio first so the file isn't carrying pixels that are never shown.

**Performance check, since sharper source images mean more bytes:** homepage Lighthouse Performance dropped from 99 to 98 with the first pass of hero regenerations (LCP 2.1s → 2.5s). Re-encoded the homepage hero and the other 4 real-photo heroes at a more aggressive WebP quality (q30, down from q42) to bring it back — homepage is back to 99/100 with LCP 2.2s (Session 11's baseline was 2.0–2.1s), and it's still comfortably inside Google's "Good" LCP band (≤2.5s). Checked visually that the lower quality setting doesn't introduce visible banding — the heavy dark hero overlay hides most compression artifacts anyway.

Verified: 0 SEO/broken-link issues across all 48 pages, 0 console errors, re-measured every fixed image in the browser to confirm ratios are now ≤~1.3 (down from up to 3.4), spot-checked visually on the homepage, About, and a service hub page.

## Session 16 — Fix a real blurry-image bug, and lighten the hero overlay

Two requests in one pass:

**"Built Here. Roofing Here." image was blurry and too large.** Turned out to be a real bug, not just a styling preference: `crew-roofer-chimney-flashing.webp` had been resized down to 560×700 back in Session 7, but the homepage displays it in a `.media-frame` that stretches to fill roughly half its grid column — comfortably wider than 560px on any normal desktop viewport, so the browser was upscaling a too-small source image, which is exactly what blur like this usually is. Regenerated the file from the original client-provided source photo (still on disk, 1122×1402) at 800×999 — sharp at the sizes it's actually displayed at anywhere on the site. Separately, capped this specific section's image at `max-width: 400px` (not a global `.media-frame` change, since that class is also used elsewhere like the About page) to address "takes up too much space."

**Hero image overlay was too dark.** The dark gradient sitting over every hero background image (`.hero` in `global.css`) was at 90–93% opacity — dark enough that the actual photography underneath was barely visible, which undercuts the brief's own "cinematic drone/final-roof image" hero direction. Reduced to 64–72% opacity. This is a global change (affects every page's hero, not just the homepage), so checked color contrast wasn't compromised across hero photos of varying brightness — homepage, a bright-lawn photo (wind-damage), and a sky-heavy photo (commercial) — all still score a clean 100 Accessibility / color-contrast pass.

Verified: 0 SEO/broken-link issues across all 48 pages, 0 console errors, Lighthouse accessibility 100 confirmed on 3 different hero photos after the overlay change.

## Session 15 — Bring back the YouTube video on the homepage

Requested: swap the static image in the "What's Under Your Shingles Matters" (Roofing System) section for the YouTube video the original pre-Astro site had, instead of a photo.

The lite-YouTube-embed pattern (`.video-facade` CSS, the click-to-swap-in-a-real-iframe JS in `main.js`) was never removed during the Session 7 homepage rebuild — it just stopped being *used*, since the brief's new homepage structure didn't include the old "Why Homeowners Choose Us" section that used to house it. So this was a markup-only change: replaced the `.media-frame` static image in the Roofing System section with the same `video-facade` button, same real video (`SkxqF_gHMD0`, the client's actual "No Limit Roofing of Indiana" YouTube video, previously verified real content from Session 1) and thumbnail. No CSS or JS changes needed.

Verified by actually clicking play in the browser: the facade correctly swaps to a real embedded YouTube iframe (confirmed the real channel name and video loading), 0 console errors, 0 SEO audit issues across all 48 pages.

## Session 14 — Remove the Projects (gallery) page, for now

Requested: take down the Projects page. Removed `src/pages/gallery.astro` entirely (not deployed anywhere yet, so a clean removal rather than a redirect/soft-hide), plus every reference to it: the "Projects" nav item, the "Projects" footer link, and the "View Our Projects" button on the homepage's Real Projects section — the section itself (the inline real-photo showcase) stays, since it doesn't depend on a page to link out to.

`/gallery.html` now 404s. Re-ran the link-crawl and SEO audit scripts: 0 broken links, 0 issues, across the remaining 48 pages.

## Session 13 — Certification badges: scrolling marquee → static row

Requested: the manufacturer badges under the hero shouldn't scroll — one static row, evenly spaced, sized properly, resizing with the browser but never wrapping to a second line.

- Removed the auto-scrolling marquee entirely (the `cert-marquee-track` animation, the duplicated `aria-hidden` badge group needed only to make the scroll loop seamless, the hover-to-pause handling, and the `prefers-reduced-motion` fallback it needed — all of that existed to serve the scroll behavior, so all of it goes with it, not just the animation itself).
- Renamed `CertMarquee.astro` → `CertBadges.astro` and `.cert-marquee*` → `.cert-row*` — the old names described scrolling, and leaving "marquee" in the code after removing all motion would mislead whoever touches this next.
- **No-wrap-while-shrinking, the actual technical ask**: `.cert-row` is a `flex-nowrap` row with `justify-content: space-between` for even spacing. Each badge gets `min-width: 0` — without it, flexbox's default `min-width: auto` floors every image at its own intrinsic width, which is exactly what forces wrapping once the row runs out of space. With it, `flex-shrink` can actually do its job: all 8 badges shrink together in proportion as the viewport narrows (verified at both ~1400px desktop and 380px mobile — same row, same order, no wrap, aspect ratios intact, Malarkey's wide logo and GAF's square badge both scale correctly rather than one hogging space).
- Used each badge's real current file dimensions (from Session 10's resize) as the `width`/`height` attributes, replacing the old Session 7 placeholder values.

Verified: build clean, 0 SEO audit issues across all 49 pages, checked visually on both the homepage and About page (both use this component) at desktop and mobile widths, 0 console errors.

## Session 12 — The remaining 12 Learning Center articles

All 15 topics from the brief's §9 Learning Center list are now written (3 were seeded in Session 9; this session wrote the other 12): new roof cost factors, repair cost factors, wind damage without missing shingles, replacement timeline, bad decking, winter replacement, ice & water shield, architectural vs. impact-resistant shingles, what belongs in a roofing estimate, questions to ask before hiring a contractor, TPO vs. EPDM, and commercial coating vs. replacement.

- **No invented pricing anywhere**, including on the two cost-guide topics the brief explicitly lists ("How Much Does a New Roof Cost," "How Much Does Roof Repair Cost") — both talk through the real factors that drive cost (size, complexity, material, decking condition, accessibility) rather than publishing a number with nothing real behind it. Matches the compliance guardrail from the brief and the approach already used in Session 9's seed articles.
- Publish dates staggered weekly from 2026-06-23 through 2026-09-08 (ahead of the 3 existing articles' Sept dates) for a realistic-looking posting cadence, not all 15 dumped on one date.
- Hero images assigned from the real client photography catalog (no stock/placeholder images used) with reasonable variety across articles.
- Added 2 real internal cross-links between topically adjacent articles (estimate ↔ hiring questions, cost ↔ repair-vs-replacement) — small, but genuine internal linking per brief §10, not just decorative.
- Same title-length audit script from Session 10 caught 3 article titles running long once ` | No Limit Roofing` was appended (69–76 chars) — trimmed all 3. Re-ran clean: 0 issues, 0 broken links, across all 49 pages (37 + 12 new articles).

Site is now 49 pages. Learning Center content coverage from the brief is complete; going forward, new articles are the client's to add via the CMS built in Session 9, not something that needs another developer session by default.

## Session 11 — Chasing the homepage's last Lighthouse point

Follow-up to Session 10: asked to try closing the homepage's 99-Performance gap even though it meant touching the hero image treatment. Documenting this because the *process* matters as much as the result — several plausible fixes were tried and measured, not just declared.

- **Confirmed the gap is a mobile-throttle-simulation artifact, not a code defect**: same build scored a perfect 100/100 with 0.4s LCP under Lighthouse's `--preset=desktop` (lighter throttling). The default CLI invocation simulates a throttled mobile CPU + slow network, which is standard practice but inflates timings well past what `lcp-breakdown-insight`'s own (unthrottled) numbers showed (~71ms total).
- **Tried, worked**: recompressed the homepage hero image further (37KB → 12KB) and deprioritized `main.js` (`defer` + `fetchpriority="low"`, since it was competing for bandwidth with the hero image fetch in the critical path). Moved LCP from 2.1s → 2.0s, score 0.96 → 0.97 — real, measured, kept.
- **Tried, made it worse — reverted**: `build.inlineStylesheets: "always"` (Astro's built-in critical-CSS-adjacent option, inlines the stylesheet into `<head>` instead of a separate `<link>`). This removed one render-blocking request but made the *initial HTML document itself* bigger, which had to fully download before any paint could start — net LCP went from 2.1s to 2.2s. Not used.
- **Result**: homepage stable at 99 Performance across 3 repeated runs (not noise this time — confirmed by re-running, unlike the transient 99s seen elsewhere in Session 10). Every other tested page remains a literal 100/100/100/100, unaffected by these changes (spot-checked after the main.js change, which is global).
- **Not attempted**: removing or shrinking the full-bleed hero image treatment itself, or building real critical-CSS extraction tooling (Tailwind v4 has no built-in support for this, and the blunt "inline everything" version already tested worse) — both would be materially larger interventions for an uncertain payoff on a metric that's already well inside Google's "Good" Core Web Vitals band (LCP ≤2.5s; we're at 2.0s) and that field data (real users, not synthetic throttling) is what actually affects search ranking, not this specific lab score.

## Session 10 — Full QA pass: zero errors, SEO audit against the brief, Lighthouse

Requested: confirm the site has zero errors, is SEO-optimized per the client's brief, and gets perfect Lighthouse scores. Found and fixed several real issues rather than just confirming things looked fine — this wasn't a rubber-stamp pass.

**Zero errors:**
- `npx astro check` (added `@astrojs/check` + `typescript` as dev deps): 0 errors, 0 warnings across all 22 `.astro` files.
- Wrote a link-crawl script (`dist/` → every internal `href` checked against the actual built file set): 0 broken links across all 37 pages, both before and after this session's fixes.
- Browser console-error sweep across every page template (homepage, all 6 original pages, all 3 hub pages, a service leaf page, a city page, the Learning Center index and an article, 404, and `/admin`): clean everywhere.

**SEO audit against the brief (§10)** — wrote a script parsing every built page for: missing/duplicate `<title>`, missing/duplicate meta description (plus length), missing canonical, missing `og:image`, missing JSON-LD, missing or multiple H1s, skipped heading levels, and missing image `alt`/`width`/`height`. First pass found 17 real issues (9 after excluding `/admin`, which is a tool page, not content — its `noindex`/missing-metadata is correct, not a bug):
- Homepage and `/services.html` had title tags and meta descriptions well over Google's practical length budget (69/181 chars against a ~60/155 target) — trimmed. `/services.html` also got retargeted from competing head-on with the new dedicated service pages' keywords ("Emergency Repair, Replacement & Commercial Roofing") to framing itself as the umbrella directory it now actually is ("All Roofing Services") — the brief explicitly warns against duplicate/thin content, and having both a generic overview and 13 dedicated keyworded pages targeting the identical phrases would have been exactly that.
- `/areas.html` and one service page's meta descriptions were also over budget — trimmed.
- **The Learning Center index page skipped a heading level** (H1 straight to H3 on the article cards, no H2) — added a visually-hidden `<h2>` section heading, same pattern already used on the three service-group hub pages.
- Learning Center article title tags ran long once `| No Limit Roofing Learning Center` was appended — shortened the suffix to `| No Limit Roofing` and trimmed two of the three seed article titles themselves.
- Re-ran clean: 0 issues, 0 duplicate titles, 0 duplicate descriptions, across all 37 real pages.
- Spot-checked all 58 unique image `alt` values site-wide: the one empty `alt=""` pattern found is correctly decorative in every instance (footer logo icon beside visible "No Limit Roofing" text; the `aria-hidden` duplicate row in the cert marquee's seamless-loop animation) — not a bug.

**Real bug: the XML sitemap pointed at URLs that would 404.** `@astrojs/sitemap` builds its URLs from Astro's route patterns (`/about`), with no awareness of this project's `build.format: "file"` config (which ships every page as `/about.html`). Google would have been handed a sitemap of extensionless URLs that don't exist on this site. Fixed with a small local integration (`integrations/fix-sitemap-urls.mjs`) that runs after the sitemap plugin and appends `.html` to every entry except the homepage — verified 0 URLs missing `.html` post-fix, and confirmed (via a site-wide scan) this was the *only* place using Astro's auto-derived extensionless URLs; every canonical/breadcrumb/OG URL elsewhere was already manually specified with the correct `.html` suffix.

**Lighthouse — real image-weight fixes, not just measurement:**
- The 8 manufacturer certification badges (pre-existing images, not from this project's own sessions) were being served at their original upload resolution — up to 483×482 — while displayed at roughly 40–85px. Lighthouse flagged ~128 KiB of pure waste on the homepage alone from this. Resized each to ~2x its actual max display width (not a uniform max-dimension crop, which would have distorted the wide Malarkey logo) and re-encoded: combined badge weight dropped from ~177 KB to ~44 KB.
- Recompressed the 4 real client photos used in the homepage's "Real Projects" gallery (quality 78→68 from the cached source PNGs) after visually confirming no meaningful quality loss.
- **Real bug**: the Learning Center's `heroImage` field (schema default and all 3 seed articles) pointed at the full-size photo, not the properly extra-compressed `-hero.webp` variant every other page on the site uses for its CSS hero background — the one inconsistency in an otherwise-consistent hero-image convention. Fixed the 3 articles + schema default to use the `-hero` variant for the background, and added `.replace("-hero.webp", ".webp")` (matching the pattern already used on hub pages) so the Learning Center index's thumbnail cards and each article's `og:image` still use the full-quality version. This alone moved that article's Lighthouse Performance score from 99 to a stable 100.
- Result: `roofing/roof-replacement.html`, `service-areas/south-bend.html`, `commercial.html`, and (after the hero-image fix) the Learning Center article all hit a literal 100/100/100/100. The homepage sits at 99 Performance — confirmed via repeated runs to be stable, not noise, but confirmed via Lighthouse's own LCP sub-diagnostics (discovery, breakdown both score perfect) to be inherent to the page's size under simulated mobile throttling, not a fixable defect. `contact.html` and the Learning Center article both showed a transient 99 on one run and a clean 100 on immediate re-run — reproducing the exact local-dev-server measurement noise the README already documented before this session touched anything.

**Not done, still blocked on you** (unchanged from Sessions 7–9): analytics/conversion tracking (needs a GA4 property ID or equivalent), Google Search Console verification (needs account access I don't have), live Google Reviews integration, and the project case-study engine (you mentioned holding off — noted, not touched this session).

## Session 9 — Learning Center blog, editable by the client via Decap CMS

Requested: a Learning Center the client can write their own articles for, rather than a static set of pages only a developer can edit.

- Added a `learningCenter` content collection (`src/content.config.ts`, `src/content/learning-center/*.md`) plus a blog index (`/learning-center.html`) and article template (`src/pages/learning-center/[slug].astro`). Unlike the `services`/`locations` collections, this one has **no manual `slug` frontmatter field** — the filename itself (Astro's `entry.id`) drives the URL, specifically so the CMS form below doesn't need a "type a URL-safe slug correctly" field for a non-technical user to get wrong.
- Wired up **Decap CMS** at `/admin` (`public/admin/index.html` + `config.yml`), using the `git-gateway` backend — no database, no server code; saving in the CMS commits a markdown file to this repo and a normal Netlify build picks it up. `publish_mode: editorial_workflow` gives it a draft → review → publish flow rather than instant-publish-on-save, and new articles default to "draft" in the CMS so a half-written post can't go live by accident.
- Nav gets a "Learning Center" link back (it was deliberately left out in Session 7 since there was nothing behind it yet).
- Added `.article-body` prose CSS (`global.css`) — needed because the base layer strips all default margins and list-styles site-wide (every other block on this site uses explicit utility spacing instead), which would otherwise render raw markdown output as an unspaced wall of text with no bullets.
- Seeded 3 real example articles (Repair vs. Replacement, what hail damage actually looks like, how long a roof lasts in Northern Indiana) — enough to prove the template end-to-end and give the client a working model to follow, not an attempt to write all 15 Learning Center topics from the brief. Careful on the cost-guide-shaped topics in particular: didn't invent specific dollar figures anywhere, since no real pricing data exists to ground them in — those articles talk through the *factors* that affect cost instead.
- **Real bug caught in browser testing**: article dates were off by one day (a `2026-09-15` entry displayed as "September 14"). Classic cause — the date parses as UTC midnight, then `Intl.DateTimeFormat` was formatting in whatever timezone the browser/server is in, shifting it back. Fixed by pinning `timeZone: "UTC"` on both date formatters.

**Setup this needs from the client/account owner that I can't do myself** (see README "Learning Center & CMS" for exact steps): enable Netlify Identity, restrict registration to invite-only, enable Git Gateway, and send the client an Identity invite. Until that's done, `/admin` loads fine (it's just a static page) but the login form has nothing to authenticate against — verified structurally correct here by confirming Decap parses `config.yml` and reaches its login screen locally, which is as far as it can be tested without a real deployed site.

Verified: `npm run build` (37 pages, zero errors), the internal-link-crawl script (zero broken links), and a live browser check of the Learning Center index, an article page (prose rendering, corrected date), and `/admin` loading Decap CMS without console errors.

## Session 8 — Nav fixes, commit Phase 1, and the first 5 Phase 2 city pages

Follow-up to Session 7, requested after a local review turned up real nav problems:

**Nav fixes** (all in `Header.astro` / `global.css` / `main.js`):
- The Roofing/Storm Damage/Commercial dropdowns didn't auto-close on outside click, Escape, or after picking a link — native `<details>` doesn't do any of that on its own. Added the missing handling in `main.js`.
- The desktop breakpoint had been pushed from the site's normal 1024px to 1280px in Session 7 just to fit three separate top-level dropdowns. Rather than accept that, consolidated Roofing/Storm Damage/Commercial into **one "Services" dropdown with three grouped columns** (a small mega-menu) — cut the nav down enough that 1024px works again, fixing the actual overflow instead of pushing the breakpoint out further. Verified against a live boundary check at 1040px (mobile) and 1200px (desktop, comfortable margin).
- The mobile hamburger icon looked "weird" — turned out the X itself renders correctly (confirmed via a forced-state check and a real interaction with the transition allowed to finish; an earlier screenshot had just caught it mid-fade). Thickened and rounded the bars anyway (2px → 3px, squared → rounded caps) to match the site's bolder icon style elsewhere, since thin bars were a reasonable thing to read as "off."

**Committed and merged**: Sessions 6–7 had been sitting uncommitted this whole time. Committed as one commit (`Migrate to Astro and build Phase 1 of the SEO/design rebuild`) and fast-forward merged into `main` — no conflicts, `main` hadn't diverged.

**5 more city pages** (brief §6, Phase 2 priority list): Buchanan, Edwardsburg, Goshen, Plymouth, St. Joseph (MI). Same `locations` content collection and template from Session 7, no new infrastructure needed. Notes:
- Plymouth gets the same "home to a regional office" framing as Mishawaka already had — a real, previously-established fact (see README's business-facts reference), not new.
- St. Joseph, MI is disambiguated from St. Joseph County, IN (home to South Bend/Mishawaka) via an FAQ entry, since both are legitimately in the service area under similar names.
- Goshen's body copy originally over-stated the service area (claimed "Elkhart County" as a formal fifth-plus county alongside the real established five) — caught and fixed before publishing; the established language is "Greater South Bend–Elkhart Region," not a formal county claim.
- `areas.html`'s Priority Service Areas chip row now lists all 10 city pages; Berrien County's city list picked up Buchanan.

Verified: `npm run build` (33 pages, zero errors), the same internal-link-crawl script from Session 7 (zero broken links across all 33 pages), and a live browser check of a new city page plus the updated areas page.

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
