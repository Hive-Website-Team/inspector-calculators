import type { CalculatorRecord } from '@/lib/calculator-schema';

export const record: CalculatorRecord = {
  slug: 'stair-rise-run-calculator',
  title: 'Stair Rise and Run Compliance Calculator',
  category: 'safety',
  definition: "The stair rise and run compliance calculator checks a residential stairway's riser height, tread depth, and riser-to-riser variation against the International Residential Code's maximum riser, minimum tread, and maximum variation limits for a flight of stairs.",
  inputs: [
    { key: 'riserHeight', label: 'Riser height', unit: 'in', default: 7.5, min: 4, max: 10, step: 0.125 },
    { key: 'treadDepth', label: 'Tread depth', unit: 'in', default: 10, min: 6, max: 16, step: 0.125 },
    { key: 'riserVariation', label: 'Largest variation between risers in the flight', unit: 'in', default: 0.25, min: 0, max: 2, step: 0.0625 },
  ],
  outputs: [
    { key: 'maxRiserAllowed', label: 'Maximum riser allowed', unit: 'in' },
    { key: 'minTreadRequired', label: 'Minimum tread required', unit: 'in' },
    { key: 'maxVariationAllowed', label: 'Maximum variation allowed', unit: 'in' },
    { key: 'riserOverBy', label: 'Riser over the limit by', unit: 'in' },
    { key: 'treadShortBy', label: 'Tread short of the minimum by', unit: 'in' },
    { key: 'variationOverBy', label: 'Variation over the limit by', unit: 'in' },
  ],
  formulaText: "Compares entered riser height, tread depth, and riser variation against the IRC's fixed limits: maximum riser 7¾ inches, minimum tread depth 10 inches, and maximum variation between the largest and smallest riser or tread in a flight of ⅜ inch.",
  assumptions: [
    { text: 'Maximum riser height 7¾ inches, minimum tread depth 10 inches, and maximum riser/tread variation of ⅜ inch, for stairways serving one- and two-family dwellings.',
      source: { citation: 'IRC 2021 R311.7.5', url: 'https://codes.iccsafe.org/s/IRC2021P2/chapter-3-building-planning/IRC2021P2-Pt03-Ch03-SecR311.7.5', accessed: '2026-09-03' } },
  ],
  limitations: [
    'Local amendments can tighten or adjust these limits; confirm with the authority having jurisdiction.',
    'Checks one flight against the code minimums only — it does not evaluate landings, handrails, or guards, which have their own limits.',
  ],
  examples: [{ label: '7.5 in riser, 10 in tread, 0.25 in variation', inputs: { riserHeight: 7.5, treadDepth: 10, riserVariation: 0.25 } }],
  related: ['guard-handrail-height-calculator'],
  datePublished: '2026-09-03', dateModified: '2026-09-03',
};

export function compute(i: Record<string, number>) {
  const maxRiserAllowed = 7.75;
  const minTreadRequired = 10;
  const maxVariationAllowed = 0.375;
  const riserOverBy = Math.max(0, +(i.riserHeight - maxRiserAllowed).toFixed(3));
  const treadShortBy = Math.max(0, +(minTreadRequired - i.treadDepth).toFixed(3));
  const variationOverBy = Math.max(0, +(i.riserVariation - maxVariationAllowed).toFixed(3));
  return { maxRiserAllowed, minTreadRequired, maxVariationAllowed, riserOverBy, treadShortBy, variationOverBy };
}
