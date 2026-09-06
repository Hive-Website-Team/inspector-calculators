import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { FooterArc } from '@/components/arcs';
import { SiteHeader } from '@/components/site-header';
import { calculators } from '@/calculators';
import { CATEGORY_LABELS, categoryLabel } from '@/lib/categories';
import { categoryIcon } from '@/lib/category-icons';
import { CONTENT_LAST_REVIEWED, CORRECTIONS_EMAIL, SITE_NAME, SITE_TAGLINE, SITE_URL, rootJsonLd } from '@/lib/site';
import './globals.css';

// Only categories that hold a calculator — an empty category page is a thin page.
const activeCategories = Object.keys(CATEGORY_LABELS).filter((c) =>
  calculators.some((m) => m.record.category === c),
);

/*
  Poppins, via next/font.
  This replaces an earlier deliberate choice of a pure system stack. The reason
  that choice was made — no network dependency at request time — still holds:
  next/font downloads the face at BUILD time and serves it from our own origin
  with a preload hint, so there is no third-party request when a page loads.
  What changes is that the geometric sans is the loudest single signal in the
  Omni reference, and a system stack cannot carry it.
*/
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_TAGLINE,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`h-full antialiased ${poppins.variable}`}>
      <head>
        {/* Plain <script>, not next/script — must be present in server-rendered HTML for
            crawlers that do not run JavaScript. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(rootJsonLd()) }} />
      </head>
      <body className="min-h-full flex flex-col">
        <SiteHeader siteName={SITE_NAME} categories={activeCategories} />
        <main className="flex-1">{children}</main>
        <footer className="site-footer">
          <FooterArc />
          <div className="site-footer-inner">
            {/* Tagline and wordmark only, as the reference sets it: the arc
                behind this column needs the space below the wordmark to run
                through. The sourcing promise moves to the bottom bar. */}
            <div className="site-footer-brand">
              <p className="site-footer-tagline">We show our work!</p>
              <p className="site-footer-name">{SITE_NAME}</p>
            </div>

            <nav className="site-footer-cols" aria-label="Footer">
              <div className="site-footer-col site-footer-col-wide">
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
                <h2 className="site-footer-heading">How this works</h2>
                <ul className="site-footer-links">
                  <li><a href="/methodology">Methodology</a></li>
                  <li><a href="/changelog">Changelog</a></li>
                  <li><a href={`mailto:${CORRECTIONS_EMAIL}`}>Report an error</a></li>
                </ul>
              </div>

              <div className="site-footer-col">
                <h2 className="site-footer-heading">Meet the site</h2>
                <ul className="site-footer-links">
                  <li><a href="/about">About</a></li>
                  <li><a href="/#all-calculators">All calculators</a></li>
                </ul>
              </div>
            </nav>
          </div>

          <div className="site-footer-bar">
            <div className="site-footer-bar-inner">
              <span>Every formula states its source and the date it was checked.</span>
              <a href="/methodology">Methodology &amp; corrections</a>
              <span>© {CONTENT_LAST_REVIEWED.getUTCFullYear()} {SITE_NAME}</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
