'use client';

import { useTranslations } from 'next-intl';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTimeline } from '@/hooks/useTimeline';
import { Scramble } from './Scramble';

/** Answers roll in one by one (1400 + n·700 ms), hold 5 s, then the quiz restarts. */
const CUES = [1, 2, 3, 4].map((n) => [1400 + n * 700, n] as const);
const LOOP = 1400 + 4 * 700 + 5000;

export function ProblemQuiz() {
  const t = useTranslations('life.problem');
  const reduce = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.5 });
  const step = useTimeline({ active: inView && !reduce, cues: CUES, loopAt: LOOP, start: 0, idle: 0 });
  const n = reduce ? 4 : step;

  const questions = t.raw('questions') as string[];
  const answers = t.raw('answers') as string[];
  const pre = t.raw('scramblePrefix') as string[];
  const suf = t.raw('scrambleSuffix') as string[];

  return (
    <div ref={ref} className="flex flex-col gap-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {questions.map((q, i) => (
          <div
            key={q}
            className="py-5 px-[22px] rounded-card-sm bg-white border border-stone-200 flex justify-between items-center gap-4"
          >
            <span className="text-[17px]">{q}</span>
            <span className="font-mono text-[15px] text-[#E25C00] whitespace-nowrap" aria-live="off">
              {n > i ? (
                <span key={`a${i}`} className="inline-block text-orange-500 animate-[rdeRoll_.7s_cubic-bezier(.2,.8,.2,1)]">
                  {answers[i]}
                </span>
              ) : (
                <>
                  {pre[i]}
                  <Scramble running={inView && !reduce} />
                  {suf[i]}
                </>
              )}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[19px] leading-[1.5] text-zinc-600 m-0 max-w-[720px]">
        {t.rich('outro', { b: (c) => <span className="text-ink font-semibold">{c}</span> })}
      </p>
      <div
        className="flex items-center gap-[10px] font-mono text-[12px] tracking-[0.1em] text-[#E25C00]"
        style={{
          opacity: n >= 4 ? 1 : 0,
          transform: n >= 4 ? 'none' : 'translateY(8px)',
          transition: 'opacity .8s ease, transform .8s cubic-bezier(.2,.8,.2,1)',
        }}
      >
        <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(255,106,0,0.7)]" />
        <span>{t('done')}</span>
      </div>
    </div>
  );
}
