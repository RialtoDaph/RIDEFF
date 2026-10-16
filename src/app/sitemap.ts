import type { MetadataRoute } from 'next';
import { SITE_URL, BUSINESS_LOCALES, PRIVATE_LOCALES } from '@/lib/site';
import { homePath } from '@/lib/metadata';
import { getPosts } from '@/lib/blog';

const abs = (p: string) => `${SITE_URL}${p === '/' ? '' : p}`;

/** Public pages only: no /demo (mock data, noindex), no newsletter status pages. */
export default function sitemap(): MetadataRoute.Sitemap {
  const home = (mode: 'business' | 'private', locales: readonly ('de' | 'en' | 'id')[], priority: number) =>
    locales.map((l) => ({
      url: abs(homePath(l, mode)),
      changeFrequency: 'monthly' as const,
      priority,
      alternates: { languages: Object.fromEntries(locales.map((x) => [x, abs(homePath(x, mode))])) },
    }));

  return [
    ...home('business', BUSINESS_LOCALES, 1),
    ...home('private', PRIVATE_LOCALES, 0.9),
    { url: abs('/blog'), changeFrequency: 'weekly', priority: 0.6 },
    ...getPosts().map((p) => ({ url: abs(`/blog/${p.slug}`), lastModified: p.date, changeFrequency: 'yearly' as const, priority: 0.5 })),
    ...['/impressum', '/datenschutz', '/agb'].map((p) => ({ url: abs(p), changeFrequency: 'yearly' as const, priority: 0.2 })),
  ];
}
