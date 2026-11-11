"use client";

import { Fragment } from "react";
import { opt, useDC } from "@/lib/dc";
import Nav from "@/components/dc/Nav";
import Footer from "@/components/dc/Footer";
import PillarClose from "@/components/home/PillarClose";

/**
 * A case study: what the client needed, what was built, what it looks like and
 * how the parts connect. Only facts that are true today. Results and a quote
 * get their own blocks once real ones exist (see `results` / `quote`).
 */
type Case = {
  /** Message prefix in the `Case` namespace ("tic" → Case.ticHead …). */
  id: "tic" | "mami";
  route: "/work/tic-originals" | "/work/mami-patisserie";
  name: string;
  url?: string;
  cover: string;
  /** Fact rows: label key → value key (both in `Case`). */
  facts: [string, string][];
  built: number;
  screens: string[];
  /** Real measured outcomes, [value, label]. Leave empty until there are some. */
  results?: [string, string][];
  /** A real client quote. Leave out until there is one. */
  quote?: { text: string; by: string };
};

export const CASES: Record<Case["id"], Case> = {
  tic: {
    id: "tic",
    route: "/work/tic-originals",
    name: "TIC Originals",
    url: "https://ticoriginals.com",
    cover: "/images/tic-hero.png",
    facts: [
      ["scope", "ticScope"],
      ["stack", "ticStack"],
      ["langs", "ticLangs"],
      ["status", "ticStatus"],
    ],
    built: 6,
    screens: [
      "tic-hero",
      "tic-shopall",
      "tic-checkout",
      "tic-today",
      "tic-orders",
      "tic-promo",
      "tic-insights",
    ],
  },
  mami: {
    id: "mami",
    route: "/work/mami-patisserie",
    name: "Mami I Patisserie",
    cover: "/images/mami-hero.png",
    facts: [
      ["scope", "mamiScope"],
      ["place", "mamiPlace"],
      ["langs", "mamiLangs"],
    ],
    built: 6,
    // File names predate the content: "mami-tim" is the cart, "mami-laporan" the team planner.
    screens: [
      "mami-hero",
      "mami-menu",
      "mami-hampers",
      "mami-natal",
      "mami-tim",
      "mami-laporan",
    ],
  },
};
const ORDER: Case["id"][] = ["tic", "mami"];

/** The optimizer's three widths; the browser picks by layout width and pixel density. */
const srcSet = (src: string) =>
  ([640, 1080, 1920] as const).map((w) => `${opt(src, w)} ${w}w`).join(", ");

