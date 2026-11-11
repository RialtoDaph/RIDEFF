'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import { reducedMotion } from '@/lib/motion';

const PlatformScene = dynamic(() => import('./PlatformScene'), { ssr: false });

// Same six colours as the platform section after the hero.
const COLORS = ['#FF9E47', '#61CC80', '#54B0E6', '#9E8CF2', '#E0B842', '#EB7AAB'];

const subscribeMotion = (cb: () => void) => {
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

/**
 * Home, top of the closing section: the platform from the start of the page,
 * now complete. All six areas dock when it scrolls into view.
 */
export default function ClosingScene() {
  const [near, setNear] = useState(false);
  const [seen, setSeen] = useState(false);
  const still = useSyncExternalStore(subscribeMotion, reducedMotion, () => false);
  const box = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={box} aria-hidden="true" style={{ position: 'relative', height: 'clamp(240px,30vw,420px)', background: 'radial-gradient(ellipse at 50% 70%,#1A130D 0%,#0B0B0C 62%)', pointerEvents: 'none' }}>
      {near ? <PlatformScene colors={COLORS} on={seen || still ? 6 : 0} focus={-1} running={seen && !still} still={still} /> : null}
    </div>
  );
}
