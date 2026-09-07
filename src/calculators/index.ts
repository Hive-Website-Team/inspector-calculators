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
  which row the calculator considers the current one — on the software cost
  comparison that is the cheapest row, which moves as the inputs move.
*/
export interface ResultTable {
  caption: string;
  columns: string[];
  /*
    `prose` marks a row whose cells are words rather than figures — it wraps and
    sets in the body face, instead of the tabular monospace the money rows use.
  */
  rows: { cells: string[]; selected?: boolean; prose?: boolean }[];
  /*
    Highlight a whole column rather than a row, by index into `columns`.

    A comparison can run either way round, and which way is not a detail: with
    one product per row the eye reads down a list, with one product per column
    it reads across a spec sheet, product against product. The software cost
    table is the second kind, so the thing to mark is a column.
  */
  selectedColumn?: number;
  /* What the highlighted row or column is being called, for screen readers. */
  selectedLabel?: string;
  note?: string;
}

export interface CalculatorModule {
  record: CalculatorRecord;
  /*
    Results are numbers with one exception: a comparison's answer can be a
    name. "Which of these is cheapest" is not a quantity, and the alternative —
    making the reader match a figure back to a row themselves — is a worse
    answer than the string.
  */
  compute: (inputs: Record<string, number>) => Record<string, number | string>;
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
