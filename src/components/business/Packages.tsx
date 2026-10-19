'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SectionHead } from '../ui/SectionHead';

type Plan = { k: string; sub: string; price: string; setup: string; f: string[]; cta: string };

/**
 * Section 07 "So viel System, wie Sie brauchen.": "Wo stehen Sie?" picks the
 * matching plan (Growth by default), which gets the orange ring and badge.
 */
export function Packages() {
  const t = useTranslations('biz.pakete');
  const [sel, setSel] = useState(1);
  const plans = t.raw('plans') as Plan[];
  const stages = t.raw('stages') as string[];

  return (
    <div className="py-20 flex flex-col gap-7">
      <div className="flex justify-between items-end gap-6 flex-wrap">
        <SectionHead id="pakete-title" num="07" label={t('eyebrow')} title={t('title')} titleClassName="text-wrap" />
        <div className="flex flex-col gap-2">
          <span id="pk-where" className="font-mono text-[11px] tracking-[0.1em] text-zinc-500">{t('where')}</span>
          <div role="group" aria-labelledby="pk-where" className="flex flex-wrap gap-[6px] p-1 rounded-[22px] sm:rounded-full bg-[#E9E9E6] self-start">
            {stages.map((s, i) => (
              <button
                key={s}
                type="button"
                aria-pressed={i === sel}
                onClick={() => setSel(i)}
                className="text-[14px] font-semibold py-[9px] px-4 rounded-full cursor-pointer transition-[background,color] duration-200 min-h-[40px]"
                style={{ background: i === sel ? '#0A0A0A' : 'transparent', color: i === sel ? '#fff' : '#3F3F46' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px] pt-3">
        {plans.map((p, i) => {
          const dark = i === 1;
          const on = i === sel;
          return (
            <div
              key={p.k}
              className={`relative rounded-[20px] p-[26px] flex flex-col gap-3 border transition-[box-shadow,border-color] duration-250 ${dark ? 'bg-ink-2 text-stone-50' : 'bg-white text-ink'}`}
              style={{
                borderColor: on ? '#FF6A00' : dark ? '#26262A' : '#E4E4E1',
                boxShadow: on ? '0 0 0 3px rgba(255,106,0,0.18)' : 'none',
              }}
            >
              {on && (
                <span className="absolute -top-3 left-[22px] bg-orange-500 text-white rounded-full py-1 px-[10px] text-[12px] font-semibold">
                  {t('fit')}
                </span>
              )}
              <h3 className="font-mono text-[13px] tracking-[0.08em] font-normal m-0">{p.k}</h3>
              <span className={`text-[15px] ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>{p.sub}</span>
              <div className="flex items-baseline gap-[6px]">
                <span className={`text-[13px] ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{t('from')}</span>
                <span className="text-[44px] font-bold tracking-[-0.04em] whitespace-nowrap">{p.price}</span>
                <span className={`text-[14px] ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{t('perMonth')}</span>
              </div>
              <span className={`text-[13px] ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{p.setup}</span>
              <ul className={`border-t pt-3 flex flex-col gap-2 text-[14px] m-0 p-0 list-none ${dark ? 'border-line-d3' : 'border-[#EDEDEC]'}`}>
                {p.f.map((f) => (
                  <li key={f}>
                    <span className="text-orange-500 mr-2" aria-hidden="true">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#kontakt"
                className={`mt-auto pt-3 text-center text-[14px] font-semibold p-3 rounded-full text-white ${dark ? 'bg-orange-500' : 'bg-ink'}`}
              >
                {p.cta}
              </a>
            </div>
          );
        })}
      </div>
      <p className="m-0 text-[13px] text-zinc-500">{t('net')}</p>
    </div>
  );
}
