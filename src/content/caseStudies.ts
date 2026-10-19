import type { Locale } from '@/i18n/routing';

/**
 * Case study content that is still being collected.
 *
 * The "Ergebnis" box in the TIC Originals modal stays hidden until at least one
 * number or the quote is filled in. Fill in all three languages (EN/ID can
 * repeat the German text until a translation is approved).
 */
type L10n = Record<Locale, string>;

export type CaseResult = {
  /** Key figures, e.g. { value: '+38 %', label: { de: 'Umsatz online', … } } */
  numbers: { value: string; label: L10n }[];
  /** Customer quote, or null while there is none. */
  quote: { text: L10n; author: string } | null;
};

export const ticOriginalsResult: CaseResult = {
  numbers: [],
  quote: null,
};

export const hasResult = (r: CaseResult) => r.numbers.length > 0 || r.quote !== null;
