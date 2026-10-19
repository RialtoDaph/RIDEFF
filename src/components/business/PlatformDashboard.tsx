'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { SectionHead } from '../ui/SectionHead';

type Pair = [string, string];
type Biz = {
  greet: string;
  kpis: Pair[];
  sug: string;
  todo: string[];
  teamKi: string;
  shiftLabel: string;
  shifts: [string, string, string][];
  tasks: Pair[];
  domain: string;
  eyebrow: string;
  headline: string;
  b1: string;
  b2: string;
  listLabel: string;
  items: string[][];
  siteKi: string;
  photoAlt: string;
};

const PHOTOS = ['hotel', 'cafe', 'laden', 'label', 'praxis', 'handwerk'];
/** Weekday load profile (Mo–So) per industry, and average daily revenue. */
const BARS = [
  [62, 70, 74, 80, 96, 100, 88],
  [40, 48, 70, 82, 95, 100, 76],
  [52, 58, 55, 66, 78, 100, 0],
  [60, 72, 64, 90, 100, 84, 70],
  [88, 92, 100, 84, 70, 0, 0],
  [84, 90, 96, 100, 92, 30, 0],
];
const BASE = [11800, 1284, 2140, 3920, 5200, 4300];
/** Done items per industry: first todo, first two tasks. */
const RANGE_DAYS = [7, 30, 90, 365];
const MON: Record<string, string[]> = {
  de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  id: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
};
const END = new Date(2026, 9, 12);

type Pt = { v: number; l: string; x: number; y: number };

/** Deterministic revenue series (ported from the prototype's chSeries). */
function series(bi: number, ri: number, locale: string, wd: string[]) {
  const mon = MON[locale] ?? MON.de;
  const dot = locale === 'de' ? '.' : '';
  const day = (k: number) => {
    const d = new Date(END);
    d.setDate(d.getDate() - k);
    return d;
  };
  const lbl = (d: Date, withWd: boolean) => (withWd ? wd[(d.getDay() + 6) % 7] + ' ' : '') + d.getDate() + dot + ' ' + mon[d.getMonth()];
  const N = RANGE_DAYS[ri];
  const T = N * 2;
  const bars = BARS[bi];
  let s = 1234 + bi * 977 + ri * 131;
  const r = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  const tr: number[] = [];
  let t = 1;
  for (let d = 0; d < T; d++) {
    t *= 1 + (r() - 0.46) * 0.035;
    tr.push(t);
  }
  const tl = tr[T - 1];
  const days: number[] = [];
  for (let d = 0; d < T; d++) {
    const k = T - 1 - d;
    const dow = (((0 - k) % 7) + 7) % 7;
    days.push(BASE[bi] * (tr[d] / tl) * (Math.max(bars[dow], 35) / 100) * (0.86 + 0.28 * r()));
  }
  const prev = days.slice(0, N).reduce((a, b) => a + b, 0);
  const cur = days.slice(N);
  const tot = cur.reduce((a, b) => a + b, 0);
  let pts: Omit<Pt, 'x' | 'y'>[];
  if (ri < 2) pts = cur.map((v, i) => ({ v, l: lbl(day(N - 1 - i), true) }));
  else {
    pts = [];
    for (let i = N; i > 0; i -= 7) {
      const a = Math.max(0, i - 7);
      const w = cur.slice(a, i);
      pts.unshift({ v: w.reduce((x, y) => x + y, 0), l: lbl(day(N - i), false) + ' – ' + lbl(day(N - 1 - a), false) });
    }
  }
  const vs = pts.map((p) => p.v);
  const mn = Math.min(...vs);
  const mx = Math.max(...vs);
  const n = pts.length;
  const full: Pt[] = pts.map((p, i) => ({ ...p, x: n > 1 ? (i / (n - 1)) * 100 : 50, y: 8 + (1 - (p.v - mn) / (mx - mn || 1)) * 84 }));
  const line = full.map((p, i) => (i ? 'L' : 'M') + p.x.toFixed(2) + ' ' + p.y.toFixed(2)).join(' ');
  const ticks = [0, 1, 2, 3].map((j) => {
    const i = Math.round((j / 3) * (N - 1));
    const d = day(N - 1 - i);
    return ri === 0 ? wd[(d.getDay() + 6) % 7] : lbl(d, false);
  });
  return { pts: full, line, area: line + ' L100 100 L0 100 Z', tot, delta: tot / prev - 1, ticks, base: full[0].y };
}

