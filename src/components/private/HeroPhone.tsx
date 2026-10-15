'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Pair = [string, string];
type Triple = [string, string, string];

/** Side-card palettes from the prototype (CP). */
const CP = [
  { bg: '#111113', bd: '#2A2A2E', fg: '#fff', k: '#8A8A93', s: '#A1A1AA' },
  { bg: '#FF6A00', bd: '#FF8A3D', fg: '#fff', k: '#FFE7D6', s: '#FFF4EC' },
  { bg: '#FFFFFF', bd: '#E4E4E7', fg: '#0A0A0A', k: '#C2410C', s: '#52525B' },
  { bg: '#FFF4EC', bd: '#FFD9BF', fg: '#0A0A0A', k: '#C2410C', s: '#7C4A2A' },
  { bg: '#1D4ED8', bd: '#3B6BF0', fg: '#fff', k: '#BFD3FF', s: '#DCE6FF' },
  { bg: '#15803D', bd: '#22A355', fg: '#fff', k: '#BBF7D0', s: '#DCFCE7' },
];

type Roll = { L: [number, number]; R: [number, number]; lc: [number, number]; ly: number; lz: number; ry: number; rz: number };
/** Deterministic first layout (keeps SSR and hydration identical). */
const FIRST: Roll = { lc: [0, 1], L: [8, 30], R: [340, 330], ly: 7, lz: 0, ry: -7, rz: 0 };

function roll(): Roll {
  const r = (a: number, b: number) => a + Math.random() * (b - a);
  const p = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
  const a = Math.floor(Math.random() * 6);
  let b = a;
  while (b === a) b = Math.floor(Math.random() * 6);
  return {
    L: p([[8, 30], [0, 190], [16, 350], [40, 450]] as [number, number][]),
    R: p([[344, 20], [356, 170], [340, 330], [330, 440]] as [number, number][]),
    lc: [a, b],
    ly: r(5, 10),
    lz: r(-2, 2),
    ry: r(-10, -5),
    rz: r(-2, 2),
  };
}

const POP = 'cubic-bezier(.3,1.5,.5,1)';

/**
 * Animated phone in the Life hero: five screens, a push notification, and two
 * tilted info cards beside the phone. Loops only while the hero is visible.
 */
