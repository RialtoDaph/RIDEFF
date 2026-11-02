import { track } from '@vercel/analytics';

/**
 * Nana events (README → Nana → Analytics). Vercel Web Analytics sets no cookies;
 * custom events need a Vercel Pro or Enterprise plan to show in the dashboard.
 */
export type NanaEvent =
  | 'nana_open'
  | 'nana_call_click'
  | 'nana_call_start'
  | 'nana_call_end'
  | 'nana_summary_created'
  | 'nana_summary_wa_rialto'
  | 'nana_summary_wa_self'
  | 'nana_summary_copy';

/** Never sends message text, phone numbers or other personal data. */
export function nanaEvent(name: NanaEvent, props?: Record<string, string | number | boolean>) {
  try {
    track(name, props);
  } catch {
    // Analytics must never break Nana.
  }
}

/** Outbound and contact CTAs (src/components/site/CtaTracker.tsx). */
export type CtaType = 'whatsapp' | 'call' | 'email' | 'phone' | 'life_signup' | 'life_demo' | 'portal' | 'contact_page';

export function ctaEvent(type: CtaType, page: string) {
  try {
    track('cta_click', { type, page });
  } catch {
    // Analytics must never break a link.
  }
}
