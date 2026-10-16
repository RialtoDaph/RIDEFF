import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { signupUrl } from '@/lib/site';
import { StatusPage } from '@/components/ui/StatusPage';

/** 404 in RIDEFF style: dark, big mono "404", one line, two buttons. */
export default async function NotFound() {
  const t = await getTranslations('notFound');
  const locale = (await getLocale()) as Locale;
  return (
    <StatusPage
      kicker={
        <span className="font-mono font-medium text-[clamp(96px,22vw,200px)] leading-none tracking-[-0.06em] text-orange-500" aria-hidden="true">
          {t('code')}
        </span>
      }
      title={t('text')}
    >
      <div className="flex gap-3 flex-wrap justify-center pt-2">
        <Link href="/" className="font-semibold text-[15px] py-[14px] px-6 rounded-full border border-line-d5 text-stone-50 hover:border-zinc-450 transition-colors">
          {t('home')}
        </Link>
        <a
          href={signupUrl('plus', locale)}
          className="font-semibold text-[15px] py-[14px] px-6 rounded-full bg-orange-500 text-white hover:bg-orange-450 transition-colors"
        >
          {t('try')}
        </a>
      </div>
    </StatusPage>
  );
}
