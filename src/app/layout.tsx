import type { Metadata } from 'next';
import { calculators } from '@/calculators';
import { CATEGORY_LABELS, categoryLabel } from '@/lib/categories';
import { categoryIcon } from '@/lib/category-icons';
import { CONTENT_LAST_REVIEWED, SITE_NAME, SITE_TAGLINE, SITE_URL, rootJsonLd } from '@/lib/site';
import './globals.css';

// Only categories that hold a calculator — an empty category page is a thin page.
const activeCategories = Object.keys(CATEGORY_LABELS).filter((c) =>
  calculators.some((m) => m.record.category === c),
);

// A system font stack, not next/font/google: it renders instantly with zero
// network dependency at build or request time, which matters more for a
// tool site than a custom webfont does. See src/app/globals.css for the
// --font-sans / --font-mono stacks.

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_TAGLINE,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Plain <script>, not next/script — must be present in server-rendered HTML for
            crawlers that do not run JavaScript. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(rootJsonLd()) }} />
      </head>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between gap-4">
            <a href="/" className="font-semibold">
              {SITE_NAME}
            </a>
            <nav className="text-sm flex gap-4">
              <a href="/methodology">Methodology</a>
              <a href="/about">About</a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="site-footer">
          <div className="site-footer-inner">
            <div className="site-footer-brand">
              <p className="site-footer-tagline">Every formula shows its source.</p>
              <p className="site-footer-name">{SITE_NAME}</p>
              <p className="site-footer-note">
                Published by Hive Inspect (Synapse Mobility, Inc.). Disclosed on the{' '}
                <a href="/about">About page</a>, which carries the only link to that product
                anywhere on this site.
              </p>
            </div>

            <nav className="site-footer-cols" aria-label="Footer">
              <div className="site-footer-col">
                <h2 className="site-footer-heading">Calculator categories</h2>
                <ul className="site-footer-cats">
                  {activeCategories.map((category) => (
                    <li key={category}>
                      <span className="site-footer-cat-icon">{categoryIcon(category)}</span>
                      <a href={`/category/${category}`}>{categoryLabel(category)}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="site-footer-col">
                <h2 className="site-footer-heading">How this site works</h2>
                <ul className="site-footer-links">
                  <li><a href="/methodology">Methodology</a></li>
                  <li><a href="/changelog">Changelog</a></li>
                  <li><a href="/about">About</a></li>
                </ul>
              </div>
            </nav>
          </div>

          <div className="site-footer-bar">
            <span>© {CONTENT_LAST_REVIEWED.getUTCFullYear()} Synapse Mobility, Inc.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
