import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { calculators } from '@/calculators';
import { CATEGORY_LABELS, categoryBlurb, categoryCoverage, categoryLabel } from '@/lib/categories';
import { categoryIcon } from '@/lib/category-icons';
import { pageMetadata } from '@/lib/page-metadata';
import { SITE_URL, absoluteUrl } from '@/lib/site';

export function generateStaticParams() {
  // Only categories holding a calculator get a page. The empty ones were
  // rendering "No calculators in this category yet" into the sitemap; an empty
  // page in a first crawl teaches Google the site has holes. They come back
  // automatically as soon as a calculator claims the category.
  return Object.keys(CATEGORY_LABELS)
    .filter((name) => calculators.some((c) => c.record.category === name))
    .map((name) => ({ name }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  if (!(name in CATEGORY_LABELS)) return {};
  const label = categoryLabel(name);
  const count = calculators.filter((c) => c.record.category === name).length;
  return pageMetadata({
    title: `${label} calculators`,
    description: `${count} free ${label.toLowerCase()} ${
      count === 1 ? 'calculator' : 'calculators'
    } for home inspectors. ${categoryBlurb(name)}`.slice(0, 155),
    path: `/category/${name}`,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!(name in CATEGORY_LABELS)) notFound();

  const list = calculators.filter((c) => c.record.category === name);
  const label = categoryLabel(name);

  /*
    Laid out from the reference's category page: a blue rounded-square icon
    badge beside the H1, the calculator count under it in grey, an intro
    paragraph, then the calculators as a two-column bulleted list of links.

    The reference's list carries link text only. Ours keeps a one-line
    description under each link — TASK-1 §5 asks a category page to be "the
    same list filtered", and the index it filters carries descriptions.
  */
  /* The page renders a visual breadcrumb; this is the machine-readable half,
     which category pages were missing while calculator pages had it. */
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: label, item: absoluteUrl(`/category/${name}`) },
    ],
  };

  return (
    <div className="cat-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="cat-page-inner">
        <nav aria-label="Breadcrumb" className="cat-page-crumb">
          <a href="/">Home</a> <span aria-hidden="true">›</span> <span>{label}</span>
        </nav>

        <h1 className="cat-page-title">
          <span className="cat-page-badge" aria-hidden="true">
            {categoryIcon(name)}
          </span>
          {label} Calculators
        </h1>

        <p className="cat-page-count">
          {list.length} calculator{list.length === 1 ? '' : 's'}
        </p>

        <p className="cat-page-intro">{categoryBlurb(name)}</p>

        <h2 className="cat-page-sub">What these calculators cover</h2>
        <p className="cat-page-cover">{categoryCoverage(name)}</p>

        <h2 className="cat-page-sub">
          {list.length > 0 ? `All ${label.toLowerCase()} calculators` : 'Nothing here yet'}
        </h2>

        {list.length > 0 ? (
          <ul className="cat-page-list">
            {list.map(({ record }) => (
              <li key={record.slug}>
                <a href={`/${record.slug}`}>{record.title}</a>
                <span className="cat-page-desc">{record.definition}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="cat-page-empty">
            No calculators in this category yet. Every calculator on the site is listed on the{' '}
            <a href="/#all-calculators">home page</a>.
          </p>
        )}
      </div>
    </div>
  );
}