const CSS = `
body{margin:0;background:#ECE8E1;color:#0A0A0A;font-family:var(--font-sans);-webkit-font-smoothing:antialiased}
.cs a{color:inherit;text-decoration:none}
.cs-wrap{max-width:1480px;margin:0 auto;padding:0 clamp(20px,3vw,40px)}
.cs-mono{font:400 12px var(--font-mono);letter-spacing:.1em;text-transform:uppercase;color:#5A5650}
.cs-hero{padding-top:150px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr));gap:40px 56px;align-items:end}
.cs-back{align-self:flex-start;transition:color .25s}
.cs-back:hover{color:#0A0A0A}
.cs-h1{margin:0;font-size:clamp(40px,5.2vw,84px);line-height:.96;letter-spacing:-0.05em;font-weight:600;text-wrap:balance}
.cs-h1 span,.cs-h2 span{color:#FF6A00}
.cs-h1 span{display:block}
.cs-intro{margin:0;font-size:clamp(17px,1.35vw,20px);line-height:1.55;color:#3A3731;max-width:560px;text-wrap:pretty}
.cs-visit{align-self:flex-start;border:1px solid #0A0A0A;border-radius:999px;padding:14px 22px;font-weight:600;font-size:13px;letter-spacing:.06em;text-transform:uppercase;transition:background .25s,color .25s}
.cs-visit:hover{background:#0A0A0A;color:#F4F4F2}
.cs-cover{margin-top:clamp(40px,5vw,72px);border-radius:24px;overflow:hidden;background:#0E0E10;aspect-ratio:16/9}
.cs-cover img,.cs-shot img{width:100%;height:100%;object-fit:cover;object-position:top center;display:block}
.cs-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0 32px;margin-top:28px}
.cs-fact{display:flex;flex-direction:column;gap:6px;padding:16px 0;border-top:1px solid #BDB6AA}
.cs-fact b{font-size:16px;font-weight:500}
.cs-sec{padding-top:clamp(96px,10vw,150px);display:flex;flex-direction:column;gap:clamp(32px,4vw,52px)}
.cs-h2{margin:0;font-size:clamp(33px,3.9vw,62px);line-height:.98;letter-spacing:-0.05em;font-weight:600;text-wrap:balance}
.cs-built{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:0 40px}
.cs-item{display:grid;grid-template-columns:34px minmax(0,1fr);gap:6px 12px;padding:24px 0;border-top:1px solid #0A0A0A}
.cs-item i{font:400 12px var(--font-mono);font-style:normal;color:#FF6A00;padding-top:7px}
.cs-item b{font-size:clamp(21px,1.9vw,26px);font-weight:600;letter-spacing:-0.03em}
.cs-item p{grid-column:2;margin:0;font-size:15px;line-height:1.55;color:#3A3731}
.cs-dark{background:#0B0B0C;color:#F4F4F2;margin-top:clamp(96px,10vw,150px);padding-bottom:clamp(88px,9vw,130px)}
.cs-dark .cs-sec{padding-top:clamp(88px,9vw,130px)}
.cs-dark .cs-mono{color:#8C877E}
.cs-shots{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.cs-shot{margin:0;display:flex;flex-direction:column;gap:10px}
.cs-shot:first-child{grid-column:1/-1}
.cs-shot div{border-radius:16px;overflow:hidden;border:1px solid #232325;aspect-ratio:16/9;background:#101011}
.cs-shot figcaption{font:400 11px var(--font-mono);letter-spacing:.08em;text-transform:uppercase;color:#8C877E}
.cs-note{font:400 11px var(--font-mono);letter-spacing:.04em;color:#6B675F}
.cs-flow{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
.cs-flow span{border:1px solid #0A0A0A;border-radius:999px;padding:12px 20px;font-size:16px;font-weight:500;background:#F4F1EC}
.cs-flow span:last-of-type{background:#FF6A00;border-color:#FF6A00}
.cs-flow i{font-style:normal;color:#5A5650}
.cs-results{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px}
.cs-results div{background:#F4F1EC;border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:8px}
.cs-results b{font-size:clamp(40px,4vw,60px);letter-spacing:-0.05em;line-height:1;font-weight:600}
.cs-quote{margin:0;font-size:clamp(24px,2.6vw,38px);line-height:1.2;letter-spacing:-0.03em;font-weight:500;max-width:1000px}
.cs-quote footer{margin-top:18px;font:400 12px var(--font-mono);letter-spacing:.08em;text-transform:uppercase;color:#5A5650}
.cs-next{margin:clamp(96px,10vw,150px) 0;padding-top:28px;border-top:1px solid #0A0A0A;display:flex;justify-content:space-between;align-items:baseline;gap:20px;flex-wrap:wrap}
.cs-next b{font-size:clamp(30px,3.6vw,56px);letter-spacing:-0.045em;font-weight:600;transition:color .25s}
.cs-next:hover b{color:#FF6A00}
@media (max-width:700px){.cs-shots{grid-template-columns:minmax(0,1fr)}.cs-hero{padding-top:120px}}
`;

