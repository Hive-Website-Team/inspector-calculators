import type { CalculatorRecord } from '@/lib/calculator-schema';
import type { ResultTable } from './index';

/*
  Vendor list prices, transcribed from each vendor's own published pricing page.
  Every figure here is cited in `assumptions` below and re-checked on the date
  shown there — a price with no source in that table has no business being in
  this file.

  `monthly` is the bill when you pay month to month. `annual` is the bill when
  you prepay a year. Where a vendor publishes no annual plan, `annual` is simply
  twelve monthly bills, which is what that vendor actually charges over a year —
  not a claim that they offer an annual option.

  Both take (n, k): inspections per month, and inspectors needing a login. Most
  vendors ignore one or the other, and which one they ignore is the whole story
  of the comparison — a flat per-seat plan does not move with volume, a
  per-inspection plan does not move with headcount, and the two curves cross.
*/
interface Vendor {
  id: number;
  name: string;
  /* How the vendor charges, in four or five words. Shown under the name. */
  model: string;
  monthly: (n: number, k: number) => number;
  annual: (n: number, k: number) => number;
  /*
    Set only where a row is flat across seat count because the vendor publishes
    no multi-inspector rate — not where it is flat by design.

    Without this the table actively misleads: HomeGauge's single $89 figure
    sorts to the top at five inspectors and reads as the cheapest option, when
    the truth is that nobody outside HomeGauge knows what five seats cost. ISN
    is flat across seats too, but that is a published property of its
    per-inspection model rather than a gap, so it carries no caveat.
  */
  seatCaveat?: string;
}

/*
  ISN's floor. The pricing page only says "monthly minimum fees may apply"; the
  amount is published in ISN's help centre, in the article listing what a Porch
  partnership waives — "ISN's $10 monthly minimum fee". It bites only at one
  inspection a month, since two already bill $14.50.
*/
const ISN_MONTHLY_MINIMUM = 10;

/** ISN's published bands: 1–50, 51–100, then 101+ at the third-tier rate. */
function isnMonthly(n: number): number {
  const band1 = Math.min(n, 50);
  const band2 = Math.min(Math.max(n - 50, 0), 50);
  const band3 = Math.max(n - 100, 0);
  return Math.max(band1 * 7.25 + band2 * 5.5 + band3 * 3.75, ISN_MONTHLY_MINIMUM);
}

/*
  Tap Inspect sells the same product two ways, and for a solo inspector the
  cheaper of the two is the honest answer to "what would I pay". Pay-as-you-go
  is only considered at one inspector: it is billed per inspection, so it has no
  seat concept at all, and quoting it against a three-inspector firm would be
  comparing a plan to something that is not a plan.

  The $90 covers the first inspector rather than being charged alongside a $45
  seat. The pricing page is ambiguous on that — "$90/mo + $45 per inspector"
  printed next to a $90 solo plan — but the help centre is not: "you are charged
  a flat fee for the 1st inspector ... Each inspector you invite to your Team
  results in an additional $45 per month". The same article puts the
  pay-as-you-go crossover at 12 jobs a month, which is exactly where the Math.min
  below flips, so the two published statements corroborate each other.
*/
function tapInspectMonthly(n: number, k: number): number {
  const team = 90 + 45 * Math.max(k - 1, 0);
  return k === 1 ? Math.min(team, 7.5 * n) : team;
}

const VENDORS: Vendor[] = [
  {
    id: 1,
    name: 'Hive Inspect',
    model: 'Flat, per inspector',
    monthly: (_n, k) => 99 + 69 * Math.max(k - 1, 0),
    annual: (_n, k) => 999 + 599 * Math.max(k - 1, 0),
  },
  {
    id: 2,
    name: 'Spectora',
    model: 'Flat, per inspector',
    monthly: (_n, k) => 109 + 99 * Math.max(k - 1, 0),
    annual: (_n, k) => 1090 + 999 * Math.max(k - 1, 0),
  },
  {
    id: 3,
    name: 'Spectora + Advanced',
    model: 'Flat plan plus $4/inspection',
    monthly: (n, k) => 109 + 99 * Math.max(k - 1, 0) + 4 * n,
    annual: (n, k) => 1090 + 999 * Math.max(k - 1, 0) + 4 * n * 12,
  },
  {
    id: 4,
    name: 'ISN',
    model: 'Tiered per inspection',
    monthly: (n) => isnMonthly(n),
    annual: (n) => isnMonthly(n) * 12,
  },
  {
    id: 5,
    name: 'HomeGauge',
    model: 'Flat monthly',
    monthly: () => 89,
    annual: () => 89 * 12,
    seatCaveat: 'no published multi-inspector rate',
  },
  {
    id: 6,
    name: 'Palm-Tech',
    model: 'Per user',
    monthly: (_n, k) => 50 * k,
    annual: (_n, k) => 500 * k,
  },
  {
    id: 7,
    name: 'Tap Inspect',
    model: 'Unlimited or per inspection',
    monthly: (n, k) => tapInspectMonthly(n, k),
    annual: (n, k) => tapInspectMonthly(n, k) * 12,
  },
];

