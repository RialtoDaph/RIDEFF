import type { Locale } from '@/i18n/routing';

export const SITE_URL = 'https://rideff.com';
export const APP_URL = 'https://app.rideff.com';
export const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL || 'https://portal.rideff.com';
/** Where "RIDEFF Life Demo" links point (the prototype's app stand-in). See TODO.md. */
export const LIFE_DEMO_URL = process.env.NEXT_PUBLIC_LIFE_DEMO_URL || `${APP_URL}/demo`;
export const WHATSAPP_URL = 'https://wa.me/4917632572420';

export type LifePlan = 'life' | 'plus' | 'together';
export const signupUrl = (plan: LifePlan, locale: Locale) => `${APP_URL}/signup?plan=${plan}&lang=${locale}`;
