# Changelog

Not a formal semver changelog — this project has no version releases. It's a running log of major work sessions and *why* decisions were made, so future work (by me or anyone else) doesn't have to reconstruct context from scratch. Newest entries first.

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
