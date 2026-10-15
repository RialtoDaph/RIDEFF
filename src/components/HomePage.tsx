import type { Mode } from '@/lib/site';
import { TopBar } from './TopBar';
import { Footer } from './Footer';
import { IntroVideo } from './IntroVideo';
import { HeroBusiness } from './business/HeroBusiness';
import { HeroPrivate } from './private/HeroPrivate';

/**
 * One page, two modes. BUSINESS is served at "/", PRIVATE at "/?for=private".
 * Sections 01–09 of each mode are added in steps 2 and 3.
 */
export function HomePage({ mode }: { mode: Mode }) {
  const biz = mode === 'business';
  return (
    <div data-page-mode={mode} className={biz ? 'text-stone-50' : 'text-ink'}>
      <IntroVideo />
      <div className="site-x">
        <TopBar mode={mode} />
      </div>
      <main>{biz ? <HeroBusiness /> : <HeroPrivate />}</main>
      <Footer mode={mode} />
    </div>
  );
}
