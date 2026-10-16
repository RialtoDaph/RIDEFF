import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

/** Namespaces every page's client components need (menu, language switch, newsletter, intro). */
export const BASE_NAMESPACES = ['a11y', 'common', 'intro', 'footer', 'newsletter'] as const;

/**
 * Passes only the given message namespaces to client components, so a page
 * does not inline the copy of every other page.
 */
export async function ClientMessages({ namespaces, children }: { namespaces: readonly string[]; children: ReactNode }) {
  const all = await getMessages();
  const messages = Object.fromEntries(namespaces.filter((n) => n in all).map((n) => [n, all[n]]));
  return <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>;
}
