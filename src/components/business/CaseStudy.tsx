'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { hasResult, ticOriginalsResult as result } from '@/content/caseStudies';
import { SectionHead } from '../ui/SectionHead';

const IMGS = ['/images/case/tic1.jpg', '/images/case/tic2.jpg', '/images/case/tic3.jpg'];

/**
 * Section 06 "Gebaut, live, betreut." with the TIC Originals card and the case
 * study modal (native <dialog>: focus stays inside, Esc and backdrop close it).
 * The "Ergebnis" box only appears once src/content/caseStudies.ts has data.
 */
export function CaseStudy() {
  const t = useTranslations('biz.projekt');
  const ta = useTranslations('a11y');
  const locale = useLocale() as Locale;
  const dialog = useRef<HTMLDialogElement>(null);
  const facts = t.raw('facts') as [string, string][];
  const mFacts = t.raw('modal.facts') as [string, string][];
  const alts = t.raw('modal.imgAlts') as string[];
  const close = () => dialog.current?.close();

  return (
    <div className="py-[72px] flex flex-col gap-7">
      <div className="flex justify-between items-end gap-6 flex-wrap">
        <SectionHead id="projekt-title" num="06" label={t('eyebrow')} title={t('title')} />
        <button
          type="button"
          onClick={() => dialog.current?.showModal()}
          aria-haspopup="dialog"
          className="text-[15px] font-semibold border-b border-ink pb-[2px] cursor-pointer text-ink hover:text-orange-500 hover:border-orange-500 transition-colors min-h-[32px]"
        >
          {t('read')}
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-[14px]">
        <div className="relative rounded-[20px] overflow-hidden bg-[#1A1A1A] h-[260px] md:h-[360px]">
          <Image src={IMGS[0]} alt={t('imgAlt')} fill sizes="(min-width: 1024px) 700px, 100vw" className="object-cover" />
        </div>
        <div className="bg-ink-2 text-stone-50 rounded-[20px] p-[26px] flex flex-col gap-[14px]">
          <span className="font-mono text-[11px] tracking-[0.12em] text-orange-400">{t('kicker')}</span>
          <span className="text-[28px] font-bold tracking-[-0.03em] leading-[1.1]">{t('name')}</span>
          <span className="text-[15px] text-zinc-400 leading-[1.5]">{t('text')}</span>
          <dl className="mt-auto flex flex-col border-t border-line-d3 text-[14px] m-0">
            {facts.map(([k, v]) => (
              <div key={k} className="flex justify-between py-[10px] border-b border-line-d1">
                <dt className="font-mono text-[11px] tracking-[0.1em] text-zinc-450">{k}</dt>
                <dd className="m-0">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <dialog
        ref={dialog}
        aria-labelledby="case-title"
        onClick={(e) => e.target === dialog.current && close()}
        className="m-auto w-[calc(100%-32px)] max-w-[960px] max-h-[calc(100%-80px)] overflow-auto bg-white text-ink rounded-card-xl p-0 backdrop:bg-ink/60"
      >
        <div className="grid grid-cols-[2fr_1fr_1fr] gap-2 p-2 h-[180px] md:h-[300px]">
          {IMGS.map((src, i) => (
            <div key={src} className="relative rounded-card overflow-hidden">
              <Image src={src} alt={alts[i]} fill sizes="(min-width: 960px) 480px, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
        <div className="pt-8 px-6 md:px-10 pb-10 flex flex-col gap-6">
          <div className="flex justify-between items-start gap-6">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[11px] tracking-[0.12em] text-orange-700">{t('modal.kicker')}</span>
              <h3 id="case-title" className="text-[40px] font-bold tracking-[-0.04em] leading-none m-0">{t('name')}</h3>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label={ta('close')}
              className="text-[20px] w-11 h-11 rounded-full border border-[#E4E4E7] bg-white cursor-pointer flex-none"
            >
              ×
            </button>
          </div>
          <dl className="grid grid-cols-3 gap-5 py-[18px] border-y border-[#E4E4E7] m-0">
            {mFacts.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1">
                <dt className="font-mono text-[10px] tracking-[0.12em] text-zinc-500">{k}</dt>
                <dd className="text-[15px] font-semibold m-0">{v}</dd>
              </div>
            ))}
          </dl>
          <div className={`grid gap-7 text-[15px] leading-[1.55] text-zinc-700 ${hasResult(result) ? 'md:grid-cols-2' : ''}`}>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-ink">{t('modal.builtTitle')}</span>
              <span>{t('modal.built')}</span>
            </div>
            {hasResult(result) && (
              <div className="flex flex-col gap-2">
                <span className="font-bold text-ink">{t('modal.resultTitle')}</span>
                {result.numbers.length > 0 && (
                  <dl className="grid grid-cols-2 gap-3 m-0">
                    {result.numbers.map((n) => (
                      <div key={n.value} className="flex flex-col">
                        <dt className="order-2 text-[13px] text-zinc-500">{n.label[locale]}</dt>
                        <dd className="order-1 m-0 text-[24px] font-bold tracking-[-0.03em] text-ink">{n.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {result.quote && (
                  <blockquote className="m-0 bg-orange-50 border border-orange-200 rounded-[12px] p-3 text-[#7C4A2A]">
                    <p className="m-0">{result.quote.text[locale]}</p>
                    <footer className="mt-2 text-[13px] font-semibold">{result.quote.author}</footer>
                  </blockquote>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-[10px]">
            <a href="#kontakt" onClick={close} className="font-semibold text-[15px] py-[14px] px-6 rounded-full bg-orange-500 text-white">
              {t('modal.cta')}
            </a>
          </div>
        </div>
      </dialog>
    </div>
  );
}
