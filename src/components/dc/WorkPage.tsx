// @ts-nocheck -- ported 1:1 from rideff_handoff/design/RIDEFF Work.dc.html (see scripts/dc-port/convert.mjs)
'use client';
import React, { Fragment } from 'react';
import { DCLogic, dcStyle, opt, useDC } from '@/lib/dc';
import Nav from '@/components/dc/Nav';
import Footer from '@/components/dc/Footer';

class Logic extends DCLogic {}

Logic.prototype.render = function render() {
  const v = { ...this.props, ...this.renderVals() };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: "body{margin:0;background:#ECE8E1;color:#0A0A0A;font-family:var(--font-sans);-webkit-font-smoothing:antialiased}\na{color:inherit;text-decoration:none}a:hover{color:#0A0A0A}" }} />
      <Nav active="work" />
      <div data-screen-label="Hero" style={{ padding: "150px clamp(20px,3vw,40px) 72px", maxWidth: "1360px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
          {v.t("Work.work")}
        </div>
        <h1 style={{ margin: "0", fontSize: "clamp(43px,5.7vw,92px)", lineHeight: ".95", letterSpacing: "-0.055em", fontWeight: "600" }}>
          {v.t("Work.builtLive")}{" "}
          <span style={{ color: "#FF6A00" }}>
            {v.t("Work.running")}
          </span>
        </h1>
        <p style={{ margin: "0", maxWidth: "480px", fontSize: "18px", lineHeight: "1.55", color: "#3A3731", textWrap: "pretty" }}>
          {v.t("Work.everythingHereIsStillMaintainedBy")}
        </p>
      </div>
      <div data-screen-label="Projects" style={{ padding: "0 clamp(20px,3vw,40px) 140px", maxWidth: "1360px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,520px),1fr))", gap: "72px 32px" }}>
        <a href="https://ticoriginals.com" target="_blank" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ aspectRatio: "4/3", borderRadius: "20px", overflow: "hidden", background: "#0E0E10" }}>
            <img src={opt("/images/tic-hero.png")} alt={v.t("Work.tICOriginalsShop")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block", transition: "transform .6s cubic-bezier(.16,1,.3,1)" }} className="hv-ca4294b" />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px" }}>
            <span style={{ fontSize: "28px", fontWeight: "600", letterSpacing: "-0.03em" }}>
              {"TIC Originals"}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#5A5650" }}>
              {v.t("Work.shopDashboardDE")}
            </span>
          </div>
          <p style={{ margin: "-8px 0 0", fontSize: "16px", lineHeight: "1.55", color: "#3A3731", maxWidth: "520px", textWrap: "pretty" }}>
            {v.t("Work.streetwearShopBuiltAroundLimitedDrops")}
          </p>
        </a>
        <a href={v.href("/contact")} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ aspectRatio: "4/3", borderRadius: "20px", overflow: "hidden", background: "#A8183F" }}>
            <img src={opt("/images/mami-hero.png")} alt={v.t("Work.mamiIPatisserieWebsite")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block", transition: "transform .6s cubic-bezier(.16,1,.3,1)" }} className="hv-ca4294b" />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px" }}>
            <span style={{ fontSize: "28px", fontWeight: "600", letterSpacing: "-0.03em" }}>
              {"Mami I Patisserie"}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#5A5650" }}>
              {v.t("Work.siteTeamAppID")}
            </span>
          </div>
          <p style={{ margin: "-8px 0 0", fontSize: "16px", lineHeight: "1.55", color: "#3A3731", maxWidth: "520px", textWrap: "pretty" }}>
            {v.t("Work.familyBakeryInBandungWebsiteSeasonal")}
          </p>
        </a>
        <a href={v.href("@portal")} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ aspectRatio: "4/3", borderRadius: "20px", overflow: "hidden", background: "#DCD5CA", display: "flex", alignItems: "flex-end", padding: "40px", boxSizing: "border-box" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(48px,5vw,72px)", lineHeight: "1" }}>
              {v.t("Work.clientPortal")}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px" }}>
            <span style={{ fontSize: "28px", fontWeight: "600", letterSpacing: "-0.03em" }}>
              {v.t("Work.clientPortal")}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#5A5650" }}>
              {v.t("Work.everyClient")}
            </span>
          </div>
          <p style={{ margin: "-8px 0 0", fontSize: "16px", lineHeight: "1.55", color: "#3A3731", maxWidth: "520px", textWrap: "pretty" }}>
            {v.t("Work.whereClientsApproveOffersPayInvoices")}
          </p>
        </a>
        <a href={v.href("/life")} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ aspectRatio: "4/3", borderRadius: "20px", overflow: "hidden", background: "#F6E9DC" }}>
            <img src={opt("/images/rialto-life-morning.jpg")} alt="RIDEFF Life" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .6s cubic-bezier(.16,1,.3,1)" }} className="hv-ca4294b" />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px" }}>
            <span style={{ fontSize: "28px", fontWeight: "600", letterSpacing: "-0.03em" }}>
              {"RIDEFF Life"}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#5A5650" }}>
              {v.t("Work.personalCockpit")}
            </span>
          </div>
          <p style={{ margin: "-8px 0 0", fontSize: "16px", lineHeight: "1.55", color: "#3A3731", maxWidth: "520px", textWrap: "pretty" }}>
            {v.t("Work.briefingMoneyTimeAndGoalsFor")}
          </p>
        </a>
        <a href={v.href("/demo")} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ aspectRatio: "4/3", borderRadius: "20px", overflow: "hidden", background: "#FF6A00", display: "flex", alignItems: "flex-end", padding: "40px", boxSizing: "border-box" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(48px,5vw,72px)", lineHeight: "1" }}>
              {v.t("Work.businessDemo")}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px" }}>
            <span style={{ fontSize: "28px", fontWeight: "600", letterSpacing: "-0.03em" }}>
              {v.t("Work.businessDemo")}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#5A5650" }}>
              {v.t("Work.clickThrough")}
            </span>
          </div>
          <p style={{ margin: "-8px 0 0", fontSize: "16px", lineHeight: "1.55", color: "#3A3731", maxWidth: "520px", textWrap: "pretty" }}>
            {v.t("Work.aSampleBusinessBrainWithDashboards")}
          </p>
        </a>
        <a href={v.href("/contact")} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ aspectRatio: "4/3", borderRadius: "20px", border: "1.5px dashed #BDB6AA", display: "flex", alignItems: "flex-end", padding: "40px", boxSizing: "border-box", transition: "border-color .3s" }} className="hv-f543883">
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(48px,5vw,72px)", lineHeight: "1", color: "#5A5650" }}>
              {v.t("Work.yourBusiness")}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px" }}>
            <span style={{ fontSize: "28px", fontWeight: "600", letterSpacing: "-0.03em" }}>
              {v.t("Work.nextProject")}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#FF6A00" }}>
              {v.t("Work.start")}
            </span>
          </div>
          <p style={{ margin: "-8px 0 0", fontSize: "16px", lineHeight: "1.55", color: "#3A3731", maxWidth: "520px", textWrap: "pretty" }}>
            {v.t("Work.builtByMeRunByMe")}
          </p>
        </a>
      </div>
      <Footer  />
    </>
  );
};

export default function WorkPage(props) {
  const dc = useDC();
  return <Logic key={dc.locale} {...dc} {...props} />;
}