const CUSTOM_VENDOR_ID = 8;

const vendorOptions = [
  ...VENDORS.map((v) => ({ value: v.id, label: v.name })),
  { value: CUSTOM_VENDOR_ID, label: 'Other / my own figure' },
];

export const record: CalculatorRecord = {
  slug: 'software-tco-calculator',
  title: 'Home Inspection Software Cost Calculator',
  category: 'pricing',
  definition:
    'The home inspection software cost calculator prices Hive Inspect, Spectora, ISN, HomeGauge, Palm-Tech and Tap Inspect against your own monthly inspection count and inspector headcount, then adds the rest of your stack into one monthly and annual total.',
  inputs: [
    {
      key: 'vendor',
      label: 'Report software',
      default: 2,
      min: 1,
      max: 8,
      options: vendorOptions,
      help: 'Every vendor is priced side by side in the table below, whichever one you pick here',
    },
    {
      key: 'billing',
      label: 'Billing',
      default: 0,
      min: 0,
      max: 1,
      options: [
        { value: 0, label: 'Billed monthly' },
        { value: 1, label: 'Prepaid annually' },
      ],
      help: 'Annual prepay is only cheaper where the vendor publishes an annual plan',
    },
    { key: 'inspectionsPerMonth', label: 'Inspections per month', default: 20, min: 1, max: 300 },
    { key: 'inspectors', label: 'Inspectors needing a login', default: 1, min: 1, max: 25, help: 'Seat count, including the owner' },
    { key: 'customSoftware', label: 'Your own figure', unit: '$/mo', default: 0, min: 0, max: 2000, help: "Used only when Report software is set to 'Other / my own figure'" },
    { key: 'scheduling', label: 'Scheduling tool', unit: '$/mo', default: 0, min: 0, max: 500, help: '0 if bundled into report software' },
    { key: 'crm', label: 'CRM', unit: '$/mo', default: 0, min: 0, max: 500 },
    { key: 'paymentsPercent', label: 'Payment processing fee', unit: '%', default: 3, min: 0, max: 10, help: 'Percent of card-processed revenue' },
    { key: 'monthlyRevenue', label: 'Monthly revenue processed via card', unit: '$/mo', default: 8000, min: 0, max: 200000 },
    { key: 'website', label: 'Website', unit: '$/mo', default: 58, min: 0, max: 500, help: "Default is Spectora's Base Website plan, $699/yr ÷ 12" },
    { key: 'phone', label: 'Phone / answering service', unit: '$/mo', default: 30, min: 0, max: 500 },
    { key: 'ai', label: 'AI tools', unit: '$/mo', default: 0, min: 0, max: 500 },
  ],
  outputs: [
    { key: 'softwareMonthly', label: 'Selected software, per month', unit: '$/mo' },
    { key: 'softwareAnnual', label: 'Selected software, per year', unit: '$/yr' },
    { key: 'monthlyTotal', label: 'Whole stack, per month', unit: '$/mo' },
    { key: 'trueAnnualSoftwareSpend', label: 'True annual software spend', unit: '$/yr' },
    { key: 'perInspectionSoftwareCost', label: 'Software cost per inspection', unit: '$' },
  ],
  summary:
    'Price Hive Inspect, Spectora, ISN, HomeGauge and more at your real volume, then total your whole software stack monthly and annually.',

  formulaText:
    "Each vendor's bill is worked out from its own published model at your inspection count and inspector count: a flat plan charges a base price plus a rate for each additional inspector; a per-inspection plan applies its rate, or its volume tiers, to your monthly count; a per-user plan multiplies by seats. Monthly stack total = selected software + scheduling + CRM + (payment fee % × monthly revenue) + website + phone + AI. True annual software spend = monthly stack total × 12. Software cost per inspection = monthly stack total ÷ inspections per month.",

  interpretation:
    'Read the comparison table before the total. The vendors do not merely differ in price, they differ in what the price is attached to, and that is what decides which one is cheapest for you rather than in general. Flat per-inspector plans — Hive Inspect, Spectora, HomeGauge, Palm-Tech — cost the same in a dead February as in a frantic June, so their cost per inspection falls as you get busier and they reward volume. Per-inspection pricing does the opposite: ISN and Tap Inspect\'s pay-as-you-go are close to free on a slow month and become the most expensive line in the stack on a good one, which is exactly why they suit a new or part-time inspector and stop suiting a full book. Spectora Advanced sits in both camps, a flat plan with a $4-per-inspection meter bolted on, so it tracks volume even though it looks like a subscription. The practical consequence is that the ranking in the table flips as you grow, usually somewhere between fifteen and twenty-five inspections a month, and a plan chosen in your first year is very often the wrong one by your third. Check the ranking again whenever your volume moves by half, and take the per-inspection figure — not the monthly one — into your pricing, because that is the number that sits alongside vehicle and insurance in your cost per inspection. Two things the table cannot tell you: annual prepay only helps where a vendor publishes an annual plan, and a stack running above roughly 5% of revenue is usually carrying two tools that overlap rather than one that is overpriced.',
  assumptions: [
    {
      text: 'Hive Inspect: $99 per inspector per month, or $999 per inspector per year; additional inspectors $69 per month, or $599 per year.',
      source: { citation: 'Hive Inspect — Pricing', url: 'https://hiveinspect.com/pricing', accessed: '2026-09-07' },
    },
    {
      text: 'Spectora: $109 per month or $1,090 per year for the base plan; additional inspectors $99 per month or $999 per year.',
      source: { citation: 'Spectora — Pricing', url: 'https://www.spectora.com/pricing/', accessed: '2026-09-07' },
    },
    {
      text: 'Spectora Advanced is an add-on billed at $4 per inspection on top of the base plan, not a replacement for it, so the "Spectora + Advanced" row carries both charges.',
      source: { citation: 'Spectora — Pricing', url: 'https://www.spectora.com/pricing/', accessed: '2026-09-07' },
    },
    {
      text: 'ISN: $7.25 per inspection for the first 50 each month, $5.50 for inspections 51 to 100, and $3.75 for 101 to 150. ISN charges no separate seat fee, so the ISN row does not move with inspector count.',
      source: { citation: 'Inspection Support Network — Pricing', url: 'https://www.inspectionsupport.com/pricing/', accessed: '2026-09-07' },
    },
    {
      text: "ISN's monthly minimum is $10. The pricing page only warns that \"monthly minimum fees may apply\" without naming a figure; the amount appears in ISN's help centre, in the article listing what an ISN–Porch partnership waives, as \"ISN's $10 monthly minimum fee\". The floor is applied here, so it only changes the bill at one inspection a month — two inspections already bill $14.50.",
      source: { citation: 'Inspection Support Network — Help Centre, Porch Benefits and Customization', url: 'https://help.inspectionsupport.com/en/articles/1393156-porch-benefits-and-customization', accessed: '2026-09-07' },
    },
    {
      text: 'HomeGauge: $89 per month after a 30-day free trial. HomeGauge publishes no additional-inspector rate, so the HomeGauge row is held flat across seat counts rather than guessed at.',
      source: { citation: 'HomeGauge — Software Pricing', url: 'https://www.homegauge.com/one/pricing/', accessed: '2026-09-07' },
    },
    {
      text: 'Palm-Tech: $50 per user per month, or $500 per user per year, with every feature included at either price.',
      source: { citation: 'Palm-Tech — Pricing', url: 'https://www.palmtech.com/pricing/', accessed: '2026-09-07' },
    },
    {
      text: 'Tap Inspect publishes three prices: $7.50 per job pay-as-you-go, sold in blocks of 20 for $150; $90 per month for the Unlimited plan; and an Inspection Team plan headed "$45 / per user". At one inspector the calculator quotes whichever of pay-as-you-go and the $90 plan is cheaper at your volume.',
      source: { citation: 'Tap Inspect — Pricing', url: 'https://www.tapinspect.com/pricing', accessed: '2026-09-07' },
    },
    {
      text: 'On the Team plan the flat fee covers the first inspector and each further inspector adds $45 a month — "you are charged a flat fee for the 1st inspector who is typically the Team Owner ... Each inspector you invite to your Team results in an additional $45 per month on your Subscription." The same article states that pay-as-you-go is cheaper below 12 jobs a month and the Unlimited plan above it, which is exactly where $7.50 per job crosses $90.',
      source: { citation: 'Tap Inspect — Help Centre, About Our Subscription Plans', url: 'https://help.tapinspect.com/hc/en-us/articles/360038266892-About-Our-Subscription-Plans', accessed: '2026-09-07' },
    },
  ],
  referenceTable: {
    caption: 'What each vendor bills a solo inspector per year, as volume changes',
    columns: ['Software', '10 inspections/mo', '20 inspections/mo', '40 inspections/mo'],
    rows: [
      ['Hive Inspect', '$1,188', '$1,188', '$1,188'],
      ['Spectora', '$1,308', '$1,308', '$1,308'],
      ['Spectora + Advanced', '$1,788', '$2,268', '$3,228'],
      ['ISN', '$870', '$1,740', '$3,480'],
      ['HomeGauge', '$1,068', '$1,068', '$1,068'],
      ['Palm-Tech', '$600', '$600', '$600'],
      ['Tap Inspect', '$900', '$1,080', '$1,080'],
    ],
    note: 'One inspector, billed monthly, report software only — no website, phone or card processing. Produced by this calculator from each vendor\'s published list price. The four flat rows never move; ISN and Spectora Advanced roughly quadruple and treble across the same range, and ISN goes from the second-cheapest option at ten inspections a month to the most expensive at forty. That crossover, not the absolute figures, is what this table is for.',
  },
  limitations: [
    'Compares price, not capability. These products differ substantially in what they do, and a cheaper plan you cannot run your business in is not a saving.',
    'Every figure is a published list price, checked on the dates in the sources table and subject to change without notice. Re-check the linked pages before committing, and note that several vendors negotiate.',
    'ISN publishes tiers only to 150 inspections a month and directs higher volumes to sales; above 150 this keeps applying the third-tier rate, which is an extrapolation rather than a published price. ISN\'s $10 monthly minimum is applied.',
    'HomeGauge is the one vendor here whose multi-inspector price could not be established. It is absent from the pricing page, from that page\'s FAQ, and from every article in the HomeGauge support centre, so its row is held at the published solo figure and does not respond to the inspector count. That makes the HomeGauge row incomparable above one inspector rather than cheap — the row says so — and it has to be confirmed with HomeGauge directly. Note also that HomeGauge\'s own pricing page sells Spectora alongside it, and carries an FAQ on the difference between the two — treat those two rows as one company\'s two products rather than as independent competitors.',
    'One-time setup fees are excluded — Spectora charges $499 to set up its Base Website and Hive Inspect $299 — so a first year costs more than the annual figure shown.',
    'Introductory and promotional rates are excluded and every figure is the steady-state price. Hive Inspect\'s first three months run at $39, $59 and $79 before settling at $99, and most vendors offer a free trial.',
    'Annual prepay assumes twelve months paid up front. Where a vendor publishes no annual plan the annual figure is simply twelve monthly bills, not a discount that vendor offers.',
    'Counts subscription price only. Migration effort, the time spent learning a new tool, and the cost of getting your data out if you leave are real and are not in this figure.',
  ],
  examples: [
    {
      label: 'Solo inspector on Spectora, 20 inspections/month',
      inputs: {
        vendor: 2, billing: 0, inspectionsPerMonth: 20, inspectors: 1, customSoftware: 0,
        scheduling: 0, crm: 0, paymentsPercent: 3, monthlyRevenue: 8000, website: 58, phone: 30, ai: 0,
      },
    },
    {
      label: 'Three-inspector firm on Hive Inspect prepaid annually, 60 inspections/month',
      inputs: {
        vendor: 1, billing: 1, inspectionsPerMonth: 60, inspectors: 3, customSoftware: 0,
        scheduling: 0, crm: 0, paymentsPercent: 3, monthlyRevenue: 24000, website: 58, phone: 30, ai: 0,
      },
    },
  ],
  related: ['home-inspection-software-pricing-calculator', 'cost-per-inspection-calculator', 'startup-cost-planner'],
  datePublished: '2026-09-03',
  dateModified: '2026-09-07',
};

