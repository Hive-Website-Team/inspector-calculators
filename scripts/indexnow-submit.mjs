#!/usr/bin/env node
/**
 * Submit the site's URLs to IndexNow (Bing, Yandex, Seznam, Naver share the index).
 *
 * Copied from ~/websites/inspection-reference per TASK-1 §8. Run after a
 * production deploy:
 *
 *   npm run indexnow                                    # every URL in the live sitemap
 *   npm run indexnow -- --dry-run                       # show what would be sent, send nothing
 *   npm run indexnow -- --urls /attic-ventilation-calculator   # specific paths or full URLs
 *
 * The key is public by design: IndexNow proves ownership by fetching
 * https://<this-domain>/<key>.txt (served from public/), so it is safe to commit.
 * Google does not support IndexNow; it discovers changes via the sitemap in Search Console.
 */

const HOST = process.env.INDEXNOW_HOST || new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://inspectorcalculators.com').host;
const BASE = `https://${HOST}`;
// No default key: this site's key is generated once and served from public/<key>.txt.
// Set INDEXNOW_KEY before running. Never reuse a sibling site's key here.
const KEY = process.env.INDEXNOW_KEY;
const KEY_LOCATION = `${BASE}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_PER_REQUEST = 10_000; // IndexNow protocol limit

if (!KEY) {
  console.error('  INDEXNOW_KEY is not set. Generate a key, save it as public/<key>.txt,');
  console.error('  and export INDEXNOW_KEY before running. Do not reuse another site\'s key.');
  process.exit(1);
}

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const urlsArgIdx = args.indexOf('--urls');
const explicitUrls =
  urlsArgIdx !== -1 && args[urlsArgIdx + 1]
    ? args[urlsArgIdx + 1].split(',').map((u) => u.trim()).filter(Boolean)
    : null;

function toAbsolute(u) {
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  return `${BASE}/${u.replace(/^\/+/, '')}`;
}

async function verifyKeyFile() {
  const res = await fetch(KEY_LOCATION, { cache: 'no-store' });
  const body = (await res.text()).trim();
  if (!res.ok || body !== KEY) {
    throw new Error(
      `Key file check failed: ${KEY_LOCATION} returned ${res.status} with body "${body.slice(0, 60)}". ` +
        `Expected the key itself. Is public/${KEY}.txt deployed?`,
    );
  }
}

async function urlsFromSitemap() {
  const res = await fetch(`${BASE}/sitemap.xml`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) throw new Error('sitemap.xml contained no <loc> entries');
  return urls;
}

async function submit(urlList) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
  });
  // 200 = OK, 202 = accepted (key validation pending). Anything else is a failure.
  if (res.status !== 200 && res.status !== 202) {
    const text = await res.text().catch(() => '');
    throw new Error(`IndexNow responded ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.status;
}

async function main() {
  const urls = (explicitUrls ?? (await urlsFromSitemap())).map(toAbsolute);
  const offHost = urls.filter((u) => new URL(u).host !== HOST);
  if (offHost.length) throw new Error(`Refusing URLs not on ${HOST}: ${offHost.join(', ')}`);

  console.log(`IndexNow: ${urls.length} URL(s) for ${HOST}${dryRun ? ' (dry run)' : ''}`);

  try {
    await verifyKeyFile();
    console.log(`Key file OK: ${KEY_LOCATION}`);
  } catch (err) {
    if (dryRun) console.warn(`WARN ${err.message}`);
    else throw err;
  }

  if (dryRun) {
    urls.forEach((u) => console.log(`  ${u}`));
    return;
  }

  for (let i = 0; i < urls.length; i += MAX_PER_REQUEST) {
    const batch = urls.slice(i, i + MAX_PER_REQUEST);
    const status = await submit(batch);
    console.log(`Submitted ${batch.length} URL(s) -> HTTP ${status}`);
  }
}

main().catch((err) => {
  console.error(`IndexNow submission failed: ${err.message}`);
  process.exit(1);
});
