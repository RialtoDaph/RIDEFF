import { NextResponse } from 'next/server';
import { fetchSlots } from '@/lib/cal';

export const runtime = 'nodejs';

/** Free slots of the 15-minute first call, straight from Cal.com. */
export async function GET() {
  try {
    const days = await fetchSlots();
    return NextResponse.json({ days }, { headers: { 'cache-control': 'public, s-maxage=30, stale-while-revalidate=60' } });
  } catch (e) {
    console.error('cal slots failed', e);
    return NextResponse.json({ error: 'unavailable' }, { status: 502, headers: { 'cache-control': 'no-store' } });
  }
}
