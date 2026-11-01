import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPathname } from '@/i18n/navigation';
import { GERMAN_ONLY, routing, type AppPath, type Locale } from '@/i18n/routing';
import { socialMeta } from './og';

const OG_LOCALE: Record<Locale, string> = { de: 'de_DE', en: 'en_GB' };

/** Routes with their meta key (messages: meta.<key>.title / .description). */
export const PAGE_META = {
  '/': 'home',
  '/understand': 'understand',
  '/build': 'build',
  '/build/web-shops': 'storefront',
  '/build/team-apps': 'workbench',
  '/run': 'run',
  '/work': 'work',
  '/life': 'life',
  '/pricing': 'pricing',
  '/about': 'about',
  '/contact': 'contact',
  '/journal': 'journal',
  '/impressum': 'impressum',
  '/datenschutz': 'datenschutz',
  '/agb': 'agb',
  '/demo': 'demo',
} as const satisfies Partial<Record<AppPath, string>>;
export type MetaRoute = keyof typeof PAGE_META;

export const localePath = (route: AppPath, locale: Locale) => getPathname({ href: route as never, locale });

/** hreflang map for a route (German-only routes list only "de"). */
export function languages(route: AppPath) {
  const locales = GERMAN_ONLY.includes(route) ? (['de'] as const) : routing.locales;
  const out: Record<string, string> = Object.fromEntries(locales.map((l) => [l, localePath(route, l)]));
  out['x-default'] = localePath(route, 'de');
  return out;
}

export async function pageMetadata(locale: Locale, route: MetaRoute, opts: { noindex?: boolean } = {}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `meta.${PAGE_META[route]}` });
  const social = await socialMeta(locale);
  const url = localePath(route, locale);
  return {
    title: t('title'),
    description: t('description'),
    alternates: { canonical: url, languages: languages(route) },
    openGraph: {
      type: 'website',
      siteName: 'RIDEFF',
      title: t('title'),
      description: t('description'),
      url,
      locale: OG_LOCALE[locale],
      images: [social.image],
    },
    twitter: social.twitter,
    ...(opts.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

/** Site-wide defaults (inherited by pages without their own metadata). */
export async function defaultMetadata(locale: Locale): Promise<Metadata> {
  const social = await socialMeta(locale);
  return {
    openGraph: { type: 'website', siteName: 'RIDEFF', locale: OG_LOCALE[locale], images: [social.image] },
    twitter: social.twitter,
  };
}
