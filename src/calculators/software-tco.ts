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
  /*
    A distinct power of two. The vendors a reader wants priced is a set, not a
    choice, so the selection is a bitmask over these — see `choices` in the
    input schema. Ids used to be 1,2,3…; they are 1,2,4… now for that reason.
  */
  bit: number;
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
    bit: 1,
    name: 'Hive Inspect',
    model: 'Flat, per inspector',
    monthly: (_n, k) => 99 + 69 * Math.max(k - 1, 0),
    annual: (_n, k) => 999 + 599 * Math.max(k - 1, 0),
  },
  {
    bit: 2,
    name: 'Spectora',
    model: 'Flat, per inspector',
    monthly: (_n, k) => 109 + 99 * Math.max(k - 1, 0),
    annual: (_n, k) => 1090 + 999 * Math.max(k - 1, 0),
  },
  {
    bit: 4,
    name: 'Spectora + Advanced',
    model: 'Flat plan plus $4/inspection',
    monthly: (n, k) => 109 + 99 * Math.max(k - 1, 0) + 4 * n,
    annual: (n, k) => 1090 + 999 * Math.max(k - 1, 0) + 4 * n * 12,
  },
  {
    bit: 8,
    name: 'ISN',
    model: 'Tiered per inspection',
    monthly: (n) => isnMonthly(n),
    annual: (n) => isnMonthly(n) * 12,
  },
  {
    bit: 16,
    name: 'HomeGauge',
    model: 'Flat monthly',
    monthly: () => 89,
    annual: () => 89 * 12,
    seatCaveat: 'no published multi-inspector rate',
  },
  {
    bit: 32,
    name: 'Palm-Tech',
    model: 'Per user',
    monthly: (_n, k) => 50 * k,
    annual: (_n, k) => 500 * k,
  },
  {
    bit: 64,
    name: 'Tap Inspect',
    model: 'Unlimited or per inspection',
    monthly: (n, k) => tapInspectMonthly(n, k),
    annual: (n, k) => tapInspectMonthly(n, k) * 12,
  },
];

/* The one row that is not a published price: whatever the reader is paying now. */
const CUSTOM_BIT = 128;

/* Every bit at once — the ceiling the clamp is given. */
const ALL_BITS = VENDORS.reduce((sum, v) => sum + v.bit, 0) + CUSTOM_BIT;

/*
  What is ticked before anyone touches anything: Hive Inspect, Spectora and
  HomeGauge.

  Three, not all seven, because each product is a column now. Three columns and
  a label column fill the tool's width exactly; seven would open on a table that
  has to be scrolled sideways before it can be read, which is a poor first
  impression of a comparison. The other four are one tick away.
*/
const DEFAULT_VENDORS = 1 + 2 + 16;

const vendorChoices = [
  ...VENDORS.map((v) => ({ value: v.bit, label: v.name })),
  { value: CUSTOM_BIT, label: 'What I pay now (enter it below)' },
];

