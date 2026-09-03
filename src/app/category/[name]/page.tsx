import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { calculators } from '@/calculators';
import { CATEGORY_LABELS, categoryLabel } from '@/lib/categories';

export function generateStaticParams() {
  return Object.keys(CATEGORY_LABELS).map((name) => ({ name }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  if (!(name in CATEGORY_LABELS)) return {};
  return { title: `${categoryLabel(name)} calculators` };
}

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!(name in CATEGORY_LABELS)) notFound();

  const list = calculators.filter((c) => c.record.category === name);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="text-sm mb-4 text-[color-mix(in_srgb,var(--foreground)_65%,transparent)]">
        <a href="/">Home</a> <span aria-hidden="true">›</span> <span>{categoryLabel(name)}</span>
      </nav>
      <h1 className="text-2xl font-semibold">{categoryLabel(name)} calculators</h1>
      <ul className="mt-6 grid gap-4">
        {list.map((mod) => (
          <li key={mod.record.slug}>
            <a href={`/${mod.record.slug}`} className="font-medium">
              {mod.record.title}
            </a>
            <p className="text-sm text-[color-mix(in_srgb,var(--foreground)_65%,transparent)]">{mod.record.definition}</p>
          </li>
        ))}
        {list.length === 0 && <p>No calculators in this category yet.</p>}
      </ul>
    </div>
  );
}
