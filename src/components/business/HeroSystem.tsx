'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Which box each feed event lights up (0 Cockpit, 1 Team-App, 2 Website). */
const EV_TARGET = [1, 0, 1, 2, 0, 2];
const PATHS = ['M280 110 C 280 180, 100 200, 100 262', 'M280 110 L 280 262', 'M280 110 C 280 180, 460 200, 460 262'];
const BOX_X = [
  [30, 100],
  [210, 280],
  [390, 460],
];
const HEM = [
  'M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z',
  'M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z',
];
const FOLD = [
  'M17.599 6.5a3 3 0 0 0 .399-1.375',
  'M6.003 5.125A3 3 0 0 0 6.401 6.5',
  'M3.477 10.896a4 4 0 0 1 .585-.396',
  'M19.938 10.5a4 4 0 0 1 .585.396',
  'M6 18a4 4 0 0 1-1.967-.516',
  'M19.967 17.484A4 4 0 0 1 18 18',
];
const O = '#FF6A00';
const STEP_MS = 2600;

/**
 * Hero visual of the Business page: the brain ("Gehirn") sends signals along
 * three nerves to Cockpit, Team-App and Website, and a live feed lists what
 * just happened. Advances every 2.6 s while visible; static under reduced motion.
 */
export function HeroSystem() {
  const t = useTranslations('biz');
  const ta = useTranslations('common');
  const reduce = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const i = setInterval(() => setStep((s) => s + 1), STEP_MS);
    return () => clearInterval(i);
  }, [inView, reduce]);

  const feed = t.raw('feed') as [string, string][];
  const boxes = t.raw('viz.boxes') as [string, string][];
  const act = EV_TARGET[step % EV_TARGET.length];
  const anim = !reduce;

  return (
    <div ref={ref} className="bg-night-1 border border-line-d3 rounded-[20px] overflow-hidden">
      <svg viewBox="0 0 560 360" className="block w-full h-auto" role="img" aria-label={`${t('viz.brain')} · ${t('viz.nerves')}`}>
        {PATHS.map((d, i) => {
          const on = i === act;
          return (
            <g key={d}>
              <path d={d} fill="none" stroke={on ? '#3A2412' : '#222226'} strokeWidth={on ? 3 : 2} style={{ transition: 'stroke .4s' }} />
              <path
                d={d}
                fill="none"
                stroke={on ? O : '#4A4A50'}
                strokeWidth={on ? 2 : 1.2}
                strokeDasharray="2 14"
                strokeLinecap="round"
                style={{ transition: 'stroke .4s' }}
              >
                {anim && <animate attributeName="stroke-dashoffset" from="32" to="0" dur={on ? '0.5s' : '1.4s'} repeatCount="indefinite" />}
              </path>
              {anim &&
                [0, 1, 2].map((k) => {
                  const begin = `${(k * 0.7 + i * 0.23).toFixed(2)}s`;
                  return (
                    <circle key={k} r={on ? 4.5 : 2.5} fill={on ? O : '#71717A'} opacity={0}>
                      <animateMotion dur="2.1s" begin={begin} repeatCount="indefinite" path={d} />
                      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="2.1s" begin={begin} repeatCount="indefinite" />
                    </circle>
                  );
                })}
            </g>
          );
        })}
        {anim && (
          <circle key={`burst${step}`} cx={BOX_X[act][1]} cy={262} r={4} fill="none" stroke={O} strokeWidth={2}>
            <animate attributeName="r" from="4" to="34" dur="0.9s" fill="freeze" />
            <animate attributeName="opacity" from="1" to="0" dur="0.9s" fill="freeze" />
          </circle>
        )}
        <text x={296} y={196} fontFamily="var(--font-mono)" fontSize={10} letterSpacing={1.2} fill="#8A8A93">
          {t('viz.nerves')}
        </text>
        <circle cx={280} cy={76} r={54} fill={O} opacity={0.14}>
          {anim && <animate attributeName="r" values="44;62;44" dur="2.4s" repeatCount="indefinite" />}
          {anim && <animate attributeName="opacity" values="0.22;0.06;0.22" dur="2.4s" repeatCount="indefinite" />}
        </circle>
        <g transform="translate(280 74)">
          <g transform="scale(3.6)">
            {anim && <animateTransform attributeName="transform" type="scale" values="3.6;3.75;3.6" dur="2.4s" repeatCount="indefinite" />}
            <g transform="translate(-12 -11.5)" strokeLinecap="round" strokeLinejoin="round">
              {HEM.map((d) => (
                <path key={d} d={d} fill={O} stroke="#FFB27A" strokeWidth={0.45} />
              ))}
              {FOLD.map((d) => (
                <path key={d} d={d} fill="none" stroke="#fff" strokeWidth={0.55} />
              ))}
            </g>
          </g>
        </g>
        <text
          x={280}
          y={83}
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize={22}
          fontWeight={700}
          fill="#fff"
          stroke={O}
          strokeWidth={5}
          style={{ paintOrder: 'stroke' }}
        >
          {ta('ai')}
        </text>
        <text x={342} y={64} fontFamily="var(--font-mono)" fontSize={11} letterSpacing={1.3} fill="#F5F5F4">
          {t('viz.brain')}
        </text>
        <text x={342} y={82} fontFamily="var(--font-sans)" fontSize={12} fill="#8A8A93">
          {t('viz.brainSub')}
        </text>
        {boxes.map(([title, sub], i) => {
          const on = i === act;
          const [x, cx] = BOX_X[i];
          return (
            <g key={title}>
              <rect
                x={x}
                y={262}
                width={140}
                height={56}
                rx={10}
                fill={on ? '#1F130A' : '#141416'}
                stroke={on ? O : '#2A2A2E'}
                strokeWidth={1.5}
                style={{ transition: 'fill .4s, stroke .4s' }}
              />
              <text x={cx} y={286} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={11} letterSpacing={1.3} fill={on ? '#fff' : '#F5F5F4'}>
                {title}
              </text>
              <text x={cx} y={304} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={11} fill={on ? '#FFB27A' : '#8A8A93'}>
                {sub}
              </text>
            </g>
          );
        })}
      </svg>
      <ul className="border-t border-line-d3 flex flex-col text-[13px] m-0 p-0 list-none" aria-live="polite">
        {[0, 1, 2].map((k) => {
          const n = step - k;
          const [kind, text] = feed[((n % feed.length) + feed.length) % feed.length];
          const m = 42 + n * 3;
          const time = `${String(7 + Math.floor(m / 60)).padStart(2, '0')}:${String(((m % 60) + 60) % 60).padStart(2, '0')}`;
          return (
            <li
              key={k}
              className="grid grid-cols-[48px_80px_minmax(0,1fr)] gap-[10px] py-[11px] px-[18px] border-b border-line-d1 transition-opacity duration-400"
              style={{ opacity: [1, 0.75, 0.5][k] }}
            >
              <span className="font-mono text-[11px] text-zinc-500">{time}</span>
              <span className="font-mono text-[10px] tracking-[0.1em]" style={{ color: k === 0 ? '#FF9A50' : '#8A8A93' }}>
                {kind}
              </span>
              <span className="font-medium" style={{ color: k === 0 ? '#fff' : '#D4D4D8' }}>
                {text}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
