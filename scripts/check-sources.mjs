#!/usr/bin/env node
/**
 * Source-URL liveness gate.
 *
 * TASK-1-calculators.md §9: "Every source URL returns 200 (script it: extract
 * all `url:` values, curl each)." That check did not exist, which is exactly
 * how two dead citations shipped — `check-content.mjs` validates URL *syntax*
 * (`new URL()`), and a 404 is perfectly well-formed.
 *
 * Not wired into `npm run build`: the build must stay offline-safe and
 * deterministic, and a network blip should never block a deploy. This runs on
 * demand and in the pre-launch checklist.
 *
 *   npm run check:sources
 *
 * Some government sites (cpsc.gov) refuse non-browser agents — THREE_SITES_BRIEF
 * §4 flags this. Those come back as MANUAL rather than FAIL: verify them in a
 * real browser before shipping, and never "fix" one by deleting the check.
 */

const { calculators } = await import('../src/calculators/index.ts');

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';
const TIMEOUT_MS = 25_000;

// Status codes that mean "a human with a browser can read this, a script cannot."
const MANUAL_REVIEW = new Set([401, 402, 403, 405, 406, 429]);

/** url -> the calculator slugs that cite it */
const citedBy = new Map();
for (const { record } of calculators) {
  for (const a of record.assumptions) {
    const list = citedBy.get(a.source.url) ?? [];
    if (!list.includes(record.slug)) list.push(record.slug);
    citedBy.set(a.source.url, list);
  }
}

const urls = [...citedBy.keys()].sort();
console.log(`\n  Checking ${urls.length} source URL(s) cited by ${calculators.length} calculator(s)...\n`);

async function probe(url) {
  const attempt = async (method) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method,
        redirect: 'follow',
        headers: { 'User-Agent': UA, Accept: '*/*' },
        signal: ctrl.signal,
      });
      return { status: res.status };
    } finally {
      clearTimeout(timer);
    }
  };

  try {
    // HEAD first; a fair number of servers mishandle it, so fall back to GET.
    const head = await attempt('HEAD');
    if (head.status === 200) return head;
    return await attempt('GET');
  } catch (err) {
    return { status: 0, error: err?.name === 'AbortError' ? 'timeout' : String(err?.message ?? err) };
  }
}

const failures = [];
const manual = [];

for (const url of urls) {
  const { status, error } = await probe(url);
  const slugs = citedBy.get(url).join(', ');

  if (status === 200) {
    console.log(`  ok    200  ${url}`);
  } else if (MANUAL_REVIEW.has(status)) {
    console.log(`  MANUAL ${status}  ${url}`);
    manual.push({ url, status, slugs });
  } else {
    console.log(`  FAIL  ${status || 'ERR'}  ${url}`);
    failures.push({ url, status, error, slugs });
  }
}

if (manual.length) {
  console.log(`\n  ${manual.length} URL(s) refused an automated request — verify each in a real browser:\n`);
  for (const m of manual) console.log(`   ? ${m.status}  ${m.url}\n       cited by: ${m.slugs}`);
}

if (failures.length) {
  console.error(`\n  Source check FAILED — ${failures.length} unreachable source URL(s):\n`);
  for (const f of failures) {
    console.error(`   x ${f.status || 'ERR'}  ${f.url}`);
    console.error(`       cited by: ${f.slugs}`);
    if (f.error) console.error(`       ${f.error}`);
  }
  console.error(
    '\n  An unreachable source is an unsourced claim. Re-source it or delete the claim\n' +
      '  (tasks/README.md §2.1) — do not ship a citation that does not resolve.\n',
  );
  process.exit(1);
}

console.log(
  `\n  Source check passed — ${urls.length - manual.length} of ${urls.length} URL(s) returned 200` +
    (manual.length ? `, ${manual.length} need a manual browser check.\n` : '.\n'),
);
