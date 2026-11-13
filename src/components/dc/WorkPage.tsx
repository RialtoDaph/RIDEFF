// @ts-nocheck -- ported 1:1 from rideff_handoff/design/RIDEFF Work.dc.html (see scripts/dc-port/convert.mjs)
'use client';
import React, { Fragment } from 'react';
import { DCLogic, dcStyle, opt, useDC } from '@/lib/dc';
import Nav from '@/components/dc/Nav';
import Footer from '@/components/dc/Footer';

const WK_CSS = `
.wk-grid{padding:0 clamp(20px,3vw,40px) 140px;max-width:1360px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,520px),1fr));gap:72px 32px}
.wk-card{display:flex;flex-direction:column;gap:18px;min-width:0}
.wk-media{aspect-ratio:16/11;border-radius:20px;display:flex;align-items:center;justify-content:center;box-sizing:border-box;overflow:hidden}
.wk-media.wk-dashed{border:1.5px dashed #D3B9A0;transition:border-color .3s}
.wk-card:hover .wk-dashed{border-color:#F97316}
.wk-frame{width:84%;border-radius:clamp(8px,1.2vw,14px);overflow:hidden;box-shadow:0 30px 60px -28px rgba(23,9,10,.55),0 0 0 1px rgba(23,9,10,.1);transition:transform .6s cubic-bezier(.16,1,.3,1)}
.wk-card:hover .wk-frame{transform:translateY(-6px)}
.wk-bar{display:flex;align-items:center;gap:5px;padding:clamp(6px,.8vw,9px) clamp(9px,1vw,12px)}
.wk-bar i{width:7px;height:7px;border-radius:50%;background:currentColor;opacity:.28}
.wk-bar span{margin-left:8px;font:400 10px var(--font-mono);letter-spacing:.02em;opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wk-frame img{display:block;width:100%;height:auto}
.wk-word{align-self:flex-end;margin-right:auto;padding:clamp(22px,3vw,40px);font:400 clamp(40px,5vw,72px)/1 var(--font-sans);letter-spacing:-0.03em}
.wk-head{display:flex;justify-content:space-between;align-items:baseline;gap:8px 16px;flex-wrap:wrap;margin-top:4px}
.wk-name{font-size:clamp(24px,2.2vw,28px);font-weight:600;letter-spacing:-0.03em}
.wk-mono{font:400 11px var(--font-mono);letter-spacing:.08em;text-transform:uppercase;color:#5E4A43}
.wk-p{margin:-6px 0 0;font-size:16px;line-height:1.55;color:#3D2B27;max-width:560px;text-wrap:pretty}
.wk-result{display:grid;grid-template-columns:84px minmax(0,1fr);gap:4px 12px;align-items:baseline;padding-top:14px;border-top:1px solid #E7D5C3;font-size:15px;line-height:1.5;color:#17090A;max-width:560px}
.wk-tags{display:flex;flex-wrap:wrap;gap:6px}
.wk-tags span{border:1px solid #D3B9A0;border-radius:999px;padding:5px 10px;font:400 11px var(--font-mono);letter-spacing:.04em;color:#5E4A43}
.wk-cta{align-self:flex-start;margin-top:auto;border:1px solid #17090A;border-radius:999px;padding:12px 20px;font-weight:600;font-size:13px;letter-spacing:.06em;text-transform:uppercase;transition:background .25s,color .25s,border-color .25s}
.wk-card:hover .wk-cta{background:#F97316;border-color:#F97316;color:#17090A}
.wk-result.wk-plain{grid-template-columns:minmax(0,1fr)}
@media (max-width:480px){.wk-result{grid-template-columns:minmax(0,1fr)}.wk-frame{width:88%}}
@media (prefers-reduced-motion:reduce){.wk-frame{transition:none}.wk-card:hover .wk-frame{transform:none}}
`;

