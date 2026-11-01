import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

/** Shared chrome every page renders (Nav, Footer). */
const BASE = ['RideffNav', 'RideffFooter', 'common'];

/**
 * Sends only the message namespaces a client subtree needs, instead of the
 * whole catalogue (≈2,000 strings) on every page.
 */
export async function Messages({ namespaces, children }: { namespaces: string[]; children: ReactNode }) {
  const [locale, all] = await Promise.all([getLocale(), getMessages()]);
  const pick = Object.fromEntries([...BASE, ...namespaces].filter((n) => n in all).map((n) => [n, all[n]]));
  return (
    <NextIntlClientProvider locale={locale} messages={pick}>
      {children}
    </NextIntlClientProvider>
  );
}
