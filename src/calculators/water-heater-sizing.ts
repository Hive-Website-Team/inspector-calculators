import type { CalculatorRecord } from '@/lib/calculator-schema';

/*
  Water Heater Sizing (First-Hour Rating) — TASK-1 §6 #10.

  This calculator was withdrawn once. Its original source was the Department of
  Energy's "Sizing a New Water Heater" page, which was taken offline along with
  the rest of energy.gov/energysaver; both that URL and its node ID now return
  404, and the per-fixture gallon figures that circulate on plumbing-contractor
  blogs are secondary restatements of that dead page, which `tasks/README.md`
  §2.2 forbids citing.

  It ships now because `README.md` §2.1 says: "Some government sites block
  `curl` — check those in a real browser." eCFR is one of those sites; an
  automated fetch is redirected to an unblock page, while a real browser gets
  the text. Opened in a browser on 2026-09-07, 10 CFR 430 Subpart B Appendix E
  gives the figures below directly, from the federal test procedure itself
  rather than from anyone's summary of it:

    - Table I assigns a draw pattern from the first-hour rating, at the exact
      gallon thresholds reproduced in `DRAW_PATTERNS`.
    - Tables III.1 through III.4 list every draw in each pattern. The daily
      totals below are the sum of the volume column of each of those tables,
      summed from the rendered table rather than transcribed by eye:
      very-small 9 draws / 10.0 gal, low 11 draws / 38.0 gal,
      medium 12 draws / 55.0 gal, high 14 draws / 84.0 gal.

  What is deliberately NOT here: a fixture-by-fixture peak-hour worksheet
  ("shower = 20 gallons"). Those numbers lived only on the dead DOE page and no
  live primary source carries them, so the household's peak-hour demand is an
  input the user supplies rather than a figure this site asserts.
*/

/** 10 CFR 430 Subpart B App. E, Table I — [minimum FHR, maximum FHR, daily gallons]. */
const DRAW_PATTERNS: { min: number; max: number; dailyGallons: number }[] = [
  { min: 0, max: 18, dailyGallons: 10 },
  { min: 18, max: 51, dailyGallons: 38 },
  { min: 51, max: 75, dailyGallons: 55 },
  { min: 75, max: Infinity, dailyGallons: 84 },
];

