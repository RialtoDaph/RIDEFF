'use client';

import { Component, useCallback, useMemo, type CSSProperties } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { getPathname, usePathname, useRouter } from '@/i18n/navigation';
import { GERMAN_ONLY, type AppPath, type Locale } from '@/i18n/routing';
import { LIFE_DEMO_URL, PORTAL_URL, signupUrl, type LifePlan, CAL_URL } from '@/lib/site';

/**
 * Runtime for components ported from the handoff prototypes (`*.dc.html`).
 *
 * In the prototype, each file has a logic class (`class Component extends DCLogic`)
 * that owns state and returns `renderVals()`; a template renders those values.
 * Here the template is JSX in the class's own `render()`; the class keeps the
 * original state, timings and data so behaviour matches the design exactly.
 */
export type DCProps = {
  /** next-intl translator for the whole message tree (keys are "Namespace.key"). */
  t: ReturnType<typeof useTranslations>;
  locale: Locale;
  /** Internal route ("/work#x") → localized public path ("/projekte#x"). */
  href: (route: string) => string;
  /** RIDEFF Life sign-up: app.rideff.com/signup?plan=…&lang=… */
  signup: (plan: LifePlan) => string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class DCLogic<P = any, S = any> extends Component<P & DCProps, S> {
  renderVals(): Record<string, unknown> {
    return {};
  }
}

/** A whole-attribute `style="{{ x }}"` may be a CSS string or an object. */
export function dcStyle(s: unknown): CSSProperties | undefined {
  if (!s) return undefined;
  if (typeof s === 'object') return s as CSSProperties;
  const o: Record<string, string> = {};
  for (const decl of String(s).split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    o[prop.startsWith('--') ? prop : prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())] = decl.slice(i + 1).trim();
  }
  return o as CSSProperties;
}

export function localHref(route: string, locale: Locale): string {
  if (route === '@portal') return PORTAL_URL;
  if (route === '@lifedemo') return LIFE_DEMO_URL;
  if (route === '@cal') return CAL_URL;
  const hash = route.indexOf('#');
  const q = route.indexOf('?');
  const cut = [hash, q].filter((n) => n >= 0).sort((a, b) => a - b)[0] ?? route.length;
  const base = route.slice(0, cut) || '/';
  const rest = route.slice(cut);
  return getPathname({ href: base as never, locale }) + rest;
}

export function useDC(): DCProps {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const href = useCallback((route: string) => localHref(route, locale), [locale]);
  const signup = useCallback((plan: LifePlan) => signupUrl(plan, locale), [locale]);
  return useMemo(() => ({ t, locale, href, signup }), [t, locale, href, signup]);
}

/** Replacement for the prototype's <image-slot>: an image that fills its box. */
export function ImageSlot({
  src,
  alt = '',
  shape = 'rounded',
  radius = 12,
  style,
}: {
  src: string;
  alt?: string;
  shape?: 'rect' | 'rounded' | 'circle' | 'pill';
  radius?: number;
  style?: CSSProperties;
}) {
  const r = shape === 'circle' ? '50%' : shape === 'pill' ? 999 : shape === 'rect' ? 0 : radius;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', borderRadius: r, ...style }}
    />
  );
}

/**
 * DE | EN switch: same page in the other locale. German-only pages (legal)
 * fall back to the English home page. Also mirrors the choice into
 * localStorage.rideff_lang, the key the demos read.
 */
export function useSwitchLocale() {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const current = useLocale() as Locale;
  return useCallback(
    (next: Locale) => {
      if (next === current) return;
      try {
        localStorage.setItem('rideff_lang', next);
      } catch {}
      if (next !== 'de' && GERMAN_ONLY.includes(pathname as AppPath)) {
        router.push('/', { locale: next });
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace({ pathname, params } as any, { locale: next, scroll: false });
    },
    [pathname, params, router, current],
  );
}


/**
 * Keyboard access for a clickable non-button element (cards, tabs, 3D layers
 * whose styling breaks inside a <button>): role, focus and Enter/Space.
 */
export function press(fn?: () => void) {
  return {
    role: 'button' as const,
    tabIndex: 0,
    onClick: fn,
    onKeyDown: (e: { key: string; preventDefault: () => void }) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fn?.();
      }
    },
  };
}

export { opt } from './img';

export const prefersReducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
