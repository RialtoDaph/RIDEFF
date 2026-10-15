import type { Locale } from '@/i18n/routing';

export const SITE_URL = 'https://rideff.com';
export const APP_URL = 'https://app.rideff.com';
export const PORTAL_URL = 'https://portal.rideff.com';
export const CAL_LIFE_PRIVATE_URL = 'https://cal.com/rideff/life-private';
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
