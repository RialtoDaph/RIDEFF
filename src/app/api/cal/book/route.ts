import { NextResponse, type NextRequest } from 'next/server';
import { EMAIL_RE, createBooking, fetchSlots } from '@/lib/cal';
import { rateLimit } from '@/lib/nana/rate-limit';
import { locale, readJson, str } from '@/lib/nana/validate';

export const runtime = 'nodejs';

/** Books the 15-minute first call in Cal.com. Nothing is stored here. */
export async function POST(req: NextRequest) {
  const body = await readJson(req, 4_000);
  if (!body) return NextResponse.json({ error: 'bad_request' }, { status: 400 });

  // Honeypot: bots fill the hidden field; pretend success.
  if (typeof body.company === 'string' && body.company) return NextResponse.json({ ok: true });

  const name = str(body.name, 120).trim();
  const email = str(body.email, 254).trim().toLowerCase();
  const need = str(body.need, 80).trim();
  const start = str(body.start, 40);
  if (!name) return NextResponse.json({ error: 'name' }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'email' }, { status: 400 });
  if (Number.isNaN(Date.parse(start))) return NextResponse.json({ error: 'slot' }, { status: 400 });

  const limited = rateLimit('booking', req, email);
  if (limited) return limited;

  // Only book a time that Cal.com itself currently offers.
  const iso = new Date(start).toISOString();
  try {
    const days = await fetchSlots(21, 200);
    if (!Object.values(days).some((l) => l.some((s) => s.start === iso))) return NextResponse.json({ error: 'taken' }, { status: 409 });
  } catch {
    return NextResponse.json({ error: 'unavailable' }, { status: 502 });
  }

  const lang = locale(body.locale) === 'en' ? 'en' : 'de';
  const r = await createBooking({ name, email, start: iso, notes: need ? `Interesse: ${need}` : '', language: lang });
  if (r.ok) return NextResponse.json({ ok: true });
  return NextResponse.json({ error: r.reason }, { status: r.reason === 'taken' ? 409 : r.reason === 'invalid' ? 400 : 502 });
}
