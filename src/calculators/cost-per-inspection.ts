import type { CalculatorRecord } from '@/lib/calculator-schema';

export const record: CalculatorRecord = {
  slug: 'cost-per-inspection-calculator',
  title: 'Cost Per Inspection Calculator',
  category: 'pricing',
  definition: "The cost per inspection calculator divides a home inspection company's total monthly operating costs by the number of inspections completed that month to show the fully loaded cost of a single job and the margin left at a given ticket price.",
  inputs: [
    { key: 'monthlyCosts', label: 'Total monthly operating costs', unit: '$/mo', default: 6000, min: 0, max: 100000, help: 'Software, insurance ÷ 12, vehicle, marketing, admin, and any staff pay' },
    { key: 'inspectionsPerMonth', label: 'Inspections completed per month', default: 20, min: 1, max: 200 },
    { key: 'avgTicket', label: 'Average ticket price', unit: '$', default: 450, min: 0, max: 2000 },
  ],
  outputs: [
    { key: 'costPerInspection', label: 'Fully loaded cost per inspection', unit: '$' },
    { key: 'marginPerInspection', label: 'Margin per inspection', unit: '$' },
    { key: 'marginPercent', label: 'Margin percent', unit: '%' },
  ],
  summary:
    'Divide your monthly operating costs by the inspections you completed to see what a single job actually costs you to deliver.',

  formulaText: 'Cost per inspection = total monthly operating costs ÷ inspections per month. Margin per inspection = average ticket − cost per inspection. Margin percent = margin per inspection ÷ average ticket.',

  interpretation:
    'Cost per inspection is your floor. Any ticket below it loses money on every job no matter how busy you are. Read the margin percent rather than the dollar margin: below about 30% a single slow month or one insurance claim wipes out the year. If the number surprises you, the usual cause is counting only software and insurance while leaving out vehicle, phone and your own unpaid admin hours.',
  assumptions: [
    { text: "Default monthly operating costs use Spectora's published software plan as one representative cost line among the categories an inspector should total.",
      source: { citation: 'Spectora — Pricing', url: 'https://www.spectora.com/pricing/', accessed: '2026-09-03' } },
  ],
  limitations: [
    'Treats every inspection as costing the same amount; unusually large or far-away properties will have a higher true cost than this average.',
    'Does not separate fixed costs (software, insurance) from variable costs (mileage, consumables) — both are entered together as monthly operating costs.',
  ],
  examples: [{ label: '20 inspections/month, $6,000 costs', inputs: { monthlyCosts: 6000, inspectionsPerMonth: 20, avgTicket: 450 } }],
  related: ['inspection-business-profitability-calculator', 'software-tco-calculator'],
  datePublished: '2026-09-03', dateModified: '2026-09-03',
};

export function compute(i: Record<string, number>) {
  const costPerInspection = i.monthlyCosts / i.inspectionsPerMonth;
  const marginPerInspection = i.avgTicket - costPerInspection;
  const marginPercent = i.avgTicket > 0 ? (marginPerInspection / i.avgTicket) * 100 : 0;
  return {
    costPerInspection: +costPerInspection.toFixed(2),
    marginPerInspection: +marginPerInspection.toFixed(2),
    marginPercent: +marginPercent.toFixed(1),
  };
}
