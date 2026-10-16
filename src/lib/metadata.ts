import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { BUSINESS_LOCALES, PRIVATE_LOCALES, type Mode } from './site';
import { socialMeta } from './og';

const OG_LOCALE: Record<Locale, string> = { de: 'de_DE', en: 'en_US', id: 'id_ID' };

export function homePath(locale: Locale, mode: Mode) {
  const base = locale === routing.defaultLocale ? '/' : `/${locale}`;
  return mode === 'private' ? `${base}?for=private` : base;
}

/** Title, description, canonical and hreflang for the two home pages. */
export async function homeMetadata(locale: Locale, mode: Mode): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `meta.${mode}` });
  const available = mode === 'private' ? PRIVATE_LOCALES : BUSINESS_LOCALES;
  const languages: Record<string, string> = Object.fromEntries(available.map((l) => [l, homePath(l, mode)]));
  languages['x-default'] = homePath('de', mode);
  const social = await socialMeta(locale);
  return {
    twitter: social.twitter,
    title: t('title'),
    description: t('description'),
    alternates: { canonical: homePath(locale, mode), languages },
    openGraph: {
      type: 'website',
      siteName: 'RIDEFF',
      title: t('title'),
      description: t('description'),
      url: homePath(locale, mode),
      locale: OG_LOCALE[locale],
      images: [social.image],
    },
  };
}

/** Site-wide defaults (inherited by legal, blog list, demo …). */
export async function defaultMetadata(locale: Locale): Promise<Metadata> {
  const social = await socialMeta(locale);
  return {
    openGraph: { type: 'website', siteName: 'RIDEFF', locale: OG_LOCALE[locale], images: [social.image] },
    twitter: social.twitter,
  };
}
