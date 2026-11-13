"use client";

import type { CSSProperties, RefObject } from "react";

/**
 * What the platform scene's parts are called, shared by the Home platform
 * section and the closing scene. Kept apart from PlatformScene so the text
 * does not wait for (or pull in) the WebGL bundle.
 */

export type T = (key: string, values?: Record<string, string | number>) => string;

// Same six areas and colours as the area map on the Build page. Names sit in
// "common": the closing scene shows them on pages that do not load "Home".
export const AREAS = [
  {
    name: "common.platformCustomers",
    does: "Home.platformDoesCustomers",
    color: "#FB923C",
  },
  {
    name: "common.platformSales",
    does: "Home.platformDoesSales",
    color: "#61CC80",
  },
  {
    name: "common.platformTeam",
    does: "Home.platformDoesTeam",
    color: "#54B0E6",
  },
  {
    name: "common.platformOperations",
    does: "Home.platformDoesOperations",
    color: "#9E8CF2",
  },
  {
    name: "common.platformFinance",
    does: "Home.platformDoesFinance",
    color: "#E0B842",
  },
  {
    name: "common.platformMarketing",
    does: "Home.platformDoesMarketing",
    color: "#EB7AAB",
  },
];
export const COLORS = AREAS.map((a) => a.color);

/** Indices of the two parts that are not area modules. */
export const SLAB = 6;
export const AI = 7;
export const SLAB_COLOR = "#B98A72";
export const AI_COLOR = "#F97316";

export const TAG_CSS = `
.pt-tags{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden}
.pt-tag{--c:#fff;position:absolute;left:0;top:0;opacity:0;transition:opacity .5s;will-change:transform}
.pt-tag[data-placed]{opacity:1}
.pt-chip{position:absolute;left:0;top:0;transform:translate(-50%,-50%);display:flex;align-items:center;gap:6px;white-space:nowrap;margin:0;padding:4px 10px 4px 8px;border-radius:999px;border:1px solid color-mix(in srgb,var(--c) 60%,transparent);background:rgba(23,9,10,.84);color:#FFF7ED;font:500 12px/1.3 var(--font-sans);letter-spacing:0;transition:background .25s,color .25s,border-color .25s,transform .5s cubic-bezier(.16,1,.3,1)}
button.pt-chip{pointer-events:auto;cursor:pointer}
.pt-chip i{width:7px;height:7px;border-radius:50%;background:var(--c);flex-shrink:0;transition:background .25s}
.pt-chip em{font:400 10px var(--font-mono);font-style:normal;letter-spacing:.04em;color:#A89184}
/* A floating outline sits in front of docked blocks on screen: lift its label clear of theirs. */
.pt-tag[data-on="0"] .pt-chip{transform:translate(-50%,-50%) translateY(-20px);border-style:dashed;background:rgba(23,9,10,.62);color:#CBB7A8}
.pt-tag[data-active="1"] .pt-chip{background:var(--c);border-color:var(--c);border-style:solid;color:#17090A}
.pt-tag[data-active="1"] .pt-chip i{background:#17090A}
.pt-tag[data-active="1"] .pt-chip em{color:#17090A}
.pt-slab .pt-chip{transform:translate(-50%,10px);border-radius:8px;padding:5px 11px}
.pt-ai .pt-chip{transform:translate(-100%,-50%) translateX(-10px)}
.pt-ai .pt-chip::after{content:"";position:absolute;left:100%;top:50%;width:10px;height:1px;background:color-mix(in srgb,var(--c) 60%,transparent)}
`;

/**
 * The HTML labels that PlatformScene keeps on the blocks. Pointer-only: the
 * same choices are offered as real buttons in the legend next to the scene,
 * which is what keyboards and screen readers use.
 */
export function SceneTags({
  t,
  refs,
  on,
  active = -1,
  onHover,
  onPick,
  className = "",
}: {
  t: T;
  refs: RefObject<(HTMLElement | null)[]>;
  /** How many of the six areas are connected. */
  on: number;
  active?: number;
  onHover?: (k: number) => void;
  onPick?: (k: number) => void;
  className?: string;
}) {
  const items = [
    ...AREAS.map((a, k) => ({
      cls: "",
      color: a.color,
      text: t(a.name),
      later: k >= on,
    })),
    { cls: " pt-slab", color: SLAB_COLOR, text: t("common.platformSlabLabel"), later: false },
    { cls: " pt-ai", color: AI_COLOR, text: t("common.platformAiName"), later: false },
  ];
  return (
    <div className={`pt-tags ${className}`} aria-hidden="true">
      {items.map((it, k) => {
        const inner = (
          <>
            <i />
            {it.text}
            {it.later ? <em>{t("common.platformOptional")}</em> : null}
          </>
        );
        return (
          <span
            key={k}
            ref={(el) => {
              refs.current[k] = el;
            }}
            className={`pt-tag${it.cls}`}
            data-on={it.later ? "0" : "1"}
            data-active={k === active ? "1" : "0"}
            style={{ "--c": it.color } as CSSProperties}
          >
            {onPick ? (
              <button
                type="button"
                tabIndex={-1}
                className="pt-chip"
                onClick={() => onPick(k)}
                onPointerEnter={(e) => e.pointerType === "mouse" && onHover?.(k)}
                onPointerLeave={(e) => e.pointerType === "mouse" && onHover?.(-1)}
              >
                {inner}
              </button>
            ) : (
              <span className="pt-chip">{inner}</span>
            )}
          </span>
        );
      })}
    </div>
  );
}
