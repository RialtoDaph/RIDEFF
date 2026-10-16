import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { DemoData } from '@/content/demo/types';
import de from '@/content/demo/industries.de.json';
import en from '@/content/demo/industries.en.json';
import { BusinessDemo } from '@/components/demo/BusinessDemo';
import { BASE_NAMESPACES, ClientMessages } from '@/components/ClientMessages';

export async function generateMetadata({ params }: PageProps<'/[locale]/demo'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'demo' });
  // Mock data: keep the demo out of search results.
  return { title: t('metaTitle'), robots: { index: false, follow: true } };
}

/** Business demo cockpit (DE/EN; /id/demo redirects to /en/demo). Static mock data, interactive in the browser. */
export default async function DemoPage({ params }: PageProps<'/[locale]/demo'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = (locale === 'de' ? de : en) as unknown as DemoData;
  return (
    <ClientMessages namespaces={[...BASE_NAMESPACES, 'demo']}>
      <BusinessDemo data={data} source={de as unknown as DemoData} />
    </ClientMessages>
  );
}
