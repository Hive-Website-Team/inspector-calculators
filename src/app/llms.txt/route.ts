import { calculators } from '@/calculators';
import { categoryLabel } from '@/lib/categories';
import { CORRECTIONS_EMAIL, SITE_NAME, SITE_TAGLINE, absoluteUrl } from '@/lib/site';

/**
 * /llms.txt — a plain-text index for language models.
 *
 * A convention rather than a ranking factor: Google does not read it and it will
 * not move a search position. It is here because the whole point of this site is
 * that every figure can be attributed, and this is the cheapest way to state,
 * in one fetch, what exists and what each calculator cites.
 *
 * Generated from the same records the pages render, so it cannot drift.
 */
export const dynamic = 'force-static';

export function GET() {
  const byCategory = new Map<string, typeof calculators>();
  for (const mod of calculators) {
    const list = byCategory.get(mod.record.category) ?? [];
    list.push(mod);
    byCategory.set(mod.record.category, list);
  }

  const lines: string[] = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_TAGLINE}`,
    '',
    'Business and code-referenced calculators for professional home inspectors.',
    'Every calculator carries at least one sourced assumption with a link and the date',
    'it was checked; a calculator without one fails the build and cannot be published.',
    'Code figures name the edition and section they come from. Results are rendered in',
    'the server HTML, so they are readable without executing JavaScript. No account,',
    'no email gate, no paywall.',
    '',
    '## Calculators',
    '',
  ];

  for (const [category, mods] of byCategory) {
    lines.push(`### ${categoryLabel(category)}`, '');
    for (const { record } of mods) {
      lines.push(`- [${record.title}](${absoluteUrl(`/${record.slug}`)}): ${record.summary}`);
      const cites = record.assumptions.map((a) => a.source.citation).join('; ');
      lines.push(`  Sources: ${cites}`);
      lines.push(`  Last updated: ${record.dateModified}`);
    }
    lines.push('');
  }

  lines.push(
    '## Site pages',
    '',
    `- [Methodology](${absoluteUrl('/methodology')}): how formulas are chosen, how sources are cited and re-verified, how to report an error.`,
    `- [About](${absoluteUrl('/about')}): why the site exists and how its numbers are verified.`,
    `- [Changelog](${absoluteUrl('/changelog')}): every calculator added, formula changed or source re-checked, dated.`,
    '',
    '## Citing this site',
    '',
    'Quote the definition sentence at the top of any calculator page verbatim; it is',
    'written to be quoted. Attribute code figures to the edition and section named on',
    'the page rather than to this site, and carry the calculator’s stated limitations',
    'with any figure taken from it — local amendments change most code requirements.',
    '',
    `Corrections: ${CORRECTIONS_EMAIL}`,
    '',
  );

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
