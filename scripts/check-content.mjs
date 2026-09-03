#!/usr/bin/env node
/**
 * Content integrity gate. Runs BEFORE `next build` (see package.json).
 *
 * Modeled on ~/websites/inspection-reference/scripts/check-content.mjs.
 * Loads every calculator record, runs it through calculatorSchema.parse(),
 * and fails EARLY with a readable message naming the calculator and the
 * rule it broke — because a bad record here means a claim on the page has
 * no source behind it, which is the one thing this site cannot ship.
 *
 * The rule this enforces above all others: no calculator ships without a
 * sourced assumption. That is what "no source, no build" means operationally.
 */

const { calculators } = await import('../src/calculators/index.ts');
const { calculatorSchema } = await import('../src/lib/calculator-schema.ts');

const errors = [];
let checked = 0;

const allSlugs = new Set(calculators.map((c) => c.record.slug));
const seenSourceUrls = new Set();

for (const mod of calculators) {
  checked++;
  const label = mod?.record?.slug ?? '(unknown calculator — missing slug)';
  const fail = (msg) => errors.push(`${label}\n    ${msg}`);

  const parsed = calculatorSchema.safeParse(mod.record);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      fail(`${issue.path.join('.') || '(root)'}: ${issue.message}`);
    }
    // Skip the secondary checks below if the record didn't even parse —
    // they assume a shape that failed validation.
    continue;
  }

  const record = parsed.data;

  // Every source URL must be a usable, well-formed URL. Two assumptions on
  // the same calculator citing the identical URL is allowed (e.g. two facts
  // from the same code section) — this only flags malformed URLs.
  record.assumptions.forEach((a, i) => {
    try {
      // eslint-disable-next-line no-new
      new URL(a.source.url);
    } catch {
      fail(`assumptions[${i}].source.url is not a well-formed URL: "${a.source.url}"`);
    }
    seenSourceUrls.add(a.source.url);
  });

  // `related` slugs must point at real calculators, not typos or
  // not-yet-built ones — a dead related-calculator link is a trust bug.
  record.related.forEach((slug) => {
    if (!allSlugs.has(slug)) {
      fail(`related "${slug}" does not match any calculator's slug`);
    }
  });

  if (typeof mod.compute !== 'function') {
    fail('does not export a `compute` function');
  }
}

// Duplicate slugs across the whole set would break routing silently.
const slugCounts = new Map();
for (const mod of calculators) {
  const slug = mod?.record?.slug;
  if (!slug) continue;
  slugCounts.set(slug, (slugCounts.get(slug) ?? 0) + 1);
}
for (const [slug, count] of slugCounts) {
  if (count > 1) errors.push(`"${slug}"\n    slug is used by ${count} calculators — slugs must be unique`);
}

if (errors.length) {
  console.error(`\n  Content check FAILED — ${errors.length} problem(s) in ${checked} calculator(s):\n`);
  errors.forEach((e) => console.error(`  ✗ ${e}\n`));
  process.exit(1);
}

console.log(`  Content check passed — ${checked} calculator(s), every one carries a sourced assumption.`);
