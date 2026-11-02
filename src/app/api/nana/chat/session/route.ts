import { chatSession, isElevenLabsConfigured } from '@/lib/nana/elevenlabs';
import type { ChatSessionResponse } from '@/lib/nana/types';
import { rateLimit } from '@/lib/nana/rate-limit';
import { bad, readJson, sessionId } from '@/lib/nana/validate';

export const runtime = 'nodejs';

/**
 * POST /api/nana/chat/session  { sessionId }
 * ElevenLabs configured: a signed URL for a text-only session with the Nana
 * agent (same prompt and knowledge as the voice call). Otherwise "mock": the
 * client uses POST /api/nana/chat instead.
 * Rate limited per IP and session (429 rate_limited), see src/lib/nana/rate-limit.ts.
 */
export async function POST(req: Request) {
  const body = await readJson(req);
  const sid = body && sessionId(body.sessionId);
  if (!sid) return bad('bad_request');
  const headers = { 'cache-control': 'no-store' };
  if (!isElevenLabsConfigured()) return Response.json({ provider: 'mock' } satisfies ChatSessionResponse, { headers });
  const limited = rateLimit('chat', req, sid);
  if (limited) return limited;
  try {
    const { signedUrl } = await chatSession();
    return Response.json({ provider: 'elevenlabs', signedUrl } satisfies ChatSessionResponse, { headers });
  } catch (e) {
    console.error('nana chat session', e);
    return bad('chat_unavailable', 502);
  }
}
