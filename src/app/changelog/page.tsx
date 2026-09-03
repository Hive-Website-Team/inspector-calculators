import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Changelog' };

const ENTRIES: { date: string; text: string }[] = [
  { date: '2026-09-03', text: 'Launch: added the Inspection Business Profitability calculator.' },
  { date: '2026-09-03', text: 'Launch: added the Revenue Goal to Inspections Needed calculator.' },
  { date: '2026-09-03', text: 'Launch: added the Startup Cost Planner.' },
  { date: '2026-09-03', text: 'Launch: added the Cost Per Inspection calculator.' },
  { date: '2026-09-03', text: 'Launch: added the Software Total Cost of Ownership calculator.' },
  { date: '2026-09-03', text: 'Launch: added the Attic Ventilation calculator (IRC 2021 R806.2).' },
  { date: '2026-09-03', text: 'Launch: added the Stair Rise and Run Compliance calculator (IRC 2021 R311.7.5).' },
  { date: '2026-09-03', text: 'Launch: added the Deck Joist Span calculator (AWC DCA 6-15, Southern Pine).' },
  { date: '2026-09-03', text: 'Launch: added the Guard and Handrail Height Compliance calculator (IRC 2021 R312.1.2, R311.7.8).' },
  { date: '2026-09-04', text: 'Added the Home Inspection Software Pricing calculator, comparing flat-subscription, tiered per-inspection, and per-user seat pricing models (Spectora, ISN, and Palm-Tech published prices, checked 2026-09-04).' },
  { date: '2026-09-04', text: 'Added the Roof Pitch and Area calculator. Pitch multiplier and roof area are geometry; the minimum roof slopes it checks against are IRC 2021 R905, read from the free public code text.' },
  { date: '2026-09-04', text: 'Removed the Water Heater Sizing (First-Hour Rating) calculator. Its only source, the Department of Energy sizing page, was taken offline along with the rest of energy.gov/energysaver, and no replacement primary source for the per-use gallon figures could be found. An unsourced figure is not published here.' },
];

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Changelog</h1>
      <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--foreground)_65%,transparent)]">
        One line per calculator added or formula changed, dated.
      </p>
      <ul className="mt-6 space-y-3">
        {ENTRIES.map((entry, i) => (
          <li key={i} className="flex gap-4">
            <span className="font-mono text-sm text-[color-mix(in_srgb,var(--foreground)_60%,transparent)] shrink-0">{entry.date}</span>
            <span>{entry.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
