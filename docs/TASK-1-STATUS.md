# Task 1 — Inspector Calculators: status

**Site 1 of 3** · Branch `task-1-calculators` · Written 2026-09-04

Nothing is deployed. Nothing is merged to `main`. Per `tasks/README.md` §7, the work
sits on a branch and Alka merges and deploys.

---

## 1. Where things stand in one line

The build is complete and every check that can run without a live domain passes.
Five decisions and the deployment itself are Alka's.

---

## 2. What was built

### 11 calculators

Every calculator is a validated TypeScript record with a pure `compute()` function. The
page renders from the record; prose is secondary.

| # | Calculator | Category | Sourced to |
|---|---|---|---|
| 1 | Inspection Business Profitability | Business | IRS standard mileage rate |
| 2 | Revenue Goal → Inspections Needed | Business | *(see open decision 4)* |
| 3 | Startup Cost Planner | Business | Spectora published pricing |
| 4 | Cost Per Inspection | Pricing | Spectora published pricing |
| 5 | Software Total Cost of Ownership | Pricing | Spectora published pricing |
| 6 | Home Inspection Software Pricing | Pricing | Spectora · ISN · Palm-Tech published pricing |
| 7 | Roof Pitch & Area | Roofing | IRC 2021 R905.2.2–R905.8.2 |
| 8 | Attic Ventilation (NFA) | Roofing | IRC 2021 R806.2 |
| 9 | Stair Rise/Run Compliance | Safety | IRC 2021 R311.7.5 |
| 10 | Deck Joist Span | Structure | AWC DCA 6-15 Table 2 |
| 11 | Guard & Handrail Height | Safety | IRC 2021 R312.1.2, R311.7.8 |

`TASK-1` §6 sets the bar at *"11 total, ship at 10."* Eleven ship.

### Pages

`/` · `/methodology` · `/about` · `/changelog` · eight `/category/<name>` pages · one
root-level page per calculator (`/attic-ventilation-calculator`, not `/tools/...`).

### Infrastructure

- **Build gate** (`scripts/check-content.mjs`) — validates every record against the Zod
  schema before `next build`. No calculator ships without a sourced assumption.
- **SSR check** (`scripts/check-ssr.mjs`) — every sitemap URL resolves, JSON-LD is in
  server HTML, robots.txt has no bare `Disallow: /`.
- **Source check** (`scripts/check-sources.mjs`) — *new.* `TASK-1` §9 required this and it
  did not exist. Curls every source URL and fails on anything that is not reachable.
  Sites that refuse bots come back as MANUAL, not FAIL.
- `robots.ts` — 25 AI crawlers + 6 search crawlers, each an explicit allow group.
- `sitemap.ts` — per-page `dateModified`, never `new Date()`.

### Design

Built against the three references named in `TASK-1` §0, each for what the task says to
take from it:

| Reference | Taken |
|---|---|
| omnicalculator.com | Page craft — gradient hero, count headline, pill search, category tiles |
| calculator.net | Information architecture — flat root URLs, dense categorized index, no decoration |
| electricaltoolbox.com | Methodology pattern — code-edition eyebrow, trust strip, sources stated as page furniture |

One accent colour, one type pair, dark mode via `prefers-color-scheme`.
Full write-up and open questions in `docs/design-brief.md`.

---

## 3. Verification

All run against a production build.

```
Content check passed — 11 calculators, every one carries a sourced assumption
SSR check passed     — 23 URLs, all resolve with server-rendered schema
Source check passed  — 10 of 10 source URLs return 200
Lighthouse mobile    — Performance 96 · Accessibility 96 · Best Practices 100 · SEO 100
JS disabled          — 11/11 calculators show a complete computed result (44 values)
Mobile 360 & 390px   — 16/16 pages, no horizontal scroll, no overflowing elements
```

**Build gate proven both ways.** Removing the source from one assumption:

```
Content check FAILED — 1 problem(s) in 11 calculator(s):
  ✗ attic-ventilation-calculator
    assumptions.0.source: Invalid input: expected object, received undefined
```

Restored:

```
Content check passed — 11 calculator(s), every one carries a sourced assumption.
```

### Numbers checked against the primary source, not from memory

- **Deck joist spans** — all 12 Southern Pine values extracted from the AWC DCA 6-15 PDF
  and compared cell by cell against Table 2. All 12 correct, including the load and
  service conditions in the stated assumption.
- **Roof slopes** — IRC 2021 R905.2.2 through R905.8.2 read from the free public code
  text. ICC's own viewer paywalls the section body behind a sign-in.
- **Vendor pricing** — Spectora, ISN and Palm-Tech read off their own published pricing
  pages, each dated 2026-09-04. The calculator's prepaid output ($1,089.56) independently
  reproduces Spectora's published $1,090/yr, which validates the derived 16.7% discount.
- **Worked examples** — every calculator's example recomputed and checked by hand.

### Fleet rules

