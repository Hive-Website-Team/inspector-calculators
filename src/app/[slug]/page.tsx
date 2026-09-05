import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { calculators, getCalculator } from '@/calculators';
import { CalculatorWidget } from '@/components/calculator-widget';
import { categoryLabel } from '@/lib/categories';
import { SITE_URL, absoluteUrl, ids } from '@/lib/site';

export function generateStaticParams() {
  return calculators.map((c) => ({ slug: c.record.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const mod = getCalculator(slug);
  if (!mod) return {};
  return {
    title: mod.record.title,
    description: mod.record.definition,
    alternates: { canonical: absoluteUrl(`/${mod.record.slug}`) },
  };
}

export default async function CalculatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = getCalculator(slug);
  if (!mod) notFound();

  const { record, compute } = mod;
  const url = absoluteUrl(`/${record.slug}`);
  const example = record.examples[0];
  const exampleResult = compute(example.inputs);

  const webApplicationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: record.title,
    url,
    applicationCategory: 'BusinessApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@id': ids.organization },
    dateModified: record.dateModified,
    datePublished: record.datePublished,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: categoryLabel(record.category), item: absoluteUrl(`/category/${record.category}`) },
      { '@type': 'ListItem', position: 3, name: record.title, item: url },
    ],
  };

  const relatedCalculators = record.related
    .map((relatedSlug) => getCalculator(relatedSlug))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav aria-label="Breadcrumb" className="text-sm mb-4 text-[color-mix(in_srgb,var(--foreground)_65%,transparent)]">
        <a href="/">Home</a> <span aria-hidden="true">›</span> <a href={`/category/${record.category}`}>{categoryLabel(record.category)}</a>{' '}
        <span aria-hidden="true">›</span> <span>{record.title}</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{record.title}</h1>
      <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--foreground)_65%,transparent)]">
        Updated {record.dateModified} · <a href="/methodology">Methodology</a>
      </p>

      <p className="mt-6 text-lg leading-relaxed border-l-2 border-[var(--accent)] pl-4">{record.definition}</p>

      <div className="mt-8">
        <CalculatorWidget slug={record.slug} />
      </div>

      <h2 className="mt-10 text-xl font-semibold">How this calculator works</h2>
      <p className="mt-2 leading-relaxed">{record.formulaText}</p>

      <h2 className="mt-10 text-xl font-semibold">Assumptions and sources</h2>
      <div className="table-scroll mt-3">
        <table className="assumptions-table">
          <thead>
            <tr>
              <th>Assumption</th>
              <th>Source</th>
              <th>Accessed</th>
            </tr>
          </thead>
          <tbody>
            {record.assumptions.map((a, i) => (
              <tr key={i}>
                <td>{a.text}</td>
                <td>
                  <a href={a.source.url} target="_blank" rel="noopener noreferrer nofollow">
                    {a.source.citation}
                  </a>
                </td>
                <td>{a.source.accessed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-semibold">Worked example</h2>
      <p className="mt-2 leading-relaxed">
        <strong>{example.label}:</strong>{' '}
        {record.outputs
          .map((o) => `${o.label} = ${exampleResult[o.key]}${o.unit ? ` ${o.unit}` : ''}`)
          .join('; ')}
        .
      </p>

      <h2 className="mt-10 text-xl font-semibold">Limitations</h2>
      <ul className="mt-2 list-disc pl-5 space-y-1">
        {record.limitations.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>

      {relatedCalculators.length > 0 && (
        <>
          <h2 className="mt-10 text-xl font-semibold">Related calculators</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            {relatedCalculators.map((m) => (
              <li key={m.record.slug}>
                <a href={`/${m.record.slug}`}>{m.record.title}</a>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2 className="mt-10 text-xl font-semibold">Sources</h2>
      <ul className="mt-2 list-disc pl-5 space-y-1">
        {record.assumptions.map((a, i) => (
          <li key={i}>
            <a href={a.source.url} target="_blank" rel="noopener noreferrer nofollow">
              {a.source.citation}
            </a>{' '}
            — accessed {a.source.accessed}
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-[color-mix(in_srgb,var(--foreground)_65%,transparent)] border-t border-[var(--border)] pt-4">
        Published by Inspector Calculators. Updated {record.dateModified}. See{' '}
        <a href="/methodology">methodology</a> for how formulas are chosen and re-verified.
      </p>
    </article>
  );
}
