import { getLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { signupUrl } from '@/lib/site';
import { Section } from '../ui/Section';
import { SectionHead } from '../ui/SectionHead';
import { Faq } from '../ui/Faq';
import { ProblemQuiz } from './ProblemQuiz';
import { GoalTimeline } from './GoalTimeline';
import { FlowGap } from './FlowGap';
import { DayWithLife } from './DayWithLife';
import { AskGrid } from './AskGrid';
import { ResearchDemo } from './ResearchDemo';
import { DataSources } from './DataSources';
import { GrowthTimeline } from './GrowthTimeline';
import { PricingTabs } from './PricingTabs';
import { LifePrivateCard } from './LifePrivateCard';

const lead = 'text-[17px] leading-[1.55] text-zinc-600 m-0';
const pill = 'py-[7px] px-3 rounded-full border border-stone-200 whitespace-nowrap';
const pills = 'flex gap-2 flex-wrap font-mono text-[11px] tracking-[0.08em] text-zinc-600';

/** RIDEFF Life (PRIVATE) sections 01–09. */
export async function PrivateSections() {
  const t = await getTranslations('life');
  const locale = (await getLocale()) as Locale;
  const steps = t.raw('ablauf.steps') as [string, string][];

  return (
    <>
      <Section id="p-problem" labelledBy="p-problem-title" innerClassName="site-x py-[88px] flex flex-col gap-10">
        <SectionHead id="p-problem-title" num="01" label={t('problem.eyebrow')} title={t('problem.title')} />
        <ProblemQuiz />
      </Section>

      <Section id="p-module" labelledBy="p-module-title" innerClassName="site-x py-[88px]">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-14 items-center">
          <div className="flex flex-col gap-[18px]">
            <SectionHead id="p-module-title" num="02" label={t('module.eyebrow')} title={t('module.title')} />
            <p className={`${lead} max-w-[520px]`}>{t('module.lead')}</p>
          </div>
          <GoalTimeline />
        </div>
      </Section>

      <FlowGap />

      <Section id="p-tag" labelledBy="p-tag-title" innerClassName="site-x">
        <DayWithLife num="03" />
        <AskGrid />
      </Section>

      <Section id="p-weiter" labelledBy="p-weiter-title" innerClassName="site-x py-[88px]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-14 items-center">
          <div className="flex flex-col gap-[18px]">
            <SectionHead id="p-weiter-title" num="04" label={t('weiter.eyebrow')} title={t('weiter.title')} />
            <p className={`${lead} max-w-[520px] text-pretty`}>{t('weiter.lead')}</p>
            <div className={pills}>
              {(t.raw('weiter.tags') as string[]).map((x) => (
                <span key={x} className={pill}>{x}</span>
              ))}
            </div>
          </div>
          <ResearchDemo />
        </div>
      </Section>

      <Section id="p-ablauf" labelledBy="p-ablauf-title" innerClassName="site-x py-[88px]">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-14 items-center">
          <div className="flex flex-col gap-[18px]">
            <SectionHead id="p-ablauf-title" num="05" label={t('ablauf.eyebrow')} title={t('ablauf.title')} />
            <p className={`${lead} max-w-[480px]`}>{t('ablauf.lead')}</p>
          </div>
          <div className="py-6 px-[26px] rounded-card-md bg-white flex flex-col">
            <ol className="m-0 p-0 list-none">
              {steps.map(([label, time], i) => (
                <li
                  key={label}
                  className={`flex justify-between py-[14px] text-[16px] ${i < steps.length - 1 ? 'border-b border-stone-150' : ''}`}
                >
                  <span className="flex gap-3">
                    <span className={i < 2 ? 'text-orange-500' : 'text-zinc-300'} aria-hidden="true">{i < 2 ? '✓' : '○'}</span>
                    {label}
                  </span>
                  <span className="font-mono text-[12px] text-zinc-500">{time}</span>
                </li>
              ))}
            </ol>
            <div className="h-[6px] rounded-full bg-stone-150 mt-2">
              <div className="w-[40%] h-full rounded-full bg-orange-500" />
            </div>
            <div className="flex justify-between gap-4 pt-[10px] font-mono text-[11px] text-zinc-500">
              <span>{t('ablauf.progress')}</span>
              <span className="text-right">{t('ablauf.firstFinds')}</span>
            </div>
          </div>
        </div>
      </Section>

      <Section id="p-daten" labelledBy="p-daten-title" innerClassName="site-x py-[88px] flex flex-col gap-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px] gap-14 items-center">
          <div className="flex flex-col gap-[18px]">
            <SectionHead id="p-daten-title" num="06" label={t('daten.eyebrow')} title={t('daten.title')} />
            <p className={`${lead} max-w-[520px]`}>{t('daten.lead')}</p>
            <div className={pills}>
              {(t.raw('daten.tags') as string[]).map((x) => (
                <span key={x} className={pill}>{x}</span>
              ))}
            </div>
          </div>
          <DataSources />
        </div>
        <GrowthTimeline />
      </Section>

      <Section id="p-faq" labelledBy="p-faq-title" innerClassName="site-x py-[88px]">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_minmax(0,1fr)] gap-14 items-start">
          <SectionHead id="p-faq-title" num="07" label={t('faq.eyebrow')} title={t('faq.title')} />
          <Faq items={t.raw('faq.items') as [string, string][]} />
        </div>
      </Section>

      <Section id="p-preis" labelledBy="p-preis-title" innerClassName="site-x py-[88px] flex flex-col gap-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px] gap-14 items-center">
          <div className="flex flex-col gap-[18px]">
            <SectionHead id="p-preis-title" num="08" label={t('preis.eyebrow')} title={t('preis.title')} />
            <p className={`${lead} max-w-[480px]`}>{t('preis.lead')}</p>
          </div>
          <PricingTabs />
        </div>
        <LifePrivateCard />
      </Section>

      <Section
        id="p-kontakt"
        labelledBy="p-kontakt-title"
        innerClassName="text-stone-50 bg-ink-2 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:56px_56px] py-[112px]"
      >
        <div className="site-x flex flex-col items-center text-center gap-[22px]">
          <div className="font-mono text-[12px] tracking-[0.12em] text-zinc-450 flex gap-[10px]">
            <span data-sec-num="" className="text-orange-500">09</span>
            <span>{t('start.eyebrow')}</span>
          </div>
          <h2
            id="p-kontakt-title"
            className="text-[clamp(40px,7vw,64px)] font-bold tracking-[-0.05em] leading-[0.98] m-0 max-w-[820px] text-balance"
          >
            {t('start.title')}
          </h2>
          <p className="text-[18px] leading-[1.55] text-zinc-400 m-0 max-w-[560px] text-pretty">{t('start.text')}</p>
          <div className="flex gap-3 flex-wrap justify-center pt-[6px]">
            <a
              href={signupUrl('plus', locale)}
              className="font-semibold text-[16px] py-4 px-7 rounded-full bg-orange-500 text-white whitespace-nowrap shadow-[0_0_0_6px_rgba(255,106,0,0.15)] hover:bg-orange-450 transition-colors"
            >
              {t('start.cta')}
            </a>
            <a
              href="#p-preis"
              className="font-semibold text-[16px] py-4 px-6 rounded-full border border-line-d5 text-stone-50 whitespace-nowrap hover:border-zinc-450 transition-colors"
            >
              {t('start.compare')}
            </a>
          </div>
          <div className="flex gap-2 flex-wrap justify-center font-mono text-[11px] tracking-[0.1em] text-zinc-450 pt-[6px]">
            {(t.raw('start.tags') as string[]).map((x) => (
              <span key={x} className="py-[7px] px-3 rounded-full border border-line-d3 whitespace-nowrap">{x}</span>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
