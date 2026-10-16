'use client';

import { useEffect } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';

const NS = 'erstgespraech';

/** Cal.com inline embed in RIDEFF colours (dark card, brand #FF6A00). */
export default function CalInline({ calLink, locale }: { calLink: string; locale: string }) {
  useEffect(() => {
    let cancelled = false;
    getCalApi({ namespace: NS }).then((cal) => {
      if (cancelled) return;
      cal('ui', {
        theme: 'dark',
        hideEventTypeDetails: true,
        layout: 'month_view',
        cssVarsPerTheme: { light: { 'cal-brand': '#FF6A00' }, dark: { 'cal-brand': '#FF6A00' } },
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Cal
      namespace={NS}
      calLink={calLink}
      config={{ layout: 'month_view', theme: 'dark', locale }}
      className="w-full h-full min-h-[420px] overflow-auto"
    />
  );
}
