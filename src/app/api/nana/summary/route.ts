import { mockSummary } from '@/lib/nana/mock';
import type { SummaryRequest } from '@/lib/nana/types';
import { bad, locale, readJson, sessionId, str } from '@/lib/nana/validate';

export const runtime = 'nodejs';

/**
 * POST /api/nana/summary  { sessionId, locale, kind, duration, transcript[], consent }
 * → { kind, duration, need, interest, next, text, stored }
 *
 * With consent, the real implementation stores transcript + summary in Supabase
 * (Frankfurt) and attaches them to the lead/client in the portal.
 * MOCK: builds the summary from the prototype's rules; nothing is stored.
 */
export async function POST(req: Request) {
  const body = await readJson(req, 64_000);
  if (!body) return bad('bad_request');
  const sid = sessionId(body.sessionId);
  if (!sid) return bad('bad_session');
  const kind = body.kind === 'call' ? 'call' : 'chat';
  const transcript = (Array.isArray(body.transcript) ? body.transcript : []).slice(0, 200).map((l: { from?: unknown; text?: unknown }) => ({
    from: l?.from === 'nana' ? ('nana' as const) : ('you' as const),
    text: str(l?.text, 1000),
  }));
  const request: SummaryRequest = {
    sessionId: sid,
    locale: locale(body.locale),
    kind,
    duration: Math.max(0, Math.min(36_000, Number(body.duration) || 0)),
    transcript,
    consent: body.consent === true,
  };
  // TODO(owner): if (request.consent) store transcript + summary in Supabase for the portal.
  return Response.json(await mockSummary(request), { headers: { 'cache-control': 'no-store' } });
}
