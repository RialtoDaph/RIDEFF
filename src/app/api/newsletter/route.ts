import { NextResponse, type NextRequest } from 'next/server';
import { getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/site';
import { EMAIL_RE, createToken, isConfigured, sendConfirmation } from '@/lib/newsletter';

export const runtime = 'nodejs';

/** Step 1 of the double opt-in: send the confirmation mail. Nothing is stored. */
export async function POST(req: NextRequest) {
  let body: { email?: unknown; locale?: unknown; company?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const locale = typeof body.locale === 'string' && hasLocale(routing.locales, body.locale) ? body.locale : routing.defaultLocale;

  // Honeypot: bots fill the hidden field; pretend success.
  if (typeof body.company === 'string' && body.company) return NextResponse.json({ ok: true });
  if (!EMAIL_RE.test(email) || email.length > 254) return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  if (!isConfigured()) return NextResponse.json({ error: 'not_configured' }, { status: 503 });

  const t = await getTranslations({ locale, namespace: 'newsletter.mail' });
  const origin = process.env.VERCEL_ENV === 'production' ? SITE_URL : req.nextUrl.origin;
  const url = `${origin}/api/newsletter/confirm?t=${encodeURIComponent(createToken(email, locale))}`;
  try {
    await sendConfirmation(
      email,
      { subject: t('subject'), hello: t('hello'), body: t('body'), button: t('button'), ignore: t('ignore') },
      url,
    );
  } catch (e) {
    console.error('newsletter: confirmation mail failed', e);
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