/** The chosen vendor's bill, both ways round. */
function vendorCost(i: Record<string, number>) {
  const n = i.inspectionsPerMonth;
  const k = i.inspectors;

  if (i.vendor === CUSTOM_VENDOR_ID) {
    return { monthly: i.customSoftware, annual: i.customSoftware * 12 };
  }
  const vendor = VENDORS.find((v) => v.id === i.vendor) ?? VENDORS[0];
  return { monthly: vendor.monthly(n, k), annual: vendor.annual(n, k) };
}

export function compute(i: Record<string, number>) {
  const cost = vendorCost(i);

  /*
    Prepaying does not change what the year costs per month, it changes what the
    year costs — so the monthly figure under annual billing is the annual price
    spread across twelve, which is what belongs in a monthly stack total.
  */
  const prepaid = i.billing === 1;
  const softwareAnnual = prepaid ? cost.annual : cost.monthly * 12;
  const softwareMonthly = softwareAnnual / 12;

  const paymentFee = (i.paymentsPercent / 100) * i.monthlyRevenue;
  const monthlyTotal = softwareMonthly + i.scheduling + i.crm + paymentFee + i.website + i.phone + i.ai;
  const trueAnnualSoftwareSpend = monthlyTotal * 12;
  const perInspectionSoftwareCost = i.inspectionsPerMonth > 0 ? monthlyTotal / i.inspectionsPerMonth : 0;

  return {
    softwareMonthly: +softwareMonthly.toFixed(2),
    softwareAnnual: +softwareAnnual.toFixed(2),
    monthlyTotal: +monthlyTotal.toFixed(2),
    trueAnnualSoftwareSpend: +trueAnnualSoftwareSpend.toFixed(2),
    perInspectionSoftwareCost: +perInspectionSoftwareCost.toFixed(2),
  };
}

