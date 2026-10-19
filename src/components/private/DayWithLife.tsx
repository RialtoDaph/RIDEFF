'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Scene = { time: string; dot: string; title: string; text: string; label: string; msg: string; a1: string; a2: string; bali: string };

const INTERVAL = 4200;
const BAR = ['61%', '62%', '62%', '63%'];

/**
 * "Ein Tag mit Life": four scenes that auto-advance every 4.2 s while the
 * section is in view (rootMargin 0 0 -25% 0). No pinning, no scroll-jacking.
 * Clicking a dot jumps to that scene and restarts the timer.
 */
export function DayWithLife({ num }: { num: string }) {
  const t = useTranslations('life.day');
  const ta = useTranslations('common');
  const reduce = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>({ rootMargin: '0px 0px -25% 0px' });
  const [n, setN] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const scenes = t.raw('scenes') as Scene[];

  useEffect(() => {
    if (!inView || reduce) return;
    const i = setInterval(() => setN((x) => (x + 1) % 4), INTERVAL);
    return () => clearInterval(i);
  }, [inView, reduce, epoch]);

  const go = (i: number) => {
    setN(i);
    setEpoch((e) => e + 1);
  };

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-14 lg:gap-20 items-center py-[88px]"
    >
      <div className="flex flex-col gap-7 min-w-0">
        <div className="font-mono text-[12px] tracking-[0.12em] text-muted flex gap-[10px]">
          <span data-sec-num="" className="text-orange-500">{num}</span>
          <span>{t('eyebrow')}</span>
        </div>
        <div className="font-mono text-[clamp(56px,10vw,88px)] font-semibold tracking-[-0.04em] leading-none text-ink" aria-hidden="true">
          {scenes[n].time}
        </div>
        <div className="grid" aria-live="polite">
          {scenes.map((c, i) => (
            <div
              key={c.time}
              className="[grid-area:1/1] flex flex-col gap-[14px]"
              aria-hidden={i !== n}
              style={{
                opacity: i === n ? 1 : 0,
                transform: i === n ? 'none' : i < n ? 'translateY(-24px)' : 'translateY(24px)',
                transition: 'opacity .6s ease, transform .7s cubic-bezier(.2,.8,.2,1)',
              }}
            >
              {i === n ? (
                <h2 id="p-tag-title" className="text-[clamp(34px,5vw,48px)] font-bold tracking-[-0.045em] leading-[1.05] m-0 text-balance">
                  {c.title}
                </h2>
              ) : (
                <p className="text-[clamp(34px,5vw,48px)] font-bold tracking-[-0.045em] leading-[1.05] m-0 text-balance">{c.title}</p>
              )}
              <p className="text-[19px] leading-[1.55] text-zinc-600 m-0 max-w-[520px] text-pretty">{c.text}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2 items-center flex-wrap" role="group" aria-label={t('eyebrow')}>
          {scenes.map((c, i) => (
            <button
              key={c.dot}
              type="button"
              onClick={() => go(i)}
              aria-current={i === n ? 'step' : undefined}
              aria-label={`${c.time} ${c.dot}`}
              className="flex items-center gap-2 cursor-pointer py-2 min-h-[44px]"
            >
              <span
                className="h-[6px] rounded-full transition-all duration-500"
                style={{ width: i === n ? 40 : 14, background: i <= n ? '#FF6A00' : '#D4D4D0' }}
              />
              <span
                className="font-mono text-[11px] tracking-[0.08em] transition-colors duration-500"
                style={{ color: i === n ? '#0A0A0A' : '#A1A1AA' }}
              >
                {c.dot}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        className="h-[600px] aspect-[1/2] rounded-[48px] bg-ink-2 p-3 shadow-[0_40px_80px_rgba(0,0,0,0.22),0_0_0_1px_#26262A] justify-self-center lg:justify-self-end origin-top max-md:scale-[0.82] max-md:-mb-[108px]"
        aria-hidden="true"
      >
        <div className="w-full h-full rounded-[38px] bg-night-1 overflow-hidden flex flex-col text-stone-50">
          <div className="flex justify-between pt-[18px] px-6 pb-2 text-[13px] font-semibold">
            <span>{scenes[n].time}</span>
            <span className="font-mono text-[11px] text-zinc-450">{t('phoneBrand')}</span>
          </div>
          <div className="pt-2 px-5 pb-5 flex flex-col gap-3 flex-1">
            <div className="flex justify-between items-center py-3 px-[14px] rounded-card-sm bg-night-3 border border-line-d3">
              <span className="text-[12px] text-zinc-400">{t('goal')}</span>
              <span className="font-mono text-[13px] font-semibold text-orange-400">{scenes[n].bali}</span>
            </div>
            <div className="h-[6px] rounded-full bg-line-d3 overflow-hidden">
              <div
                className="h-full bg-orange-500"
                style={{ width: BAR[n], transition: 'width 1s cubic-bezier(.2,.8,.2,1)' }}
              />
            </div>
            <div className="grid flex-1 content-start">
              {scenes.map((c, i) => (
                <div
                  key={c.time}
                  className="[grid-area:1/1] flex flex-col gap-[10px]"
                  style={{
                    opacity: i === n ? 1 : 0,
                    transform: i === n ? 'none' : i < n ? 'translateY(-16px) scale(0.98)' : 'translateY(16px) scale(0.98)',
                    transition: 'opacity .5s ease, transform .6s cubic-bezier(.2,.8,.2,1)',
                  }}
                >
                  <div className="p-4 rounded-card-md bg-line-d1 border border-[#2E2E33] flex flex-col gap-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] bg-orange-500 text-white rounded-tag py-[2px] px-[6px]">{ta('ai')}</span>
                      <span className="font-mono text-[10px] tracking-[0.1em] text-zinc-450">{c.label}</span>
                    </div>
                    <span className="text-[15px] leading-[1.45]">{c.msg}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex-1 text-center p-[10px] rounded-[12px] bg-orange-500 text-white text-[13px] font-semibold">{c.a1}</span>
                    <span className="flex-1 text-center p-[10px] rounded-[12px] bg-night-3 border border-[#2E2E33] text-zinc-400 text-[13px]">{c.a2}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
