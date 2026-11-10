'use client';

import { useEffect } from 'react';
import { ctaEvent, type CtaType } from '@/lib/analytics';
import { APP_URL, LIFE_DEMO_URL, PORTAL_URL } from '@/lib/site';

const hostOf = (u: string) => {
  try {
    return new URL(u).hostname;
  } catch {
    return '';
  }
};
/** Life app and portal hosts as configured (temporary *.vercel.app hosts included). */
const LIFE_HOSTS = new Set([hostOf(APP_URL), hostOf(LIFE_DEMO_URL)].filter(Boolean));
const PORTAL_HOST = hostOf(PORTAL_URL);

/** Which CTA a link is, or null for links we do not count. */
function ctaType(url: URL): CtaType | null {
  if (url.protocol === 'mailto:') return 'email';
  if (url.protocol === 'tel:') return 'phone';
  const host = url.hostname;
  if (host === 'wa.me' || host.endsWith('whatsapp.com')) return 'whatsapp';
  if (host === 'cal.com' || host.endsWith('.cal.com')) return 'call';
  if (url.href.startsWith(LIFE_DEMO_URL)) return 'life_demo';
  if (LIFE_HOSTS.has(host) || host.startsWith('app.')) return 'life_signup';
  if (host === PORTAL_HOST || host.startsWith('portal.') || host.startsWith('rideff-portal.')) return 'portal';
  if (host === location.hostname && /^(\/en)?\/(kontakt|contact)\/?$/.test(url.pathname)) return 'contact_page';
  return null;
}

/**
 * Counts clicks on contact and sign-up links (Vercel Analytics event
 * "cta_click" with type and page; no personal data), and tags Cal.com links
 * with UTM parameters so a booking shows which page it came from.
 */
export function CtaTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button > 1) return;
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      let url: URL;
      try {
        url = new URL(a.href, location.href);
      } catch {
        return;
      }
      const type = ctaType(url);
      if (!type) return;
      const page = location.pathname;
      if (type === 'call' && !url.searchParams.has('utm_source')) {
        url.searchParams.set('utm_source', 'rideff.com');
        url.searchParams.set('utm_medium', 'website');
        url.searchParams.set('utm_content', page);
        a.href = url.toString();
      }
      ctaEvent(type, page);
    };
    // Capture phase: runs before handlers that navigate or stop propagation.
    document.addEventListener('click', onClick, true);
    document.addEventListener('auxclick', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('auxclick', onClick, true);
    };
  }, []);
  return null;
}
