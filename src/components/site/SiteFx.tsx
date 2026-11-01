'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

const SLATS = 7;
const EASE = 'cubic-bezier(.77,0,.18,1)';

/** The seven dark slats with the logo (RideffNav.dc.html → overlay()). */
function overlay(cover: boolean) {
  const o = document.createElement('div');
  o.setAttribute('data-rdx', '1');
  o.setAttribute('aria-hidden', 'true');
  o.style.cssText = `position:fixed;inset:0;z-index:9999;display:flex;pointer-events:${cover ? 'auto' : 'none'}`;
  for (let k = 0; k < SLATS; k++) {
    const s = document.createElement('div');
    s.setAttribute('data-s', '1');
    s.style.cssText = `flex:1;height:100%;background:#0B0B0C;border-right:1px solid #18181A;transform-origin:${cover ? '50% 100%' : '50% 0'};transform:scaleY(${cover ? 0 : 1});box-shadow:inset 0 ${cover ? '2px' : '-2px'} 0 #FF6A00`;
    o.appendChild(s);
  }
  const l = document.createElement('div');
  l.setAttribute('data-l', '1');
  l.style.cssText = `position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);transition:opacity .3s;opacity:${cover ? 0 : 1}`;
  l.innerHTML = '<img src="/images/rideff-mark.png" alt="" style="height:clamp(44px,6vw,80px);width:auto;display:block">';
  o.appendChild(l);
  document.body.appendChild(o);
  return o;
}

/** Hide the cover: slats scale back to 0 from the top (the "next page load" half). */
function reveal(o: HTMLElement) {
  o.style.pointerEvents = 'none';
  o.querySelectorAll<HTMLElement>('[data-s]').forEach((s, k) => {
    s.style.transformOrigin = '50% 0';
    s.style.transition = `transform .8s ${EASE} ${k * 50}ms`;
    s.style.transform = 'scaleY(0)';
  });
  const l = o.querySelector<HTMLElement>('[data-l]');
  if (l) l.style.opacity = '0';
  setTimeout(() => o.remove(), 1400);
}

const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Site-wide effects from RideffNav.dc.html → siteFx():
 * page transition, 2px scroll-progress bar, Lenis smooth scroll, custom cursor,
 * smooth anchor scroll. Everything except the progress bar is off under
 * prefers-reduced-motion.
 */
