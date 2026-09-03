import { z } from 'zod';

const source = z.object({
  citation: z.string().min(1),          // "IRC 2024 R806.2"
  url: z.url(),
  accessed: z.iso.date(),               // "2026-09-03"
});

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
  formulaText: z.string().min(20),      // plain English, shown on page
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
