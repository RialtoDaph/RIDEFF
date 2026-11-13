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
import {
  AI,
  AI_COLOR,
  AREAS,
  COLORS,
  SLAB,
  SLAB_COLOR,
  SceneTags,
  TAG_CSS,
  type T,
} from "./platformParts";

// WebGL only loads when the section is near the screen, and never on the server.
const PlatformScene = dynamic(() => import("./PlatformScene"), { ssr: false });

// Core connects one area, Growth four, the whole system all six (as on the pricing page).
const PLANS = [
  { name: "Core", on: 1, price: "Home.core149Mo", desc: "Home.platformPlanCore" },
  { name: "Growth", on: 4, price: "Home.growth249Mo", desc: "Home.platformPlanGrowth" },
  { name: "Home.wholeSystem", on: 6, price: "Home.wholeSystem449Mo", desc: "Home.platformPlanWhole" },
];
const PRINCIPLES = ["P1", "P2", "P3", "P4"];

const subscribeMotion = (cb: () => void) => {
  const mq = matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

const CSS = `
.pf-wrap{background:#14080A;color:#FFF7ED}
.pf-in{max-width:1480px;margin:0 auto;padding:clamp(88px,10vw,140px) clamp(20px,3vw,40px);display:flex;flex-direction:column;gap:clamp(36px,4vw,56px)}
.pf-head{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:40px;align-items:end}
.pf-label{font:400 12px var(--font-mono);color:#F97316}
.pf-h2{margin:0;font-size:clamp(31px,3.8vw,56px);line-height:1;letter-spacing:-0.045em;font-weight:600;text-wrap:balance}
.pf-body{margin:0;font-size:17px;line-height:1.55;color:#CBB7A8;max-width:500px}
.pf-main{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:clamp(24px,3vw,48px);align-items:center}
.pf-card{min-width:0;display:flex;flex-direction:column;border:1px solid #2E1517;border-radius:24px;overflow:hidden;background:#190B0B}
.pf-top{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 20px;padding:16px 20px 0 16px}
.pf-plans{display:flex;gap:4px;padding:4px;border-radius:999px;background:#2A1315}
.pf-plans button{border:none;cursor:pointer;border-radius:999px;padding:9px 18px;font:500 14px var(--font-sans);background:transparent;color:#CBB7A8;transition:background .3s,color .3s}
.pf-plans button[aria-pressed="true"]{background:#F97316;color:#17090A}
.pf-count{font:400 12px var(--font-mono);color:#927A6D}
.pf-count b{color:#FFF7ED;font-weight:400}
.pf-plan{margin:0;padding:14px 20px 0;min-height:calc(14px + 3em);font-size:15px;line-height:1.5;color:#E7D5C3;text-wrap:pretty}
.pf-stage{position:relative;aspect-ratio:3/2;max-height:540px;width:100%;background:radial-gradient(ellipse at 50% 60%,#231011 0%,#190B0B 66%)}
.pf-stage[data-hot="1"]{cursor:pointer}
.pf-info{display:flex;flex-direction:column;gap:6px;min-height:142px;padding:16px 20px;border-top:1px solid #2E1517;background:#1C0C0D}
.pf-info h3{--c:#F97316;margin:0;display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;font-size:18px;font-weight:600;letter-spacing:-0.02em}
.pf-info h3 i{width:10px;height:10px;border-radius:3px;background:var(--c);flex-shrink:0}
.pf-info h3 em{font:400 10px var(--font-mono);font-style:normal;letter-spacing:.08em;text-transform:uppercase;color:var(--c);border:1px solid color-mix(in srgb,var(--c) 45%,transparent);border-radius:999px;padding:3px 8px}
.pf-info h3 em[data-on="0"]{color:#A89184;border-color:#4F2C2C;border-style:dashed}
.pf-info p{margin:0;font-size:15px;line-height:1.5;color:#E7D5C3;max-width:640px}
.pf-info p.pf-later{font-size:13px;color:#A89184}
.pf-keys{list-style:none;margin:0;padding:0 16px 14px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;background:#1C0C0D}
.pf-key{--c:#fff;width:100%;height:100%;display:flex;flex-direction:column;align-items:flex-start;gap:3px;min-width:0;padding:10px 12px;border-radius:12px;border:1px solid #341919;background:#1e0d0e;color:#FFF7ED;text-align:left;cursor:pointer;font:inherit;transition:border-color .3s,background .3s}
.pf-key b{display:flex;align-items:center;gap:8px;max-width:100%;font-size:14px;font-weight:600;letter-spacing:-0.01em}
.pf-key b::before{content:"";width:8px;height:8px;border-radius:2px;background:var(--c);flex-shrink:0}
.pf-key[data-on="0"] b::before{background:transparent;box-shadow:inset 0 0 0 1px var(--c)}
.pf-key span{font:400 10px var(--font-mono);letter-spacing:.06em;text-transform:uppercase;color:#927A6D;padding-left:16px}
.pf-key[data-on="1"] span{color:color-mix(in srgb,var(--c) 80%,#FFF7ED)}
.pf-key:hover{border-color:color-mix(in srgb,var(--c) 45%,transparent)}
.pf-key[aria-pressed="true"]{border-color:var(--c);background:color-mix(in srgb,var(--c) 12%,#1e0d0e)}
.pf-key:focus-visible,.pf-plans button:focus-visible{outline:2px solid #FFF7ED;outline-offset:2px}
.pf-note{margin:0;padding:0 20px 16px;font:400 11px var(--font-mono);color:#78625A;background:#1C0C0D}
.pf-reasons{display:flex;flex-direction:column;justify-content:center}
.pf-reason{display:grid;grid-template-columns:34px minmax(0,1fr);gap:4px 14px;padding:20px 0;border-top:1px solid #341919}
.pf-reason:last-child{border-bottom:1px solid #341919}
.pf-reason i{font:400 12px var(--font-mono);font-style:normal;color:#F97316;padding-top:6px}
.pf-reason b{font-size:clamp(19px,1.7vw,24px);line-height:1.15;font-weight:600;letter-spacing:-0.03em;text-wrap:balance}
.pf-reason p{grid-column:2;margin:0;font-size:15px;line-height:1.5;color:#CBB7A8}
@media (max-width:1099px){
  .pf-main{grid-template-columns:minmax(0,1fr)}
  .pf-reasons{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:32px}
  .pf-reason:nth-last-child(2){border-bottom:1px solid #341919}
}
@media (max-width:700px){
  /* Too narrow for labels on the blocks: the legend below the scene does the naming. */
  .pf-stage .pt-tags{display:none}
  .pf-stage{aspect-ratio:4/3}
  .pf-keys{grid-template-columns:repeat(2,minmax(0,1fr))}
  .pf-plans button{padding:8px 13px;font-size:13px}
  .pf-plan{min-height:calc(14px + 6em)}
  .pf-info{min-height:190px}
  .pf-reasons{grid-template-columns:minmax(0,1fr)}
  .pf-reason:nth-last-child(2){border-bottom:none}
}
`;

/**
 * Home, right after the hero: why a business should have its own platform
 * rather than six rented tools, shown as the thing itself. Every part of the
 * object is named on the object, and picking one says what it does.
 */
export default function PlatformSection({ t }: { t: T }) {
  const [plan, setPlan] = useState(1);
  // A part of the scene: 0-5 an area, SLAB, AI, or -1. `sel` is picked (tap, click,
  // keyboard) and stays; `hover` is the mouse passing over and wins while it lasts.
  const [sel, setSel] = useState(-1);
  const [hover, setHover] = useState(-1);
  const [near, setNear] = useState(false);
  const [seen, setSeen] = useState(false);
  // Reduced motion: the scene is drawn docked and still.
  const still = useSyncExternalStore(
    subscribeMotion,
    reducedMotion,
    () => false,
  );
  const stage = useRef<HTMLDivElement>(null);
  const tags = useRef<(HTMLElement | null)[]>([]);

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
  const active = hover >= 0 ? hover : sel;
  const pick = (k: number) => setSel((s) => (s === k ? -1 : k));
  const name = (p: (typeof PLANS)[number]) =>
    p.name.startsWith("Home.") ? t(p.name) : p.name;

  // Legend order: what is always there first, then the six areas.
  const parts = [
    {
      k: SLAB,
      color: SLAB_COLOR,
      name: t("common.platformSlabName"),
      does: t("Home.platformSlabDoes"),
      status: t("Home.platformAlways"),
      on: true,
    },
    {
      k: AI,
      color: AI_COLOR,
      name: t("common.platformAiName"),
      does: t("Home.platformAiDoes"),
      status: t("Home.platformAlways"),
      on: true,
    },
    ...AREAS.map((a, k) => ({
      k,
      color: a.color,
      name: t(a.name),
      does: t(a.does),
      status: t(k < on ? "Home.connected" : "Home.platformAddLater"),
      on: k < on,
    })),
  ];
  const shown = parts.find((p) => p.k === active);

  return (
    <div id="platform" data-screen-label="01 Platform" className="pf-wrap">
      <style dangerouslySetInnerHTML={{ __html: CSS + TAG_CSS }} />
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
              <span style={{ color: "#F97316" }}>
                {t("Home.platformHeadlineAccent")}
              </span>
            </h2>
          </div>
          <p className="pf-body">{t("Home.platformBody")}</p>
        </div>

        <div className="pf-main">
          <div className="pf-card">
            <div className="pf-top">
              <div
                className="pf-plans"
                role="group"
                aria-label={t("Home.platformPlanPicker")}
              >
                {PLANS.map((p, k) => (
                  <button
                    key={p.name}
                    type="button"
                    aria-pressed={k === plan}
                    onClick={() => setPlan(k)}
                  >
                    {name(p)}
                  </button>
                ))}
              </div>
              <span className="pf-count">
                <b>{t("Home.platformCount", { n: on })}</b> ·{" "}
                {t(PLANS[plan].price)}
              </span>
            </div>
            <p className="pf-plan" aria-live="polite">
              {t(PLANS[plan].desc)}
            </p>

            <div
              ref={stage}
              className="pf-stage"
              data-hot={hover >= 0 ? "1" : "0"}
            >
              {near ? (
                <PlatformScene
                  colors={COLORS}
                  on={seen || still ? on : 0}
                  focus={active}
                  running={seen && !still}
                  still={still}
                  labels={tags}
                  onHover={setHover}
                  onPick={pick}
                />
              ) : null}
              <SceneTags
                t={t}
                refs={tags}
                on={on}
                active={active}
                onHover={setHover}
                onPick={pick}
              />
            </div>

            <div className="pf-info" aria-live="polite">
              {shown ? (
                <>
                  <h3 style={{ "--c": shown.color } as CSSProperties}>
                    <i />
                    {shown.name}
                    <em data-on={shown.on ? "1" : "0"}>{shown.status}</em>
                  </h3>
                  <p>{shown.does}</p>
                  {shown.on ? null : (
                    <p className="pf-later">{t("Home.platformLaterNote")}</p>
                  )}
                </>
              ) : (
                <>
                  <h3>{t("Home.platformHintTitle")}</h3>
                  <p>{t("Home.platformHint")}</p>
                </>
              )}
            </div>
            <ul className="pf-keys" aria-label={t("common.platformPick")}>
              {parts.map((p) => (
                <li key={p.k}>
                  <button
                    type="button"
                    className="pf-key"
                    data-on={p.on ? "1" : "0"}
                    aria-pressed={sel === p.k}
                    style={{ "--c": p.color } as CSSProperties}
                    onClick={() => pick(p.k)}
                    onPointerEnter={(e) =>
                      e.pointerType === "mouse" && setHover(p.k)
                    }
                    onPointerLeave={(e) =>
                      e.pointerType === "mouse" && setHover(-1)
                    }
                  >
                    <b>{p.name}</b>
                    <span>{p.status}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="pf-note">
              {t("Home.illustrativeExactScopeIsSetAfter")}
            </p>
          </div>

          <div className="pf-reasons" data-rv="80">
            {PRINCIPLES.map((r, k) => (
              <div key={r} className="pf-reason">
                <i>{`0${k + 1}`}</i>
                <b>{t(`Home.platform${r}`)}</b>
                <p>{t(`Home.platform${r}Body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
