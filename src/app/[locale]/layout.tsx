import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Analytics } from '@vercel/analytics/next';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/site';
import { defaultMetadata } from '@/lib/metadata';
import { Messages } from '@/components/site/Messages';
import { SiteFx } from '@/components/site/SiteFx';
import { NanaMount } from '@/components/nana/NanaMount';
import '../globals.css';

const geist = Geist({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-geist', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-geist-mono', display: 'swap' });
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  const l = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  return { metadataBase: new URL(SITE_URL), ...(await defaultMetadata(l)) };
}

export const viewport: Viewport = {
  themeColor: '#ECE8E1',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>
      <body>
        <Messages namespaces={[]}>
          <SiteFx />
        </Messages>
        {children}
        <Messages namespaces={['RideffNana', 'nana']}>
          <NanaMount />
        </Messages>
        <Analytics />
      </body>
    </html>
  );
}
