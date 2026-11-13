'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { startAreaEvent } from '@/lib/analytics';

// Same six colors as the particle field in the Build hero. `level` follows the area picker on the pricing page.
const AREAS = [
  { name: 'Build.mapCustomers', color: '#FB923C', level: 0 },
  { name: 'Build.mapSales', color: '#61CC80', level: 1 },
  { name: 'Build.mapTeam', color: '#54B0E6', level: 1 },
  { name: 'Build.mapOperations', color: '#9E8CF2', level: 1 },
  { name: 'Build.mapFinance', color: '#E0B842', level: 2 },
  { name: 'Build.mapMarketing', color: '#EB7AAB', level: 2 },
];
const PLANS = [
  { name: 'Core', price: 'Build.mapCorePrice' },
  { name: 'Growth', price: 'Build.mapGrowthPrice' },
  { name: 'Build.mapWhole', price: 'Build.mapWholePrice' },
];
// Until someone taps, the map walks through one area per plan on its own.
const DEMO = [0, 2, 4];
const DEMO_HOLD_MS = 7000;
const GROW_S = 1.8;

type Pt = [number, number];
type Path = { pts: Pt[]; cum: number[]; total: number };
type Pulse = { k: number; d: number; speed: number };

const toPath = (pts: Pt[]): Path => {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, cum, total: cum[cum.length - 1] };
};
const pointAt = (p: Path, d: number): Pt => {
  const x = Math.max(0, Math.min(p.total, d));
  let i = 1;
  while (i < p.cum.length - 1 && p.cum[i] < x) i++;
  const f = (x - p.cum[i - 1]) / (p.cum[i] - p.cum[i - 1] || 1),
    a = p.pts[i - 1],
    b = p.pts[i];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
};
const trace = (c: CanvasRenderingContext2D, p: Path, from: number, to: number) => {
  const start = pointAt(p, from);
  c.beginPath();
  c.moveTo(start[0], start[1]);
  for (let i = 1; i < p.pts.length; i++) if (p.cum[i] > from && p.cum[i] < to) c.lineTo(p.pts[i][0], p.pts[i][1]);
  const end = pointAt(p, to);
  c.lineTo(end[0], end[1]);
  c.stroke();
};
const glow = (color: string) => {
  const s = document.createElement('canvas');
  s.width = s.height = 48;
  const c = s.getContext('2d')!,
    g = c.createRadialGradient(24, 24, 0, 24, 24, 24);
  g.addColorStop(0, '#FFFFFF');
  g.addColorStop(0.18, color);
  g.addColorStop(0.5, `${color}44`);
  g.addColorStop(1, `${color}00`);
  c.fillStyle = g;
  c.fillRect(0, 0, 48, 48);
  return s;
};
const ease = (x: number) => x * x * (3 - 2 * x);

