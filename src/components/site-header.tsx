'use client';

import { usePathname } from 'next/navigation';
import { categoryLabel } from '@/lib/categories';

/**
 * Two header variants, as the reference has them.
 *
 * The home page centres the wordmark and carries no search in the bar — the
 * hero already holds a large one. Every inner page moves the wordmark left,
 * puts a search pill in the middle, and adds a second row of category tabs
 * with the current one underlined.
 *
 * A client component only because the variant depends on the current path.
 * The search is a plain GET form, so it works with JavaScript disabled: it
 * lands on the home index with `?q=`, which the home search reads on load.
 */
export function SiteHeader({
  siteName,
  categories,
}: {
  siteName: string;
  categories: string[];
}) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const activeCategory = pathname.startsWith('/category/') ? pathname.split('/')[2] : null;

  if (isHome) {
    return (
      <header className="site-header">
        <div className="site-header-inner">
          <span />
          <a href="/" className="site-wordmark">
            {siteName}
          </a>
          <nav className="site-header-nav">
            <a href="/methodology">Methodology</a>
            <a href="/#all-calculators" className="site-header-cta">
              Browse calculators
            </a>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="site-header site-header-inner-page">
      <div className="site-header-bar">
        <a href="/" className="site-wordmark site-wordmark-left">
          {siteName}
        </a>

        <form className="site-header-search" action="/" method="get" role="search">
          <input
            type="search"
            name="q"
            placeholder="Search calculators…"
            aria-label="Search calculators"
          />
          <button type="submit" aria-label="Search">
            <svg
              width="22"
              height="22"
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
          </button>
        </form>

        <nav className="site-header-nav">
          <a href="/methodology">Methodology</a>
          <a href="/#all-calculators" className="site-header-cta">
            Browse calculators
          </a>
        </nav>
      </div>

      <nav className="site-catbar" aria-label="Calculator categories">
        <ul>
          {categories.map((category) => (
            <li key={category}>
              <a
                href={`/category/${category}`}
                aria-current={activeCategory === category ? 'page' : undefined}
              >
                {categoryLabel(category)}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
