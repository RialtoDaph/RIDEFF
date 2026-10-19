import { existsSync } from 'node:fs';
import path from 'node:path';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { EMAIL } from '@/lib/site';
import { Section } from '../ui/Section';
import { SectionHead } from '../ui/SectionHead';
import { FlowGap } from '../private/FlowGap';
import { ToolsToPlatform } from './ToolsToPlatform';
import { PlatformDashboard } from './PlatformDashboard';
import { NerveTimeline } from './NerveTimeline';
import { CaseStudy } from './CaseStudy';
import { Packages } from './Packages';
import { BookingWidget } from './BookingWidget';

/** Founder photo: drop a 200×200 image at public/team/rialto.jpg and rebuild. */
const FOUNDER_PHOTO = '/team/rialto.jpg';
const hasFounderPhoto = existsSync(path.join(process.cwd(), 'public', FOUNDER_PHOTO));

/** RIDEFF Business sections 01–09. */
export async function BusinessSections() {
  const t = await getTranslations('biz');
  const steps = t.raw('ablauf.steps') as [string, string, string, string][];
  const faq = t.raw('faq.items') as [string, string][];

  return (
    <>
      <Section id="problem" labelledBy="problem-title" innerClassName="site-x py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_minmax(0,1fr)] gap-12 items-center">
          <div className="flex flex-col gap-[22px]">
            <SectionHead id="problem-title" num="01" label={t('problem.eyebrow')} title={t('problem.title')} tone="dark" />
            <p className="text-[17px] leading-[1.55] text-zinc-400 m-0 max-w-[560px]">{t('problem.lead')}</p>
            <div className="flex gap-[10px] items-center text-[15px] font-semibold">
              <span className="font-mono text-[10px] font-medium tracking-[0.1em] bg-orange-500 text-white rounded-tag py-[2px] px-[6px] flex-none">
                {(await getTranslations('common'))('ai')}
              </span>
              <span>{t('problem.point')}</span>
            </div>
          </div>
          <div className="overflow-hidden lg:overflow-visible">
            <ToolsToPlatform />
          </div>
        </div>
      </Section>

      <Section id="plattform" labelledBy="plattform-title" innerClassName="site-x min-h-[760px]">
        <PlatformDashboard />
      </Section>

      <Section id="nerven" labelledBy="nerven-title" innerClassName="site-x">
        <NerveTimeline />
      </Section>

      <Section id="ablauf" labelledBy="ablauf-title" innerClassName="site-x py-20 min-h-[600px] flex flex-col gap-14">
        <div className="flex justify-between items-end gap-12 flex-wrap">
          <SectionHead id="ablauf-title" num="04" label={t('ablauf.eyebrow')} title={t('ablauf.title')} tone="dark" className="max-w-[680px]" />
          <p className="text-[17px] leading-[1.55] text-zinc-400 m-0 max-w-[400px]">{t('ablauf.lead')}</p>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 m-0 p-0 list-none">
          {steps.map(([when, title, text, tag], i) => (
            <li key={when} className={`flex flex-col gap-[14px] border-t-2 pt-[22px] ${i === 0 ? 'border-orange-500' : 'border-zinc-700'}`}>
              <span className={`font-mono text-[12px] tracking-[0.1em] ${i === 0 ? 'text-orange-500' : 'text-zinc-450'}`}>{when}</span>
              <h3 className="text-[24px] font-bold tracking-[-0.03em] m-0">{title}</h3>
              <span className="text-[15px] leading-[1.5] text-zinc-400">{text}</span>
              <span className="font-mono text-[11px] tracking-[0.08em] text-stone-50 bg-night-3 border border-line-d4 rounded-full py-[6px] px-3 self-start whitespace-nowrap">
                {tag}
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <FlowGap id="flowgap" ns="biz.flowGap" inkClassName="text-stone-50" ink2ClassName="text-ink" />

      <Section id="wer" labelledBy="wer-title" innerClassName="site-x py-[104px] grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-14 items-start text-ink">
        <div data-flow-photo="" className="relative w-[200px] h-[200px] rounded-full overflow-hidden bg-[#D4D4D0]">
          {hasFounderPhoto && <Image src={FOUNDER_PHOTO} alt={t('wer.name')} fill sizes="200px" className="object-cover" />}
        </div>
        <div className="flex flex-col gap-6 max-w-[820px]">
          <div className="font-mono text-[12px] tracking-[0.12em] text-muted flex gap-[10px]">
            <span data-sec-num="" className="text-orange-500">05</span>
            <span>{t('wer.eyebrow')}</span>
          </div>
          <h2 id="wer-title" className="text-[clamp(36px,6vw,56px)] font-bold tracking-[-0.05em] leading-[1.02] text-balance m-0">
            {t('wer.quote')}
          </h2>
          <p className="text-[18px] leading-[1.6] text-zinc-600 m-0 max-w-[640px]">{t('wer.text')}</p>
          <div className="flex gap-x-4 gap-y-1 flex-wrap items-center pt-4 border-t border-[#D4D4D0]">
            <span className="text-[16px] font-bold">{t('wer.name')}</span>
            <span className="font-mono text-[12px] text-muted">{t('wer.role')}</span>
          </div>
        </div>
      </Section>

      <Section id="projekt" labelledBy="projekt-title" innerClassName="site-x min-h-[640px] text-ink">
        <CaseStudy />
      </Section>

      <Section id="pakete" labelledBy="pakete-title" innerClassName="site-x min-h-[780px] text-ink">
        <Packages />
      </Section>

      <Section id="faq" labelledBy="faq-title" innerClassName="site-x py-20 min-h-[640px] grid grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)] gap-12 lg:gap-[72px] text-ink">
        <div className="flex flex-col gap-5">
          <SectionHead id="faq-title" num="08" label={t('faq.eyebrow')} title={t('faq.title')} titleClassName="text-wrap" />
          <p className="text-[17px] leading-[1.55] text-zinc-600 m-0">
            {t('faq.intro')}{' '}
            <a href={`mailto:${EMAIL}`} className="text-ink font-semibold border-b border-ink hover:text-orange-500 hover:border-orange-500">
              {EMAIL}
            </a>
          </p>
        </div>
        <div className="flex flex-col">
          {faq.map(([q, a], i) => (
            <details key={q} name="biz-faq" open={i === 0} className="group py-[22px] border-t border-[#D4D4D1] open:border-ink">
              <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden flex justify-between gap-6 text-[20px] font-semibold tracking-[-0.02em]">
                <span>{q}</span>
                <span aria-hidden="true" className="font-mono text-muted group-open:text-orange-500">
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="mt-3 mb-0 text-[16px] leading-[1.55] text-zinc-600 max-w-[640px]">{a}</p>
            </details>
          ))}
          <div className="border-t border-[#D4D4D1]" />
        </div>
      </Section>

      <Section id="kontakt" labelledBy="kontakt-title" innerClassName="site-x py-28 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_460px] gap-12 lg:gap-[72px] items-center text-ink">
        <div className="flex flex-col gap-6">
          <div className="font-mono text-[12px] tracking-[0.12em] text-muted flex gap-[10px]">
            <span data-sec-num="" className="text-orange-500">09</span>
            <span>{t('kontakt.eyebrow')}</span>
          </div>
          <h2 id="kontakt-title" className="text-[clamp(44px,8vw,76px)] font-bold tracking-[-0.055em] leading-[0.95] m-0">
            {t.rich('kontakt.title', { accent: (c) => <span className="text-orange-500">{c}</span> })}
          </h2>
          <p className="text-[17px] leading-[1.55] text-zinc-600 m-0 max-w-[560px]">{t('kontakt.text')}</p>
          <span className="font-mono text-[14px] text-zinc-600">
            {t('kontakt.write')}{' '}
            <a href={`mailto:${EMAIL}`} className="text-ink border-b border-ink hover:text-orange-500 hover:border-orange-500">
              {EMAIL}
            </a>
          </span>
        </div>
        <BookingWidget />
      </Section>
    </>
  );
}
