/**
 * Single source of truth for site identity and the schema.org entity graph.
 *
 * Ported from a convention proven on a sibling site (`src/data/seo.ts`):
 * every structured-data node referenced anywhere on the site is declared HERE
 * with a stable `@id`, and pages reference those `@id`s rather than declaring
 * their own. Duplicate inline Organization nodes were a real P0 bug on that
 * site — five of them fighting the canonical entity. Do not repeat it.
 *
 * SITE_URL is an env var because the domain is not registered yet. Set
 * NEXT_PUBLIC_SITE_URL before any production build; the fallback is dev-only.
 * NEXT_PUBLIC_ vars are inlined at BUILD time, so a deploy built without it
 * ships localhost URLs that no run-time setting can fix — that bug shipped
 * here once already. The guard below makes it impossible to repeat
 * and will produce wrong canonicals if it ever reaches production.
 */

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

if (!RAW_SITE_URL && (process.env.VERCEL || process.env.CI)) {
  throw new Error(
    'NEXT_PUBLIC_SITE_URL is not set. Building without it bakes ' +
      'http://localhost:3000 into robots.txt, sitemap.xml, every canonical ' +
      'and every JSON-LD @id. Set it on the deploy project before building.',
  );
}

export const SITE_URL = (RAW_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export const SITE_NAME = 'Inspector Calculators';
export const SITE_TAGLINE = 'Free calculators for professional home inspectors. Every formula shows its source.';

/**
 * Content freshness. A literal date, deliberately NOT `new Date()`.
 * Crawlers discount an always-now lastmod, and every page claiming to have
 * changed on every build is a negative signal. Bump this when content changes.
 */
export const CONTENT_LAST_REVIEWED = new Date('2026-09-07');

export const ids = {
  organization: `${SITE_URL}/#organization`,
  website: `${SITE_URL}/#website`,
  /*
    Every calculator is one entity that two kinds of page describe: its own
    page declares it in full, the home and category listings reference it.
    Both sides use this `@id` so a consumer resolves them to a single node
    rather than to a full record and an unrelated near-duplicate stub.
  */
  calculator: (slug: string) => `${SITE_URL}/${slug}#calculator`,
} as const;

/** Where a reader reports a wrong formula, source or default. */
export const CORRECTIONS_EMAIL = 'corrections@inspectorcalculators.com';

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': ids.organization,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_TAGLINE,
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#logo`,
      url: absoluteUrl('/icon'),
      width: 512,
      height: 512,
      caption: SITE_NAME,
    },
    // Something for a reader — and for Google's entity model — to attach a
    // reputation to. The site takes corrections; this is where they land.
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial corrections',
      email: CORRECTIONS_EMAIL,
      availableLanguage: 'English',
    },
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_TAGLINE,
    publisher: { '@id': ids.organization },
    inLanguage: 'en-US',
    // The inner-page header search is a plain GET form to /?q=, so this is a
    // real endpoint rather than a decorative claim.
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * The machine-readable half of a listing page.
 *
 * The home page and every category page are, structurally, a list of tools —
 * and until now nothing said so. They carried the Organization and WebSite
 * nodes from the layout plus a BreadcrumbList, so a crawler could tell what
 * the site was and where the page sat, but nothing enumerated what the page
 * actually lists. For a directory whose entire job is enumeration that is the
 * one node worth having: an answer engine asked "what calculators exist for
 * home inspectors" can read the list instead of inferring it from anchor text.
 *
 * Each entry references the calculator's own `@id`, so this resolves to the
 * same node the calculator page declares in full rather than to a stub.
 */
export function collectionPageSchema({
  name,
  description,
  path,
  items,
}: {
  name: string;
  description: string;
  path: string;
  items: { slug: string; title: string; definition: string }[];
}) {
  const url = absoluteUrl(path);
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url,
    name,
    description,
    isPartOf: { '@id': ids.website },
    publisher: { '@id': ids.organization },
    inLanguage: 'en-US',
    mainEntity: {
      '@type': 'ItemList',
      name,
      numberOfItems: items.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'WebApplication',
          '@id': ids.calculator(item.slug),
          name: item.title,
          url: absoluteUrl(`/${item.slug}`),
          description: item.definition,
          applicationCategory: 'BusinessApplication',
          isAccessibleForFree: true,
        },
      })),
    },
  };
}

export function rootJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema(), websiteSchema()],
  };
}

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
