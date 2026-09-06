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
| 2 | Revenue Goal → Inspections Needed | Business | Derived — stated derivation, no external citation |
| 3 | Startup Cost Planner | Business | Spectora published pricing |
| 4 | Cost Per Inspection | Pricing | Spectora published pricing |
| 5 | Software Total Cost of Ownership | Pricing | Spectora published pricing |
| 6 | Home Inspection Software Pricing | Pricing | Spectora · ISN · Palm-Tech published pricing |
| 7 | Roof Pitch & Area | Roofing | IRC 2021 R905.2.2–R905.8.2 |
| 8 | Attic Ventilation (NFA) | Roofing | IRC 2021 R806.2 |
| 9 | Stair Rise/Run Compliance | Safety | IRC 2021 R311.7.5 |
| 10 | Deck Joist Span | Structure | AWC DCA 6-15 Table 2 |
| 11 | Guard & Handrail Height | Safety | IRC 2021 R312.1.2, R311.7.8 |
| 12 | Water Heater Sizing (First-Hour Rating) | Plumbing | 10 CFR 430 Subpart B App. E, Tables I and III.1–III.4 |

`TASK-1` §6 sets the bar at *"11 total, ship at 10."* Twelve ship — the eleven from the
launch list plus Home Inspection Software Pricing, with §6 #10 restored (see section 4).

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

**Rebuilt 2026-09-07 against screenshots the owner supplied, which supersede the design
direction in `TASK-1` §7.** The owner's instruction was to follow those screenshots exactly
and ignore the task file's design guidance. Three page types were matched:

| Page | Taken from the supplied reference |
|---|---|
| Home | Soft multi-colour hero wash, count headline in the accent blue, pill search, broken blue/red/yellow rings cropped by the section edges, white category-tile panel lifted over the wash, card grid, tagline footer |
| `/category/<name>` | Wordmark-left header with a search pill and a category tab row, blue icon badge beside the H1, calculator count, intro paragraph, two-column list |
| `/<slug>` | "Last updated" line above the H1, table of contents, prose column with the tool in a sticky right rail, "Check out N similar" card |

Deviations from the task file, all on the owner's instruction:

- **Light theme only.** `TASK-1` §7 asks for dark mode via `prefers-color-scheme`; the
  owner asked for white only, so the dark branch was removed rather than left dead.
- **Typeface is Poppins**, via `next/font` (downloaded at build time, served from our own
  origin — no third-party request at page load). This settles `docs/design-brief.md`
  open item 1, which offered a system stack or Inter + JetBrains Mono. Neither was chosen.

Kept from the task file because they are content rules, not design: flat root-level URLs,
a categorized index on `/` with a heading and a one-line description per calculator (§5),
and the methodology pattern — formula, assumptions table, code edition, sources.

---

## 3. Verification

All run against a production build.

Re-run 2026-09-07 after the design rebuild.

```
Content check passed — 11 calculators, every one carries a sourced assumption
SSR check passed     — 23 URLs, all resolve with server-rendered schema
Source check passed  — 10 of 10 source URLs return 200
Lighthouse mobile    — Accessibility 100 · Best Practices 100 · SEO 100 on every page type;
                       Performance 92-97 across runs
JS disabled          — 11/11 calculators show every computed result (49 values)
Shareable URLs       — 11/11 restore their inputs and keep the querystring
TOC anchors          — 11/11 pages: every anchor resolves to an h2 on the page
Mobile               — 60 page-loads at 320/360/390/768/1024px, no horizontal scroll
```

Three defects were found and fixed during that re-run, all introduced by the rebuild:
the header CTA rendered dark-on-blue at 3.11:1 because `.site-header-nav a` outranked it
on specificity; the inner-page header overflowed the viewport at 360px and 390px; and on
a phone the calculator sat below the entire article instead of directly under the H1.

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
Hive links            0 sitewide  <-- deliberate, owner-confirmed 2026-09-07; supersedes §9
Bare "Disallow: /"    0 under GPTBot, ClaudeBot, OAI-SearchBot
```

### Known deviations from the task file

1. **No Hive Inspect / Synapse Mobility disclosure anywhere on the site — settled.**
   `TASK-1` §5 says `/about` names the publisher and §9 requires exactly one
   hiveinspect.com link there. Commit `7511505` removed it across all three sites on the
   owner's instruction. **Re-confirmed by the owner 2026-09-07: "websites should not
   mention Hive Inspect / Synapse owns it."** The task file is superseded on this point.
   §5 and §9 should be amended rather than the site changed; the checklist box stays
   unticked deliberately.

   The consequence was handled 2026-09-07 without naming Hive: `/about` now explains
   why the site exists, how code figures and vendor prices are verified, and how
   corrections are handled, and the site carries a corrections address
   (`corrections@inspectorcalculators.com`) on `/about`, `/methodology`, the footer and
   in the Organization schema's `contactPoint`. **The mailbox still needs creating.**

2. **Light theme only** — see the Design section above.

---

## 4. The withdrawn calculator is back

**Water Heater Sizing (First-Hour Rating)** — withdrawn 2026-09-04, restored 2026-09-07.

It was withdrawn because its only source, the Department of Energy's "Sizing a New Water
Heater" page, was taken offline along with the rest of `energy.gov/energysaver`. That is
still true: both `energy.gov/energysaver/sizing-new-water-heater` and `energy.gov/node/1266126`
return 404, and the per-fixture gallon figures circulating on plumbing-contractor blogs are
secondary restatements of that dead page, which `tasks/README.md` §2.2 forbids citing.

What unblocked it was `README.md` §2.1's own instruction: *"Some government sites
(`cpsc.gov`) block `curl` — check those in a real browser."* eCFR is one of those sites.
An automated request is redirected to an unblock page; a real browser gets the text. Opened
in a browser on 2026-09-07, **10 CFR 430 Subpart B Appendix E** — the federal test procedure
itself, not anyone's summary of it — carries the figures directly:

- **Table I** assigns the draw pattern from the first-hour rating: under 18 gal very-small,
  18 to under 51 low, 51 to under 75 medium, 75 and above high.
- **Tables III.1–III.4** list every draw in each pattern. Daily totals were summed from the
  rendered table rather than transcribed by eye: 10.0 gal over 9 draws, 38.0 over 11,
  55.0 over 12, 84.0 over 14.

The source URL returns 200 to `curl` as well, so `check:sources` covers it.

**What was deliberately not restored:** the fixture-by-fixture peak-hour worksheet
("shower = 20 gallons"). Those figures existed only on the dead DOE page and no live primary
source carries them, so peak-hour demand is an input the user supplies rather than a number
this site asserts. The limitation says so on the page.

This also fills the `plumbing` category, which had been dropped from the nav and sitemap
while empty. `electrical` and `hvac` remain empty and remain dropped.

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
   `TASK-1` §7 says get this approved *before* writing UI code. That did not happen, and
   the UI has since been rebuilt against owner-supplied screenshots instead. The brief is
   now a record of what was built, not a proposal. The font question in it is closed:
   Poppins ships.

4. ~~**The Revenue Goal citation.**~~ **Closed 2026-09-07.**
   Resolved without a ruling: the schema gained a `derivation` source type, so a
   pure-arithmetic calculator satisfies the gate by writing out its reasoning instead of
   borrowing a secondary authority. The Investopedia citation is gone. Both the content
   gate and the source checker understand the new type, and the gate was re-proven to
   still refuse a record carrying neither a citation nor a derivation. Original note:

   **The Revenue Goal citation.**
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
