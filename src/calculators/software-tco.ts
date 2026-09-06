import type { CalculatorRecord } from '@/lib/calculator-schema';

export const record: CalculatorRecord = {
  slug: 'software-tco-calculator',
  title: 'Software Total Cost of Ownership Calculator',
  category: 'pricing',
  definition: 'The software total cost of ownership calculator adds up every recurring tool a home inspection business pays for, including report software, scheduling, CRM, payments processing, website, phone, and AI, into one true annual spend and a per-inspection cost.',
  inputs: [
    { key: 'reportSoftware', label: 'Report software', unit: '$/mo', default: 109, min: 0, max: 1000, help: "Default is Spectora's published monthly plan" },
    { key: 'scheduling', label: 'Scheduling tool', unit: '$/mo', default: 0, min: 0, max: 500, help: '0 if bundled into report software' },
    { key: 'crm', label: 'CRM', unit: '$/mo', default: 0, min: 0, max: 500 },
    { key: 'paymentsPercent', label: 'Payment processing fee', unit: '%', default: 3, min: 0, max: 10, help: 'Percent of card-processed revenue' },
    { key: 'monthlyRevenue', label: 'Monthly revenue processed via card', unit: '$/mo', default: 8000, min: 0, max: 200000 },
    { key: 'website', label: 'Website', unit: '$/mo', default: 58, min: 0, max: 500, help: "Default is Spectora's Base Website plan, $699/yr ÷ 12" },
    { key: 'phone', label: 'Phone / answering service', unit: '$/mo', default: 30, min: 0, max: 500 },
    { key: 'ai', label: 'AI tools', unit: '$/mo', default: 0, min: 0, max: 500 },
    { key: 'extraSeats', label: 'Extra inspector seats', unit: '$/mo', default: 0, min: 0, max: 2000, help: "Default reference is Spectora's $99/mo per additional inspector" },
    { key: 'inspectionsPerMonth', label: 'Inspections per month', default: 20, min: 1, max: 200 },
  ],
  outputs: [
    { key: 'trueAnnualSoftwareSpend', label: 'True annual software spend', unit: '$/yr' },
    { key: 'monthlyTotal', label: 'Monthly software total', unit: '$/mo' },
    { key: 'perInspectionSoftwareCost', label: 'Software cost per inspection', unit: '$' },
  ],
  summary:
    'Add up every recurring tool your inspection business pays for and see the true annual spend and cost per inspection.',

  formulaText: 'Monthly total = report software + scheduling + CRM + (payment fee % × monthly revenue) + website + phone + AI + extra seats. True annual software spend = monthly total × 12. Per-inspection software cost = monthly total ÷ inspections per month.',

  interpretation:
    'The per-inspection figure is the one to carry into pricing — it belongs in your cost per inspection alongside vehicle and insurance. Payment processing is usually the line that surprises people, because a percentage of revenue scales with growth while every other line is flat. If total software is running above roughly 5% of revenue, look for tools that overlap before you look for cheaper ones. The split between the two kinds of line is what makes this worth totalling rather than eyeballing. Everything except card processing is a subscription that bills identically whether you inspect eight houses in a month or forty, so the annual spend in the table below never moves while the per-inspection cost falls by a factor of five. Card processing behaves the opposite way: it is invisible on a slow month and becomes one of the larger lines on a good one. The practical read is that a stack which looks expensive at low volume is usually a volume problem rather than a tooling problem, and that the saving from consolidating overlapping subscriptions is permanent in a way that haggling over one plan is not. Count the tools you forget, too \u2014 the domain, the scheduling add-on, the e-signature service and the accounting subscription rarely appear in the mental total most people carry and are often a quarter of it.',
  assumptions: [
    { text: "Default values for report software and website are Spectora's published monthly plan and Base Website add-on prices, used only as realistic starting points for an inspector's own numbers.",
      source: { citation: 'Spectora — Pricing', url: 'https://www.spectora.com/pricing/', accessed: '2026-09-03' } },
  ],
  referenceTable: {
    caption: 'Software cost per inspection as volume changes, on an unchanged $437/month stack',
    columns: ['Inspections per month', 'Monthly software total', 'True annual spend', 'Cost per inspection'],
    rows: [
      ['8', '$437.00', '$5,244.00', '$54.63'],
      ['12', '$437.00', '$5,244.00', '$36.42'],
      ['20', '$437.00', '$5,244.00', '$21.85'],
      ['30', '$437.00', '$5,244.00', '$14.57'],
      ['40', '$437.00', '$5,244.00', '$10.93'],
    ],
    note: 'Produced by this calculator from the default stack \u2014 $109 report software, $58 website, $30 phone and 3% card processing on $8,000 of monthly revenue \u2014 holding revenue constant so only the inspection count moves. The monthly and annual totals never change, which is the point: the whole of the per-inspection saving comes from volume, not from spending less.',
  },
  limitations: [
    'Uses one flat payment-processing percentage; actual card-processing rates vary by processor and card type.',
    'Every input is editable — the defaults are one real vendor\'s published prices, not a recommendation to use that vendor.',
    'Counts subscription price only. Migration effort, the time spent learning a tool and the cost of exporting your data if you leave are real and are not in this figure.',
    'Annual and monthly billing are entered as one monthly number, so a plan prepaid yearly at a discount has to be divided by twelve before it goes in.',
  ],
  examples: [{ label: 'Solo inspector, Spectora + website', inputs: { reportSoftware: 109, scheduling: 0, crm: 0, paymentsPercent: 3, monthlyRevenue: 8000, website: 58, phone: 30, ai: 0, extraSeats: 0, inspectionsPerMonth: 20 } }],
  related: ['startup-cost-planner', 'cost-per-inspection-calculator'],
  datePublished: '2026-09-03', dateModified: '2026-09-07',
};

export function compute(i: Record<string, number>) {
  const paymentFee = (i.paymentsPercent / 100) * i.monthlyRevenue;
  const monthlyTotal = i.reportSoftware + i.scheduling + i.crm + paymentFee + i.website + i.phone + i.ai + i.extraSeats;
  const trueAnnualSoftwareSpend = monthlyTotal * 12;
  const perInspectionSoftwareCost = i.inspectionsPerMonth > 0 ? monthlyTotal / i.inspectionsPerMonth : 0;
  return {
    trueAnnualSoftwareSpend: +trueAnnualSoftwareSpend.toFixed(2),
    monthlyTotal: +monthlyTotal.toFixed(2),
    perInspectionSoftwareCost: +perInspectionSoftwareCost.toFixed(2),
  };
}
