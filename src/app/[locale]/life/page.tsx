import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { homeMetadata } from '@/lib/metadata';
import { HomePage } from '@/components/HomePage';

export async function generateMetadata({ params }: PageProps<'/[locale]/life'>): Promise<Metadata> {
  const { locale } = await params;
  return homeMetadata(locale as Locale, 'private');
}

/** PRIVATE (RIDEFF Life). Public URL: /?for=private (rewritten here by src/proxy.ts). */
export default async function LifeHome({ params }: PageProps<'/[locale]/life'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomePage mode="private" />;
}
