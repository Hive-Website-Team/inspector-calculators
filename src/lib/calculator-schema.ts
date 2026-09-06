import { z } from 'zod';

/*
  A source is normally a citation: a named authority, a live URL, and the date it
  was checked. That is the gate.

  The one honest exception is a pure-arithmetic calculator, which has no external
  authority to cite — the maths is the authority. Borrowing a definition from a
  secondary source just to satisfy the gate is worse than stating the derivation
  plainly, so `derivation` is the alternative: it still forces the author to
  write down why the figure is what it is, at length, and the refine below still
  refuses a source that offers neither.
*/
const source = z
  .object({
    citation: z.string().min(1),        // "IRC 2024 R806.2" | "Derived — definitional arithmetic"
    url: z.url().optional(),
    accessed: z.iso.date().optional(),
    derivation: z.string().min(40).optional(),
  })
  .refine(
    (s) => (s.url !== undefined && s.accessed !== undefined) || s.derivation !== undefined,
    'a source needs either a url plus the date it was accessed, or a written derivation',
  )
  .refine(
    (s) => !(s.url !== undefined && s.derivation !== undefined),
    'a source is either cited or derived, not both',
  );

export type CalculatorSource = z.infer<typeof source>;

export const calculatorSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),             // "Attic Ventilation Calculator"
  category: z.enum(['business', 'pricing', 'roofing', 'electrical', 'plumbing',
                    'structure', 'hvac', 'safety']),
  // 25–45 words, term as subject, no leading pronoun — gets quoted verbatim by AI
  definition: z.string()
    .refine(s => { const n = s.trim().split(/\s+/).length; return n >= 25 && n <= 45; },
      'definition must be 25–45 words')
    .refine(s => !/^(it|this|these|they|the tool)\b/i.test(s.trim()),
      'definition must not open with a pronoun'),
  inputs: z.array(z.object({
    key: z.string(), label: z.string(), unit: z.string().optional(),
    default: z.number(), min: z.number(), max: z.number(), step: z.number().optional(),
    help: z.string().optional(),
  })).min(1),
  outputs: z.array(z.object({ key: z.string(), label: z.string(), unit: z.string().optional() })).min(1),
  /*
    A short, human first sentence and the meta description. The `definition`
    above is written for machines — term as subject, dense with qualifiers — and
    reads as a definition rather than a welcome. This is what a person sees
    first, and what Google shows in the snippet, so it is capped at 155 so it is
    never truncated mid-clause.
  */
  summary: z.string().min(40).max(155),

  formulaText: z.string().min(20),      // plain English, shown on page

  /*
    What to do with the number. Every calculator stopped at the figure; an
    inspector still has to decide what it means for the report or the price.
  */
  interpretation: z.string().min(60),

  /*
    A reference table rendered as a table rather than buried in formulaText.
    These are the most extractable assets on the site — an answer engine lifts a
    table, not a comma-separated clause inside a paragraph.
  */
  referenceTable: z.object({
    caption: z.string().min(1),
    columns: z.array(z.string()).min(2),
    rows: z.array(z.array(z.string())).min(2),
    note: z.string().optional(),
  }).optional(),
  assumptions: z.array(z.object({
    text: z.string().min(1),
    source,                             // REQUIRED — this is the build gate
  })).min(1, 'every calculator needs at least one sourced assumption'),
  limitations: z.array(z.string()).min(1, 'state at least one limitation'),
  examples: z.array(z.object({ label: z.string(), inputs: z.record(z.string(), z.number()) })).min(1),
  related: z.array(z.string()).default([]),

  datePublished: z.iso.date(),
  dateModified: z.iso.date(),
});
export type CalculatorRecord = z.infer<typeof calculatorSchema>;
