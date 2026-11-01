import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { getPosts } from '@/lib/journal';
import { languages, localePath, PAGE_META } from '@/lib/metadata';
import { GERMAN_ONLY, routing, type AppPath } from '@/i18n/routing';

const abs = (p: string) => `${SITE_URL}${p === '/' ? '' : p}`;

/** Public pages in DE and EN; legal pages DE only; /demo is excluded (noindex). */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = (Object.keys(PAGE_META) as AppPath[]).filter((r) => r !== '/demo');
  return [
    ...routes.flatMap((route) => {
      const locales = GERMAN_ONLY.includes(route) ? (['de'] as const) : routing.locales;
      const alt = Object.fromEntries(Object.entries(languages(route)).filter(([k]) => k !== 'x-default').map(([k, v]) => [k, abs(v)]));
      return locales.map((l) => ({
        url: abs(localePath(route, l)),
        changeFrequency: 'monthly' as const,
        priority: route === '/' ? 1 : GERMAN_ONLY.includes(route) ? 0.2 : 0.7,
        alternates: { languages: alt },
      }));
    }),
    ...getPosts().map((p) => ({ url: abs(`/journal/${p.slug}`), lastModified: p.date, changeFrequency: 'yearly' as const, priority: 0.5 })),
  ];
}
