import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ModeToggle } from '../ModeToggle';
import { HeroSystem } from './HeroSystem';

export async function HeroBusiness() {
  const t = await getTranslations('hero.business');
  return (
    <div id="top">
      <div className="site-x transition-opacity duration-500 grid grid-cols-1 lg:grid-cols-2 gap-12 pt-[72px] pb-[104px] items-center">
        <div className="flex flex-col gap-[26px]">
          <ModeToggle mode="business" />
          <h1 className="text-[clamp(48px,9vw,80px)] font-bold tracking-[-0.055em] leading-[0.96] m-0">
            {t.rich('title', { accent: (c) => <span className="text-orange-500">{c}</span> })}
          </h1>
          <p className="text-[19px] leading-[1.55] text-zinc-400 m-0 max-w-[520px]">{t('lead')}</p>
          <div className="flex flex-wrap gap-[10px]">
            <a
              href="#kontakt"
              className="font-semibold text-[15px] px-6 py-[14px] whitespace-nowrap rounded-full bg-orange-500 text-white"
            >
              {t('cta')}
            </a>
            <Link
              href="/demo"
              className="font-semibold text-[15px] px-6 py-[14px] whitespace-nowrap rounded-full border border-line-d4 hover:text-orange-500 transition-colors"
            >
              {t('demo')}
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] tracking-[0.08em] text-zinc-450">
            <span>{t('tags.eu')}</span>
            <span>{t('tags.dsgvo')}</span>
            <span>{t('tags.custom')}</span>
          </div>
        </div>
        <HeroSystem />
      </div>
    </div>
  );
}
