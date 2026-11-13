"use client";

import { useState } from "react";
import { useLocale } from "next-intl";

type T = (key: string, values?: Record<string, string | number>) => string;

/** Growth, per month, net. The plan the comparison is made against. */
const GROWTH = 249;
const WEEKS_PER_MONTH = 4.33;

const CSS = `
.pa{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:14px}
.pa-card{border-radius:22px;padding:clamp(24px,2.6vw,32px);background:#FFF7ED;display:flex;flex-direction:column;gap:18px;min-width:0}
.pa-calc{background:#14080A;color:#FFF7ED}
.pa-label{font:400 11px var(--font-mono);letter-spacing:.1em;text-transform:uppercase;color:#5E4A43}
.pa-calc .pa-label{color:#F97316}
.pa-field{display:flex;flex-direction:column;gap:10px}
.pa-field label{display:flex;justify-content:space-between;gap:16px;align-items:baseline;font-size:15px;color:#CBB7A8}
.pa-field output{font:500 15px var(--font-mono);color:#FFF7ED;white-space:nowrap}
.pa-field input{appearance:none;-webkit-appearance:none;width:100%;height:28px;margin:0;background:transparent;cursor:pointer}
.pa-field input::-webkit-slider-runnable-track{height:4px;border-radius:2px;background:linear-gradient(90deg,#F97316 var(--p),#3D1F20 var(--p))}
.pa-field input::-moz-range-track{height:4px;border-radius:2px;background:#3D1F20}
.pa-field input::-moz-range-progress{height:4px;border-radius:2px;background:#F97316}
.pa-field input::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;margin-top:-9px;border-radius:50%;background:#FFF7ED;border:none;box-shadow:0 0 0 4px rgba(249,115,22,.28)}
.pa-field input::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:#FFF7ED;border:none;box-shadow:0 0 0 4px rgba(249,115,22,.28)}
.pa-field input:focus-visible{outline:2px solid #F97316;outline-offset:4px;border-radius:6px}
.pa-out{display:flex;flex-direction:column;gap:6px;margin-top:auto;padding-top:18px;border-top:1px solid #341919}
.pa-out b{font-size:clamp(38px,4.4vw,60px);line-height:1;letter-spacing:-0.045em;font-weight:600;font-variant-numeric:tabular-nums}
.pa-out span{font-size:15px;line-height:1.5;color:#CBB7A8}
.pa-out em{font-style:normal;color:#FB923C}
.pa-note{font:400 11px var(--font-mono);letter-spacing:.02em;color:#78625A}
.pa-rows{display:flex;flex-direction:column}
.pa-row{display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-bottom:1px solid #E6D0B9;font-size:15px}
.pa-row span:first-child{color:#3D2B27}
.pa-row span:last-child{font-family:var(--font-mono);color:#5E4A43;white-space:nowrap}
.pa-row.is-us{padding:14px 0 0;border:none;font-size:16px;font-weight:600}
.pa-row.is-us span:first-child{color:#17090A}
.pa-row.is-us span:last-child{font-family:inherit;color:#F97316}
@media (max-width:520px){.pa-row{flex-direction:column;gap:2px}}
.pa.is-solo .pa-calc{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:18px clamp(28px,4vw,64px);align-items:end}
.pa.is-solo .pa-label,.pa.is-solo .pa-note{grid-column:1/-1}
.pa.is-solo .pa-out{grid-row:span 2;margin-top:0;padding-top:0;border-top:none}
`;

/**
 * Home, right before the plan cards: what the repeat work costs today (the
 * visitor's own numbers) and what the usual alternatives cost, so the plan
 * price is read against something.
 */
export default function PriceAnchor({
  t,
  rows,
}: {
  t: T;
  rows?: { t: string; v: string }[];
}) {
  const locale = useLocale();
  const [hours, setHours] = useState(10);
  const [rate, setRate] = useState(60);

  const eur = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(n);
  // Rounded to the nearest 10: the inputs are estimates, the result should not pretend otherwise.
  const monthly = Math.round((hours * WEEKS_PER_MONTH * rate) / 10) * 10;
  const breakEven = Math.ceil(GROWTH / rate);
  const pct = (v: number, min: number, max: number) =>
    `${((v - min) / (max - min)) * 100}%`;

  return (
    <div className={rows ? "pa" : "pa is-solo"} data-rv="60">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pa-card pa-calc">
        <div className="pa-label">{t("common.calcLabel")}</div>
        <div className="pa-field">
          <label htmlFor="pa-hours">
            {t("common.calcHours")}
            <output htmlFor="pa-hours">
              {t("common.calcHoursValue", { n: hours })}
            </output>
          </label>
          <input
            id="pa-hours"
            type="range"
            min={2}
            max={30}
            step={1}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            style={{ ["--p" as string]: pct(hours, 2, 30) }}
          />
        </div>
        <div className="pa-field">
          <label htmlFor="pa-rate">
            {t("common.calcRate")}
            <output htmlFor="pa-rate">{eur(rate)}</output>
          </label>
          <input
            id="pa-rate"
            type="range"
            min={25}
            max={150}
            step={5}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            style={{ ["--p" as string]: pct(rate, 25, 150) }}
          />
        </div>
        <div className="pa-out" aria-live="polite">
          <b>{eur(monthly)}</b>
          <span>{t("common.calcResult")}</span>
          <span>
            <em>
              {t("common.calcBreakEven", { n: breakEven, price: eur(GROWTH) })}
            </em>
          </span>
        </div>
        <div className="pa-note">{t("common.calcNote")}</div>
      </div>
      {rows ? (
        <div className="pa-card">
          <div className="pa-label">{t("Home.onCostPlaceholderFigures")}</div>
          <div className="pa-rows">
            {rows.map((r) => (
              <div key={r.t} className="pa-row">
                <span>{r.t}</span>
                <span>{r.v}</span>
              </div>
            ))}
            <div className="pa-row is-us">
              <span>{t("Home.rIDEFFGrowthOnePersonOneInvoice")}</span>
              <span>{t("Home.n249Mo")}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
