import 'server-only';

/**
 * Cal.com v2, public endpoints only (no API key): the event page is public, so
 * slots and bookings need the username and event slug, nothing secret.
 * CAL_URL in site.ts points at the same event.
 */
const API = 'https://api.cal.com/v2';
export const CAL_USERNAME = 'rideff-call';
export const CAL_EVENT_SLUG = 'rideff-rialto-call-15';
export const CAL_TZ = 'Europe/Berlin';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type Slot = { start: string; time: string };
export type SlotDays = Record<string, Slot[]>;

const dayKey = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: CAL_TZ }).format(d);

/** Free slots for the next `days` days, grouped by Berlin date, never more than `perDay` per day. */
export async function fetchSlots(days = 14, perDay = 12): Promise<SlotDays> {
  const now = new Date();
  const end = new Date(now.getTime() + days * 86_400_000);
  const url = `${API}/slots?username=${CAL_USERNAME}&eventTypeSlug=${CAL_EVENT_SLUG}&start=${dayKey(now)}&end=${dayKey(end)}&timeZone=${encodeURIComponent(CAL_TZ)}`;
  const res = await fetch(url, { headers: { 'cal-api-version': '2024-09-04' }, next: { revalidate: 30 }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`cal slots ${res.status}`);
  const json = (await res.json()) as { data?: Record<string, { start: string }[]> };
  const out: SlotDays = {};
  for (const [date, list] of Object.entries(json.data ?? {})) {
    const slots = list
      .map((s) => ({ start: new Date(s.start).toISOString(), time: s.start.slice(11, 16) }))
      .filter((s) => new Date(s.start).getTime() > now.getTime() + 30 * 60_000)
      .slice(0, perDay);
    if (slots.length) out[date] = slots;
  }
  return out;
}

export type BookingInput = { name: string; email: string; start: string; notes: string; language: 'de' | 'en' };

/** Creates the booking. Cal.com sends the confirmation mail to the attendee and to Rialto. */
export async function createBooking(b: BookingInput): Promise<{ ok: true } | { ok: false; reason: 'taken' | 'invalid' | 'failed' }> {
  const res = await fetch(`${API}/bookings`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'cal-api-version': '2024-08-13' },
    body: JSON.stringify({
      start: b.start,
      username: CAL_USERNAME,
      eventTypeSlug: CAL_EVENT_SLUG,
      attendee: { name: b.name, email: b.email, timeZone: CAL_TZ, language: b.language },
      bookingFieldsResponses: b.notes ? { notes: b.notes } : undefined,
      metadata: { source: 'rideff.com' },
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (res.ok) return { ok: true };
  const text = (await res.text()).toLowerCase();
  console.error('cal booking failed', res.status, text.slice(0, 300));
  if (res.status === 400 || res.status === 409) return { ok: false, reason: /available|already|booked|taken|slot/.test(text) ? 'taken' : 'invalid' };
  return { ok: false, reason: 'failed' };
}
