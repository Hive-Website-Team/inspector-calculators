import type { CalculatorRecord } from '@/lib/calculator-schema';

export const record: CalculatorRecord = {
  slug: 'guard-handrail-height-calculator',
  title: 'Guard and Handrail Height Compliance Calculator',
  category: 'safety',
  definition: "The guard and handrail height compliance calculator checks a deck or stairway guard's height and a stairway handrail's height and baluster spacing against the International Residential Code's minimum guard height, handrail height range, and maximum guard opening size.",
  inputs: [
    { key: 'guardHeight', label: 'Guard height', unit: 'in', default: 36, min: 20, max: 60, help: 'Measured vertically from the walking surface to the top of the guard' },
    { key: 'handrailHeight', label: 'Handrail height', unit: 'in', default: 36, min: 20, max: 50 },
    { key: 'balusterGap', label: 'Largest gap a 4-inch sphere could pass through', unit: 'in', default: 3.5, min: 0, max: 12, step: 0.125 },
  ],
  outputs: [
    { key: 'minGuardHeightRequired', label: 'Minimum guard height required', unit: 'in' },
    { key: 'handrailHeightMin', label: 'Handrail height minimum', unit: 'in' },
    { key: 'handrailHeightMax', label: 'Handrail height maximum', unit: 'in' },
    { key: 'maxBalusterGapAllowed', label: 'Maximum baluster gap allowed', unit: 'in' },
    { key: 'guardShortBy', label: 'Guard short of the minimum by', unit: 'in' },
    { key: 'handrailOutOfRangeBy', label: 'Handrail out of range by', unit: 'in' },
    { key: 'balusterGapClearance', label: 'Clearance under the 4-inch sphere limit', unit: 'in' },
  ],
  summary:
    'Check a deck or stairway guard height, handrail height and baluster spacing against the IRC\'s minimums.',

  formulaText: "Compares entered guard height, handrail height, and baluster gap against the IRC's fixed limits: minimum guard height 36 inches, handrail height between 34 and 38 inches, and a maximum baluster/guard opening of 4 inches.",

  interpretation:
    'These are fall-protection dimensions, so a failure here belongs in the report as a safety item rather than a maintenance note. Watch the opening result in particular: the code prohibits passage of a 4-inch sphere, so an opening of exactly 4 inches fails and a reported clearance of zero is not compliance. Guards on older decks most often fail on height; balusters most often fail near stair treads where the spacing opens up.',
  referenceTable: {
    caption: 'IRC 2021 guard and handrail limits for one- and two-family dwellings',
    columns: ['Dimension', 'Limit', 'Code section'],
    rows: [
      ['Minimum guard height', '36 in', 'R312.1.2'],
      ['Minimum handrail height', '34 in', 'R311.7.8.1'],
      ['Maximum handrail height', '38 in', 'R311.7.8.1'],
      ['Maximum guard opening', 'must not pass a 4 in sphere', 'R312.1.3'],
    ],
    note: 'An opening of exactly 4 inches fails \u2014 the code prohibits passage of the sphere, so a measured clearance of zero is not compliance.',
  },

  assumptions: [
    { text: 'Guards must be at least 36 inches high; handrails must be between 34 and 38 inches high; guard openings must not allow a 4-inch sphere to pass through, for guards and stairways serving one- and two-family dwellings.',
      source: { citation: 'IRC 2021 R312.1.2 and R311.7.8', url: 'https://codes.iccsafe.org/s/IRC2021P2/chapter-3-building-planning/IRC2021P2-Pt03-Ch03-SecR312', accessed: '2026-09-03' } },
  ],
  limitations: [
    'Local amendments can adjust these minimums; confirm with the authority having jurisdiction.',
    'Does not check the triangular-opening rule at the base of a guard or handrail graspability, which have their own separate requirements in the same code sections.',
    'Clearance under the sphere limit must be greater than zero. The code prohibits passage of a 4-inch sphere, so an opening of exactly 4 inches fails — a clearance of 0 is not compliant.',
  ],
  examples: [{ label: '36 in guard, 36 in handrail, 3.5 in gap', inputs: { guardHeight: 36, handrailHeight: 36, balusterGap: 3.5 } }],
  related: ['stair-rise-run-calculator'],
  datePublished: '2026-09-03', dateModified: '2026-09-04',
};

export function compute(i: Record<string, number>) {
  const minGuardHeightRequired = 36;
  const handrailHeightMin = 34;
  const handrailHeightMax = 38;
  const maxBalusterGapAllowed = 4;
  const guardShortBy = Math.max(0, +(minGuardHeightRequired - i.guardHeight).toFixed(3));
  const handrailOutOfRangeBy =
    i.handrailHeight < handrailHeightMin
      ? +(handrailHeightMin - i.handrailHeight).toFixed(3)
      : i.handrailHeight > handrailHeightMax
        ? +(i.handrailHeight - handrailHeightMax).toFixed(3)
        : 0;
  // The code test is sphere PASSAGE, so the opening must be strictly under 4 in.
  // Reported as clearance rather than "over by": clearance must be greater than
  // zero, which makes an exactly-4-inch opening read as failing (0), where an
  // "over by" figure would have read 0 and looked compliant.
  const balusterGapClearance = +(maxBalusterGapAllowed - i.balusterGap).toFixed(3);
  return { minGuardHeightRequired, handrailHeightMin, handrailHeightMax, maxBalusterGapAllowed, guardShortBy, handrailOutOfRangeBy, balusterGapClearance };
}
