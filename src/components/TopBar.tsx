import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { PRIVATE_QUERY, loginUrl, signupUrl, type Mode } from '@/lib/site';
import { RdeMark } from './RdeMark';
import { LangSwitch } from './LangSwitch';
import { PortalLink } from './PortalLink';

const BUSINESS_NAV = ['plattform', 'ablauf', 'projekt', 'pakete', 'faq'] as const;
const PRIVATE_NAV = [
  ['module', 'p-module'],
  ['ablauf', 'p-ablauf'],
  ['daten', 'p-daten'],
  ['preis', 'p-preis'],
  ['faq', 'p-faq'],
] as const;

/** Top bar of the hero. Dark for BUSINESS, light for PRIVATE (Life). */
export async function TopBar({ mode }: { mode: Mode }) {
  const t = await getTranslations('nav');
  const tm = await getTranslations('mode');
  const ta = await getTranslations('a11y');
  const locale = (await getLocale()) as Locale;
  const biz = mode === 'business';

  return (
    <header
      className={`flex items-center gap-4 md:gap-8 py-6 border-b ${biz ? 'border-line-d2 text-stone-50' : 'border-stone-350 text-ink'}`}
    >
      <Link
        href={biz ? '/' : { pathname: '/', query: PRIVATE_QUERY }}
        className="flex shrink-0 items-center gap-[10px] min-h-[44px]"
        aria-label={biz ? 'RIDEFF Business' : 'RIDEFF Life'}
      >
        <RdeMark />
        <span className="font-bold text-[17px] tracking-[0.02em]">RIDEFF</span>
        <span className="font-mono text-[11px] tracking-[0.1em] text-orange-500">
          {biz ? tm('productBusiness') : tm('productLife')}
        </span>
      </Link>

      <nav aria-label={ta('mainNav')} className={`ml-auto hidden lg:flex gap-7 text-[14px] ${biz ? 'text-zinc-400' : 'text-zinc-600'}`}>
        {biz
          ? BUSINESS_NAV.map((k) => (
              <a key={k} href={`#${k}`} className="hover:text-orange-500 transition-colors">
                {t(`business.${k}`)}
              </a>
            ))
          : PRIVATE_NAV.map(([k, id]) => (
              <a key={k} href={`#${id}`} className="hover:text-orange-500 transition-colors">
                {t(`private.${k}`)}
              </a>
            ))}
      </nav>

      <div className="ml-auto lg:ml-0 flex items-center gap-4 md:gap-8">
        {/* Below 640px the language switch moves into the mobile menu (step 8). */}
        <div className="hidden sm:block">
          <LangSwitch mode={mode} variant={biz ? 'dark' : 'light'} />
        </div>
        {biz ? (
          <>
            <span className="hidden md:inline-flex">
              <PortalLink
                className="text-[14px] font-semibold text-zinc-300 whitespace-nowrap hover:text-white transition-colors"
                labelClassName="border-line-d4 text-zinc-500"
              />
            </span>
            <a
              href="#kontakt"
              className="text-[14px] font-semibold px-[18px] py-[10px] rounded-full bg-orange-500 text-white whitespace-nowrap"
            >
              {t('firstCall')}
            </a>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <a
              href={loginUrl(locale)}
              className="hidden md:inline text-[14px] font-semibold text-ink whitespace-nowrap hover:text-orange-500 transition-colors"
            >
              {t('login')}
            </a>
            <a
              href={signupUrl('plus', locale)}
              className="text-[14px] font-semibold px-[18px] py-[10px] rounded-full bg-orange-500 text-white whitespace-nowrap hover:bg-orange-450 transition-colors"
            >
              {t('tryFree')}
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
