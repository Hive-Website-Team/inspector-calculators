import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">About Inspector Calculators</h1>

      <p className="mt-6 leading-relaxed">
        Inspector Calculators is a free, focused set of business and code-referenced calculators
        built for professional home inspectors — independent of what software an inspector uses.
      </p>

      <p className="mt-4 leading-relaxed">
        Every formula on this site states the source it comes from — a building code section, a federal
        rate, or a vendor's own published pricing — with the date it was last checked. If a calculator
        cannot be sourced, it does not ship. See the <a href="/methodology">methodology page</a> for how
        that gate works.
      </p>

    </div>
  );
}
