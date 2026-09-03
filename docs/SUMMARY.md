# Task 1 — what shipped, what didn't

2026-09-04 · Branch `task-1-calculators` · Not deployed, not merged to `main`

---

## ✅ Done

| | |
|---|---|
| **11 calculators** | §6 asks for 11, ships at 10. Eleven ship. |
| Every calculator sourced | Each one carries a primary source with the date it was checked. The build fails without one. |
| Pages | Home, 8 category pages, methodology, about, changelog |
| Build gate | Proven both ways — broke a record, build failed; restored it, build passed |
| Source-check script | §9 required it, it didn't exist. It does now. |
| Design | omnicalculator + calculator.net + electricaltoolbox, the three named in §0 |
| Mobile | 16/16 pages clean at 360px and 390px |
| Repo | New, public, work on a branch, `main` untouched |

### Check output

```
Content check passed — 11 calculators, every one carries a sourced assumption
SSR check passed     — 23 URLs, all resolve with server-rendered schema
Source check passed  — 10 of 10 source URLs return 200
Lighthouse mobile    — 96 / 96 / 100 / 100
JS disabled          — 11/11 calculators show a complete computed result
Mobile 360 & 390px   — 16/16 pages, no horizontal scroll
```

### Numbers verified against the source, not written from memory

- All 12 Southern Pine values checked cell by cell against AWC DCA 6-15 Table 2, extracted from the PDF
- Roof slopes read from the free public IRC 2021 R905 text (ICC's own viewer paywalls it)
- Vendor pricing taken off Spectora, ISN and Palm-Tech's own pages, each dated 2026-09-04

---

## ❌ Not done

| | Why |
|---|---|
| **Water Heater calculator** | Its only source was a DOE sizing page. That page — and the entire `energy.gov/energysaver` section — is gone. Five replacement URLs checked, all 404. Removed rather than shipped unsourced, per README §2.1, and logged in `/changelog`. |
| **Deploy** | No domain yet |
| **Search Console / Bing / IndexNow** | Needs a live domain |
| **Rich Results Test** | Needs a public URL |
| **Baseline AI screenshots** | After the site is live |
| **Design brief approval** | Yours to sign off |

---

## ⏳ Five decisions for Alka

**1. Domain and `NEXT_PUBLIC_SITE_URL`**
Please also confirm the domain will **not** sit behind Cloudflare Managed robots.txt.
This is the one that matters most — it's the mistake that cost hiveinspect.com months.

**2. Vercel** — create the project, and you run `--prod`.

**3. Design brief sign-off** (`docs/design-brief.md`)
One open question: keep the system font stack (my recommendation — zero network cost,
and Lighthouse ≥ 90 is a launch requirement) or switch to Inter + JetBrains Mono.

**4. The Revenue Goal citation**
It cites Investopedia. The URL is live, but Investopedia is a *secondary* source, which
README §2.2 forbids, and §6 says that calculator should cite nothing external. Removing it
makes the record fail the gate's "at least one sourced assumption" rule. Either add a
`derivation` source type to the schema for pure-arithmetic calculators, or leave it as-is.
The schema change touches the build gate, so it needs your sign-off.

**5. Repo location** — currently `~/websites/inspector-calculators`, public on GitHub.

---

## 🚨 Run this the moment it deploys

```bash
curl -A "GPTBot" https://<domain>/robots.txt
curl -A "ClaudeBot" https://<domain>/robots.txt
curl -A "OAI-SearchBot" https://<domain>/robots.txt
```

You should see the explicit `Allow` groups and **no bare `Disallow: /` above them**.
If one appears, the domain is behind Cloudflare Managed robots.txt — stop there and fix
that before anything else.

---

## 📌 Smaller things worth a look

- **Effective hourly rate** on the profitability calculator divides *revenue* (not profit)
  by drive plus report time only, excluding time on site. The worked example reports
  $432/hr, which no inspector will believe. §6's own input list omits inspection duration,
  so the code follows the spec — the spec is what's off. Say the word and I'll fix it.
- **§4's `grep -c` check cannot pass as written.** `grep -c` counts lines and Next.js
  minifies the page onto one, so it always returns 1. The real count is 3 blocks. The task
  file should say `grep -o … | wc -l`.
- **§3 says source URLs must be "unique."** `spectora.com/pricing/` is cited by four
  calculators. Reusing one vendor's pricing page across four tools looks correct to me, so
  the gate allows it — flagging in case you read that requirement literally.
- **`gray-matter`** is installed per §2 but unused. Harmless.
- **Two category pages are empty** — electrical and hvac. §5 asks for all eight, so all
  eight ship. They'll fill from the §10 after-launch list.

---

## Links

- **Review (PR):** https://github.com/MohammedHive/inspector-calculators/pull/1
- **Full detail:** `docs/TASK-1-STATUS.md`
- **Design:** `docs/design-brief.md`
