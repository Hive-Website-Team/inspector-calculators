import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * Explicit allow groups for every AI crawler we know of.
 *
 * Ported wholesale from a sibling site's robots.ts. The entire premise
 * of this site is being readable by answer engines, so this file is load-bearing.
 *
 * WARNING: if this domain is put behind Cloudflare, its Managed robots.txt /
 * Content Signals feature PREPENDS its own `Disallow: /` block for AI bots
 * ABOVE whatever this file emits, and stamps `Content-Signal: ai-train=no`.
 * Crawlers that stop at the first matching group then resolve to deny. This
 * silently cost a sibling site months (see ~/websites/SEO_PLAN.md A1).
 * Verify with: curl -A GPTBot https://<domain>/robots.txt
 */
const AI_AGENTS = [
  'GPTBot', 'ChatGPT-User', 'OAI-SearchBot',
  'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai', 'Claude-Web',
  'Google-Extended', 'PerplexityBot', 'Perplexity-User',
  'CCBot', 'Applebot', 'Applebot-Extended', 'Amazonbot',
  'Bytespider', 'meta-externalagent', 'Meta-ExternalFetcher', 'FacebookBot',
  'cohere-ai', 'Diffbot', 'omgili', 'Timpibot', 'YouBot', 'DuckAssistBot', 'MistralAI-User',
];

const SEARCH_AGENTS = ['Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider', 'YandexBot'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...[...SEARCH_AGENTS, ...AI_AGENTS].map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: '/api/',
      })),
      { userAgent: '*', allow: '/', disallow: '/api/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