```
FAQPage schema        0
HowTo schema          0
Accordions / <details> 0
images.unoptimized    absent
new Date() in sitemap absent
Hive links            1 (on /about only), 0 everywhere else
Bare "Disallow: /"    0 under GPTBot, ClaudeBot, OAI-SearchBot
```

---

## 4. One calculator was removed

**Water Heater Sizing (First-Hour Rating)** — deleted, not shipped.

Its only source was a Department of Energy sizing page. That page is gone, and so is the
entire `energy.gov/energysaver` section with it. Five candidate replacement URLs were
checked; all returned 404. A DOE Building America PDF that is still live turned out not to
contain the per-use gallon worksheet.

`tasks/README.md` §2.1 is unambiguous: *"If you cannot find a primary source for a claim,
delete the claim."* Removed and logged in `/changelog` with the reason.

This is why the source check exists now — a citation that returns 404 is an unsourced
claim, and nothing in the build was catching it.

---

## 5. Pending on Alka

### Decisions

1. **Domain and `NEXT_PUBLIC_SITE_URL`.**
   Canonicals and entity `@id`s currently read from a placeholder.
   **Confirm the domain will NOT sit behind Cloudflare Managed robots.txt.** This is the
   one thing that silently kills the project — it prepends `Disallow: /` for AI bots above
   whatever `robots.ts` emits, and it cost hiveinspect.com months.

2. **Vercel.** Create the project, add me to the team, and run `vercel --prod` yourself.

3. **Design brief sign-off** — `docs/design-brief.md`.
   One open question in it: keep the system font stack (my recommendation — zero network
   cost, and Lighthouse ≥ 90 is a launch requirement) or switch to the Inter + JetBrains
   Mono pair the task file suggests. Two lines of CSS either way.

4. **The Revenue Goal citation.**
   It currently cites Investopedia. The URL is live, but Investopedia is a *secondary*
   source, which README §2.2 forbids, and `TASK-1` §6 says that calculator should cite
   *"none external — pure arithmetic."* Removing it makes the record fail the gate's
   "at least one sourced assumption" rule. Options: add a `derivation` source type to the
   schema for pure-arithmetic calculators, or leave the citation as-is. The schema change
   touches the build gate, so it needs your sign-off.

5. **Repo.** Currently at `~/websites/inspector-calculators`, public on GitHub under
   MohammedHive. Confirm that's where you want it, or say where to move it.

### Launch-day tasks that need the live domain

| | Task |
|---|---|
| ☐ | Deploy to Vercel |
| ☐ | **Run the three-UA robots check immediately after deploy** (below) |
| ☐ | `npm run check:ssr https://<domain>` against production |
| ☐ | Rich Results Test on one calculator page |
| ☐ | Google Search Console + Bing Webmaster, submit sitemap |
| ☐ | Copy and run `indexnow-submit.mjs` from `estategpt-website` |
| ☐ | Baseline AI prompt set — 15 prompts across ChatGPT, Perplexity, Google AI Mode, screenshots to `docs/baseline/2026-MM-DD/` |

The check that matters most, run it before anything else:

```bash
curl -A "GPTBot" https://<domain>/robots.txt
curl -A "ClaudeBot" https://<domain>/robots.txt
curl -A "OAI-SearchBot" https://<domain>/robots.txt
```

You must see the explicit `Allow` groups and **no bare `Disallow: /` above them.** If one
appears, the domain is behind Cloudflare Managed robots.txt — stop and fix that first.

---

## 6. Smaller things worth a look

- **Effective hourly rate** on the profitability calculator divides *revenue* (not profit)
  by drive plus report time only, excluding time on site. For the worked example that
  reports $432/hr, which no inspector will believe. The task file's own input list for §6 #1
  omits inspection duration, so the build follows the spec — the spec is what's off. Say the
  word and I'll add an on-site hours input and compute from profit.
- **`grep -c 'application/ld+json'` in §4 cannot pass as written.** `grep -c` counts lines,
  and Next.js minifies the page onto one, so it returns 1 regardless. The real count is 3
  blocks. Suggest amending the task file to `grep -o … | wc -l`.
- **The §3 gate spec says source URLs must be "unique."** `spectora.com/pricing/` is cited
  by four calculators. Reusing one vendor's pricing page across four tools looks correct to
  me, so the gate allows it — flagging in case you read that requirement literally.
- **`gray-matter`** is installed per §2 but unused. Harmless.
- **Two category pages are empty.** `/category/electrical` and `/category/hvac` have no
  calculators yet. §5 asks for all eight, so all eight ship, and they will fill from the
  §10 after-launch list.

---

## 7. After launch

`TASK-1` §10 has the ranked queue — one calculator per week. Highest value first:
Inspector Capacity Planner, Ancillary-Service ROI, First-Employee Calculator,
Price-Increase Impact.

Do **not** build fee benchmarks by state or metro yet — that needs real data from Site 2,
Phase 3.

Every addition: one dated line in `/changelog`, `dateModified` bumped, sitemap picks it up
automatically.
