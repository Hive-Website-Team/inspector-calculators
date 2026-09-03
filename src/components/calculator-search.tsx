'use client';

import { useEffect, useState } from 'react';

export interface SearchableCalculator {
  slug: string;
  title: string;
  category: string;
  definition: string;
}

/**
 * A client-side convenience filter on top of a list that is already fully
 * present in the server-rendered HTML (see the homepage). With JS disabled
 * this input simply does nothing — every calculator stays visible, which is
 * the readable-without-JS baseline the site requires.
 */
export function CalculatorSearch({ calculators }: { calculators: SearchableCalculator[] }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const q = query.trim().toLowerCase();
    const matches = q
      ? new Set(
          calculators
            .filter((c) => c.title.toLowerCase().includes(q) || c.definition.toLowerCase().includes(q))
            .map((c) => c.slug),
        )
      : null;

    document.querySelectorAll<HTMLElement>('[data-calculator-slug]').forEach((el) => {
      el.hidden = matches !== null && !matches.has(el.dataset.calculatorSlug ?? '');
    });

    // Collapse the category tiles while a search is active, so results are the
    // only thing on screen. CSS-only — see .hide-on-search in globals.css.
    document.body.dataset.searching = matches !== null ? 'true' : '';
  }, [query, calculators]);

  return (
    <input
      type="search"
      placeholder="Search calculators…"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      aria-label="Search calculators"
    />
  );
}
