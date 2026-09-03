import type { CalculatorRecord } from '@/lib/calculator-schema';

export const record: CalculatorRecord = {
  slug: 'inspection-business-profitability-calculator',
  title: 'Inspection Business Profitability Calculator',
  category: 'business',
  definition: "The inspection business profitability calculator estimates a home inspection company's annual net profit and effective hourly rate from overhead, desired owner pay, booking capacity, average ticket price, add-on revenue, and the drive and report time behind each job.",
  inputs: [
    { key: 'overheadPerYear', label: 'Annual business overhead', unit: '$/yr', default: 40000, min: 0, max: 500000 },
    { key: 'desiredOwnerPay', label: 'Desired owner pay', unit: '$/yr', default: 90000, min: 0, max: 500000 },
    { key: 'billableDaysPerWeek', label: 'Billable days per week', default: 4, min: 1, max: 7 },
    { key: 'weeksWorkedPerYear', label: 'Weeks worked per year', default: 48, min: 20, max: 52, help: 'Accounts for vacation, holidays, and slow season' },
    { key: 'inspectionsPerDay', label: 'Inspections per day', default: 1.5, min: 0.5, max: 5, step: 0.5 },
    { key: 'avgTicket', label: 'Average ticket price', unit: '$', default: 450, min: 100, max: 2000 },
    { key: 'addOnRate', label: 'Add-on attach rate', unit: '%', default: 20, min: 0, max: 100, help: 'Ancillary-service revenue (radon, sewer scope, etc.) as a percent of ticket' },
    { key: 'avgDriveMin', label: 'Average drive time per job', unit: 'min', default: 30, min: 0, max: 180 },
    { key: 'avgReportMin', label: 'Average report-writing time per job', unit: 'min', default: 45, min: 0, max: 240 },
  ],
  outputs: [
    { key: 'jobsPerYear', label: 'Jobs per year' },
    { key: 'revenue', label: 'Annual revenue', unit: '$' },
    { key: 'netProfit', label: 'Net profit', unit: '$' },
    { key: 'effectiveHourlyRate', label: 'Effective hourly rate (drive + report time)', unit: '$/hr' },
    { key: 'breakEvenTicket', label: 'Break-even ticket price', unit: '$' },
  ],
  formulaText: 'Jobs/year = inspections/day × billable days/week × weeks worked/year. Revenue = jobs/year × average ticket × (1 + add-on rate). Net profit = revenue − annual overhead − desired owner pay. Effective hourly rate = revenue ÷ (jobs/year × (drive + report minutes) ÷ 60). Break-even ticket = (overhead + desired owner pay) ÷ jobs/year.',
  assumptions: [
    { text: 'Annual overhead is assumed to already include vehicle costs. Inspectors estimating their own vehicle expense can benchmark against the IRS standard business mileage rate.',
      source: { citation: 'IRS — Standard Mileage Rates: 76¢/mile for business use, effective July 1, 2026', url: 'https://www.irs.gov/tax-professionals/standard-mileage-rates', accessed: '2026-09-03' } },
  ],
  limitations: [
    'Effective hourly rate is calculated from drive and report time only; it does not separately track on-site inspection time, which this tool does not collect as an input.',
    'Assumes every job earns the same average ticket; a real mix of property sizes and add-ons will change the actual result.',
  ],
  examples: [{ label: 'Solo inspector, ~6 jobs/week', inputs: { overheadPerYear: 40000, desiredOwnerPay: 90000, billableDaysPerWeek: 4, weeksWorkedPerYear: 48, inspectionsPerDay: 1.5, avgTicket: 450, addOnRate: 20, avgDriveMin: 30, avgReportMin: 45 } }],
  related: ['revenue-goal-calculator', 'cost-per-inspection-calculator'],
  datePublished: '2026-09-03', dateModified: '2026-09-03',
};

export function compute(i: Record<string, number>) {
  const jobsPerYear = i.inspectionsPerDay * i.billableDaysPerWeek * i.weeksWorkedPerYear;
  const revenue = jobsPerYear * i.avgTicket * (1 + i.addOnRate / 100);
  const netProfit = revenue - i.overheadPerYear - i.desiredOwnerPay;
  const totalHours = (jobsPerYear * (i.avgDriveMin + i.avgReportMin)) / 60;
  const effectiveHourlyRate = totalHours > 0 ? revenue / totalHours : 0;
  const breakEvenTicket = jobsPerYear > 0 ? (i.overheadPerYear + i.desiredOwnerPay) / jobsPerYear : 0;
  return {
    jobsPerYear: +jobsPerYear.toFixed(1),
    revenue: +revenue.toFixed(2),
    netProfit: +netProfit.toFixed(2),
    effectiveHourlyRate: +effectiveHourlyRate.toFixed(2),
    breakEvenTicket: +breakEvenTicket.toFixed(2),
  };
}
