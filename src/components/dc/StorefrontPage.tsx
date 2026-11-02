// @ts-nocheck -- ported 1:1 from rideff_handoff/design/RIDEFF Storefront.dc.html (see scripts/dc-port/convert.mjs)
'use client';
import React, { Fragment } from 'react';
import { DCLogic, dcStyle, opt, useDC } from '@/lib/dc';
import Nav from '@/components/dc/Nav';
import { ImageSlot } from '@/lib/dc';
import Footer from '@/components/dc/Footer';

class Logic extends DCLogic {
  state = {
    front: 1,
    layer: 0
  };
  LAYERS = [[this.props.t("Storefront.interface"), this.props.t("Storefront.whatYourCustomersSee"), this.props.t("Storefront.cleanPagesClearProductsACheckout")], [this.props.t("Storefront.system"), this.props.t("Storefront.whatHappensBehindIt"), this.props.t("Storefront.everyOrderFlowsIntoYourRIDEFF")], [this.props.t("Storefront.spec"), this.props.t("Storefront.whatItRunsOn"), this.props.t("Storefront.fastPagesEUHostingInFrankfurt")]];
  renderVals() {
    const s = this.state,
      L = this.LAYERS[s.layer];
    const pos = [['0%', '10%', '52%', '78%', 'ticoriginals.com', 'sf-win-1', this.props.t("Storefront.tICOriginalsHomepage")], ['26%', '0%', '50%', '82%', 'shop.ticoriginals.com', 'sf-win-2', this.props.t("Storefront.tICOriginalsShop")], ['50%', '14%', '50%', '76%', this.props.t("Storefront.yourBusinessDe"), 'sf-win-3', this.props.t("Storefront.yourNextSitePlaceholder")]];
    return {
      windows: pos.map((p, k) => ({
        l: p[0],
        t: p[1],
        w: p[2],
        h: p[3],
        url: p[4],
        id: p[5],
        ph: p[6],
        src: [opt("/images/tic-hero.png"), opt("/images/tic-shopall.png"), opt("/images/mami-hero.png")][k],
        z: k === s.front ? 3 : k === 1 ? 2 : 1,
        y: k === s.front ? '-14px' : '0',
        sh: k === s.front ? '.22' : '.1',
        go: () => this.setState({
          front: k
        })
      })),
      layers: this.LAYERS.map((l, k) => ({
        n: '0' + (k + 1),
        t: l[0],
        bg: k === s.layer ? '#0A0A0A' : 'transparent',
        fg: k === s.layer ? '#F4F4F2' : '#3A3731',
        go: () => this.setState({
          layer: k
        })
      })),
      isUi: s.layer === 0,
      isSys: s.layer === 1,
      isSpec: s.layer === 2,
      layerNum: '0' + (s.layer + 1),
      layerHead: L[1],
      layerBody: L[2],
      included: [[this.props.t("Storefront.design"), this.props.t("Storefront.builtAroundYourBusinessNotA")], [this.props.t("Storefront.shopPayments"), this.props.t("Storefront.productsBookingsOrBothCardSEPA")], [this.props.t("Storefront.speedSearch"), this.props.t("Storefront.fastPagesAndCleanStructureSo")], [this.props.t("Storefront.hostingDomain"), this.props.t("Storefront.eUHostingInFrankfurtYourOwn")]].map((f, k) => ({
        n: '0' + (k + 1),
        t: f[0],
        d: f[1]
      })),
      chain: [this.props.t("Storefront.visit"), this.props.t("Storefront.product"), this.props.t("Storefront.checkout"), this.props.t("Storefront.stockUpdate"), this.props.t("Storefront.invoice")].map((t, k, a) => ({
        t,
        a: k < a.length - 1 ? '→' : ''
      }))
    };
  }
}