const eur = (n: number, locale: string) => {
  const en = locale === 'en';
  if (n >= 1e6) return '€' + (n / 1e6).toFixed(2).replace('.', en ? '.' : ',') + (locale === 'id' ? ' jt' : en ? 'M' : ' Mio.');
  return '€' + Math.round(n).toLocaleString(en ? 'en-GB' : 'de-DE');
};

function Check({ done }: { done: boolean }) {
  return done ? (
    <span className="w-4 h-4 flex-none rounded-tag bg-orange-500 text-white text-[10px] flex items-center justify-center" aria-hidden="true">
      ✓
    </span>
  ) : (
    <span className="w-4 h-4 flex-none rounded-tag border-2 border-zinc-300" aria-hidden="true" />
  );
}

/**
 * Section 02 "Drei Teile, ein Gehirn.": tabs for Cockpit / Team-App / Website,
 * industry chips, and a mock dashboard with a hoverable revenue chart.
 */
export function PlatformDashboard() {
  const t = useTranslations('biz.platform');
  const ta = useTranslations('common');
  const locale = useLocale();
  const [biz, setBiz] = useState(1);
  const [tab, setTab] = useState(0);
  const [range, setRange] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  // Below 1024px the dashboard is a scaled-down picture: the chips and tabs above drive it.
  const wide = useSyncExternalStore(
    (cb) => {
      const mq = matchMedia('(min-width: 1024px)');
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => matchMedia('(min-width: 1024px)').matches,
    () => true,
  );

  const industries = t.raw('industries') as Pair[];
  const tabs = t.raw('tabs') as [string, string, string][];
  const side = t.raw('side') as string[];
  const d = (t.raw('data') as Biz[])[biz];
  const wd = t.raw('weekdays') as string[];
  const ranges = t.raw('ranges') as string[];
  const c = useMemo(() => series(biz, range, locale, wd), [biz, range, locale, wd]);
  const hv = hover !== null && hover < c.pts.length ? hover : -1;
  const p = c.pts[hv < 0 ? c.pts.length - 1 : hv];
  const up = c.delta >= 0;
  const pct = (c.delta * 100).toFixed(1);
  const delta = (up ? '▲ +' : '▼ ') + (locale === 'en' ? pct : pct.replace('.', ',')) + ' %';

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] gap-12 items-start py-[88px]">
      <div className="lg:absolute lg:top-[88px] lg:right-0 flex gap-[6px] flex-wrap lg:justify-end order-2 lg:order-none" role="group" aria-label={t('title')}>
        {industries.map(([label], i) => {
          const on = i === biz;
          return (
            <button
              key={label}
              type="button"
              aria-pressed={on}
              onClick={() => setBiz(i)}
              className="cursor-pointer text-[13px] font-semibold py-[7px] px-[13px] rounded-full border transition-[background] duration-200 min-h-[36px]"
              style={{ borderColor: on ? '#F5F5F4' : '#2A2A2E', background: on ? '#F5F5F4' : 'transparent', color: on ? '#0A0A0A' : '#D4D4D8' }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-7 order-1 lg:order-none">
        <SectionHead id="plattform-title" num="02" label={t('eyebrow')} title={t('title')} tone="dark" />
        <div className="flex flex-col border-t border-line-d3" role="tablist" aria-label={t('title')}>
          {tabs.map(([num, title, sub], i) => {
            const on = i === tab;
            return (
              <button
                key={num}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setTab(i)}
                className="cursor-pointer py-4 border-b border-line-d3 flex flex-col gap-1 text-left transition-[padding] duration-200"
                style={{ paddingLeft: on ? 14 : 0, borderLeft: on ? '2px solid #FF6A00' : '0 solid transparent' }}
              >
                <span className="font-mono text-[11px]" style={{ color: on ? '#FF6A00' : '#71717A' }}>{num}</span>
                <span className="text-[20px] font-bold" style={{ color: on ? '#fff' : '#A1A1AA' }}>{title}</span>
                <span className="text-[14px] text-zinc-450">{sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:pt-16 order-3 lg:order-none min-w-0 [zoom:0.41] min-[400px]:[zoom:0.46] min-[480px]:[zoom:0.56] min-[640px]:[zoom:0.71] min-[768px]:[zoom:0.88] lg:[zoom:0.67] xl:[zoom:1]">
        <div
          role="tabpanel"
          inert={!wide}
          className="w-[780px] max-w-none lg:max-w-full h-[470px] bg-white text-ink border border-[#E7E5E4] rounded-card-md shadow-[0_40px_90px_rgba(0,0,0,0.45)] grid grid-cols-[200px_minmax(0,1fr)] overflow-hidden"
        >
          <div className="bg-[#F7F7F6] border-r border-[#EDEDEC] py-[18px] px-[14px] flex flex-col gap-1 text-[14px]">
            <div className="font-mono text-[11px] tracking-[0.1em] text-zinc-500 px-[10px] pb-[10px]">{industries[biz][1]}</div>
            {side.map((label, i) => {
              const on = i === tab;
              return (
                <button
                  key={label}
                  type="button"
                  disabled={i > 2}
                  onClick={() => i < 3 && setTab(i)}
                  className="text-left py-[9px] px-[10px] rounded-[8px] border cursor-pointer disabled:cursor-default"
                  style={{ background: on ? '#fff' : 'transparent', borderColor: on ? '#E7E5E4' : 'transparent', fontWeight: on ? 600 : 400, color: on ? '#0A0A0A' : '#52525B' }}
                >
                  {label}
                </button>
              );
            })}
            <div className="mt-auto p-[10px] rounded-[10px] bg-orange-50 border border-orange-100 flex gap-2 items-center">
              <span className="font-mono text-[10px] font-medium tracking-[0.1em] bg-orange-500 text-white rounded-tag py-[2px] px-[6px] flex-none">{ta('ai')}</span>
              <span className="text-[12px] font-semibold text-orange-900">{t('brainActive')}</span>
            </div>
          </div>

          {tab === 0 && (
            <div className="p-[22px] flex flex-col gap-4 h-full min-w-0">
              <div className="flex justify-between items-baseline">
                <span className="text-[20px] font-bold tracking-[-0.02em]">{d.greet}</span>
                <span className="font-mono text-[12px] text-zinc-500">{t('clock')}</span>
              </div>
              <div className="grid grid-cols-4 gap-[10px]">
                {d.kpis.map(([l, v]) => (
                  <div key={l} className="border border-[#EDEDEC] rounded-[12px] py-3 px-[14px] bg-white">
                    <div className="text-[12px] text-zinc-500">{l}</div>
                    <div className="text-[24px] font-bold tracking-[-0.02em]">{v}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-[10px] flex-1 min-h-0">
                <div className="border border-[#EDEDEC] rounded-[12px] p-[14px] flex flex-col gap-[10px] bg-white min-w-0">
                  <div className="flex justify-between items-start gap-[10px]">
                    <div className="flex flex-col gap-[3px] min-w-0">
                      <span className="text-[12px] text-zinc-500">{t('revenue')}</span>
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-[24px] font-bold tracking-[-0.02em] tabular-nums">{eur(hv < 0 ? c.tot : p.v, locale)}</span>
                        <span
                          className="font-mono text-[12px] font-medium py-[2px] px-[6px] rounded-tag"
                          style={{ color: up ? '#15803D' : '#B91C1C', background: up ? '#DCFCE7' : '#FEE2E2' }}
                        >
                          {delta}
                        </span>
                        <span className="text-[12px] text-zinc-500">{(t.raw('rangeCmp') as string[])[range]}</span>
                      </div>
                      <span className="font-mono text-[11px] text-zinc-500">{hv < 0 ? (t.raw('rangeSub') as string[])[range] : p.l}</span>
                    </div>
                    <div className="flex gap-[2px] p-[3px] rounded-[8px] bg-stone-100 flex-none">
                      {ranges.map((label, i) => (
                        <button
                          key={label}
                          type="button"
                          aria-pressed={i === range}
                          onClick={() => {
                            setRange(i);
                            setHover(null);
                          }}
                          className="font-mono text-[11px] py-1 px-2 rounded-[6px] cursor-pointer"
                          style={{
                            background: i === range ? '#fff' : 'transparent',
                            color: i === range ? '#0A0A0A' : '#71717A',
                            boxShadow: i === range ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div
                    className="relative flex-1 min-h-[110px] cursor-crosshair"
                    onMouseMove={(e) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
                      setHover(Math.round(f * (c.pts.length - 1)));
                    }}
                    onMouseLeave={() => setHover(null)}
                  >
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible block" aria-hidden="true">
                      <defs>
                        <linearGradient id="rdeChG" x1={0} y1={0} x2={0} y2={1}>
                          <stop offset="0%" stopColor="#FF6A00" stopOpacity={0.22} />
                          <stop offset="100%" stopColor="#FF6A00" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      {[25, 50, 75].map((y) => (
                        <line key={y} x1={0} x2={100} y1={y} y2={y} stroke="#F1F1EF" strokeWidth={1} vectorEffect="non-scaling-stroke" />
                      ))}
                      <line x1={0} x2={100} y1={c.base} y2={c.base} stroke="#A1A1AA" strokeWidth={1} strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
                      <path d={c.area} fill="url(#rdeChG)" />
                      <path d={c.line} fill="none" stroke="#FF6A00" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                    </svg>
                    <div className="absolute top-0 bottom-0 w-px bg-ink pointer-events-none" style={{ left: `${p.x}%`, opacity: hv < 0 ? 0 : 0.25 }} />
                    <div
                      className="absolute w-[10px] h-[10px] -mt-[5px] -ml-[5px] rounded-full bg-orange-500 border-2 border-white shadow-[0_0_0_1px_#FF6A00] pointer-events-none"
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    />
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-zinc-400">
                    {c.ticks.map((tk, i) => (
                      <span key={i}>{tk}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="rounded-[12px] py-3 px-[14px] bg-orange-500 text-white flex flex-col gap-1">
                    <span className="font-mono text-[10px] tracking-[0.1em]">{t('suggestion')}</span>
                    <span className="text-[14px] font-semibold leading-[1.35]">{d.sug}</span>
                  </div>
                  {d.todo.map((x, i) => (
                    <div key={x} className="border border-[#EDEDEC] rounded-[12px] py-[10px] px-[14px] text-[13px] flex gap-2 items-center bg-white">
                      <Check done={i === 0} />
                      <span style={{ color: i === 0 ? '#71717A' : '#0A0A0A', textDecoration: i === 0 ? 'line-through' : 'none' }}>{x}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 1 && (
            <div className="p-[22px] flex flex-col gap-4 min-w-0">
              <div className="flex justify-between items-baseline">
                <span className="text-[20px] font-bold tracking-[-0.02em]">{t('teamToday')}</span>
                <span className="font-mono text-[12px] text-zinc-500">{t('clock')}</span>
              </div>
              <div className="rounded-[12px] py-3 px-[14px] bg-orange-500 text-white flex gap-3 items-center">
                <span className="font-mono text-[10px] tracking-[0.1em] flex-none">{ta('ai')}</span>
                <span className="text-[14px] font-semibold">{d.teamKi}</span>
              </div>
              <div className="grid grid-cols-2 gap-[10px]">
                <div className="border border-[#EDEDEC] rounded-[12px] p-[14px] bg-white flex flex-col gap-[10px]">
                  <div className="text-[12px] text-zinc-500">{d.shiftLabel}</div>
                  <div>
                    {d.shifts.map(([n, time, note], i) => (
                      <div key={n} className="grid grid-cols-[64px_minmax(0,1fr)_auto] gap-[10px] items-center text-[14px] py-2 border-t border-stone-150">
                        <span className="font-semibold">{n}</span>
                        <span className="font-mono text-[12px] text-zinc-600">{time}</span>
                        <span className="text-[12px]" style={{ color: i === 1 ? '#C2410C' : '#71717A', fontWeight: i === 1 ? 600 : 400 }}>{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-[#EDEDEC] rounded-[12px] p-[14px] bg-white flex flex-col gap-[10px]">
                  <div className="text-[12px] text-zinc-500">{t('tasks')}</div>
                  <div>
                    {d.tasks.map(([x, who], i) => (
                      <div key={x} className="flex gap-2 items-center text-[13px] py-[7px] border-t border-stone-150">
                        <Check done={i < 2} />
                        <span className="flex-1" style={{ color: i < 2 ? '#71717A' : '#0A0A0A', textDecoration: i < 2 ? 'line-through' : 'none' }}>{x}</span>
                        <span className="font-mono text-[11px] text-zinc-500">{who}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 2 && (
            <div className="p-[22px] flex flex-col gap-[14px] h-full min-w-0">
              <div className="flex justify-between items-center py-2 px-3 rounded-full bg-[#F7F7F6] border border-[#EDEDEC] font-mono text-[11px] text-zinc-500">
                <span>{d.domain}</span>
                <span>{t('live')}</span>
              </div>
              <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-4 flex-1">
                <div className="relative rounded-[12px] overflow-hidden bg-[#3F3A34] min-h-[230px] flex flex-col justify-end">
                  <Image
                    src={`/images/sites/site-${PHOTOS[biz]}.jpg`}
                    alt={d.photoAlt}
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(10,10,10,0)_25%,rgba(10,10,10,0.78)_100%)]" />
                  <div className="relative p-[18px] flex flex-col gap-[10px] text-white">
                    <span className="font-mono text-[11px] tracking-[0.1em] text-[#E4E4E7]">{d.eyebrow}</span>
                    <span className="text-[24px] font-bold tracking-[-0.03em] leading-[1.05] text-balance">{d.headline}</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[13px] font-semibold py-[9px] px-[14px] rounded-full bg-orange-500 text-white whitespace-nowrap">{d.b1}</span>
                      <span className="text-[13px] font-semibold py-[9px] px-[14px] rounded-full bg-white/16 border border-white/35 text-white whitespace-nowrap">{d.b2}</span>
                    </div>
                  </div>
                </div>
                <div className="border border-[#EDEDEC] rounded-[12px] p-[14px] bg-white flex flex-col gap-[10px]">
                  <div className="text-[12px] text-zinc-500">{d.listLabel}</div>
                  <div>
                    {d.items.map(([n, desc, price, tag]) => (
                      <div key={n} className="flex justify-between gap-3 items-center py-[10px] border-t border-stone-150">
                        <div className="flex flex-col gap-[2px]">
                          <span className="text-[14px] font-semibold flex gap-2 items-center">
                            {n}
                            {tag && (
                              <span className="font-mono text-[10px] tracking-[0.08em] text-orange-700 bg-orange-50 border border-orange-100 rounded-tag py-px px-[5px]">{tag}</span>
                            )}
                          </span>
                          <span className="text-[12px] text-zinc-500">{desc}</span>
                        </div>
                        <span className="font-mono text-[13px] whitespace-nowrap">{price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-[12px] py-3 px-[14px] bg-orange-50 border border-orange-100 flex gap-3 items-center">
                <span className="font-mono text-[10px] font-medium tracking-[0.1em] bg-orange-500 text-white rounded-tag py-[2px] px-[6px] flex-none">{ta('ai')}</span>
                <span className="text-[13px] font-semibold text-orange-900">{d.siteKi}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
