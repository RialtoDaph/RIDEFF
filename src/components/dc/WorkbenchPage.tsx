// @ts-nocheck -- ported 1:1 from rideff_handoff/design/RIDEFF Workbench.dc.html (see scripts/dc-port/convert.mjs)
'use client';
import React, { Fragment } from 'react';
import { DCLogic, dcStyle, opt, useDC } from '@/lib/dc';
import Nav from '@/components/dc/Nav';
import { ImageSlot } from '@/lib/dc';
import Footer from '@/components/dc/Footer';

class Logic extends DCLogic {
  state = {
    tab: 0,
    cyc: 0
  };
  SCREENS = [[this.props.t("Workbench.today"), this.props.t("Workbench.everythingForThisShiftOnOne"), [[this.props.t("Workbench.morningShift"), '08:00 – 14:00', this.props.t("Workbench.now"), '#FF9A50'], [this.props.t("Workbench.openChecklist"), this.props.t("Workbench.n6Of9Done"), '67%', '#B8B3AA'], [this.props.t("Workbench.deliveryExpected"), '10:30', this.props.t("Workbench.soon"), '#B8B3AA'], [this.props.t("Workbench.teamMeeting"), 'Fri 15:00', this.props.t("Workbench.fri"), '#B8B3AA'], [this.props.t("Workbench.messageFromRialto"), this.props.t("Workbench.newFeatureLive"), this.props.t("Workbench.new"), '#FF9A50']]], [this.props.t("Workbench.shifts"), this.props.t("Workbench.planSwapAndConfirmNoGroup"), [[this.props.t("Workbench.monLena"), '08:00 – 14:00', 'OK', '#B8B3AA'], [this.props.t("Workbench.monJonas"), '14:00 – 20:00', 'OK', '#B8B3AA'], [this.props.t("Workbench.tueMira"), this.props.t("Workbench.swapRequested"), this.props.t("Workbench.ask"), '#FF9A50'], [this.props.t("Workbench.wedLena"), '08:00 – 14:00', 'OK', '#B8B3AA'], [this.props.t("Workbench.thuOpen"), this.props.t("Workbench.needsCover"), this.props.t("Workbench.open"), '#FF9A50']]], [this.props.t("Workbench.tasks"), this.props.t("Workbench.checklistsWithPhotosAndNotesAttached"), [[this.props.t("Workbench.openUp"), 'Done by Lena · 07:58', '✓', '#FF9A50'], [this.props.t("Workbench.checkStock"), this.props.t("Workbench.doneByJonas"), '✓', '#FF9A50'], [this.props.t("Workbench.cleanStation2"), this.props.t("Workbench.photoAttached"), '✓', '#FF9A50'], [this.props.t("Workbench.orderSupplies"), 'Due 12:00', '–', '#B8B3AA'], [this.props.t("Workbench.closeDown"), 'Due 20:00', '–', '#B8B3AA']]], [this.props.t("Workbench.chat"), this.props.t("Workbench.oneThreadPerTopicNotOne"), [[this.props.t("Workbench.shiftSwapTue"), 'Mira: can anyone take it?', '2', '#FF9A50'], [this.props.t("Workbench.delivery"), 'Jonas: arrived, all good', '', '#B8B3AA'], [this.props.t("Workbench.newMenu"), this.props.t("Workbench.photosUploaded"), '5', '#FF9A50'], [this.props.t("Workbench.holidayPlan"), 'Lena: August?', '', '#B8B3AA'], [this.props.t("Workbench.general"), this.props.t("Workbench.haveAGoodWeekend"), '', '#B8B3AA']]]];
  NOTES = [[this.props.t("Workbench.shift"), this.props.t("Workbench.miraSwappedTueThu")], [this.props.t("Workbench.tasks"), this.props.t("Workbench.n3Of4OpeningTasksDone")], [this.props.t("Workbench.checkIn"), 'Jonas checked in · 07:56'], [this.props.t("Workbench.chat"), this.props.t("Workbench.newPhotoInDelivery")]];
  componentDidMount() {
    this.t = setInterval(() => this.setState(s => ({
      cyc: s.cyc + 1
    })), 3200);
  }
  componentWillUnmount() {
    clearInterval(this.t);
  }
  renderVals() {
    const s = this.state,
      sc = this.SCREENS[s.tab];
    const notes = [0, 1, 2, 3].map(k => this.NOTES[(k + s.cyc) % 4]);
    return {
      notes: notes.map((n, k) => ({
        k: n[0],
        t: n[1],
        bg: k === 0 ? '#FF6A00' : '#1C1C1E',
        fg: k === 0 ? '#0A0A0A' : '#F4F4F2',
        delay: k * 80 + 'ms',
        key: s.cyc + '-' + k
      })),
      features: [[this.props.t("Workbench.shifts"), this.props.t("Workbench.planTheWeekSwapShiftsSee")], [this.props.t("Workbench.tasksChecklists"), this.props.t("Workbench.openingClosingQualityChecksPhotosAnd")], [this.props.t("Workbench.checkIn"), this.props.t("Workbench.oneTapWhenWorkStartsHours")], [this.props.t("Workbench.teamChat"), this.props.t("Workbench.oneThreadPerTopicSoNothing")]].map((f, k) => ({
        n: '0' + (k + 1),
        t: f[0],
        d: f[1]
      })),
      tabs: this.SCREENS.map((x, k) => ({
        n: '0' + (k + 1),
        t: x[0],
        d: x[1],
        op: k === s.tab ? 1 : 0.45,
        go: () => this.setState({
          tab: k
        })
      })),
      screenTitle: sc[0],
      screenRows: sc[2].map((r, k) => ({
        a: r[0],
        b: r[1],
        s: r[2],
        c: r[3],
        delay: k * 60 + 'ms'
      })),
      who: [['wb-who-1', this.props.t("Workbench.retailTeamPhoto"), this.props.t("Workbench.atTheCounter"), this.props.t("Workbench.shopsAndShowroomsWithChangingShifts")], ['wb-who-2', this.props.t("Workbench.fieldCrewPhoto"), this.props.t("Workbench.inTheField"), this.props.t("Workbench.crewsOnTheRoadWhoNeed")], ['wb-who-3', this.props.t("Workbench.hospitalityTeamPhoto"), this.props.t("Workbench.onTheFloor"), this.props.t("Workbench.hospitalityAndServiceTeamsRunningOn")], ['wb-who-4', this.props.t("Workbench.practiceTeamPhoto"), this.props.t("Workbench.inThePractice"), this.props.t("Workbench.smallOfficesWhereEveryoneWearsThree")]].map((w, k) => ({
        id: w[0],
        ph: w[1],
        t: w[2],
        d: w[3],
        src: [opt("/images/site-laden.jpg"), opt("/images/site-handwerk.jpg"), opt("/images/site-hotel.jpg"), opt("/images/site-praxis.jpg")][k]
      }))
    };
  }
}