function Body({ c }: { c: Case }) {
  const { t, href } = useDC();
  const k = (key: string) => t(`Case.${key}`);
  const id = c.id;
  const next = CASES[ORDER[(ORDER.indexOf(id) + 1) % ORDER.length]];
  const flow = k(`${id}Flow`).split("|");

  return (
    <div className="cs">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Nav active="work" />
      <div className="cs-wrap">
        <div className="cs-hero">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <a className="cs-mono cs-back" href={href("/work")}>
              {k("back")}
            </a>
            <div className="cs-mono">
              {c.name} · {k(`${id}Kicker`)}
            </div>
            <h1 className="cs-h1">
              {k(`${id}Head`)} <span>{k(`${id}Accent`)}</span>
            </h1>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <p className="cs-intro">{k(`${id}Intro`)}</p>
            {c.url ? (
              <a
                className="cs-visit"
                href={c.url}
                target="_blank"
                rel="noopener"
              >
                {k("visit")}
              </a>
            ) : null}
          </div>
        </div>
        <div className="cs-cover" data-rv="0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={opt(c.cover)}
            srcSet={srcSet(c.cover)}
            sizes="(max-width: 1480px) 100vw, 1400px"
            fetchPriority="high"
            alt={`${c.name} · ${k(`${id}S1`)}`}
          />
        </div>
        <div className="cs-facts">
          {c.facts.map(([label, value]) => (
            <div key={label} className="cs-fact">
              <span className="cs-mono">{k(label)}</span>
              <b>{k(value)}</b>
            </div>
          ))}
        </div>

        <div className="cs-sec">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
            <div className="cs-mono">{k("builtLabel")}</div>
            <h2 className="cs-h2">
              {k(`${id}BuiltHead`)} <span>{k(`${id}BuiltAccent`)}</span>
            </h2>
          </div>
          <div className="cs-built">
            {Array.from({ length: c.built }, (_, i) => (
              <div key={i} className="cs-item" data-rv={(i % 3) * 60}>
                <i>{`0${i + 1}`}</i>
                <b>{k(`${id}B${i + 1}T`)}</b>
                <p>{k(`${id}B${i + 1}D`)}</p>
              </div>
            ))}
          </div>
        </div>

        {c.results?.length ? (
          <div className="cs-sec">
            <div className="cs-results">
              {c.results.map(([value, label]) => (
                <div key={label}>
                  <b>{value}</b>
                  <span className="cs-mono">{label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {c.quote ? (
          <div className="cs-sec">
            <blockquote className="cs-quote">
              {c.quote.text}
              <footer>{c.quote.by}</footer>
            </blockquote>
          </div>
        ) : null}
      </div>

      <div className="cs-dark">
        <div className="cs-wrap">
          <div className="cs-sec">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "18px" }}
            >
              <div className="cs-mono">{k("screensLabel")}</div>
              <h2 className="cs-h2">{k("screensHead")}</h2>
            </div>
            <div className="cs-shots">
              {c.screens.slice(1).map((s, i) => (
                <figure key={s} className="cs-shot" data-rv={(i % 2) * 80}>
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={opt(`/images/${s}.png`, 1080)}
                      srcSet={srcSet(`/images/${s}.png`)}
                      sizes={
                        i
                          ? "(max-width: 700px) 100vw, 50vw"
                          : "(max-width: 1480px) 100vw, 1400px"
                      }
                      decoding="async"
                      alt={`${c.name} · ${k(`${id}S${i + 2}`)}`}
                      loading="lazy"
                    />
                  </div>
                  <figcaption>{k(`${id}S${i + 2}`)}</figcaption>
                </figure>
              ))}
            </div>
            <div className="cs-note">{k("sampleNote")}</div>
          </div>
        </div>
      </div>

      <div className="cs-wrap">
        <div className="cs-sec">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
            <div className="cs-mono">{k("flowLabel")}</div>
            <h2 className="cs-h2">
              {k("flowHead")} <span>{k("flowAccent")}</span>
            </h2>
            <p className="cs-intro">{k("flowBody")}</p>
          </div>
          <div className="cs-flow" data-rv="0">
            {flow.map((step, i) => (
              <Fragment key={step}>
                {i ? <i>→</i> : null}
                <span>{step}</span>
              </Fragment>
            ))}
          </div>
        </div>
        <a className="cs-next" href={href(next.route)}>
          <span className="cs-mono">{k("nextLabel")}</span>
          <b>{next.name} →</b>
        </a>
      </div>

      <PillarClose
        t={t}
        label={k("closeLabel")}
        head={k("closeHead")}
        accent={k("closeAccent")}
        body={k("closeBody")}
      />
      <Footer />
    </div>
  );
}

export const TicCase = () => <Body c={CASES.tic} />;
export const MamiCase = () => <Body c={CASES.mami} />;
