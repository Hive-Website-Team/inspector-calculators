import type { CalculatorRecord } from '@/lib/calculator-schema';

import * as inspectionBusinessProfitability from './inspection-business-profitability';
import * as revenueGoal from './revenue-goal';
import * as startupCostPlanner from './startup-cost-planner';
import * as costPerInspection from './cost-per-inspection';
import * as softwareTco from './software-tco';
import * as softwarePricing from './software-pricing';
import * as roofPitchArea from './roof-pitch-area';
import * as atticVentilation from './attic-ventilation';
import * as stairRiseRun from './stair-rise-run';
import * as deckJoistSpan from './deck-joist-span';
import * as guardHandrailHeight from './guard-handrail-height';
import * as waterHeaterSizing from './water-heater-sizing';

/*
  A table computed from the current inputs, rendered inside the widget under the
  result boxes.

  `referenceTable` on the record is a fixed, hand-written table that never moves;
  this is its live counterpart, and it exists because a comparison is not a
  scalar. "What would each vendor charge me?" has one answer per vendor, and
  collapsing that to a single output box throws away the whole comparison.

  Rows carry `selected` rather than an index so the widget never has to know
  which row the calculator considers the current one.
*/
export interface ResultTable {
  caption: string;
  columns: string[];
  rows: { cells: string[]; selected?: boolean }[];
  note?: string;
}

export interface CalculatorModule {
  record: CalculatorRecord;
  compute: (inputs: Record<string, number>) => Record<string, number>;
  /* Optional: only calculators whose answer is a comparison export one. */
  computeTable?: (inputs: Record<string, number>) => ResultTable;
}

// Order matches the launch list in TASK-1-calculators.md §6.
export const calculators: CalculatorModule[] = [
  inspectionBusinessProfitability,
  revenueGoal,
  startupCostPlanner,
  costPerInspection,
  softwareTco,
  softwarePricing,
  roofPitchArea,
  atticVentilation,
  stairRiseRun,
  deckJoistSpan,
  guardHandrailHeight,
  waterHeaterSizing,
];

export function getCalculator(slug: string): CalculatorModule | undefined {
  return calculators.find((c) => c.record.slug === slug);
}
