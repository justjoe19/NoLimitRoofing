/**
 * The 65-page plan (client brief of 2026-10-13) in one place.
 *
 *   live: false  ->  the page is built and previewable locally, but is NOT published: it is left out
 *                    of the production build, the sitemap, the menu, and every link to it from
 *                    other pages is removed (see integrations/unlink-unpublished.mjs).
 *   live: true   ->  published. Publishing a section = flipping its pages to live: true (after the
 *                    client's sign-off and the invoice), then commit and push.
 *
 * Set PREVIEW_ALL=1 (e.g. `PREVIEW_ALL=1 npm run dev`) to treat every page as live and see the
 * finished, fully linked site locally.
 *
 * `kind` + `id` tie a path to its source: "service" and "city" entries are markdown files in
 * src/content/services and src/content/locations (id = file name); "guide" entries are files in
 * src/content/learning-center; "page" entries are hand-written Astro pages.
 */

const city = (id, label, state, priority) => ({
  path: `/roofing-${id}-${state.toLowerCase()}.html`,
  title: `${label}, ${state}`,
  kind: "city",
  id,
  section: 5,
  priority,
  live: false,
});
const guide = (slug, title, id) => ({ path: `/guides/${slug}.html`, title, kind: "guide", id, section: 6, live: false });

export const pages = [
  // ---- already live (ad landing pages and home) ----
  { path: "/", title: "Home", kind: "page", section: 0, live: true },
  { path: "/storm-damage.html", title: "Storm Damage", kind: "page", section: 0, live: true },
  { path: "/roof-replacement.html", title: "Roof Replacement", kind: "page", section: 0, live: true },
  { path: "/asphalt-shingle-roofing.html", title: "Asphalt Shingles", kind: "page", section: 0, live: true },

  // ---- section 4: residential services ----
  { path: "/residential-roofing.html", title: "Residential Roofing", kind: "page", section: 4, live: false },
  { path: "/roof-repair.html", title: "Roof Repair", kind: "service", id: "roof-repair", section: 4, live: false },
  { path: "/emergency-roof-repair.html", title: "Emergency Roof Repair", kind: "service", id: "emergency-roof-repair", section: 4, live: false },
  { path: "/roof-inspections.html", title: "Roof Inspections", kind: "service", id: "roof-inspections", section: 4, live: false },
  { path: "/hail-damage.html", title: "Hail Damage", kind: "service", id: "hail-damage", section: 4, live: false },
  { path: "/wind-damage.html", title: "Wind Damage", kind: "service", id: "wind-damage", section: 4, live: false },
  { path: "/about.html", title: "About", kind: "page", section: 6, live: false },
  { path: "/our-process.html", title: "Our Process", kind: "page", section: 6, live: false },
  { path: "/contact.html", title: "Contact", kind: "page", section: 6, live: false },

  // ---- section 5: priority cities ----
  city("south-bend", "South Bend", "IN", true),
  city("mishawaka", "Mishawaka", "IN", true),
  city("granger", "Granger", "IN", true),
  city("elkhart", "Elkhart", "IN", true),
  city("goshen", "Goshen", "IN", true),
  city("plymouth", "Plymouth", "IN", true),
  city("niles", "Niles", "MI", true),
  city("buchanan", "Buchanan", "MI", true),
  city("edwardsburg", "Edwardsburg", "MI", true),
  city("st-joseph", "St. Joseph", "MI", true),

  // ---- section 4: commercial ----
  { path: "/commercial-roofing.html", title: "Commercial Roofing", kind: "page", section: 4, live: false },
  { path: "/commercial-roof-repair.html", title: "Commercial Roof Repair", kind: "service", id: "repair", section: 4, live: false },
  { path: "/commercial-roof-replacement.html", title: "Commercial Roof Replacement", kind: "service", id: "replacement", section: 4, live: false },
  { path: "/commercial-roof-maintenance.html", title: "Commercial Roof Maintenance", kind: "service", id: "maintenance", section: 4, live: false },
  { path: "/tpo-roofing.html", title: "TPO Roofing", kind: "service", id: "tpo", section: 4, live: false },
  { path: "/epdm-roofing.html", title: "EPDM Roofing", kind: "service", id: "epdm", section: 4, live: false },
  { path: "/roof-coatings.html", title: "Silicone Roof Coatings", kind: "service", id: "roof-coatings", section: 4, live: false },

  // ---- section 6: buying guides ----
  guide("roof-replacement-cost", "New Roof Cost", "new-roof-cost-michiana"),
  guide("roof-repair-cost", "Roof Repair Cost", "roof-repair-cost"),
  guide("repair-vs-replacement", "Repair vs. Replacement", "roof-repair-vs-replacement"),
  guide("hail-damage-signs", "Signs of Hail Damage", "what-does-hail-damage-look-like"),
  guide("wind-damaged-shingles", "Wind-Damaged Shingles", "can-wind-damage-shingles-without-blowing-off"),
  guide("roof-replacement-timeline", "Replacement Timeline and Winter Roofing", "how-long-does-roof-replacement-take"),
  guide("roof-decking-damage", "Decking and Hidden Damage", "what-happens-if-bad-decking-is-found"),
  guide("roof-lifespan", "How Long a Roof Lasts", "how-long-does-a-roof-last-in-northern-indiana"),
  guide("roof-system-protection", "Ice and Water Shield and Ventilation", "what-does-ice-and-water-shield-do"),
  guide("shingle-comparison", "Shingle Options Compared", "architectural-vs-impact-resistant-shingles"),
  guide("compare-roofing-estimates", "Comparing Roofing Estimates", "what-should-be-included-in-a-roofing-estimate"),
  guide("storm-claim-documentation", "Storm Claim Documentation", null),
  guide("tpo-vs-epdm", "TPO vs. EPDM", "tpo-vs-epdm-for-commercial-buildings"),
  guide("coating-vs-replacement", "Coating vs. Replacement", "when-does-a-commercial-roof-need-coating-vs-replacement"),

  // ---- section 6: proof pages ----
  { path: "/reviews.html", title: "Reviews", kind: "page", section: 6, live: false },
  { path: "/projects.html", title: "Projects", kind: "page", section: 6, live: false },
  { path: "/financing.html", title: "Financing", kind: "page", section: 6, live: false },
  { path: "/warranties.html", title: "Warranties", kind: "page", section: 6, live: false },

  // ---- section 4: other exterior services ----
  { path: "/siding-soffit-fascia.html", title: "Siding, Soffit and Fascia", kind: "service", id: "siding-soffit-fascia", section: 4, live: false },
  { path: "/gutters.html", title: "Gutters", kind: "service", id: "gutters", section: 4, live: false },
  { path: "/gutter-protection.html", title: "Gutter Protection", kind: "service", id: "gutter-protection", section: 4, live: false },
  { path: "/skylights.html", title: "Skylights", kind: "service", id: "skylights", section: 4, live: false },

  // ---- section 5: remaining cities (need real local proof before they are built) ----
  city("osceola", "Osceola", "IN", false),
  city("new-carlisle", "New Carlisle", "IN", false),
  city("walkerton", "Walkerton", "IN", false),
  city("north-liberty", "North Liberty", "IN", false),
  city("la-porte", "La Porte", "IN", false),
  city("bristol", "Bristol", "IN", false),
  city("middlebury", "Middlebury", "IN", false),
  city("wakarusa", "Wakarusa", "IN", false),
  city("nappanee", "Nappanee", "IN", false),
  city("berrien-springs", "Berrien Springs", "MI", false),
  city("cassopolis", "Cassopolis", "MI", false),
  city("dowagiac", "Dowagiac", "MI", false),
  city("benton-harbor", "Benton Harbor", "MI", false),

  // ---- not part of the 65 (site utilities; free, listing pages that keep the menus short) ----
  { path: "/services.html", title: "All Services", kind: "page", section: 4, live: false, utility: true },
  { path: "/service-areas.html", title: "Service Areas", kind: "page", section: 5, live: false, utility: true },
  { path: "/guides.html", title: "Guides", kind: "page", section: 6, live: false, utility: true },
  { path: "/privacy-policy.html", title: "Privacy Policy", kind: "page", section: 4, live: false, utility: true },
];

