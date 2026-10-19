import type { ReactNode } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

const PAGES = [
  ['/impressum', 'IMPRESSUM'],
  ['/datenschutz', 'DATENSCHUTZ'],
  ['/agb', 'AGB'],
] as const;

/**
 * Shell of the legal pages (German only), from "RIDEFF Rechtliches.dc.html".
 * The draft notice stays until the [placeholders] are filled and reviewed.
 */
export function LegalLayout({ current, children }: { current: (typeof PAGES)[number][0]; children: ReactNode }) {
  return (
    <div data-light-page="" className="min-h-screen bg-stone-100 text-ink">
      <div className="max-w-[820px] mx-auto pt-10 px-5 pb-24 flex flex-col gap-14">
        <header className="flex justify-between items-center gap-4 flex-wrap">
          <Link href="/" locale="de" className="flex items-center gap-[10px] min-h-[44px]">
            <Image src="/brand/mark-lg.png" alt="" width={52} height={26} className="h-[26px] w-auto" />
            <span className="font-bold text-[17px] tracking-[0.02em]">RIDEFF</span>
          </Link>
          <nav className="flex gap-5 font-mono text-[12px] tracking-[0.08em]">
            {PAGES.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                locale="de"
                aria-current={href === current ? 'page' : undefined}
                className={`py-3 hover:text-orange-500 ${href === current ? 'text-orange-500' : ''}`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </header>
        <div className="py-4 px-5 rounded-[12px] bg-[#FFF4EB] border border-orange-200 text-[14px] leading-[1.5] text-orange-900">
          Entwurf. Angaben in [eckigen Klammern] bitte ergänzen und vor Veröffentlichung rechtlich prüfen lassen.
        </div>
        <main id="main" className="flex flex-col gap-[18px] break-words [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-orange-500">
          {children}
        </main>
        <footer className="flex justify-between gap-4 flex-wrap font-mono text-[12px] text-muted border-t border-stone-200 pt-6">
          <span>© 2026 RIDEFF</span>
          <Link href="/" locale="de" className="hover:text-orange-500 py-2 -my-2">
            ← ZUR WEBSITE
          </Link>
        </footer>
      </div>
    </div>
  );
}

export const h1 = 'text-[clamp(30px,9vw,40px)] font-bold tracking-[-0.04em] m-0 hyphens-auto break-words';
export const h2 = 'text-[20px] font-bold mt-2 mb-0';
export const p = 'text-[16px] leading-[1.6] m-0';
export const block = 'flex flex-col gap-1 text-[16px] leading-[1.6]';
export const small = 'text-[14px] text-muted m-0';
