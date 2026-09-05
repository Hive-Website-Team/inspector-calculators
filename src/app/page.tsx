import { calculators } from '@/calculators';
import { CATEGORY_LABELS, categoryLabel } from '@/lib/categories';
import { categoryIcon } from '@/lib/category-icons';
import { CalculatorSearch } from '@/components/calculator-search';
import { HeroArcs } from '@/components/arcs';

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

  return (
    <>
      <div className="home-hero">
        {/* Omni's broken rings, cropped by the section edges. Decoration only. */}
        <HeroArcs />
        <div className="home-hero-inner">
          <div>
            {/* Standards eyebrow — the electricaltoolbox.com pattern: state the
                code edition and the no-signup promise before anything else. */}
            <p className="home-eyebrow">Free · IRC 2021 · No signup</p>
            <h1 className="home-hero-title">
              Every formula,
              <br />
              <span className="home-hero-count">{calculators.length} free</span>
              <br />
              calculators
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
      </div>


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

      {/* Dense categorized index — the calculator.net pattern named in TASK-1 §0
          and §5: category headings, every calculator a link with a one-line
          description, columns rather than cards, no decoration between the
          reader and the list. */}
      <section className="home-section">
        <h2 className="home-section-title">All calculators</h2>
        {/* Card grid, as in the Omni reference: title with a trailing arrow, a
            short description, and the category as a quiet label at the foot.
            The per-category grouping the previous list carried now lives in the
            tiles above and on each /category page, so nothing was lost. */}
        <div className="calc-grid">
          {calculators.map(({ record }) => (
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
              <span className="calc-card-cat">{categoryLabel(record.category)}</span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
