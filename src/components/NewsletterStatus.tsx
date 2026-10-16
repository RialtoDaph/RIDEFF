import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { StatusPage } from './ui/StatusPage';

export async function NewsletterStatus({ status }: { status: 'confirmed' | 'expired' }) {
  const t = await getTranslations(`newsletter.${status}`);
  return (
    <StatusPage
      kicker={<span className={`font-mono text-[12px] tracking-[0.12em] ${status === 'confirmed' ? 'text-success-dark' : 'text-orange-400'}`}>NEWSLETTER</span>}
      title={t('title')}
    >
      <p className="text-[18px] leading-[1.55] text-zinc-400 m-0 max-w-[560px]">{t('text')}</p>
      <Link href="/" className="font-semibold text-[15px] py-[14px] px-6 rounded-full bg-orange-500 text-white hover:bg-orange-450 transition-colors">
        {t('back')}
      </Link>
    </StatusPage>
  );
}
