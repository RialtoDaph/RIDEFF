import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import type { ChatMessage, NanaAction, SummaryRequest, SummaryResponse } from './types';

/**
 * Mock brain for Nana, the same canned answers as the prototype
 * (RideffNana.dc.html), matched on English and German keywords.
 * Replace with the real AI provider in src/app/api/nana/chat/route.ts.
 */
type Rule = { re: RegExp; key: string; actions?: boolean };
const RULES: Rule[] = [
  { re: /plan|fit|paket|passt/i, key: 'mostBusinessesStartWithGrowth249' },
  { re: /setup|einrichtung/i, key: 'theSetupPaysForAnalysisBuild', actions: true },
  { re: /vat|tax|mwst|steuer/i, key: 'businessPricesAreNetPlus19' },
  { re: /\btic\b/i, key: 'tICOriginalsGotAShopBuilt' },
  { re: /build|mine|bauen|meins/i, key: 'yesItStartsWithAFree', actions: true },
  { re: /long|live|timeline|when|lange|livegang|wann/i, key: 'threeStepsUnderstandBuildRunIt', actions: true },
  { re: /family|together|people|familie|personen/i, key: 'togetherCoversUpTo4People' },
  { re: /trial|free|test|kostenlos/i, key: 'n14DaysFreeNoCardNeeded' },
  { re: /life/i, key: 'rIDEFFLifeIsAPersonalAssistant' },
  { re: /growth/i, key: 'growthConnectsCustomersSalesTeamAnd', actions: true },
  { re: /call|book|talk|rialto|gespräch|buchen|sprechen|anruf/i, key: 'happyToSetThatUpPick', actions: true },
];

export async function mockReply(locale: Locale, messages: ChatMessage[]): Promise<{ text: string; actions: NanaAction[] }> {
  const t = await getTranslations({ locale, namespace: 'RideffNana' });
  const q = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';
  const hit = RULES.find((r) => r.re.test(q));
  if (!hit) return { text: t('iMStillAPreviewSo'), actions: ['book', 'whatsapp'] };
  return { text: t(hit.key), actions: hit.actions ? ['book', 'whatsapp'] : [] };
}

/** Mock call script (the prototype's café conversation). */
export async function mockCallScript(locale: Locale) {
  const t = await getTranslations({ locale, namespace: 'RideffNana' });
  return [
    { who: 'nana' as const, text: t('hiThisIsNanaFromRIDEFF') },
    { who: 'you' as const, text: t('whatWouldASystemForMy') },
    { who: 'nana' as const, text: t('mostCafesStartWithGrowth249') },
    { who: 'you' as const, text: t('canITalkToRialtoAbout') },
    { who: 'nana' as const, text: t('ofCourseILlSendYou') },
  ];
}

const fmt = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

/**
 * Summary in the WhatsApp template from the README. In production the AI fills
 * need / interest / next from the transcript; the mock uses the prototype's rules.
 */
export async function mockSummary(req: SummaryRequest, now = new Date()): Promise<SummaryResponse> {
  const t = await getTranslations({ locale: req.locale, namespace: 'RideffNana' });
  const tn = await getTranslations({ locale: req.locale, namespace: 'nana' });
  const mine = req.transcript.filter((l) => l.from === 'you').map((l) => l.text);
  const all = mine.join(' ');

  let kind: string, duration: string, need: string, interest: string, next: string;
  if (req.kind === 'call') {
    kind = t('voiceCall');
    duration = fmt(Math.max(0, Math.round(req.duration)));
    need = t('aSystemForMyCafe');
    interest = t('growth249MonthSetupFrom1');
    next = t('pickATimeForAFree');
  } else {
    kind = t('chat');
    duration = tn('questions', { n: req.duration });
    need = mine[0] || '—';
    interest = /growth|plan|fit|setup|paket|passt|einrichtung/i.test(all)
      ? t('growth249MonthSetupFrom1')
      : /family|together|familie/i.test(all)
        ? t('rIDEFFLifeTogether2990Month')
        : /life|trial|test/i.test(all)
          ? t('rIDEFFLife14DaysFree')
          : t('notDecidedYet');
    next = /call|book|talk|rialto|build|mine|live|long|gespräch|buchen|bauen|meins|lange/i.test(all) ? t('aFree30MinCallWith') : t('rialtoRepliesHereOnWhatsApp');
  }

  const date = now.toLocaleDateString(req.locale === 'de' ? 'de-DE' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Berlin' });
  const text = [
    t('hiRialtoSummaryFromNana'),
    `${kind} · ${date} · ${duration}`,
    '',
    t('whatINeed'),
    need,
    '',
    t('interestedIn'),
    interest,
    '',
    t('nextStep'),
    next,
    '',
    t('sentFromNanaOnRideff'),
  ].join('\n');

  return { kind, duration, need, interest, next, text, stored: false };
}
