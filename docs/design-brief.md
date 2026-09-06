# Design brief — InspectorCalculators.com

**Status: for Alka's approval (§7 of `TASK-1-calculators.md`).**
Rewritten 2026-09-04 against the reference sites named in the project files. The previous
version of this file cited Stripe docs, caniuse and Bankrate — none of which appear anywhere in
the task files. That was the error being corrected here.

All four references below were opened and read on 2026-09-04. HTTP status recorded per site.

---

## 1. The references the project actually names

### Primary — `TASK-1-calculators.md` §0

| Site | Status | What the task file says to take | What to ignore |
|---|---|---|---|
| omnicalculator.com | 200 | Page layout: inputs top, live result, then explanation / formula / assumptions **below** the tool | Their 3,000-calculator scale; their ads |
| calculator.net | 200 | Information architecture: flat root-level URLs, dense categorized homepage, zero decoration | Their 2005 visual design |
| electricaltoolbox.com | 200 | **Methodology pattern**: every calculator shows the formula, the assumptions, and cites the code table + edition. *"This is what makes a calculator citable."* | — |

### Secondary — same section, 10 minutes each

fixercalc.com (editable assumptions, "last reviewed" values) · fieldservicecompare.com/resources/calculators/ · servicetitan.com/tools

### Also named in `deep-research-report.md` (lines 250–276)

A 21-row adjacent-industry table. The two rows that matter for this site:

- **ElectricalToolbox** — *"Excellent methodology pattern: every calculator exposes assumptions and references the underlying standards/tables."* The report calls it *"particularly relevant to your AI-search ambition,"* because showing the formula and citing the table + edition "creates a much more verifiable information object than an opaque calculator result."
- **FixerCalc** — *"Particularly good methodology language: editable assumptions, reproducible formulas, last-reviewed values."*

`TASK-1` §7 also lists siteinspire.com, godly.website and land-book.com as hunting grounds for
additional *visual* references. Not used — the three primaries plus FixerCalc were enough to
settle the structure, and adding more would have delayed the §7 approval this file is asking for.

---

## 2. What each reference actually looks like, and what was taken

### electricaltoolbox.com — the section order (this is the big one)

Their voltage-drop calculator page, heading structure as read on 2026-09-04:

```
H1: Voltage Drop Calculator
  H2: How to use this calculator
  H2: NEC reference
  H2: Voltage drop formula
  H2: Worked example
  H2: Common mistakes
  H2: Frequently asked questions   (real H2/H3 — not accordions)
  H2: Guides
  H2: Related calculators
```

What makes it citable, in their own words:

- The **code reference is its own section**, not a footnote. It names the edition (*NEC 2020*), the specific tables (*Chapter 9, Table 8 and Table 9*), the conditions the values assume (*75 °C basis at unity power factor*), and the code sections behind the compliance judgement (*210.19(A)(1) IN No. 4, 215.2(A)(1) IN No. 2*).
- It ends with a standing **verification note**: *"Results are for reference only. Verify against the applicable adopted edition of the NEC and consult a licensed electrician."*
- The **formula section defines every variable** — "R is resistance in ohms per 1000 ft, I is current in amps, L is the one-way distance in feet" — and explains *why* each factor exists.
- The **worked example shows every step of arithmetic**, then interprets the result and says what to do about it: *"At 3.29% this exceeds the 3% recommendation… stepping up to #10 copper drops it to about 2.07%."*
- **Common mistakes** names the specific ways a correct formula gives a wrong answer.

**Taken: all of it.** The page template now follows this section order exactly.

### omnicalculator.com — page furniture

Their roof-pitch page: `Last updated: August 14, 2026` sits **above** the H1; named **Creators**
and **Reviewers** with avatars and profile links directly under it; the calculator sits in a
bordered card to the right of the intro; a table of contents follows; FAQs are real H3s.

**Taken:** the visible-date-and-attribution block above the fold, and inputs-above-explanation
ordering. **Not taken:** the two-column desktop split — at our page width a single column keeps
the result numbers larger, and it is one less thing to get wrong on mobile.
**Deliberately deferred:** named creator/reviewer. We have no credentialed reviewer yet, and
`THREE_SITES_BRIEF.md` §6 lists that as an open blocker. Placeholder bylines would be worse than
none — see the pilot's `PENDING REVIEWER` problem.

