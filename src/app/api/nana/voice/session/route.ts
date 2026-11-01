import { mockCallScript } from '@/lib/nana/mock';
import type { VoiceSessionResponse } from '@/lib/nana/types';
import { bad, locale, readJson, sessionId } from '@/lib/nana/validate';

export const runtime = 'nodejs';

/**
 * POST /api/nana/voice/session  { sessionId, locale, page }
 * Returns a short-lived realtime token for the voice provider. The client then
 * streams mic audio to the provider and receives audio + transcript lines.
 *
 * MOCK: no provider; returns the prototype's scripted café call instead.
 */
export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body || !sessionId(body.sessionId)) return bad('bad_request');
  const res: VoiceSessionResponse = {
    provider: 'mock',
    token: null,
    expiresAt: new Date(Date.now() + 5 * 60_000).toISOString(),
    script: await mockCallScript(locale(body.locale)),
  };
  return Response.json(res, { headers: { 'cache-control': 'no-store' } });
}
