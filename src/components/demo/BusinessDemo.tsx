'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { DemoData, IndustryKey } from '@/content/demo/types';

type Nav = 'home' | 'fin' | 'team' | 'kunden' | 'lager' | 'web' | 'what' | 'data';
type Role = 'O' | 'L' | 'T';

const NAV: [Nav, string][] = [
  ['home', '⌂'],
  ['fin', '€'],
  ['team', '◷'],
  ['kunden', '✉'],
  ['lager', '▤'],
  ['web', '◐'],
  ['what', '≋'],
  ['data', '☑'],
];
const LANE = { A: '#FF6A00', B: '#0A0A0A', C: '#A1A1AA' } as const;
const KEYS: IndustryKey[] = ['cafe', 'hotel', 'handwerk', 'dienst'];

/** What-if slider math per industry (ported 1:1 from the prototype). x = slider value. */
const SLIDER_CALC: Record<IndustryKey, ((x: number) => number)[]> = {
  cafe: [(x) => x * 0.9 * 1480, (x) => x * (320 - 160) * 4.3, (x) => x * (210 - 95) * 26],
  hotel: [(x) => x * 24 * 0.85 * 8.6, (x) => (x - 62) * 0.01 * 440 * 41, (x) => x * 95 - x * x * 2],
  handwerk: [(x) => x * 6 * 150, (x) => x * (7800 - 4600), (x) => x * 0],
  dienst: [(x) => ((x * 0.87 * 8 * 21) / 8) * 6, (x) => x * (9800 - 6200), (x) => -x * 45],
};
type Unit = 'pct' | 'plus' | 'h' | 'eur' | 'abs%' | 'minus%' | 'yesno' | 'absh';
const SLIDER_UNIT: Record<IndustryKey, Unit[]> = {
  cafe: ['pct', 'plus', 'h'],
  hotel: ['eur', 'abs%', 'minus%'],
  handwerk: ['eur', 'plus', 'yesno'],
  dienst: ['eur', 'plus', 'absh'],
};

const allowedFor = (role: Role, k: Nav) =>
  role === 'O' || (role === 'L' ? !['fin', 'what', 'data'].includes(k) : ['home', 'team', 'kunden'].includes(k));

const card = 'p-6 rounded-card bg-white border border-stone-200';
const h3 = 'text-[22px] font-bold tracking-[-0.025em] m-0';
const monoMuted = 'font-mono text-[11px] tracking-[0.1em] text-zinc-500';

function Pill({
  on,
  done,
  onClick,
  children,
  dark = true,
}: {
  on?: boolean;
  done?: boolean;
  onClick?: () => void;
  children: ReactNode;
  dark?: boolean;
}) {
  const cls = done
    ? 'border-[#BBE5C8] bg-success-bg text-success-ink'
    : dark
      ? 'border-ink bg-ink text-white'
      : 'border-stone-200 bg-white text-ink';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`font-mono text-[10px] tracking-[0.06em] py-2 px-[11px] rounded-full cursor-pointer whitespace-nowrap border min-h-[32px] ${cls}`}
    >
      {children}
    </button>
  );
}

function Check({ on, size = 20 }: { on: boolean; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="flex-none flex items-center justify-center text-[12px] text-white border-[1.5px]"
      style={{
        width: size,
        height: size,
        borderRadius: size > 20 ? 7 : 6,
        background: on ? '#22A355' : '#fff',
        borderColor: on ? '#22A355' : '#D4D4D8',
      }}
    >
      {on ? '✓' : ''}
    </span>
  );
}

/**
 * RIDEFF Business demo cockpit (rebuilt from "RIDEFF Business Demo.dc.html").
 * Four demo industries, three roles that limit the visible areas, eight views,
 * and a "Cockpit fragen" box (⌘K / Ctrl+K). All data is static mock data.
 */
