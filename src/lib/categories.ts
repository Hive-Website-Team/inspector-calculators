export const CATEGORY_LABELS: Record<string, string> = {
  business: 'Business',
  pricing: 'Pricing',
  roofing: 'Roofing',
  electrical: 'Electrical',
  plumbing: 'Plumbing',
  structure: 'Structure',
  hvac: 'HVAC',
  safety: 'Safety',
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

/**
 * Categories that actually contain a calculator.
 *
 * An empty category page is a thin page: it renders a heading and nothing else,
 * and submitting it in the sitemap spends crawl budget teaching Google the site
 * has empty sections. `tasks/README.md` §5 is explicit that the first crawl sets
 * Google's opinion of a site. Empty categories reappear automatically the moment
 * a calculator claims them.
 */
export function activeCategories(records: { category: string }[]): string[] {
  return Object.keys(CATEGORY_LABELS).filter((c) => records.some((r) => r.category === c));
}

/**
 * One line per category, shown under the group heading on the homepage index.
 *
 * Modelled on electricaltoolbox.com, where each group's line names the standard
 * the calculators in it are built from — "NEC Chapter 9 resistance data" — so a
 * reader knows what a result is grounded in before opening anything.
 */
export const CATEGORY_BLURBS: Record<string, string> = {
  business: 'Profitability, capacity and revenue planning. Plain arithmetic on your own numbers, with every term defined.',
  pricing: 'What a job and a software stack actually cost. Vendor figures come from published pricing pages, dated.',
  roofing: 'Ventilation and roof geometry. IRC 2021 Chapter 8 requirements.',
  electrical: 'Service load and circuit checks. NEC tables, cited by article and edition.',
  plumbing: 'Fixture demand and water heater sizing. Federal sizing guidance.',
  structure: 'Framing and span checks. AWC prescriptive span tables, at the stated load and service conditions.',
  hvac: 'Sizing and airflow. Manufacturer and code-referenced figures.',
  safety: 'Stairs, guards and handrails. IRC 2021 Chapter 3 dimensional limits.',
};

export function categoryBlurb(category: string): string {
  return CATEGORY_BLURBS[category] ?? '';
}

/**
 * What the calculators in a category are grounded in, and when an inspector
 * reaches for them. Shown on the category page under its own heading — those
 * pages were 152 words with no sectioning, which is thin for the hub layer of
 * the site's hierarchy.
 */
export const CATEGORY_COVERAGE: Record<string, string> = {
  business:
    'These are the numbers behind running the company rather than inspecting a house: whether the year clears a profit after you have paid yourself, how many jobs a target income actually requires, and what it costs to start from nothing. Every figure is arithmetic on numbers you enter — no industry averages, no benchmarks borrowed from someone else\u2019s market. Reach for these when setting a price, planning a year, or deciding whether the business supports a second inspector.',
  pricing:
    'What a job costs you to deliver and what your software stack costs to keep. Vendor figures come from each vendor\u2019s own published pricing page with the date it was read, never from a sales conversation or a third-party roundup, so you can re-check any number against the linked source. Reach for these when a ticket price stops feeling right or a renewal quote arrives.',
  roofing:
    'Roof geometry and attic ventilation, worked against the 2021 International Residential Code. The pitch multiplier is trigonometry and holds anywhere; the minimum slopes and ventilation ratios are code, and the section number and edition are named on every result so a finding can be written up and defended. Reach for these from the roof or the attic hatch, on a phone.',
  structure:
    'Framing checks against the American Wood Council\u2019s prescriptive tables, at the load and service conditions the table assumes. A span that fails here is a structural finding rather than a maintenance note, so the assumed loads are stated in full and belong in the write-up alongside the measurement.',
  safety:
    'Stairs, guards and handrails against the 2021 IRC\u2019s dimensional limits \u2014 the fall-protection dimensions that account for a large share of injury claims in existing homes. Each result names the limit and the section it comes from, so a finding travels into the report with its citation attached rather than as a judgement call.',
  electrical:
    'Service load and circuit checks against NEC tables, cited by article and edition.',
  plumbing:
    'Fixture demand and water heater sizing against federal sizing guidance.',
  hvac:
    'Sizing and airflow, from manufacturer and code-referenced figures.',
};

export function categoryCoverage(category: string): string {
  return CATEGORY_COVERAGE[category] ?? '';
}