export const record: CalculatorRecord = {
  slug: 'software-tco-calculator',
  title: 'Home Inspection Software Cost Calculator',
  category: 'pricing',
  definition:
    'The home inspection software cost calculator prices Hive Inspect, Spectora, ISN, HomeGauge, Palm-Tech and Tap Inspect side by side at your own monthly inspection count and inspector headcount, reporting what each one bills per month and per year.',
  inputs: [
    {
      key: 'vendors',
      label: 'Software to compare',
      section: 'Compare',
      default: DEFAULT_VENDORS,
      /*
        A mask, not a count. `min: 1` is the floor a hand-edited link is
        clamped to — the widget itself refuses to untick the last box, so the
        floor is only ever reached by someone editing ?vendors= by hand.
      */
      min: 1,
      max: ALL_BITS,
      choices: vendorChoices,
      help: 'Tick as many as you want priced. Each one gets its own column below, cheapest on the left — scroll the table sideways past three.',
    },
    { key: 'inspectionsPerMonth', label: 'Inspections per month', default: 20, min: 1, max: 300 },
    { key: 'inspectors', label: 'Inspectors needing a login', default: 1, min: 1, max: 25, help: 'Seat count, including the owner' },
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
    { key: 'customSoftware', label: 'What I pay now', unit: '$/mo', default: 0, min: 0, max: 2000, help: "Priced as its own row when 'What I pay now' is ticked above" },
    {
      key: 'scheduling',
      label: 'Scheduling tool',
      unit: '$/mo',
      section: 'The rest of your stack — optional, and the same whichever vendor wins',
      default: 0,
      min: 0,
      max: 500,
      help: '0 if bundled into report software',
    },
    { key: 'crm', label: 'CRM', unit: '$/mo', default: 0, min: 0, max: 500 },
    { key: 'paymentsPercent', label: 'Payment processing fee', unit: '%', default: 3, min: 0, max: 10, help: 'Percent of card-processed revenue' },
    { key: 'monthlyRevenue', label: 'Monthly revenue processed via card', unit: '$/mo', default: 8000, min: 0, max: 200000 },
    { key: 'website', label: 'Website', unit: '$/mo', default: 69, min: 0, max: 500, help: 'Published inspector-website plans run about $29–$159/mo before setup fees; the default sits mid-range' },
    { key: 'phone', label: 'Phone / answering service', unit: '$/mo', default: 30, min: 0, max: 500 },
    { key: 'ai', label: 'AI tools', unit: '$/mo', default: 0, min: 0, max: 500 },
  ],
  outputs: [
    { key: 'cheapest', label: 'Cheapest of the ones you ticked' },
    { key: 'cheapestMonthly', label: 'That one, per month', unit: '$/mo' },
    { key: 'cheapestAnnual', label: 'That one, per year', unit: '$/yr' },
    { key: 'dearest', label: 'Dearest of the ones you ticked' },
    { key: 'annualDifference', label: 'A year between cheapest and dearest', unit: '$/yr' },
    { key: 'addOnsMonthly', label: 'The rest of your stack, per month', unit: '$/mo' },
    { key: 'cheapestStackAnnual', label: 'Cheapest option plus that stack, per year', unit: '$/yr' },
  ],
  summary:
    'Compare Hive Inspect, Spectora, ISN, HomeGauge, Palm-Tech and Tap Inspect side by side — monthly and annual price for each, at your own volume.',

  formulaText:
    "Tick the products you want priced and each one is billed by its own published model at your inspection count and inspector count: a flat plan charges a base price plus a rate for each additional inspector; a per-inspection plan applies its rate, or its volume tiers, to your monthly count; a per-user plan multiplies by seats. Every ticked product gets a column — per month, per year, and per inspection — ordered cheapest first. Per year = the annual plan when you prepay, otherwise twelve monthly bills. Per inspection = that vendor's monthly bill ÷ inspections per month. The rest of your stack — scheduling, CRM, payment fee % × monthly revenue, website, phone, AI — is added separately, because it costs the same whichever vendor you pick.",

  interpretation:
    'Read the table before the boxes above it. The products do not merely differ in price, they differ in what the price is attached to, and that is what decides which one is cheapest for you rather than in general. Flat per-inspector plans — Hive Inspect, Spectora, HomeGauge, Palm-Tech — cost the same in a dead February as in a frantic June, so their cost per inspection falls as you get busier and they reward volume. Per-inspection pricing does the opposite: ISN and Tap Inspect\'s pay-as-you-go are close to free on a slow month and become the most expensive line in the stack on a good one, which is exactly why they suit a new or part-time inspector and stop suiting a full book. Spectora Advanced sits in both camps, a flat plan with a $4-per-inspection meter bolted on, so it tracks volume even though it looks like a subscription. The practical consequence is that the order of the columns flips as you grow, usually somewhere between fifteen and twenty-five inspections a month, and a plan chosen in your first year is very often the wrong one by your third. Check the ranking again whenever your volume moves by half, and take the per-inspection figure — not the monthly one — into your pricing, because that is the number that sits alongside vehicle and insurance in your cost per inspection. Two things the table cannot tell you: annual prepay only helps where a vendor publishes an annual plan, and a stack running above roughly 5% of revenue is usually carrying two tools that overlap rather than one that is overpriced.',
  assumptions: [
    {
      text: 'Hive Inspect: $99 per inspector per month, or $999 per inspector per year; additional inspectors $69 per month, or $599 per year.',
      source: { citation: 'Hive Inspect — Pricing', url: 'https://hiveinspect.com/pricing', accessed: '2026-09-08' },
    },
    {
      text: 'Spectora: $109 per month or $1,090 per year for the base plan; additional inspectors $99 per month or $999 per year.',
      source: { citation: 'Spectora — Pricing', url: 'https://www.spectora.com/pricing/', accessed: '2026-09-08' },
    },
    {
      text: 'Spectora Advanced is an add-on billed at $4 per inspection on top of the base plan, not a replacement for it, so the "Spectora + Advanced" row carries both charges.',
      source: { citation: 'Spectora — Pricing', url: 'https://www.spectora.com/pricing/', accessed: '2026-09-08' },
    },
    {
      text: "The website default, $69 a month, sits mid-range among the published inspector-website plans rather than following any one vendor. Spectora's Base Website is $69 a month or $699 a year and its Pro Website $159 a month or $1,599 a year. Monthly figures are used throughout because the input is a monthly one: dividing an annual prepay by twelve — $699 ÷ 12 is $58 — puts the discounted rate in a box labelled per month and understates what a month of that website actually bills.",
      source: { citation: 'Spectora — Pricing, Website Add-Ons', url: 'https://www.spectora.com/pricing/', accessed: '2026-09-08' },
    },
    {
      text: "Hive Inspect publishes two website plans on the same page as its software: Basic Maintenance at $29 a month or $249 a year, and SEO Boost + Maintenance at $99 a month or $999 a year, each with a $299 setup fee. Taken with Spectora's two, the published range for an inspector website is roughly $29 to $159 a month before setup, which is the spread the $69 default sits inside.",
      source: { citation: 'Hive Inspect — Pricing, Website Services', url: 'https://hiveinspect.com/pricing', accessed: '2026-09-08' },
    },
    {
      text: 'ISN: $7.25 per inspection for the first 50 each month, $5.50 for inspections 51 to 100, and $3.75 for 101 to 150. ISN charges no separate seat fee, so the ISN row does not move with inspector count.',
      source: { citation: 'Inspection Support Network — Pricing', url: 'https://www.inspectionsupport.com/pricing/', accessed: '2026-09-08' },
    },
    {
      text: "ISN's monthly minimum is $10. The pricing page only warns that \"monthly minimum fees may apply\" without naming a figure; the amount appears in ISN's help centre, in the article listing what an ISN–Porch partnership waives, as \"ISN's $10 monthly minimum fee\". The floor is applied here, so it only changes the bill at one inspection a month — two inspections already bill $14.50.",
      source: { citation: 'Inspection Support Network — Help Centre, Porch Benefits and Customization', url: 'https://help.inspectionsupport.com/en/articles/1393156-porch-benefits-and-customization', accessed: '2026-09-08' },
    },
    {
      text: 'HomeGauge: $89 per month after a 30-day free trial. HomeGauge publishes no additional-inspector rate, so the HomeGauge row is held flat across seat counts rather than guessed at.',
      source: { citation: 'HomeGauge — Software Pricing', url: 'https://www.homegauge.com/one/pricing/', accessed: '2026-09-08' },
    },
    {
      text: 'Palm-Tech: $50 per user per month, or $500 per user per year, with every feature included at either price.',
      source: { citation: 'Palm-Tech — Pricing', url: 'https://www.palmtech.com/pricing/', accessed: '2026-09-08' },
    },
    {
      text: 'Tap Inspect publishes three prices: $7.50 per job pay-as-you-go, sold in blocks of 20 for $150; $90 per month for the Unlimited plan; and an Inspection Team plan headed "$45 / per user". At one inspector the calculator quotes whichever of pay-as-you-go and the $90 plan is cheaper at your volume.',
      source: { citation: 'Tap Inspect — Pricing', url: 'https://www.tapinspect.com/pricing', accessed: '2026-09-08' },
    },
    {
      text: 'On the Team plan the flat fee covers the first inspector and each further inspector adds $45 a month — "you are charged a flat fee for the 1st inspector who is typically the Team Owner ... Each inspector you invite to your Team results in an additional $45 per month on your Subscription." The same article states that pay-as-you-go is cheaper below 12 jobs a month and the Unlimited plan above it, which is exactly where $7.50 per job crosses $90.',
      source: { citation: 'Tap Inspect — Help Centre, About Our Subscription Plans', url: 'https://help.tapinspect.com/hc/en-us/articles/360038266892-About-Our-Subscription-Plans', accessed: '2026-09-08' },
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
    'Setup fees are excluded, and both of the ones known here are charged on a website service rather than on the report software: Spectora asks $499 to set up its Base Website, reduced to $100 if the website is bought annually alongside the software, and $799 on its Pro Website, waived on the same terms; Hive Inspect asks $299 to set up either of its website plans. Neither vendor charges a setup fee on the software subscription itself — Hive Inspect states so plainly — but if you buy a website alongside the software, your first year costs more than the annual figure shown.',
    'Introductory and promotional rates are excluded and every figure is the steady-state price. Hive Inspect\'s first three months run at $39, $59 and $79 before settling at $99, on a plan its pricing page restricts to a single-inspector business, and most vendors offer a free trial.',
    'Two vendors sell reports in a block rather than as a plan, and neither is modelled as a column. Hive Inspect sells a 10 Reports Package for $99, which is $9.90 a report, as a one-time purchase for a single-inspector business rather than a subscription; Tap Inspect sells its pay-as-you-go inspections in blocks of 20 for $150. Both can be cheaper than any monthly plan for someone inspecting occasionally, and both stop being a plan at all once the block runs out, which is why they are named here rather than priced in the table.',
    'Annual prepay assumes twelve months paid up front. Where a vendor publishes no annual plan the annual figure is simply twelve monthly bills, not a discount that vendor offers.',
    'The "what I pay now" row is your own figure and carries no source. It is priced as entered — twelve times the monthly number — and is not adjusted for volume or headcount, because nobody but you knows how your current bill responds to either.',
    'Counts subscription price only. Migration effort, the time spent learning a new tool, and the cost of getting your data out if you leave are real and are not in this figure.',
  ],
  examples: [
    {
      label: 'Solo inspector, 20 inspections/month, Hive Inspect against Spectora and HomeGauge',
      inputs: {
        vendors: DEFAULT_VENDORS, billing: 0, inspectionsPerMonth: 20, inspectors: 1, customSoftware: 0,
        scheduling: 0, crm: 0, paymentsPercent: 3, monthlyRevenue: 8000, website: 69, phone: 30, ai: 0,
      },
    },
    {
      label: 'Three-inspector firm prepaying annually, 60 inspections/month, Hive Inspect against Spectora and ISN',
      inputs: {
        vendors: 1 + 2 + 8, billing: 1, inspectionsPerMonth: 60, inspectors: 3, customSoftware: 0,
        scheduling: 0, crm: 0, paymentsPercent: 3, monthlyRevenue: 24000, website: 69, phone: 30, ai: 0,
      },
    },
  ],
  related: ['home-inspection-software-pricing-calculator', 'cost-per-inspection-calculator', 'startup-cost-planner'],
  datePublished: '2026-09-03',
  dateModified: '2026-09-08',
};

/*
  One priced row per ticked product, cheapest first.

  Everything below reads from this, so the boxes and the table can never
  disagree about which option won: they are the same sort of the same list.
*/
interface PricedRow {
  name: string;
  model: string;
  /* What a year costs under the chosen billing — the sort key. */
  annual: number;
  bit: number;
}

function pricedRows(i: Record<string, number>): PricedRow[] {
  const n = i.inspectionsPerMonth;
  const k = i.inspectors;
  const prepaid = i.billing === 1;
  const mask = i.vendors;

  const rows: PricedRow[] = VENDORS.filter((v) => (mask & v.bit) !== 0).map((v) => ({
    name: v.name,
    /* The caveat only bites once there is more than one seat to price. */
    model: v.seatCaveat && k > 1 ? `${v.model} — ${v.seatCaveat}` : v.model,
    annual: prepaid ? v.annual(n, k) : v.monthly(n, k) * 12,
    bit: v.bit,
  }));

  /*
    The reader's current bill, when they ticked it. Twelve times what they
    typed and nothing more: an outside figure cannot be re-derived at a
    different volume or headcount the way a published model can.
  */
  if ((mask & CUSTOM_BIT) !== 0) {
    rows.push({
      name: 'What I pay now',
      model: 'Your own figure, as entered',
      annual: i.customSoftware * 12,
      bit: CUSTOM_BIT,
    });
  }

  return rows.sort((a, b) => a.annual - b.annual);
}

export function compute(i: Record<string, number>) {
  const rows = pricedRows(i);

  /* Add-ons are outside the comparison on purpose: they are the same number
     under every vendor, so folding them in would shrink every gap equally. */
  const paymentFee = (i.paymentsPercent / 100) * i.monthlyRevenue;
  const addOnsMonthly = i.scheduling + i.crm + paymentFee + i.website + i.phone + i.ai;

  /*
    Reachable only from a hand-edited link that ticks nothing — the widget
    will not untick the last box, and the clamp floors ?vendors= at 1. Answer
    it honestly rather than dividing by an empty list.
  */
  if (rows.length === 0) {
    return {
      cheapest: '—',
      cheapestMonthly: 0,
      cheapestAnnual: 0,
      dearest: '—',
      annualDifference: 0,
      addOnsMonthly: +addOnsMonthly.toFixed(2),
      cheapestStackAnnual: +(addOnsMonthly * 12).toFixed(2),
    };
  }

  const cheapest = rows[0];
  const dearest = rows[rows.length - 1];

  /*
    Prepaying does not change what the year costs per month, it changes what
    the year costs — so the monthly figure under annual billing is the annual
    price spread across twelve, which is what belongs beside a monthly stack.
  */
  const cheapestMonthly = cheapest.annual / 12;

  return {
    cheapest: cheapest.name,
    cheapestMonthly: +cheapestMonthly.toFixed(2),
    cheapestAnnual: +cheapest.annual.toFixed(2),
    /* With one row ticked there is nothing to compare it to, and naming the
       same product as both cheapest and dearest reads as a bug. */
    dearest: rows.length > 1 ? dearest.name : '—',
    annualDifference: +(dearest.annual - cheapest.annual).toFixed(2),
    addOnsMonthly: +addOnsMonthly.toFixed(2),
    cheapestStackAnnual: +((cheapestMonthly + addOnsMonthly) * 12).toFixed(2),
  };
}

const whole = (n: number) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
const cents = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/*
  The comparison itself: one column per ticked product, cheapest column first
  and marked, read across like a spec sheet.

  Rows, not columns, was the first cut of this table, and it was the wrong way
  round. A reader comparing three products wants them beside each other with the
  figures lining up underneath — "Hive $99, Spectora $109, HomeGauge $89" on one
  line — not stacked in a list they have to read down and hold in their head.

  Report software only — the website, phone and card-processing lines are
  identical whichever vendor you pick, so folding them in here would add the
  same number to every column and make the gaps look smaller than they are.
*/
export function computeTable(i: Record<string, number>): ResultTable {
  const rows = pricedRows(i);
  const n = i.inspectionsPerMonth;
  const k = i.inspectors;
  const seats = `${k} inspector${k === 1 ? '' : 's'}`;

  /* Column 0 holds the row labels, so a product's column is its index + 1. */
  const cheapestColumn = rows.length > 0 ? 1 : undefined;

  return {
    caption: i.billing === 1
      ? `Prepaid annually at ${n} inspections/mo, ${seats}`
      : `Billed monthly at ${n} inspections/mo, ${seats}`,
    columns: ['', ...rows.map((r) => r.name)],
    rows: [
      { cells: ['Per month', ...rows.map((r) => whole(r.annual / 12))] },
      { cells: ['Per year', ...rows.map((r) => whole(r.annual))] },
      { cells: ['Per inspection', ...rows.map((r) => cents(r.annual / 12 / n))] },
      { cells: ["How it's priced", ...rows.map((r) => r.model)], prose: true },
    ],
    selectedColumn: cheapestColumn,
    selectedLabel: 'cheapest',
    note: 'Cheapest first, left to right, and highlighted. Report software only, rounded to the dollar — list prices, see the sources table below.',
  };
}
