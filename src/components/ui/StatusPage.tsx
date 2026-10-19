import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { RdeMark } from '../RdeMark';

/** Dark, centred one-message page (404, newsletter status). */
export function StatusPage({ kicker, title, children }: { kicker: ReactNode; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-2 text-stone-50 flex flex-col bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:56px_56px]">
      <div className="site-x py-6">
        <Link href="/" className="inline-flex items-center gap-[10px] min-h-[44px]" aria-label="RIDEFF">
          <RdeMark />
          <span className="font-bold text-[17px] tracking-[0.02em]">RIDEFF</span>
        </Link>
      </div>
      <main id="main" className="site-x flex-1 flex flex-col items-center justify-center text-center gap-6 pb-24">
        {kicker}
        <h1 className="text-[clamp(28px,5vw,44px)] font-bold tracking-[-0.04em] leading-[1.05] m-0 max-w-[720px] text-balance">{title}</h1>
        {children}
      </main>
    </div>
  );
}
