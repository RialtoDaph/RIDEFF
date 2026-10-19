import { getTranslations } from 'next-intl/server';
import { CAL_LIFE_PRIVATE, lifePrivateHref } from '@/lib/site';

/** Full-width Life Private card inside a 2px wrapper with a rotating conic ring. */
export async function LifePrivateCard() {
  const t = await getTranslations('life.preis.private');
  const f = t.raw('f') as string[];
  return (
    <div className="relative p-[2px] rounded-card-xl overflow-hidden bg-orange-200 shadow-life-private">
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 w-[200%] aspect-square pointer-events-none animate-rde-spin motion-reduce:animate-none"
        style={{
          background:
            'conic-gradient(from 0deg,transparent 0deg,transparent 250deg,#FF9A50 300deg,#FF6A00 340deg,transparent 360deg)',
          transform: 'translate(-50%,-50%)',
        }}
      />
      <div className="relative z-[1] p-6 md:p-9 rounded-card-lg bg-stone-100 text-ink grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-10 items-center">
        <div className="flex flex-col gap-4">
          <div className="flex gap-[10px] items-center font-mono text-[11px] tracking-[0.12em]">
            <span className="py-1 px-[9px] rounded-full bg-orange-500 text-white">{t('badge')}</span>
            <span className="text-zinc-500">{t('limited')}</span>
          </div>
          <h3 className="text-[clamp(30px,4.5vw,40px)] font-bold tracking-[-0.04em] leading-[1.05] m-0 text-balance">{t('title')}</h3>
          <p className="text-[16px] leading-[1.55] text-zinc-600 m-0 max-w-[480px] text-pretty">{t('text')}</p>
          <div className="flex items-baseline gap-[10px] flex-wrap pt-[6px]">
            <span className="text-[40px] font-bold tracking-[-0.04em] whitespace-nowrap">{t('price')}</span>
            <span className="text-[15px] text-zinc-500">{t('priceSub')}</span>
          </div>
        </div>
        <div className="flex flex-col gap-[18px]">
          <ul className="flex flex-col border-t border-stone-200 m-0 p-0 list-none">
            {f.map((x) => (
              <li key={x} className="flex gap-[10px] py-3 border-b border-stone-200 text-[15px]">
                <span className="text-orange-500" aria-hidden="true">✓</span>
                {x}
              </li>
            ))}
          </ul>
          <a
            href={lifePrivateHref}
            {...(CAL_LIFE_PRIVATE ? { target: '_blank', rel: 'noopener' } : {})}
            className="text-center text-[15px] font-semibold p-[14px] rounded-full bg-orange-500 text-white hover:bg-orange-450 transition-colors"
          >
            {t('cta')}
          </a>
        </div>
      </div>
    </div>
  );
}
