import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { StatusPage, btnGhost, btnPrimary } from '@/components/site/StatusPage';

/** 404 (not designed in the handoff): RIDEFF style, dark. */
export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <StatusPage kicker={t('kicker')} title={t('title')} accent={t('accent')} text={t('text')}>
      <Link href="/contact" className={btnPrimary}>
        {t('contact')}
      </Link>
      <Link href="/" className={btnGhost}>
        {t('home')}
      </Link>
    </StatusPage>
  );
}
