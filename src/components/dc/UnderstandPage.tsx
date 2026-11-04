// @ts-nocheck -- ported 1:1 from rideff_handoff/design/RIDEFF Understand.dc.html (see scripts/dc-port/convert.mjs)
'use client';
import React, { Fragment } from 'react';
import { DCLogic, dcStyle, prefersReducedMotion, useDC } from '@/lib/dc';
import Nav from '@/components/dc/Nav';
import Footer from '@/components/dc/Footer';

class Logic extends DCLogic {
  state = {
    pp: 0,
    free: false,
    p: 0,
    typed: 0,
    on: [this.props.t("Understand.answeringInquiries"), this.props.t("Understand.writingOffers"), this.props.t("Understand.chasingInvoices")],
    terms: false,
    approved: false,
    stamp: '',
    touch: false,
    mob: false
  };
  stageRef = React.createRef();
  viewRef = React.createRef();
  cleanRef = React.createRef();
  ringRef = React.createRef();
  chatRef = React.createRef();
  offerRef = React.createRef();
  constructor(p) {
    super(p);
    let seed = 7;
    const R = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const S = ['RE: RE: AW: Angebot?', this.props.t("Understand.invoiceFINALV3Xlsx"), this.props.t("Understand.whoCoversSaturday"), this.props.t("Understand.callBackWeber"), this.props.t("Understand.stockAskJonas"), this.props.t("Understand.whatsApp87"), this.props.t("Understand.kundenlisteAltCsv"), this.props.t("Understand.sendInvoice"), this.props.t("Understand.bookingPhoneOrMail"), this.props.t("Understand.passwordOnAPostIt"), this.props.t("Understand.n3UnpaidCheck"), this.props.t("Understand.newInquiryViaInstagram"), this.props.t("Understand.excelCrashedAgain"), this.props.t("Understand.copyPricesToShop"), this.props.t("Understand.terminVerschoben"), this.props.t("Understand.whereIsTheOfferTemplate"), 'Mon 8:00 ??? shift', this.props.t("Understand.pasteIntoBookkeeping"), this.props.t("Understand.supplierRaisedPrices"), this.props.t("Understand.replyLater"), this.props.t("Understand.n2ReviewAnswerIt"), this.props.t("Understand.newsletterNotSent"), this.props.t("Understand.lenaSickSwap"), this.props.t("Understand.printSignScan"), this.props.t("Understand.n14Unread"), 'Fwd: Fwd: delivery'];
    const fonts = [["var(--font-mono)", 'normal'], ["var(--font-sans)", 'normal']];
    this.MESS = [...Array(62)].map((_, i) => {
      const f = fonts[R() * 2 | 0],
        note = R() < .22,
        sz = 13 + R() * (R() < .2 ? 26 : 12);
      return {
        t: S[i % S.length],
        x: 4 + R() * 92 + '%',
        y: 14 + R() * 74 + '%',
        r: ((R() - .5) * 18).toFixed(1) + 'deg',
        ff: f[0],
        fs: f[1],
        sz: sz.toFixed(0) + 'px',
        c: ['#5A5650', '#8C877E', '#3A3731', '#A8A094'][R() * 4 | 0],
        b: (R() < .45 ? R() * 1.6 : 0).toFixed(2) + 'px',
        bg: note ? ['#EFE3C8', '#F4F1EC', '#E8DCCB'][R() * 3 | 0] : 'transparent',
        pad: note ? '8px 10px' : '0',
        td: R() < .1 ? 'line-through' : 'none',
        shadow: note ? '0 6px 14px rgba(10,10,10,.08)' : 'none'
      };
    });
  }
  componentDidMount() {
    this.alive = true;
    this.m = {
      x: innerWidth * .62,
      y: innerHeight * .45,
      tx: innerWidth * .62,
      ty: innerHeight * .45,
      moved: false
    };
    this.r = 0;
    this.onMove = e => {
      const v = this.viewRef.current;
      if (!v) return;
      const b = v.getBoundingClientRect();
      this.m.tx = e.clientX - b.left;
      this.m.ty = e.clientY - b.top;
      this.m.moved = true;
    };
    window.addEventListener('mousemove', this.onMove);
    // Reduced motion: no pinned scrubbing, show the final states.
    if (prefersReducedMotion()) this.setState({ rm: true, p: 1, pp: 1 });
    this.onScroll = () => {
      const st = this.stageRef.current;
      if (!st) return;
      const b = st.getBoundingClientRect();
      const p = this.state.rm ? 1 : Math.max(0, Math.min(1, -b.top / (b.height - innerHeight)));
      if (Math.abs(p - this.state.p) > .004) this.setState({
        p
      });
      // Phones: the offer is not pinned (text + paper don't fit one screen); it prints as it scrolls in.
      const mob = innerWidth < 900;
      if (mob !== this.state.mob) this.setState({ mob });
      const of = this.offerRef.current;
      if (of) {
        const ob = of.getBoundingClientRect(),
          pp = this.state.rm ? 1 : mob ? Math.max(0, Math.min(1, (innerHeight * .9 - ob.top) / (ob.height * .9))) : Math.max(0, Math.min(1, -ob.top / (ob.height - innerHeight) + .15));
        if (Math.abs(pp - this.state.pp) > .004) this.setState({
          pp
        });
      }
      const c = this.chatRef.current;
      if (c && !this.ty && c.getBoundingClientRect().top < innerHeight * .7) {
        this.ty = setInterval(() => {
          if (this.state.typed > 520) return clearInterval(this.ty);
          this.setState(s => ({
            typed: s.typed + 2
          }));
        }, 28);
      }
    };
    window.addEventListener('scroll', this.onScroll, {
      passive: true
    });
    window.addEventListener('resize', this.onScroll);
    this.onScroll();
    const loop = now => {
      if (!this.alive) return;
      this.raf = requestAnimationFrame(loop);
      const v = this.viewRef.current,
        cl = this.cleanRef.current,
        ring = this.ringRef.current;
      if (!v || !cl) return;
      const W = v.clientWidth,
        H = v.clientHeight,
        m = this.m;
      if (!m.moved) {
        const t = now / 1000;
        m.tx = W * (.6 + Math.sin(t * .5) * .14);
        m.ty = H * (.46 + Math.cos(t * .7) * .12);
      }
      m.x += (m.tx - m.x) * .14;
      m.y += (m.ty - m.y) * .14;
      const p = this.state.p,
        e = p < .2 ? 0 : Math.min(1, (p - .2) / .7),
        full = Math.hypot(W, H);
      const target = 120 + (W < 700 ? -30 : 40) + Math.pow(e, 2.2) * full;
      this.r += (target - this.r) * .12;
      const cx = m.x + (W / 2 - m.x) * Math.pow(e, 1.5),
        cy = m.y + (H / 2 - m.y) * Math.pow(e, 1.5);
      const mk = `radial-gradient(circle ${this.r.toFixed(1)}px at ${cx.toFixed(1)}px ${cy.toFixed(1)}px,#000 97%,transparent 100%)`;
      cl.style.webkitMaskImage = mk;
      cl.style.maskImage = mk;
      if (ring) {
        ring.style.transform = `translate(${m.x}px,${m.y}px)`;
        ring.style.opacity = e > .85 ? 0 : 1;
      }
    };
    this.raf = requestAnimationFrame(loop);
  }
  componentWillUnmount() {
    this.alive = false;
    cancelAnimationFrame(this.raf);
    clearInterval(this.ty);
    window.removeEventListener('mousemove', this.onMove);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
  }
  renderVals() {
    const s = this.state,
      p = s.p,
      cap = p < .3 ? 0 : p < .68 ? 1 : 2;
    const CAPS = [['01', this.props.t("Understand.asItFeels"), this.props.t("Understand.yourBusinessFromTheInside"), this.props.t("Understand.threeInboxesASpreadsheetNobodyTrusts")], ['02', this.props.t("Understand.underneath"), this.props.t("Understand.iLookUnderneath"), this.props.t("Understand.inTheAnalysisITraceHow")], ['03', this.props.t("Understand.understood"), this.props.t("Understand.understood2"), this.props.t("Understand.sixAreasTheTasksThatRepeat")]];
    const c = CAPS[cap],
      e = p < .2 ? 0 : Math.min(1, (p - .2) / .7);
    const AREAS = [[this.props.t("Understand.customers"), '#F09E5C', [[this.props.t("Understand.inquiriesFrom3Inboxes"), 4], [this.props.t("Understand.bookings"), 0], [this.props.t("Understand.reviewReplies"), 1]]], [this.props.t("Understand.sales"), '#61C784', [[this.props.t("Understand.offers"), 3], [this.props.t("Understand.followUps"), 2], [this.props.t("Understand.priceList"), 0]]], [this.props.t("Understand.team"), '#55B0E5', [[this.props.t("Understand.shiftPlan"), 2], [this.props.t("Understand.sickDaySwaps"), 0], [this.props.t("Understand.onboarding"), 0]]], [this.props.t("Understand.operations"), '#9E8CF2', [[this.props.t("Understand.stockChecks"), 1], [this.props.t("Understand.supplierOrders"), 0], [this.props.t("Understand.copyToShop"), 1]]], [this.props.t("Understand.finance"), '#E0B740', [[this.props.t("Understand.invoices"), 0], [this.props.t("Understand.reminders"), 1], [this.props.t("Understand.bookkeepingExport"), 0]]], [this.props.t("Understand.marketing"), '#EB7AAA', [[this.props.t("Understand.newsletter"), 0], [this.props.t("Understand.socialPosts"), 0], [this.props.t("Understand.googleReviews"), 0]]]];
    const SINKS = [[this.props.t("Understand.answeringInquiries"), this.props.t("Understand.customers"), 4], [this.props.t("Understand.writingOffers"), this.props.t("Understand.sales"), 3], [this.props.t("Understand.followingUp"), this.props.t("Understand.sales"), 2], [this.props.t("Understand.planningShifts"), this.props.t("Understand.team"), 3], [this.props.t("Understand.updatingStock"), this.props.t("Understand.operations"), 2], [this.props.t("Understand.chasingInvoices"), this.props.t("Understand.finance"), 2], [this.props.t("Understand.copyingDataBetweenTools"), this.props.t("Understand.operations"), 3], [this.props.t("Understand.postingOnSocial"), this.props.t("Understand.marketing"), 2]];
    const per = {};
    AREAS.forEach(a => per[a[0]] = 0);
    SINKS.forEach(x => {
      if (s.on.includes(x[0])) per[x[1]] += x[2];
    });
    const max = Math.max(6, ...Object.values(per)),
      hours = Object.values(per).reduce((a, b) => a + b, 0);
    const CHAT = [['RIDEFF', this.props.t("Understand.howDoesANewCustomerUsually")], [this.props.t("Understand.you"), this.props.t("Understand.emailInstagramSometimesTheyJustCall")], ['RIDEFF', this.props.t("Understand.andWhoWritesTheOfferAnd")], [this.props.t("Understand.you"), this.props.t("Understand.meEveningsMostlyMaybe40Minutes")], ['RIDEFF', this.props.t("Understand.thenThatIsWhereWeStart")]];
    let rem = s.typed;
    const chat = [];
    for (const [who, t] of CHAT) {
      if (rem <= 0) break;
      const n = Math.min(t.length, rem);
      chat.push({
        who,
        t: t.slice(0, n),
        side: who === this.props.t("Understand.you") ? 'flex-end' : 'flex-start',
        bg: who === this.props.t("Understand.you") ? '#0A0A0A' : '#FFFFFF',
        fg: who === this.props.t("Understand.you") ? '#F4F4F2' : '#0A0A0A'
      });
      rem -= t.length + 24;
    }
    const secs = Math.min(900, Math.round(s.typed * 1.6));
    let r2 = s.typed,
      done = 0;
    for (const [, t] of CHAT) {
      if (r2 >= t.length) {
        done++;
        r2 -= t.length + 24;
      } else break;
    }
    const litMap = {
      Customers: done >= 2,
      Sales: done >= 4
    };
    const FACTS = [[2, this.props.t("Understand.inquiriesArriveIn3Channels"), this.props.t("Understand.customers"), '#F09E5C'], [4, this.props.t("Understand.offersTake40MinWrittenAt"), this.props.t("Understand.sales"), '#61C784'], [5, this.props.t("Understand.startWithInboxOffers7H"), this.props.t("Understand.phase1"), '#FF6A00']];
    let sd = 11;
    const Rr = () => (sd = (sd * 9301 + 49297) % 233280) / 233280;
    const order = [...Array(40).keys()].sort(() => Rr() - .5);
    const cellCol = Array(40).fill(null);
    let ci = 0;
    SINKS.forEach(x => {
      if (s.on.includes(x[0])) {
        const col = AREAS.find(a => a[0] === x[1])[1];
        for (let j = 0; j < x[2] && ci < 40; j++) cellCol[order[ci++]] = col;
      }
    });
    const used = ci,
      pE = s.pp < .5 ? 4 * s.pp ** 3 : 1 - (-2 * s.pp + 2) ** 3 / 2;
    return {
      rm: !!(this.state || {}).rm,
      mob: !!s.mob,
      stageRef: this.stageRef,
      viewRef: this.viewRef,
      cleanRef: this.cleanRef,
      ringRef: this.ringRef,
      chatRef: this.chatRef,
      mess: this.MESS,
      clarity: Math.round(8 + e * 92),
      lensMode: e > .9 ? 'full' : 'cursor',
      map: AREAS.map(a => ({
        t: a[0],
        c: a[1],
        tasks: a[2].map(k => ({
          t: k[0],
          tag: k[1] ? this.props.t("Understand.repeats") + k[1] + this.props.t("Understand.hWk") : 'one-off',
          bd: k[1] ? a[1] : '#2A2A2C',
          bg: k[1] ? a[1] + '1F' : '#141416',
          tc: k[1] ? a[1] : '#6B675F'
        }))
      })),
      capNum: c[0],
      capLabel: c[1],
      capHead: c[2],
      capBody: c[3],
      isLast: cap === 2,
      segs: [this.props.t("Understand.asItFeels"), this.props.t("Understand.underneath"), this.props.t("Understand.understood")].map((t, i) => ({
        t,
        w: Math.max(0, Math.min(1, p * 3 - i)) * 100 + '%',
        c: i === cap ? '#0A0A0A' : '#8C877E',
        track: '#D3CCC0'
      })),
      chat,
      callTime: String(Math.floor(secs / 60)).padStart(2, '0') + ':' + String(secs % 60).padStart(2, '0'),
      sinks: SINKS.map(x => {
        const a = s.on.includes(x[0]);
        return {
          t: x[0],
          bg: a ? '#0A0A0A' : 'transparent',
          fg: a ? '#F4F4F2' : '#0A0A0A',
          bd: a ? '#0A0A0A' : '#BDB6AA',
          go: () => this.setState({
            on: a ? s.on.filter(y => y !== x[0]) : [...s.on, x[0]]
          })
        };
      }),
      bars: AREAS.map(a => ({
        t: a[0],
        w: per[a[0]] / max * 100 + '%',
        h: per[a[0]] ? per[a[0]] + ' h' : '–',
        c: per[a[0]] ? '#0A0A0A' : '#8C877E'
      })),
      hours,
      offer: [[this.props.t("Understand.customersAIInbox"), this.props.t("Understand.phase1")], [this.props.t("Understand.salesOffersFollowUps"), this.props.t("Understand.phase1")], [this.props.t("Understand.teamApp"), this.props.t("Understand.phase2")], [this.props.t("Understand.setup"), this.props.t("Understand.from1990")]].map(o => ({
        a: o[0],
        b: o[1]
      })),
      termsBg: s.terms ? '#0A0A0A' : 'transparent',
      termsMark: s.terms ? '✓' : '',
      toggleTerms: () => !s.approved && this.setState({
        terms: !s.terms
      }),
      apBg: s.approved ? '#FF6A00' : '#0A0A0A',
      apOp: s.terms || s.approved ? 1 : .35,
      apLabel: s.approved ? this.props.t("Understand.approved2") : this.props.t("Understand.approve"),
      approve: () => {
        if (s.terms && !s.approved) this.setState({
          approved: true,
          stamp: new Date().toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit'
          })
        });
      },
      approved: s.approved,
      stampTime: s.stamp,
      offerRef: this.offerRef,
      paperY: -100 + Math.min(1, pE * 1.25) * 100 + '%',
      printing: s.pp > .05 && s.pp < .8 ? 1 : 0,
      litCount: Object.values(litMap).filter(Boolean).length,
      hearNodes: AREAS.map(a => {
        const on = !!litMap[a[0]];
        return {
          t: a[0],
          c: on ? a[1] : '#3A3A3C',
          bd: on ? a[1] : '#232325',
          bg: on ? a[1] + '1F' : 'transparent',
          tc: on ? '#F4F4F2' : '#6B675F',
          glow: on ? '0 0 0 5px ' + a[1] + '33' : 'none',
          s: on ? 1 : .96
        };
      }),
      facts: FACTS.filter(f => done >= f[0]).map(f => ({
        t: f[1],
        a: f[2],
        c: f[3]
      })),
      rowsW: [9, 10, 11, 12, 13, 14, 15, 16].map((hr, r) => ({
        h: hr + ':00',
        cells: [0, 1, 2, 3, 4].map(d => {
          const k = r * 5 + d,
            col = cellCol[k],
            gone = s.free && col;
          return {
            bg: col ? col : '#E2DDD4',
            s: gone ? .1 : 1,
            r: gone ? '40deg' : '0deg',
            o: gone ? 0 : 1,
            d: gone ? order.indexOf(k) * 30 + 'ms' : '0ms'
          };
        })
      })),
      toggleFree: () => this.setState({
        free: !s.free
      }),
      freeBg: s.free ? 'transparent' : '#FF6A00',
      freeFg: '#0A0A0A',
      freeLabel: s.free ? this.props.t("Understand.showMyWeekAgain") : this.props.t("Understand.handItToRIDEFF"),
      weekNote: s.free ? this.props.t("Understand.backInYourWeek") : this.props.t("Understand.spentOnWorkThatRepeats"),
      weekBig: (s.free ? '+' : '') + used
    };
  }
}

