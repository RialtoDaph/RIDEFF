import { mockCallScript } from '@/lib/nana/mock';
import { isElevenLabsConfigured, voiceSession } from '@/lib/nana/elevenlabs';
import type { VoiceSessionResponse } from '@/lib/nana/types';
import { rateLimit } from '@/lib/nana/rate-limit';
import { bad, locale, readJson, sessionId } from '@/lib/nana/validate';

export const runtime = 'nodejs';

/**
 * POST /api/nana/voice/session  { sessionId, locale, page }
 * ElevenLabs configured: a WebRTC conversation token for the Nana agent; the
 * browser then streams mic audio to ElevenLabs and gets audio + transcript back.
 * Otherwise: the prototype's scripted café call (mock).
 * Rate limited per IP and session (429 rate_limited), see src/lib/nana/rate-limit.ts.
 */
export async function POST(req: Request) {
  const body = await readJson(req);
  const sid = body && sessionId(body.sessionId);
  if (!sid) return bad('bad_request');
  const headers = { 'cache-control': 'no-store' };

  if (isElevenLabsConfigured()) {
    const limited = rateLimit('voice', req, sid);
    if (limited) return limited;
    try {
      const { token, livekitUrl } = await voiceSession();
      return Response.json({ provider: 'elevenlabs', token, livekitUrl } satisfies VoiceSessionResponse, { headers });
    } catch (e) {
      console.error('nana voice session', e);
      return bad('voice_unavailable', 502);
    }
  }
  return Response.json({ provider: 'mock', token: null, script: await mockCallScript(locale(body.locale)) } satisfies VoiceSessionResponse, { headers });
}