export function BusinessDemo({ data, source }: { data: DemoData; source: DemoData }) {
  const t = useTranslations('demo');
  const ta = useTranslations('a11y');
  const tc = useTranslations('common');
  const locale = useLocale();
  const en = locale === 'en';

  const [ind, setInd] = useState<IndustryKey>('cafe');
  const [role, setRole] = useState<Role>('O');
  const [nav, setNav] = useState<Nav>('home');
  const [bi, setBi] = useState(0);
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [wi, setWi] = useState<Record<string, number>>({});
  const [extra, setExtra] = useState<{ id: number; ind: IndustryKey; n: string; x: string }[]>([]);
  const [name, setName] = useState('');
  const [slot, setSlot] = useState(0);
  const [sent, setSent] = useState(false);
  const [flash, setFlash] = useState(false);
  const [ask, setAsk] = useState(false);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(-1);
  const flashT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const askInput = useRef<HTMLInputElement>(null);

  const d = data[ind];
  const src = source[ind];
  const K = ind + ':';
  const on = (f: string, k: string | number) => !!flags[`${f}:${K}${k}`];
  const tog = (f: string, k: string | number) => setFlags((s) => ({ ...s, [`${f}:${K}${k}`]: !s[`${f}:${K}${k}`] }));
  const srcOn = (i: number) => flags[`src:${K}${i}`] !== false;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setAsk(true);
      }
      if (e.key === 'Escape') {
        setAsk(false);
        setOpen(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(flashT.current);
    };
  }, []);

  useEffect(() => {
    if (ask) askInput.current?.focus();
  }, [ask]);

  // Number formatting: DE "2.140 €", EN "€2,140".
  const fmt = (n: number) => {
    const sign = n < 0 ? '−' : '';
    const v = Math.round(Math.abs(n)).toLocaleString(en ? 'en-GB' : 'de-DE');
    return en ? `${sign}€${v}` : `${sign}${v} €`;
  };

  const ex = extra.filter((x) => x.ind === ind);
  const allowed = (k: Nav) => allowedFor(role, k);
  const me = role === 'O' ? d.owner : role === 'L' ? d.lead : d.team;
  const roleName = (r: Role) => t(`roles.${r}`);
  const navLabel = (k: Nav) => t(`nav.${k}`);
  const week = t.raw('week') as string[];
  const weekUpper = t.raw('weekUpper') as string[];

  const myTasks = d.tasks.map((x, i) => ({ x, done: on('tdone', i), toggle: () => tog('tdone', i) }));
  const reqCount = String(d.reqs.length + ex.length);
  const kpis: [string, string, string, string][] =
    role === 'T'
      ? [
          [t('home.kpiShift'), d.staffShift.split(' · ').pop() ?? '', d.staffShift.split(' · ')[0], '#52525B'],
          [t('home.kpiTasks'), `${myTasks.filter((x) => x.done).length} / 4`, t('home.kpiTasksSub'), '#52525B'],
          [t('home.kpiReq'), reqCount, t('home.kpiReqSub'), '#C2410C'],
        ]
      : role === 'L'
        ? [d.kpis[0], [t('home.kpiTeam'), String(d.rota.length), t('home.kpiTeamSub'), '#15803D'], [t('home.kpiReq'), reqCount, t('home.kpiReqSub'), '#C2410C']]
        : d.kpis;

  // Liquidity sparkline.
  const ser = d.series;
  const mn = Math.min(...ser);
  const mx = Math.max(...ser);
  const Wd = 400;
  const H = 120;
  const pts = ser.map((v, i) => [(i / (ser.length - 1)) * Wd, H - 8 - ((v - mn) / (mx - mn || 1)) * (H - 20)]);
  const line = pts.map((p) => p.join(',')).join(' ');
  const mi = ser.indexOf(mn);

  // What-if.
  const calc = SLIDER_CALC[ind];
  const wv = (k: number) => wi[K + k] ?? d.sl[k].def;
  const dP = d.sl.reduce((a, sl, k) => a + calc[k](wv(k)) - calc[k](sl.def), 0);
  const P = d.profit + dP;
  const unitLabel = (u: Unit, x: number) => {
    switch (u) {
      case 'pct':
        return `+${x} %`;
      case 'plus':
        return `+${x}`;
      case 'h':
        return `+${x} h`;
      case 'eur':
        return en ? `+€${x}` : `+${x} €`;
      case 'abs%':
        return `${x} %`;
      case 'minus%':
        return `−${x} %`;
      case 'yesno':
        return x ? t('what.yes') : t('what.no');
      case 'absh':
        return `${x} h`;
    }
  };
  const goalMonth = (() => {
    const m = Math.max(1, Math.round((5 * d.profit) / Math.max(P, 1)));
    const date = new Date(2026, 9 + m, 1);
    return `${(t.raw('what.months') as string[])[date.getMonth()]} ${date.getFullYear()}`;
  })();

  const submit = () => {
    const n = name.trim() || t('web.defaultName');
    setExtra((s) => [...s, { id: Date.now(), ind, n, x: `${d.req} · ${d.slots[slot]}` }]);
    setSent(true);
    setName('');
    setFlash(true);
    clearTimeout(flashT.current);
    flashT.current = setTimeout(() => setFlash(false), 2600);
  };

  const pickIndustry = (k: IndustryKey) => {
    setInd(k);
    setBi(0);
    setSent(false);
    setSlot(0);
  };

  const navItem = (k: Nav, icon: string, compact = false) => {
    const active = nav === k;
    const badge = k === 'kunden' && ex.length > 0;
    return (
      <button
        key={k}
        type="button"
        onClick={() => setNav(k)}
        aria-current={active ? 'page' : undefined}
        className={
          compact
            ? 'flex-none whitespace-nowrap flex gap-2 items-center py-[9px] px-[13px] rounded-full cursor-pointer text-[14px] font-semibold'
            : `flex gap-3 items-center py-[10px] px-[14px] rounded-[12px] cursor-pointer text-[15px] text-left hover:bg-night-3 ${k === 'home' ? 'font-semibold py-[11px]' : 'font-medium'}`
        }
        style={{
          background: active ? '#F5F5F4' : 'transparent',
          color: active ? '#0A0A0A' : allowed(k) ? '#D4D4D8' : '#52525B',
        }}
      >
        <span className={`font-mono ${compact ? 'text-[12px]' : 'w-5 text-[13px]'}`} style={{ color: active ? '#FF6A00' : '#71717A' }} aria-hidden="true">
          {icon}
        </span>
        <span className={compact ? '' : 'flex-1'}>{navLabel(k)}</span>
        {badge && !compact && (
          <span className="font-mono text-[10px] py-[2px] px-[7px] rounded-full bg-orange-500 text-white">{ex.length}</span>
        )}
      </button>
    );
  };

  const langPill = (small = false) => (
    <div className="flex gap-[2px] p-[3px] rounded-full border border-line-d4 bg-night-2 self-start" role="group" aria-label={ta('chooseLanguage')}>
      {(['de', 'en'] as const).map((l) => (
        <Link
          key={l}
          href="/demo"
          locale={l}
          aria-current={l === locale ? 'true' : undefined}
          className={`font-mono text-[10px] tracking-[0.1em] rounded-full ${small ? 'py-[5px] px-[9px]' : 'py-[6px] px-3'}`}
          style={{ background: l === locale ? '#F5F5F4' : 'transparent', color: l === locale ? '#0A0A0A' : '#A1A1AA' }}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );

  const industryButtons = (pill = false) =>
    KEYS.map((k) => {
      const active = ind === k;
      return (
        <button
          key={k}
          type="button"
          aria-pressed={active}
          onClick={() => pickIndustry(k)}
          className={`font-semibold cursor-pointer border whitespace-nowrap ${pill ? 'text-[12px] py-[6px] px-[10px] rounded-full' : 'text-[13px] py-2 px-[10px] rounded-[9px]'}`}
          style={{ borderColor: active ? '#F5F5F4' : '#2A2A2E', background: active ? '#F5F5F4' : 'transparent', color: active ? '#0A0A0A' : '#D4D4D8' }}
        >
          {data[k].n}
        </button>
      );
    });

  const vis = (k: Nav) => nav === k && allowed(k);
  const sugg = d.ask
    .map((x, i) => ({ q: x[0], a: x[1], s: x[2], i }))
    .filter((x) => !q || x.q.toLowerCase().includes(q.toLowerCase()));

  return (
    <div data-light-page="" className="min-h-screen grid grid-cols-1 min-[980px]:grid-cols-[280px_minmax(0,1fr)] bg-stone-100 bg-[radial-gradient(#DADAD6_1px,transparent_1px)] bg-[length:22px_22px] text-ink">
      {/* Sidebar (wide screens) */}
      <aside className="hidden min-[980px]:flex flex-col gap-[18px] py-[22px] px-[18px] bg-ink-2 text-stone-50 sticky top-0 h-screen overflow-y-auto bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:56px_56px]">
        <Link href="/" className="font-mono text-[11px] tracking-[0.06em] text-zinc-400 hover:text-white self-start py-1">
          {t('back')}
        </Link>
        <div className="flex gap-3 items-center">
          <span className="w-11 h-11 rounded-[12px] bg-orange-500 text-white flex items-center justify-center font-bold text-[16px] tracking-[-0.03em]">{d.ini}</span>
          <div className="flex flex-col gap-[2px] min-w-0">
            <span className="text-[17px] font-bold tracking-[-0.02em]">{d.brand}</span>
            <span className="font-mono text-[10px] tracking-[0.1em] text-zinc-400">
              {t('product')} · {d.tier}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-[6px]">
          <span className="font-mono text-[10px] tracking-[0.14em] text-zinc-500">{t('industry')}</span>
          <div className="grid grid-cols-2 gap-1">{industryButtons()}</div>
        </div>
        <button
          type="button"
          onClick={() => setAsk(true)}
          className="flex gap-[10px] items-center py-3 px-[14px] rounded-[12px] border border-line-d4 bg-night-2 text-zinc-400 text-[14px] cursor-pointer text-left hover:border-line-d5"
        >
          <span className="w-[7px] h-[7px] rounded-full bg-orange-500" />
          <span className="flex-1">{t('ask')}</span>
          <span className="font-mono text-[10px] py-[2px] px-[6px] rounded-[5px] border border-line-d4">⌘K</span>
        </button>
        <nav className="flex flex-col gap-[3px]" aria-label={ta('mainNav')}>
          {navItem('home', '⌂')}
          <span className="font-mono text-[10px] tracking-[0.14em] text-zinc-500 pt-[14px] px-[14px] pb-[6px]">{t('modules')}</span>
          {NAV.filter(([k]) => ['fin', 'team', 'kunden', 'lager', 'web'].includes(k)).map(([k, i]) => navItem(k, i))}
          <span className="font-mono text-[10px] tracking-[0.14em] text-zinc-500 pt-[14px] px-[14px] pb-[6px]">{t('tools')}</span>
          {NAV.filter(([k]) => ['what', 'data'].includes(k)).map(([k, i]) => navItem(k, i))}
        </nav>
        <div className="mt-auto">{langPill()}</div>
        <div className="flex gap-3 items-center py-3 px-[14px] rounded-card-sm border border-line-d3 bg-night-1">
          <span className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-[14px]">{me[0]}</span>
          <div className="flex flex-col gap-[2px] flex-1 min-w-0">
            <span className="text-[14px] font-semibold">{me[1]}</span>
            <span className="font-mono text-[10px] tracking-[0.06em] text-zinc-400">{roleName(role).toUpperCase()}</span>
          </div>
        </div>
      </aside>

      <main id="main" className="min-w-0 py-[22px] px-[18px] pb-10 min-[980px]:pt-9 min-[980px]:px-10 min-[980px]:pb-14 flex flex-col gap-[18px]">
        {/* Top bar (narrow screens) */}
        <div className="min-[980px]:hidden flex flex-col gap-[10px] -mx-[18px] -mt-[22px] py-[14px] px-[18px] bg-ink-2 sticky top-0 z-[5]">
          <div className="flex justify-between items-center gap-[10px] flex-wrap">
            <span className="flex gap-[10px] items-center text-stone-50">
              <span className="w-8 h-8 rounded-[9px] bg-orange-500 text-white flex items-center justify-center font-bold text-[13px]">{d.ini}</span>
              <span className="text-[15px] font-bold">{d.brand}</span>
            </span>
            <Link href="/" className="font-mono text-[11px] text-zinc-400 hover:text-white py-2">
              {t('back')}
            </Link>
          </div>
          <div className="flex gap-[6px] items-center flex-wrap">
            {industryButtons(true)}
            <button
              type="button"
              onClick={() => setAsk(true)}
              aria-label={t('ask')}
              className="font-mono text-[10px] py-[7px] px-[11px] rounded-full border border-line-d4 bg-night-2 text-zinc-400 cursor-pointer"
            >
              ⌘K
            </button>
            {langPill(true)}
          </div>
          <nav
            aria-label={ta('mainNav')}
            className="flex gap-1 overflow-x-auto pb-[2px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(90deg,#000_88%,transparent)]"
          >
            {NAV.map(([k, i]) => navItem(k, i, true))}
          </nav>
        </div>

        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[12px] tracking-[0.16em] text-zinc-500">
              {t('dateLine')} {d.city}
            </span>
            <h1 className="text-[clamp(30px,3.6vw,46px)] font-bold tracking-[-0.045em] leading-none m-0">
              {nav === 'home' ? `${t('goodMorning')} ${me[1].split(' ')[0]}` : navLabel(nav)}
            </h1>
          </div>
          <div className="flex gap-1 p-[5px] rounded-full bg-white border border-stone-200 max-w-full" role="group" aria-label={roleName(role)}>
            {(['O', 'L', 'T'] as Role[]).map((r) => {
              const p = r === 'O' ? d.owner : r === 'L' ? d.lead : d.team;
              const active = role === r;
              return (
                <button
                  key={r}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setRole(r)}
                  className="flex gap-2 items-center py-[6px] pr-[10px] min-[400px]:pr-[14px] pl-[6px] rounded-full cursor-pointer text-[13px] min-[400px]:text-[14px] font-semibold whitespace-nowrap"
                  style={{ background: active ? '#0A0A0A' : 'transparent', color: active ? '#fff' : '#0A0A0A' }}
                >
                  <span
                    className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[11px] font-bold"
                    style={{ background: active ? '#FF6A00' : '#EDEDEB', color: active ? '#fff' : '#0A0A0A' }}
                  >
                    {p[0]}
                  </span>
                  {roleName(r)}
                </button>
              );
            })}
          </div>
        </div>

        {!allowed(nav) && (
          <div className="p-10 rounded-card bg-white border border-dashed border-zinc-300 flex flex-col gap-[10px] items-start">
            <span className="font-mono text-[11px] tracking-[0.12em] text-orange-700">{t('locked.kicker')}</span>
            <span className="text-[22px] font-bold tracking-[-0.02em]">{t('locked.title')}</span>
            <span className="text-[15px] text-zinc-600">{t('locked.text')}</span>
            <button type="button" onClick={() => setNav('home')} className="font-mono text-[11px] py-[10px] px-[14px] rounded-full bg-ink text-white cursor-pointer">
              {t('locked.back')}
            </button>
          </div>
        )}

        {vis('home') && (
          <div className="flex flex-col gap-[18px]">
            <div className="flex flex-wrap items-center gap-x-[18px] gap-y-3 py-4 pr-[18px] pl-[22px] rounded-card bg-ink-2 text-stone-50">
              <span className="font-mono text-[10px] font-medium tracking-[0.1em] bg-orange-500 text-white rounded-tag py-[3px] px-[7px]">{tc('ai')}</span>
              <span className="flex-1 min-w-[min(100%,240px)] text-[16px] leading-[1.45]" aria-live="polite">
                {d.brief[bi % 3]}
              </span>
              <button
                type="button"
                onClick={() => setBi((b) => b + 1)}
                aria-label={ta('next')}
                className="flex gap-[10px] items-center font-mono text-[11px] py-[9px] pr-[9px] pl-[14px] rounded-full border border-line-d4 text-zinc-400 cursor-pointer whitespace-nowrap flex-none"
              >
                {(bi % 3) + 1} / 3
                <span className="w-[26px] h-[26px] rounded-full bg-stone-50 text-ink flex items-center justify-center text-[11px]">▶</span>
              </button>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[14px]">
              {kpis.map(([l, v, sub, sc]) => (
                <div key={l} className="py-[22px] px-6 rounded-card bg-white border border-stone-200 flex flex-col gap-2">
                  <span className="text-[14px] font-medium text-zinc-600">{l}</span>
                  <span className="text-[40px] font-bold tracking-[-0.045em] leading-none">{v}</span>
                  <span className="text-[14px]" style={{ color: sc }}>{sub}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-[14px] items-start">
              <div className={`${card} flex flex-col`}>
                <div className="flex flex-wrap justify-between items-baseline gap-[10px] pb-4 border-b border-stone-300">
                  <h2 className={h3}>{t('home.next7')}</h2>
                  <div className="flex gap-[14px] font-mono text-[12px] text-zinc-600">
                    {d.legend.map(([n, c]) => (
                      <span key={n} className="flex gap-[6px] items-center">
                        <span className="w-[9px] h-[9px] rounded-[3px]" style={{ background: c }} />
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
                {d.days.map((ev, i) => (
                  <div key={i} className="grid grid-cols-[72px_minmax(0,1fr)] sm:grid-cols-[96px_minmax(0,1fr)] gap-[14px] py-[13px] border-b border-stone-300 items-start">
                    <div className="flex flex-col gap-[2px] pt-[7px]">
                      <span className="font-mono text-[14px] font-medium">{week[i]}</span>
                      <span className="text-[12px] text-zinc-500">{i === 0 ? t('home.today') : i === 1 ? t('home.tomorrow') : ''}</span>
                    </div>
                    <div className="flex flex-wrap gap-[6px]">
                      {ev.map(([o, time, x], j) => (
                        <span
                          key={j}
                          className="flex gap-2 items-center max-w-full py-2 px-3 rounded-[10px] border text-[14px] font-medium"
                          style={{ background: o === 'A' ? '#FFF4EC' : '#F4F4F2', borderColor: o === 'A' ? '#FFE0C7' : '#EDEDEB' }}
                        >
                          <span className="w-[7px] h-[7px] flex-none rounded-[2px]" style={{ background: LANE[o] }} />
                          {time && <span className="font-mono text-[12px] text-zinc-600 whitespace-nowrap flex-none">{time}</span>}
                          <span className="min-w-0">{x}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {role === 'O' ? (
                <div className={`${card} flex flex-col gap-[14px]`}>
                  <div className="flex justify-between items-baseline">
                    <h2 className={h3}>{t('home.liquidity')}</h2>
                    <span className="font-mono text-[12px] text-zinc-500">{t('home.forecast')}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[48px] font-bold tracking-[-0.05em] leading-none">{d.liq}</span>
                    <span className="text-[14px] font-medium" style={{ color: d.liqC }}>{d.liqD}</span>
                  </div>
                  <div className="h-[120px]">
                    <svg viewBox={`0 0 ${Wd} ${H}`} preserveAspectRatio="none" className="w-full h-full block" aria-hidden="true">
                      <line x1={pts[3][0]} x2={pts[3][0]} y1={0} y2={H} stroke="#E4E4E1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
                      <polygon points={`0,${H} ${line} ${Wd},${H}`} fill="rgba(255,106,0,0.08)" />
                      <polyline points={line} fill="none" stroke="#0A0A0A" strokeWidth={2} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                      <circle cx={pts[mi][0]} cy={pts[mi][1]} r={4} fill="#FF6A00" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    {d.liqRows.map(([n, v, c]) => (
                      <div key={n} className="flex justify-between items-center gap-[10px] py-2 border-b border-[#F0F0EE]">
                        <span className="flex gap-[10px] items-center text-[14px] text-zinc-700">
                          <span className="w-[9px] h-[9px] rounded-[2px]" style={{ background: c }} />
                          {n}
                        </span>
                        <span className="font-mono text-[14px] font-medium" style={{ color: v < 0 ? '#DC2626' : '#0A0A0A' }}>{fmt(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={`${card} flex flex-col gap-3`}>
                  <h2 className={h3}>{t('home.myTasks')}</h2>
                  {myTasks.map((x) => (
                    <button
                      key={x.x}
                      type="button"
                      role="checkbox"
                      aria-checked={x.done}
                      onClick={x.toggle}
                      className="flex gap-3 items-center text-left py-[13px] px-[14px] rounded-[12px] bg-[#FAFAF9] border border-stone-300 cursor-pointer min-h-12"
                    >
                      <Check on={x.done} />
                      <span className="text-[15px]" style={{ color: x.done ? '#71717A' : '#0A0A0A', textDecoration: x.done ? 'line-through' : 'none' }}>{x.x}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] gap-[14px] items-start">
              <div className={`${card} flex flex-col gap-3`}>
                <div className="flex justify-between items-baseline">
                  <h2 className={h3}>{t('home.three')}</h2>
                  <span className="font-mono text-[12px] text-zinc-500 flex gap-[6px]">
                    <span>{d.todos.filter((_, i) => on('done', i)).length} / 3</span>
                    <span>{t('home.done')}</span>
                  </span>
                </div>
                {d.todos.map(([x, why, g], i) => {
                  const o = on('done', i);
                  return (
                    <button
                      key={x}
                      type="button"
                      role="checkbox"
                      aria-checked={o}
                      onClick={() => tog('done', i)}
                      className="flex gap-[14px] items-start text-left p-4 rounded-[12px] cursor-pointer border transition-[background] duration-300"
                      style={{ borderColor: o ? '#BBE5C8' : '#EDEDEB', background: o ? '#F0FAF3' : '#FAFAF9' }}
                    >
                      <Check on={o} size={22} />
                      <span className="flex flex-col gap-1 flex-1 min-w-0">
                        <span className="text-[16px] font-semibold" style={{ textDecoration: o ? 'line-through' : 'none' }}>{x}</span>
                        <span className="text-[13px] text-zinc-600">{why}</span>
                      </span>
                      <span className="font-mono text-[12px] font-medium text-orange-700 whitespace-nowrap">{g}</span>
                    </button>
                  );
                })}
                <span className="font-mono text-[10px] tracking-[0.08em] text-zinc-500">{t('home.consent')}</span>
              </div>
              <div className={`${card} flex flex-col gap-[14px]`}>
                <h2 className={h3}>{t('home.goals')}</h2>
                {d.goals.map(([n, pc, c, sub, dd], i) => (
                  <div key={n} className="flex flex-col gap-2 py-[14px] border-t border-stone-300">
                    <div className="flex justify-between items-baseline gap-[10px]">
                      <span className="text-[16px] font-semibold">{n}</span>
                      <span className="font-mono text-[14px] font-medium">{pc} %</span>
                    </div>
                    <div className="h-2 rounded-full bg-stone-300 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pc}%`, background: c }} />
                    </div>
                    <div className="flex justify-between gap-[10px] font-mono text-[11px] text-zinc-500">
                      <span>{sub}</span>
                      <span style={{ color: src.goals[i][4].includes('hinten') ? '#C2410C' : '#71717A' }}>{dd}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {vis('fin') && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] gap-[14px] items-start">
            <div className={`${card} flex flex-col gap-[14px]`}>
              <div className="flex justify-between items-baseline">
                <h2 className={h3}>{d.revL}</h2>
                <span className="font-mono text-[14px] font-medium">{d.revSum}</span>
              </div>
              <div className="h-[150px] flex items-end gap-2">
                {(() => {
                  const m = Math.max(...d.rev);
                  return d.rev.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-[6px] h-full justify-end">
                      <span className="font-mono text-[10px] text-zinc-500">
                        {v ? (v >= 1000 ? (v / 1000).toFixed(1).replace('.', en ? '.' : ',') + 'k' : String(v)) : '–'}
                      </span>
                      <div className="w-full rounded-tag" style={{ height: `${Math.max((v / m) * 78, 2)}%`, background: i === 3 ? '#FF6A00' : '#0A0A0A' }} />
                      <span className="font-mono text-[10px] text-zinc-500">{weekUpper[i].split(' ')[0]}</span>
                    </div>
                  ));
                })()}
              </div>
              <h2 className={`${h3} pt-2 border-t border-stone-300`}>{t('fin.costs')}</h2>
              {d.costs.map(([n, v, b]) => {
                const r = v / b;
                return (
                  <div key={n} className="flex flex-col gap-[6px]">
                    <div className="flex justify-between flex-wrap gap-x-3 gap-y-1 text-[15px]">
                      <span className="font-semibold">{n}</span>
                      <span className="font-mono text-[13px] whitespace-nowrap">
                        <span style={{ color: r > 1 ? '#DC2626' : '#0A0A0A' }}>{fmt(v)}</span>
                        <span className="text-zinc-400"> / {fmt(b)}</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-stone-300 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.min(r, 1) * 100}%`, background: r > 1 ? '#DC2626' : r > 0.95 ? '#FF6A00' : '#A1A1AA' }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={`${card} flex flex-col gap-[10px]`}>
              <div className="flex justify-between items-baseline">
                <h2 className={h3}>{t('fin.invoices')}</h2>
                <span className="font-mono text-[14px] font-medium text-orange-700">
                  {fmt(src.invs.reduce((a, x, i) => a + (on('inv', i) && x[3] ? 0 : parseFloat(x[2].replace(/\./g, ''))), 0))}
                </span>
              </div>
              {d.invs.map(([n, dd, a, late], i) => {
                const o = on('inv', i);
                return (
                  <div key={n} className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-3 items-center py-3 border-t border-stone-300">
                    <span className="flex flex-col gap-[2px] min-w-0">
                      <span className="text-[15px] font-semibold">{n}</span>
                      <span className="font-mono text-[11px]" style={{ color: late && !o ? '#C2410C' : '#71717A' }}>{o ? t('fin.reminded') : dd}</span>
                    </span>
                    <span className="font-mono text-[13px]">{a}</span>
                    <Pill done={o} dark={!!late} onClick={() => late && tog('inv', i)}>
                      {o ? t('fin.sent') : late ? t('fin.remind') : t('fin.view')}
                    </Pill>
                  </div>
                );
              })}
              <div className="mt-[6px] py-[14px] px-4 rounded-[12px] bg-orange-50 flex justify-between gap-3 text-[14px]">
                <span>{t('fin.vat')}</span>
                <span className="font-mono font-medium">{d.vat}</span>
              </div>
              <span className="font-mono text-[10px] tracking-[0.08em] text-zinc-500">{t('fin.export')}</span>
            </div>
          </div>
        )}

        {vis('team') && (
          <div className="flex flex-wrap gap-[14px] items-start">
            <div className={`${card} flex-[1_1_560px] min-w-0 flex flex-col gap-3 overflow-x-auto`}>
              <div className="flex justify-between items-baseline gap-[10px]">
                <h2 className={h3}>{d.rotaL}</h2>
                <span className={monoMuted}>{t('team.week')}</span>
              </div>
              <div className="grid grid-cols-[110px_repeat(7,minmax(70px,1fr))] gap-[6px] min-w-[640px]">
                <span />
                {weekUpper.map((w) => (
                  <span key={w} className="font-mono text-[11px] text-zinc-500 text-center">{w}</span>
                ))}
                {d.rota.map(([n, r, cells], ri) => (
                  <RotaRow key={n} name={n} role={r} cells={cells} sourceCells={src.rota[ri][2]} />
                ))}
              </div>
              <span className="text-[14px] text-zinc-600">{d.rotaNote}</span>
            </div>
            <div className="w-[320px] max-w-full rounded-[34px] bg-night-3 border border-line-d4 p-[11px] flex-none">
              <div className="rounded-[25px] bg-stone-50 overflow-hidden min-h-[480px] flex flex-col">
                <div className="pt-[18px] px-[18px] pb-[14px] bg-ink-2 text-white flex flex-col gap-[3px]">
                  <span className="font-mono text-[10px] tracking-[0.12em] text-orange-400">{t('team.app')}</span>
                  <span className="text-[19px] font-bold">
                    {t('team.hello')} {d.staff}
                  </span>
                  <span className="text-[13px] text-zinc-400">{d.staffShift}</span>
                </div>
                <div className="p-[14px] flex flex-col gap-2">
                  {ex.length > 0 && (
                    <div className="py-[11px] px-[13px] rounded-[12px] bg-[#FFE7D6] border border-orange-300 flex flex-col gap-[2px]">
                      <span className="font-mono text-[10px] tracking-[0.1em] text-orange-700">{t('team.newFromWeb')}</span>
                      <span className="text-[14px] font-semibold">
                        {ex[ex.length - 1].n} · {ex[ex.length - 1].x}
                      </span>
                    </div>
                  )}
                  {myTasks.map((x) => (
                    <button
                      key={x.x}
                      type="button"
                      role="checkbox"
                      aria-checked={x.done}
                      onClick={x.toggle}
                      className="flex gap-3 items-center text-left py-3 px-[13px] rounded-[12px] bg-white border border-stone-200 cursor-pointer min-h-[46px]"
                    >
                      <Check on={x.done} />
                      <span className="text-[14px]" style={{ color: x.done ? '#71717A' : '#0A0A0A', textDecoration: x.done ? 'line-through' : 'none' }}>{x.x}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {vis('kunden') && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] gap-[14px] items-start">
            <div className={`${card} flex flex-col gap-[10px]`}>
              <div className="flex justify-between items-baseline gap-3 flex-wrap">
                <h2 className={h3}>{d.reqL}</h2>
                <span className={monoMuted}>{t('kunden.channels')}</span>
              </div>
              {[
                ...ex
                  .slice()
                  .reverse()
                  .map((x, i) => ({ n: x.n, src: 'WEBSITE', x: x.x, key: 'x' + x.id, hl: i === 0 && flash })),
                ...d.reqs.map(([n, s, x], i) => ({ n, src: s, x, key: String(i), hl: false })),
              ].map((r) => {
                const o = on('rq', r.key);
                return (
                  <div
                    key={r.key}
                    className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 items-center py-3 border-t border-stone-300 transition-[background] duration-[1200ms]"
                    style={{ background: r.hl ? 'rgba(255,106,0,0.12)' : 'transparent' }}
                  >
                    <span className="flex flex-col gap-[3px] min-w-0">
                      <span className="flex gap-2 items-baseline flex-wrap">
                        <span className="text-[15px] font-semibold">{r.n}</span>
                        <span className="font-mono text-[10px] tracking-[0.06em]" style={{ color: r.src === 'WEBSITE' ? '#C2410C' : '#71717A' }}>{r.src}</span>
                      </span>
                      <span className="text-[13px] text-zinc-600">{r.x}</span>
                    </span>
                    <Pill done={o} onClick={() => tog('rq', r.key)}>
                      {o ? t('kunden.confirmed') : t('kunden.accept')}
                    </Pill>
                  </div>
                );
              })}
            </div>
            <div className={`${card} flex flex-col gap-3`}>
              <div className="flex justify-between items-baseline">
                <h2 className={h3}>{t('kunden.reviews')}</h2>
                <span className="font-mono text-[14px] font-medium">{d.rating}</span>
              </div>
              {d.reviews.map(([n, st, x, draft], i) => {
                const o = on('rv', i);
                return (
                  <div key={n} className="flex flex-col gap-2 p-[14px] rounded-[12px] bg-[#FAFAF9] border border-stone-300">
                    <div className="flex justify-between gap-[10px]">
                      <span className="text-[14px] font-semibold">{n}</span>
                      <span className="font-mono text-[12px] text-orange-700" aria-label={st.replace(/☆/g, '').length + ' / 5'}>{st}</span>
                    </div>
                    <span className="text-[14px] text-zinc-700 leading-[1.45]">{x}</span>
                    {draft && (
                      <div className="flex flex-col gap-2 p-3 rounded-[10px] bg-white border border-dashed border-orange-300">
                        <span className="font-mono text-[10px] tracking-[0.08em] text-orange-700">{t('kunden.draft')}</span>
                        <span className="text-[13px] text-zinc-700 leading-[1.45]">{draft}</span>
                        <div className="self-end">
                          <Pill done={o} onClick={() => tog('rv', i)}>
                            {o ? t('kunden.published') : t('kunden.send')}
                          </Pill>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {vis('lager') && (
          <div className={`${card} flex flex-col gap-[6px] max-w-[900px]`}>
            <div className="flex justify-between items-baseline pb-2 gap-3 flex-wrap">
              <h2 className={h3}>{d.stockL}</h2>
              <span className={monoMuted}>{t('lager.range')}</span>
            </div>
            {d.stock.map(([n, dd, w, c, low], i) => {
              const o = on('st', i);
              return (
                <div key={n} className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] gap-4 items-center py-3 border-t border-stone-300">
                  <span className="flex flex-col gap-[2px] min-w-0">
                    <span className="text-[15px] font-semibold">{n}</span>
                    <span className="font-mono text-[11px]" style={{ color: low && !o ? '#C2410C' : '#71717A' }}>{o ? t('lager.ordered') : dd}</span>
                  </span>
                  <div className="h-2 rounded-full bg-stone-300 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${o ? 100 : +w}%`, background: o ? '#22A355' : c }} />
                  </div>
                  <span style={{ visibility: low ? 'visible' : 'hidden' }}>
                    <Pill done={o} onClick={() => tog('st', i)}>
                      {o ? t('lager.orderedBtn') : t('lager.order')}
                    </Pill>
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {vis('web') && (
          <div className="rounded-card border border-stone-200 overflow-hidden bg-white">
            <div className="flex gap-[10px] items-center py-[10px] px-[14px] bg-night-3">
              <span className="flex gap-[6px]" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-[10px] h-[10px] rounded-full bg-line-d5" />
                ))}
              </span>
              <span className="flex-1 max-w-[420px] mx-auto py-[6px] px-3 rounded-[8px] bg-ink-2 font-mono text-[11px] text-zinc-400 text-center">{d.url}</span>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))]">
              <div className="py-10 px-9 flex flex-col gap-[14px] bg-[#F4F1EC]">
                <span className="font-mono text-[11px] tracking-[0.12em] text-orange-700">{d.city}</span>
                <span className="text-[clamp(30px,3.6vw,44px)] font-bold tracking-[-0.04em] leading-none">{d.brand}</span>
                <span className="text-[16px] leading-[1.55] text-zinc-600">{d.claim}</span>
                <div className="flex flex-wrap gap-2">
                  {d.facts.map((f) => (
                    <span key={f} className="text-[13px] py-[7px] px-3 rounded-full border border-[#D9D3C9] whitespace-nowrap">{f}</span>
                  ))}
                </div>
              </div>
              <form
                className="py-8 px-9 flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
              >
                <span className="text-[20px] font-bold">{d.form}</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('web.name')}
                  aria-label={t('web.name')}
                  className="py-[14px] px-4 rounded-[10px] border border-stone-200 text-[15px] outline-none focus:border-zinc-500"
                />
                <div className="flex gap-[6px] flex-wrap" role="group" aria-label={d.form}>
                  {d.slots.map((x, i) => (
                    <button
                      key={x}
                      type="button"
                      aria-pressed={slot === i}
                      onClick={() => setSlot(i)}
                      className="font-mono text-[12px] py-[10px] px-[14px] rounded-full cursor-pointer whitespace-nowrap border"
                      style={{ background: slot === i ? '#0A0A0A' : '#fff', color: slot === i ? '#fff' : '#0A0A0A', borderColor: slot === i ? '#0A0A0A' : '#E4E4E1' }}
                    >
                      {x}
                    </button>
                  ))}
                </div>
                <button type="submit" className="p-[15px] rounded-full bg-ink text-white text-[15px] font-semibold cursor-pointer">
                  {d.cta}
                </button>
                {sent && (
                  <div role="status" className="py-3 px-[14px] rounded-[10px] bg-success-bg text-success-ink text-[14px] flex justify-between gap-[10px] items-center">
                    <span>{t('web.sent')}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setNav('kunden');
                        setSent(false);
                      }}
                      className="font-mono text-[11px] py-[7px] px-[11px] rounded-full border border-success-dark text-success-ink cursor-pointer whitespace-nowrap"
                    >
                      {t('web.view')}
                    </button>
                  </div>
                )}
                <span className="font-mono text-[10px] tracking-[0.08em] text-zinc-500 pt-[6px]">{t('web.hint')}</span>
              </form>
            </div>
          </div>
        )}

        {vis('what') && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] gap-[14px] items-start">
            <div className={`${card} flex flex-col gap-3`}>
              <h2 className={h3}>{t('what.title')}</h2>
              <span className="text-[14px] text-zinc-600">{t('what.lead')}</span>
              {d.sl.map((sl, k) => (
                <div key={sl.n} className="flex flex-col gap-2 py-3 border-t border-stone-300">
                  <label htmlFor={`wi-${k}`} className="flex justify-between gap-[10px] text-[15px]">
                    <span className="font-semibold">{sl.n}</span>
                    <span className="font-mono text-[13px] text-orange-700 whitespace-nowrap">{unitLabel(SLIDER_UNIT[ind][k], wv(k))}</span>
                  </label>
                  <input
                    id={`wi-${k}`}
                    type="range"
                    min={sl.min}
                    max={sl.max}
                    step={sl.step}
                    value={wv(k)}
                    onChange={(e) => {
                      const x = +e.target.value;
                      setWi((s) => ({ ...s, [K + k]: x }));
                    }}
                    className="w-full accent-orange-500 min-h-6"
                  />
                </div>
              ))}
            </div>
            <div className="p-6 rounded-card bg-ink-2 text-stone-50 flex flex-col gap-4" aria-live="polite">
              <span className="font-mono text-[11px] tracking-[0.12em] text-orange-400">{t('what.result')}</span>
              <div className="flex flex-col gap-1">
                <span className="text-[14px] text-zinc-400">{t('what.profitMonth')}</span>
                <span className="text-[40px] font-bold tracking-[-0.04em]">{fmt(P)}</span>
                <span className="font-mono text-[12px]" style={{ color: dP >= 0 ? '#86EFAC' : '#FCA5A5' }}>
                  {(dP >= 0 ? '+' : '') + fmt(dP)} {t('what.vsToday')}
                </span>
              </div>
              {[
                [t('what.profitYear'), fmt(P * 12), '#F5F5F4'],
                [d.goals[1][0], goalMonth, dP > 0 ? '#FF9A50' : '#F5F5F4'],
                [t('what.liq90'), fmt(ser[ser.length - 1] * 1000 + dP * 3), '#F5F5F4'],
              ].map(([n, v, c]) => (
                <div key={n} className="flex justify-between gap-[10px] py-3 border-t border-line-d3 text-[15px]">
                  <span>{n}</span>
                  <span className="font-mono font-medium" style={{ color: c }}>{v}</span>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setWi((s) => {
                    const w = { ...s };
                    d.sl.forEach((_, k) => delete w[K + k]);
                    return w;
                  })
                }
                className="self-start font-mono text-[11px] py-[9px] px-[13px] rounded-full border border-line-d4 text-zinc-400 cursor-pointer whitespace-nowrap"
              >
                {t('what.reset')}
              </button>
            </div>
          </div>
        )}

        {vis('data') && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] gap-[14px] items-start">
            <div className={`${card} flex flex-col gap-[6px]`}>
              <div className="flex justify-between items-baseline pb-[6px]">
                <h2 className={h3}>{t('data.sources')}</h2>
                <span className={monoMuted}>
                  {d.srcs.filter((_, i) => srcOn(i)).length} {t('data.onOf')}
                </span>
              </div>
              {d.srcs.map(([n, dd], i) => {
                const o = srcOn(i);
                return (
                  <div key={n} className="flex justify-between items-center gap-3 py-3 border-t border-stone-300">
                    <span className="flex flex-col gap-[2px]">
                      <span className="text-[15px] font-semibold">{n}</span>
                      <span className="text-[12px] text-zinc-500">{dd}</span>
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={o}
                      aria-label={n}
                      onClick={() => setFlags((s) => ({ ...s, [`src:${K}${i}`]: !o }))}
                      className="w-[46px] h-[26px] flex-none rounded-full p-[3px] cursor-pointer flex"
                      style={{ background: o ? '#FF6A00' : '#D4D4D8', justifyContent: o ? 'flex-end' : 'flex-start' }}
                    >
                      <span className="w-5 h-5 rounded-full bg-white" />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className={`${card} flex flex-col gap-3`}>
              <h2 className={h3}>{t('data.roles')}</h2>
              {(
                [
                  [`${t('data.ownerPrefix')} ${d.owner[1]}`, [['all', 1]]],
                  [
                    `${t('data.leadPrefix')} ${d.lead[1]}`,
                    [
                      ['home', 1],
                      ['team', 1],
                      ['kunden', 1],
                      ['lager', 1],
                      ['web', 1],
                      ['fin', 0],
                    ],
                  ],
                  [
                    t('data.teamLabel'),
                    [
                      ['shifts', 1],
                      ['tasks', 1],
                      ['requests', 1],
                      ['fin', 0],
                      ['lager', 0],
                    ],
                  ],
                ] as [string, [string, number][]][]
              ).map(([n, items]) => (
                <div key={n} className="flex flex-col gap-[6px] py-3 border-t border-stone-300">
                  <span className="text-[15px] font-semibold">{n}</span>
                  <div className="flex flex-wrap gap-[6px]">
                    {items.map(([x, ok]) => (
                      <span
                        key={x}
                        className="text-[12px] py-[5px] px-[10px] rounded-full"
                        style={{ background: ok ? '#E8F7EE' : '#F4F4F2', color: ok ? '#14532D' : '#71717A' }}
                      >
                        {ok ? '✓ ' : '✕ '}
                        {t(`data.perm.${x}`)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <span className="font-mono text-[10px] tracking-[0.08em] text-zinc-500">{t('data.footer')}</span>
            </div>
          </div>
        )}
      </main>

      {ask && (
        <div
          className="fixed inset-0 bg-[rgba(11,11,12,0.55)] flex items-start justify-center pt-[12vh] px-5 pb-5 z-20"
          onClick={() => {
            setAsk(false);
            setOpen(-1);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t('ask')}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[620px] rounded-card-md bg-white shadow-[0_30px_80px_rgba(0,0,0,0.35)] overflow-hidden"
          >
            <div className="flex gap-3 items-center py-4 px-[18px] border-b border-stone-300">
              <span className="font-mono text-[10px] font-medium tracking-[0.1em] bg-orange-500 text-white rounded-tag py-[3px] px-[7px]">{tc('ai')}</span>
              <input
                ref={askInput}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('askBox.placeholder')}
                aria-label={t('askBox.placeholder')}
                className="flex-1 border-none outline-none text-[17px] bg-transparent"
              />
              <button
                type="button"
                onClick={() => {
                  setAsk(false);
                  setOpen(-1);
                }}
                aria-label={ta('close')}
                className="font-mono text-[10px] text-zinc-500 cursor-pointer py-2"
              >
                {t('askBox.esc')}
              </button>
            </div>
            <div className="p-[10px]">
              {sugg.map((s) => (
                <button
                  key={s.q}
                  type="button"
                  aria-expanded={open === s.i}
                  onClick={() => setOpen(open === s.i ? -1 : s.i)}
                  className="w-full flex flex-col gap-[6px] text-left py-3 px-[14px] rounded-[12px] cursor-pointer hover:bg-stone-100"
                  style={{ background: open === s.i ? '#F4F4F2' : undefined }}
                >
                  <span className="text-[15px] font-semibold">{s.q}</span>
                  {open === s.i && (
                    <>
                      <span className="text-[14px] leading-[1.5] text-zinc-700">{s.a}</span>
                      <span className="font-mono text-[10px] tracking-[0.06em] text-zinc-500">
                        {t('askBox.sources')} {s.s}
                      </span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** One person's week in the rota. Colours come from the German source so they match in every language. */
function RotaRow({ name, role, cells, sourceCells }: { name: string; role: string; cells: string[]; sourceCells: string[] }) {
  return (
    <>
      <span className="flex flex-col gap-px self-center">
        <span className="text-[14px] font-semibold">{name}</span>
        <span className="text-[11px] text-zinc-500">{role}</span>
      </span>
      {cells.map((x, i) => {
        const s = sourceCells[i];
        const free = s === 'Frei';
        const nd = /Notdienst|Nacht/.test(s);
        const sch = /Berufsschule/.test(s);
        const warm = /A$|Nord|Spät|Früh$/.test(s) && !/B$/.test(s);
        const bg = free ? '#E8F7EE' : nd ? '#27272A' : sch ? '#EDEDEB' : warm ? '#FFE7D6' : '#F4F4F2';
        const fg = nd ? '#fff' : free ? '#14532D' : '#0A0A0A';
        return (
          <div key={i} className="h-[54px] rounded-[10px] flex flex-col items-center justify-center gap-[2px] text-[12px] font-semibold text-center p-1" style={{ background: bg, color: fg }}>
            <span>{x}</span>
          </div>
        );
      })}
    </>
  );
}