export function SiteFx() {
  const router = useRouter();
  const pathname = usePathname();
  const cover = useRef<HTMLElement | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Route changed: reveal the new page, reset scroll.
  useEffect(() => {
    const o = cover.current;
    if (!location.hash) {
      window.__lenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    }
    if (o) {
      cover.current = null;
      setTimeout(() => reveal(o), 120);
    }
    window.__lenis?.resize();
  }, [pathname]);

  useEffect(() => {
    const rm = reduced();
    const off: (() => void)[] = [];

    // Scroll progress
    const bar = barRef.current!;
    const upd = () => {
      const m = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${m > 0 ? scrollY / m : 0})`;
    };
    addEventListener('scroll', upd, { passive: true });
    addEventListener('resize', upd);
    upd();
    off.push(() => {
      removeEventListener('scroll', upd);
      removeEventListener('resize', upd);
    });

    // Lenis
    if (!rm) {
      const L = new Lenis({ lerp: 0.075, wheelMultiplier: 0.9, smoothWheel: true });
      window.__lenis = L;
      let raf = 0;
      const f = (t: number) => {
        L.raf(t);
        raf = requestAnimationFrame(f);
      };
      raf = requestAnimationFrame(f);
      off.push(() => {
        cancelAnimationFrame(raf);
        L.destroy();
        delete window.__lenis;
      });
    }

    // Links: smooth anchors + transition for internal pages
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank' || a.hasAttribute('download')) return;
      if (href.length > 1 && href[0] === '#') {
        let t: Element | null = null;
        try {
          t = document.querySelector(href);
        } catch {}
        if (!t) return;
        e.preventDefault();
        if (window.__lenis) window.__lenis.scrollTo(t as HTMLElement, { duration: 1.8, easing: (x) => 1 - Math.pow(1 - x, 4) });
        else t.scrollIntoView({ behavior: rm ? 'auto' : 'smooth' });
        history.replaceState(null, '', href);
        return;
      }
      if (!href.startsWith('/') || href.startsWith('//') || href.startsWith('/api/')) return;
      const url = new URL(href, location.href);
      if (url.pathname === location.pathname) {
        if (url.hash) return; // same page anchor: browser default
        e.preventDefault();
        return;
      }
      e.preventDefault();
      // Close any open overlay menu
      document.dispatchEvent(new CustomEvent('rideff:navigate'));
      if (rm) {
        router.push(href);
        return;
      }
      router.prefetch(href);
      const o = overlay(true);
      o.getBoundingClientRect();
      o.querySelectorAll<HTMLElement>('[data-s]').forEach((s, k) => {
        s.style.transition = `transform .6s ${EASE} ${k * 45}ms`;
        s.style.transform = 'scaleY(1)';
      });
      setTimeout(() => {
        const l = o.querySelector<HTMLElement>('[data-l]');
        if (l) l.style.opacity = '1';
      }, 320);
      setTimeout(() => {
        cover.current = o;
        router.push(href);
      }, 820);
    };
    document.addEventListener('click', onClick);
    off.push(() => document.removeEventListener('click', onClick));
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) document.querySelectorAll('[data-rdx]').forEach((x) => x.remove());
    };
    addEventListener('pageshow', onShow);
    off.push(() => removeEventListener('pageshow', onShow));

    // Cursor (fine pointers only)
    if (!rm && matchMedia('(pointer:fine)').matches) {
      const c = document.createElement('div');
      c.setAttribute('aria-hidden', 'true');
      c.style.cssText =
        'position:fixed;left:0;top:0;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;border:1.5px solid #FF6A00;pointer-events:none;z-index:9997;opacity:0;transition:width .35s cubic-bezier(.16,1,.3,1),height .35s cubic-bezier(.16,1,.3,1),margin .35s cubic-bezier(.16,1,.3,1),background .3s,opacity .3s';
      const d = document.createElement('div');
      d.setAttribute('aria-hidden', 'true');
      d.style.cssText = 'position:fixed;left:0;top:0;width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;background:#FF6A00;pointer-events:none;z-index:9997;opacity:0;transition:opacity .3s';
      document.body.appendChild(c);
      document.body.appendChild(d);
      let mx = -100,
        my = -100,
        cx = -100,
        cy = -100,
        big = false,
        raf = 0;
      const move = (e: MouseEvent) => {
        mx = e.clientX;
        my = e.clientY;
        c.style.opacity = '1';
        d.style.opacity = '1';
        const h = !!(e.target as Element | null)?.closest?.('a,button,[onclick],input,textarea,select,label');
        if (h !== big) {
          big = h;
          c.style.width = c.style.height = big ? '64px' : '34px';
          c.style.margin = big ? '-32px 0 0 -32px' : '-17px 0 0 -17px';
          c.style.background = big ? 'rgba(255,106,0,.14)' : 'transparent';
        }
      };
      const leave = () => {
        c.style.opacity = '0';
        d.style.opacity = '0';
      };
      const loop = () => {
        cx += (mx - cx) * 0.16;
        cy += (my - cy) * 0.16;
        c.style.transform = `translate(${cx}px,${cy}px)`;
        d.style.transform = `translate(${mx}px,${my}px)`;
        raf = requestAnimationFrame(loop);
      };
      loop();
      addEventListener('mousemove', move, { passive: true });
      document.addEventListener('mouseleave', leave);
      off.push(() => {
        cancelAnimationFrame(raf);
        removeEventListener('mousemove', move);
        document.removeEventListener('mouseleave', leave);
        c.remove();
        d.remove();
      });
    }

    return () => off.forEach((f) => f());
  }, [router]);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: 2,
        width: '100%',
        background: '#FF6A00',
        transformOrigin: '0 50%',
        transform: 'scaleX(0)',
        zIndex: 9998,
        pointerEvents: 'none',
        boxShadow: '0 0 10px rgba(255,106,0,.6)',
      }}
    />
  );
}
