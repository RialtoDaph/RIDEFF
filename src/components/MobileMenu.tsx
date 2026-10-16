'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Hamburger menu below 1280px. Full-screen panel in the page's tone; closes
 * on Esc, on a link click and on the close button. Focus stays inside while
 * open and returns to the menu button afterwards.
 */
export function MobileMenu({
  tone,
  openLabel,
  closeLabel,
  brand,
  children,
}: {
  tone: 'dark' | 'light';
  openLabel: string;
  closeLabel: string;
  brand: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const dark = tone === 'dark';

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusables = () =>
      Array.from(panel.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []).filter((el) => el.offsetParent !== null);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key !== 'Tab') return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const onResize = () => window.innerWidth >= 1280 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    const btn = button.current;
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      btn?.focus();
    };
  }, [open]);

  const bars = (
    <span aria-hidden="true" className="flex flex-col gap-[5px] w-5">
      <span className="h-[2px] rounded-full bg-current" />
      <span className="h-[2px] rounded-full bg-current" />
      <span className="h-[2px] rounded-full bg-current" />
    </span>
  );

  return (
    <>
      <button
        ref={button}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={openLabel}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className={`xl:hidden w-11 h-11 flex-none rounded-full border flex items-center justify-center cursor-pointer ${dark ? 'border-line-d4 bg-night-2 text-stone-50' : 'border-stone-200 bg-white text-ink'}`}
      >
        {bars}
      </button>
      {open && (
        <div
          ref={panel}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={openLabel}
          className={`xl:hidden fixed inset-0 z-[150] overflow-y-auto flex flex-col ${dark ? 'bg-ink-2 text-stone-50' : 'bg-stone-100 text-ink'}`}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('a')) setOpen(false);
          }}
        >
          <div className={`site-x flex items-center justify-between gap-4 py-6 border-b ${dark ? 'border-line-d2' : 'border-stone-350'}`}>
            {brand}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={closeLabel}
              className={`w-11 h-11 flex-none rounded-full border flex items-center justify-center text-[22px] leading-none cursor-pointer ${dark ? 'border-line-d4 bg-night-2' : 'border-stone-200 bg-white'}`}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="site-x flex-1 flex flex-col gap-8 py-8">{children}</div>
        </div>
      )}
    </>
  );
}
