'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Month index (0 = OKT … 8 = JUN) of the goal date per flag, and weeks saved per lever. */
const MF = [8, 7, 6, 5];
const WEEKS = [5, 3, 2];
const EASE = 'cubic-bezier(.65,0,.25,1.12)';

type Lever = [string, string, string];

/**
 * Goal "Bali, 5.000 €": three levers roll in and pull the date from JUNI to
 * MÄRZ 2027. Afterwards the levers can be switched on and off.
 * Timeline (ms): 1800 / 2700 / 4600 / 5500 / 7400 / 8300 / 10100, replay at 17000
 * unless the visitor has touched a lever.
 */
export function GoalTimeline() {
  const t = useTranslations('life.module');
  const reduce = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.45 });
  const [row, setRow] = useState(0);
  const [flag, setFlag] = useState(0);
  const [fin, setFin] = useState(false);
  const [on, setOn] = useState([1, 1, 1]);
  const touched = useRef(false);
  const played = useRef(false);

  useEffect(() => {
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRow(3);
      setFin(true);
      return;
    }
    if (!inView) return;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const T = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
    const play = () => {
      played.current = true;
      setRow(0);
      setFlag(0);
      setFin(false);
      setOn([1, 1, 1]);
      T(1800, () => setRow(1));
      T(2700, () => setFlag(1));
      T(4600, () => setRow(2));
      T(5500, () => setFlag(2));
      T(7400, () => setRow(3));
      T(8300, () => setFlag(3));
      T(10100, () => setFin(true));
      T(17000, () => {
        if (!touched.current) {
          timers = [];
          play();
        }
      });
    };
    // Starts once on first view; a later re-entry only resumes the replay loop.
    if (!played.current) play();
    else if (!touched.current) T(4000, play);
    return () => timers.forEach(clearTimeout);
  }, [inView, reduce]);

  const levers = t.raw('levers') as Lever[];
  const dates = t.raw('dates') as string[];
  const months = t.raw('months') as string[];
  const gapSteps = t.raw('gapSteps') as string[];
  const wk = WEEKS.reduce((a, x, i) => a + (on[i] ? x : 0), 0);
  const f = fin ? (wk >= 10 ? 3 : wk >= 7 ? 2 : wk >= 2 ? 1 : 0) : flag;
  const pos = `${(MF[f] / 8) * 100}%`;
  const gap = fin ? (wk ? t(`gapWeeks.${wk}`) : '') : gapSteps[f];
  const toggle = (i: number) => {
    if (!fin) return;
    touched.current = true;
    setOn((o) => o.map((v, k) => (k === i ? (v ? 0 : 1) : v)));
  };

  return (
    <div ref={ref} className="flex flex-col gap-[10px] min-w-0">
      <div className="pt-6 px-[26px] pb-5 rounded-card-md bg-ink-2 text-white flex flex-col gap-[22px]">
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[11px] tracking-[0.12em] text-orange-400">{t('goalLabel')}</span>
            <span className="text-[28px] font-bold tracking-[-0.03em]">{t('goal')}</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-[10px] tracking-[0.12em] text-zinc-400">{f === 0 ? t('capNone') : t('capWith')}</span>
            <span
              className="font-mono text-[20px] font-medium h-7 leading-7 overflow-hidden"
              style={{
                color: fin ? '#FF9A50' : '#F5F5F4',
                textShadow: fin ? '0 0 14px rgba(255,106,0,0.7)' : 'none',
                transition: 'color .6s, text-shadow .8s',
              }}
              aria-live="polite"
            >
              <span key={dates[f]} className="inline-block animate-[rdeRoll_.7s_cubic-bezier(.2,.8,.2,1)]">
                {dates[f]}
              </span>
            </span>
          </div>
        </div>

        <div className="relative h-[92px] mx-[6px]" aria-hidden="true">
          <div className="absolute left-0 right-0 top-[35px] h-[2px] bg-line-d3" />
          <div
            className="absolute left-0 top-[34px] h-1 rounded-full bg-orange-500"
            style={{ width: pos, transition: `width 1.6s ${EASE}` }}
          />
          <div
            className="absolute top-7 h-4 rounded-tag bg-orange-500/25 border border-orange-500 right-0 flex items-center justify-center overflow-hidden"
            style={{ left: pos, opacity: f > 0 ? 1 : 0, transition: `left 1.6s ${EASE}, opacity .5s` }}
          >
            <span className="font-mono text-[10px] font-medium text-orange-300 whitespace-nowrap">{gap}</span>
          </div>
          <span className="absolute -left-[6px] top-2 font-mono text-[10px] tracking-[0.08em] text-zinc-400">{t('today')}</span>
          <div className="absolute -right-[7px] top-[30px] flex flex-col items-end">
            <span className="w-[14px] h-[14px] rounded-full bg-zinc-600 border-[3px] border-ink-2" />
            <span className="font-mono text-[10px] tracking-[0.06em] text-zinc-400 whitespace-nowrap mt-1">{t('withoutLife')}</span>
          </div>
          <div
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
            style={{ left: pos, opacity: f > 0 ? 1 : 0, transition: `left 1.6s ${EASE}, opacity .5s` }}
          >
            <span
              className="text-[11px] font-bold tracking-[0.04em] py-[3px] px-2 rounded-[6px] bg-orange-500 text-white whitespace-nowrap"
              style={{
                boxShadow: fin ? '0 0 0 6px rgba(255,106,0,0.25),0 0 22px rgba(255,106,0,0.6)' : 'none',
                transition: 'box-shadow .8s',
              }}
            >
              {t('withLife')}
            </span>
            <span className="w-[2px] h-[9px] bg-orange-500" />
            <span className="w-[14px] h-[14px] rounded-full bg-orange-500 border-[3px] border-ink-2" />
          </div>
          <div className="absolute left-0 right-0 top-[76px] flex justify-between font-mono text-[10px]">
            {months.map((l, i) => (
              <span
                key={l}
                className="w-0 flex justify-center whitespace-nowrap transition-colors duration-500"
                style={{ color: i === MF[f] ? '#F5F5F4' : i > MF[f] && f > 0 ? '#FF9A50' : '#71717A' }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>

      <span
        className="font-mono text-[11px] tracking-[0.1em] text-[#E25C00]"
        style={{ opacity: fin ? 1 : 0, transition: 'opacity .6s' }}
      >
        {t('hint')}
      </span>

      {levers.map(([k, x, w], i) => {
        const active = !fin || !!on[i];
        const visible = row > i;
        return (
          <button
            key={k}
            type="button"
            role="switch"
            aria-checked={active}
            disabled={!fin}
            onClick={() => toggle(i)}
            className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-x-3 gap-y-1 py-[15px] px-4 sm:px-5 rounded-card-sm text-[16px] text-left border disabled:cursor-default cursor-pointer"
            style={{
              background: flag === i + 1 && !fin ? '#FFE7D6' : '#F4F4F2',
              borderColor: fin && active ? '#FFD2B0' : 'transparent',
              textDecoration: active ? 'none' : 'line-through',
              color: '#0A0A0A',
              opacity: visible ? (active ? 1 : 0.5) : 0,
              transform: visible ? 'none' : 'translateY(18px)',
              transition: 'opacity .7s ease, transform .9s cubic-bezier(.2,.8,.2,1), background .6s',
            }}
          >
            <span className="flex gap-3 items-baseline">
              <span
                className="w-[18px] h-[18px] rounded-[5px] flex-none self-center grid place-items-center text-[12px] font-bold text-white border-[1.5px] transition-all duration-300"
                style={{ background: active ? '#FF6A00' : 'transparent', borderColor: active ? '#FF6A00' : '#C4C4C0' }}
                aria-hidden="true"
              >
                {active ? '✓' : ''}
              </span>
              <b className="font-mono text-[11px] tracking-[0.08em] text-orange-500">{k}</b>
              {x}
            </span>
            <span className="ml-auto flex gap-[10px] items-baseline whitespace-nowrap">
              <span className="font-mono text-[12px] text-zinc-500">{w}</span>
              <b className="font-mono text-[13px]">→ {dates[i + 1]}</b>
            </span>
          </button>
        );
      })}

      <div className="flex justify-between items-center pt-[6px] px-1 font-mono text-[12px] text-zinc-500">
        <span
          className="flex flex-wrap gap-3 items-center"
          style={{
            opacity: fin ? 1 : 0,
            transform: fin ? 'none' : 'translateY(6px) scale(0.96)',
            transition: 'opacity .8s, transform .8s cubic-bezier(.2,.8,.2,1.3)',
          }}
        >
          <span className="text-[24px] font-bold tracking-[-0.02em] font-sans text-white bg-orange-500 py-[6px] px-[14px] rounded-[10px] shadow-[0_8px_24px_rgba(255,106,0,0.35)]">
            {wk ? t(`badgeWeeks.${wk}`) : t('badgeNone')}
          </span>
          <span className="text-[13px]">{t('insteadOf')}</span>
        </span>
      </div>
    </div>
  );
}