Logic.prototype.render = function render() {
  const v = { ...this.props, ...this.renderVals() };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: "body{margin:0;background:#ECE8E1;color:#0A0A0A;font-family:var(--font-sans);-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}a:hover{color:#FF6A00}@keyframes rdBlink{0%,49%{opacity:1}50%,100%{opacity:0}}@keyframes rdPulse{0%,100%{opacity:1}50%{opacity:.3}}@keyframes rdIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes rdStamp{0%{transform:scale(2.4) rotate(-14deg);opacity:0}60%{transform:scale(.92) rotate(-14deg);opacity:1}100%{transform:scale(1) rotate(-14deg);opacity:1}}" }} />
      <Nav active="understand" />
      <div ref={v.stageRef} data-screen-label="Lens stage" style={{ height: v.rm ? "auto" : "460vh", position: "relative" }}>
        {" "}
        <div ref={v.viewRef} style={{ position: v.rm ? "relative" : "sticky", top: "0", height: "100vh", overflow: "hidden", background: "#ECE8E1", cursor: "none" }}>
          {" "}
          <div style={{ position: "absolute", inset: "0" }}>
            {" "}
            {(v.mess ?? []).map((m, $index) => (<Fragment key={$index}>
              {" "}
              <span style={{ position: "absolute", left: `${m?.x ?? ''}`, top: `${m?.y ?? ''}`, transform: `translate(-50%,-50%) rotate(${m?.r ?? ''})`, fontFamily: `${m?.ff ?? ''}`, fontStyle: `${m?.fs ?? ''}`, fontSize: `${m?.sz ?? ''}`, color: `${m?.c ?? ''}`, filter: `blur(${m?.b ?? ''})`, background: `${m?.bg ?? ''}`, padding: `${m?.pad ?? ''}`, borderRadius: "6px", whiteSpace: "nowrap", textDecoration: `${m?.td ?? ''}`, boxShadow: `${m?.shadow ?? ''}` }}>
                {m?.t}
              </span>
              {" "}
            </Fragment>))}
            {" "}
          </div>
          {" "}
          <div ref={v.cleanRef} style={{ position: "absolute", inset: "0", background: "#0B0B0C", color: "#F4F4F2", WebkitMaskImage: "radial-gradient(circle 0px at 50% 50%,#000 98%,transparent 100%)", maskImage: "radial-gradient(circle 0px at 50% 50%,#000 98%,transparent 100%)" }}>
            {" "}
            <div style={{ position: "absolute", inset: "0", backgroundImage: "radial-gradient(#232325 1px,transparent 1px)", backgroundSize: "26px 26px" }} />
            {" "}
            <div className="uc-area" style={{ position: "absolute", left: "clamp(20px,3vw,40px)", right: "clamp(20px,3vw,40px)", top: "150px", bottom: "150px", display: "flex", flexDirection: "column", gap: "22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
                <span>
                  {v.t("Understand.yourBusinessUnderstood")}
                </span>
                <span>
                  <b style={{ color: "#FF9A50", fontWeight: "500" }}>
                    {"6"}
                  </b>
                  {" "}{v.t("Understand.areas")}{" "}
                  <b style={{ color: "#FF9A50", fontWeight: "500" }}>
                    {"18"}
                  </b>
                  {" "}{v.t("Understand.tasks")}{" "}
                  <b style={{ color: "#FF9A50", fontWeight: "500" }}>
                    {"8"}
                  </b>
                  {" "}{v.t("Understand.repeat")}{" "}
                  <b style={{ color: "#FF9A50", fontWeight: "500" }}>
                    {"≈15 h"}
                  </b>
                  {" "}{v.t("Understand.week")}
                </span>
              </div>
              <div className="uc-map" style={{ flex: "1", display: "grid", gridTemplateColumns: "repeat(6,minmax(0,1fr))", gap: "14px" }}>
                {(v.map ?? []).map((a, $index) => (<Fragment key={$index}>
                  {" "}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: `2px solid ${a?.c ?? ''}`, paddingTop: "14px" }}>
                    <span style={{ fontSize: "clamp(15px,1.4vw,20px)", fontWeight: "600", letterSpacing: "-0.02em" }}>
                      {a?.t}
                    </span>
                    {(a?.tasks ?? []).map((k, $index) => (<Fragment key={$index}>
                      {" "}
                      <div style={{ borderRadius: "12px", padding: "12px", border: `1px solid ${k?.bd ?? ''}`, background: `${k?.bg ?? ''}`, display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span style={{ fontSize: "clamp(12px,1vw,14px)", lineHeight: "1.3" }}>
                          {k?.t}
                        </span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".06em", textTransform: "uppercase", color: `${k?.tc ?? ''}` }}>
                          {k?.tag}
                        </span>
                      </div>
                      {" "}
                    </Fragment>))}
                  </div>
                  {" "}
                </Fragment>))}
              </div>
            </div>
            {" "}
          </div>
          {" "}
          <div ref={v.ringRef} style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", pointerEvents: "none", zIndex: "3" }}>
            {" "}
            <div style={{ position: "absolute", left: "-7px", top: "-7px", width: "14px", height: "14px", borderRadius: "50%", background: "#FF6A00", boxShadow: "0 0 0 6px rgba(255,106,0,.18)" }} />
            {" "}
          </div>
          {" "}
          <div className="uc-crumb" style={{ position: "absolute", left: "clamp(20px,3vw,40px)", top: "110px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650", zIndex: "4", background: "#ECE8E1", padding: "6px 10px", borderRadius: "999px" }}>
            {v.t("Understand.home")}{" "}
            <span style={{ color: "#BDB6AA" }}>
              {"/"}
            </span>
            {" "}
            <span style={{ color: "#0A0A0A" }}>
              {v.t("Understand.understand")}
            </span>
            {" "}{v.t("Understand.pillar01")}
          </div>
          {" "}
          <div className="uc-read" style={{ position: "absolute", right: "clamp(20px,3vw,40px)", top: "110px", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".08em", textTransform: "uppercase", color: "#5A5650", zIndex: "4", background: "#ECE8E1", padding: "10px 12px", borderRadius: "14px" }}>
            <span>
              {v.t("Understand.clarity")}{" "}
              <b style={{ color: "#FF6A00", fontWeight: "500" }}>
                {v.clarity}{"%"}
              </b>
            </span>
            <span>
              {v.t("Understand.lens")}{" "}
              <b style={{ color: "#FF6A00", fontWeight: "500" }}>
                {v.lensMode}
              </b>
            </span>
          </div>
          {" "}
          <div style={{ position: "absolute", left: "clamp(20px,3vw,40px)", bottom: "110px", maxWidth: "min(580px,calc(100% - 40px))", zIndex: "4", background: "rgba(236,232,225,.94)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", borderRadius: "24px", padding: "26px 28px", display: "flex", flexDirection: "column", gap: "14px", boxShadow: "0 20px 50px rgba(10,10,10,.12)", cursor: "auto" }}>
            <div style={{ display: "flex", gap: "12px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase" }}>
              <span style={{ color: "#8C877E" }}>
                {v.capNum}
              </span>
              <span>
                {v.capLabel}
              </span>
            </div>
            <h1 style={{ margin: "0", fontSize: "clamp(31px,3.8vw,59px)", lineHeight: ".95", letterSpacing: "-0.05em", fontWeight: "600", textWrap: "balance" }}>
              {v.capHead}
            </h1>
            <p style={{ margin: "0", fontSize: "clamp(15px,1.3vw,19px)", lineHeight: "1.5", color: "#3A3731", textWrap: "pretty" }}>
              {v.capBody}
            </p>
            {v.isLast ? (<>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <a href={v.href("/contact")} style={{ background: "#0A0A0A", color: "#F4F4F2", borderRadius: "999px", padding: "14px 22px", fontWeight: "700", fontSize: "12px", letterSpacing: ".06em", textTransform: "uppercase" }}>
                  {v.t("Understand.bookTheFirstCall")}
                </a>
              </div>
            </>) : null}
          </div>
          {" "}
          <div className="uc-segs" style={{ position: "absolute", left: "clamp(20px,3vw,40px)", right: "clamp(20px,3vw,40px)", bottom: "28px", display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "16px", zIndex: "4" }}>
            {(v.segs ?? []).map((g, $index) => (<Fragment key={$index}>
              {" "}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ height: "2px", background: `${g?.track ?? ''}`, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${g?.w ?? ''}`, background: "#FF6A00" }} />
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: `${g?.c ?? ''}` }}>
                  {g?.t}
                </span>
              </div>
              {" "}
            </Fragment>))}
          </div>
          {" "}
        </div>
      </div>
      <div ref={v.chatRef} data-screen-label="01 First call" style={{ padding: "140px clamp(20px,3vw,40px) 0", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
            {"(01) "}
            <span style={{ color: "#0A0A0A" }}>
              {v.t("Understand.theFirstCall")}
            </span>
          </div>
          <h2 style={{ margin: "0", fontSize: "clamp(33px,3.9vw,62px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", maxWidth: "1000px", textWrap: "balance" }}>
            {v.t("Understand.fifteenMinutes")}{" "}
            <span style={{ color: "#FF6A00" }}>
              {v.t("Understand.iListenYouWatchItTake")}
            </span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "16px" }}>
          <div style={{ background: "#F4F1EC", border: "1px solid #DCD5CA", borderRadius: "26px", overflow: "hidden" }}>
            {" "}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #E2DDD4", fontFamily: "var(--font-mono)", fontSize: "12px", color: "#5A5650" }}>
              <span style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FF6A00", animation: "rdPulse 1.6s infinite" }} />
                {v.t("Understand.firstCallExample")}
              </span>
              <span>
                {v.callTime}{" / 15:00"}
              </span>
            </div>
            {" "}
            <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: "14px", minHeight: "400px" }}>
              {(v.chat ?? []).map((m, $index) => (<Fragment key={$index}>
                {" "}
                <div style={{ alignSelf: `${m?.side ?? ''}`, maxWidth: "84%", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase", color: "#8C877E", alignSelf: `${m?.side ?? ''}` }}>
                    {m?.who}
                  </span>
                  <span style={{ background: `${m?.bg ?? ''}`, color: `${m?.fg ?? ''}`, borderRadius: "16px", padding: "12px 15px", fontSize: "15px", lineHeight: "1.45" }}>
                    {m?.t}
                  </span>
                </div>
                {" "}
              </Fragment>))}
            </div>
            {" "}
          </div>
          <div style={{ background: "#0B0B0C", color: "#F4F4F2", borderRadius: "26px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
              <span>
                {v.t("Understand.whatIHear")}
              </span>
              <span>
                <b style={{ color: "#FF9A50", fontWeight: "500" }}>
                  {v.litCount}
                </b>
                {" "}{v.t("Understand.n6Areas")}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "10px" }}>
              {(v.hearNodes ?? []).map((n, $index) => (<Fragment key={$index}>
                {" "}
                <div style={{ borderRadius: "16px", padding: "16px", border: `1px solid ${n?.bd ?? ''}`, background: `${n?.bg ?? ''}`, display: "flex", flexDirection: "column", gap: "14px", transition: "all .5s", transform: `scale(${n?.s ?? ''})` }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: `${n?.c ?? ''}`, boxShadow: `${n?.glow ?? ''}` }} />
                  <span style={{ fontSize: "15px", fontWeight: "500", color: `${n?.tc ?? ''}` }}>
                    {n?.t}
                  </span>
                </div>
                {" "}
              </Fragment>))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: "1" }}>
              {(v.facts ?? []).map((f, $index) => (<Fragment key={$index}>
                {" "}
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", padding: "14px 16px", borderRadius: "14px", background: "#161618", borderLeft: `3px solid ${f?.c ?? ''}`, animation: "rdIn .5s both" }}>
                  <span style={{ fontSize: "15px" }}>
                    {f?.t}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".06em", textTransform: "uppercase", color: `${f?.c ?? ''}`, whiteSpace: "nowrap" }}>
                    {f?.a}
                  </span>
                </div>
                {" "}
              </Fragment>))}
            </div>
          </div>
        </div>
      </div>
      <div data-screen-label="02 Your week" style={{ padding: "140px clamp(20px,3vw,40px) 0", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
            {"(02) "}
            <span style={{ color: "#0A0A0A" }}>
              {v.t("Understand.yourWeek")}
            </span>
          </div>
          <h2 style={{ margin: "0", fontSize: "clamp(33px,3.9vw,62px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", maxWidth: "1000px", textWrap: "balance" }}>
            {v.t("Understand.fortyHours")}{" "}
            <span style={{ color: "#FF6A00" }}>
              {v.t("Understand.howManyAreReallyYours")}
            </span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "40px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <p style={{ margin: "0", fontSize: "18px", lineHeight: "1.55", color: "#3A3731", maxWidth: "460px" }}>
              {v.t("Understand.tapWhatEatsYourWeekEvery")}
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(v.sinks ?? []).map((s, $index) => (<Fragment key={$index}>
                <button onClick={s?.go} style={{ cursor: "pointer", borderRadius: "999px", padding: "10px 15px", font: "500 14px var(--font-sans)", border: `1px solid ${s?.bd ?? ''}`, background: `${s?.bg ?? ''}`, color: `${s?.fg ?? ''}`, transition: "all .2s" }}>
                  {s?.t}
                </button>
              </Fragment>))}
            </div>
            <button onClick={v.toggleFree} style={{ alignSelf: "flex-start", border: "1px solid #0A0A0A", cursor: "pointer", borderRadius: "999px", padding: "16px 26px", font: "700 13px var(--font-sans)", letterSpacing: ".06em", textTransform: "uppercase", background: `${v.freeBg ?? ''}`, color: `${v.freeFg ?? ''}` }}>
              {v.freeLabel}
            </button>
          </div>
          <div style={{ background: "#F4F1EC", borderRadius: "26px", padding: "clamp(20px,2.4vw,32px)", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "44px repeat(5,minmax(0,1fr))", gap: "6px", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#8C877E" }}>
              <span />
              <span>
                {v.t("Understand.mon")}
              </span>
              <span>
                {v.t("Understand.tue")}
              </span>
              <span>
                {v.t("Understand.wed")}
              </span>
              <span>
                {v.t("Understand.thu")}
              </span>
              <span>
                {v.t("Understand.fri")}
              </span>
            </div>
            {(v.rowsW ?? []).map((r, $index) => (<Fragment key={$index}>
              {" "}
              <div style={{ display: "grid", gridTemplateColumns: "44px repeat(5,minmax(0,1fr))", gap: "6px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#8C877E", alignSelf: "center" }}>
                  {r?.h}
                </span>
                {(r?.cells ?? []).map((c, $index) => (<Fragment key={$index}>
                  <span style={{ height: "clamp(22px,3vw,34px)", borderRadius: "7px", background: `${c?.bg ?? ''}`, transform: `scale(${c?.s ?? ''}) rotate(${c?.r ?? ''})`, opacity: `${c?.o ?? ''}`, transition: `transform .6s cubic-bezier(.5,0,.2,1) ${c?.d ?? ''},opacity .6s ${c?.d ?? ''},background .3s` }} />
                </Fragment>))}
              </div>
              {" "}
            </Fragment>))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px", flexWrap: "wrap", background: "#0B0B0C", color: "#F4F4F2", borderRadius: "18px", padding: "20px 22px", marginTop: "6px" }}>
              <span style={{ fontSize: "15px", color: "#B8B3AA" }}>
                {v.weekNote}
              </span>
              <span style={{ fontSize: "44px", fontWeight: "600", letterSpacing: "-0.04em" }}>
                {v.weekBig}
                <span style={{ fontSize: "15px", fontWeight: "400", color: "#8C877E" }}>
                  {" "}{v.t("Understand.hWeek")}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div ref={v.offerRef} data-screen-label="03 The offer" style={{ height: v.rm || v.mob ? "auto" : "240vh", position: "relative", marginTop: "100px", paddingBottom: v.mob ? "88px" : "0" }}>
        {" "}
        <div style={{ position: v.rm || v.mob ? "relative" : "sticky", top: "0", height: v.mob ? "auto" : "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
          <div style={{ width: "100%", maxWidth: "1480px", margin: "0 auto", padding: "90px clamp(20px,3vw,40px) 0", boxSizing: "border-box", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "56px", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
                  {"(03) "}
                  <span style={{ color: "#0A0A0A" }}>
                    {v.t("Understand.whatYouGet")}
                  </span>
                </div>
                <h2 style={{ margin: "0", fontSize: "clamp(33px,3.9vw,62px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", maxWidth: "1000px", textWrap: "balance" }}>
                  {v.t("Understand.aPlanOnPaper")}{" "}
                  <span style={{ color: "#FF6A00" }}>
                    {v.t("Understand.notAPitch")}
                  </span>
                </h2>
              </div>
              <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.6", color: "#3A3731", maxWidth: "480px" }}>
                {v.t("Understand.theMapBecomesOneClearOffer")}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", flexWrap: "wrap", paddingTop: "20px", borderTop: "1px solid #D3CCC0" }}>
                <span style={{ fontSize: "17px" }}>
                  {v.t("Understand.nextPillar")}{" "}
                  <b>
                    {v.t("Understand.build")}
                  </b>
                  {"."}
                </span>
                <a href={v.href("/build")} style={{ background: "#FF6A00", color: "#0A0A0A", borderRadius: "999px", padding: "14px 22px", fontWeight: "700", fontSize: "12px", letterSpacing: ".06em", textTransform: "uppercase" }}>
                  {v.t("Understand.enterBuild")}
                </a>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "min(100%,540px)", height: "34px", borderRadius: "14px", background: "#0B0B0C", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", boxSizing: "border-box", position: "relative", zIndex: "2", boxShadow: "0 14px 30px rgba(10,10,10,.25)" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
                  {v.t("Understand.rIDEFFOffer")}
                </span>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FF6A00", animation: "rdPulse 1s infinite", opacity: `${v.printing ?? ''}` }} />
              </div>
              <div style={{ width: "min(92%,480px)", height: v.mob ? "auto" : "min(66vh,560px)", overflow: "hidden", marginTop: "-10px" }}>
                {" "}
                <div style={{ position: "relative", background: "#E7E3DC", padding: "44px 36px 36px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "18px", fontSize: "14px", transform: `translateY(${v.paperY ?? ''})`, boxShadow: "0 30px 60px rgba(10,10,10,.14)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <b style={{ fontSize: "18px", letterSpacing: "-0.02em" }}>
                      {"RIDEFF"}
                    </b>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#5A5650" }}>
                      {v.t("Understand.offerYourBusiness")}
                    </span>
                  </div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "34px", lineHeight: "1.05" }}>
                    {v.t("Understand.yourBusinessBrainPhaseOne")}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {(v.offer ?? []).map((o, $index) => (<Fragment key={$index}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", padding: "11px 0", borderTop: "1px solid #CFC8BC" }}>
                        <span>
                          {o?.a}
                        </span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#5A5650" }}>
                          {o?.b}
                        </span>
                      </div>
                    </Fragment>))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "2px solid #0A0A0A", paddingTop: "14px" }}>
                    <b>
                      {"Growth"}
                    </b>
                    <b style={{ fontSize: "22px", letterSpacing: "-0.02em" }}>
                      {v.t("Understand.n249Mo")}
                    </b>
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <button onClick={v.toggleTerms} aria-label={v.t("Understand.iAcceptTheTerms")} style={{ width: "18px", height: "18px", border: "1.5px solid #0A0A0A", borderRadius: "4px", background: `${v.termsBg ?? ''}`, cursor: "pointer", padding: "0", color: "#F4F4F2", fontSize: "12px", lineHeight: "1" }}>
                      {v.termsMark}
                    </button>
                    <span onClick={v.toggleTerms} style={{ fontSize: "13px", color: "#3A3731", cursor: "pointer", padding: "12px 0" }}>
                      {v.t("Understand.iAcceptTheTerms")}
                    </span>
                    <button onClick={v.approve} style={{ marginLeft: "auto", border: "none", background: `${v.apBg ?? ''}`, color: "#F4F4F2", borderRadius: "999px", padding: "10px 18px", font: "600 13px var(--font-sans)", cursor: "pointer", opacity: `${v.apOp ?? ''}` }}>
                      {v.apLabel}
                    </button>
                  </div>
                  {v.approved ? (<>
                    <div style={{ position: "absolute", right: "26px", top: "104px", border: "3px solid #FF6A00", color: "#FF6A00", borderRadius: "10px", padding: "10px 16px", fontFamily: "var(--font-mono)", fontSize: "15px", fontWeight: "500", letterSpacing: ".12em", textTransform: "uppercase", animation: "rdStamp .5s cubic-bezier(.2,.8,.2,1) both", background: "rgba(231,227,220,.88)", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                      {v.t("Understand.approved")}
                      <span style={{ fontSize: "9px", letterSpacing: ".06em" }}>
                        {v.t("Understand.xHashStored", { x: v.stampTime })}
                      </span>
                    </div>
                  </>) : null}
                </div>
                {" "}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer  />
    </>
  );
};

export default function UnderstandPage(props) {
  const dc = useDC();
  return <Logic key={dc.locale} {...dc} {...props} />;
}
