// @ts-nocheck -- ported 1:1 from rideff_handoff/design/RIDEFF About.dc.html (see scripts/dc-port/convert.mjs)
'use client';
import React, { Fragment } from 'react';
import { DCLogic, dcStyle, opt, useDC } from '@/lib/dc';
import Nav from '@/components/dc/Nav';
import { ImageSlot } from '@/lib/dc';
import Footer from '@/components/dc/Footer';
import PillarClose from '@/components/home/PillarClose';

class Logic extends DCLogic {
  renderVals() {
    return {
      path: [[this.props.t("About.exportImport"), this.props.t("About.chapterOneYears"), this.props.t("About.movingGoodsBetweenCountriesTaughtMe")], [this.props.t("About.socialMedia"), this.props.t("About.chapterTwoYears"), this.props.t("About.runningChannelsForBrandsTaughtMe")], [this.props.t("About.sellingOnline"), this.props.t("About.chapterThreeYears"), this.props.t("About.myOwnECommerceTaughtMe")], ['RIDEFF', this.props.t("About.nowEichstatt"), this.props.t("About.soIBuiltTheThingI")]].map((p, k) => ({
        n: '0' + (k + 1),
        t: p[0],
        when: p[1],
        d: p[2]
      })),
      rules: [['i', this.props.t("About.noHandoffs"), this.props.t("About.thePersonOnYourFirstCall")], ['ii', this.props.t("About.youStayInControl"), this.props.t("About.aIDraftsAndSortsYouApprove")], ['iii', this.props.t("About.yourDataStaysInTheEU"), this.props.t("About.hostedInFrankfurtBackedUpDaily")], ['iv', this.props.t("About.itIsYours"), this.props.t("About.itIsYoursBody")]].map(r => ({
        n: r[0],
        t: r[1],
        d: r[2]
      }))
    };
  }
}

Logic.prototype.render = function render() {
  const v = { ...this.props, ...this.renderVals() };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: "body{margin:0;background:#FFF7ED;color:#17090A;font-family:var(--font-sans);-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}a:hover{color:#F97316}" }} />
      <Nav active="about" />
      <div data-screen-label="Hero" style={{ padding: "140px clamp(20px,3vw,40px) 100px", maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "56px", alignItems: "end" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5E4A43" }}>
            {v.t("About.home")}{" "}
            <span style={{ color: "#17090A" }}>
              {v.t("About.about")}
            </span>
          </div>
          <h1 style={{ margin: "0", fontSize: "clamp(46px,6.1vw,95px)", lineHeight: ".92", letterSpacing: "-0.055em", fontWeight: "600", textWrap: "balance" }}>
            {v.t("About.iMRialtoI")}{" "}
            <span style={{ color: "#F97316" }}>
              {v.t("About.get")}
            </span>
            {" "}{v.t("About.theAISoYouDonT")}
          </h1>
          <p style={{ margin: "0", maxWidth: "480px", fontSize: "19px", lineHeight: "1.55", color: "#3D2B27", textWrap: "pretty" }}>
            {v.t("About.beforeRIDEFFITradedGoodsAcross")}
          </p>
          <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#5E4A43" }}>
            <span>
              {v.t("About.basedEichstattDE")}
            </span>
            <span>
              {v.t("About.worksRemoteEU")}
            </span>
            <span>
              {v.t("About.speaksDEENID")}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ aspectRatio: "4/5", borderRadius: "24px", overflow: "hidden" }}>
            <ImageSlot src={opt("/images/rialto-about-v2.jpg")} alt={v.t("About.rialtoPortraitWarmLight")} shape="rounded" radius={24} priority />
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#5E4A43" }}>
            {v.t("About.rialtoFounderOperatorRIDEFF")}
          </span>
        </div>
      </div>
      <div data-screen-label="01 Path" style={{ background: "#14080A", color: "#FFF7ED" }}>
        {" "}
        <div style={{ padding: "120px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "56px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#F97316" }}>
              {v.t("About.n01ThePathHere")}
            </div>
            <h2 style={{ margin: "0", fontSize: "clamp(31px,3.8vw,56px)", lineHeight: "1", letterSpacing: "-0.045em", fontWeight: "600", maxWidth: "900px", textWrap: "balance" }}>
              {v.t("About.fourChapters")}{" "}
              <span style={{ color: "#F97316" }}>
                {v.t("About.oneLesson")}
              </span>
              {" "}{v.t("About.each")}
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {(v.path ?? []).map((p, $index) => (<Fragment key={$index}>
              {" "}
              <div className="ab-ch" style={{ display: "grid", gridTemplateColumns: "80px minmax(0,1fr) minmax(0,1.3fr)", gap: "32px", padding: "32px 0", borderTop: "1px solid #3D1F20", alignItems: "baseline" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#F97316" }}>
                  {p?.n}
                </span>
                <span style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontSize: "clamp(24px,2.6vw,36px)", fontWeight: "600", letterSpacing: "-0.03em" }}>
                    {p?.t}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#927A6D" }}>
                    {p?.when}
                  </span>
                </span>
                <span style={{ fontSize: "16px", lineHeight: "1.6", color: "#CBB7A8" }}>
                  {p?.d}
                </span>
              </div>
              {" "}
            </Fragment>))}
          </div>
        </div>
      </div>
      <div data-screen-label="02 Principles" style={{ padding: "120px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "56px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#F97316" }}>
            {v.t("About.n02HowIWork")}
          </div>
          <h2 style={{ margin: "0", fontSize: "clamp(31px,3.8vw,56px)", lineHeight: "1", letterSpacing: "-0.045em", fontWeight: "600" }}>
            {v.t("About.threeRulesIDonTBend")}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: "40px 32px" }}>
          {(v.rules ?? []).map((r, $index) => (<Fragment key={$index}>
            {" "}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", borderTop: "1px solid #17090A", paddingTop: "22px" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "56px", lineHeight: "1", color: "#F97316" }}>
                {r?.n}
              </span>
              <span style={{ fontSize: "26px", fontWeight: "600", letterSpacing: "-0.03em" }}>
                {r?.t}
              </span>
              <span style={{ fontSize: "15px", lineHeight: "1.55", color: "#3D2B27" }}>
                {r?.d}
              </span>
            </div>
            {" "}
          </Fragment>))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: "14px", paddingTop: "24px" }}>
          <div style={{ aspectRatio: "4/3", borderRadius: "20px", overflow: "hidden" }}>
            <ImageSlot src={opt("/images/rialto-run.jpg")} alt={v.t("About.atWorkPhoto")} shape="rounded" radius={20} />
          </div>
          <div style={{ aspectRatio: "4/3", borderRadius: "20px", overflow: "hidden" }}>
            <ImageSlot src={opt("/images/rialto-about.jpg")} alt={v.t("About.eichstattPhoto")} shape="rounded" radius={20} />
          </div>
          <div style={{ aspectRatio: "4/3", borderRadius: "20px", overflow: "hidden" }}>
            <ImageSlot src={opt("/images/rialto-understand.jpg")} alt={v.t("About.withAClientPhoto")} shape="rounded" radius={20} />
          </div>
        </div>
      </div>
      <PillarClose t={v.t} label={v.t("About.closeLabel")} head={v.t("About.talkToThePersonWho")} accent={v.t("About.buildsIt")} body={v.t("About.closeBody")} />
      <Footer  />
    </>
  );
};

export default function AboutPage(props) {
  const dc = useDC();
  return <Logic key={dc.locale} {...dc} {...props} />;
}
