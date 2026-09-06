import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/page-metadata';
import { CORRECTIONS_EMAIL } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'About',
  description:
    'Who builds Inspector Calculators, how code citations are verified, and how corrections are handled.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">About Inspector Calculators</h1>

      <p className="mt-6 leading-relaxed">
        Inspector Calculators is a free set of business and code-referenced calculators built
        for professional home inspectors — independent of what software an inspector uses,
        with no account, no email gate and no paywall.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Why it exists</h2>
      <p className="mt-2 leading-relaxed">
        Consumer &ldquo;what does an inspection cost&rdquo; calculators already exist in
        quantity. Tools for the business side of the profession — what a job actually costs
        to deliver, what a target income requires, whether a stair or a guard meets the
        code — mostly do not, and the ones that do rarely say where their numbers came from.
        A result you cannot trace is a result you cannot put in a report.
      </p>

      <h2 className="mt-10 text-xl font-semibold">How the numbers are verified</h2>
      <p className="mt-2 leading-relaxed">
        Code figures are read from the text of the cited edition, not from memory or from
        another site that quoted it. Vendor prices are read from that vendor&rsquo;s own
        published pricing page. Every one carries the date it was checked, shown on the
        calculator that uses it.
      </p>
      <p className="mt-4 leading-relaxed">
        The rule is enforced by the build rather than by good intentions: a calculator whose
        assumption has no source, or whose source URL is malformed, fails the build and
        cannot be published. A separate check re-requests every source URL and fails on any
        that stops resolving — which is how one calculator came to be withdrawn when its
        federal source was taken offline. That withdrawal is in the{' '}
        <a href="/changelog">changelog</a>, with the reason.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Corrections</h2>
      <p className="mt-2 leading-relaxed">
        If a formula, a source or a default value looks wrong, write to{' '}
        <a href={`mailto:${CORRECTIONS_EMAIL}`}>{CORRECTIONS_EMAIL}</a> with the calculator
        name and what looks off. Corrections that arrive with a better primary source are
        handled first. Anything that changes a formula or a figure is logged in the{' '}
        <a href="/changelog">changelog</a> with the date.
      </p>

      <h2 className="mt-10 text-xl font-semibold">What this site will not do</h2>
      <ul className="mt-2 list-disc pl-5 space-y-1">
        <li>Ask for an email address or an account to show a result.</li>
        <li>Publish a figure it cannot attribute to a primary source.</li>
        <li>State a code requirement without naming the edition it comes from.</li>
        <li>Recommend a vendor. Vendor prices appear as inputs you can edit, not as advice.</li>
      </ul>

      <p className="mt-10 text-sm text-[color-mix(in_srgb,var(--foreground)_65%,transparent)]">
        Nothing here is a substitute for the adopted code in your jurisdiction or for a
        licensed professional&rsquo;s judgement. Codes change by edition and by local
        amendment; confirm anything you intend to rely on with the authority having
        jurisdiction. See the <a href="/methodology">methodology</a> for how formulas are
        chosen and re-verified.
      </p>
    </div>
  );
}
