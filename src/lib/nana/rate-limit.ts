import 'server-only';

/**
 * Sliding-window limits for routes that cost money or send mail: ElevenLabs
 * sessions (credits), the summary (polls ElevenLabs for up to 30 s) and the
 * newsletter (a mail to any address). Counted per IP and per key (the Nana
 * session id, or the e-mail address for the newsletter).
 *
 * In memory, so per server instance: it stops one browser or script from
 * hammering a warm instance, not a distributed attack. Keep the call limits and
 * budget alerts in ElevenLabs as the hard stop (TODO.md → Nana).
 */
type Limit = { perIp: number; perSession: number; windowMs: number };

export const LIMITS = {
  // A visitor rarely calls more than two or three times in ten minutes.
  voice: { perIp: 6, perSession: 3, windowMs: 10 * 60_000 },
  // Text sessions reopen after idle timeouts, so allow more.
  chat: { perIp: 20, perSession: 8, windowMs: 10 * 60_000 },
  // One summary per chat or call; a few retries.
  summary: { perIp: 15, perSession: 6, windowMs: 10 * 60_000 },
  // perSession = per e-mail address: no mail bombing of one inbox.
  newsletter: { perIp: 5, perSession: 2, windowMs: 60 * 60_000 },
} satisfies Record<string, Limit>;

const hits = new Map<string, number[]>();
const MAX_KEYS = 5000;

function take(key: string, max: number, windowMs: number, now: number): number {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return windowMs - (now - recent[0]);
  }
  recent.push(now);
  hits.set(key, recent);
  return 0;
}

/** The client IP as Vercel forwards it ("unknown" locally without a proxy). */
export function clientIp(req: Request) {
  return req.headers.get('x-real-ip')?.trim() || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

/**
 * Counts one session start. Returns null when allowed, otherwise a 429 response
 * with Retry-After.
 */
export function rateLimit(kind: keyof typeof LIMITS, req: Request, sid: string, now = Date.now()): Response | null {
  const l: Limit = LIMITS[kind];
  if (hits.size > MAX_KEYS) {
    for (const [k, ts] of hits) if (!ts.length || now - ts[ts.length - 1] > l.windowMs) hits.delete(k);
    if (hits.size > MAX_KEYS) hits.clear();
  }
  const wait = Math.max(take(`${kind}:ip:${clientIp(req)}`, l.perIp, l.windowMs, now), take(`${kind}:sid:${sid}`, l.perSession, l.windowMs, now));
  if (!wait) return null;
  return Response.json({ error: 'rate_limited' }, { status: 429, headers: { 'retry-after': String(Math.ceil(wait / 1000)), 'cache-control': 'no-store' } });
}
