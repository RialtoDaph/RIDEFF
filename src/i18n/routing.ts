import { defineRouting } from 'next-intl/routing';

export const locales = ['de', 'en', 'id'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'de',
  // German lives at "/" (and "/de" redirects there); EN and ID are prefixed.
  localePrefix: 'as-needed',
  // Germany first: "/" is always German, no Accept-Language redirect.
  localeDetection: false,
  // Cookie-free site: the locale is carried by the URL only.
  localeCookie: false,
  // hreflang is emitted in the page metadata instead of a Link header.
  alternateLinks: false,
});
