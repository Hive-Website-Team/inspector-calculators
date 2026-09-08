import type { Metadata } from 'next';
import { calculators } from '@/calculators';
import { CATEGORY_LABELS, categoryBlurb, categoryLabel } from '@/lib/categories';
import { categoryIcon } from '@/lib/category-icons';
import { CalculatorSearch } from '@/components/calculator-search';
import { HeroArcs } from '@/components/arcs';
import { pageMetadata } from '@/lib/page-metadata';
import { collectionPageSchema } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Free calculators for home inspectors',
  description:
    'Free business and code-referenced calculators for professional home inspectors. Every formula names its source and the date it was checked.',
  path: '/',
});

/**
 * The little operator mark the reference sets beside the count — a red plus, a
 * yellow minus and a blue division sign stacked into one glyph. Decoration.
 */
function MathGlyph() {
  return (
    <svg
      className="home-hero-glyph"
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="var(--om-red)" strokeWidth="2.6" strokeLinecap="round">
        <path d="M4 7.5h8M8 3.5v8" />
      </g>
      <g stroke="var(--om-yellow)" strokeWidth="2.6" strokeLinecap="round">
        <path d="M18 7.5h8" />
      </g>
      <g stroke="var(--om-blue)" strokeWidth="2.6" strokeLinecap="round">
        <path d="M4 22.5h8" />
        <path d="M18 19h8M18 26h8" />
      </g>
      <circle cx="8" cy="17" r="1.6" fill="var(--om-blue)" />
      <circle cx="8" cy="28" r="1.6" fill="var(--om-blue)" />
    </svg>
  );
}

export default function HomePage() {
  const byCategory = new Map<string, typeof calculators>();
  for (const mod of calculators) {
    const list = byCategory.get(mod.record.category) ?? [];
    list.push(mod);
    byCategory.set(mod.record.category, list);
  }

  // Only categories that actually hold a calculator. An empty category page is
  // a thin page, and a tile reading "0 calculators" advertises the hole.
  const activeCategories = Object.keys(CATEGORY_LABELS).filter((c) => byCategory.has(c));

  const searchableList = calculators.map((c) => ({
    slug: c.record.slug,
    title: c.record.title,
    category: c.record.category,
    definition: c.record.definition,
  }));

  // First sentence of the definition — the card blurb.
  const blurb = (definition: string) => {
    const cut = definition.indexOf(', ');
    return cut > 60 ? `${definition.slice(0, cut)}.` : definition;
  };

  /* Every calculator on the site, enumerated for machines. The visible index
     below says the same thing in anchor text; this says it in a form an answer
     engine can read without parsing a card grid. */
  const collectionJsonLd = collectionPageSchema({
    name: 'All calculators',
    description:
      'Every calculator on Inspector Calculators, grouped by category. Each one states its formula, its assumptions and the primary source behind them.',
    path: '/',
    items: calculators.map(({ record }) => ({
      slug: record.slug,
      title: record.title,
      definition: record.definition,
    })),
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <div className="home-hero">
        {/* Omni's broken rings, cropped by the section edges. Decoration only. */}
        <HeroArcs />
        <div className="home-hero-inner">
          <div>
            {/* Three lines, as the reference sets them: a quiet lead-in, the
                count at roughly three times its height in the accent blue, then
                the noun. The little operator glyph rides beside the count. */}
            <h1 className="home-hero-title">
              {/*
                The spans are blocks, so the line breaks are visual — but
                `textContent` concatenates them, and raw-HTML parsers (which is
                how GPTBot, ClaudeBot and CCBot fetch) read that string. Without
                the explicit spaces this read "Built for home inspectors11 free
                calculators". The {' '} entries are load-bearing.
              */}
              <span className="home-hero-lead">Built for home inspectors</span>{' '}
              <span className="home-hero-count">
                {calculators.length} free
                <MathGlyph />
              </span>{' '}
              <span className="home-hero-word">calculators</span>
            </h1>
          </div>
          <div className="home-hero-search">
            <CalculatorSearch calculators={searchableList} />
            {/* The magnifier the reference puts inside the pill. Decorative —
                the input is already labelled, and this is not a button. */}
            <svg
              className="home-search-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.6-3.6" />
            </svg>
          </div>
        </div>

      {/* The panel lives inside the hero section so the wash and the cropped
          rings run down past it, as they do on the reference. */}
      <div className="home-panel">
        <p className="home-positioning">
          Free calculators for professional home inspectors. Every formula shows its source.
        </p>

        <div className="cat-grid hide-on-search">
          {activeCategories.map((category) => {
            const count = byCategory.get(category)!.length;
            return (
              <a key={category} href={`/category/${category}`} className="cat-tile">
                <span className="cat-tile-icon">{categoryIcon(category)}</span>
                <span className="cat-tile-name">{categoryLabel(category)}</span>
                <span className="cat-tile-count">
                  {count} calculator{count === 1 ? '' : 's'}
                </span>
              </a>
            );
          })}
        </div>
      </div>
      </div>

      {/* Trust strip — states the sourcing promise as page furniture rather than
          burying it on /methodology. Modelled on electricaltoolbox.com. */}
      <div className="trust-strip">
        <div className="trust-strip-inner">
          <div className="trust-item">
            <span className="trust-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="m8.5 12 2.5 2.5 4.5-5" />
              </svg>
            </span>
            <div>
              <h2 className="trust-title">Cited to the code</h2>
              <p className="trust-text">Section number and edition stated for every technical result. Default IRC 2021.</p>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19h16" />
                <path d="m4 15 4.5-5 3.5 3.5L20 5" />
              </svg>
            </span>
            <div>
              <h2 className="trust-title">Sourced, or it does not ship</h2>
              <p className="trust-text">
                Every assumption carries a primary source and the date it was checked. The build fails
                without one.
              </p>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="7" y="2.5" width="10" height="19" rx="2" />
                <path d="M11 18.5h2" />
              </svg>
            </span>
            <div>
              <h2 className="trust-title">No account, no email</h2>
              <p className="trust-text">Works on a phone in a crawlspace. No signup, no paywall, no popups.</p>
            </div>
          </div>
        </div>
      </div>

      {/*
        The categorized index TASK-1 §5 asks for — a category heading with an
        icon, then every calculator in it as a link with a one-line description.
        The card treatment is the Omni reference's; only the grouping is new, so
        the section satisfies §5 without leaving the supplied design.
      */}
      <section className="home-section" id="all-calculators">
        <div className="home-section-inner">
          <h2 className="home-section-title">All calculators</h2>

          {activeCategories.map((category) => (
            <div key={category} className="calc-group">
              <div className="calc-group-head">
                <span className="calc-group-icon">{categoryIcon(category)}</span>
                <h3 className="calc-group-title">
                  <a href={`/category/${category}`}>{categoryLabel(category)}</a>
                </h3>
                <span className="calc-group-rule" aria-hidden="true" />
                <span className="calc-group-count">
                  {byCategory.get(category)!.length} calculator
                  {byCategory.get(category)!.length === 1 ? '' : 's'}
                </span>
              </div>
              <p className="calc-group-blurb">{categoryBlurb(category)}</p>

              <div className="calc-grid">
                {byCategory.get(category)!.map(({ record }) => (
                  <a
                    key={record.slug}
                    href={`/${record.slug}`}
                    className="calc-card"
                    data-calculator-slug={record.slug}
                  >
                    <span className="calc-card-head">
                      <span className="calc-card-title">{record.title}</span>
                      <svg
                        className="calc-card-arrow"
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
                    </span>
                    <span className="calc-card-desc">{blurb(record.definition)}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
