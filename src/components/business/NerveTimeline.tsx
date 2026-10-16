'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SectionHead } from '../ui/SectionHead';

/** Minutes since midnight and label position for each event of the day. */
const TIMES = [390, 433, 640, 680, 900, 1260];
const POS = ['up', 'down', 'up', 'down', 'up', 'down'];
const STEP_MS = 2400;
const nx = (m: number) => ((m - 360) / 900) * 100;
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/**
 * Section 03 "Sie müssen nicht nachsehen. Es meldet sich.": a Tuesday in the
 * café on a 06:00–21:00 line, and the matching notifications on a lock screen.
 * Advances every 2.4 s while visible (one pause step after the last event).
 */
export function NerveTimeline() {
  const t = useTranslations('biz.nerven');
  const ta = useTranslations('common');
  const reduce = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>();
  const [nk, setNk] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const i = setInterval(() => setNk((n) => (n + 1) % (TIMES.length + 1)), STEP_MS);
    return () => clearInterval(i);
  }, [inView, reduce]);

  const events = t.raw('events') as [string, string, string, string][];
  const k = reduce ? TIMES.length - 1 : Math.min(nk, TIMES.length - 1);
  const clock = hm(TIMES[k]);

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-12 lg:gap-[72px] items-start py-24">
      <div className="flex flex-col gap-6 lg:pt-10">
        <SectionHead id="nerven-title" num="03" label={t('eyebrow')} title={t('title')} tone="dark" />
        <p className="text-[17px] leading-[1.55] text-zinc-400 m-0 max-w-[560px]">{t('lead')}</p>
        <div className="mt-2 border border-line-d3 bg-night-1 rounded-card pt-[18px] px-[22px] pb-4 flex flex-col gap-[14px] overflow-x-auto">
          <div className="flex justify-between items-center gap-4 font-mono text-[11px] tracking-[0.12em] text-zinc-450">
            <span>{t('day')}</span>
            <span className="flex gap-2 items-center whitespace-nowrap">
              <span className="w-[7px] h-[7px] rounded-full bg-orange-500" />
              <span>{t('now')}</span>
              <span>·</span>
              <span>{clock}</span>
            </span>
          </div>
          <div className="relative h-[116px] mx-[6px] min-w-[560px]" aria-hidden="true">
            <div className="absolute left-0 right-0 top-[60px] h-[2px] bg-line-d3" />
            <div
              className="absolute left-0 top-[59px] h-1 rounded-tag bg-orange-500 shadow-[0_0_12px_rgba(255,106,0,0.5)]"
              style={{ width: `${nx(TIMES[k])}%`, transition: 'width 1.2s cubic-bezier(.4,0,.2,1)' }}
            />
            {events.map(([title, sub], i) => {
              const x = nx(TIMES[i]);
              const past = i <= k;
              const cur = i === k;
              return (
                <div key={i}>
                  <div
                    className="absolute top-[55px] w-3 h-3 -ml-[6px] rounded-full border-2 transition-all duration-400"
                    style={{
                      left: `${x}%`,
                      background: past ? '#FF6A00' : '#0B0B0C',
                      borderColor: past ? '#FF6A00' : '#52525B',
                      boxShadow: cur ? '0 0 0 6px rgba(255,106,0,0.2)' : 'none',
                    }}
                  />
                  <div
                    className="absolute flex flex-col gap-px whitespace-nowrap transition-opacity duration-400"
                    style={{
                      left: `${x}%`,
                      top: POS[i] === 'up' ? 0 : 76,
                      transform: x < 10 ? 'translateX(-12px)' : x > 95 ? 'translateX(calc(-100% + 6px))' : 'translateX(-50%)',
                      textAlign: x < 10 ? 'left' : x > 95 ? 'right' : 'center',
                      opacity: past ? 1 : 0.55,
                    }}
                  >
                    <span className="text-[14px] font-semibold" style={{ color: past ? '#fff' : '#71717A' }}>{title}</span>
                    <span className="text-[12px] text-zinc-450">{sub}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between font-mono text-[10px] text-zinc-500 min-w-[560px]" aria-hidden="true">
            {['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
        </div>
      </div>

      <div
        className="w-[340px] max-w-full h-[600px] rounded-[44px] bg-night-3 border-8 border-[#27272A] pt-14 px-[14px] pb-[14px] flex flex-col gap-2 shadow-[0_40px_80px_rgba(0,0,0,0.5)] justify-self-center lg:justify-self-auto"
        aria-hidden="true"
      >
        <div className="text-center text-white flex flex-col gap-[6px] mb-[18px]">
          <span className="text-[13px] text-zinc-400">{t('date')}</span>
          <span className="text-[64px] font-semibold tracking-[-0.04em] leading-[1.1]">{clock}</span>
        </div>
        <div className="flex flex-col gap-2">
          {Array.from({ length: Math.min(3, k + 1) }, (_, j) => k - j).map((i) => {
            const top = i === k;
            const [, , title, text] = events[i];
            return (
              <div
                key={i}
                className="rounded-card py-3 px-[14px] flex gap-[10px] border transition-[background,border-color] duration-400"
                style={{
                  background: top ? 'rgba(255,106,0,0.16)' : 'rgba(255,255,255,0.08)',
                  borderColor: top ? '#5A2A08' : 'rgba(255,255,255,0.1)',
                  animation: top && !reduce ? 'nIn .5s cubic-bezier(.2,.8,.2,1)' : 'none',
                }}
              >
                <span className="w-[26px] h-[26px] flex-none rounded-[7px] bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {ta('ai')}
                </span>
                <div className="flex-1 min-w-0 flex flex-col gap-[2px]">
                  <div className="flex justify-between text-[12px] text-zinc-400">
                    <span className="font-semibold text-white">{t('from')}</span>
                    <span>{top ? t('justNow') : hm(TIMES[i])}</span>
                  </div>
                  <span className="text-[14px] font-semibold text-white">{title}</span>
                  <span className="text-[13px] text-zinc-300">{text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
