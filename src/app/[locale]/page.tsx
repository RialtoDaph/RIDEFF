import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { homeMetadata } from '@/lib/metadata';
import { HomePage } from '@/components/HomePage';

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  return homeMetadata(locale as Locale, 'business');
}

/** BUSINESS (default). Served at /, /en. */
export default async function BusinessHome({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomePage mode="business" />;
}
