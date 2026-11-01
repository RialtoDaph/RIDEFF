// @ts-nocheck -- ported 1:1 from rideff_handoff/design/RIDEFF Contact.dc.html (see scripts/dc-port/convert.mjs)
'use client';
import React, { Fragment } from 'react';
import { DCLogic, dcStyle, useDC } from '@/lib/dc';
import Nav from '@/components/dc/Nav';
import Footer from '@/components/dc/Footer';

class Logic extends DCLogic {
  state = {
    fName: '',
    fContact: '',
    fMsg: '',
    need: null,
    clock: ''
  };
  componentDidMount() {
    const t = () => this.setState({
      clock: new Date().toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Berlin'
      })
    });
    t();
    this.i = setInterval(t, 30000);
  }
  componentWillUnmount() {
    clearInterval(this.i);
  }
  renderVals() {
    const s = this.state;
    const msg = this.props.t('common.waIntro', { name: s.fName || '…', contact: s.fContact || '…', need: s.need || this.props.t('common.waNotSure') }) + (s.fMsg ? ' ' + s.fMsg : '');
    return {
      clock: s.clock,
      fName: s.fName,
      fContact: s.fContact,
      fMsg: s.fMsg,
      setName: e => this.setState({
        fName: e.target.value
      }),
      setContact: e => this.setState({
        fContact: e.target.value
      }),
      setMsg: e => this.setState({
        fMsg: e.target.value
      }),
      needs: [this.props.t("Contact.aISystem"), this.props.t("Contact.teamApp"), this.props.t("Contact.websiteShop"), 'RIDEFF Life', this.props.t("Contact.notSureYet")].map(t => {
        const on = s.need === t;
        return {
          t,
          bg: on ? '#FF6A00' : 'transparent',
          fg: on ? '#0A0A0A' : '#F4F4F2',
          bd: on ? '#FF6A00' : '#3A3A3C',
          go: () => this.setState({
            need: on ? null : t
          })
        };
      }),
      waHref: 'https://wa.me/4917632572420?text=' + encodeURIComponent(msg)
    };
  }
}

