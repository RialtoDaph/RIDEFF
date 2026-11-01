import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';

/**
 * Static Open Graph images in public/og/og-{de,en}.png (1200×630, `npm run og`).
 * Placeholder until the owner supplies a designed OG image (see TODO.md):
 * replace the files and keep the names.
 */
export async function ogImage(locale: Locale) {
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  return { url: `/og/og-${locale}.png`, width: 1200, height: 630, alt: t('title'), type: 'image/png' };
}

/** og:image + twitter:card for a page. */
export async function socialMeta(locale: Locale): Promise<Pick<Metadata, 'twitter'> & { image: Awaited<ReturnType<typeof ogImage>> }> {
  const image = await ogImage(locale);
  return { image, twitter: { card: 'summary_large_image', images: [{ url: image.url, alt: image.alt }] } };
}
