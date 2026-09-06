import type { CalculatorRecord } from '@/lib/calculator-schema';

export const record: CalculatorRecord = {
  slug: 'inspection-business-profitability-calculator',
  title: 'Inspection Business Profitability Calculator',
  category: 'business',
  definition: "The inspection business profitability calculator estimates a home inspection company's annual net profit and effective hourly rate from overhead, desired owner pay, booking capacity, average ticket price, add-on revenue, and the on-site, drive and report time behind each job.",
  inputs: [
    { key: 'overheadPerYear', label: 'Annual business overhead', unit: '$/yr', default: 40000, min: 0, max: 500000 },
    { key: 'desiredOwnerPay', label: 'Desired owner pay', unit: '$/yr', default: 90000, min: 0, max: 500000 },
    { key: 'billableDaysPerWeek', label: 'Billable days per week', default: 4, min: 1, max: 7 },
    { key: 'weeksWorkedPerYear', label: 'Weeks worked per year', default: 48, min: 20, max: 52, help: 'Accounts for vacation, holidays, and slow season' },
    { key: 'inspectionsPerDay', label: 'Inspections per day', default: 1.5, min: 0.5, max: 5, step: 0.5 },
    { key: 'avgTicket', label: 'Average ticket price', unit: '$', default: 450, min: 100, max: 2000 },
    { key: 'addOnRate', label: 'Add-on attach rate', unit: '%', default: 20, min: 0, max: 100, help: 'Ancillary-service revenue (radon, sewer scope, etc.) as a percent of ticket' },
    { key: 'avgOnSiteMin', label: 'Average time on site per job', unit: 'min', default: 150, min: 0, max: 480, help: 'Walking the property, not drive or report time' },
    { key: 'avgDriveMin', label: 'Average drive time per job', unit: 'min', default: 30, min: 0, max: 180 },
    { key: 'avgReportMin', label: 'Average report-writing time per job', unit: 'min', default: 45, min: 0, max: 240 },
  ],
  outputs: [
    { key: 'jobsPerYear', label: 'Jobs per year' },
    { key: 'revenue', label: 'Annual revenue', unit: '$' },
    { key: 'netProfit', label: 'Net profit', unit: '$' },
    { key: 'hoursPerYear', label: 'Working hours per year', unit: 'hr' },
    { key: 'effectiveHourlyRate', label: 'Effective hourly rate', unit: '$/hr' },
    { key: 'breakEvenTicket', label: 'Break-even ticket price', unit: '$' },
  ],
  summary:
    'Estimate your annual net profit, true hourly rate and break-even ticket from overhead, capacity and average ticket.',

  formulaText: 'Jobs/year = inspections/day × billable days/week × weeks worked/year. Revenue = jobs/year × average ticket × (1 + add-on rate). Net profit = revenue − annual overhead − desired owner pay. Working hours = jobs/year × (on-site + drive + report minutes) ÷ 60. Effective hourly rate = (net profit + desired owner pay) ÷ working hours — what the owner\u2019s own time actually earns, before the business\u2019s profit on top. Break-even ticket = (overhead + desired owner pay) ÷ jobs/year.',

  interpretation:
    'Net profit is what is left after you have already paid yourself the owner pay you entered, so a small positive number is a healthy business, not a failing one. The effective hourly rate is the figure to act on: it is what your own time earns across every hour a job consumes, so compare it against what you could earn working for someone else. If it is close, the problem is either the ticket price or the hours each job takes. Break-even ticket is your walk-away price.',
  assumptions: [
    { text: 'Annual overhead is assumed to already include vehicle costs. Inspectors estimating their own vehicle expense can benchmark against the IRS standard business mileage rate.',
      source: { citation: 'IRS — Standard Mileage Rates: 76¢/mile for business use, effective July 1, 2026', url: 'https://www.irs.gov/tax-professionals/standard-mileage-rates', accessed: '2026-09-03' } },
  ],
  limitations: [
    'Effective hourly rate divides what the owner takes home — owner pay plus the profit left after it — by every hour the job consumes, including time on site. It is what the owner\u2019s own labour earns, not the business\u2019s margin on a job.',
    'Working hours count inspection, drive and report time only. Marketing, scheduling, bookkeeping and callbacks are real hours that this figure does not include, so the true rate is lower than shown.',
    'Assumes every job earns the same average ticket; a real mix of property sizes and add-ons will change the actual result.',
  ],
  examples: [{ label: 'Solo inspector, ~6 jobs/week', inputs: { overheadPerYear: 40000, desiredOwnerPay: 90000, billableDaysPerWeek: 4, weeksWorkedPerYear: 48, inspectionsPerDay: 1.5, avgTicket: 450, addOnRate: 20, avgOnSiteMin: 150, avgDriveMin: 30, avgReportMin: 45 } }],
  related: ['revenue-goal-calculator', 'cost-per-inspection-calculator'],
  datePublished: '2026-09-03', dateModified: '2026-09-03',
};

export function compute(i: Record<string, number>) {
  const jobsPerYear = i.inspectionsPerDay * i.billableDaysPerWeek * i.weeksWorkedPerYear;
  const revenue = jobsPerYear * i.avgTicket * (1 + i.addOnRate / 100);
  const netProfit = revenue - i.overheadPerYear - i.desiredOwnerPay;
  /*
    Hours count every minute a job consumes, on-site time included. The earlier
    version divided REVENUE by drive plus report time only, which reported $432/hr
    on the default inputs — a figure no working inspector would believe, and one
    that discredits every other number on the page.
  */
  const totalHours = (jobsPerYear * (i.avgOnSiteMin + i.avgDriveMin + i.avgReportMin)) / 60;
  // What the owner's own time earns: their pay plus whatever profit is left after it.
  const ownerTakeHome = i.desiredOwnerPay + netProfit;
  const effectiveHourlyRate = totalHours > 0 ? ownerTakeHome / totalHours : 0;
  const breakEvenTicket = jobsPerYear > 0 ? (i.overheadPerYear + i.desiredOwnerPay) / jobsPerYear : 0;
  return {
    jobsPerYear: +jobsPerYear.toFixed(1),
    hoursPerYear: +totalHours.toFixed(0),
    revenue: +revenue.toFixed(2),
    netProfit: +netProfit.toFixed(2),
    effectiveHourlyRate: +effectiveHourlyRate.toFixed(2),
    breakEvenTicket: +breakEvenTicket.toFixed(2),
  };
}
