import type { CalculatorRecord } from '@/lib/calculator-schema';

export const record: CalculatorRecord = {
  slug: 'startup-cost-planner',
  title: 'Home Inspection Startup Cost Planner',
  category: 'business',
  definition: 'The startup cost planner totals the one-time and first-year costs of launching a home inspection business, including equipment, insurance, training, licensing, software, and marketing, then estimates the working capital needed to cover overhead until the business breaks even.',
  inputs: [
    { key: 'equipmentCost', label: 'Equipment (moisture meter, ladder, camera, etc.)', unit: '$', default: 3000, min: 0, max: 50000 },
    { key: 'insuranceCost', label: 'E&O + General Liability insurance', unit: '$/yr', default: 2500, min: 0, max: 20000 },
    { key: 'trainingCost', label: 'Training and exam fees', unit: '$', default: 1500, min: 0, max: 20000 },
    { key: 'licensingCost', label: 'State licensing / application fees', unit: '$', default: 300, min: 0, max: 5000, help: "Varies by state — this default is illustrative; confirm your state's current fee" },
    { key: 'softwareCost', label: 'Inspection software', unit: '$/yr', default: 1308, min: 0, max: 20000, help: "Default is Spectora's published monthly plan × 12" },
    { key: 'marketingCost', label: 'Launch marketing budget', unit: '$', default: 2000, min: 0, max: 50000 },
    { key: 'workingCapitalMonths', label: 'Working capital to hold in reserve', unit: 'months', default: 3, min: 0, max: 12 },
    { key: 'monthlyOverhead', label: 'Estimated monthly overhead once operating', unit: '$/mo', default: 3000, min: 0, max: 50000 },
  ],
  outputs: [
    { key: 'totalStartupCost', label: 'Total startup cost', unit: '$' },
    { key: 'monthlyBurn', label: 'Monthly burn once operating', unit: '$/mo' },
    { key: 'workingCapitalReserve', label: 'Working capital reserve', unit: '$' },
    { key: 'totalCashNeeded', label: 'Total cash needed to launch', unit: '$' },
  ],
  summary:
    'Total the one-time and first-year costs of launching an inspection business, plus the working capital to survive it.',

  formulaText: 'Total startup cost = equipment + insurance + training + licensing + software + marketing. Working capital reserve = monthly overhead × working capital months. Total cash needed = total startup cost + working capital reserve.',

  interpretation:
    'Total cash needed, not total startup cost, is the number to raise or save before quitting a job. The working capital reserve is what carries you through the months before referral flow builds, and three months is optimistic for a business whose first year depends on agent relationships that do not exist yet. Licensing and insurance defaults are illustrative — replace both with real quotes for your state before committing to the figure. The table below shows why the reserve, not the kit, is the decision. Equipment, training, licensing and a launch budget land near $10,600 and barely move; the reserve swings from nothing to $36,000 depending only on how many months you decide to survive without revenue. That is the line most new inspectors set too low, because it is the only one that buys nothing visible. Two things make it larger than it looks. Inspections are paid at or near the job, but the referral relationships that produce them take months to build, so early revenue arrives in ones and twos rather than as a ramp. And the reserve has to cover your household, not just the business, unless something else is paying the mortgage. If the total is out of reach, the honest lever is starting part-time while employed rather than shortening the reserve \u2014 the reserve is what stops a slow third month from forcing you to take work at a price you cannot repeat.',
  assumptions: [
    { text: "The default software cost uses Spectora's published monthly report-writing software plan, used as one realistic starting point for an inspector's own numbers.",
      source: { citation: 'Spectora — Pricing', url: 'https://www.spectora.com/pricing/', accessed: '2026-09-03' } },
  ],
  referenceTable: {
    caption: 'Total cash needed as the working capital reserve changes',
    columns: ['Months of reserve', 'Startup cost', 'Working capital reserve', 'Total cash needed'],
    rows: [
      ['0', '$10,608', '$0', '$10,608'],
      ['1', '$10,608', '$3,000', '$13,608'],
      ['3', '$10,608', '$9,000', '$19,608'],
      ['6', '$10,608', '$18,000', '$28,608'],
      ['12', '$10,608', '$36,000', '$46,608'],
    ],
    note: 'Produced by this calculator from the default inputs, with $3,000 of monthly overhead and only the reserve changing. Startup cost is fixed across every row; the reserve is the whole of the difference, which is why it is the number worth arguing about.',
  },
  limitations: [
    "Licensing fees vary by state and change without notice; the default is illustrative only — confirm the current fee with your state's regulator before budgeting.",
    'Insurance premiums vary by state, coverage limits, and claims history; get a real quote rather than relying on the default.',
    'Covers business costs only. Household expenses during the same months are not in the reserve unless you add them to monthly overhead.',
    'Assumes no revenue at all during the reserve period, which is deliberately pessimistic. Early jobs shorten the runway, but they arrive unpredictably enough that budgeting on them is how the reserve gets set too low.',
    'Excludes a vehicle purchase or lease, which for some inspectors is the largest single startup line. Add it to equipment if it applies.',
  ],
  examples: [{ label: 'Typical solo startup', inputs: { equipmentCost: 3000, insuranceCost: 2500, trainingCost: 1500, licensingCost: 300, softwareCost: 1308, marketingCost: 2000, workingCapitalMonths: 3, monthlyOverhead: 3000 } }],
  related: ['inspection-business-profitability-calculator', 'software-tco-calculator'],
  datePublished: '2026-09-03', dateModified: '2026-09-07',
};

export function compute(i: Record<string, number>) {
  const totalStartupCost = i.equipmentCost + i.insuranceCost + i.trainingCost + i.licensingCost + i.softwareCost + i.marketingCost;
  const workingCapitalReserve = i.monthlyOverhead * i.workingCapitalMonths;
  const totalCashNeeded = totalStartupCost + workingCapitalReserve;
  return {
    totalStartupCost: +totalStartupCost.toFixed(2),
    monthlyBurn: +i.monthlyOverhead.toFixed(2),
    workingCapitalReserve: +workingCapitalReserve.toFixed(2),
    totalCashNeeded: +totalCashNeeded.toFixed(2),
  };
}