### calculator.net — information architecture

Flat root-level URLs, one dense categorized homepage, near-zero chrome, no hero.

**Taken, already in place:** `/attic-ventilation-calculator`, not `/tools/…`. Homepage is
category headings with one-line descriptions and a client-side filter box. No hero image.

### fixercalc.com — methodology language

Homepage is `Popular calculators` → `All categories` → **`No fake quotes`**, an honesty section
stating what the site will not do. Calculator titles are descriptive: *"Roof Cost Calculator:
Estimate Roof Replacement Cost."*

**Taken:** the "what this site will not do" stance, which already exists on `/methodology`, and
per-assumption `accessed` dates rendered in the table rather than a single page-level date.

---

## 3. Palette and type

One accent, one type pair, per `tasks/README.md` §3 and `TASK-1` §7. No Tailwind Plus licence.

| Token | Light | Dark |
|---|---|---|
| `--background` | `#ffffff` | `#0a0a0a` |
| `--foreground` | `#171717` | `#ededed` |
| `--surface` (calculator card only) | `#f6f7f9` | `#141414` |
| `--border` | `#e2e5ea` | `#2a2a2a` |
| `--accent` | `#2563eb` | `#5b8def` |

Accent is used only for links, the definition block's left rule, and active states. Dark mode via
`prefers-color-scheme`, no toggle.

**Type — one open decision for Alka.** `TASK-1` §7 says *"Inter + JetBrains Mono for numbers is
fine."* The build currently uses a **system sans stack** plus a system mono stack instead, to
avoid a webfont round-trip. The task file's wording is permissive, so this is allowed rather than
a deviation — but if you want the named pair it is a two-line change in the `@theme` block of
`globals.css`. **Recommendation: keep the system stack.** It costs nothing at load, and Lighthouse
mobile ≥ 90 is a launch requirement.

Mono is reserved for numerics — every input field and every computed result — so data reads as
data. Result values are large and bold; labels stay small and muted.

---

## 4. How this maps to the code

| Decision | Where it lives |
|---|---|
| Palette, type stacks, calculator card | `src/app/globals.css` (`:root` + `@media (prefers-color-scheme: dark)`) |
| Section order | `src/app/[slug]/page.tsx` |
| Per-calculator "Common mistakes" / FAQs | optional `commonMistakes` and `faqs` fields, `src/lib/calculator-schema.ts` |
| Verification note | `verificationNote` field, falling back to a category-aware default |

Every colour is a CSS variable, so a palette change is an edit to five lines, not a rebuild.

---

## 5. Open items

**Superseded 2026-09-07.** The owner supplied screenshots of the pages this site should
look like and instructed that they be followed exactly, ignoring the design direction in
`TASK-1` §7. The UI was rebuilt against them — home, `/category/<name>` and `/<slug>`.
What follows is the state of the items this brief used to leave open.

1. ~~**Type pair** — system stack or Inter + JetBrains Mono?~~ **Closed.** Neither. The
   site ships Poppins via `next/font`, which downloads at build time and is served from
   our own origin, so there is no third-party request at page load. It is the loudest
   single signal in the supplied reference and a system stack cannot carry it.

2. ~~**Backfill `commonMistakes` and `faqs`** — currently populated on 2 of 11
   calculators.~~ **Withdrawn — this was never true.** Neither field exists in
   `calculator-schema.ts` nor in any record; nothing renders them. `TASK-1` §11 also
   forbids FAQ content and accordions outright, so the FAQ half should not be built at
   all. If a "common mistakes" section is still wanted it is a fresh schema field plus
   eleven pieces of sourced prose, not a backfill.

3. **Compliance status badge** — still open. ElectricalToolbox prints a pass/fail badge on
   the result for code checks. The stair, guard and deck calculators already compute the
   comparison and render it as plain numbers ("Riser over the limit by: 0 in"). Turning
   that into a badge needs a schema field, so it needs sign-off.

4. **Named reviewer** — still blocked on `THREE_SITES_BRIEF.md` §6.

5. **Light theme only** — new. `TASK-1` §7 asks for dark mode via `prefers-color-scheme`;
   the owner asked for white only, so the dark branch was removed rather than left dead
   in the stylesheet. Reinstating it means redefining every token in a second block.
