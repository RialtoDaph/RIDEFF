'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type RGB = [number, number, number];

/** Page tint per section id (from the prototype's flowInit). */
const TINT: Record<'business' | 'private', Record<string, RGB>> = {
  business: {
    top: [11, 11, 12],
    problem: [15, 15, 17],
    plattform: [20, 20, 23],
    nerven: [24, 24, 27],
    ablauf: [29, 29, 32],
    wer: [224, 223, 219],
    projekt: [235, 234, 231],
    pakete: [241, 240, 237],
    faq: [247, 246, 244],
    kontakt: [252, 252, 251],
  },
  private: {
    top: [244, 244, 242],
    'p-problem': [246, 246, 244],
    'p-module': [248, 248, 246],
    'p-tag': [249, 249, 247],
    'p-weiter': [249, 249, 248],
    'p-ablauf': [250, 250, 248],
    'p-daten': [252, 252, 250],
    'p-faq': [253, 253, 252],
    'p-preis': [255, 255, 255],
    'p-kontakt': [11, 11, 12],
  },
};

const isLight = (c: RGB) => c[0] > 128;
const LERP = 0.14;

/**
 * Interpolates the body background between section tints around the viewport
 * centre (eased with lerp 0.14 per frame), draws the faint 56px grid and dims
 * sections whose tone does not match the current background.
 * Publishes the eased probe position as window.__rideffProbe for the flow line.
 */
export function ScrollBackdrop() {
  const pathname = usePathname();

  useEffect(() => {
    const body = document.body;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let probeS: number | null = null;

    const tick = () => {
      raf = 0;
      const page = document.querySelector<HTMLElement>('[data-page-mode]');
      const mode = page?.dataset.pageMode as 'business' | 'private' | undefined;
      if (!mode) return;
      const T = TINT[mode];
      const gapId = mode === 'private' ? 'p-flowgap' : 'flowgap';
      const vh = innerHeight;
      const sy = scrollY;
      const target = sy + vh * 0.5;
      const d = target - (probeS ?? target);
      probeS = reduce.matches || Math.abs(d) < 0.5 || Math.abs(d) > vh * 3 ? target : (probeS as number) + d * LERP;
      const probe = probeS;
      if (probe !== target) raf = requestAnimationFrame(tick);
      (window as unknown as { __rideffProbe?: number }).__rideffProbe = probe;

      const band = vh * 0.18;
      const secs = Object.keys(T)
        .map((id) => {
          const el = document.getElementById(id);
          return el ? { id, el, top: el.getBoundingClientRect().top + sy, c: T[id] } : null;
        })
        .filter((x): x is NonNullable<typeof x> => !!x);
      if (!secs.length) return;

      let c = secs[0].c.slice() as RGB;
      for (let i = 1; i < secs.length; i++) {
        const cross = isLight(secs[i].c) !== isLight(secs[i - 1].c);
        const g = cross ? document.getElementById(gapId) : null;
        const gap = g && g.nextElementSibling === secs[i].el ? g : null;
        const bb = cross ? band : Math.max(band, (secs[i].top - secs[i - 1].top) * 0.5);
        let f: number;
        if (gap) {
          const gr = gap.getBoundingClientRect();
          const g0 = gr.top + sy + gr.height * 0.1;
          const g1 = gr.top + sy + gr.height * 0.9;
          f = (probe - g0) / (g1 - g0);
        } else f = (probe - (secs[i].top - bb)) / (2 * bb);
        f = Math.max(0, Math.min(1, f));
        f = f * f * (3 - 2 * f);
        const next = secs[i].c;
        c = c.map((v, k) => v + (next[k] - v) * f) as RGB;
      }

      const lum = Math.max(0, Math.min(1, (c[0] - 29) / (mode === 'private' ? 215 : 195)));
      body.style.backgroundColor = `rgb(${c.map(Math.round).join(',')})`;
      const g = Math.round(255 * (1 - lum));
      const gc = `rgba(${g},${g},${g},${(0.035 + 0.015 * lum).toFixed(3)})`;
      body.style.backgroundImage = `linear-gradient(${gc} 1px,transparent 1px),linear-gradient(90deg,${gc} 1px,transparent 1px)`;
      body.style.backgroundSize = '56px 56px';
      body.style.backgroundAttachment = 'fixed';
      body.dataset.tone = lum > 0.5 ? 'light' : 'dark';

      for (const s of secs) {
        const inner = s.el.firstElementChild as HTMLElement | null;
        if (!inner) continue;
        const dd = Math.abs((isLight(s.c) ? 1 : 0) - lum);
        inner.style.opacity = (1 - 0.72 * dd).toFixed(3);
      }
    };

    const queue = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    probeS = null;
    queue();
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    const ro = new ResizeObserver(queue);
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('scroll', queue);
      removeEventListener('resize', queue);
      ro.disconnect();
      for (const k of ['backgroundColor', 'backgroundImage', 'backgroundSize', 'backgroundAttachment'] as const) body.style[k] = '';
    };
  }, [pathname]);

  return null;
}
