import type { Locale } from '@/i18n/routing';

/** Euro amount in the visitor's convention: "1.290 €" / "12,90 €" (DE), "€1,290" / "€12.90" (EN). */
export function eur(n: number, locale: Locale, cents = false): string {
  const s = n.toLocaleString(locale === 'de' ? 'de-DE' : 'en-GB', {
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
  return locale === 'de' ? `${s} €` : `€${s}`;
}

/** Plain number with the locale's thousands separator: "9.000" / "9,000". */
export function num(n: number, locale: Locale): string {
  return n.toLocaleString(locale === 'de' ? 'de-DE' : 'en-GB');
}
