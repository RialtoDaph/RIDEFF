'use client';

import { useEffect, useState } from 'react';

/**
 * Plays a list of [ms, step] cues while `active`, then loops after `loopAt` ms.
 * Leaving the viewport (active = false) clears every timer; the sequence
 * starts again from `start` when it comes back.
 */
export function useTimeline({
  active,
  cues,
  loopAt,
  start,
  idle,
}: {
  active: boolean;
  cues: readonly (readonly [number, number])[];
  loopAt: number;
  /** Step set when a run begins. */
  start: number;
  /** Step shown before the first run (and under reduced motion). */
  idle: number;
}) {
  const [step, setStep] = useState(idle);

  useEffect(() => {
    if (!active) return;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      setStep(start);
      timers = cues.map(([ms, s]) => setTimeout(() => setStep(s), ms));
      timers.push(setTimeout(run, loopAt));
    };
    run();
    return () => timers.forEach(clearTimeout);
    // cues are module constants
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, loopAt, start]);

  return step;
}
