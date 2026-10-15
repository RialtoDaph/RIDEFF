'use client';

import { useTranslations } from 'next-intl';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTimeline } from '@/hooks/useTimeline';

const CUES = [1, 2, 3].map((n, i) => [600 + i * 900, n] as const);
const LOOP = 600 + 2 * 900 + 4500;
const BAR = ['0%', '0%', '50%', 'calc(100% - 12px)'];

/** "Je länger sie Sie kennt …": WOCHE 1 → MONAT 3 → JAHR 1, lit one after another. */
export function GrowthTimeline() {
  const t = useTranslations('life.daten');
  const ta = useTranslations('common');
  const reduce = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.35 });
  const step = useTimeline({ active: inView && !reduce, cues: CUES, loopAt: LOOP, start: 0, idle: 0 });
  const g = reduce ? 3 : step;
  const grow = t.raw('grow') as [string, string][];

  return (
    <div ref={ref} className="flex flex-col gap-6 border-t border-stone-200 pt-10">
      <div className="flex justify-between items-end gap-6 flex-wrap">
        <h3 className="text-[clamp(26px,4vw,32px)] font-bold tracking-[-0.035em] leading-[1.1] m-0 max-w-[620px] text-balance">
          {t('growTitle')}
        </h3>
        <span className="font-mono text-[12px] tracking-[0.08em] text-muted max-w-[300px] md:text-right">{t('growSub')}</span>
      </div>
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="hidden md:block absolute left-[6px] right-[6px] top-[5px] h-[2px] bg-stone-200" />
        <div
          className="hidden md:block absolute left-[6px] top-[5px] h-[2px] bg-orange-500"
          style={{ width: BAR[g], transition: 'width 1.2s cubic-bezier(.65,0,.35,1)' }}
        />
        {grow.map(([label, text], i) => {
          const on = g > i;
          return (
            <div key={label} className="flex flex-col gap-3 relative">
              <div className="flex flex-col items-start gap-[10px]">
                <span
                  className="w-3 h-3 rounded-full flex-none relative z-[1] border-2 transition-all duration-[600ms]"
                  style={{
                    background: on ? '#FF6A00' : '#FFFFFF',
                    borderColor: on ? '#FF6A00' : '#D4D4D0',
                    boxShadow: on ? '0 0 12px rgba(255,106,0,0.6)' : 'none',
                  }}
                />
                <span className="font-mono text-[11px] tracking-[0.12em] text-muted">{label}</span>
              </div>
              <div
                className="py-[18px] px-5 rounded-card-sm bg-white border border-stone-200 text-[16px] leading-[1.45]"
                style={{
                  opacity: on ? 1 : 0.35,
                  transform: on ? 'translateY(0)' : 'translateY(8px)',
                  transition: 'opacity .6s ease, transform .6s ease',
                }}
              >
                <span className="font-mono text-[10px] bg-orange-500 text-white rounded-tag py-[2px] px-[6px] mr-2">{ta('ai')}</span>
                {text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
