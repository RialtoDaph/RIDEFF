'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * One motion vocabulary for the whole site. Pages used to hand-roll their own
 * timings; anything new should take its easing and duration from here so the
 * site moves as one thing.
 */
export const EASE = {
  /** Default for things arriving: fast start, long settle. */
  out: 'expo.out',
  /** Things moving between two states (tabs, layers). */
  inOut: 'power3.inOut',
  /** Page-transition slats. Same curve as --ease-slat in globals.css. */
  slat: 'cubic-bezier(.77,0,.18,1)',
  /** CSS twin of `out`, for inline transitions. Same curve as --ease-out-expo. */
  outCss: 'cubic-bezier(.16,1,.3,1)',
} as const;

export const DUR = {
  micro: 0.2,
  short: 0.45,
  base: 0.9,
  long: 1.4,
} as const;

/** How far a revealed block travels, in px. Small on purpose: content, not a show. */
export const REVEAL_Y = 28;

let registered = false;
export function motion() {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

export const reducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Scroll reveals for every `[data-rv]` element on any page. The attribute value
 * is a delay in ms (`data-rv="120"`), for staggering siblings.
 *
 * Blocks already on screen are left alone, so nothing above the fold blinks.
 * Returns a cleanup function.
 */
export function watchReveals(): () => void {
  if (reducedMotion() || !('IntersectionObserver' in window)) return () => {};

  // Plain CSS transitions on purpose: they run off the main thread and still
  // finish if scripts stall, so content can never get stuck invisible.
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        const el = en.target as HTMLElement;
        io.unobserve(el);
        const delay = Number(el.dataset.rv) || 0;
        el.style.transition = `opacity ${DUR.base}s ${EASE.outCss} ${delay}ms, transform ${DUR.base}s ${EASE.outCss} ${delay}ms`;
        el.style.opacity = '1';
        el.style.transform = 'none';
        // Tidy up afterwards so the block's own later transitions are not slowed down.
        // (Ignore transitionend events bubbling up from children.)
        const done = (e: TransitionEvent) => {
          if (e.target !== el || e.propertyName !== 'opacity') return;
          el.removeEventListener('transitionend', done);
          el.style.transition = el.style.opacity = el.style.transform = '';
        };
        el.addEventListener('transitionend', done);
      }
    },
    { threshold: 0.12 },
  );

  const scan = () => {
    document.querySelectorAll<HTMLElement>('[data-rv]:not([data-rv-on])').forEach((el) => {
      el.setAttribute('data-rv-on', '');
      if (el.getBoundingClientRect().top < innerHeight * 0.9) return;
      el.style.opacity = '0';
      el.style.transform = `translateY(${REVEAL_Y}px)`;
      io.observe(el);
    });
  };

  // Pages mount (and add sections) after this runs, so keep looking, but not on every keystroke-sized DOM change.
  let timer = 0;
  const mo = new MutationObserver(() => {
    if (timer) return;
    timer = window.setTimeout(() => {
      timer = 0;
      scan();
    }, 200);
  });
  mo.observe(document.body, { childList: true, subtree: true });
  scan();

  return () => {
    clearTimeout(timer);
    mo.disconnect();
    io.disconnect();
  };
}
