#!/usr/bin/env node
/**
 * Post-build verification against the real server.
 *
 * Guards three failures that are invisible in a passing `next build` and that
 * have all bitten the sibling projects in this org:
 *   1. A URL listed in sitemap.xml that 404s (orphan/broken sitemap entry).
 *   2. JSON-LD that is client-injected, so crawlers that don't run JS see none.
 *   3. Body copy that isn't in the server HTML for the same reason.
 *
 * Usage: node scripts/check-ssr.mjs [baseUrl]   (default http://localhost:3210)
 * Requires the production server to already be running on that port.
 */
const BASE = process.argv[2] ?? 'http://localhost:3210';

const fail = [];
const note = (m) => fail.push(m);

const res = await fetch(`${BASE}/sitemap.xml`);
if (!res.ok) {
  console.error(`  Cannot fetch ${BASE}/sitemap.xml — is the server running?`);
  process.exit(1);
}
const xml = await res.text();
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

if (locs.length === 0) note('sitemap.xml contains no URLs');

console.log(`  Checking ${locs.length} sitemap URL(s) against ${BASE} ...\n`);

for (const loc of locs) {
  // The sitemap carries absolute production URLs; test the same path locally.
  const path = new URL(loc).pathname;
  const r = await fetch(`${BASE}${path}`);
  if (!r.ok) {
    note(`${path} → HTTP ${r.status} but is listed in sitemap.xml`);
    continue;
  }
  const html = await r.text();

  if (!html.includes('application/ld+json')) {
    note(`${path} → no JSON-LD in server HTML`);
  }
  if (/\/(defects|glossary)\/[^/]+$/.test(path)) {
    if (!/Reviewed by/.test(html)) note(`${path} → trust stack missing from server HTML`);
    if (!/<h2/.test(html)) note(`${path} → no <h2> in server HTML; body may be client-only`);
  }
  console.log(`  ok  ${path}`);
}

// robots.txt must reach the AI crawlers this site exists for.
const robots = await (await fetch(`${BASE}/robots.txt`)).text();
for (const agent of ['GPTBot', 'ClaudeBot', 'Google-Extended', 'PerplexityBot', 'CCBot']) {
  if (!robots.includes(agent)) note(`robots.txt has no explicit group for ${agent}`);
}
if (/^\s*Disallow:\s*\/\s*$/m.test(robots)) {
  note('robots.txt contains a bare `Disallow: /` — check for a Cloudflare-prepended block');
}

if (fail.length) {
  console.error(`\n  SSR check FAILED — ${fail.length} problem(s):\n`);
  fail.forEach((f) => console.error(`  ✗ ${f}`));
  process.exit(1);
}
console.log(`\n  SSR check passed — ${locs.length} URLs, all resolve with server-rendered schema.`);
