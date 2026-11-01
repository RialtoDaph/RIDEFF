import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { StatusPage, btnPrimary } from '@/components/site/StatusPage';

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Double opt-in result page (linked from /api/newsletter/confirm). */
export default async function NewsletterConfirmed({ params }: PageProps<'/[locale]/newsletter/confirmed'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('newsletter.confirmed');
  return (
    <StatusPage kicker="(Journal)" title={t('title')} text={t('text')}>
      <Link href="/" className={btnPrimary}>
        {t('back')}
      </Link>
    </StatusPage>
  );
}
