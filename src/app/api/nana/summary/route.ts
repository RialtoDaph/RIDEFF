import { buildSummary, type SummaryFields } from '@/lib/nana/mock';
import { finishedConversation } from '@/lib/nana/elevenlabs';
import type { SummaryRequest } from '@/lib/nana/types';
import { bad, locale, readJson, sessionId, str } from '@/lib/nana/validate';

export const runtime = 'nodejs';
/** Waiting for ElevenLabs' post-call analysis can take a few seconds. */
export const maxDuration = 30;

/**
 * POST /api/nana/summary  { sessionId, locale, kind, duration, transcript[], consent, conversationId? }
 * → { kind, duration, need, interest, next, text, stored }
 *
 * With an ElevenLabs conversation id, need / interest / next come from the
 * agent's post-call analysis (data collection) and the official transcript.
 * Without (or if the analysis is not ready in time), from the client transcript.
 *
 * TODO(owner): with consent, store transcript + summary in Supabase (Frankfurt)
 * and attach them to the lead/client in the portal.
 */
export async function POST(req: Request) {
  const body = await readJson(req, 64_000);
  if (!body) return bad('bad_request');
  const sid = sessionId(body.sessionId);
  if (!sid) return bad('bad_session');
  const kind = body.kind === 'call' ? 'call' : 'chat';
  let transcript = (Array.isArray(body.transcript) ? body.transcript : []).slice(0, 200).map((l: { from?: unknown; text?: unknown }) => ({
    from: l?.from === 'nana' ? ('nana' as const) : ('you' as const),
    text: str(l?.text, 1000),
  }));

  const ai: SummaryFields = {};
  const conversationId = str(body.conversationId, 80);
  if (conversationId) {
    const conv = await finishedConversation(conversationId);
    if (conv) {
      const official = conv.transcript.filter((l) => l.message).map((l) => ({ from: l.role === 'agent' ? ('nana' as const) : ('you' as const), text: String(l.message) }));
      if (official.length) transcript = official;
      const dc = conv.analysis?.data_collection_results ?? {};
      const val = (k: string) => (typeof dc[k]?.value === 'string' ? (dc[k].value as string) : undefined);
      ai.name = val('name');
      ai.company = val('company');
      ai.industry = val('industry');
      ai.contact = val('contact');
      ai.need = val('need');
      ai.situation = val('situation');
      ai.timeline = val('timeline');
      ai.interest = val('interest');
      ai.next = val('next_step');
    }
  }

  const request: SummaryRequest = {
    sessionId: sid,
    locale: locale(body.locale),
    kind,
    duration: Math.max(0, Math.min(36_000, Number(body.duration) || 0)),
    transcript,
    consent: body.consent === true,
    conversationId: conversationId || undefined,
  };
  return Response.json(await buildSummary(request, ai), { headers: { 'cache-control': 'no-store' } });
}
