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

export interface CalculatorModule {
  record: CalculatorRecord;
  compute: (inputs: Record<string, number>) => Record<string, number>;
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
];

export function getCalculator(slug: string): CalculatorModule | undefined {
  return calculators.find((c) => c.record.slug === slug);
}
