import type { CalculatorRecord } from '@/lib/calculator-schema';

export const record: CalculatorRecord = {
  slug: 'revenue-goal-calculator',
  title: 'Revenue Goal to Inspections Needed Calculator',
  category: 'business',
  definition: 'The revenue goal calculator converts a target annual income into the number of inspections, jobs per week, and required hourly yield a solo inspector needs to reach it, given an average ticket price and the working hours behind each job.',
  inputs: [
    { key: 'targetIncome', label: 'Target annual income', unit: '$/yr', default: 150000, min: 0, max: 1000000 },
    { key: 'avgTicket', label: 'Average ticket price', unit: '$', default: 550, min: 100, max: 2000 },
    { key: 'daysPerWeek', label: 'Working days per week', default: 4, min: 1, max: 7 },
    { key: 'hoursPerJob', label: 'Hours per job (incl. drive + report)', unit: 'hrs', default: 3, min: 0.5, max: 12, step: 0.5 },
    { key: 'hoursPerWorkday', label: 'Hours available per workday', unit: 'hrs', default: 8, min: 1, max: 16, help: 'Used to estimate maximum weekly job capacity' },
    { key: 'weeksWorkedPerYear', label: 'Weeks worked per year', default: 48, min: 20, max: 52 },
  ],
  outputs: [
    { key: 'jobsPerYear', label: 'Jobs needed per year' },
    { key: 'jobsPerWeek', label: 'Jobs needed per week' },
    { key: 'requiredHourlyYield', label: 'Required hourly yield', unit: '$/hr' },
    { key: 'capacityGap', label: 'Capacity gap (needed vs. available jobs/week)' },
  ],
  summary:
    'Turn a target annual income into the number of inspections and the weekly pace a solo inspector needs to hit it.',

  formulaText: 'Jobs/year = target income ÷ average ticket. Jobs/week = jobs/year ÷ weeks worked/year. Required hourly yield = average ticket ÷ hours per job. Capacity gap = jobs/week needed − maximum jobs/week at the stated working days and hours per workday.',

  interpretation:
    'The capacity gap is the number that matters. A positive gap means the goal fits inside the schedule you described; a negative gap means it does not, and no amount of effort closes it — you have to raise the ticket, add add-on services, or add an inspector. Treat jobs per week as a booking target and check it against your actual booked weeks rather than your best one.',
  assumptions: [
    {
      text: 'Required hourly yield is revenue divided by the hours worked to produce it, and capacity is the jobs a stated schedule can physically hold. Both are definitional arithmetic on the numbers entered, not a figure taken from any outside authority.',
      source: {
        citation: 'Derived \u2014 definitional arithmetic on user-entered figures',
        derivation:
          'Every output is a direct division or subtraction of the inputs, with no constant, rate or table taken from elsewhere. Jobs per year is the target income divided by the average ticket. Jobs per week is that figure divided by the weeks worked. Required hourly yield is the average ticket divided by the hours each job consumes. Capacity gap subtracts the jobs per week needed from the jobs per week the stated working days and hours can hold. There is nothing here to cite because there is no external claim: change an input and the arithmetic follows it exactly.',
      },
    },
  ],
  limitations: [
    'Assumes every job earns the same average ticket; a real mix of property sizes will shift the actual number of jobs needed.',
    'Capacity is estimated from stated working days and hours per workday, not from an actual booked schedule.',
  ],
  examples: [{ label: '$150k target, $550 ticket', inputs: { targetIncome: 150000, avgTicket: 550, daysPerWeek: 4, hoursPerJob: 3, hoursPerWorkday: 8, weeksWorkedPerYear: 48 } }],
  related: ['inspection-business-profitability-calculator'],
  datePublished: '2026-09-03', dateModified: '2026-09-03',
};

export function compute(i: Record<string, number>) {
  const jobsPerYear = i.targetIncome / i.avgTicket;
  const jobsPerWeek = jobsPerYear / i.weeksWorkedPerYear;
  const requiredHourlyYield = i.avgTicket / i.hoursPerJob;
  const maxJobsPerWeek = i.daysPerWeek * Math.floor(i.hoursPerWorkday / i.hoursPerJob);
  const capacityGap = jobsPerWeek - maxJobsPerWeek;
  return {
    jobsPerYear: +jobsPerYear.toFixed(1),
    jobsPerWeek: +jobsPerWeek.toFixed(2),
    requiredHourlyYield: +requiredHourlyYield.toFixed(2),
    capacityGap: +capacityGap.toFixed(2),
  };
}
