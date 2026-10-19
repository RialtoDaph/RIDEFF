'use client';

import { useId, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { signupUrl, type Plan } from '@/lib/site';

const PLANS: Plan[] = ['life', 'plus', 'together'];
type Tier = { k: string; p: string; sub: string; f: string[] };

/** Life / Life Plus (default) / Together. The CTA carries the selected plan. */
export function PricingTabs() {
  const t = useTranslations('life.preis');
  const locale = useLocale() as Locale;
  const [sel, setSel] = useState<Plan>('plus');
  const id = useId();
  const tier = t.raw(`tiers.${sel}`) as Tier;

  const onKey = (e: React.KeyboardEvent) => {
    const i = PLANS.indexOf(sel);
    const next = e.key === 'ArrowRight' ? (i + 1) % 3 : e.key === 'ArrowLeft' ? (i + 2) % 3 : -1;
    if (next < 0) return;
    e.preventDefault();
    setSel(PLANS[next]);
    document.getElementById(`${id}-${PLANS[next]}`)?.focus();
  };

  return (
    <div className="p-6 rounded-[20px] bg-stone-100 flex flex-col gap-[18px]">
      <div role="tablist" onKeyDown={onKey} className="grid grid-cols-3 gap-1 p-1 rounded-full bg-[#E9E9E6]">
        {PLANS.map((p) => {
          const on = p === sel;
          return (
            <button
              key={p}
              id={`${id}-${p}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`${id}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => setSel(p)}
              className="font-mono text-[12px] tracking-[0.06em] py-[10px] px-[6px] rounded-full cursor-pointer whitespace-nowrap transition-[background,color] duration-200 min-h-[40px]"
              style={{ background: on ? '#0A0A0A' : 'transparent', color: on ? '#fff' : '#3F3F46' }}
            >
              {(t.raw(`tiers.${p}`) as Tier).k}
            </button>
          );
        })}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${sel}`} className="flex flex-col gap-[18px]">
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-[64px] font-bold tracking-[-0.05em] leading-none whitespace-nowrap">{tier.p}</span>
            <span className="text-[15px] text-zinc-500">{t('perMonth')}</span>
          </div>
          <span className="text-[15px] text-zinc-600">{tier.sub}</span>
        </div>
        <ul className="flex flex-col border-t border-stone-200 m-0 p-0 list-none">
          {tier.f.map((f) => (
            <li key={f} className="flex gap-[10px] py-[11px] border-b border-stone-200 text-[15px]">
              <span className="text-orange-500" aria-hidden="true">✓</span>
              {f}
            </li>
          ))}
        </ul>
        <a
          href={signupUrl(sel, locale)}
          className="text-center text-[15px] font-semibold p-[14px] rounded-full bg-orange-500 text-white hover:bg-orange-450 transition-colors"
        >
          {t('cta')}
        </a>
      </div>
    </div>
  );
}
