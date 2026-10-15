'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Steps 1–8 at these ms; everything fades at 14500; the run restarts at 15400. */
const CUES: [number, number][] = [
  [500, 1],
  [1300, 2],
  [2200, 3],
  [3200, 4],
  [4300, 5],
  [5100, 6],
  [6600, 7],
  [7300, 8],
  [14500, -1],
];
const LOOP = 15400;
const FINAL = 8;
const SLIDE = 'cubic-bezier(.2,.8,.2,1)';

/**
 * Section 04 "Weiterdenken". Before the first run the final state is shown, so
 * the cards are never empty. Starts when the section enters the viewport,
 * pauses while it is off-screen.
 */
export function ResearchDemo() {
  const t = useTranslations('life.weiter');
  const ta = useTranslations('common');
  const reduce = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>({ rootMargin: '0px 0px -20% 0px' });
  const [k, setK] = useState(FINAL);

  useEffect(() => {
    if (!inView || reduce) return;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      setK(0);
      timers = CUES.map(([ms, s]) => setTimeout(() => setK(s), ms));
      timers.push(setTimeout(run, LOOP));
    };
    run();
    return () => timers.forEach(clearTimeout);
  }, [inView, reduce]);

  const step = reduce ? FINAL : k;
  const out = step < 0;
  const on = (x: number) => !out && step >= x;
  const up = (x: number, d = 14): CSSProperties['transform'] => (on(x) ? 'none' : `translateY(${d}px)`);
  const findings = t.raw('findings') as [string, string, string][];
  const paths = t.raw('paths') as string[];

  return (
    <div ref={ref} className="flex flex-col gap-[10px] min-w-0">
      {/* Research card */}
      <div className="p-[22px] rounded-card-md bg-ink-2 text-stone-50 flex flex-col gap-[10px]">
        <div className="flex justify-between items-center font-mono text-[11px] tracking-[0.1em] text-zinc-450">
          <span>{t('research')}</span>
          <span className="grid text-orange-400">
            <span className="[grid-area:1/1] justify-self-end transition-opacity duration-400" style={{ opacity: on(1) && !on(4) ? 1 : 0 }}>
              {t('scanning')}
            </span>
            <span className="[grid-area:1/1] justify-self-end transition-opacity duration-400" style={{ opacity: on(4) ? 1 : 0 }}>
              {t('found')}
            </span>
          </span>
        </div>
        <div className="h-[2px] rounded-full bg-line-d3 overflow-hidden mb-1">
          <div
            className="h-full bg-orange-500 shadow-[0_0_8px_rgba(255,106,0,0.7)]"
            style={{ width: on(1) ? '100%' : '0%', transition: `width ${on(1) && !reduce ? '2.6s' : '0s'} linear` }}
          />
        </div>
        {findings.map(([kind, src, text], idx) => {
          const i = idx + 1;
          const special = i === 3;
          const glow = special && on(4);
          return (
            <div
              key={kind}
              className="py-4 px-[18px] rounded-card-sm bg-night-3 border flex flex-col gap-2"
              style={{
                borderColor: glow ? '#FF6A00' : special ? '#5A2A0A' : '#26262A',
                boxShadow: glow ? '0 0 0 4px rgba(255,106,0,0.12),0 0 24px rgba(255,106,0,0.25)' : 'none',
                opacity: on(i + 1) ? 1 : 0,
                transform: up(i + 1),
                transition: `opacity .6s ease, transform .7s ${SLIDE}, border-color .6s, box-shadow .8s`,
              }}
            >
              <span
                className={`flex justify-between items-center font-mono text-[10px] tracking-[0.12em] ${special ? 'text-orange-500' : 'text-zinc-400'}`}
              >
                <span>{kind}</span>
                <span className="text-zinc-600">{src}</span>
              </span>
              <span className="text-[15px] leading-[1.45] text-stone-50">{text}</span>
            </div>
          );
        })}
      </div>

      {/* Brainstorming card */}
      <div className="py-5 px-[22px] rounded-card-md bg-white border border-stone-200 flex flex-col gap-3">
        <span className="font-mono text-[11px] tracking-[0.1em] text-zinc-500">{t('brainstorm')}</span>
        <span
          className="self-end max-w-[80%] py-[10px] px-[14px] rounded-[14px_14px_4px_14px] bg-stone-100 text-[15px] leading-[1.4]"
          style={{ opacity: on(5) ? 1 : 0, transform: up(5, 10), transition: `opacity .5s ease, transform .6s ${SLIDE}` }}
        >
          {t('user')}
        </span>
        <div
          className="flex gap-[10px] items-start max-w-[90%] transition-opacity duration-400"
          style={{ opacity: on(6) ? 1 : 0 }}
        >
          <span className="font-mono text-[10px] bg-orange-500 text-white rounded-tag py-[2px] px-[6px] mt-[3px]">{ta('ai')}</span>
          <span className="grid flex-1">
            <span
              className="[grid-area:1/1] flex gap-1 items-center h-[21px] transition-opacity duration-300"
              style={{ opacity: on(6) && !on(7) ? 1 : 0 }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-[6px] h-[6px] rounded-full bg-zinc-400"
                  style={{ animation: reduce ? 'none' : `rdeDot 1s ease-in-out ${i * 0.15}s infinite` }}
                />
              ))}
            </span>
            <span
              className="[grid-area:1/1] text-[15px] leading-[1.45] text-[#27272A]"
              style={{ opacity: on(7) ? 1 : 0, transform: up(7, 8), transition: `opacity .5s ease, transform .6s ${SLIDE}` }}
            >
              {t('ai')}
            </span>
          </span>
        </div>
        <div className="flex gap-2 flex-wrap pl-[34px]">
          {paths.map((p) => (
            <span
              key={p}
              className="py-[7px] px-3 rounded-full border border-orange-200 bg-orange-50 text-[#B84A00] text-[13px] whitespace-nowrap"
              style={{
                opacity: on(8) ? 1 : 0,
                transform: on(8) ? 'none' : 'translateY(8px)',
                transition: `opacity .45s ease, transform .5s ${SLIDE}`,
              }}
            >
              {p}
            </span>
          ))}
        </div>
        <div
          className="flex justify-between items-center py-[10px] px-[14px] rounded-[12px] border text-[14px] text-zinc-400 transition-[border-color] duration-500"
          style={{ borderColor: on(8) ? '#FFD2B0' : '#E4E4E1' }}
        >
          <span>{t('input')}</span>
          <span className="text-orange-500">→</span>
        </div>
      </div>
    </div>
  );
}
