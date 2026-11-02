import { buildSummary, type SummaryFields } from '@/lib/nana/mock';
import { finishedConversation } from '@/lib/nana/elevenlabs';
import type { SummaryRequest } from '@/lib/nana/types';
import { rateLimit } from '@/lib/nana/rate-limit';
import { bad, locale, readJson, sessionId, str } from '@/lib/nana/validate';

export const runtime = 'nodejs';
/** Waiting for ElevenLabs' post-call analysis can take a few seconds. */
export const maxDuration = 30;

/**
 * POST /api/nana/summary  { sessionId, locale, kind, duration, transcript[], consent, conversationIds? }
 * → { kind, duration, need, interest, next, text, stored }
 *
 * transcript is the whole visit (typed chat first, then the call). With ElevenLabs
 * conversation ids (chat session, call), need / interest / next come from the
 * agents' post-call analysis: the first conversation that filled a field wins, so
 * a noisy call cannot overwrite what was typed. The official transcripts replace
 * the client one only when every conversation is available; otherwise (or if the
 * analysis is not ready in time) the client transcript is used.
 *
 * TODO(owner): with consent, store transcript + summary in Supabase (Frankfurt)
 * and attach them to the lead/client in the portal.
 */
export async function POST(req: Request) {
  const body = await readJson(req, 64_000);
  if (!body) return bad('bad_request');
  const sid = sessionId(body.sessionId);
  if (!sid) return bad('bad_session');
  const limited = rateLimit('summary', req, sid);
  if (limited) return limited;
  const kind = body.kind === 'call' ? 'call' : 'chat';
  let transcript = (Array.isArray(body.transcript) ? body.transcript : []).slice(0, 200).map((l: { from?: unknown; text?: unknown }) => ({
    from: l?.from === 'nana' ? ('nana' as const) : ('you' as const),
    text: str(l?.text, 1000),
  }));

  const ai: SummaryFields = {};
  const ids = [...new Set((Array.isArray(body.conversationIds) ? body.conversationIds : [body.conversationId]).map((v: unknown) => str(v, 80)).filter(Boolean))].slice(0, 3) as string[];
  if (ids.length) {
    const convs = await Promise.all(ids.map((id) => finishedConversation(id, sid)));
    const official = convs.flatMap((c) => (c?.transcript ?? []).filter((l) => l.message).map((l) => ({ from: l.role === 'agent' ? ('nana' as const) : ('you' as const), text: String(l.message) })));
    if (convs.every(Boolean) && official.length) transcript = official;
    const FIELDS: [keyof SummaryFields, string][] = [['name', 'name'], ['company', 'company'], ['industry', 'industry'], ['contact', 'contact'], ['need', 'need'], ['situation', 'situation'], ['timeline', 'timeline'], ['interest', 'interest'], ['next', 'next_step']];
    // The agent's "nothing yet" answers only count when no conversation has a real one.
    const FALLBACK = /^(not decided yet|noch nicht entschieden|rialto replies here on whatsapp|rialto antwortet hier auf whatsapp)\.?$/i;
    const fallback: SummaryFields = {};
    for (const conv of convs) {
      const dc = conv?.analysis?.data_collection_results ?? {};
      for (const [field, key] of FIELDS) {
        const v = dc[key]?.value;
        if (typeof v !== 'string' || !v.trim()) continue;
        if (FALLBACK.test(v.trim())) fallback[field] ??= v;
        else if (!ai[field]) ai[field] = v;
      }
    }
    for (const [field] of FIELDS) ai[field] ??= fallback[field];
  }

  const request: SummaryRequest = {
    sessionId: sid,
    locale: locale(body.locale),
    kind,
    duration: Math.max(0, Math.min(36_000, Number(body.duration) || 0)),
    transcript,
    consent: body.consent === true,
    conversationId: ids[ids.length - 1],
  };
  return Response.json(await buildSummary(request, ai), { headers: { 'cache-control': 'no-store' } });
}
