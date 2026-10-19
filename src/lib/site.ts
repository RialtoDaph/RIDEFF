import type { Locale } from '@/i18n/routing';

export const SITE_URL = 'https://rideff.com';
export const APP_URL = 'https://app.rideff.com';
export const PORTAL_URL = 'https://portal.rideff.com';
export const EMAIL = 'hallo@rideff.com';

export type Mode = 'business' | 'private';
export type Plan = 'life' | 'plus' | 'together';

/** The prototype offers Indonesian only for RIDEFF Life (PRIVATE). */
export const BUSINESS_LOCALES: readonly Locale[] = ['de', 'en'];
export const PRIVATE_LOCALES: readonly Locale[] = ['de', 'en', 'id'];

export const signupUrl = (plan: Plan, locale: Locale) => `${APP_URL}/signup?plan=${plan}&lang=${locale}`;
export const loginUrl = (locale: Locale) => `${APP_URL}/login?lang=${locale}`;

/** Query used for the PRIVATE page: rideff.com/?for=private */
export const PRIVATE_QUERY = { for: 'private' } as const;

/**
 * Booking. Set NEXT_PUBLIC_CAL_BUSINESS (e.g. "rideff/erstgespraech") and
 * NEXT_PUBLIC_CAL_LIFE_PRIVATE (e.g. "rideff/life-private") once the Cal.com
 * account exists. While empty, booking buttons open an email instead.
 */
export const CAL_BUSINESS = process.env.NEXT_PUBLIC_CAL_BUSINESS?.trim() ?? '';
export const CAL_LIFE_PRIVATE = process.env.NEXT_PUBLIC_CAL_LIFE_PRIVATE?.trim() ?? '';
const mailto = (subject: string) => `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
export const businessBookingHref = CAL_BUSINESS ? `https://cal.com/${CAL_BUSINESS}` : mailto('Erstgespräch');
export const lifePrivateHref = CAL_LIFE_PRIVATE ? `https://cal.com/${CAL_LIFE_PRIVATE}` : mailto('Life Private');

/** Client portal: shown as "Bald verfügbar" until NEXT_PUBLIC_PORTAL_LIVE=true. */
export const PORTAL_LIVE = process.env.NEXT_PUBLIC_PORTAL_LIVE === 'true';
