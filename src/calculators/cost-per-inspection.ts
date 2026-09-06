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
    'Cost per inspection is your floor. Any ticket below it loses money on every job no matter how busy you are. Read the margin percent rather than the dollar margin: below about 30% a single slow month or one insurance claim wipes out the year. If the number surprises you, the usual cause is counting only software and insurance while leaving out vehicle, phone and your own unpaid admin hours. What the table below shows is that the figure is mostly a statement about volume, not about spending. The same $6,000 of monthly cost is $750 a job at eight inspections and $200 a job at thirty, because almost every line in an inspection business is fixed: the software bills the same whether you work or not, and so do insurance, the vehicle and the phone. That has a practical consequence when the month goes badly. Cutting costs in a slow month moves the number far less than the slow month itself did, so the recovery is nearly always booking rather than trimming. It also means the figure is only honest if you run it on a normal month rather than your best one \u2014 and if you pay yourself, your own salary belongs in the costs, otherwise the margin you are reading is really your wage wearing a different name.',
  assumptions: [
    { text: "Default monthly operating costs use Spectora's published software plan as one representative cost line among the categories an inspector should total.",
      source: { citation: 'Spectora — Pricing', url: 'https://www.spectora.com/pricing/', accessed: '2026-09-03' } },
  ],
  referenceTable: {
    caption: 'Cost and margin per inspection at $6,000 of monthly costs and a $450 ticket',
    columns: ['Inspections per month', 'Cost per inspection', 'Margin per inspection', 'Margin percent'],
    rows: [
      ['8', '$750.00', '\u2212$300.00', '\u221266.7%'],
      ['12', '$500.00', '\u2212$50.00', '\u221211.1%'],
      ['16', '$375.00', '$75.00', '16.7%'],
      ['20', '$300.00', '$150.00', '33.3%'],
      ['25', '$240.00', '$210.00', '46.7%'],
      ['30', '$200.00', '$250.00', '55.6%'],
      ['40', '$150.00', '$300.00', '66.7%'],
    ],
    note: 'Produced by this calculator, holding monthly costs at $6,000 and the ticket at $450. Break-even falls at 13.3 inspections a month: below that the ticket does not cover the cost of delivering it. Your own figures will differ \u2014 the shape of the curve is the point, not these numbers.',
  },
  limitations: [
    'Treats every inspection as costing the same amount; unusually large or far-away properties will have a higher true cost than this average.',
    'Does not separate fixed costs (software, insurance) from variable costs (mileage, consumables) — both are entered together as monthly operating costs.',
    'Counts only the costs you enter. If you do not pay yourself a salary and leave it out, the margin shown is your wage rather than profit.',
    'Uses a single average ticket. Where ancillary services carry a different margin from the base inspection, run them separately rather than blending them into one average.',
  ],
  examples: [{ label: '20 inspections/month, $6,000 costs', inputs: { monthlyCosts: 6000, inspectionsPerMonth: 20, avgTicket: 450 } }],
  related: ['inspection-business-profitability-calculator', 'software-tco-calculator'],
  datePublished: '2026-09-03', dateModified: '2026-09-07',
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
