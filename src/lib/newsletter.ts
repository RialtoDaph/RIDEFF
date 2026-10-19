import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Locale } from '@/i18n/routing';

/**
 * Newsletter with double opt-in and no database.
 *
 * 1. POST /api/newsletter sends a confirmation mail with a signed link (48 h).
 * 2. GET /api/newsletter/confirm verifies the signature and only then adds the
 *    address to the list of the configured provider.
 *
 * Env: NEWSLETTER_PROVIDER = "resend" | "brevo", NEWSLETTER_FROM, NEWSLETTER_SECRET,
 * RESEND_API_KEY + RESEND_AUDIENCE_ID, or BREVO_API_KEY + BREVO_LIST_ID.
 */
const TTL_MS = 48 * 60 * 60 * 1000;
export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type Provider = 'resend' | 'brevo';
const provider = (process.env.NEWSLETTER_PROVIDER ?? '').trim().toLowerCase() as Provider | '';
const secret = process.env.NEWSLETTER_SECRET ?? '';
const from = process.env.NEWSLETTER_FROM ?? '';

export function isConfigured() {
  if (!secret || secret.length < 32 || !from) return false;
  if (provider === 'resend') return !!process.env.RESEND_API_KEY && !!process.env.RESEND_AUDIENCE_ID;
  if (provider === 'brevo') return !!process.env.BREVO_API_KEY && !!process.env.BREVO_LIST_ID;
  return false;
}

const b64 = (s: string) => Buffer.from(s).toString('base64url');
const sign = (payload: string) => createHmac('sha256', secret).update(payload).digest('base64url');

export function createToken(email: string, locale: Locale) {
  const payload = b64(JSON.stringify({ e: email, l: locale, x: Date.now() + TTL_MS }));
  return `${payload}.${sign(payload)}`;
}

export type TokenResult = { ok: true; email: string; locale: Locale } | { ok: false; reason: 'invalid' | 'expired'; locale?: Locale };

export function verifyToken(token: string): TokenResult {
  const [payload, sig] = token.split('.');
  if (!payload || !sig || !secret) return { ok: false, reason: 'invalid' };
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(payload));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false, reason: 'invalid' };
  try {
    const { e, l, x } = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { e: string; l: Locale; x: number };
    if (Date.now() > x) return { ok: false, reason: 'expired', locale: l };
    return { ok: true, email: e, locale: l };
  } catch {
    return { ok: false, reason: 'invalid' };
  }
}

type Mail = { subject: string; hello: string; body: string; button: string; ignore: string };

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

function mailHtml(m: Mail, url: string) {
  return `<!doctype html><html><body style="margin:0;background:#F4F4F2;font-family:Geist,Helvetica,Arial,sans-serif;color:#0A0A0A">
<div style="max-width:520px;margin:0 auto;padding:40px 24px">
<p style="font-weight:700;font-size:17px;letter-spacing:0.02em;margin:0 0 32px">RIDEFF</p>
<p style="font-size:16px;line-height:1.6;margin:0 0 12px">${esc(m.hello)}</p>
<p style="font-size:16px;line-height:1.6;margin:0 0 28px">${esc(m.body)}</p>
<a href="${esc(url)}" style="display:inline-block;background:#FF6A00;color:#fff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 24px;border-radius:9999px">${esc(m.button)} →</a>
<p style="font-size:13px;line-height:1.5;color:#71717A;margin:32px 0 0">${esc(m.ignore)}</p>
</div></body></html>`;
}

const text = (m: Mail, url: string) => `${m.hello}\n\n${m.body}\n\n${m.button}: ${url}\n\n${m.ignore}`;

async function call(url: string, init: RequestInit) {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`${url} → ${res.status} ${await res.text().catch(() => '')}`.slice(0, 300));
}

export async function sendConfirmation(email: string, mail: Mail, url: string) {
  if (provider === 'resend') {
    await call('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from, to: [email], subject: mail.subject, html: mailHtml(mail, url), text: text(mail, url) }),
    });
  } else {
    const m = from.match(/^(.*)<(.+)>$/);
    await call('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY!, 'content-type': 'application/json' },
      body: JSON.stringify({
        sender: m ? { name: m[1].trim(), email: m[2].trim() } : { email: from },
        to: [{ email }],
        subject: mail.subject,
        htmlContent: mailHtml(mail, url),
        textContent: text(mail, url),
      }),
    });
  }
}

export async function addContact(email: string, locale: Locale) {
  if (provider === 'resend') {
    await call(`https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`, {
      method: 'POST',
      headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ email, unsubscribed: false }),
    });
  } else {
    await call('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY!, 'content-type': 'application/json' },
      body: JSON.stringify({ email, listIds: [Number(process.env.BREVO_LIST_ID)], updateEnabled: true, attributes: { LANGUAGE: locale } }),
    });
  }
}
