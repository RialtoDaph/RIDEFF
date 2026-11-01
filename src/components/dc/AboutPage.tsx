// @ts-nocheck -- ported 1:1 from rideff_handoff/design/RIDEFF About.dc.html (see scripts/dc-port/convert.mjs)
'use client';
import React, { Fragment } from 'react';
import { DCLogic, dcStyle, useDC } from '@/lib/dc';
import Nav from '@/components/dc/Nav';
import { ImageSlot } from '@/lib/dc';
import Footer from '@/components/dc/Footer';

class Logic extends DCLogic {
  renderVals() {
    return {
      path: [[this.props.t("About.exportImport"), this.props.t("About.chapterOneYears"), this.props.t("About.movingGoodsBetweenCountriesTaughtMe")], [this.props.t("About.socialMedia"), this.props.t("About.chapterTwoYears"), this.props.t("About.runningChannelsForBrandsTaughtMe")], [this.props.t("About.sellingOnline"), this.props.t("About.chapterThreeYears"), this.props.t("About.myOwnECommerceTaughtMe")], ['RIDEFF', this.props.t("About.nowEichstatt"), this.props.t("About.soIBuiltTheThingI")]].map((p, k) => ({
        n: '0' + (k + 1),
        t: p[0],
        when: p[1],
        d: p[2]
      })),
      rules: [['i', this.props.t("About.noHandoffs"), this.props.t("About.thePersonOnYourFirstCall")], ['ii', this.props.t("About.youStayInControl"), this.props.t("About.aIDraftsAndSortsYouApprove")], ['iii', this.props.t("About.yourDataStaysInTheEU"), this.props.t("About.hostedInFrankfurtBackedUpDaily")]].map(r => ({
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
      <style dangerouslySetInnerHTML={{ __html: "body{margin:0;background:#ECE8E1;color:#0A0A0A;font-family:var(--font-sans);-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}a:hover{color:#FF6A00}" }} />
      <Nav active="about" />
      <div data-screen-label="Hero" style={{ padding: "140px clamp(20px,3vw,40px) 100px", maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "56px", alignItems: "end" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
            {v.t("About.home")}{" "}
            <span style={{ color: "#0A0A0A" }}>
              {v.t("About.about")}
            </span>
          </div>
          <h1 style={{ margin: "0", fontSize: "clamp(56px,7.4vw,116px)", lineHeight: ".92", letterSpacing: "-0.055em", fontWeight: "600", textWrap: "balance" }}>
            {v.t("About.iMRialtoI")}{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", color: "#FF6A00" }}>
              {v.t("About.get")}
            </span>
            {" "}{v.t("About.theAISoYouDonT")}
          </h1>
          <p style={{ margin: "0", maxWidth: "480px", fontSize: "19px", lineHeight: "1.55", color: "#3A3731", textWrap: "pretty" }}>
            {v.t("About.beforeRIDEFFITradedGoodsAcross")}
          </p>
          <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#5A5650" }}>
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
            <ImageSlot src="/images/rialto-about-v2.jpg" alt={v.t("About.rialtoPortraitWarmLight")} shape="rounded" radius={24} />
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#5A5650" }}>
            {v.t("About.rialtoFounderOperatorRIDEFF")}
          </span>
        </div>
      </div>
      <div data-screen-label="01 Path" style={{ background: "#0B0B0C", color: "#F4F4F2" }}>
        {" "}
        <div style={{ padding: "120px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "56px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
              {v.t("About.n01ThePathHere")}
            </div>
            <h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: "1", letterSpacing: "-0.045em", fontWeight: "600", maxWidth: "900px", textWrap: "balance" }}>
              {v.t("About.fourChapters")}{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", color: "#FF6A00" }}>
                {v.t("About.oneLesson")}
              </span>
              {" "}{v.t("About.each")}
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {(v.path ?? []).map((p, $index) => (<Fragment key={$index}>
              {" "}
              <div style={{ display: "grid", gridTemplateColumns: "80px minmax(0,1fr) minmax(0,1.3fr)", gap: "32px", padding: "32px 0", borderTop: "1px solid #2A2A2C", alignItems: "baseline" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
                  {p?.n}
                </span>
                <span style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontSize: "clamp(24px,2.6vw,36px)", fontWeight: "600", letterSpacing: "-0.03em" }}>
                    {p?.t}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#8C877E" }}>
                    {p?.when}
                  </span>
                </span>
                <span style={{ fontSize: "16px", lineHeight: "1.6", color: "#B8B3AA" }}>
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
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
            {v.t("About.n02HowIWork")}
          </div>
          <h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: "1", letterSpacing: "-0.045em", fontWeight: "600" }}>
            {v.t("About.threeRulesIDonTBend")}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "40px" }}>
          {(v.rules ?? []).map((r, $index) => (<Fragment key={$index}>
            {" "}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", borderTop: "1px solid #0A0A0A", paddingTop: "22px" }}>
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "56px", lineHeight: "1", color: "#FF6A00" }}>
                {r?.n}
              </span>
              <span style={{ fontSize: "26px", fontWeight: "600", letterSpacing: "-0.03em" }}>
                {r?.t}
              </span>
              <span style={{ fontSize: "15px", lineHeight: "1.55", color: "#3A3731" }}>
                {r?.d}
              </span>
            </div>
            {" "}
          </Fragment>))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: "14px", paddingTop: "24px" }}>
          <div style={{ aspectRatio: "4/3", borderRadius: "20px", overflow: "hidden" }}>
            <ImageSlot src="/images/rialto-run.jpg" alt={v.t("About.atWorkPhoto")} shape="rounded" radius={20} />
          </div>
          <div style={{ aspectRatio: "4/3", borderRadius: "20px", overflow: "hidden" }}>
            <ImageSlot src="/images/rialto-about.jpg" alt={v.t("About.eichstattPhoto")} shape="rounded" radius={20} />
          </div>
          <div style={{ aspectRatio: "4/3", borderRadius: "20px", overflow: "hidden" }}>
            <ImageSlot src="/images/rialto-understand.jpg" alt={v.t("About.withAClientPhoto")} shape="rounded" radius={20} />
          </div>
        </div>
      </div>
      <div data-screen-label="Start" style={{ background: "#0B0B0C", color: "#F4F4F2" }}>
        {" "}
        <div style={{ padding: "120px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px" }}>
          <h2 style={{ margin: "0", fontSize: "clamp(42px,5.6vw,88px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", maxWidth: "1000px", textWrap: "balance" }}>
            {v.t("About.talkToThePersonWho")}{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", color: "#FF6A00" }}>
              {v.t("About.buildsIt")}
            </span>
          </h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a href="https://wa.me/4917632572420" style={{ background: "#FF6A00", color: "#0A0A0A", borderRadius: "999px", padding: "16px 26px", fontWeight: "600", fontSize: "15px" }}>
              {v.t("About.whatsAppRialto")}
            </a>
            <a href={v.href("/contact")} style={{ border: "1px solid #F4F4F2", borderRadius: "999px", padding: "16px 26px", fontWeight: "500", fontSize: "15px" }}>
              {v.t("About.book15Min")}
            </a>
          </div>
        </div>
      </div>
      <Footer  />
    </>
  );
};

export default function AboutPage(props) {
  const dc = useDC();
  return <Logic key={dc.locale} {...dc} {...props} />;
}
