'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Scattered tool cards: [left, top, rotation]. */
const POS: [number, number, number][] = [
  [0, 30, -3],
  [300, 0, 2],
  [150, 140, -1],
  [480, 110, 3],
  [20, 250, 1],
  [360, 240, -2],
];
/** Stage durations (ms): scattered → pulled together → platform → + KI → growth. */
const D = [2600, 1300, 1500, 1800, 4200];
const LABEL_COLOR = ['#52525B', '#A1A1AA', '#F5F5F4', '#FF6A00', '#22C55E'];
const EASE = 'cubic-bezier(.65,0,.35,1)';
const POP = 'cubic-bezier(.34,1.56,.64,1)';

/**
 * Section 01: tools scattered across the business get pulled into one
 * platform, the AI joins, and the curve goes up. Loops while visible.
 */
export function ToolsToPlatform() {
  const t = useTranslations('biz.problem');
  const ta = useTranslations('common');
  const reduce = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>();
  const [p, setP] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    let timer: ReturnType<typeof setTimeout>;
    let cur = 0;
    const go = () => {
      timer = setTimeout(() => {
        cur = (cur + 1) % 5;
        setP(cur);
        go();
      }, D[cur]);
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setP(0);
    go();
    return () => clearTimeout(timer);
  }, [inView, reduce]);

  const stage = reduce ? 3 : p;
  const pull = stage >= 1;
  const cards = t.raw('cards') as [string, string][];
  const stages = t.raw('stages') as string[];
  const one = stage === 2 || stage === 3;

  return (
    <div ref={ref} className="relative h-[390px] w-[700px] max-w-none [zoom:0.45] min-[400px]:[zoom:0.51] min-[480px]:[zoom:0.62] min-[640px]:[zoom:0.8] min-[768px]:[zoom:0.98] lg:[zoom:0.62] xl:[zoom:1]" aria-hidden="true">
      {cards.map(([title, sub], i) => (
        <div
          key={title}
          className="absolute bg-night-card border border-line-d4 rounded-card-sm py-3 px-4 shadow-[0_12px_28px_rgba(0,0,0,0.35)] flex flex-col gap-[2px] whitespace-nowrap"
          style={{
            left: pull ? 230 : POS[i][0],
            top: pull ? 135 : POS[i][1],
            transform: pull ? 'rotate(0deg) scale(0.5)' : `rotate(${POS[i][2]}deg) scale(1)`,
            opacity: pull ? 0 : 1,
            transition: ['left', 'top', 'transform'].map((x) => `${x} .9s ${EASE} ${pull ? i * 70 : i * 50}ms`).join(',') + `, opacity .6s ease ${pull ? i * 70 : i * 50}ms`,
          }}
        >
          <span className="text-[17px] font-bold">{title}</span>
          <span className="text-[13px] text-zinc-450">{sub}</span>
        </div>
      ))}

      <div
        className="absolute left-[404px] top-[86px] w-[60px] h-[60px] z-[2] rounded-full bg-orange-500 text-white grid place-items-center font-mono font-semibold text-[20px] tracking-[0.04em] shadow-[0_0_0_10px_rgba(255,106,0,0.14),0_0_48px_rgba(255,106,0,0.65)]"
        style={{
          transform: stage === 3 ? 'scale(1)' : 'scale(0.3)',
          opacity: stage === 3 ? 1 : 0,
          transition: `transform .6s ${POP}, opacity .4s ease`,
        }}
      >
        {ta('ai')}
      </div>

      <div
        className="absolute left-[174px] top-[118px] w-[260px] py-[18px] px-5 rounded-card bg-ink-2 border flex flex-col gap-1"
        style={{
          borderColor: stage === 3 ? '#FF6A00' : '#3F3F46',
          boxShadow: stage === 3 ? '0 0 40px rgba(255,106,0,0.4)' : '0 12px 28px rgba(0,0,0,0.35)',
          opacity: one ? 1 : 0,
          transform: one ? 'scale(1)' : 'scale(0.85)',
          transition: `opacity .5s ease, transform .6s ${POP}, border-color .5s ease, box-shadow .5s ease`,
        }}
      >
        <span className="font-mono text-[11px] tracking-[0.12em] text-zinc-450">{t('platformKicker')}</span>
        <span className="text-[22px] font-bold tracking-[-0.02em]">{t('platform')}</span>
        <span className="text-[13px] text-zinc-400">{t('platformSub')}</span>
        <span
          className="self-start mt-[6px] font-mono text-[10px] tracking-[0.1em] text-white bg-orange-500 rounded-full py-1 px-[9px]"
          style={{ opacity: stage === 3 ? 1 : 0, transition: 'opacity .4s ease .3s' }}
        >
          {t('poweredBy')}
        </span>
      </div>

      <svg
        viewBox="0 0 640 300"
        preserveAspectRatio="none"
        className="absolute left-0 top-5 w-full h-[300px] overflow-visible"
        style={{ opacity: stage === 4 ? 1 : 0, transition: 'opacity .5s ease' }}
      >
        <defs>
          <linearGradient id="pTrend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FF6A00" stopOpacity="0.35" />
            <stop offset="1" stopColor="#FF6A00" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 270 L80 258 L160 262 L240 226 L320 214 L400 168 L480 150 L560 96 L640 40 L640 300 L0 300 Z"
          fill="url(#pTrend)"
          style={{ opacity: stage === 4 ? 1 : 0, transition: 'opacity 1s ease .6s' }}
        />
        <path
          d="M0 270 L80 258 L160 262 L240 226 L320 214 L400 168 L480 150 L560 96 L640 40"
          fill="none"
          stroke="#FF6A00"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={{ strokeDasharray: 900, strokeDashoffset: stage === 4 ? 0 : 900, transition: `stroke-dashoffset 1.6s ${EASE}` }}
        />
        <circle cx={640} cy={40} r={6} fill="#FF6A00" style={{ opacity: stage === 4 ? 1 : 0, transition: 'opacity .4s ease 1.4s' }} />
      </svg>

      <div className="absolute left-5 bottom-0 flex items-center gap-[10px] font-mono text-[12px] tracking-[0.12em] text-zinc-400">
        <span className="w-2 h-2 rounded-full transition-[background] duration-400" style={{ background: LABEL_COLOR[stage] }} />
        <span>{stages[stage]}</span>
      </div>
    </div>
  );
}