export function HeroPhone() {
  const t = useTranslations('life.phone');
  const reduce = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>();
  const [li, setLi] = useState(0);
  const [shown, setShown] = useState(-1);
  const [nt, setNt] = useState(false);
  const [pop, setPop] = useState(false);
  const [rnd, setRnd] = useState<Roll>(FIRST);
  const liRef = useRef(0);

  useEffect(() => {
    if (reduce) {
      // Static final frame: first screen and its cards, no loop.
      setShown(liRef.current);
      setNt(false);
      return;
    }
    if (!inView) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
    const step = () => {
      setNt(true);
      setPop(true);
      later(350, () => setPop(false));
      later(1900, () => setNt(false));
      later(2300, () => {
        let n = liRef.current;
        while (n === liRef.current) n = Math.floor(Math.random() * 5);
        liRef.current = n;
        setLi(n);
        setShown(-1);
        later(620, () => {
          setRnd(roll());
          setShown(n);
        });
      });
    };
    later(300, () => setShown(liRef.current));
    const loop = () => {
      step();
      later(3200 + Math.random() * 1600, loop);
    };
    later(1400, loop);
    return () => timers.forEach(clearTimeout);
  }, [inView, reduce]);

  const st = (k: number, i: number): CSSProperties => ({
    opacity: shown === k ? 1 : 0,
    transform: shown === k ? 'none' : 'translateY(14px) scale(0.92)',
    transition: `opacity .35s ease ${i * 70}ms, transform .5s ${POP} ${i * 70}ms`,
  });

  const cardsOn = shown === li && shown >= 0;
  const card = (t.raw('cards') as string[][])[li];
  const lc = CP[rnd.lc[0]];
  const rc = CP[rnd.lc[1]];
  const notifs = t.raw('notifs') as string[];

  const s0 = t.raw('s0') as { label: string; title: string; goalLabel: string; goalValue: string; week: string; items: Pair[] };
  const s1 = t.raw('s1') as { label: string; title: string; stats: Pair[]; rows: Pair[] };
  const s2 = t.raw('s2') as { label: string; title: string; subs: Triple[]; saved: string; savedValue: string };
  const s3 = t.raw('s3') as { label: string; title: string; days: string[]; rows: Pair[] };
  const s4 = t.raw('s4') as { label: string; title: string; pct: string; value: string; rows: Pair[] };

  const screen = 'w-[252px] flex-none pt-[46px] px-4 pb-5 flex flex-col gap-3';
  const label = 'font-mono text-[10px] tracking-[0.1em] text-zinc-500';
  const title = 'text-[23px] font-bold tracking-[-0.03em] leading-[1.05]';
  const row = 'flex justify-between gap-[10px] p-[11px] rounded-[12px] bg-stone-100';
  const rowColor = ['#C2410C', '#1D4ED8', '#15803D', '#FF6A00'];
  const sideCard = (side: 'L' | 'R', c: (typeof CP)[number]): CSSProperties => ({
    background: c.bg,
    borderColor: c.bd,
    color: c.fg,
    transformOrigin: side === 'L' ? 'right center' : 'left center',
    opacity: cardsOn ? 1 : 0,
    transform: cardsOn
      ? side === 'L'
        ? `rotateY(${rnd.ly}deg) rotateZ(${rnd.lz}deg)`
        : `rotateY(${rnd.ry}deg) rotateZ(${rnd.rz}deg)`
      : side === 'L'
        ? 'translate3d(60px,10px,-120px) rotateY(20deg) scale(0.85)'
        : 'translate3d(-60px,-10px,-120px) rotateY(-20deg) scale(0.85)',
    transition: `transform .6s cubic-bezier(.2,.9,.3,1) ${side === 'L' ? 0 : 140}ms, opacity .35s ease ${side === 'L' ? 0 : 140}ms`,
  });

  return (
    <div
      ref={ref}
      className="hidden md:flex relative h-[560px] gap-4 items-center justify-center"
      aria-hidden="true"
    >
      <div
        className="w-[280px] h-[520px] rounded-[42px] bg-black p-[10px] border border-line-d4 flex-none"
        style={{ transform: pop ? 'scale(1.025)' : 'scale(1)', transition: 'transform .35s cubic-bezier(.3,1.6,.5,1)' }}
      >
        <div className="relative h-full rounded-[33px] bg-white text-ink overflow-hidden">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[84px] h-6 rounded-full bg-black z-[3]" />
          <div
            className="flex h-full w-[1260px]"
            style={{ transform: `translateX(${-252 * li}px)`, transition: 'transform .65s cubic-bezier(.65,0,.35,1)' }}
          >
            {/* 0 · Briefing */}
            <div className={screen}>
              <span className={label} style={st(0, 0)}>{s0.label}</span>
              <span className={title} style={st(0, 1)}>{s0.title}</span>
              <div className="flex flex-col gap-[6px] p-[13px] rounded-[14px] bg-orange-500 text-white" style={st(0, 2)}>
                <span className="font-mono text-[10px] tracking-[0.1em]">{s0.goalLabel}</span>
                <span className="text-[17px] font-bold">{s0.goalValue}</span>
                <div className="h-[6px] rounded-full bg-white/30">
                  <div className="w-[65%] h-full rounded-full bg-white" />
                </div>
              </div>
              <span className="text-[13px] font-semibold" style={st(0, 3)}>{s0.week}</span>
              <div className="flex flex-col gap-[7px] text-[12.5px]">
                {s0.items.map(([a, b], i) => (
                  <div key={a} className={row} style={st(0, 4 + i)}>
                    <span>{a}</span>
                    <span className="font-semibold whitespace-nowrap" style={{ color: ['#C2410C', '#15803D', '#1D4ED8'][i] }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 1 · Found today */}
            <div className={screen}>
              <span className={label} style={st(1, 0)}>{s1.label}</span>
              <span className={title} style={st(1, 1)}>{s1.title}</span>
              <div className="grid grid-cols-3 gap-[5px]">
                {s1.stats.map(([k, v], i) => (
                  <div
                    key={k}
                    className={`flex flex-col gap-[3px] py-[9px] px-[10px] rounded-[12px] text-white ${i === 2 ? 'bg-orange-500' : 'bg-ink'}`}
                    style={st(1, 2 + i)}
                  >
                    <span className={`font-mono text-[8.5px] tracking-[0.1em] ${i === 2 ? 'text-white' : 'text-zinc-400'}`}>{k}</span>
                    <span className="text-[15px] font-bold whitespace-nowrap">{v}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-[12px] bg-stone-100 text-[12.5px] overflow-hidden">
                {s1.rows.map(([k, v], i) => (
                  <div
                    key={k}
                    className={`grid grid-cols-[52px_minmax(0,1fr)] gap-2 py-[10px] px-3 ${i < 3 ? 'border-b border-stone-250' : ''}`}
                    style={st(1, 5 + i)}
                  >
                    <span className="font-mono text-[9px] tracking-[0.1em] pt-[2px]" style={{ color: rowColor[i] }}>{k}</span>
                    <span className="font-medium leading-[1.3]">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2 · Money */}
            <div className={screen}>
              <span className={label} style={st(2, 0)}>{s2.label}</span>
              <span className={title} style={st(2, 1)}>{s2.title}</span>
              <div className="flex flex-col gap-[7px] text-[12.5px]">
                {s2.subs.map(([n, d, p], i) => (
                  <div key={n} className={`${row} items-center !gap-2`} style={st(2, 2 + i)}>
                    <div className="flex flex-col gap-[2px]">
                      <span className={`font-semibold ${i < 3 ? 'text-zinc-400 line-through' : ''}`}>{n}</span>
                      <span className="text-[11px] text-zinc-500">{d}</span>
                    </div>
                    <span className={`font-semibold whitespace-nowrap ${i < 3 ? 'text-orange-700' : 'text-ink'}`}>{p}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-[12px] bg-ink text-white text-[13px] font-semibold flex justify-between" style={st(2, 6)}>
                <span>{s2.saved}</span>
                <span className="text-orange-400">{s2.savedValue}</span>
              </div>
            </div>

            {/* 3 · Time */}
            <div className={screen}>
              <span className={label} style={st(3, 0)}>{s3.label}</span>
              <span className={title} style={st(3, 1)}>{s3.title}</span>
              <div className="flex gap-[6px] p-3 rounded-[14px] bg-stone-100">
                {s3.days.map((d, i) => (
                  <div key={d} className="flex flex-col items-center gap-[6px] flex-1" style={st(3, 2 + i)}>
                    <div className="w-full h-[90px] flex items-end">
                      <div
                        className="w-full rounded-[6px]"
                        style={{ height: ['70%', '40%', '85%', '35%', '60%'][i], background: i % 2 ? '#93C5FD' : '#D4D4D8' }}
                      />
                    </div>
                    <span className="font-mono text-[9px] text-zinc-500">{d}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-[7px] text-[12.5px]">
                {s3.rows.map(([a, b], i) => (
                  <div key={a} className={row} style={st(3, 7 + i)}>
                    <span>{a}</span>
                    <span className="font-semibold text-[#1D4ED8] whitespace-nowrap">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4 · Goal */}
            <div className={screen}>
              <span className={label} style={st(4, 0)}>{s4.label}</span>
              <span className={title} style={st(4, 1)}>{s4.title}</span>
              <div className="flex flex-col gap-[10px] p-4 rounded-[14px] bg-orange-500 text-white" style={st(4, 2)}>
                <span className="text-[30px] font-bold tracking-[-0.04em]">{s4.pct}</span>
                <div className="h-2 rounded-full bg-white/30">
                  <div className="w-[65%] h-full rounded-full bg-white" />
                </div>
                <span className="text-[12px]">{s4.value}</span>
              </div>
              <div className="flex flex-col gap-[7px] text-[12.5px]">
                {s4.rows.map(([a, b], i) => (
                  <div key={a} className={row} style={st(4, 3 + i)}>
                    <span>{a}</span>
                    <span className="font-semibold whitespace-nowrap" style={{ color: i === 1 ? '#15803D' : '#C2410C' }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Push notification */}
          <div
            className="absolute left-2 right-2 top-2 z-[2] flex gap-[10px] items-center py-[10px] px-3 rounded-[18px] bg-[rgba(20,20,22,0.94)] text-white"
            style={{
              transform: `translateY(${nt ? '0px' : '-90px'})`,
              opacity: nt ? 1 : 0,
              transition: 'transform .5s cubic-bezier(.3,1.4,.5,1), opacity .3s',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative mark */}
            <img src="/brand/mark.png" alt="" width={26} height={26} className="w-[26px] h-[26px] rounded-[7px] bg-orange-500 p-[5px] block flex-none object-contain" />
            <div className="flex flex-col gap-[1px] min-w-0">
              <span className="text-[10px] text-zinc-400">{t('notifFrom')}</span>
              <span className="text-[12.5px] font-semibold leading-[1.25]">{notifs[li]}</span>
            </div>
          </div>

          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-[5px] z-[2]">
            {[0, 1, 2, 3, 4].map((k) => (
              <span
                key={k}
                className="h-[6px] rounded-full transition-[width,background] duration-300"
                style={{ width: k === li ? 18 : 6, background: k === li ? '#0A0A0A' : '#D4D4D8' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tilted info cards beside the phone */}
      {(['L', 'R'] as const).map((side) => {
        const c = side === 'L' ? lc : rc;
        const pos = side === 'L' ? rnd.L : rnd.R;
        const [k, v, s] = side === 'L' ? card.slice(0, 3) : card.slice(3, 6);
        return (
          <div
            key={side}
            className="absolute w-[200px] z-[4] pointer-events-none [perspective:900px]"
            style={{ left: pos[0], top: pos[1] }}
          >
            <div
              className="flex flex-col gap-[6px] py-4 px-[18px] rounded-[18px] border shadow-[0_24px_50px_rgba(10,10,10,0.16),0_2px_6px_rgba(10,10,10,0.06)]"
              style={sideCard(side, c)}
            >
              <span className="font-mono text-[10px] tracking-[0.12em]" style={{ color: c.k }}>{k}</span>
              <span className="text-[24px] font-bold tracking-[-0.03em] leading-[1.05]">{v}</span>
              <span className="text-[12.5px]" style={{ color: c.s }}>{s}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
