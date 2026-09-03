/**
 * Single source of truth for site identity and the schema.org entity graph.
 *
 * Ported from the convention proven on hiveinspect.com (`src/data/seo.ts`):
 * every structured-data node referenced anywhere on the site is declared HERE
 * with a stable `@id`, and pages reference those `@id`s rather than declaring
 * their own. Duplicate inline Organization nodes were a real P0 bug on that
 * site — five of them fighting the canonical entity. Do not repeat it.
 *
 * SITE_URL is an env var because the domain is not registered yet. Set
 * NEXT_PUBLIC_SITE_URL before any production build; the fallback is dev-only
 * and will produce wrong canonicals if it ever reaches production.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
).replace(/\/$/, '');

export const SITE_NAME = 'Inspector Calculators';
export const SITE_TAGLINE = 'Free calculators for professional home inspectors. Every formula shows its source.';

/**
 * The publisher is disclosed, not hidden. The site's credibility depends on a
 * reader being able to see who funds it and judge for themselves — concealing
 * it is what would actually damage the neutrality claim.
 */
export const PUBLISHER = {
  name: 'Hive Inspect',
  legalName: 'Synapse Mobility, Inc.',
  url: 'https://www.hiveinspect.com',
} as const;

/**
 * Content freshness. A literal date, deliberately NOT `new Date()`.
 * Crawlers discount an always-now lastmod, and every page claiming to have
 * changed on every build is a negative signal. Bump this when content changes.
 */
export const CONTENT_LAST_REVIEWED = new Date('2026-09-03');

export const ids = {
  organization: `${SITE_URL}/#organization`,
  website: `${SITE_URL}/#website`,
  publisher: `${PUBLISHER.url}/#organization`,
} as const;

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': ids.organization,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_TAGLINE,
    parentOrganization: {
      '@type': 'Organization',
      '@id': ids.publisher,
      name: PUBLISHER.name,
      legalName: PUBLISHER.legalName,
      url: PUBLISHER.url,
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
