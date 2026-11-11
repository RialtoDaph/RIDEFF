"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import dynamic from "next/dynamic";
import { reducedMotion } from "@/lib/motion";

// WebGL only loads when the section is near the screen, and never on the server.
const PlatformScene = dynamic(() => import("./PlatformScene"), { ssr: false });

type T = (key: string, values?: Record<string, string | number>) => string;

// Same six colours as the area map on the Build page.
const AREAS = [
  {
    name: "Home.customers",
    desc: "Home.inquiriesAnsweredBookingsConfirmed",
    color: "#FF9E47",
  },
  {
    name: "Home.sales",
    desc: "Home.offersDraftedFollowUpsSent",
    color: "#61CC80",
  },
  { name: "Home.team", desc: "Home.shiftsTasksCheckIns", color: "#54B0E6" },
  {
    name: "Home.operations",
    desc: "Home.ordersStockSuppliers",
    color: "#9E8CF2",
  },
  {
    name: "Home.finance",
    desc: "Home.invoicesPaymentsReminders",
    color: "#E0B842",
  },
  {
    name: "Home.marketing",
    desc: "Home.postsNewslettersReviews",
    color: "#EB7AAB",
  },
];
const COLORS = AREAS.map((a) => a.color);

// Core connects one area, Growth four, the whole system all six (as on the pricing page).
const PLANS = [
  { name: "Core", on: 1, price: "Home.core149Mo" },
  { name: "Growth", on: 4, price: "Home.growth249Mo" },
  { name: "Home.wholeSystem", on: 6, price: "Home.wholeSystem449Mo" },
];
const REASONS = ["Connects", "Grows", "Yours"];
const LEGEND = [
  { key: "Home.platformLegendBase", color: "#3A3A3C" },
  { key: "Home.platformLegendAi", color: "#FF6A00" },
  { key: "Home.platformLegendAreas", color: "#54B0E6" },
];

