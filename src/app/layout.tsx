import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { FooterArc } from '@/components/arcs';
import { calculators } from '@/calculators';
import { CATEGORY_LABELS, categoryLabel } from '@/lib/categories';
import { categoryIcon } from '@/lib/category-icons';
import { CONTENT_LAST_REVIEWED, SITE_NAME, SITE_TAGLINE, SITE_URL, rootJsonLd } from '@/lib/site';
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
        {/* Omni centres its wordmark and keeps the bar white. The Log in /
            Sign up pair on the right is deliberately not reproduced — this site
            has no accounts, and the hero promises "no signup". */}
        <header className="site-header">
          <div className="site-header-inner">
            <span />
            <a href="/" className="site-wordmark">
              {SITE_NAME}
            </a>
            <nav className="site-header-nav">
              <a href="/methodology">Methodology</a>
              <a href="/about">About</a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="site-footer">
          <FooterArc />
          <div className="site-footer-inner">
            <div className="site-footer-brand">
              <p className="site-footer-tagline">Every formula shows its source.</p>
              <p className="site-footer-name">{SITE_NAME}</p>
              <p className="site-footer-note">
                Every formula states the source it comes from and the date it was last
                checked. A calculator that cannot be sourced does not ship — see the{' '}
                <a href="/methodology">methodology</a>.
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
            <span>© {CONTENT_LAST_REVIEWED.getUTCFullYear()} {SITE_NAME}</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
