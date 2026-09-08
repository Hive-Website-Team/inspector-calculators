import type { CalculatorRecord } from '@/lib/calculator-schema';

/**
 * TASK-1-calculators.md §6 #6. The task's own "cite" note for this one is
 * "trigonometry; state the pitch-factor table" — it does not ask for a code
 * source for the geometry, because none exists: the multiplier is a math
 * identity, and the table is stated in `formulaText` and the page body.
 *
 * The sourced assumptions below are the minimum roof slopes the IRC sets per
 * covering material, which is the part of this calculator that IS a code
 * requirement and the part an inspector actually acts on. Read and verified
 * against the free public IRC text on UpCodes (ICC's own viewer paywalls the
 * section text behind a sign-in).
 */
export const record: CalculatorRecord = {
  slug: 'roof-pitch-area-calculator',
  title: 'Roof Pitch and Area Calculator',
  category: 'roofing',
  definition:
    'The roof pitch and area calculator converts a rise-per-12-inches measurement into a pitch multiplier, roof angle and percent slope, then multiplies the building footprint by that multiplier to give the actual sloped roof surface area.',
  inputs: [
    { key: 'rise', label: 'Rise per 12 inches of run', unit: 'in', default: 6, min: 0.25, max: 24, step: 0.25, help: 'A 6/12 roof rises 6 inches over 12 inches of horizontal run' },
    { key: 'footprintArea', label: 'Building footprint area', unit: 'sq ft', default: 1500, min: 100, max: 20000, help: 'Horizontal projected area, not a distance measured up the slope' },
  ],
  outputs: [
    { key: 'pitchMultiplier', label: 'Pitch multiplier', unit: '×' },
    { key: 'roofArea', label: 'Sloped roof surface area', unit: 'sq ft' },
    { key: 'angleDegrees', label: 'Roof angle', unit: '°' },
    { key: 'slopePercent', label: 'Slope', unit: '%' },
    { key: 'asphaltShingleMargin', label: 'Rise above the 2:12 asphalt shingle minimum', unit: 'in' },
  ],
  summary:
    'Convert a rise-per-12 measurement into a pitch multiplier, angle and percent slope, and get the true sloped roof area.',

  formulaText:
    'Pitch multiplier = √(rise² + 12²) ÷ 12. Sloped roof area = footprint area × pitch multiplier. Angle = arctan(rise ÷ 12). Slope percent = rise ÷ 12 × 100.',

  interpretation:
    'The sloped area is the surface a roofer actually covers, which is what makes a material estimate realistic — but it is a plane-surface figure, so add an allowance for hips, valleys, ridge caps and waste on top. The slope result also decides what covering is permitted: below 2:12 asphalt shingles are not allowed at all, and between 2:12 and 4:12 they require double underlayment. A shingle roof under 2:12 is a reportable installation defect regardless of its condition.',
  referenceTable: {
    caption: 'Roof pitch multipliers, angles and percent slopes',
    columns: ['Pitch (rise:12)', 'Multiplier', 'Angle', 'Slope'],
    rows: [
      ['1:12', '1.0035', '4.76\u00b0', '8.3%'],
      ['2:12', '1.0138', '9.46\u00b0', '16.7%'],
      ['3:12', '1.0308', '14.04\u00b0', '25.0%'],
      ['4:12', '1.0541', '18.43\u00b0', '33.3%'],
      ['5:12', '1.0833', '22.62\u00b0', '41.7%'],
      ['6:12', '1.1180', '26.57\u00b0', '50.0%'],
      ['7:12', '1.1577', '30.26\u00b0', '58.3%'],
      ['8:12', '1.2019', '33.69\u00b0', '66.7%'],
      ['9:12', '1.2500', '36.87\u00b0', '75.0%'],
      ['10:12', '1.3017', '39.81\u00b0', '83.3%'],
      ['11:12', '1.3566', '42.51\u00b0', '91.7%'],
      ['12:12', '1.4142', '45.00\u00b0', '100.0%'],
    ],
    note: 'Multiplier = \u221a(rise\u00b2 + 12\u00b2) \u00f7 12. Multiply the horizontal footprint area by the multiplier to get the sloped surface area. Geometry, not a code requirement.',
  },

  assumptions: [
    {
      text: 'Asphalt shingles are permitted only on roof slopes of 2 units vertical in 12 units horizontal or greater, and slopes from 2:12 up to 4:12 require double underlayment.',
      source: { citation: 'IRC 2021 R905.2.2 (free public text, UpCodes)', url: 'https://up.codes/viewer/connecticut/irc-2021/chapter/9/roof-assemblies', accessed: '2026-09-04' },
    },
    {
      text: 'Minimum slopes for other coverings in the same section: mineral-surfaced roll roofing 1:12 (R905.5.2), clay and concrete tile 2½:12 (R905.3.2), metal roof shingles 3:12 (R905.4.2), wood shingles 3:12 (R905.7.2), wood shakes 3:12 (R905.8.2), slate 4:12 (R905.6.2).',
      source: { citation: 'IRC 2021 R905.3.2 through R905.8.2 (free public text, UpCodes)', url: 'https://up.codes/viewer/connecticut/irc-2021/chapter/9/roof-assemblies', accessed: '2026-09-04' },
    },
  ],
  limitations: [
    'The pitch multiplier is geometry, not a code requirement. It is exact for a plane roof surface and does not account for hips, valleys, dormers, overhangs, ridge caps, or waste — add an allowance for those separately.',
    'Footprint area must be the horizontal projected area of the building. Using a distance measured up the slope double-counts the pitch and overstates the result.',
    'Minimum slopes are those of the 2021 IRC. Codes change by edition and by local amendment; confirm the adopted edition with the authority having jurisdiction.',
    'Metal roof panels are excluded from the minimum-slope list above because R905.10.2 sets different minimums by seam type — as low as ¼:12 for standing-seam systems and 3:12 for lapped, non-soldered seams without sealant. Check that section for the specific system.',
  ],
  examples: [
    { label: '1,500 sq ft footprint, 6/12 pitch', inputs: { rise: 6, footprintArea: 1500 } },
    { label: '2,400 sq ft footprint, 4/12 pitch', inputs: { rise: 4, footprintArea: 2400 } },
  ],
  related: ['attic-ventilation-calculator'],
  datePublished: '2026-09-04',
  dateModified: '2026-09-04',
};

const ASPHALT_SHINGLE_MIN_RISE = 2; // IRC 2021 R905.2.2

export function compute(i: Record<string, number>) {
  const pitchMultiplier = Math.sqrt(i.rise * i.rise + 144) / 12;
  return {
    pitchMultiplier: +pitchMultiplier.toFixed(4),
    roofArea: +(i.footprintArea * pitchMultiplier).toFixed(2),
    angleDegrees: +((Math.atan(i.rise / 12) * 180) / Math.PI).toFixed(2),
    slopePercent: +((i.rise / 12) * 100).toFixed(1),
    asphaltShingleMargin: +(i.rise - ASPHALT_SHINGLE_MIN_RISE).toFixed(2),
  };
}