const whole = (n: number) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
const cents = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/*
  Every vendor at the current inputs, cheapest first.

  Report software only — the website, phone and card-processing lines are
  identical whichever vendor you pick, so folding them in here would add the
  same number to every row and make the gaps look smaller than they are.
*/
export function computeTable(i: Record<string, number>): ResultTable {
  const prepaid = i.billing === 1;
  const n = i.inspectionsPerMonth;
  const k = i.inspectors;

  const rows = VENDORS.map((v) => {
    const annual = prepaid ? v.annual(n, k) : v.monthly(n, k) * 12;
    /* The caveat only bites once there is more than one seat to price. */
    const model = v.seatCaveat && k > 1 ? `${v.model} — ${v.seatCaveat}` : v.model;
    return { name: v.name, model, annual, id: v.id };
  });

  if (i.vendor === CUSTOM_VENDOR_ID && i.customSoftware > 0) {
    rows.push({
      name: 'Your own figure',
      model: 'As entered above',
      annual: i.customSoftware * 12,
      id: CUSTOM_VENDOR_ID,
    });
  }

  rows.sort((a, b) => a.annual - b.annual);

  return {
    caption: prepaid
      ? `Every vendor prepaid annually at ${n} inspections/mo, ${k} inspector${k === 1 ? '' : 's'}`
      : `Every vendor billed monthly at ${n} inspections/mo, ${k} inspector${k === 1 ? '' : 's'}`,
    columns: ['Software', 'Per month', 'Per year', 'Per inspection'],
    rows: rows.map((r) => ({
      cells: [
        `${r.name} — ${r.model}`,
        whole(r.annual / 12),
        whole(r.annual),
        cents(r.annual / 12 / n),
      ],
      selected: r.id === i.vendor,
    })),
    note: 'Report software only, rounded to the dollar. List prices — see the sources table below.',
  };
}
