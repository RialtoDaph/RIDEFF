import type { Locale } from '@/i18n/routing';

/**
 * Public origin for canonicals, hreflang, sitemap, OG images and JSON-LD.
 * NEXT_PUBLIC_SITE_URL wins; otherwise Vercel's production domain (rideff.vercel.app
 * today, rideff.com automatically once that domain is the project's primary
 * domain), and rideff.com outside Vercel.
 */
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || (vercelHost ? `https://${vercelHost}` : 'https://rideff.com')).replace(/\/$/, '');
export const APP_URL = 'https://app.rideff.com';
export const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL || 'https://portal.rideff.com';
/** Where "RIDEFF Life Demo" links point (the prototype's app stand-in). See TODO.md. */
export const LIFE_DEMO_URL = process.env.NEXT_PUBLIC_LIFE_DEMO_URL || `${APP_URL}/demo`;
export const WHATSAPP_URL = 'https://wa.me/4917632572420';
/** Free 15-minute first call with Rialto (Cal.com). */
export const CAL_URL = 'https://cal.com/rideff-call/rideff-rialto-call-15';

export type LifePlan = 'life' | 'plus' | 'together';
export const signupUrl = (plan: LifePlan, locale: Locale) => `${APP_URL}/signup?plan=${plan}&lang=${locale}`;
