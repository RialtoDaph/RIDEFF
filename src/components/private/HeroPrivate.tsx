import { getLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { signupUrl } from '@/lib/site';
import { ModeToggle } from '../ModeToggle';
import { HeroPhone } from './HeroPhone';

export async function HeroPrivate() {
  const t = await getTranslations('hero.private');
  const locale = (await getLocale()) as Locale;
  return (
    <div id="top">
      <div className="site-x transition-opacity duration-500 grid grid-cols-1 lg:grid-cols-2 gap-10 pt-[72px] pb-24 items-center">
        <div className="flex flex-col gap-[26px]">
          <ModeToggle mode="private" />
          <h1 className="text-[clamp(46px,8.5vw,72px)] font-bold tracking-[-0.055em] leading-[0.96] m-0">
            {t.rich('title', { accent: (c) => <span className="text-orange-500">{c}</span> })}
          </h1>
          <p className="text-[18px] leading-[1.55] text-zinc-600 m-0">{t('lead')}</p>
          <div className="flex flex-wrap gap-[10px]">
            <a
              href={signupUrl('plus', locale)}
              className="font-semibold text-[15px] px-6 py-[14px] rounded-full bg-orange-500 text-white whitespace-nowrap hover:bg-orange-450 transition-colors"
            >
              {t('cta')}
            </a>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] tracking-[0.08em] text-zinc-500">
            <span>{t('tags.eu')}</span>
            <span>{t('tags.consent')}</span>
            <span>{t('tags.trial')}</span>
          </div>
        </div>
        <HeroPhone />
      </div>
    </div>
  );
}
