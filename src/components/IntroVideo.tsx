'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { INTRO_KEY as KEY } from '@/lib/intro';

type Phase = 'pending' | 'play' | 'fade' | 'done';

export function IntroVideo() {
  const t = useTranslations('intro');
  const [phase, setPhase] = useState<Phase>('pending');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    // Reading the flag set by the inline script is a one-time sync with the DOM.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhase(document.documentElement.dataset.intro === '1' ? 'play' : 'done');
    return () => clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (phase !== 'play') return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && end();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function end() {
    if (phase !== 'play') return;
    setPhase('fade');
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {}
    timer.current = setTimeout(() => {
      delete document.documentElement.dataset.intro;
      setPhase('done');
    }, 650);
  }

  if (phase === 'done') return null;

  return (
    <div
        data-intro-overlay=""
        className="fixed inset-0 z-[200] bg-black flex items-center justify-center transition-opacity duration-[600ms] ease-[ease]"
        style={{ opacity: phase === 'fade' ? 0 : 1, pointerEvents: phase === 'fade' ? 'none' : 'auto' }}
      >
        {phase !== 'pending' && (
          <video
            src="/media/rideff-intro.mp4"
            autoPlay
            muted
            playsInline
            onEnded={end}
            onError={end}
            className="block w-full h-full object-contain"
            aria-hidden="true"
          />
        )}
        <button
          type="button"
          onClick={end}
          className="absolute right-6 bottom-6 border border-white/25 cursor-pointer font-semibold text-[13px] px-[18px] py-[10px] min-h-[44px] rounded-full bg-black/40 text-white whitespace-nowrap"
        >
          {t('skip')}
        </button>
    </div>
  );
}