Logic.prototype.render = function render() {
  const v = { ...this.props, ...this.renderVals() };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: "body{margin:0;background:#ECE8E1;color:#0A0A0A;font-family:var(--font-sans);-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}a:hover{color:#FF6A00}" }} />
      <Nav active="build" />
      <div data-screen-label="Hero" style={{ padding: "140px clamp(20px,3vw,40px) 60px", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "56px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))", gap: "40px", alignItems: "end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
              {v.t("Storefront.home")}{" "}
              <a href={v.href("/build")}>
                {v.t("Storefront.build")}
              </a>
              {" / "}
              <span style={{ color: "#0A0A0A" }}>
                {v.t("Storefront.webShops")}
              </span>
              {" · 02.3"}
            </div>
            <h1 style={{ margin: "0", fontSize: "clamp(50px,6.6vw,104px)", lineHeight: ".94", letterSpacing: "-0.05em", fontWeight: "600", textWrap: "balance" }}>
              {v.t("Storefront.aShopWindowThatNever")}{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", color: "#FF6A00" }}>
                {v.t("Storefront.closes")}
              </span>
            </h1>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <p style={{ margin: "0", fontSize: "19px", lineHeight: "1.5", color: "#3A3731", maxWidth: "480px", textWrap: "pretty" }}>
              {v.t("Storefront.websitesAndOnlineShopsOnEU")}
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a href={v.href("/contact")} style={{ background: "#0A0A0A", color: "#F4F4F2", borderRadius: "999px", padding: "15px 24px", fontWeight: "600", fontSize: "15px" }}>
                {v.t("Storefront.startYourSite")}
              </a>
              <a href="#sf-case" style={{ border: "1px solid #0A0A0A", borderRadius: "999px", padding: "15px 24px", fontWeight: "500", fontSize: "15px" }}>
                {v.t("Storefront.seeTICOriginals")}
              </a>
            </div>
          </div>
        </div>
        <div style={{ position: "relative", height: "clamp(380px,48vw,640px)" }}>
          {" "}
          {(v.windows ?? []).map((w, $index) => (<Fragment key={$index}>
            {" "}
            <div onMouseEnter={w?.go} style={{ position: "absolute", left: `${w?.l ?? ''}`, top: `${w?.t ?? ''}`, width: `${w?.w ?? ''}`, height: `${w?.h ?? ''}`, borderRadius: "16px", overflow: "hidden", background: "#F7F5F1", boxShadow: `0 30px 70px rgba(10,10,10,${w?.sh ?? ''})`, zIndex: `${w?.z ?? ''}`, transform: `translateY(${w?.y ?? ''})`, transition: "transform .5s cubic-bezier(.2,.8,.2,1),box-shadow .5s", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: "6px", alignItems: "center", padding: "10px 14px", background: "#E2DDD4", flexShrink: "0" }}>
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#C9C2B6" }} />
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#C9C2B6" }} />
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#C9C2B6" }} />
                <span style={{ marginLeft: "10px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "#5A5650" }}>
                  {w?.url}
                </span>
              </div>
              <div style={{ flex: "1" }}>
                <ImageSlot src={w?.src} alt={w?.ph} shape="rect" />
              </div>
            </div>
            {" "}
          </Fragment>))}
          {" "}
        </div>
      </div>
      <div id="sf-case" data-screen-label="01 Case layers" style={{ padding: "100px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "40px", alignItems: "end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
              {v.t("Storefront.n01TakenApart")}
            </div>
            <h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: "1", letterSpacing: "-0.045em", fontWeight: "600", textWrap: "balance" }}>
              {v.t("Storefront.tICOriginals")}{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400" }}>
                {v.t("Storefront.layerByLayer")}
              </span>
            </h2>
          </div>
          <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.55", color: "#3A3731", maxWidth: "480px" }}>
            {v.t("Storefront.caseSummaryPlaceholderWhatTICOriginals")}
          </p>
        </div>
        <div style={{ display: "flex", gap: "4px", padding: "4px", borderRadius: "999px", background: "#DCD5CA", width: "max-content", maxWidth: "100%", flexWrap: "wrap" }}>
          {(v.layers ?? []).map((l, $index) => (<Fragment key={$index}>
            <button onClick={l?.go} style={{ border: "none", cursor: "pointer", borderRadius: "999px", padding: "10px 20px", font: "500 14px var(--font-sans)", background: `${l?.bg ?? ''}`, color: `${l?.fg ?? ''}` }}>
              {l?.n}{" · "}{l?.t}
            </button>
          </Fragment>))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "40px", alignItems: "center" }}>
          <div style={{ aspectRatio: "16/10", borderRadius: "22px", overflow: "hidden", background: "#0B0B0C" }}>
            {" "}
            {v.isSpec ? (<>
              {" "}
              <div style={{ height: "100%", boxSizing: "border-box", padding: "32px", fontFamily: "var(--font-mono)", fontSize: "14px", lineHeight: "2", color: "#B8B3AA", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span>
                  <span style={{ color: "#FF9A50" }}>
                    {v.t("Storefront.site")}
                  </span>
                  {" ticoriginals.com"}
                </span>
                <span>
                  <span style={{ color: "#FF9A50" }}>
                    {v.t("Storefront.pages")}
                  </span>
                  {" "}{v.t("Storefront.nShop")}
                </span>
                <span>
                  <span style={{ color: "#FF9A50" }}>
                    {v.t("Storefront.payments")}
                  </span>
                  {" "}{v.t("Storefront.cardSEPAKlarna")}
                </span>
                <span>
                  <span style={{ color: "#FF9A50" }}>
                    {v.t("Storefront.hosting")}
                  </span>
                  {" "}{v.t("Storefront.eUFrankfurtSSL")}
                </span>
                <span>
                  <span style={{ color: "#FF9A50" }}>
                    {v.t("Storefront.linked")}
                  </span>
                  {" "}{v.t("Storefront.ordersStockInvoice")}
                </span>
              </div>
              {" "}
            </>) : null}
            {" "}
            {v.isUi ? (<>
              <ImageSlot src={opt("/images/tic-checkout.png")} alt={v.t("Storefront.tICInterfaceScreenshot")} shape="rect" />
            </>) : null}
            {" "}
            {v.isSys ? (<>
              <ImageSlot src={opt("/images/tic-orders.png")} alt={v.t("Storefront.tICSystemBehindTheShop")} shape="rect" />
            </>) : null}
            {" "}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#5A5650" }}>
              {v.layerNum}{" / 03"}
            </span>
            <h3 style={{ margin: "0", fontSize: "clamp(28px,3vw,42px)", letterSpacing: "-0.035em", lineHeight: "1.05", fontWeight: "600" }}>
              {v.layerHead}
            </h3>
            <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.6", color: "#3A3731" }}>
              {v.layerBody}
            </p>
            <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", paddingTop: "8px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <b style={{ fontSize: "32px", letterSpacing: "-0.03em" }}>
                  {"–"}
                </b>
                <span style={{ fontSize: "13px", color: "#5A5650" }}>
                  {v.t("Storefront.loadTimePlaceholder")}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <b style={{ fontSize: "32px", letterSpacing: "-0.03em" }}>
                  {"–"}
                </b>
                <span style={{ fontSize: "13px", color: "#5A5650" }}>
                  {v.t("Storefront.ordersMonthPlaceholder")}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <b style={{ fontSize: "32px", letterSpacing: "-0.03em" }}>
                  {"EU"}
                </b>
                <span style={{ fontSize: "13px", color: "#5A5650" }}>
                  {v.t("Storefront.hostedInFrankfurt")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div data-screen-label="02 Included" style={{ background: "#E3DED5" }}>
        {" "}
        <div style={{ padding: "120px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "56px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
              {v.t("Storefront.n02WhatSInIt")}
            </div>
            <h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: "1", letterSpacing: "-0.045em", fontWeight: "600", maxWidth: "900px", textWrap: "balance" }}>
              {v.t("Storefront.notJustAWebsite")}{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400" }}>
                {v.t("Storefront.theFrontDoor")}
              </span>
              {" "}{v.t("Storefront.ofYourSystem")}
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "40px" }}>
            {(v.included ?? []).map((f, $index) => (<Fragment key={$index}>
              {" "}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", borderTop: "1px solid #0A0A0A", paddingTop: "22px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#5A5650" }}>
                  {f?.n}
                </span>
                <span style={{ fontSize: "26px", fontWeight: "600", letterSpacing: "-0.03em" }}>
                  {f?.t}
                </span>
                <span style={{ fontSize: "15px", lineHeight: "1.55", color: "#3A3731" }}>
                  {f?.d}
                </span>
              </div>
              {" "}
            </Fragment>))}
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", paddingTop: "16px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#5A5650", marginRight: "8px" }}>
              {v.t("Storefront.connected")}
            </span>
            {(v.chain ?? []).map((c, $index) => (<Fragment key={$index}>
              <span style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ background: "#ECE8E1", borderRadius: "999px", padding: "8px 14px", fontSize: "14px" }}>
                  {c?.t}
                </span>
                <span style={{ color: "#FF6A00" }}>
                  {c?.a}
                </span>
              </span>
            </Fragment>))}
          </div>
        </div>
      </div>
      <div data-screen-label="Start" style={{ background: "#0B0B0C", color: "#F4F4F2" }}>
        {" "}
        <div style={{ padding: "120px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
            {v.t("Storefront.startHere")}
          </div>
          <h2 style={{ margin: "0", fontSize: "clamp(42px,5.6vw,88px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", maxWidth: "1000px", textWrap: "balance" }}>
            {v.t("Storefront.yourNextCustomerIsAlreadySearching")}{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", color: "#FF6A00" }}>
              {v.t("Storefront.beThere")}
            </span>
          </h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a href="https://wa.me/4917632572420?text=Hi%20Rialto%2C%20I%27m%20interested%20in%20a%20website%20or%20shop." style={{ background: "#FF6A00", color: "#0A0A0A", borderRadius: "999px", padding: "16px 26px", fontWeight: "600", fontSize: "15px" }}>
              {v.t("Storefront.whatsAppRialto")}
            </a>
            <a href={v.href("/pricing")} style={{ border: "1px solid #F4F4F2", borderRadius: "999px", padding: "16px 26px", fontWeight: "500", fontSize: "15px" }}>
              {v.t("Storefront.seePricing")}
            </a>
          </div>
        </div>
      </div>
      <Footer  />
    </>
  );
};

export default function StorefrontPage(props) {
  const dc = useDC();
  return <Logic key={dc.locale} {...dc} {...props} />;
}
