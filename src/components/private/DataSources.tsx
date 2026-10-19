'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const DEFAULT = [true, true, true, false];

/** "FREIGEGEBENE QUELLEN": four switches and "Alle Daten löschen" (demo only). */
export function DataSources() {
  const t = useTranslations('life.daten');
  const [on, setOn] = useState(DEFAULT);
  const [wiped, setWiped] = useState(false);
  const items = t.raw('items') as string[];
  const count = on.filter(Boolean).length;

  return (
    <div className="py-[22px] px-6 rounded-card-md border border-[#E4E4E7] flex flex-col shadow-[0_20px_40px_rgba(10,10,10,0.06)] bg-white/0">
      <div className="flex justify-between font-mono text-[11px] tracking-[0.1em] text-zinc-500 pb-[10px]">
        <span>{t('sources')}</span>
        <span aria-live="polite">{t('count', { n: count })}</span>
      </div>
      {items.map((l, i) => (
        <button
          key={l}
          type="button"
          role="switch"
          aria-checked={on[i]}
          onClick={() => {
            setOn((o) => o.map((v, k) => (k === i ? !v : v)));
            setWiped(false);
          }}
          className="flex justify-between items-center gap-4 py-[14px] border-t border-stone-150 cursor-pointer text-[16px] text-left min-h-[44px]"
          style={{ color: on[i] ? '#0A0A0A' : '#71717A' }}
        >
          <span>{l}</span>
          <span
            className="w-11 h-6 rounded-full flex p-[3px] flex-none transition-[background] duration-200"
            style={{ background: on[i] ? '#FF6A00' : '#E4E4E7', justifyContent: on[i] ? 'flex-end' : 'flex-start' }}
            aria-hidden="true"
          >
            <span className="w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
          </span>
        </button>
      ))}
      <button
        type="button"
        onClick={() => {
          setOn([false, false, false, false]);
          setWiped(true);
        }}
        className="text-[14px] font-semibold text-[#B91C1C] border-t border-stone-150 pt-[14px] text-left cursor-pointer min-h-[44px]"
        aria-live="polite"
      >
        {wiped ? t('wiped') : t('wipe')}
      </button>
    </div>
  );
}
