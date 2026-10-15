import { getTranslations } from 'next-intl/server';
import type { Mode } from '@/lib/site';
import { TopBar } from './TopBar';
import { Footer } from './Footer';
import { IntroVideo } from './IntroVideo';
import { HeroBusiness } from './business/HeroBusiness';
import { HeroPrivate } from './private/HeroPrivate';
import { PrivateSections } from './private/PrivateSections';
import { FlowLine } from './FlowLine';

/**
 * One page, two modes. BUSINESS is served at "/", PRIVATE at "/?for=private".
 * BUSINESS sections 01–09 follow in step 3.
 */
export async function HomePage({ mode }: { mode: Mode }) {
  const t = await getTranslations('a11y');
  const biz = mode === 'business';
  return (
    <div data-page-mode={mode} className={`relative ${biz ? 'text-stone-50' : 'text-ink'}`}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-orange-500 focus:px-5 focus:py-3 focus:text-[14px] focus:font-semibold focus:text-white"
      >
        {t('skipToContent')}
      </a>
      <IntroVideo />
      <div className="site-x">
        <TopBar mode={mode} />
      </div>
      <main id="main" tabIndex={-1} className="outline-none">{biz ? (
          <HeroBusiness />
        ) : (
          <>
            <HeroPrivate />
            <PrivateSections />
          </>
        )}
      </main>
      <FlowLine />
      <Footer mode={mode} />
    </div>
  );
}
