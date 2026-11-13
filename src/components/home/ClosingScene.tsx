'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { reducedMotion } from '@/lib/motion';
import { AI, AI_COLOR, AREAS, COLORS, SLAB, SLAB_COLOR, SceneTags, TAG_CSS, type T } from './platformParts';

const PlatformScene = dynamic(() => import('./PlatformScene'), { ssr: false });

const subscribeMotion = (cb: () => void) => {
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

const CSS = `
.cs{background:#14080A;color:#FFF7ED}
.cs-stage{position:relative;height:clamp(260px,32vw,440px);background:radial-gradient(ellipse at 50% 70%,#1B0E0C 0%,#14080A 62%);pointer-events:none}
.cs-cap{max-width:1480px;margin:0 auto;padding:6px clamp(20px,3vw,40px) clamp(28px,3vw,44px);display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center}
.cs-label{font:400 11px var(--font-mono);letter-spacing:.1em;text-transform:uppercase;color:#927A6D}
.cs-line{margin:0;max-width:820px;font-size:clamp(17px,1.5vw,21px);line-height:1.4;letter-spacing:-0.015em;color:#E7D5C3;text-wrap:balance}
.cs-keys{list-style:none;margin:4px 0 0;padding:0;display:none;flex-wrap:wrap;justify-content:center;gap:6px}
.cs-key{--c:#fff;display:flex;align-items:center;gap:7px;padding:7px 11px;border-radius:999px;border:1px solid #341919;background:#1e0d0e;color:#E7D5C3;font:500 13px var(--font-sans);cursor:pointer;transition:border-color .3s,background .3s}
.cs-key::before{content:"";width:8px;height:8px;border-radius:2px;background:var(--c);flex-shrink:0}
.cs-key[aria-pressed="true"]{border-color:var(--c);background:color-mix(in srgb,var(--c) 14%,#1e0d0e);color:#FFF7ED}
.cs-key:focus-visible{outline:2px solid #FFF7ED;outline-offset:2px}
@media (max-width:1099px){
  /* The object is too small here for labels on the blocks: name them in a list instead. */
  .cs-stage .pt-tags{display:none}
  .cs-keys{display:flex}
}
`;

/**
 * Top of every closing section: the platform from the start of the Home page,
 * now complete. All six areas dock when it scrolls into view, each one named,
 * with the idea behind it in one line underneath.
 */
export default function ClosingScene() {
  const t = useTranslations() as unknown as T;
  const [near, setNear] = useState(false);
  const [seen, setSeen] = useState(false);
  const [focus, setFocus] = useState(-1);
  const still = useSyncExternalStore(subscribeMotion, reducedMotion, () => false);
  const box = useRef<HTMLDivElement>(null);
  const tags = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const load = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '100% 0px' });
    const play = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.3 });
    load.observe(el);
    play.observe(el);
    return () => {
      load.disconnect();
      play.disconnect();
    };
  }, []);

  const keys = [
    ...AREAS.map((a, k) => ({ k, color: a.color, name: t(a.name) })),
    { k: AI, color: AI_COLOR, name: t('common.platformAiName') },
    { k: SLAB, color: SLAB_COLOR, name: t('common.platformSlabName') },
  ];

  return (
    <div className="cs">
      <style dangerouslySetInnerHTML={{ __html: CSS + TAG_CSS }} />
      <div ref={box} className="cs-stage" aria-hidden="true">
        {near ? <PlatformScene colors={COLORS} on={seen || still ? 6 : 0} focus={focus} running={seen && !still} still={still} labels={tags} /> : null}
        <SceneTags t={t} refs={tags} on={6} active={focus} />
      </div>
      <div className="cs-cap">
        <span className="cs-label">{t('common.platformClosingLabel')}</span>
        <p className="cs-line">{t('common.platformClosingLine')}</p>
        <ul className="cs-keys" aria-label={t('common.platformPick')}>
          {keys.map((p) => (
            <li key={p.k}>
              <button type="button" className="cs-key" aria-pressed={focus === p.k} style={{ '--c': p.color } as CSSProperties} onClick={() => setFocus((f) => (f === p.k ? -1 : p.k))}>
                {p.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
