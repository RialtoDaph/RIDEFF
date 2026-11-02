import 'server-only';

/**
 * Sliding-window limits for the routes that mint ElevenLabs sessions (each one
 * can cost credits). Counted per IP and per Nana session id.
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
