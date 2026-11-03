import type { WhatsAppResponse } from '@/lib/nana/types';
import { rateLimit } from '@/lib/nana/rate-limit';
import { bad, readJson, sessionId, str } from '@/lib/nana/validate';

export const runtime = 'nodejs';

/** International number, digits only after an optional "+", 7–15 digits (E.164). */
const normalizePhone = (raw: string) => {
  const p = raw.replace(/[\s()./-]/g, '').replace(/^00/, '+');
  return /^\+?[1-9]\d{6,14}$/.test(p) ? p.replace(/^\+?/, '+') : null;
};

/**
 * POST /api/nana/whatsapp  { sessionId, phone, text, optIn }
 * Sends the summary to the visitor's own WhatsApp via a WhatsApp Business
 * template message. Only after explicit opt-in (optIn: true). Rate limited per
 * IP and per number, so the route cannot be used to send paid messages at scale.
 *
 * MOCK: validates and pretends to send. Wire the WhatsApp Business API (approved
 * template, sender number) here; see TODO.md.
 */
export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body || !sessionId(body.sessionId)) return bad('bad_request');
  if (body.optIn !== true) return bad('opt_in_required', 403);
  const phone = normalizePhone(str(body.phone, 40));
  if (!phone) return bad('invalid_phone');
  const limited = rateLimit('whatsapp', req, phone);
  if (limited) return limited;
  if (!str(body.text, 4000).trim()) return bad('empty_text');
  const res: WhatsAppResponse = { ok: true, mock: true };
  return Response.json(res, { headers: { 'cache-control': 'no-store' } });
}
