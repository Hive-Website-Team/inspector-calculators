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
  summary:
    'Work out the net free vent area an attic needs under the IRC, using either the 1:150 baseline ratio or the 1:300 ratio.',

  formulaText: 'Net free area = attic floor area ÷ ratio. Multiply square feet by 144 for square inches.',

  interpretation:
    'The figure is the vent area the attic needs in total, split roughly half low and half high. Compare it against the manufacturer-rated net free area printed on the vents actually installed, not the size of the holes. If the installed NFA falls short, that is a reportable ventilation deficiency and the usual consequences are worth naming in the report: condensation on the sheathing, ice damming at the eaves, and shortened shingle life. Two mistakes account for most of the shortfalls found in the field. The first is counting the opening rather than the rating: a 16-by-8-inch soffit vent is 128 square inches of hole but the louvres and insect screen behind it typically pass 50 to 65 of those, and only the rated figure counts. The second is an unbalanced split. Ventilation works by moving air from low intake to high exhaust, so an attic with the required total area supplied almost entirely by ridge vent has no intake to draw from and performs worse than the arithmetic suggests. Note the balance in the report even when the total passes, and check that insulation or baffles have not blocked the soffit intake that is nominally there.',
  assumptions: [
    { text: 'Baseline ratio 1:150 of the area of the vented space.',
      source: { citation: 'IRC 2021 R806.2', url: 'https://codes.iccsafe.org/content/IRC2021P2/chapter-8-roof-ceiling-construction', accessed: '2026-09-03' } },
  ],
  referenceTable: {
    caption: 'Required net free ventilation area by attic size',
    columns: ['Attic floor area', 'NFA at 1:150', 'NFA at 1:300'],
    rows: [
      ['800 sq ft', '5.33 sq ft (768 sq in)', '2.67 sq ft (384 sq in)'],
      ['1,000 sq ft', '6.67 sq ft (960 sq in)', '3.33 sq ft (480 sq in)'],
      ['1,200 sq ft', '8.00 sq ft (1,152 sq in)', '4.00 sq ft (576 sq in)'],
      ['1,500 sq ft', '10.00 sq ft (1,440 sq in)', '5.00 sq ft (720 sq in)'],
      ['2,000 sq ft', '13.33 sq ft (1,920 sq in)', '6.67 sq ft (960 sq in)'],
      ['2,500 sq ft', '16.67 sq ft (2,400 sq in)', '8.33 sq ft (1,200 sq in)'],
      ['3,000 sq ft', '20.00 sq ft (2,880 sq in)', '10.00 sq ft (1,440 sq in)'],
    ],
    note: 'Computed by this calculator from IRC 2021 R806.2. The 1:300 column applies only where the conditions in R806.2 are met \u2014 a Class I or II vapor retarder on the warm side in Climate Zones 6 through 8, or a balanced split with 40 to 50 percent of the vent area placed in the upper portion of the attic and the remainder at the eaves. Where neither applies, the 1:150 column governs.',
  },
  limitations: ['Local amendments may change the ratio; confirm with the authority having jurisdiction.',
                'Net free area of a vent product is the manufacturer-rated NFA, not the vent\'s physical opening.',
                'Returns a required total only. It does not check how that area is divided between eave intake and ridge or gable exhaust, and an attic can meet the total while performing badly because almost all of it sits high.',
                'Assumes a conventionally vented attic. Unvented conditioned assemblies under IRC R806.5 are a different construction with their own requirements, and this ratio does not apply to them.'],
  examples: [{ label: '1,500 sq ft attic, baseline', inputs: { area: 1500, ratio: 150 } }],
  related: ['roof-pitch-area-calculator'],
  datePublished: '2026-09-03', dateModified: '2026-09-07',
};

export function compute(i: Record<string, number>) {
  const nfa = i.area / i.ratio;
  return { nfa: +nfa.toFixed(2), nfaIn: Math.round(nfa * 144) };
}
