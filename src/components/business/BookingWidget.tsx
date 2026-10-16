'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CAL_BUSINESS, businessBookingHref } from '@/lib/site';

const TIMES = ['09:00', '10:30', '13:00', '14:30', '16:00', '17:30'];

/**
 * Booking card of section 09, styled like the prototype widget.
 * Until Cal.com is configured (NEXT_PUBLIC_CAL_BUSINESS) the button opens an
 * email to hallo@rideff.com with the subject "Erstgespräch".
 * Step 4 replaces the day/time picker with the Cal.com inline embed.
 */
export function BookingWidget() {
  const t = useTranslations('biz.kontakt');
  const [day, setDay] = useState(1);
  const [time, setTime] = useState(3);
  const days = t.raw('days') as string[];
  const short = t.raw('daysShort') as string[];

  return (
    <div className="bg-night-1 text-stone-50 border border-line-d3 rounded-[20px] shadow-[0_24px_60px_rgba(0,0,0,0.18)] p-[22px] flex flex-col gap-[14px] min-h-[300px]">
      <div className="flex justify-between font-mono text-[11px] tracking-[0.1em] text-zinc-450">
        <span>{t('widget')}</span>
        <span>{t('month')}</span>
      </div>
      <div className="grid grid-cols-5 gap-[6px] font-mono text-[11px] text-center" role="group" aria-label={t('widget')}>
        {days.map((d, i) => (
          <button
            key={d}
            type="button"
            aria-pressed={i === day}
            onClick={() => setDay(i)}
            className="cursor-pointer py-2 rounded-[8px] min-h-[36px]"
            style={{ background: i === day ? '#F5F5F4' : 'transparent', color: i === day ? '#0A0A0A' : '#8A8A93' }}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-[6px]" role="group" aria-label={t('widget')}>
        {TIMES.map((x, i) => {
          const on = i === time;
          return (
            <button
              key={x}
              type="button"
              aria-pressed={on}
              onClick={() => setTime(i)}
              className="cursor-pointer font-mono text-[13px] py-[10px] text-center rounded-[10px] border min-h-[40px]"
              style={{ borderColor: on ? '#FF6A00' : '#26262A', background: on ? '#FF6A00' : 'transparent', color: on ? '#fff' : '#D4D4D8' }}
            >
              {x}
            </button>
          );
        })}
      </div>
      <a
        href={businessBookingHref}
        {...(CAL_BUSINESS ? { target: '_blank', rel: 'noopener' } : {})}
        className="text-center font-semibold text-[15px] p-[14px] rounded-full bg-orange-500 text-white hover:bg-orange-450 transition-colors"
      >
        {t('book', { slot: `${short[day]} · ${TIMES[time]}` })}
      </a>
    </div>
  );
}
