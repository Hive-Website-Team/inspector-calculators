import type { ReactNode } from 'react';

/**
 * One line icon per category, inline SVG.
 *
 * Inline rather than an icon package: these ship in the server HTML with no
 * dependency, no client JS and no extra request, which is the same reason the
 * site uses a system font stack instead of a webfont.
 */
const svg = (children: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);

export const CATEGORY_ICONS: Record<string, ReactNode> = {
  // Briefcase — running the business
  business: svg(
    <>
      <rect x="2.5" y="7" width="19" height="13" rx="2" />
      <path d="M8.5 7V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7" />
      <path d="M2.5 12.5h19" />
    </>,
  ),
  // Tag — what things cost
  pricing: svg(
    <>
      <path d="M3 12.5V4.5a1.5 1.5 0 0 1 1.5-1.5h8l8.5 8.5a1.5 1.5 0 0 1 0 2.1l-6.9 6.9a1.5 1.5 0 0 1-2.1 0Z" />
      <circle cx="7.75" cy="7.75" r="1.4" />
    </>,
  ),
  // Roof pitch
  roofing: svg(
    <>
      <path d="M2 13 12 4.5 22 13" />
      <path d="M5 11.5V20h14v-8.5" />
      <path d="M9.5 20v-5h5v5" />
    </>,
  ),
  // Bolt
  electrical: svg(<path d="M13.5 2.5 4.5 13.8h6.2L10 21.5l9.3-11.6h-6.4Z" />),
  // Droplet
  plumbing: svg(
    <>
      <path d="M12 2.8s6 6.4 6 10.6a6 6 0 0 1-12 0C6 9.2 12 2.8 12 2.8Z" />
      <path d="M9.4 14.4a2.7 2.7 0 0 0 2.6 2.6" />
    </>,
  ),
  // Framing / joists
  structure: svg(
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="1.5" />
      <path d="M2.5 10.2h19M2.5 14.4h19" />
      <path d="M8.5 5v14M15.5 5v14" />
    </>,
  ),
  // Airflow
  hvac: svg(
    <>
      <path d="M3 8.5h11a3 3 0 1 0-3-3" />
      <path d="M3 13h15a3 3 0 1 1-3 3" />
      <path d="M3 17.5h7" />
    </>,
  ),
  // Shield — code compliance
  safety: svg(
    <>
      <path d="M12 2.8 4.5 6v6c0 4.3 3.1 7.9 7.5 9.2 4.4-1.3 7.5-4.9 7.5-9.2V6Z" />
      <path d="m9 12 2.2 2.2L15.4 10" />
    </>,
  ),
};

export function categoryIcon(category: string): ReactNode {
  return CATEGORY_ICONS[category] ?? CATEGORY_ICONS.business;
}
