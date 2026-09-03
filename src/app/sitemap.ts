import type { MetadataRoute } from 'next';
import { calculators } from '@/calculators';
import { CATEGORY_LABELS } from '@/lib/categories';
import { CONTENT_LAST_REVIEWED, absoluteUrl } from '@/lib/site';

/**
 * lastModified comes from each calculator's own `dateModified`, falling back
 * to CONTENT_LAST_REVIEWED for static pages — never `new Date()`. A sitemap
 * that claims every URL changed on every build teaches crawlers to ignore
 * the field.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: CONTENT_LAST_REVIEWED, priority: 1 },
    { url: absoluteUrl('/methodology'), lastModified: CONTENT_LAST_REVIEWED, priority: 0.5 },
    { url: absoluteUrl('/about'), lastModified: CONTENT_LAST_REVIEWED, priority: 0.5 },
    { url: absoluteUrl('/changelog'), lastModified: CONTENT_LAST_REVIEWED, priority: 0.4 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = Object.keys(CATEGORY_LABELS).map((name) => ({
    url: absoluteUrl(`/category/${name}`),
    lastModified: CONTENT_LAST_REVIEWED,
    priority: 0.6,
  }));

  const calculatorRoutes: MetadataRoute.Sitemap = calculators.map((mod) => ({
    url: absoluteUrl(`/${mod.record.slug}`),
    lastModified: new Date(mod.record.dateModified),
    priority: 0.9,
  }));

  return [...staticRoutes, ...categoryRoutes, ...calculatorRoutes];
}
