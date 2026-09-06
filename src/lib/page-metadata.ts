import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site';

/**
 * One place that builds a page's canonical, Open Graph and Twitter tags.
 *
 * Before this existed only calculator pages set a canonical — the homepage,
 * the three static pages and all eight category pages emitted none, so any URL
 * variant that reached them (a tracking parameter, a trailing slash, a www
 * split) became a competing copy with nothing telling a crawler which one
 * counts. Nothing on the site emitted Open Graph tags at all, so a link pasted
 * into a group chat or a forum rendered as a bare URL.
 *
 * `description` is deliberately short. Google truncates a snippet around
 * 155–160 characters; the calculator `definition` runs past 250 and is written
 * for machines, so it stays in the page body and each record supplies a
 * separate `summary` for this.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = 'website',
  modified,
}: {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  modified?: string;
}): Metadata {
  const url = absoluteUrl(path);
  // The template in the root layout appends the site name; Open Graph has no
  // template, so it is applied here by hand.
  const fullTitle = path === '/' ? SITE_NAME : `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      locale: 'en_US',
      images: [{ url: absoluteUrl(`/opengraph-image?title=${encodeURIComponent(title)}`), width: 1200, height: 630, alt: fullTitle }],
      ...(modified ? { modifiedTime: modified } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [absoluteUrl(`/opengraph-image?title=${encodeURIComponent(title)}`)],
    },
  };
}

export { SITE_URL };
