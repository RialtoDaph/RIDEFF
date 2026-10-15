import { getLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { signupUrl } from '@/lib/site';

/** "Und zwischendurch? Einfach fragen." — five sample questions plus the trial card. */
export async function AskGrid() {
  const t = await getTranslations('life.day');
  const locale = (await getLocale()) as Locale;
  const ask = t.raw('ask') as [string, string][];
  return (
    <div className="pt-6 pb-[104px] flex flex-col gap-[14px]">
      <div className="flex justify-between items-baseline gap-x-6 gap-y-2 flex-wrap">
        <h3 className="text-[24px] font-bold tracking-[-0.03em] m-0">{t('askTitle')}</h3>
        <span className="font-mono text-[12px] tracking-[0.08em] text-muted">{t('askSub')}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ask.map(([q, a]) => (
          <div key={q} className="p-5 rounded-card bg-white border border-stone-200 flex flex-col gap-[10px]">
            <span className="text-[17px] font-semibold">{q}</span>
            <span className="text-[14px] leading-[1.5] text-zinc-600">{a}</span>
          </div>
        ))}
        <a
          href={signupUrl('plus', locale)}
          className="p-5 rounded-card bg-orange-500 text-white flex flex-col gap-[10px] hover:bg-orange-450 transition-colors"
        >
          <span className="text-[17px] font-semibold">{t('askOwn')}</span>
          <span className="text-[14px] leading-[1.5] text-orange-50">{t('askOwnCta')}</span>
        </a>
      </div>
    </div>
  );
}
