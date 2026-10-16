'use client';

import dynamic from 'next/dynamic';
import { useLocale, useTranslations } from 'next-intl';
import { useInView } from '@/hooks/useInView';
import { CAL_BUSINESS, businessBookingHref } from '@/lib/site';

const CalInline = dynamic(() => import('./CalInline'), { ssr: false });

/**
 * Booking card of section 09.
 * - NEXT_PUBLIC_CAL_BUSINESS set: Cal.com inline embed (loaded only when the
 *   card comes near the viewport, so it costs nothing on first load).
 * - Not set: one button that emails hallo@rideff.com (subject "Erstgespräch").
 */
export function BookingWidget() {
  const t = useTranslations('biz.kontakt');
  const locale = useLocale();
  const [ref, near] = useInView<HTMLDivElement>({ rootMargin: '600px 0px' });

  return (
    <div
      ref={ref}
      className="bg-night-1 text-stone-50 border border-line-d3 rounded-[20px] shadow-[0_24px_60px_rgba(0,0,0,0.18)] p-[22px] flex flex-col gap-[14px]"
    >
      <div className="font-mono text-[11px] tracking-[0.1em] text-zinc-450">{t('widget')}</div>
      {CAL_BUSINESS ? (
        <div className="min-h-[420px] -mx-[10px] -mb-[10px]">{near && <CalInline calLink={CAL_BUSINESS} locale={locale} />}</div>
      ) : (
        <a
          href={businessBookingHref}
          className="text-center font-semibold text-[15px] p-[14px] rounded-full bg-orange-500 text-white hover:bg-orange-450 transition-colors"
        >
          {t('emailCta')}
        </a>
      )}
    </div>
  );
}
