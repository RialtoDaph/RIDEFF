import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { CAL_LIFE_PRIVATE, EMAIL, lifePrivateHref, loginUrl, signupUrl, type Mode } from '@/lib/site';
import { PortalLink } from './PortalLink';
import { NewsletterForm } from './NewsletterForm';

const colTitle = 'font-mono text-[11px] tracking-[0.12em] text-zinc-550 pb-1';
const col = 'flex flex-col gap-3 text-[15px] text-zinc-400';
const link = 'hover:text-orange-500 transition-colors self-start';

export async function Footer({ mode }: { mode: Mode }) {
  const t = await getTranslations('footer');
  const locale = (await getLocale()) as Locale;
  const biz = mode === 'business';

  return (
    <footer id="footer" className="bg-ink-2 text-stone-50 border-t border-line-d2 overflow-hidden">
      <div className="site-x pt-[72px] flex flex-col gap-14">
        <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] items-start">
          <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
            <Image src="/brand/mark-lg.png" alt="RIDEFF" width={64} height={32} className="h-8 w-auto self-start" />
            <span className="text-[24px] font-bold tracking-[-0.03em] leading-[1.15] max-w-[300px]">
              {biz ? t('business.claim') : t('private.claim')}
            </span>
            {biz ? (
              <a
                href="#kontakt"
                className="text-[14px] font-semibold px-5 py-3 rounded-full bg-orange-500 text-white self-start"
              >
                {t('business.cta')}
              </a>
            ) : (
              <span className="text-[14px] leading-[1.5] text-zinc-400 max-w-[300px]">{t('private.sub')}</span>
            )}
          </div>

          {biz ? (
            <>
              <nav className={col} aria-labelledby="f-platform">
                <span id="f-platform" className={colTitle}>{t('business.platform.title')}</span>
                <a className={link} href="#plattform">{t('business.platform.cockpit')}</a>
                <a className={link} href="#plattform">{t('business.platform.teamApp')}</a>
                <a className={link} href="#plattform">{t('business.platform.website')}</a>
                <a className={link} href="#nerven">{t('business.platform.ai')}</a>
              </nav>
              <nav className={col} aria-labelledby="f-company">
                <span id="f-company" className={colTitle}>{t('business.company.title')}</span>
                <a className={link} href="#ablauf">{t('business.company.ablauf')}</a>
                <a className={link} href="#projekt">{t('business.company.projekt')}</a>
                <a className={link} href="#pakete">{t('business.company.pakete')}</a>
                <a className={link} href="#faq">{t('business.company.faq')}</a>
                <PortalLink className={link} labelClassName="border-line-d4 text-zinc-500" />
              </nav>
            </>
          ) : (
            <>
              <nav className={col} aria-labelledby="f-life">
                <span id="f-life" className={colTitle}>{t('private.life.title')}</span>
                <a className={link} href="#p-module">{t('private.life.money')}</a>
                <a className={link} href="#p-module">{t('private.life.time')}</a>
                <a className={link} href="#p-module">{t('private.life.goals')}</a>
                <a className={link} href="#p-module">{t('private.life.ai')}</a>
              </nav>
              <nav className={col} aria-labelledby="f-more">
                <span id="f-more" className={colTitle}>{t('private.more.title')}</span>
                <a className={link} href="#p-ablauf">{t('private.more.ablauf')}</a>
                <a className={link} href="#p-daten">{t('private.more.daten')}</a>
                <a className={link} href="#p-preis">{t('private.more.preis')}</a>
                <a className={link} href="#p-faq">{t('private.more.faq')}</a>
                <a className={link} href={signupUrl('plus', locale)}>{t('private.more.tryFree')}</a>
                <a className={link} href={loginUrl(locale)}>{t('private.more.login')}</a>
                <a className={link} href={lifePrivateHref} {...(CAL_LIFE_PRIVATE ? { target: '_blank', rel: 'noopener' } : {})}>
                  {t('private.more.lifePrivate')}
                </a>
                <Link className={link} href={locale === 'id' ? '/' : '/#top'} locale={locale === 'id' ? 'en' : locale}>
                  {t('private.more.forBusiness')}
                </Link>
              </nav>
            </>
          )}

          <div className={col}>
            <span className={colTitle}>{t('contact.title')}</span>
            <a className={link} href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <span>{t('contact.hours')}</span>
            <span>{biz ? t('business.location') : t('private.location')}</span>
          </div>
        </div>

        <div className="flex justify-between items-center gap-x-10 gap-y-6 flex-wrap pt-7 pb-1 border-t border-line-d2">
          <div className="flex flex-col gap-[6px] max-w-[440px]">
            <span className="text-[18px] font-bold tracking-[-0.02em]">{t('newsletter.title')}</span>
            <span className="text-[14px] text-zinc-450">{t('newsletter.sub')}</span>
          </div>
          <NewsletterForm />
        </div>

        <div className="flex justify-between items-center gap-x-6 gap-y-3 flex-wrap pt-6 border-t border-line-d2 font-mono text-[12px] tracking-[0.06em] text-zinc-450">
          <span>{t('copyright')}</span>
          <nav className="flex gap-7">
            <Link className="hover:text-orange-500 transition-colors py-3 -my-3" href="/impressum" locale="de">{t('legal.impressum')}</Link>
            <Link className="hover:text-orange-500 transition-colors py-3 -my-3" href="/datenschutz" locale="de">{t('legal.datenschutz')}</Link>
            <Link className="hover:text-orange-500 transition-colors py-3 -my-3" href="/agb" locale="de">{t('legal.agb')}</Link>
          </nav>
        </div>

        {/* Cropped on purpose: 300px at full width, scales with the viewport below that. */}
        <div
          aria-hidden="true"
          className="select-none -mx-2 -mt-6 h-[0.6667em] overflow-hidden text-[clamp(64px,calc((100vw-24px)/3.75),300px)] font-bold tracking-[-0.07em] leading-[0.74] text-night-2"
        >
          RIDEFF
        </div>
      </div>
    </footer>
  );
}
