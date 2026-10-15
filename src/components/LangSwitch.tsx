'use client';

import { useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { BUSINESS_LOCALES, PRIVATE_LOCALES, PRIVATE_QUERY, type Mode } from '@/lib/site';

const KEY = 'rideff-lang-anchor';

/** The section currently at the top of the viewport and how far into it we are. */
function currentAnchor() {
  const sections = Array.from(document.querySelectorAll<HTMLElement>('main [id], footer[id]'));
  let best: { id: string; off: number } | null = null;
  for (const el of sections) {
    const top = el.getBoundingClientRect().top;
    if (top <= window.innerHeight * 0.3) best = { id: el.id, off: top };
    else break;
  }
  return best;
}

/**
 * DE / EN / ID pill. Switching keeps the reader in the section they were in:
 * the section id and its offset are stored and restored after the new locale renders.
 */
export function LangSwitch({ mode, variant }: { mode: Mode; variant: 'dark' | 'light' }) {
  const locale = useLocale() as Locale;
  const t = useTranslations('a11y');
  const pathname = usePathname();
  const options = mode === 'private' ? PRIVATE_LOCALES : BUSINESS_LOCALES;

  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = sessionStorage.getItem(KEY);
      sessionStorage.removeItem(KEY);
    } catch {}
    if (!raw) return;
    const { id, off } = JSON.parse(raw) as { id: string; off: number };
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - off, behavior: 'instant' });
  }, [locale]);

  const dark = variant === 'dark';
  return (
    <div
      role="group"
      aria-label={t('chooseLanguage')}
      className={`flex gap-[2px] p-[3px] rounded-full border ${dark ? 'border-line-d4 bg-night-2' : 'border-stone-200 bg-stone-100'}`}
    >
      {options.map((l) => {
        const on = l === locale;
        const tone = on ? (dark ? 'bg-stone-50 text-ink' : 'bg-ink text-white') : dark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-ink';
        return (
          <Link
            key={l}
            href={mode === 'private' ? { pathname, query: PRIVATE_QUERY } : pathname}
            locale={l}
            scroll={false}
            hrefLang={l}
            lang={l}
            aria-current={on ? 'true' : undefined}
            onClick={() => {
              const a = currentAnchor();
              try {
                if (a) sessionStorage.setItem(KEY, JSON.stringify(a));
              } catch {}
            }}
            className={`font-mono text-[11px] tracking-[0.08em] px-[9px] py-[6px] rounded-full transition-[background,color] duration-200 ${tone}`}
          >
            {l.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