const subscribeMotion = (cb: () => void) => {
  const mq = matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

const CSS = `
.pf-wrap{background:#0B0B0C;color:#F4F4F2}
.pf-in{max-width:1480px;margin:0 auto;padding:clamp(88px,10vw,140px) clamp(20px,3vw,40px);display:flex;flex-direction:column;gap:clamp(36px,4vw,56px)}
.pf-head{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:40px;align-items:end}
.pf-label{font:400 12px var(--font-mono);color:#FF6A00}
.pf-h2{margin:0;font-size:clamp(31px,3.8vw,56px);line-height:1;letter-spacing:-0.045em;font-weight:600;text-wrap:balance}
.pf-body{margin:0;font-size:17px;line-height:1.55;color:#B8B3AA;max-width:500px}
.pf-main{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:clamp(24px,3vw,48px);align-items:stretch}
.pf-stage{position:relative;min-height:clamp(340px,40vw,560px);border:1px solid #1F1F21;border-radius:24px;overflow:hidden;background:radial-gradient(ellipse at 50% 62%,#17120E 0%,#0C0C0D 68%)}
.pf-plans{position:absolute;left:16px;top:16px;z-index:2;display:flex;gap:4px;padding:4px;border-radius:999px;background:rgba(28,28,30,.9);backdrop-filter:blur(8px)}
.pf-plans button{border:none;cursor:pointer;border-radius:999px;padding:9px 18px;font:500 14px var(--font-sans);background:transparent;color:#B8B3AA;transition:background .3s,color .3s}
.pf-plans button[aria-pressed="true"]{background:#FF6A00;color:#0A0A0A}
.pf-col{display:flex;flex-direction:column;gap:14px;min-width:0}
.pf-stage{flex:1}
.pf-legend{display:flex;padding:0 4px;gap:6px 18px;flex-wrap:wrap;font:400 11px var(--font-mono);letter-spacing:.04em;color:#8C877E}
.pf-legend span{display:flex;align-items:center;gap:7px}
.pf-legend i{width:8px;height:8px;border-radius:2px;flex-shrink:0}
.pf-reasons{display:flex;flex-direction:column;justify-content:center}
.pf-reason{display:grid;grid-template-columns:34px minmax(0,1fr);gap:4px 14px;padding:22px 0;border-top:1px solid #232325}
.pf-reason:last-child{border-bottom:1px solid #232325}
.pf-reason i{font:400 12px var(--font-mono);font-style:normal;color:#FF6A00;padding-top:6px}
.pf-reason b{font-size:clamp(20px,1.9vw,26px);font-weight:600;letter-spacing:-0.03em}
.pf-reason p{grid-column:2;margin:0;font-size:15px;line-height:1.5;color:#B8B3AA}
.pf-areas{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px}
.pf-area{--c:#fff;display:flex;flex-direction:column;gap:6px;min-width:0;padding:14px 16px;border-radius:14px;border:1px solid #232325;background:#101011;transition:border-color .5s,background .5s,opacity .5s;opacity:.55}
.pf-area[data-on="1"]{opacity:1;border-color:color-mix(in srgb,var(--c) 45%,transparent);background:color-mix(in srgb,var(--c) 7%,#101011)}
.pf-area b{display:flex;align-items:center;gap:8px;font-size:16px;font-weight:600;letter-spacing:-0.02em}
.pf-area b::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--c);flex-shrink:0}
.pf-area span{font-size:13px;line-height:1.35;color:#B8B3AA}
.pf-area em{font:400 10px var(--font-mono);font-style:normal;letter-spacing:.08em;text-transform:uppercase;color:#6B675F;margin-top:auto;padding-top:4px}
.pf-area[data-on="1"] em{color:var(--c)}
.pf-foot{display:flex;justify-content:space-between;gap:12px 20px;flex-wrap:wrap;font:400 12px var(--font-mono);color:#8C877E}
.pf-foot b{color:#F4F4F2}
@media (max-width:1099px){
  .pf-main{grid-template-columns:minmax(0,1fr)}
  .pf-areas{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (max-width:640px){
  .pf-areas{grid-template-columns:repeat(2,minmax(0,1fr))}
  .pf-stage{min-height:300px}
  .pf-legend{font-size:10px}
  .pf-plans button{padding:8px 13px;font-size:13px}
}
`;

/**
 * Home, right after the hero: why a business should have its own platform
 * rather than six rented tools, shown as the thing itself.
 */
export default function PlatformSection({ t }: { t: T }) {
  const [plan, setPlan] = useState(1);
  const [focus, setFocus] = useState(-1);
  const [near, setNear] = useState(false);
  const [seen, setSeen] = useState(false);
  // Reduced motion: the scene is drawn docked and still.
  const still = useSyncExternalStore(
    subscribeMotion,
    reducedMotion,
    () => false,
  );
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    // Load a screen early; start (and later pause) the animation with visibility.
    const load = new IntersectionObserver(
      ([e]) => e.isIntersecting && setNear(true),
      { rootMargin: "100% 0px" },
    );
    const play = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), {
      threshold: 0.25,
    });
    load.observe(el);
    play.observe(el);
    return () => {
      load.disconnect();
      play.disconnect();
    };
  }, []);

  const on = PLANS[plan].on;
  const name = (p: (typeof PLANS)[number]) =>
    p.name.startsWith("Home.") ? t(p.name) : p.name;

  return (
    <div id="platform" data-screen-label="01 Platform" className="pf-wrap">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pf-in">
        <div className="pf-head">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div className="pf-label" data-rv="0">
              {t("Home.platformLabel")}
            </div>
            <h2 className="pf-h2">
              {t("Home.platformHeadline")}{" "}
              <span style={{ color: "#FF6A00" }}>
                {t("Home.platformHeadlineAccent")}
              </span>
            </h2>
          </div>
          <p className="pf-body">{t("Home.platformBody")}</p>
        </div>

        <div className="pf-main">
          <div className="pf-col">
            <div ref={stage} className="pf-stage">
              <div
                className="pf-plans"
                role="group"
                aria-label={t("Home.platformPlanPicker")}
              >
                {PLANS.map((p, k) => (
                  <button
                    key={p.name}
                    aria-pressed={k === plan}
                    onClick={() => setPlan(k)}
                  >
                    {name(p)}
                  </button>
                ))}
              </div>
              {near ? (
                <PlatformScene
                  colors={COLORS}
                  on={seen || still ? on : 0}
                  focus={focus}
                  running={seen && !still}
                  still={still}
                />
              ) : null}
            </div>
            <div className="pf-legend">
              {LEGEND.map((l) => (
                <span key={l.key}>
                  <i style={{ background: l.color }} />
                  {t(l.key)}
                </span>
              ))}
            </div>
          </div>
          <div className="pf-reasons" data-rv="80">
            {REASONS.map((r, k) => (
              <div key={r} className="pf-reason">
                <i>{`0${k + 1}`}</i>
                <b>{t(`Home.platform${r}`)}</b>
                <p>{t(`Home.platform${r}Body`)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pf-areas" aria-live="polite">
          {AREAS.map((a, k) => (
            <div
              key={a.name}
              className="pf-area"
              data-on={k < on ? "1" : "0"}
              style={{ "--c": a.color } as CSSProperties}
              onMouseEnter={() => setFocus(k)}
              onMouseLeave={() => setFocus(-1)}
            >
              <b>{t(a.name)}</b>
              <span>{t(a.desc)}</span>
              <em>{t(k < on ? "Home.connected" : "Home.platformAddLater")}</em>
            </div>
          ))}
        </div>

        <div className="pf-foot">
          <span>
            <b>{t("Home.platformCount", { n: on })}</b> · {t(PLANS[plan].price)}
          </span>
          <span>{t("Home.illustrativeExactScopeIsSetAfter")}</span>
        </div>
      </div>
    </div>
  );
}