export const record: CalculatorRecord = {
  slug: 'water-heater-sizing-calculator',
  title: 'Water Heater Sizing Calculator (First-Hour Rating)',
  category: 'plumbing',
  definition:
    'The water heater sizing calculator compares a household’s peak-hour hot water demand against the first-hour rating printed on a water heater’s EnergyGuide label, and reports the federal draw-pattern class and daily hot water use that rating corresponds to.',
  inputs: [
    {
      key: 'peakHourDemand',
      label: 'Household peak-hour hot water demand',
      unit: 'gal',
      default: 60,
      min: 1,
      max: 200,
      help: 'Gallons of hot water used in the busiest single hour of the day. Estimate it for the household, not the fixture count — replace this default with a real figure.',
    },
    {
      key: 'labelledFhr',
      label: 'First-hour rating on the EnergyGuide label',
      unit: 'gal',
      default: 62,
      min: 1,
      max: 200,
      help: 'Printed top-left of the yellow EnergyGuide label as "Capacity (first hour rating)"',
    },
  ],
  outputs: [
    { key: 'requiredFhr', label: 'Minimum first-hour rating needed', unit: 'gal' },
    { key: 'fhrMargin', label: 'Margin over peak-hour demand', unit: 'gal' },
    { key: 'dailyUseForRating', label: 'Federal daily hot water use for this rating', unit: 'gal/day' },
    { key: 'patternLowerBound', label: 'Draw-pattern band starts at', unit: 'gal' },
  ],
  summary:
    'Check whether a water heater’s first-hour rating covers the household’s busiest hour, straight off the EnergyGuide label.',

  formulaText:
    'Minimum first-hour rating needed = the household’s peak-hour hot water demand, because the first-hour rating is defined as the gallons a heater can deliver in the first hour starting from a full tank. Margin = labelled first-hour rating − peak-hour demand; a negative margin means the tank runs cold before the hour is out. The federal draw-pattern class and its daily hot water use are read from the labelled rating using 10 CFR 430 Subpart B Appendix E, Table I.',

  interpretation:
    'A negative margin means the household empties the tank inside its busiest hour — the complaint is almost always "we run out of hot water in the morning" rather than anything visible at the tank. Report it as a capacity mismatch rather than a defect: the heater may be working exactly as designed and still be too small for the household. The daily-use figure is what the federal test procedure assumes for a heater of this rating, so a household well above it will see shorter service life and higher running costs than the EnergyGuide estimate on the same label.',

  referenceTable: {
    caption: 'Federal draw pattern and daily hot water use by first-hour rating',
    columns: ['First-hour rating', 'Draw pattern', 'Draws per day', 'Daily hot water use'],
    rows: [
      ['Under 18 gal', 'Very-small usage', '9', '10.0 gal'],
      ['18 to under 51 gal', 'Low usage', '11', '38.0 gal'],
      ['51 to under 75 gal', 'Medium usage', '12', '55.0 gal'],
      ['75 gal and above', 'High usage', '14', '84.0 gal'],
    ],
    note: '10 CFR 430 Subpart B Appendix E — Table I sets the bands; the daily totals are the sum of the volume column of Tables III.1 through III.4. These are the usage assumptions behind the EnergyGuide estimate on the label, not a recommendation for a household.',
  },

  assumptions: [
    {
      text: 'Draw pattern bands by first-hour rating: under 18 gallons is very-small usage, 18 to under 51 is low, 51 to under 75 is medium, and 75 gallons and above is high.',
      source: {
        citation: '10 CFR 430 Subpart B Appendix E, Table I — Draw Pattern To Be Used Based on First-Hour Rating',
        url: 'https://www.ecfr.gov/current/title-10/chapter-II/subchapter-D/part-430/subpart-B/appendix-Appendix%20E%20to%20Subpart%20B%20of%20Part%20430',
        accessed: '2026-09-07',
      },
    },
    {
      text: 'Daily hot water use per draw pattern: 10.0 gallons over 9 draws for very-small usage, 38.0 over 11 draws for low, 55.0 over 12 draws for medium, and 84.0 over 14 draws for high. Each total is the sum of the volume column of that pattern’s table.',
      source: {
        citation: '10 CFR 430 Subpart B Appendix E, Tables III.1–III.4 — draw patterns by usage class',
        url: 'https://www.ecfr.gov/current/title-10/chapter-II/subchapter-D/part-430/subpart-B/appendix-Appendix%20E%20to%20Subpart%20B%20of%20Part%20430',
        accessed: '2026-09-07',
      },
    },
    {
      text: 'The minimum first-hour rating a household needs equals its peak-hour hot water demand, and the margin is the labelled rating minus that demand.',
      source: {
        citation: 'Derived — definitional arithmetic on the federal definition of first-hour rating',
        derivation:
          'The first-hour rating is defined by the federal test procedure as the volume of hot water a heater delivers in the first hour of draw starting from a fully heated tank. A household drawing more than that volume inside one hour therefore exhausts the supply by definition, with no external figure needed to establish it. Required rating is the peak-hour demand entered, and the margin is a subtraction. No fixture-level gallon assumption is made here because no live primary source carries one — the peak-hour demand is supplied by the user.',
      },
    },
  ],

  limitations: [
    'Peak-hour demand is a figure you supply. The Department of Energy worksheet that estimated it from showers, dishwashing and laundry was taken offline with the rest of energy.gov/energysaver, and no live primary source carries those per-use gallon figures, so this calculator will not assert them.',
    'The default values are placeholders for entering your own, not recommendations. Read the first-hour rating from the EnergyGuide label on the tank rather than from the tank’s nominal storage volume — a 50-gallon tank does not have a 50-gallon first-hour rating.',
    'Draw patterns and daily-use volumes are the federal test procedure’s assumptions for rating a heater. They describe the test, not a household, and a real household can sit well above or below them.',
    'Applies to storage water heaters rated by first-hour rating. Tankless and other flow-activated heaters are rated by maximum GPM instead and use a different table in the same appendix.',
  ],

  examples: [
    {
      label: '60 gal peak hour against a 62 gal labelled rating',
      inputs: { peakHourDemand: 60, labelledFhr: 62 },
    },
  ],
  /*
    Deliberately empty. This is the only plumbing calculator, and the previous
    entry pointed at Cost Per Inspection — a pricing tool with no relationship
    to sizing a water heater beyond both living on this site. A "related"
    module that links unrelated things trains a reader to ignore it and tells a
    crawler the two pages belong to one topic when they do not. The block still
    renders the "All plumbing calculators" link, so the page keeps its
    contextual outbound link. Fill this in when plumbing has a second entry.
  */
  related: [],
  datePublished: '2026-09-07',
  dateModified: '2026-09-07',
};

export function compute(i: Record<string, number>) {
  const requiredFhr = i.peakHourDemand;
  const fhrMargin = i.labelledFhr - requiredFhr;
  const band =
    DRAW_PATTERNS.find((p) => i.labelledFhr >= p.min && i.labelledFhr < p.max) ??
    DRAW_PATTERNS[DRAW_PATTERNS.length - 1];
  return {
    requiredFhr: +requiredFhr.toFixed(1),
    fhrMargin: +fhrMargin.toFixed(1),
    dailyUseForRating: band.dailyGallons,
    patternLowerBound: band.min,
  };
}
