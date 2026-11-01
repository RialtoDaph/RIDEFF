'use client';

/**
 * Ringback tone while Nana's call connects, generated with Web Audio (no audio
 * file): the German "Freizeichen", 425 Hz, 1 s tone, 4 s pause. Must be started
 * from the click that starts the call (browsers only allow audio after a gesture).
 * Returns stop(); safe to call more than once.
 */
export function startRingback(): () => void {
  type Ctx = typeof AudioContext;
  const AC: Ctx | undefined = typeof window !== 'undefined' ? window.AudioContext ?? (window as unknown as { webkitAudioContext?: Ctx }).webkitAudioContext : undefined;
  if (!AC) return () => {};
  let ctx: AudioContext;
  try {
    ctx = new AC();
  } catch {
    return () => {};
  }
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 425;
  gain.gain.value = 0;
  osc.connect(gain).connect(ctx.destination);
  const t0 = ctx.currentTime + 0.05;
  // Schedule 12 rings (one minute); the call connects or fails long before.
  for (let i = 0; i < 12; i++) {
    const on = t0 + i * 5;
    gain.gain.setValueAtTime(0, on);
    gain.gain.linearRampToValueAtTime(0.12, on + 0.02);
    gain.gain.setValueAtTime(0.12, on + 0.98);
    gain.gain.linearRampToValueAtTime(0, on + 1);
  }
  osc.start(t0);
  let stopped = false;
  return () => {
    if (stopped) return;
    stopped = true;
    try {
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.05);
      osc.stop(now + 0.08);
      setTimeout(() => ctx.close().catch(() => {}), 200);
    } catch {}
  };
}

/** Minimum ringing before Nana "picks up", so the caller hears one full ring. */
export const PICKUP_AFTER_MS = 1600;
