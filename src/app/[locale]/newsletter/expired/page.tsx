import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { NewsletterStatus } from '@/components/NewsletterStatus';

export const metadata: Metadata = { robots: { index: false } };

export default async function Page({ params }: PageProps<'/[locale]/newsletter/expired'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <NewsletterStatus status="expired" />;
}
