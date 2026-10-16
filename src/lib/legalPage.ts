import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

/** Legal pages exist in German only; other locales are redirected by src/proxy.ts. */
export async function legalSetup(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (locale !== 'de') notFound();
  setRequestLocale('de');
}

export const legalMeta = (title: string, path: string): Metadata => ({
  title: `RIDEFF · ${title}`,
  alternates: { canonical: path },
});
