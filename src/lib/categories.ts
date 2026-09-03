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