/** Topic groups for the guides: used by the Guides menu and the /guides.html listing. */
export const guideGroups = [
  { title: "Costs & Estimates", slugs: ["roof-replacement-cost", "roof-repair-cost", "compare-roofing-estimates"] },
  { title: "Repair or Replace", slugs: ["repair-vs-replacement", "roof-replacement-timeline", "roof-decking-damage", "roof-lifespan"] },
  { title: "Storm Damage", slugs: ["hail-damage-signs", "wind-damaged-shingles", "storm-claim-documentation"] },
  { title: "Roof Systems", slugs: ["roof-system-protection", "shingle-comparison"] },
  { title: "Commercial", slugs: ["tpo-vs-epdm", "coating-vs-replacement"] },
];

const env = typeof process !== "undefined" && process.env ? process.env : {};
const previewAll = env.PREVIEW_ALL === "1";
// PREVIEW_SECTION=4 publishes the pages of section 4 of the client brief (and the live pages) for a client preview build only.
// Used by the Netlify branch-deploy context in netlify.toml; the production build never sets it.
const previewSection = Number(env.PREVIEW_SECTION || 0);
/** True for any preview build: the layout adds noindex so a preview can never be indexed. */
export const previewMode = previewAll || previewSection > 0;

export const isLive = (p) => Boolean(p && (p.live || previewAll || (previewSection > 0 && p.section <= previewSection)));
export const byPath = new Map(pages.map((p) => [p.path, p]));
export const livePaths = () => new Set(pages.filter(isLive).map((p) => p.path));
export const findEntry = (kind, id) => pages.find((p) => p.kind === kind && p.id === id);

/** Is this site path published? Anything not in the plan (old shelved URLs) counts as not published. */
export const isPublishedPath = (path) => isLive(byPath.get(path.split("#")[0]));

/** Keep only the links whose target page is published (external and in-page links always stay). */
export const publishedLinks = (links) =>
  links.filter((l) => !l.href.startsWith("/") || l.href.startsWith("/#") || isPublishedPath(l.href));

/** Where "get a free estimate" buttons point: the contact page once it is published, else the form on the roof page. */
export const contactHref = () => (isPublishedPath("/contact.html") ? "/contact.html" : "/roof-replacement.html#inspection");

/**
 * Turn links to unpublished pages inside already-rendered markdown HTML into plain text.
 * Done at page-render time (not in a markdown plugin) so Astro's content cache can never keep a
 * stale answer after a page's live flag changes.
 */
export const unlinkUnpublishedHtml = (html) =>
  html.replace(/<a\s+href="(\/[^"#]*)(#[^"]*)?"[^>]*>([\s\S]*?)<\/a>/g, (match, path, _hash, inner) =>
    path === "/" || isPublishedPath(path) ? match : inner,
  );
