import { hasLocale } from 'next-intl';
import { routing, type Locale } from '@/i18n/routing';
import type { NanaPage } from './types';

const PAGES: NanaPage[] = ['home', 'pricing', 'work', 'life', 'contact'];

export async function readJson(req: Request, maxBytes = 32_000): Promise<Record<string, unknown> | null> {
  const raw = await req.text();
  if (raw.length > maxBytes) return null;
  try {
    const v = JSON.parse(raw);
    return v && typeof v === 'object' && !Array.isArray(v) ? v : null;
  } catch {
    return null;
  }
}

export const str = (v: unknown, max = 2000) => (typeof v === 'string' ? v.slice(0, max) : '');
export const locale = (v: unknown): Locale => (typeof v === 'string' && hasLocale(routing.locales, v) ? v : routing.defaultLocale);
export const page = (v: unknown): NanaPage => (PAGES.includes(v as NanaPage) ? (v as NanaPage) : 'home');
export const sessionId = (v: unknown) => (typeof v === 'string' && /^[\w-]{8,64}$/.test(v) ? v : null);
export const bad = (error: string, status = 400) => Response.json({ error }, { status });
