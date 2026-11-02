import { getPosts } from '@/lib/journal';
import { localePath } from '@/lib/metadata';
import { CAL_URL, SITE_URL, WHATSAPP_URL } from '@/lib/site';
import type { AppPath } from '@/i18n/routing';

/**
 * /llms.txt (llmstxt.org): a plain summary for AI crawlers and answer engines.
 * Keep the facts in sync with the Pricing page and src/lib/nana/agent-config.ts.
 */
export const dynamic = 'force-static';

const de = (r: AppPath) => `${SITE_URL}${localePath(r, 'de') === '/' ? '' : localePath(r, 'de')}`;
const en = (r: AppPath) => `${SITE_URL}${localePath(r, 'en')}`;

export function GET() {
  const posts = getPosts()
    .map((p) => `- [${p.title}](${SITE_URL}/journal/${p.slug}): ${p.excerpt}`)
    .join('\n');

  const body = `# RIDEFF

> RIDEFF is a one-person studio in Eichstätt, Bavaria, Germany, run by Rialto Effendy. He maps how a small business runs, builds the AI agents, team apps, websites and shops around it, and keeps everything running after launch. One person from the first call to daily operation, hosted in the EU (Frankfurt). The site is German first, with English under /en.

## How it works

- Understand: a free 15-minute first call, then one fixed-price offer in the client portal, approved with one click.
- Build: one platform instead of many rented tools: apps, AI agents, automations, data, entry points (website, WhatsApp, forms) and integrations.
- Run: monitoring, fixes, updates and a report every Monday.

## Prices

RIDEFF Business (net plus 19% VAT, 12-month term, one-off setup):
- Core: €149/month, setup from €1,290
- Growth: €249/month, setup from €1,990 (most businesses start here)
- Whole system: €449/month, setup from €3,900

RIDEFF Life, a personal assistant for money, time, goals and family (incl. VAT, cancel monthly, 14 days free without a card):
- Life €12.90/month, Life Plus €19.90/month, Together €29.90/month (up to 4 people), Life Private from €68/month plus €449 setup

## Pages

- [Home](${de('/')}) · [English](${en('/')})
- [Understand: first call and offer](${de('/understand')}) · [EN](${en('/understand')})
- [Build: platform, apps, AI agents](${de('/build')}) · [EN](${en('/build')})
- [Websites & shops](${de('/build/web-shops')}) · [EN](${en('/build/web-shops')})
- [Team apps](${de('/build/team-apps')}) · [EN](${en('/build/team-apps')})
- [Run: operation and support](${de('/run')}) · [EN](${en('/run')})
- [Work: TIC Originals, Mami I Patisserie, client portal](${de('/work')}) · [EN](${en('/work')})
- [Pricing and FAQ](${de('/pricing')}) · [EN](${en('/pricing')})
- [RIDEFF Life](${de('/life')}) · [EN](${en('/life')})
- [About Rialto](${de('/about')}) · [EN](${en('/about')})
- [Contact](${de('/contact')}) · [EN](${en('/contact')})

## Journal

${posts || '- (no posts yet)'}

## Contact

- WhatsApp: ${WHATSAPP_URL}
- Free 15-minute call: ${CAL_URL}
- Legal notice: ${de('/impressum')}
`;

  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
}
