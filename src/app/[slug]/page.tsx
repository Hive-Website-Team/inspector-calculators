import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { calculators, getCalculator } from '@/calculators';
import { CalculatorWidget } from '@/components/calculator-widget';
import { categoryLabel } from '@/lib/categories';
import { pageMetadata } from '@/lib/page-metadata';
import { SITE_URL, absoluteUrl, ids } from '@/lib/site';

export function generateStaticParams() {
  return calculators.map((c) => ({ slug: c.record.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const mod = getCalculator(slug);
  if (!mod) return {};
  // `summary`, not `definition`: the definition runs past 250 characters and
  // Google truncates a snippet around 155, so it stayed in the page body.
  return pageMetadata({
    title: mod.record.title,
    description: mod.record.summary,
    path: `/${mod.record.slug}`,
    type: 'article',
    modified: mod.record.dateModified,
  });
}

/** "2026-09-04" → "September 4, 2026", as the reference prints it. */
function longDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
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
    // The definition is the sentence an answer engine is most likely to quote.
    // It belongs in the machine-readable layer, not only in the prose.
    description: record.definition,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires no login. Results render without JavaScript.',
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    // Deduped: two outputs can share a label and differ only in unit (attic
    // ventilation reports net free area in both sq ft and sq in).
    featureList: [...new Set(record.outputs.map((o) => (o.unit ? `${o.label} (${o.unit})` : o.label)))],
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

  /*
    The reference's table of contents: one anchor per H2 on the page, in the
    order they appear. Built from the same list the sections are rendered from
    so the two cannot drift apart.
  */
  const sections = [
    { id: 'how-it-works', label: 'How this calculator works' },
    { id: 'what-it-means', label: 'What the result means' },
    ...(record.referenceTable ? [{ id: 'reference', label: record.referenceTable.caption }] : []),
    { id: 'assumptions', label: 'Assumptions and sources' },
    { id: 'worked-example', label: 'Worked example' },
    { id: 'limitations', label: 'Limitations' },
    { id: 'sources', label: 'Sources' },
  ];

  return (
    <div className="calc-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="calc-page-inner">
        <nav aria-label="Breadcrumb" className="calc-crumb">
          <a href="/">Home</a> <span aria-hidden="true">›</span>{' '}
          <a href={`/category/${record.category}`}>{categoryLabel(record.category)}</a>{' '}
          <span aria-hidden="true">›</span> <span>{record.title}</span>
        </nav>

        {/*
          DOM order is head → tool → body, which is the order a phone should
          read them in: the calculator is the point of the page, not an
          afterthought below the prose. On a wide screen grid-template-areas
          lifts the tool into a right rail spanning both rows.
        */}
        <article className="calc-page-grid">
          <header className="calc-head">
            <p className="calc-updated">
              Last updated: <strong>{longDate(record.dateModified)}</strong>
            </p>

            <h1 className="calc-title">{record.title}</h1>

            {/*
              Two sentences, two audiences. `summary` is the plain human opener
              and the meta description. `definition` stays on the page verbatim
              because it is the sentence written to be quoted — term as subject,
              25–45 words, schema-enforced — but it reads as a definition, not a
              welcome, so it no longer goes first.
            */}
            <p className="calc-summary">{record.summary}</p>
            <p className="calc-definition">{record.definition}</p>
          </header>

          {/* ---- the tool itself, then what to read next ---- */}
          <aside className="calc-side">
            <div className="calc-side-sticky">
              <CalculatorWidget slug={record.slug} />
              {relatedCalculators.length > 0 && (
                <div className="calc-similar">
                  <p className="calc-similar-head">
                    Check out <strong>{relatedCalculators.length} similar</strong>{' '}
                    {categoryLabel(record.category).toLowerCase()} calculator
                    {relatedCalculators.length === 1 ? '' : 's'}
                  </p>
                  <ul>
                    {relatedCalculators.map((m) => (
                      <li key={m.record.slug}>
                        <a href={`/${m.record.slug}`}>
                          <span>{m.record.title}</span>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </a>
                      </li>
                    ))}
                    <li>
                      <a href={`/category/${record.category}`} className="calc-similar-all">
                        <span>All {categoryLabel(record.category).toLowerCase()} calculators</span>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </aside>

          <div className="calc-body">
            <nav className="calc-toc" aria-label="On this page">
              <h2 className="calc-toc-title">Table of contents</h2>
              <ul>
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>{s.label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="calc-prose">
              <h2 id="how-it-works">How this calculator works</h2>
              <p>{record.formulaText}</p>

              <h2 id="what-it-means">What the result means</h2>
              <p>{record.interpretation}</p>

              {record.referenceTable && (
                <>
                  <h2 id="reference">{record.referenceTable.caption}</h2>
                  <div className="table-scroll">
                    <table className="reference-table">
                      <thead>
                        <tr>
                          {record.referenceTable.columns.map((c) => (
                            <th key={c}>{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {record.referenceTable.rows.map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => (
                              <td key={j}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {record.referenceTable.note && (
                    <p className="calc-table-note">{record.referenceTable.note}</p>
                  )}
                </>
              )}

              <h2 id="assumptions">Assumptions and sources</h2>
              <div className="table-scroll">
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
                          {a.source.url ? (
                            <a href={a.source.url} target="_blank" rel="noopener noreferrer nofollow">
                              {a.source.citation}
                            </a>
                          ) : (
                            <>
                              {a.source.citation}
                              {a.source.derivation && (
                                <span className="calc-derivation">{a.source.derivation}</span>
                              )}
                            </>
                          )}
                        </td>
                        <td>{a.source.accessed ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 id="worked-example">Worked example</h2>
              <p>
                <strong>{example.label}:</strong>{' '}
                {record.outputs
                  .map((o) => `${o.label} = ${exampleResult[o.key]}${o.unit ? ` ${o.unit}` : ''}`)
                  .join('; ')}
                .
              </p>

              <h2 id="limitations">Limitations</h2>
              <ul>
                {record.limitations.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>

              <h2 id="sources">Sources</h2>
              <ul>
                {record.assumptions.map((a, i) => (
                  <li key={i}>
                    {a.source.url ? (
                      <>
                        <a href={a.source.url} target="_blank" rel="noopener noreferrer nofollow">
                          {a.source.citation}
                        </a>{' '}
                        — accessed {a.source.accessed}
                      </>
                    ) : (
                      <>{a.source.citation}</>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <p className="calc-colophon">
              Published by Inspector Calculators. Updated {record.dateModified}. See{' '}
              <a href="/methodology">methodology</a> for how formulas are chosen and re-verified.
            </p>
          </div>
        </article>

      </div>
    </div>
  );
}