Logic.prototype.render = function render() {
  const v = { ...this.props, ...this.renderVals() };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: "body{margin:0;background:#E4DED4;color:#0A0A0A;font-family:var(--font-sans);-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}a:hover{color:#FF6A00}@keyframes rdIn{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}" }} />
      <Nav active="build" />
      <div data-screen-label="Hero" style={{ padding: "140px clamp(20px,3vw,40px) 80px", maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))", gap: "56px", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
            {v.t("Workbench.home")}{" "}
            <a href={v.href("/build")}>
              {v.t("Workbench.build")}
            </a>
            {" / "}
            <span style={{ color: "#0A0A0A" }}>
              {v.t("Workbench.teamApps")}
            </span>
            {" · 02.2"}
          </div>
          <h1 style={{ margin: "0", fontSize: "clamp(50px,6.4vw,100px)", lineHeight: ".94", letterSpacing: "-0.05em", fontWeight: "600", textWrap: "balance" }}>
            {v.t("Workbench.teamAppsBuiltAroundHowYour")}{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", color: "#FF6A00" }}>
              {v.t("Workbench.works")}
            </span>
          </h1>
          <p style={{ margin: "0", maxWidth: "480px", fontSize: "19px", lineHeight: "1.5", color: "#3A3731", textWrap: "pretty" }}>
            {v.t("Workbench.shiftsTasksChecklistsAndChatIn")}
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a href={v.href("/contact")} style={{ background: "#0A0A0A", color: "#F4F4F2", borderRadius: "999px", padding: "15px 24px", fontWeight: "600", fontSize: "15px" }}>
              {v.t("Workbench.bringYourTeamSChaos")}
            </a>
            <a href="#wb-inside" style={{ border: "1px solid #0A0A0A", borderRadius: "999px", padding: "15px 24px", fontWeight: "500", fontSize: "15px" }}>
              {v.t("Workbench.seeInsideTheApp")}
            </a>
          </div>
          <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", paddingTop: "12px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <b style={{ fontSize: "28px", letterSpacing: "-0.03em" }}>
                {"1"}
              </b>
              <span style={{ fontSize: "14px", color: "#5A5650" }}>
                {v.t("Workbench.appWholeTeam")}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <b style={{ fontSize: "28px", letterSpacing: "-0.03em" }}>
                {"iOS"}
              </b>
              <span style={{ fontSize: "14px", color: "#5A5650" }}>
                {v.t("Workbench.androidWeb")}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <b style={{ fontSize: "28px", letterSpacing: "-0.03em" }}>
                {"Growth"}
              </b>
              <span style={{ fontSize: "14px", color: "#5A5650" }}>
                {v.t("Workbench.includedFrom")}
              </span>
            </div>
          </div>
        </div>
        <div style={{ position: "relative", minHeight: "600px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: "0", borderRadius: "28px", overflow: "hidden", opacity: ".9" }}>
            <ImageSlot src={opt("/images/site-cafe.jpg")} alt={v.t("Workbench.teamAtWorkPhoto")} shape="rounded" radius={28} />
          </div>
          <div style={{ position: "relative", width: "290px", height: "580px", borderRadius: "44px", background: "#0A0A0A", padding: "14px", boxSizing: "border-box", boxShadow: "0 40px 80px rgba(10,10,10,.3)", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 14px 4px", color: "#F4F4F2", fontSize: "12px", fontWeight: "600" }}>
              <span>
                {"08:02"}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#8C877E" }}>
                {"RIDEFF TEAM"}
              </span>
            </div>
            <div style={{ padding: "6px 12px 10px", color: "#F4F4F2", fontSize: "24px", fontWeight: "600", letterSpacing: "-0.02em" }}>
              {v.t("Workbench.goodMorningLena")}
            </div>
            {(v.notes ?? []).map((n, $index) => (<Fragment key={$index}>
              {" "}
              <div style={{ background: `${n?.bg ?? ''}`, color: `${n?.fg ?? ''}`, borderRadius: "16px", padding: "13px 14px", display: "flex", flexDirection: "column", gap: "3px", animation: "rdIn .5s both", animationDelay: `${n?.delay ?? ''}` }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".06em", textTransform: "uppercase", opacity: ".7" }}>
                  {n?.k}
                </span>
                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                  {n?.t}
                </span>
              </div>
              {" "}
            </Fragment>))}
          </div>
        </div>
      </div>
      <div data-screen-label="01 What it does" style={{ padding: "100px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "56px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
            {v.t("Workbench.n01WhatItDoes")}
          </div>
          <h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: "1", letterSpacing: "-0.045em", fontWeight: "600", maxWidth: "900px", textWrap: "balance" }}>
            {v.t("Workbench.fourThingsEveryTeamNeeds")}{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400" }}>
              {v.t("Workbench.nothingItDoesnT")}
            </span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "40px" }}>
          {(v.features ?? []).map((f, $index) => (<Fragment key={$index}>
            {" "}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", borderTop: "1px solid #0A0A0A", paddingTop: "22px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#5A5650" }}>
                {f?.n}
              </span>
              <span style={{ fontSize: "28px", fontWeight: "600", letterSpacing: "-0.03em" }}>
                {f?.t}
              </span>
              <span style={{ fontSize: "15px", lineHeight: "1.55", color: "#3A3731" }}>
                {f?.d}
              </span>
            </div>
            {" "}
          </Fragment>))}
        </div>
      </div>
      <div id="wb-inside" data-screen-label="02 Inside" style={{ background: "#ECE8E1" }}>
        {" "}
        <div style={{ padding: "120px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "64px", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
              {v.t("Workbench.n02InsideTheApp")}
            </div>
            <h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: "1", letterSpacing: "-0.045em", fontWeight: "600", textWrap: "balance" }}>
              {v.t("Workbench.tapThroughIt")}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #D3CCC0" }}>
              {(v.tabs ?? []).map((t, $index) => (<Fragment key={$index}>
                {" "}
                <button onClick={t?.go} style={{ display: "grid", gridTemplateColumns: "40px minmax(0,1fr)", gap: "16px", textAlign: "left", padding: "20px 0", background: "none", border: "none", borderBottom: "1px solid #D3CCC0", cursor: "pointer", fontFamily: "var(--font-sans)", color: "#0A0A0A", opacity: `${t?.op ?? ''}` }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00", paddingTop: "6px" }}>
                    {t?.n}
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "22px", fontWeight: "600", letterSpacing: "-0.02em" }}>
                      {t?.t}
                    </span>
                    <span style={{ fontSize: "15px", color: "#3A3731" }}>
                      {t?.d}
                    </span>
                  </span>
                </button>
                {" "}
              </Fragment>))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: "300px", height: "600px", borderRadius: "46px", background: "#0A0A0A", padding: "14px", boxSizing: "border-box", boxShadow: "0 40px 80px rgba(10,10,10,.22)", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ padding: "10px 12px 6px", color: "#F4F4F2", fontSize: "22px", fontWeight: "600", letterSpacing: "-0.02em" }}>
                {v.screenTitle}
              </div>
              {(v.screenRows ?? []).map((r, $index) => (<Fragment key={$index}>
                {" "}
                <div style={{ background: "#1C1C1E", borderRadius: "14px", padding: "13px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", color: "#F4F4F2", animation: "rdIn .4s both", animationDelay: `${r?.delay ?? ''}` }}>
                  <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>
                      {r?.a}
                    </span>
                    <span style={{ fontSize: "12px", color: "#8C877E" }}>
                      {r?.b}
                    </span>
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: `${r?.c ?? ''}` }}>
                    {r?.s}
                  </span>
                </div>
                {" "}
              </Fragment>))}
            </div>
          </div>
        </div>
      </div>
      <div data-screen-label="03 Who" style={{ padding: "120px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
            {v.t("Workbench.n03MadeFor")}
          </div>
          <h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: "1", letterSpacing: "-0.045em", fontWeight: "600", maxWidth: "900px", textWrap: "balance" }}>
            {v.t("Workbench.teamsThatDonTSitAt")}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: "14px" }}>
          {(v.who ?? []).map((w, $index) => (<Fragment key={$index}>
            {" "}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ aspectRatio: "4/5", borderRadius: "20px", overflow: "hidden" }}>
                <ImageSlot src={w?.src} alt={w?.ph} shape="rounded" radius={20} />
              </div>
              <span style={{ fontSize: "20px", fontWeight: "600", letterSpacing: "-0.02em" }}>
                {w?.t}
              </span>
              <span style={{ fontSize: "14px", color: "#3A3731", lineHeight: "1.5" }}>
                {w?.d}
              </span>
            </div>
            {" "}
          </Fragment>))}
        </div>
      </div>
      <div data-screen-label="Start" style={{ background: "#0B0B0C", color: "#F4F4F2" }}>
        {" "}
        <div style={{ padding: "120px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
            {v.t("Workbench.startHere")}
          </div>
          <h2 style={{ margin: "0", fontSize: "clamp(42px,5.6vw,88px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", maxWidth: "1000px", textWrap: "balance" }}>
            {v.t("Workbench.bringTheWhatsAppGroupsAndPaper")}{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", color: "#FF6A00" }}>
              {v.t("Workbench.oneApp")}
            </span>
          </h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a href="https://wa.me/4917632572420?text=Hi%20Rialto%2C%20I%27m%20interested%20in%20a%20team%20app." style={{ background: "#FF6A00", color: "#0A0A0A", borderRadius: "999px", padding: "16px 26px", fontWeight: "600", fontSize: "15px" }}>
              {v.t("Workbench.whatsAppRialto")}
            </a>
            <a href={v.href("/pricing")} style={{ border: "1px solid #F4F4F2", borderRadius: "999px", padding: "16px 26px", fontWeight: "500", fontSize: "15px" }}>
              {v.t("Workbench.seePricing")}
            </a>
          </div>
        </div>
      </div>
      <Footer  />
    </>
  );
};

export default function WorkbenchPage(props) {
  const dc = useDC();
  return <Logic key={dc.locale} {...dc} {...props} />;
}
