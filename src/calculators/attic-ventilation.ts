import type { CalculatorRecord } from '@/lib/calculator-schema';

export const record: CalculatorRecord = {
  slug: 'attic-ventilation-calculator',
  title: 'Attic Ventilation Calculator',
  category: 'roofing',
  definition: 'The attic ventilation calculator converts attic floor area into the net free ventilation area required by the International Residential Code, using the 1:150 baseline ratio or the 1:300 ratio permitted when a vapor retarder or balanced high-low venting is present.',
  inputs: [
    { key: 'area', label: 'Attic floor area', unit: 'sq ft', default: 1500, min: 100, max: 20000 },
    { key: 'ratio', label: 'Ratio', default: 150, min: 150, max: 300, step: 150, help: '150 = baseline; 300 = with vapor retarder or balanced venting' },
  ],
  outputs: [{ key: 'nfa', label: 'Required net free area', unit: 'sq ft' }, { key: 'nfaIn', label: 'Required net free area', unit: 'sq in' }],
  formulaText: 'Net free area = attic floor area ÷ ratio. Multiply square feet by 144 for square inches.',
  assumptions: [
    { text: 'Baseline ratio 1:150 of the area of the vented space.',
      source: { citation: 'IRC 2021 R806.2', url: 'https://codes.iccsafe.org/content/IRC2021P2/chapter-8-roof-ceiling-construction', accessed: '2026-09-03' } },
  ],
  limitations: ['Local amendments may change the ratio; confirm with the authority having jurisdiction.',
                'Net free area of a vent product is the manufacturer-rated NFA, not the vent\'s physical opening.'],
  examples: [{ label: '1,500 sq ft attic, baseline', inputs: { area: 1500, ratio: 150 } }],
  related: ['roof-pitch-area-calculator'],
  datePublished: '2026-09-03', dateModified: '2026-09-04',
};

export function compute(i: Record<string, number>) {
  const nfa = i.area / i.ratio;
  return { nfa: +nfa.toFixed(2), nfaIn: Math.round(nfa * 144) };
}
