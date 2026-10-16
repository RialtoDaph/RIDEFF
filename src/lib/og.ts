import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';

/**
 * Static Open Graph images in public/og/og-{de,en,id}.png (made by `npm run og`).
 * Replace the files to use designed images; names and sizes stay the same.
 * ID uses the Life headline, because the Indonesian site is RIDEFF Life only.
 */
export async function ogImage(locale: Locale) {
  const t = await getTranslations({ locale, namespace: 'hero' });
  const alt = String(t.raw(locale === 'id' ? 'private.title' : 'business.title')).replace(/<\/?accent>/g, '');
  return { url: `/og/og-${locale}.png`, width: 1200, height: 630, alt, type: 'image/png' };
}

/** og:image + twitter:card for a page; merge into its own openGraph. */
export async function socialMeta(locale: Locale): Promise<Pick<Metadata, 'twitter'> & { image: Awaited<ReturnType<typeof ogImage>> }> {
  const image = await ogImage(locale);
  return { image, twitter: { card: 'summary_large_image', images: [{ url: image.url, alt: image.alt }] } };
}
