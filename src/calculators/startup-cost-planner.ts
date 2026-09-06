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
    'Total cash needed, not total startup cost, is the number to raise or save before quitting a job. The working capital reserve is what carries you through the months before referral flow builds, and three months is optimistic for a business whose first year depends on agent relationships that do not exist yet. Licensing and insurance defaults are illustrative — replace both with real quotes for your state before committing to the figure.',
  assumptions: [
    { text: "The default software cost uses Spectora's published monthly report-writing software plan, used as one realistic starting point for an inspector's own numbers.",
      source: { citation: 'Spectora — Pricing', url: 'https://www.spectora.com/pricing/', accessed: '2026-09-03' } },
  ],
  limitations: [
    "Licensing fees vary by state and change without notice; the default is illustrative only — confirm the current fee with your state's regulator before budgeting.",
    'Insurance premiums vary by state, coverage limits, and claims history; get a real quote rather than relying on the default.',
  ],
  examples: [{ label: 'Typical solo startup', inputs: { equipmentCost: 3000, insuranceCost: 2500, trainingCost: 1500, licensingCost: 300, softwareCost: 1308, marketingCost: 2000, workingCapitalMonths: 3, monthlyOverhead: 3000 } }],
  related: ['inspection-business-profitability-calculator', 'software-tco-calculator'],
  datePublished: '2026-09-03', dateModified: '2026-09-03',
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
