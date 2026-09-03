import type { CalculatorRecord } from '@/lib/calculator-schema';

export const record: CalculatorRecord = {
  slug: 'home-inspection-software-pricing-calculator',
  title: 'Home Inspection Software Pricing Calculator',
  category: 'pricing',
  definition:
    'The home inspection software pricing calculator compares the three ways inspection software is sold — flat monthly subscription, tiered per-inspection fee, and per-user seat license — and reports annual cost, cost per inspection, and the monthly volume at which each model becomes cheapest.',
  inputs: [
    { key: 'inspectionsPerMonth', label: 'Inspections per month', default: 20, min: 1, max: 300 },
    { key: 'inspectors', label: 'Inspectors needing a login', default: 1, min: 1, max: 25, help: 'Seat count, including the owner' },
    { key: 'flatMonthly', label: 'Flat plan — base price', unit: '$/mo', default: 109, min: 0, max: 2000, help: "Default is Spectora's published monthly plan" },
    { key: 'flatAdditionalSeat', label: 'Flat plan — each additional inspector', unit: '$/mo', default: 99, min: 0, max: 1000, help: "Default is Spectora's published per-inspector add-on" },
    { key: 'perSeatMonthly', label: 'Seat plan — price per user', unit: '$/mo', default: 50, min: 0, max: 1000, help: "Default is Palm-Tech's published per-user monthly price" },
    { key: 'tier1Rate', label: 'Per-inspection — first 50/mo', unit: '$', default: 7.25, min: 0, max: 100, step: 0.25, help: "Default is ISN's published first-tier rate" },
    { key: 'tier2Rate', label: 'Per-inspection — 51 to 100/mo', unit: '$', default: 5.5, min: 0, max: 100, step: 0.25 },
    { key: 'tier3Rate', label: 'Per-inspection — 101 and above/mo', unit: '$', default: 3.75, min: 0, max: 100, step: 0.25 },
    { key: 'annualPrepayDiscount', label: 'Annual prepay discount', unit: '%', default: 16.7, min: 0, max: 50, step: 0.1, help: 'Both published annual plans below work out to about 16.7% off monthly billing' },
  ],
  outputs: [
    { key: 'flatModelAnnual', label: 'Flat subscription — billed monthly', unit: '$/yr' },
    { key: 'flatModelAnnualPrepaid', label: 'Flat subscription — prepaid annually', unit: '$/yr' },
    { key: 'perInspectionModelAnnual', label: 'Tiered per-inspection model', unit: '$/yr' },
    { key: 'perSeatModelAnnual', label: 'Per-user seat model', unit: '$/yr' },
    { key: 'lowestAnnual', label: 'Lowest of the three', unit: '$/yr' },
    { key: 'lowestPerInspection', label: 'Software cost per inspection at that price', unit: '$' },
    { key: 'breakEvenInspectionsPerMonth', label: 'Volume where per-inspection overtakes the flat plan', unit: 'inspections/mo' },
  ],
  formulaText:
    'Flat model = (base price + additional-seat price × (inspectors − 1)) × 12. Per-inspection model = the tiered rate applied to each band of monthly volume, × 12. Seat model = price per user × inspectors × 12. Break-even is the lowest monthly volume at which the tiered per-inspection bill equals or exceeds the flat plan.',
  assumptions: [
    {
      text: 'Flat-subscription defaults are Spectora\'s published prices: $109 per month for the base plan, $1,090 prepaid annually, and $99 per month for each additional inspector.',
      source: { citation: 'Spectora — Pricing', url: 'https://www.spectora.com/pricing/', accessed: '2026-09-04' },
    },
    {
      text: 'Per-inspection defaults are ISN\'s published volume tiers: $7.25 per inspection for the first 50 each month, $5.50 for inspections 51 to 100, and $3.75 for inspections 101 to 150.',
      source: { citation: 'Inspection Support Network — Pricing', url: 'https://www.inspectionsupport.com/pricing/', accessed: '2026-09-04' },
    },
    {
      text: 'Per-seat defaults are Palm-Tech\'s published prices: $50 per user per month, or $500 per user per year.',
      source: { citation: 'Palm-Tech — Pricing', url: 'https://www.palmtech.com/pricing/', accessed: '2026-09-04' },
    },
    {
      text: 'The 16.7% annual prepay default is derived from the two published annual plans, not quoted: Spectora bills $1,090 per year against $1,308 billed monthly, and Palm-Tech bills $500 per user per year against $600 billed monthly. Both are a 16.7% reduction.',
      source: { citation: 'Spectora — Pricing', url: 'https://www.spectora.com/pricing/', accessed: '2026-09-04' },
    },
  ],
  limitations: [
    'Compares pricing models, not products. A cheaper model is not a better product, and feature sets across these plans are not equivalent.',
    'ISN publishes per-inspection tiers only up to 150 inspections per month; above that the calculator keeps applying the third-tier rate, which is an extrapolation rather than a published price. ISN also notes that monthly minimum fees may apply.',
    'Excludes setup fees, payment-processing percentages, website add-ons, and anything billed outside the core plan. Use the software total cost of ownership calculator for a full recurring-spend figure.',
    'Vendor prices are checked on the dates shown in the sources table and change without notice; re-check the linked pages before relying on a figure.',
  ],
  examples: [
    {
      label: 'Solo inspector, 20 inspections/month',
      inputs: {
        inspectionsPerMonth: 20, inspectors: 1, flatMonthly: 109, flatAdditionalSeat: 99,
        perSeatMonthly: 50, tier1Rate: 7.25, tier2Rate: 5.5, tier3Rate: 3.75, annualPrepayDiscount: 16.7,
      },
    },
    {
      label: 'Three-inspector firm, 75 inspections/month',
      inputs: {
        inspectionsPerMonth: 75, inspectors: 3, flatMonthly: 109, flatAdditionalSeat: 99,
        perSeatMonthly: 50, tier1Rate: 7.25, tier2Rate: 5.5, tier3Rate: 3.75, annualPrepayDiscount: 16.7,
      },
    },
  ],
  related: ['software-tco-calculator', 'cost-per-inspection-calculator', 'startup-cost-planner'],
  datePublished: '2026-09-04',
  dateModified: '2026-09-04',
};

