# Task 1 — kya hua, kya nahi

2026-09-04 · Branch `task-1-calculators` · Deploy nahi hua, `main` pe merge nahi hua

---

## ✅ Ho gaya

| | |
|---|---|
| **11 calculators** | §6 kehta hai 11 banao, 10 se launch. 11 hain. |
| Har calculator ka source | Har ek ke paas primary source + date. Bina source ke build hi fail hoti hai. |
| Pages | Home, 8 categories, methodology, about, changelog |
| Build gate | Todke test kiya — fail hota hai. Theek karke — pass. |
| Source check script | §9 ne maanga tha, tha nahi. Ab hai. |
| Design | Omni + calculator.net + electricaltoolbox — teeno §0 me likhe hain |
| Mobile | 16/16 pages, 360px aur 390px pe saaf |
| Git repo | Naya, public, branch pe kaam, `main` chhua nahi |

### Checks ka output

```
Content check passed — 11 calculators, every one carries a sourced assumption
SSR check passed     — 23 URLs, all resolve with server-rendered schema
Source check passed  — 10 of 10 source URLs return 200
Lighthouse mobile    — 96 / 96 / 100 / 100
JS band karke        — 11/11 calculators poora result dikhate hain
Mobile 360 & 390px   — 16/16 pages, side scroll nahi
```

### Numbers yaad se nahi likhe — source se verify kiye

- Deck joist ke 12 ke 12 value AWC DCA 6-15 ki PDF nikaal ke Table 2 se milaye
- Roof slopes IRC 2021 R905 ke free public text se padhe
- Vendor pricing Spectora, ISN, Palm-Tech ke apne page se, 2026-09-04 ko

---

## ❌ Nahi hua

| | Kyu |
|---|---|
| **Water Heater calculator** | Iska ek hi source tha — DOE ka page. Wo page aur poora `energy.gov/energysaver` section internet se hat gaya. 5 URL try kiye, sab 404. Bina source ke ship karne se accha hataya. §2.1 yahi kehta hai. `/changelog` me likh diya. |
| **Deploy** | Domain nahi hai |
| **Google Search Console / Bing / IndexNow** | Live domain ke bina nahi ho sakta |
| **Rich Results Test** | Public URL chahiye |
| **Baseline AI screenshots** | Live site ke baad |
| **Design brief approval** | Alka ka kaam |

---

## ⏳ Alka pe pending — 5 faisle

**1. Domain + `NEXT_PUBLIC_SITE_URL`**
Aur ye confirm karna ki domain **Cloudflare Managed robots.txt ke peeche nahi** hoga.
Ye sabse zaroori hai — yahi galti hiveinspect.com ke mahine kha gayi thi.

**2. Vercel** — project banao, `--prod` aap chalao.

**3. Design brief approve** (`docs/design-brief.md`)
Ek sawaal khula hai: system font rakhein (meri salah) ya Inter + JetBrains Mono.

**4. Revenue Goal ka Investopedia source**
Link zinda hai, par Investopedia *secondary* source hai — README §2.2 mana karta hai.
Aur §6 kehta hai is calculator ko koi external source chahiye hi nahi.
Par schema kam se kam 1 source maangta hai. Isliye faisla chahiye.

**5. Repo ki jagah** — abhi `~/websites/inspector-calculators`, GitHub pe public.

---

## 🚨 Deploy ke turant baad ye chalana

```bash
curl -A "GPTBot" https://<domain>/robots.txt
curl -A "ClaudeBot" https://<domain>/robots.txt
curl -A "OAI-SearchBot" https://<domain>/robots.txt
```

Explicit `Allow` groups dikhne chahiye, aur **kahin bhi bare `Disallow: /` nahi**.
Agar dikhe → domain Cloudflare ke peeche hai → ruk jaao, pehle wo theek karo.

---

## 📌 Chhoti baatein dhyaan dene layak

- **Effective hourly rate** (profitability calculator) revenue ko sirf drive+report time se divide karta hai — site pe lage time ko chhodta hai. Isse $432/hr aata hai, jo koi maanega nahi. Task ki apni input list me inspection duration hai hi nahi, to code spec ke hisaab se sahi hai — spec galat hai. Bolo to theek kar doon.
- **§4 ka `grep -c` check chal hi nahi sakta.** `grep -c` lines ginta hai, Next.js sab ek line me daal deta hai — hamesha 1 aayega. Asli count 3 hai. Task file me `grep -o … | wc -l` hona chahiye.
- **§3 kehta hai source URL "unique" ho.** Spectora ka pricing page 4 calculators me hai. Mujhe theek lagta hai — ek vendor ka page 4 jagah use hona normal hai. Aap literally lete ho to bata dena.
- **`gray-matter`** install hai par use nahi ho raha. Nuksan nahi.
- **2 category pages khali hain** — electrical aur hvac. §5 aathon maangta hai, isliye aathon hain. §10 ki list se bharenge.

---

## Links

- **Review (PR):** https://github.com/MohammedHive/inspector-calculators/pull/1
- **Poori detail:** `docs/TASK-1-STATUS.md`
- **Design:** `docs/design-brief.md`
