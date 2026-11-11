import { defineRouting } from 'next-intl/routing';

export const locales = ['de', 'en'] as const;
export type Locale = (typeof locales)[number];

/**
 * Internal route (folder name) → public path per locale.
 * German lives at "/" without prefix, English under "/en".
 */
export const pathnames = {
  '/': '/',
  '/understand': { de: '/verstehen', en: '/understand' },
  '/build': { de: '/bauen', en: '/build' },
  '/build/web-shops': { de: '/bauen/web-shops', en: '/build/web-shops' },
  '/build/team-apps': { de: '/bauen/team-apps', en: '/build/team-apps' },
  '/run': { de: '/betreiben', en: '/run' },
  '/work': { de: '/projekte', en: '/work' },
  '/work/tic-originals': { de: '/projekte/tic-originals', en: '/work/tic-originals' },
  '/work/mami-patisserie': { de: '/projekte/mami-patisserie', en: '/work/mami-patisserie' },
  '/life': '/life',
  '/pricing': { de: '/preise', en: '/pricing' },
  '/about': { de: '/ueber-mich', en: '/about' },
  '/contact': { de: '/kontakt', en: '/contact' },
  '/journal': '/journal',
  '/journal/[slug]': '/journal/[slug]',
  '/impressum': '/impressum',
  '/datenschutz': '/datenschutz',
  '/agb': '/agb',
  '/demo': '/demo',
  '/newsletter/confirmed': '/newsletter/confirmed',
  '/newsletter/expired': '/newsletter/expired',
} as const;

export type AppPath = keyof typeof pathnames;

export const routing = defineRouting({
  locales,
  defaultLocale: 'de',
  localePrefix: 'as-needed',
  pathnames,
  // Germany first: "/" is always German, no Accept-Language redirect.
  localeDetection: false,
  // Cookie-free site: the locale is carried by the URL only.
  localeCookie: false,
  // hreflang is emitted in the page metadata instead of a Link header.
  alternateLinks: false,
});

/** Pages that exist in German only (legal texts). */
export const GERMAN_ONLY: readonly AppPath[] = ['/impressum', '/datenschutz', '/agb'];
