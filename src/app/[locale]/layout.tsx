import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Analytics } from '@vercel/analytics/next';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/site';
import { defaultMetadata } from '@/lib/metadata';
import { JsonLd, siteGraph } from '@/lib/jsonld';
import { Messages } from '@/components/site/Messages';
import { SiteFx } from '@/components/site/SiteFx';
import { CtaTracker } from '@/components/site/CtaTracker';
import { NanaMount } from '@/components/nana/NanaMount';
import { isElevenLabsConfigured } from '@/lib/nana/elevenlabs';
import '../globals.css';

// Fonts ship with the repo (src/fonts, SIL OFL), so the build never depends on
// downloading from Google Fonts. A failed download broke a production build.
const geist = localFont({
  src: [
    { path: '../../fonts/Geist-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/Geist-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../fonts/Geist-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../../fonts/Geist-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-geist',
  display: 'swap',
});
const geistMono = localFont({
  src: [
    { path: '../../fonts/GeistMono-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/GeistMono-Medium.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-geist-mono',
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
    <html lang={locale} className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        <JsonLd data={await siteGraph(locale)} />
        <Messages namespaces={[]}>
          <SiteFx />
        </Messages>
        {children}
        <Messages namespaces={['RideffNana', 'nana']}>
          <NanaMount live={isElevenLabsConfigured()} />
        </Messages>
        <CtaTracker />
        <Analytics />
      </body>
    </html>
  );
}
