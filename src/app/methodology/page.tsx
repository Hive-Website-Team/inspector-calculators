import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/page-metadata';
import { CORRECTIONS_EMAIL } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Methodology',
  description:
    'How formulas are chosen, how every source is cited and dated, how often values are re-verified, and how to report an error.',
  path: '/methodology',
});

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Methodology</h1>

      <h2 className="mt-8 text-lg font-semibold">How formulas are chosen</h2>
      <p className="mt-2 leading-relaxed">
        Business calculators use plain arithmetic on the numbers an inspector enters. Code-referenced
        calculators use the specific formula and figures stated in the cited code section, for the code
        edition named on that calculator's page — codes change by edition and by local amendment, which is
        why every technical calculator names both.
      </p>

      <h2 className="mt-8 text-lg font-semibold">How sources are cited and verified</h2>
      <p className="mt-2 leading-relaxed">
        Every calculator carries at least one sourced assumption with a link and the date it was checked.
        A calculator cannot be published without one — the site's build fails automatically if a source is
        missing, malformed, or points at a related calculator that does not exist.
      </p>

      <h2 className="mt-8 text-lg font-semibold">How often values are re-verified</h2>
      <p className="mt-2 leading-relaxed">
        Figures tied to a fixed code section (like stair riser height) do not change often and are
        re-checked when the underlying code edition updates. Figures tied to a vendor's price or a federal
        rate (like software costs or the IRS mileage rate) are re-checked at least quarterly, since those
        change more often — see the <a href="/changelog">changelog</a> for when each was last touched.
      </p>

      <h2 className="mt-8 text-lg font-semibold">Reporting an error</h2>
      <p className="mt-2 leading-relaxed">
        If a formula, source, or default value looks wrong, write to{' '}
        <a href={`mailto:${CORRECTIONS_EMAIL}`}>{CORRECTIONS_EMAIL}</a> and say which
        calculator and what looks off. Corrections that come with a better primary source
        are handled fastest, and anything that changes a formula or a figure is logged in
        the <a href="/changelog">changelog</a> with the date it changed.
      </p>

      <h2 className="mt-8 text-lg font-semibold">What this site will not do</h2>
      <ul className="mt-2 list-disc pl-5 space-y-1">
        <li>No calculator ships without a sourced assumption.</li>
        <li>No email address or account is ever required to use a calculator.</li>
        <li>No consumer &quot;what does an inspection cost&quot; tools — this site is for the business side of the profession.</li>
      </ul>
    </div>
  );
}
