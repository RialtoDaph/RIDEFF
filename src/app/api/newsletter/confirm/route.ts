import { NextResponse, type NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';
import { addContact, isConfigured, verifyToken } from '@/lib/newsletter';

export const runtime = 'nodejs';

const page = (req: NextRequest, locale: string, status: 'confirmed' | 'expired') => {
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
  return NextResponse.redirect(new URL(`${prefix}/newsletter/${status}`, req.nextUrl.origin), 303);
};

/** Step 2 of the double opt-in: the click in the mail adds the address to the list. */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('t') ?? '';
  const r = verifyToken(token);
  if (!r.ok || !isConfigured()) return page(req, (!r.ok && r.locale) || routing.defaultLocale, 'expired');
  try {
    await addContact(r.email, r.locale);
  } catch (e) {
    console.error('newsletter: adding contact failed', e);
    return page(req, r.locale, 'expired');
  }
  return page(req, r.locale, 'confirmed');
}