/** Monthly bill under a banded per-inspection model: 1–50, 51–100, 101+. */
function tieredMonthlyBill(n: number, r1: number, r2: number, r3: number) {
  const band1 = Math.min(n, 50);
  const band2 = Math.min(Math.max(n - 50, 0), 50);
  const band3 = Math.max(n - 100, 0);
  return band1 * r1 + band2 * r2 + band3 * r3;
}

export function compute(i: Record<string, number>) {
  const flatMonthlyTotal = i.flatMonthly + i.flatAdditionalSeat * Math.max(i.inspectors - 1, 0);
  const flatModelAnnual = flatMonthlyTotal * 12;
  const flatModelAnnualPrepaid = flatModelAnnual * (1 - i.annualPrepayDiscount / 100);

  const perInspectionMonthly = tieredMonthlyBill(i.inspectionsPerMonth, i.tier1Rate, i.tier2Rate, i.tier3Rate);
  const perInspectionModelAnnual = perInspectionMonthly * 12;

  const perSeatModelAnnual = i.perSeatMonthly * i.inspectors * 12;

  const lowestAnnual = Math.min(flatModelAnnual, perInspectionModelAnnual, perSeatModelAnnual);
  const inspectionsPerYear = i.inspectionsPerMonth * 12;
  const lowestPerInspection = inspectionsPerYear > 0 ? lowestAnnual / inspectionsPerYear : 0;

  // Lowest whole monthly volume at which the tiered bill reaches the flat plan.
  let breakEvenInspectionsPerMonth = 0;
  for (let n = 1; n <= 300; n++) {
    if (tieredMonthlyBill(n, i.tier1Rate, i.tier2Rate, i.tier3Rate) >= flatMonthlyTotal) {
      breakEvenInspectionsPerMonth = n;
      break;
    }
  }

  return {
    flatModelAnnual: +flatModelAnnual.toFixed(2),
    flatModelAnnualPrepaid: +flatModelAnnualPrepaid.toFixed(2),
    perInspectionModelAnnual: +perInspectionModelAnnual.toFixed(2),
    perSeatModelAnnual: +perSeatModelAnnual.toFixed(2),
    lowestAnnual: +lowestAnnual.toFixed(2),
    lowestPerInspection: +lowestPerInspection.toFixed(2),
    breakEvenInspectionsPerMonth,
  };
}
