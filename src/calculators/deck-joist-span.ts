import type { CalculatorRecord } from '@/lib/calculator-schema';

export const record: CalculatorRecord = {
  slug: 'deck-joist-span-calculator',
  title: 'Deck Joist Span Calculator',
  category: 'structure',
  definition: "The deck joist span calculator looks up the maximum allowable joist span for a residential deck from the American Wood Council's prescriptive span table, based on lumber species group, joist size, and on-center spacing.",
  inputs: [
    { key: 'joistDepth', label: 'Joist size (nominal depth)', unit: 'in', default: 8, min: 6, max: 12, step: 2, help: '2x6, 2x8, 2x10, or 2x12 — snaps to the nearest supported size' },
    { key: 'spacing', label: 'On-center spacing', unit: 'in', default: 16, min: 12, max: 24, step: 4, help: '12, 16, or 24 inches on-center — snaps to the nearest supported spacing' },
  ],
  outputs: [
    { key: 'allowableSpanFt', label: 'Maximum allowable span', unit: 'ft (decimal)' },
    { key: 'spanFeet', label: 'Span — feet', unit: 'ft' },
    { key: 'spanInches', label: 'Span — remainder inches', unit: 'in' },
  ],
  summary:
    'Look up the maximum allowable deck joist span for Southern Pine from the American Wood Council\'s prescriptive table.',

  formulaText: "Looks up the maximum allowable joist span directly from the American Wood Council's prescriptive span table for Southern Pine, No. 2 grade, at 40 psf live load / 10 psf dead load, wet service conditions, indexed by nominal joist depth and on-center spacing.",

  interpretation:
    'A joist run longer than the span shown is a structural finding, not a cosmetic one, and it should be written up with the species, size, spacing and measured span so a contractor can act on it without re-measuring. Undersized joists usually show as bounce underfoot or visible sag mid-span. Note the assumption too: this table is wet service conditions, which is what an exposed deck is.',
  referenceTable: {
    caption: 'Maximum allowable joist span \u2014 Southern Pine, No. 2 grade',
    columns: ['Joist size', '12" o.c.', '16" o.c.', '24" o.c.'],
    rows: [
      ['2x6', "9'-11\"", "9'-0\"", "7'-7\""],
      ['2x8', "13'-1\"", "11'-10\"", "9'-8\""],
      ['2x10', "16'-2\"", "14'-0\"", "11'-5\""],
      ['2x12', "18'-0\"", "16'-6\"", "13'-6\""],
    ],
    note: 'AWC DCA 6-15 Table 2, at 40 psf live load / 10 psf dead load, wet service conditions. Other species groups have shorter allowable spans \u2014 see the limitations below.',
  },

  assumptions: [
    { text: 'Maximum allowable joist spans for Southern Pine, No. 2 grade lumber, assuming 40 psf live load, 10 psf dead load, and wet service conditions.',
      source: { citation: 'AWC DCA 6-15 — Prescriptive Residential Wood Deck Construction Guide, Table 2', url: 'https://web-media.awc.org/wp-content/uploads/2022/02/17210514/AWC-DCA62015-DeckGuide-1804.pdf', accessed: '2026-09-03' } },
  ],
  limitations: [
    'Covers Southern Pine only; the Douglas Fir-Larch/Hem-Fir/Spruce-Pine-Fir and Redwood/Western Cedar/Ponderosa/Red Pine species groups have shorter allowable spans in the same source table — consult it directly for those species.',
    'Only 2x6 through 2x12 at 12, 16, or 24 inches on-center are supported; other sizes or spacings are not in this lookup.',
  ],
  examples: [{ label: '2x10 at 16" o.c., Southern Pine', inputs: { joistDepth: 10, spacing: 16 } }],
  related: ['guard-handrail-height-calculator'],
  datePublished: '2026-09-03', dateModified: '2026-09-03',
};

const SOUTHERN_PINE_SPAN_FT: Record<number, Record<number, number>> = {
  6: { 12: 9 + 11 / 12, 16: 9, 24: 7 + 7 / 12 },
  8: { 12: 13 + 1 / 12, 16: 11 + 10 / 12, 24: 9 + 8 / 12 },
  10: { 12: 16 + 2 / 12, 16: 14, 24: 11 + 5 / 12 },
  12: { 12: 18, 16: 16.5, 24: 13.5 },
};

function nearest(value: number, options: number[]) {
  return options.reduce((closest, option) => (Math.abs(option - value) < Math.abs(closest - value) ? option : closest));
}

export function compute(i: Record<string, number>) {
  const depth = nearest(i.joistDepth, [6, 8, 10, 12]);
  const spacing = nearest(i.spacing, [12, 16, 24]);
  const spanFt = SOUTHERN_PINE_SPAN_FT[depth][spacing];
  const spanFeet = Math.floor(spanFt);
  const spanInches = Math.round((spanFt - spanFeet) * 12);
  return { allowableSpanFt: +spanFt.toFixed(2), spanFeet, spanInches };
}