Logic.prototype.render = function render() {
  const v = { ...this.props, ...this.renderVals() };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: "body{margin:0;background:#0B0B0C;color:#F4F4F2;font-family:var(--font-sans);-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}a:hover{color:#FF9A50}input,textarea{font-family:inherit}" }} />
      <Nav active="contact" dark={true} />
      <div data-screen-label="Contact" style={{ padding: "150px clamp(20px,3vw,40px) 120px", maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "64px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
            {v.t("Contact.home")}{" "}
            <span style={{ color: "#F4F4F2" }}>
              {v.t("Contact.contact")}
            </span>
          </div>
          <h1 style={{ margin: "0", fontSize: "clamp(50px,6.4vw,100px)", lineHeight: ".94", letterSpacing: "-0.05em", fontWeight: "600", textWrap: "balance" }}>
            {v.t("Contact.gotAProblemWorth")}{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", color: "#FF6A00" }}>
              {v.t("Contact.n15Minutes")}
            </span>
          </h1>
          <p style={{ margin: "0", fontSize: "18px", lineHeight: "1.55", color: "#B8B3AA", maxWidth: "480px" }}>
            {v.t("Contact.bringTheRealProblemLeaveWith")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #2A2A2C" }}>
            <a href="https://wa.me/4917632572420?text=Hi%20Rialto%2C%20I%20found%20rideff.com%20and%20I%27d%20like%20to%20talk%20about%20a%20project." style={{ display: "flex", justifyContent: "space-between", gap: "20px", padding: "22px 0", borderBottom: "1px solid #2A2A2C" }}>
              <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <b style={{ fontSize: "20px", fontWeight: "600" }}>
                  {"WhatsApp +49 176 32572420"}
                </b>
                <span style={{ fontSize: "14px", color: "#8C877E" }}>
                  {v.t("Contact.rialtoFastestWayIn")}
                </span>
              </span>
              <span style={{ fontSize: "22px" }}>
                {"↗"}
              </span>
            </a>
            <a href="#" style={{ display: "flex", justifyContent: "space-between", gap: "20px", padding: "22px 0", borderBottom: "1px solid #2A2A2C" }}>
              <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <b style={{ fontSize: "20px", fontWeight: "600" }}>
                  {v.t("Contact.book15Minutes")}
                </b>
                <span style={{ fontSize: "14px", color: "#8C877E" }}>
                  {v.t("Contact.freeFirstCallCalComLink")}
                </span>
              </span>
              <span style={{ fontSize: "22px" }}>
                {"↗"}
              </span>
            </a>
            <a href="mailto:hallo@rideff.com" style={{ display: "flex", justifyContent: "space-between", gap: "20px", padding: "22px 0", borderBottom: "1px solid #2A2A2C" }}>
              <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <b style={{ fontSize: "20px", fontWeight: "600" }}>
                  {"hallo@rideff.com"}
                </b>
                <span style={{ fontSize: "14px", color: "#8C877E" }}>
                  {v.t("Contact.forLongerBriefs")}
                </span>
              </span>
              <span style={{ fontSize: "22px" }}>
                {"↗"}
              </span>
            </a>
          </div>
          <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#8C877E" }}>
            <span>
              {v.t("Contact.eichstattX", { x: v.clock })}
            </span>
            <span>
              {v.t("Contact.remoteEU")}
            </span>
            <span>
              {v.t("Contact.germanEnglish")}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", background: "#161618", borderRadius: "26px", padding: "clamp(24px,3vw,40px)", alignSelf: "start" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", overflow: "hidden", flexShrink: "0" }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "repeating-linear-gradient(135deg,#2A2A2C 0 5px,#222224 5px 10px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: "13px", color: "#8C877E" }}>
                {"R"}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <b style={{ fontSize: "17px" }}>
                {v.t("Contact.freeCall15Min11")}
              </b>
              <span style={{ fontSize: "14px", color: "#8C877E" }}>
                {v.t("Contact.threeQuickQuestionsILlReply")}
              </span>
            </div>
          </div>
          <input value={v.fName ?? ''} onChange={v.setName} placeholder={v.t("Contact.yourName")} style={{ background: "#0B0B0C", border: "1px solid #2A2A2C", borderRadius: "12px", padding: "15px 16px", color: "#F4F4F2", fontSize: "15px", outline: "none" }} />
          <input value={v.fContact ?? ''} onChange={v.setContact} placeholder={v.t("Contact.whatsAppNumberOrEmail")} style={{ background: "#0B0B0C", border: "1px solid #2A2A2C", borderRadius: "12px", padding: "15px 16px", color: "#F4F4F2", fontSize: "15px", outline: "none" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ fontSize: "14px", color: "#B8B3AA" }}>
              {v.t("Contact.whatDoYouNeed")}
            </span>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(v.needs ?? []).map((n, $index) => (<Fragment key={$index}>
                <button onClick={n?.go} style={{ cursor: "pointer", borderRadius: "999px", padding: "9px 15px", font: "500 14px var(--font-sans)", border: `1px solid ${n?.bd ?? ''}`, background: `${n?.bg ?? ''}`, color: `${n?.fg ?? ''}` }}>
                  {n?.t}
                </button>
              </Fragment>))}
            </div>
          </div>
          <textarea value={v.fMsg ?? ''} onChange={v.setMsg} placeholder={v.t("Contact.anythingElseOptional")} rows="3" style={{ background: "#0B0B0C", border: "1px solid #2A2A2C", borderRadius: "12px", padding: "15px 16px", color: "#F4F4F2", fontSize: "15px", outline: "none", resize: "vertical" }} />
          <a href={v.waHref} style={{ marginTop: "8px", textAlign: "center", background: "#FF6A00", color: "#0A0A0A", borderRadius: "999px", padding: "16px 22px", fontWeight: "600", fontSize: "15px" }}>
            {v.t("Contact.bookMyFreeSlot")}
          </a>
          <span style={{ fontSize: "12px", color: "#6B675F" }}>
            {v.t("Contact.yourDetailsAreOnlyUsedTo")}
          </span>
        </div>
      </div>
      <Footer  />
    </>
  );
};

export default function ContactPage(props) {
  const dc = useDC();
  return <Logic key={dc.locale} {...dc} {...props} />;
}
