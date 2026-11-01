import type { Locale } from '@/i18n/routing';

export const SITE_URL = 'https://rideff.com';
export const APP_URL = 'https://app.rideff.com';
export const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL || 'https://portal.rideff.com';
/** Design reference for the Life app (RIDEFF Life Demo.dc.html). TODO: confirm the public URL. */
export const LIFE_DEMO_URL = process.env.NEXT_PUBLIC_LIFE_DEMO_URL || `${APP_URL}/demo`;
export const EMAIL = 'hallo@rideff.com';
export const WHATSAPP_NUMBER = '4917632572420';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const waText = (text: string) => `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;

export type LifePlan = 'life' | 'plus' | 'together';
export const signupUrl = (plan: LifePlan, locale: Locale) => `${APP_URL}/signup?plan=${plan}&lang=${locale}`;
export const loginUrl = (locale: Locale) => `${APP_URL}/login?lang=${locale}`;

/**
 * Booking (Cal.com). Set NEXT_PUBLIC_CAL_BUSINESS (e.g. "rideff/15min") and
 * NEXT_PUBLIC_CAL_LIFE_PRIVATE once the account exists. While empty, the slot
 * pickers hand the chosen slot over to WhatsApp instead.
 */
export const CAL_BUSINESS = process.env.NEXT_PUBLIC_CAL_BUSINESS?.trim() ?? '';
export const CAL_LIFE_PRIVATE = process.env.NEXT_PUBLIC_CAL_LIFE_PRIVATE?.trim() ?? '';
export const calUrl = (slug: string) => (slug ? `https://cal.com/${slug}` : '');