class Logic extends DCLogic {
  renderVals() {
    const t = this.props.t,
      href = this.props.href;
    const shot = { w: 1920, h: 1083 },
      crop = { w: 924, h: 540 };
    return {
      cards: [
        { id: "tic", href: href("/work/tic-originals"), name: "TIC Originals", tag: t("Work.shopDashboardDE"), img: "/images/tic-hero.png", ...shot, eager: true, alt: t("Work.tICOriginalsShop"), site: "ticoriginals.com", tint: "#7F1D1D", bar: "#17090A", barFg: "#FFF7ED", built: t("Work.ticBuilt"), result: t("Work.ticResult"), tags: t("Work.ticTags"), cta: t("Work.readCase") },
        { id: "mami", href: href("/work/mami-patisserie"), name: "Mami I Patisserie", tag: t("Work.siteTeamAppID"), img: "/images/mami-hero.png", ...shot, eager: true, alt: t("Work.mamiIPatisserieWebsite"), site: "Mami I Patisserie", tint: "#FFE4C7", bar: "#FFF7ED", barFg: "#17090A", built: t("Work.mamiBuilt"), result: t("Work.mamiResult"), tags: t("Work.mamiTags"), cta: t("Work.readCase") },
        { id: "life", href: href("/life"), name: "RIDEFF Life", tag: t("Work.personalCockpit"), img: "/images/life-cockpit.png", ...crop, alt: t("Work.lifeAlt"), site: "RIDEFF Life", tint: "#FDBA74", bar: "#17090A", barFg: "#FFF7ED", built: t("Work.lifeBuilt"), result: t("Work.lifeResult"), tags: t("Work.lifeTags"), cta: t("Work.lifeCta") },
        { id: "portal", href: href("@portal"), name: t("Work.clientPortal"), tag: t("Work.everyClient"), img: "/images/portal-client.png", ...crop, alt: t("Work.portalAlt"), site: t("Work.clientPortal"), tint: "#2A1314", bar: "#17090A", barFg: "#FFF7ED", built: t("Work.whereClientsApproveOffersPayInvoices"), result: t("Work.portalResult"), cta: t("Work.portalCta") },
        { id: "demo", href: href("/demo"), name: t("Work.businessDemo"), tag: t("Work.clickThrough"), word: t("Work.businessDemo"), wordFg: "#17090A", tint: "#F97316", built: t("Work.aSampleBusinessBrainWithDashboards"), result: t("Work.demoResult"), cta: t("Work.demoCta") },
        { id: "next", href: href("@cal"), ext: true, name: t("Work.nextProject"), tag: t("Work.yourBusiness"), word: t("Work.yourBusiness"), wordFg: "#5E4A43", tint: "transparent", dashed: true, built: t("Work.nextBuilt"), result: t("Work.builtByMeRunByMe"), plain: true, cta: t("Work.nextCta") },
      ],
    };
  }
}

Logic.prototype.render = function render() {
  const v = { ...this.props, ...this.renderVals() };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: "body{margin:0;background:#FFF7ED;color:#17090A;font-family:var(--font-sans);-webkit-font-smoothing:antialiased}\na{color:inherit;text-decoration:none}a:hover{color:#17090A}" + WK_CSS }} />
      <Nav active="work" />
      <div data-screen-label="Hero" style={{ padding: "150px clamp(20px,3vw,40px) 72px", maxWidth: "1360px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5E4A43" }}>
          {v.t("Work.work")}
        </div>
        <h1 style={{ margin: "0", fontSize: "clamp(43px,5.7vw,92px)", lineHeight: ".95", letterSpacing: "-0.055em", fontWeight: "600" }}>
          {v.t("Work.builtLive")}{" "}
          <span style={{ color: "#F97316" }}>
            {v.t("Work.running")}
          </span>
        </h1>
        <p style={{ margin: "0", maxWidth: "480px", fontSize: "18px", lineHeight: "1.55", color: "#3D2B27", textWrap: "pretty" }}>
          {v.t("Work.everythingHereIsStillMaintainedBy")}
        </p>
      </div>
      <div data-screen-label="Projects" className="wk-grid">
        {(v.cards ?? []).map((c) => (
          <a key={c.id} className="wk-card" href={c.href} target={c.ext ? "_blank" : undefined} rel={c.ext ? "noopener" : undefined}>
            {/* Same panel shape on every card; the screenshot inside keeps its own ratio, so nothing is cut. */}
            <div className={`wk-media${c.dashed ? " wk-dashed" : ""}`} style={{ background: c.tint }}>
              {c.img ? (
                <div className="wk-frame">
                  <div className="wk-bar" style={{ background: c.bar, color: c.barFg }}>
                    <i /><i /><i />
                    <span>{c.site}</span>
                  </div>
                  <img loading={c.eager ? undefined : "lazy"} decoding="async" src={opt(c.img, 1080)} srcSet={`${opt(c.img, 640)} 640w, ${opt(c.img, 1080)} 1080w`} sizes="(max-width: 1100px) 84vw, 560px" width={c.w} height={c.h} alt={c.alt} style={{ aspectRatio: `${c.w}/${c.h}` }} />
                </div>
              ) : (
                <span className="wk-word" style={{ color: c.wordFg }}>{c.word}</span>
              )}
            </div>
            <div className="wk-head">
              <span className="wk-name">{c.name}</span>
              <span className="wk-mono">{c.tag}</span>
            </div>
            <p className="wk-p">{c.built}</p>
            {c.result ? (
              <div className={`wk-result${c.plain ? " wk-plain" : ""}`}>
                {c.plain ? null : <span className="wk-mono">{v.t("Work.resultLabel")}</span>}
                <span>{c.result}</span>
              </div>
            ) : null}
            {c.tags ? (
              <div className="wk-tags">
                {c.tags.split("|").map((tg) => (<span key={tg}>{tg}</span>))}
              </div>
            ) : null}
            <span className="wk-cta">{c.cta}</span>
          </a>
        ))}
      </div>
      <Footer  />
    </>
  );
};

export default function WorkPage(props) {
  const dc = useDC();
  return <Logic key={dc.locale} {...dc} {...props} />;
}
