import type { ReactNode } from 'react';
import { Messages } from '@/components/site/Messages';
import Nav from '@/components/dc/Nav';
import Footer from '@/components/dc/Footer';

/**
 * Pages the handoff does not design (404, newsletter status), in RIDEFF style:
 * dark section, mono kicker, headline with one serif accent, pill buttons.
 */
export function StatusPage({ kicker, title, accent, text, children }: { kicker: string; title: string; accent?: string; text?: string; children?: ReactNode }) {
  return (
    <Messages namespaces={[]}>
      <Nav active="" dark />
      <main id="main" className="flex min-h-[100svh] items-center bg-night text-on-dark">
        <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-8 px-[clamp(20px,3vw,40px)] pt-[140px] pb-[120px]">
          <div className="font-mono text-[12px] text-orange">{kicker}</div>
          <h1 className="m-0 max-w-[1000px] text-[clamp(39px,5.7vw,89px)] leading-[.94] font-semibold tracking-[-0.055em]">
            {title}
            {accent ? (
              <>
                {' '}
                <span className="text-orange">{accent}</span>
              </>
            ) : null}
          </h1>
          {text ? <p className="m-0 max-w-[520px] text-[19px] leading-[1.55] text-muted-dark">{text}</p> : null}
          {children ? <div className="flex flex-wrap gap-3">{children}</div> : null}
        </div>
      </main>
      <div style={{ background: '#FFF7ED' }}>
        <Footer />
      </div>
    </Messages>
  );
}

export const btnPrimary = 'rounded-full bg-orange px-[26px] py-4 text-[15px] font-semibold text-ink hover:bg-orange-soft';
export const btnGhost = 'rounded-full border border-on-dark px-[26px] py-4 text-[15px] font-medium hover:border-orange hover:text-orange';
