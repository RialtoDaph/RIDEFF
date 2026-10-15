'use client';

import { useEffect, useState } from 'react';

const G = '0123456789€$%#&?!<>/*';
const rnd = () => Array.from({ length: 3 }, () => G[Math.floor(Math.random() * G.length)]).join('');

/** "???" that keeps flickering into random glyphs (prototype Scramble). */
export function Scramble({ running }: { running: boolean }) {
  const [s, setS] = useState({ t: '???', hold: true });

  useEffect(() => {
    if (!running) return;
    let n = Math.floor(Math.random() * 20);
    const i = setInterval(() => {
      n++;
      const c = n % 22;
      if (c < 12) setS({ t: '???', hold: true });
      else setS({ t: c > 18 ? '???'.slice(0, c - 18) + rnd().slice(c - 18) : rnd(), hold: false });
    }, 160);
    return () => clearInterval(i);
  }, [running]);

  return (
    <span
      className="inline-block min-w-[3ch] tabular-nums"
      style={{
        color: s.hold ? '#FF9A50' : '#FFB27A',
        textShadow: s.hold ? '0 0 10px rgba(255,106,0,0.55)' : '0 0 6px rgba(255,154,80,0.35)',
        opacity: s.hold ? 1 : 0.85,
      }}
    >
      {s.t}
    </span>
  );
}