const CSS = `
.bt-panel{position:relative;border:1px solid #341919;border-radius:22px;background:#190B0B;overflow:hidden}
.bt-panel::before{content:"";position:absolute;left:50%;top:0;width:min(1100px,130%);height:440px;transform:translateX(-50%);background:radial-gradient(closest-side at 32% 50%,rgba(84,176,230,.12),transparent),radial-gradient(closest-side at 68% 45%,rgba(158,140,242,.12),transparent),radial-gradient(closest-side at 50% 72%,rgba(251,146,60,.1),transparent);filter:blur(34px);pointer-events:none;animation:btAurora 24s ease-in-out infinite alternate}
.bt-tree{position:relative;padding:clamp(30px,3.8vw,52px) clamp(14px,2.4vw,32px) clamp(26px,3vw,40px)}
.bt-canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.bt-brain{position:relative;display:flex;align-items:center;justify-content:center;width:88px;height:88px;margin:0 auto;border-radius:50%;background:radial-gradient(circle at 50% 35%,#2E1516,#1e0d0e 72%);color:#FFF7ED;font-size:30px;animation:btBreath 7s ease-in-out infinite}
.bt-brain::before{content:"";position:absolute;inset:-2px;border-radius:50%;padding:2px;background:conic-gradient(#FB923C,#61CC80,#54B0E6,#9E8CF2,#E0B842,#EB7AAB,#FB923C);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:btSpin 26s linear infinite}
.bt-brain>b{position:absolute;left:calc(100% + 24px);top:50%;transform:translateY(-50%);white-space:nowrap;font-size:17px;font-weight:500;letter-spacing:-0.02em}
.bt-grid{position:relative;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:16px;margin-top:64px}
.bt-area{--soft:color-mix(in srgb,var(--c) 55%,transparent);display:flex;flex-direction:column;align-items:center;gap:12px;min-width:0;padding:0;border:none;background:none;cursor:pointer;font:500 16px var(--font-sans);letter-spacing:-0.02em;color:#78625A;transition:color .9s}
.bt-node{display:flex;align-items:center;justify-content:center;width:60px;height:60px;border-radius:50%;border:1.5px solid #4F2C2C;background:#1B0C0D;color:#67393B;font-size:20px;transition:border-color .9s,color .9s,box-shadow .9s,transform .5s}
.bt-area:hover .bt-node{transform:translateY(-3px);border-color:var(--c)}
.bt-area:focus-visible{outline:none}
.bt-area:focus-visible .bt-node{outline:2px solid #FFF7ED;outline-offset:3px}
.bt-area[data-state="in"]{color:#CBB7A8}
.bt-area[data-state="in"] .bt-node{border-color:var(--soft);color:var(--soft)}
.bt-area[data-state="on"]{color:#FFF7ED}
.bt-area[data-state="on"] .bt-node{border-color:var(--c);color:var(--c);box-shadow:0 0 34px color-mix(in srgb,var(--c) 34%,transparent),inset 0 0 18px color-mix(in srgb,var(--c) 16%,transparent)}
.bt-detail{position:relative;display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);border-top:1px solid #2A1315}
.bt-tasks,.bt-plan{display:flex;flex-direction:column;gap:14px;min-width:0;padding:clamp(18px,2.2vw,28px) clamp(16px,2.4vw,32px);animation:btIn .9s ease both}
.bt-plan{border-left:1px solid #2A1315}
.bt-kicker{font:400 11px var(--font-mono);letter-spacing:.08em;text-transform:uppercase;color:#927A6D}
.bt-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.bt-task{display:flex;align-items:center;box-sizing:border-box;min-height:56px;padding:10px 14px;border-radius:12px;border:1px solid color-mix(in srgb,var(--c) 40%,transparent);background:color-mix(in srgb,var(--c) 9%,#1B0C0D);font-size:14px;line-height:1.25;color:#FFF7ED;animation:btIn .9s ease both}
.bt-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:auto}
.bt-actions a{border-radius:999px;padding:12px 20px;font:600 14px var(--font-sans);white-space:nowrap}
@keyframes btSpin{to{transform:rotate(360deg)}}
@keyframes btBreath{50%{box-shadow:0 0 0 14px rgba(244,233,220,.035),0 0 70px rgba(158,140,242,.26),0 0 100px rgba(251,146,60,.18)}}
@keyframes btAurora{from{transform:translateX(-53%) scale(1)}to{transform:translateX(-47%) scale(1.1)}}
@keyframes btIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@media (max-width:1099px){
  .bt-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:30px 16px;margin-top:56px}
  .bt-detail{grid-template-columns:minmax(0,1fr)}
  .bt-plan{border-left:none;border-top:1px solid #2A1315}
}
@media (max-width:560px){
  .bt-list{grid-template-columns:minmax(0,1fr)}
  .bt-task{min-height:44px}
  .bt-actions a{flex:1;text-align:center}
}
@media (prefers-reduced-motion:reduce){
  .bt-panel::before,.bt-brain,.bt-brain::before,.bt-tasks,.bt-plan,.bt-task{animation:none}
}
`;

export default function BrainRollout({ t, contactHref, pricingHref }: { t: (key: string) => string; contactHref: string; pricingHref: string }) {
  const [picked, setPicked] = useState<number[]>([0]);
  const [demo, setDemo] = useState(true);
  const [inView, setInView] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const treeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{ included: boolean[]; picked: number[] }>({ included: [], picked: [] });

  const plan = picked.length ? Math.max(...picked.map((k) => AREAS[k].level)) : -1;
  const included = AREAS.map((a) => a.level <= plan);
  const focus = picked[picked.length - 1];
  useEffect(() => {
    stateRef.current = { included, picked };
  });

  const tap = (k: number) => {
    startAreaEvent(AREAS[k].name.replace('Build.map', '').toLowerCase());
    setPicked((p) => (demo ? [k] : p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));
    setDemo(false);
  };

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!demo || !inView || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setTimeout(() => setPicked((p) => [DEMO[(DEMO.indexOf(p[0]) + 1) % DEMO.length]]), DEMO_HOLD_MS);
    return () => clearTimeout(id);
  }, [demo, inView, picked]);

  useEffect(() => {
    const canvas = canvasRef.current,
      tree = treeRef.current;
    const ctx = canvas?.getContext('2d');
    if (!inView || !canvas || !tree || !ctx) return;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sprites = AREAS.map((a) => glow(a.color));
    const progress: number[] = AREAS.map(() => (still ? 1 : 0));
    let paths: Path[] = [];
    let nodes: HTMLElement[] = [];
    let pulses: Pulse[] = [];
    let nextPulse = 0,
      now = 0,
      raf = 0,
      last = performance.now();

    const measure = () => {
      const box = tree.getBoundingClientRect(),
        dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = box.width * dpr;
      canvas.height = box.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const brain = tree.querySelector('.bt-brain')!.getBoundingClientRect(),
        cx = brain.left + brain.width / 2 - box.left,
        by = brain.bottom - box.top;
      nodes = [...tree.querySelectorAll<HTMLElement>('.bt-node')];
      paths = nodes.map((n) => {
        const r = n.getBoundingClientRect(),
          x = r.left + r.width / 2 - box.left,
          y = r.top - box.top,
          bus = y - 28;
        return toPath([[cx, by], [cx, bus], [x, bus], [x, y]]);
      });
    };

    const frame = (time: number) => {
      const dt = Math.min(50, time - last) / 1000,
        { included: live, picked: chosen } = stateRef.current;
      last = time;
      now += dt * 1000;
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#462324';
      paths.forEach((p) => trace(ctx, p, 0, p.total));
      paths.forEach((p, k) => {
        const target = live[k] ? 1 : 0;
        progress[k] = still ? target : Math.max(0, Math.min(1, progress[k] + (dt / GROW_S) * (target ? 1 : -2.2)));
        if (progress[k] <= 0) return;
        ctx.strokeStyle = AREAS[k].color;
        ctx.lineWidth = chosen.includes(k) ? 1.5 : 1;
        ctx.globalAlpha = chosen.includes(k) ? 0.85 : 0.38;
        const tip = p.total * ease(progress[k]);
        trace(ctx, p, 0, tip);
        if (progress[k] < 1 && target) {
          const [x, y] = pointAt(p, tip);
          ctx.globalAlpha = 1;
          ctx.drawImage(sprites[k], x - 14, y - 14, 28, 28);
        }
      });
      if (!still) {
        // A few slow currents, weighted towards what the visitor picked.
        if (now >= nextPulse) {
          const open = AREAS.map((_, k) => k).filter((k) => live[k] && progress[k] >= 1);
          const pool = [...open, ...open.filter((k) => chosen.includes(k)), ...open.filter((k) => chosen.includes(k))];
          if (pool.length && pulses.length < 5) pulses.push({ k: pool[(Math.random() * pool.length) | 0], d: 0, speed: 85 + Math.random() * 45 });
          nextPulse = now + 800 + Math.random() * 1300;
        }
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';
        pulses = pulses.filter((u) => {
          const p = paths[u.k];
          if (!p || !live[u.k]) return false;
          u.d += u.speed * dt;
          ctx.strokeStyle = AREAS[u.k].color;
          ctx.lineWidth = 1.6;
          const steps = 14;
          for (let i = 0; i < steps; i++) {
            const a = Math.min(p.total, u.d - i * 6),
              z = a - 6;
            if (z < 0) break;
            ctx.globalAlpha = (1 - i / steps) ** 2;
            trace(ctx, p, z, a);
          }
          if (u.d <= p.total) {
            const [x, y] = pointAt(p, u.d);
            ctx.globalAlpha = 0.9;
            ctx.drawImage(sprites[u.k], x - 12, y - 12, 24, 24);
          } else if (u.d - p.total < u.speed * dt) {
            const color = AREAS[u.k].color;
            nodes[u.k]?.animate(
              [{ boxShadow: `0 0 46px ${color}88` }, { boxShadow: `0 0 0 ${color}00` }],
              { duration: 1400, easing: 'ease-out' },
            );
          }
          return u.d - steps * 6 < p.total;
        });
      }
      raf = requestAnimationFrame(frame);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(tree);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [inView]);

  return (
    <div data-screen-label="06 Starting point" style={{ padding: '140px clamp(20px,3vw,40px) 0', maxWidth: '1480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,440px),1fr))', gap: '40px', alignItems: 'end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#927A6D' }}>
            {'(06) '}
            <span style={{ color: '#FFF7ED' }}>{t('Build.mapLabel')}</span>
          </div>
          <h2 style={{ margin: '0', fontSize: 'clamp(31px,3.8vw,56px)', lineHeight: '1', letterSpacing: '-0.045em', fontWeight: '600', textWrap: 'balance' }}>
            {t('Build.mapHeadline')}{' '}
            <span style={{ color: '#F97316' }}>{t('Build.mapHeadlineAccent')}</span>
          </h2>
        </div>
        <p style={{ margin: '0', fontSize: '17px', lineHeight: '1.55', color: '#CBB7A8', maxWidth: '520px' }}>{t('Build.mapBody')}</p>
      </div>
      <div ref={panelRef} className="bt-panel">
        <div ref={treeRef} className="bt-tree">
          <canvas ref={canvasRef} className="bt-canvas" aria-hidden="true" />
          <div className="bt-brain">
            <span aria-hidden="true">✳</span>
            <b>{t('Build.mapYourBrain')}</b>
          </div>
          <div className="bt-grid">
            {AREAS.map((a, k) => (
              <button key={a.name} className="bt-area" style={{ '--c': a.color } as CSSProperties} aria-pressed={!demo && picked.includes(k)} data-state={picked.includes(k) ? 'on' : included[k] ? 'in' : 'off'} onClick={() => tap(k)}>
                <span className="bt-node" aria-hidden="true">✳</span>
                {t(a.name)}
              </button>
            ))}
          </div>
        </div>
        <div className="bt-detail" aria-live="polite">
          {plan < 0 ? (
            <div className="bt-tasks"><span style={{ fontSize: '16px', color: '#CBB7A8' }}>{t('Build.mapPickPrompt')}</span></div>
          ) : (
            <>
              <div key={focus} className="bt-tasks" style={{ '--c': AREAS[focus].color } as CSSProperties}>
                <span className="bt-kicker">
                  {demo ? `${t('Build.mapExample')} · ` : ''}{t(AREAS[focus].name)} · {t('Build.mapTasksIn')}
                </span>
                <div className="bt-list">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="bt-task" style={{ animationDelay: `${i * 140}ms` }}>{t(`Build.mapT${focus}${i}`)}</span>
                  ))}
                </div>
              </div>
              <div key={`plan${plan}`} className="bt-plan">
                <span className="bt-kicker">{t('Build.mapStartWith')}</span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <b style={{ fontSize: '26px', fontWeight: '600', letterSpacing: '-0.03em' }}>{PLANS[plan].name.startsWith('Build.') ? t(PLANS[plan].name) : PLANS[plan].name}</b>
                  <span style={{ fontSize: '14px', color: '#CBB7A8' }}>{t(PLANS[plan].price)}</span>
                  <span style={{ fontSize: '12px', lineHeight: '1.4', color: '#927A6D' }}>{t('Build.mapIllustrative')}</span>
                </span>
                <div className="bt-actions">
                  <a href={contactHref} style={{ background: '#F97316', color: '#17090A' }}>{t('Build.mapCta')}</a>
                  <a href={pricingHref} style={{ border: '1px solid #4F2C2C', color: '#FFF7ED', fontWeight: '500' }}>{t('Build.mapPrices')}</a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
