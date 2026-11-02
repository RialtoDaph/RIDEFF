// @ts-nocheck -- ported 1:1 from rideff_handoff/design/RIDEFF Run.dc.html (see scripts/dc-port/convert.mjs)
'use client';
import React, { Fragment } from 'react';
import { DCLogic, dcStyle, opt, useDC } from '@/lib/dc';
import Nav from '@/components/dc/Nav';
import Footer from '@/components/dc/Footer';
import { eur } from '@/lib/format';

class Logic extends DCLogic {
  state = {
    rp: 0,
    bp: 0,
    tab: 0,
    cyc: 0,
    ev: 0,
    wp: 0,
    mail: 0,
    clock: '',
    dp: 0
  };
  dialRef = React.createRef();
  rcRef = React.createRef();
  watchRef = React.createRef();
  brkRef = React.createRef();
  growRef = React.createRef();
  portalRef = React.createRef();
  promRef = React.createRef();
  PT = [[this.props.t("Run.website"), this.props.t("Run.newVersionUp"), '#FF6A00'], [this.props.t("Run.bookingForm"), this.props.t("Run.liveTomorrow"), '#54B0E6'], [this.props.t("Run.invoices"), this.props.t("Run.allPaid"), '#61CC80'], [this.props.t("Run.teamApp"), this.props.t("Run.shiftSwapLive"), '#9E8CF2']];
  PB = [[this.props.t("Run.canYouChangeTheHomepagePhoto"), 0, this.props.t("Run.you")], [this.props.t("Run.newVersionIsUp"), 0, 'Rialto'], [this.props.t("Run.fontABitBigger"), 0, this.props.t("Run.you")], [this.props.t("Run.canWeAddAGuestCount"), 1, this.props.t("Run.you")], [this.props.t("Run.addedLiveTomorrow"), 1, 'Rialto'], [this.props.t("Run.didTheOctoberInvoiceGoOut"), 2, this.props.t("Run.you")], [this.props.t("Run.paidBySEPAOn0211"), 2, 'Rialto'], [this.props.t("Run.canStaffSwapShiftsInThe"), 3, this.props.t("Run.you")], [this.props.t("Run.shiftSwapIsLive"), 3, 'Rialto'], [this.props.t("Run.perfectThanks"), 3, this.props.t("Run.you")]];
  PS = [[8, 18, -9, 80], [55, 14, 7, 40], [30, 34, -4, 120], [68, 38, 10, 20], [4, 52, 6, 60], [44, 56, -8, 140], [72, 64, 5, 30], [16, 74, -6, 100], [52, 80, 9, 70], [32, 12, 3, 160]];
  WL = [[this.props.t("Run.apps"), this.props.t("Run.pages08S"), '#FF6A00'], [this.props.t("Run.aIAgents"), this.props.t("Run.n12DraftsOk"), '#9E8CF2'], [this.props.t("Run.automations"), this.props.t("Run.n214RunsOk"), '#61CC80'], [this.props.t("Run.dataCore"), 'backup 03:00', '#54B0E6'], [this.props.t("Run.entryPoints"), this.props.t("Run.n0Unanswered"), '#E0B842'], [this.props.t("Run.integrations"), this.props.t("Run.allSynced"), '#EB7AAB']];
  MONTHS = [[this.props.t("Run.month1"), this.props.t("Run.goLive"), this.props.t("Run.websiteInboxAndCustomersTheCore"), 0, 0, 3], [this.props.t("Run.month2"), this.props.t("Run.bookingForm"), this.props.t("Run.askedForInThePortalLive"), 1, 0, 2], [this.props.t("Run.month4"), this.props.t("Run.teamApp"), this.props.t("Run.shiftsAndChecklistsOnEveryPhone"), 2, 0, 4], [this.props.t("Run.month6"), this.props.t("Run.offerAgent"), this.props.t("Run.draftsOffersFromYourOwnPrices"), 0, 1, 5], [this.props.t("Run.month9"), this.props.t("Run.shop"), this.props.t("Run.sameCustomersSameStockNowOnline"), 1, 1, 3], [this.props.t("Run.month12"), this.props.t("Run.financeFlows"), this.props.t("Run.invoicesRemindersExportForYourAccountant"), 2, 1, 4]];
  tiltMove = e => {
    const el = e.currentTarget,
      r = el.getBoundingClientRect(),
      x = (e.clientX - r.left) / r.width - .5,
      y = (e.clientY - r.top) / r.height - .5;
    el.style.transform = 'perspective(1000px) rotateY(' + (x * 10).toFixed(2) + 'deg) rotateX(' + (-y * 10).toFixed(2) + 'deg) scale(1.02)';
  };
  tiltLeave = e => {
    e.currentTarget.style.transform = '';
  };
  EV24 = [[9.2, this.props.t("Run.inquiryAnswered")], [11, this.props.t("Run.offerDrafted")], [13.5, this.props.t("Run.invoicePaid")], [16, this.props.t("Run.shiftPlanSent")], [19, this.props.t("Run.shopOrdersSynced")], [22.5, this.props.t("Run.remindersSent")], [25, this.props.t("Run.securityUpdate")], [27, this.props.t("Run.backupComplete")], [29, this.props.t("Run.reportWritten")], [31, this.props.t("Run.briefingReady")]];
  beatRef = React.createRef();
  weekRef = React.createRef();
  mailRef = React.createRef();
  EVENTS = [[this.props.t("Run.backup"), this.props.t("Run.nightlyBackupCompleted"), '#5A5650'], [this.props.t("Run.customers"), this.props.t("Run.inquiryAnsweredIn2Min"), '#FF6A00'], [this.props.t("Run.finance"), this.props.t("Run.invoiceR2026041Paid"), '#5A5650'], [this.props.t("Run.update"), this.props.t("Run.securityUpdateDeployed"), '#5A5650'], [this.props.t("Run.sales"), this.props.t("Run.offerDraftedWaitingForYou"), '#FF6A00'], [this.props.t("Run.team"), this.props.t("Run.shiftPlanPublished"), '#5A5650'], [this.props.t("Run.monitor"), this.props.t("Run.responseTime180Ms"), '#5A5650'], [this.props.t("Run.customers"), this.props.t("Run.bookingConfirmed"), '#FF6A00']];
  DAYS = [[this.props.t("Run.mon"), [['07:00', this.props.t("Run.weeklyReportSent")], ['09:12', this.props.t("Run.n6InquiriesAnswered")], ['16:40', this.props.t("Run.offerApprovedByYou")]]], [this.props.t("Run.tue"), [['03:00', this.props.t("Run.backupCompleted")], ['10:05', this.props.t("Run.invoiceRemindersSent")], ['14:22', this.props.t("Run.newRequestBookingForm")]]], [this.props.t("Run.wed"), [['02:30', this.props.t("Run.securityUpdateDeployed")], ['11:48', this.props.t("Run.bookingFormFieldAdded")], ['15:10', this.props.t("Run.n4PaymentsMatched")]]], [this.props.t("Run.thu"), [['08:30', this.props.t("Run.shiftSwapHandled")], ['12:00', this.props.t("Run.stockReorderListWritten")], ['18:05', this.props.t("Run.n9InquiriesAnswered")]]], [this.props.t("Run.fri"), [['09:00', this.props.t("Run.invoiceRun12Sent")], ['13:30', this.props.t("Run.smallFixMenuTypo")], ['17:00', this.props.t("Run.weekClosed")]]], [this.props.t("Run.sat"), [['03:00', this.props.t("Run.backupCompleted")], ['10:20', this.props.t("Run.n5BookingsConfirmed")], ['20:15', this.props.t("Run.shopOrdersSynced")]]], [this.props.t("Run.sun"), [['03:00', this.props.t("Run.backupCompleted")], ['21:00', this.props.t("Run.reportPrepared")], ['23:59', this.props.t("Run.allSystemsNormal")]]]];
  TABS = [[this.props.t("Run.threads"), [[this.props.t("Run.startseiteDraft2"), 'Rialto: new version is up', this.props.t("Run.new"), '#FF9A50'], [this.props.t("Run.newRequestBookingForm"), 'You: can we add a field?', this.props.t("Run.open"), '#FF9A50'], [this.props.t("Run.invoiceOctober"), this.props.t("Run.paidBySEPA"), this.props.t("Run.done"), '#8C877E'], [this.props.t("Run.teamAppUpdate"), this.props.t("Run.shiftSwapIsLive"), this.props.t("Run.done"), '#8C877E'], [this.props.t("Run.weeklyReport"), this.props.t("Run.n42InquiriesHandled"), this.props.t("Run.mon"), '#8C877E']]], [this.props.t("Run.invoices"), [['R-2026-052', this.props.t("Run.monthlyDue01Nov"), this.props.t("Run.upcoming"), '#FF9A50'], ['R-2026-041', this.props.t("Run.monthlyGrowth"), this.props.t("Run.n249Paid"), '#8C877E'], ['R-2026-032', this.props.t("Run.monthlyGrowth"), this.props.t("Run.n249Paid"), '#8C877E'], ['R-2026-018', this.props.t("Run.setup"), this.props.t("Run.n1990Paid"), '#8C877E']]], [this.props.t("Run.project"), [[this.props.t("Run.n01FirstCall"), this.props.t("Run.done"), '✓', '#FF9A50'], [this.props.t("Run.n02Analysis"), this.props.t("Run.done"), '✓', '#FF9A50'], [this.props.t("Run.n03Build"), this.props.t("Run.done"), '✓', '#FF9A50'], [this.props.t("Run.n04Test"), this.props.t("Run.done"), '✓', '#FF9A50'], [this.props.t("Run.n05Live"), this.props.t("Run.runningMaintained"), this.props.t("Run.now"), '#FF9A50']]], [this.props.t("Run.files"), [[this.props.t("Run.offerApprovedPdf"), this.props.t("Run.approvalStoredWithHash"), 'PDF', '#8C877E'], [this.props.t("Run.brandAssetsZip"), this.props.t("Run.uploadedByYou"), 'ZIP', '#8C877E'], [this.props.t("Run.menuPhotos"), this.props.t("Run.n12Images"), 'IMG', '#8C877E'], [this.props.t("Run.termsV12Pdf"), this.props.t("Run.accepted"), 'PDF', '#8C877E']]]];
  componentDidMount() {
    this.alive = true;
    this.wt = setInterval(() => this.setState(s => ({
      wl: ((s.wl || 0) + 1) % 7
    })), 1100);
    this.calcPin = () => {
      let rm = false;
      try {
        rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
      } catch (e) {}
      const pin = !rm && innerWidth >= 1000 && innerHeight >= 640;
      // Reduced motion: the 24h dial is not scrubbed; it shows its final state.
      if (rm !== !!this.state.rm) this.setState({ rm, dp: rm ? 1 : this.state.dp });
      if (pin !== !!(this.state || {}).pin) this.setState({
        pin
      });
      const narrow = innerWidth < 820;
      if (narrow !== !!this.state.narrow) this.setState({ narrow });
    };
    this.calcPin();
    window.addEventListener('resize', this.calcPin);
    this.t1 = setInterval(() => this.setState(s => ({
      cyc: s.cyc + 1,
      ev: s.ev + 1
    })), 2600);
    const tick = () => this.setState({
      clock: new Date().toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Berlin'
      })
    });
    tick();
    this.t2 = setInterval(tick, 30000);
    this.onScroll = () => {
      const dr = this.dialRef.current;
      if (dr) {
        const r = dr.getBoundingClientRect(),
          dp = this.state.rm ? 1 : Math.max(0, Math.min(1, -r.top / (r.height - innerHeight)));
        if (Math.abs(dp - this.state.dp) > .002) this.setState({
          dp
        });
      }
      const rc = this.rcRef.current;
      if (rc) {
        const b2 = rc.getBoundingClientRect(),
          rp = Math.max(0, Math.min(1, (innerHeight * .85 - b2.top) / (innerHeight * .9)));
        if (Math.abs(rp - this.state.rp) > .004) this.setState({
          rp
        });
      }
      const w = this.weekRef.current;
      if (w) {
        const r = w.getBoundingClientRect(),
          wp = Math.max(0, Math.min(1, -r.top / (r.height - innerHeight)));
        if (Math.abs(wp - this.state.wp) > .004) this.setState({
          wp
        });
      }
      const cl = v => Math.max(0, Math.min(1, +v || 0)),
        st = this.state || {};
      const wr = this.watchRef.current;
      if (wr) {
        const wq = cl((innerHeight * .85 - wr.getBoundingClientRect().top) / (innerHeight * .8));
        if (Math.abs(wq - (st.wq || 0)) > .004) this.setState({
          wq
        });
      }
      // "When something breaks": scroll drives the incident from break to resolved.
      const br = this.brkRef.current;
      if (br) {
        const r = br.getBoundingClientRect(),
          bp = st.rm ? 1 : st.pin ? cl(-r.top / (r.height - innerHeight)) : cl((innerHeight * .75 - r.top) / r.height);
        if (Math.abs(bp - (st.bp || 0)) > .004) this.setState({
          bp
        });
      }
      const gr = this.growRef.current;
      if (gr) {
        const r = gr.getBoundingClientRect(),
          gp = st.pin ? cl(-r.top / (r.height - innerHeight)) : cl((innerHeight * .9 - r.top) / (innerHeight * .9));
        if (Math.abs(gp - (st.gp || 0)) > .004) this.setState({
          gp
        });
      }
      const pm = this.promRef.current;
      if (pm) {
        const pv = cl((innerHeight * .95 - pm.getBoundingClientRect().top) / (innerHeight * .6));
        if (pv > (st.pv || 0) + .004) this.setState({
          pv
        });
      }
      const pr = this.portalRef.current;
      if (pr) {
        const pq = cl((innerHeight * .9 - pr.getBoundingClientRect().top) / (innerHeight * .7));
        if (Math.abs(pq - (st.pq || 0)) > .004) this.setState({
          pq
        });
      }
      const m = this.mailRef.current;
      if (m && !this.mailGo && m.getBoundingClientRect().top < innerHeight * .75) {
        this.mailGo = true;
        const t0 = performance.now();
        const step = n => {
          const k = Math.min(1, (n - t0) / 1400);
          this.setState({
            mail: 1 - Math.pow(1 - k, 3)
          });
          if (k < 1 && this.alive) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    };
    window.addEventListener('scroll', this.onScroll, {
      passive: true
    });
    this.onScroll();
    const cv = this.beatRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const loop = now => {
      if (!this.alive) return;
      this.raf = requestAnimationFrame(loop);
      const dpr = Math.min(devicePixelRatio || 1, 2),
        W = cv.clientWidth,
        H = cv.clientHeight;
      if (cv.width !== W * dpr) {
        cv.width = W * dpr;
        cv.height = H * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = '#E2DDD4';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 48) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      const t = now / 1000,
        mid = H * .55,
        speed = 90,
        period = 260;
      const yAt = x => {
        const ph = ((x + t * speed) % period + period) % period;
        let y = Math.sin((x + t * speed) * .03) * 3;
        if (ph > 120 && ph < 160) {
          const u = (ph - 120) / 40;
          y -= Math.sin(u * Math.PI) * (u < .5 ? 46 : -18) * (u < .5 ? 1 : .6);
        }
        return mid + y;
      };
      const g = ctx.createLinearGradient(0, 0, W, 0);
      g.addColorStop(0, 'rgba(255,106,0,0)');
      g.addColorStop(.25, 'rgba(255,106,0,.55)');
      g.addColorStop(1, '#FF6A00');
      ctx.strokeStyle = g;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const y = yAt(x);
        x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
      const hx = W - 30,
        hy = yAt(hx);
      ctx.fillStyle = '#FF6A00';
      ctx.beginPath();
      ctx.arc(hx, hy, 5, 0, 7);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,106,0,.18)';
      ctx.beginPath();
      ctx.arc(hx, hy, 12 + Math.sin(t * 4) * 3, 0, 7);
      ctx.fill();
    };
    this.raf = requestAnimationFrame(loop);
  }
  componentWillUnmount() {
    clearInterval(this.wt);
    window.removeEventListener('resize', this.calcPin);
    this.alive = false;
    clearInterval(this.t1);
    clearInterval(this.t2);
    cancelAnimationFrame(this.raf);
    window.removeEventListener('scroll', this.onScroll);
  }
  renderVals() {
    const s = this.state,
      E = this.EVENTS,
      n = E.length;
    const base = new Date();
    base.setHours(8, 0, 0, 0);
    const feed = [0, 1, 2, 3].map(k => {
      const i = (s.ev + 3 - k) % n,
        e = E[i],
        d = new Date(base.getTime() + (s.ev * 7 + 3 - k) * 7 * 60000);
      return {
        k: e[0],
        t: e[1],
        c: e[2],
        time: d.toLocaleTimeString('de-DE', {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
    });
    const di = Math.min(6, Math.floor(s.wp * 7)),
      wf = s.wp;
    const rows = this.TABS[s.tab][1],
      rot = s.tab === 0 ? rows.map((_, k) => rows[(k - s.cyc % rows.length + rows.length) % rows.length]) : rows;
    const m = s.mail;
    const dp = s.dp,
      hr = 8 + dp * 24,
      hh = hr % 24;
    const lerp = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
    const K = [[8, [236, 232, 225]], [16.5, [233, 214, 190]], [18.2, [52, 36, 28]], [20.5, [30, 22, 18]], [23, [11, 11, 12]], [29, [13, 13, 16]], [31, [70, 52, 40]], [32, [236, 232, 225]]];
    let col = K[0][1];
    for (let i = 0; i < K.length - 1; i++) if (hr >= K[i][0] && hr <= K[i + 1][0]) {
      col = lerp(K[i][1], K[i + 1][1], (hr - K[i][0]) / (K[i + 1][0] - K[i][0]));
      break;
    }
    const lum = (col[0] * .3 + col[1] * .59 + col[2] * .11) / 255,
      dark = lum < .62;
    const night = Math.max(0, Math.min(1, (hr - 20.5) / 2)) * Math.max(0, Math.min(1, (31 - hr) / 1.5));
    const phI = hr < 17 ? 0 : hr < 22 ? 1 : hr < 29.5 ? 2 : 3;
    const PH = [['01', this.props.t("Run.day"), this.props.t("Run.youRunTheBusiness"), this.props.t("Run.customersTeamTheCounterMeanwhileInquiries")], ['02', this.props.t("Run.evening"), this.props.t("Run.youCloseTheShop"), this.props.t("Run.ordersSyncRemindersGoOutThe")], ['03', this.props.t("Run.night"), this.props.t("Run.youSleepItDoesnT"), this.props.t("Run.updatesAreInstalledBackupsAreMade")], ['04', this.props.t("Run.morning"), this.props.t("Run.youWakeUpToAReport"), this.props.t("Run.aShortBriefingWhatHappenedWhat")]][phI];
    const pos = (h, rr) => {
      const a = h % 24 / 24 * Math.PI * 2 - Math.PI / 2;
      return [50 + Math.cos(a) * rr, 50 + Math.sin(a) * rr];
    };
    let seed = 3;
    const Rn = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const dialVals = {
      dialRef: this.dialRef,
      dialO: this.state.narrow ? .7 : 1,
      skyBg: 'rgb(' + col.join(',') + ')',
      skyFg: dark ? '#F4F4F2' : '#0A0A0A',
      glow: dark ? 'rgba(255,106,0,.10)' : 'rgba(255,255,255,.5)',
      ringC: dark ? 'rgba(244,244,242,.18)' : 'rgba(10,10,10,.16)',
      stars: [...Array(40)].map(() => ({
        x: Rn() * 100 + '%',
        y: Rn() * 70 + '%',
        z: 1 + Rn() * 2 + 'px',
        o: (night * (.3 + Rn() * .6)).toFixed(2)
      })),
      hourLabel: String(Math.floor(hh)).padStart(2, '0') + ':' + String(Math.floor(hh % 1 * 60)).padStart(2, '0'),
      dayPart: PH[1],
      handDeg: hh / 24 * 360 + 'deg',
      handled: this.EV24.filter(e => e[0] <= hr).length,
      ticks: [...Array(48)].map((_, i) => ({
        r: i * 7.5 + 'deg',
        h: i % 2 ? '6px' : '12px'
      })),
      hours: [0, 3, 6, 9, 12, 15, 18, 21].map(x => {
        const q = pos(x, 41);
        return {
          t: String(x).padStart(2, '0'),
          x: q[0] + '%',
          y: q[1] + '%'
        };
      }),
      events: this.EV24.map(e => {
        const on = e[0] <= hr,
          q = pos(e[0], 50),
          right = q[0] >= 50,
          ny = q[1] < 18 ? -14 : q[1] > 82 ? 14 : 0;
        return {
          t: e[1],
          x: q[0] + '%',
          y: q[1] + '%',
          dir: right ? 'row' : 'row-reverse',
          tf: (right ? 'translate(-6px,' : 'translate(calc(-100% + 6px),') + 'calc(-50% + ' + ny + 'px))',
          dot: on ? '12px' : '8px',
          dc: on ? '#FF6A00' : dark ? '#3A3A3C' : '#BDB6AA',
          glow: on ? '0 0 0 5px rgba(255,106,0,.18)' : 'none',
          bg: on ? dark ? '#1C1C1E' : '#FFFFFF' : 'transparent',
          fg: dark ? '#F4F4F2' : '#0A0A0A',
          bd: on ? 'rgba(255,106,0,.5)' : 'transparent',
          o: on ? 1 : .35
        };
      }),
      phNum: PH[0],
      phLabel: PH[1],
      phHead: PH[2],
      phBody: PH[3],
      phLast: phI === 3,
      psegs: [this.props.t("Run.day"), this.props.t("Run.evening"), this.props.t("Run.night"), this.props.t("Run.morning")].map((t, i) => {
        const b = [[8, 17], [17, 22], [22, 29.5], [29.5, 32]][i];
        return {
          t,
          w: Math.max(0, Math.min(1, (hr - b[0]) / (b[1] - b[0]))) * 100 + '%',
          o: i === phI ? 1 : .5
        };
      })
    };
    const wq = +s.wq || 0,
      we = wq < .5 ? 4 * wq ** 3 : 1 - Math.pow(-2 * wq + 2, 3) / 2,
      wsp = 14 + 34 * we,
      wl = s.wl || 0;
    const gp = +s.gp || 0,
      gn = gp * 6.4;
    const shade = (hex, f) => {
      const n = parseInt(hex.slice(1), 16),
        c = [n >> 16, n >> 8 & 255, n & 255].map(v => Math.round(v * f));
      return 'rgb(' + c.join(',') + ')';
    };
    return {
      rm: !!(this.state || {}).rm,
      ...dialVals,
      portalRef: this.portalRef,
      promRef: this.promRef,
      ...(() => {
        const v = +s.pv || 0,
          ev = 1 - Math.pow(1 - v, 3),
          tick = s.cyc || 0;
        return {
          prRing: (ev * 100 * (4 / 24) * 6).toFixed(1) + '%',
          prReply: Math.max(1, Math.round(4 * ev)),
          prUp: (99.9 * ev).toFixed(1),
          prBars: [...Array(30)].map((_, k) => ({
            h: (k === 17 ? 60 : 80 + k * 37 % 20) + '%',
            c: k === 17 ? '#E0B842' : '#61CC80',
            o: k / 30 < ev ? 1 : .15
          })),
          prDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((t, k) => {
            const lit = k / 7 < ev,
              cur = lit && k === tick % 7;
            return {
              t,
              bg: cur ? '#FF6A00' : lit ? '#0A0A0A' : '#DCD5CA',
              sh: cur ? '0 0 0 5px rgba(255,106,0,.2)' : 'none'
            };
          })
        };
      })(),
      ...(() => {
        const q = +s.pq || 0,
          pe = q < .5 ? 4 * q ** 3 : 1 - Math.pow(-2 * q + 2, 3) / 2,
          cnt = [0, 0, 0, 0];
        return {
          pFrameOp: (.3 + .7 * Math.min(1, pe * 1.4)).toFixed(3),
          pChaosOp: Math.max(0, 1 - pe * 2.2).toFixed(3),
          pStageTf: 'rotateX(' + (14 * (1 - pe)).toFixed(2) + 'deg) rotateY(' + (-12 * (1 - pe)).toFixed(2) + 'deg)',
          pTopics: this.PT.map(t => ({
            t: t[0],
            s: t[1],
            c: t[2]
          })),
          pBubbles: this.PB.map((b, k) => {
            const row = cnt[b[1]]++,
              sc = this.PS[k],
              fx = 2.5 + b[1] * 24.25,
              fy = 30 + row * 15.5,
              x = sc[0] + (fx - sc[0]) * pe,
              y = sc[1] + (fy - sc[1]) * pe,
              mine = b[2] === this.props.t("Run.you");
            return {
              t: b[0],
              from: b[2],
              c: this.PT[b[1]][2],
              x: x.toFixed(2) + '%',
              y: y.toFixed(2) + '%',
              tf: 'translateZ(' + (sc[3] * (1 - pe)).toFixed(1) + 'px) rotate(' + (sc[2] * (1 - pe)).toFixed(2) + 'deg)',
              bg: mine ? pe > .6 ? '#1F1F21' : '#DCF8C6' : pe > .6 ? '#151516' : '#FFFFFF',
              fg: pe > .6 ? '#F4F4F2' : '#0A0A0A'
            };
          })
        };
      })(),
      watchRef: this.watchRef,
      growRef: this.growRef,
      tiltMove: this.tiltMove,
      tiltLeave: this.tiltLeave,
      wStackTf: 'rotateX(58deg) rotateZ(-38deg) translateZ(' + (-2.5 * wsp).toFixed(1) + 'px)',
      wNow: wl < 6 ? this.props.t("Run.checking") + this.WL[wl][0].toLowerCase() + '…' : this.props.t("Run.allLayersOk"),
      wLayers: this.WL.map((l, i) => {
        const on = i === wl,
          done = i < wl || wl === 6;
        return {
          n: '0' + (i + 1),
          t: l[0],
          c: l[2],
          on,
          status: on ? this.props.t("Run.checking2") : l[1],
          sc: on ? '#FF9A50' : '#61CC80',
          mark: on ? '…' : done ? this.props.t("Run.ok") : 'ok',
          tf: 'translateZ(' + ((5 - i) * wsp + (on ? 30 : 0)).toFixed(1) + 'px)',
          bd: on ? '#FF6A00' : '#2A2A2C',
          bg: on ? 'rgba(30,22,16,.97)' : 'rgba(20,20,21,.96)',
          tc: on ? '#F4F4F2' : '#8C877E',
          cells: [0, 1, 2, 3].map(j => on ? j === 0 ? l[2] : l[2] + '44' : '#1F1F21'),
          rowOp: on ? 1 : .7
        };
      }),
      brkRef: this.brkRef,
      bH: s.pin ? '300vh' : 'auto',
      bPos: s.pin ? 'sticky' : 'relative',
      bInnerH: s.pin ? '100vh' : 'auto',
      bPad: s.pin ? '40px clamp(20px,3vw,40px)' : '0 clamp(20px,3vw,40px)',
      gH: s.pin ? '260vh' : 'auto',
      gPos: s.pin ? 'sticky' : 'relative',
      gInnerH: s.pin ? '100vh' : 'auto',
      gCount: '0' + Math.max(1, Math.min(6, Math.floor(gn + .2))),
      months: this.MONTHS.map((m, k) => {
        const on = gn >= k + .2;
        return {
          m: m[0],
          t: m[1],
          d: m[2],
          op: on ? 1 : .35,
          mc: on ? '#FF6A00' : '#8C877E'
        };
      }),
      blocks: this.MONTHS.map((m, k) => {
        const col = ['#FF6A00', '#E0B842', '#54B0E6', '#9E8CF2', '#EB7AAB', '#61CC80'][k],
          d = k === 0 ? 1 : Math.max(0, Math.min(1, gn - k)),
          de = 1 - Math.pow(1 - d, 3),
          H = m[5] * 12;
        return {
          t: m[1],
          c: col,
          x: m[3] * 33.333 + 2.2 + '%',
          y: m[4] * 50 + 4 + '%',
          op: Math.min(1, d * 2).toFixed(2),
          tf: 'translateZ(' + ((1 - de) * 320).toFixed(1) + 'px)',
          topTf: 'translateZ(' + H + 'px)',
          slices: [0, 1, 2, 3, 4, 5].map(j => ({
            bg: shade(col, .55 + j * .05),
            tf: 'translateZ(' + (j * H / 6).toFixed(1) + 'px)'
          }))
        };
      }),
      rcRef: this.rcRef,
      rcH: 90 + s.rp * 760 + 'px',
      inbox: [[this.props.t("Run.newsletterSupplier"), this.props.t("Run.sun")], [this.props.t("Run.orderConfirmation"), this.props.t("Run.sun")], ['Calendar: dentist', this.props.t("Run.sat")]].map(x => ({
        a: x[0],
        b: x[1],
        o: .5 + (1 - m) * .5
      })),
      mailY: (1 - m) * -60 + 'px',
      mailS: .96 + m * .04,
      mailO: Math.min(1, m * 1.5),
      mailSh: (.04 + m * .08).toFixed(2),
      mailBd: m > .99 ? '#FF6A0033' : 'transparent',
      ...(() => {
        // A short calm beat, then one step per sixth of the rest; resolved holds at the end.
        const bp = +s.bp || 0,
          b = bp < .1 ? 0 : Math.min(6, 1 + Math.floor((bp - .1) / .8 * 6)),
          broken = b >= 1 && b <= 3,
          T = ['14:02', '14:02', '14:06', '14:31', '14:33'];
        const steps = [[this.props.t("Run.youReport"), this.props.t("Run.oneMessageAScreenshotIsEnough")], [this.props.t("Run.threadOpens"), this.props.t("Run.checkoutBrokenPriority")], [this.props.t("Run.fixed"), this.props.t("Run.paymentWebhookRestarted")], [this.props.t("Run.deployed"), this.props.t("Run.testedBackupsUntouched")], [this.props.t("Run.confirmed"), this.props.t("Run.shortNoteWhatItWasWhat")]];
        return {
          isBroken: broken,
          shopRot: broken ? '-1.2deg' : '0deg',
          shopFilter: broken ? 'saturate(.2) contrast(.9)' : 'none',
          heroBg: broken ? 'repeating-linear-gradient(135deg,#E2DDD4 0 8px,#D3CCC0 8px 16px)' : 'linear-gradient(120deg,#FFE3CC,#F4F1EC)',
          prods: [this.props.t("Run.linenShirt69"), this.props.t("Run.toteBag29"), this.props.t("Run.cap24")].map((t, i) => ({
            t,
            tx: broken ? (i - 1) * 6 + 'px,' + i * 5 + 'px' : '0,0',
            r: broken ? (i - 1) * 4 + 'deg' : '0deg'
          })),
          ckBg: broken ? '#8C877E' : '#0A0A0A',
          ckLabel: broken ? this.props.t("Run.checkout") : this.props.t("Run.checkout2"),
          brkState: b === 0 ? this.props.t("Run.allNormal") : b === 6 ? 'resolved' : broken ? this.props.t("Run.incidentOpen") : 'deploying',
          brkStateC: broken ? '#FF6A00' : '#8C877E',
          fixTl: steps.map((x, i) => {
            const on = b >= i + 2 || i === 0 && b >= 1;
            return {
              t: x[0],
              d: x[1],
              time: on ? T[i] : '–',
              o: on ? 1 : .3,
              dot: on ? '#FF6A00' : '#3A3A3C',
              glow: on ? '0 0 0 5px rgba(255,106,0,.2)' : 'none'
            };
          })
        };
      })(),
      beatRef: this.beatRef,
      weekRef: this.weekRef,
      mailRef: this.mailRef,
      clock: s.clock,
      evCount: 96 + s.ev,
      feed,
      dayName: this.DAYS[di][0],
      dayLog: this.DAYS[di][1].map(l => ({
        time: l[0],
        t: l[1]
      })),
      days: this.DAYS.map((d, k) => ({
        t: d[0],
        bar: k <= di ? '#FF6A00' : '#CFC8BC',
        c: k === di ? '#0A0A0A' : '#8C877E'
      })),
      tallies: [[this.props.t("Run.inquiriesAnswered"), 46], [this.props.t("Run.invoicesSent"), 18], [this.props.t("Run.backups"), 7], [this.props.t("Run.updatesDeployed"), 3]].map(t => ({
        t: t[0],
        v: Math.round(t[1] * wf)
      })),
      ptabs: this.TABS.map((t, k) => ({
        t: t[0],
        bg: k === s.tab ? '#FF6A00' : '#1C1C1E',
        fg: k === s.tab ? '#0A0A0A' : '#B8B3AA',
        go: () => this.setState({
          tab: k
        })
      })),
      rows: rot.map((r, k) => ({
        a: r[0],
        b: r[1],
        s: r[2],
        c: r[3],
        bg: k === 0 && s.tab === 0 ? '#1F1A16' : '#161618'
      })),
      fixChain: [this.props.t("Run.youReport"), this.props.t("Run.threadOpens"), this.props.t("Run.fixed"), this.props.t("Run.deployed"), this.props.t("Run.confirmed")],
      fixSteps: [this.props.t("Run.oneMessageInThePortalA"), this.props.t("Run.itGetsItsOwnThreadSo"), this.props.t("Run.iFixItUsuallyWithoutYou"), this.props.t("Run.testedAndDeployedBackupsStayUntouched"), this.props.t("Run.youGetAShortNoteWhat")].map((d, k) => ({
        n: '0' + (k + 1),
        d
      })),
      weekly: [[this.props.t("Run.inquiriesHandled"), Math.round(42 * m)], [this.props.t("Run.offersSent"), Math.round(9 * m)], [this.props.t("Run.invoicesPaid"), eur(Math.round(6480 * m), this.props.locale)], [this.props.t("Run.hoursSavedEst"), Math.round(14 * m) + ' h']].map(w => ({
        a: w[0],
        b: w[1]
      })),
      incl: [this.props.t("Run.eUHostingInFrankfurt"), this.props.t("Run.yourOwnDomainSSL"), this.props.t("Run.dailyBackups"), this.props.t("Run.securitySoftwareUpdates"), this.props.t("Run.fixesWhenSomethingBreaks"), this.props.t("Run.supportThroughYourClientPortal"), this.props.t("Run.weeklySummary")],
      offerSet: [[this.props.t("Run.numberOfDomains"), this.props.t("Run.inYourOffer")], [this.props.t("Run.mailboxes"), this.props.t("Run.inYourOffer")], [this.props.t("Run.changeRequestsMonth"), this.props.t("Run.inYourOffer")], [this.props.t("Run.newFeatures"), this.props.t("Run.quotedSeparately")]].map(i => ({
        a: i[0],
        b: i[1]
      })),
      promise: [[this.props.t("Run.firstReply"), '– h', this.props.t("Run.onWorkingDaysToBeSet")], [this.props.t("Run.uptime"), '–%', this.props.t("Run.measuredMonthlyToBeSet")], [this.props.t("Run.backups"), this.props.t("Run.daily"), this.props.t("Run.keptInTheEU")], [this.props.t("Run.contact"), '1', this.props.t("Run.personFromBuildToEveryUpdate")]].map(p => ({
        k: p[0],
        v: p[1],
        d: p[2]
      }))
    };
  }
}

Logic.prototype.render = function render() {
  const v = { ...this.props, ...this.renderVals() };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: "body{margin:0;background:#ECE8E1;color:#0A0A0A;font-family:var(--font-sans);-webkit-font-smoothing:antialiased}\na{color:inherit;text-decoration:none}a:hover{color:#FF6A00}\n@keyframes rdIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}\n@keyframes rdPulse{0%,100%{opacity:1}50%{opacity:.3}}\n@keyframes rdTrack{0%{left:0%}100%{left:100%}}\n@keyframes rdScanX{0%{left:-20%}100%{left:110%}}" }} />
      <Nav active="run" />
      <div ref={v.dialRef} data-screen-label="24h stage" style={{ height: v.rm ? "auto" : "520vh", position: "relative" }}>
        {" "}
        <div style={{ position: v.rm ? "relative" : "sticky", top: "0", height: "100vh", overflow: "hidden", background: `${v.skyBg ?? ''}`, color: `${v.skyFg ?? ''}` }}>
          {" "}
          <div style={{ position: "absolute", inset: "0", background: `radial-gradient(ellipse at 70% 50%,${v.glow ?? ''} 0%,transparent 60%)` }} />
          {" "}
          {(v.stars ?? []).map((s, $index) => (<Fragment key={$index}>
            <span style={{ position: "absolute", left: `${s?.x ?? ''}`, top: `${s?.y ?? ''}`, width: `${s?.z ?? ''}`, height: `${s?.z ?? ''}`, borderRadius: "50%", background: "#F4F4F2", opacity: `${s?.o ?? ''}` }} />
          </Fragment>))}
          {" "}
          <div className="ru-crumb" style={{ position: "absolute", left: "clamp(20px,3vw,40px)", top: "110px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".7" }}>
            {v.t("Run.homeRunPillar03")}
          </div>
          {" "}
          <div className="ru-read" style={{ position: "absolute", right: "clamp(20px,3vw,40px)", top: "96px", zIndex: "3", display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end", gap: "6px 18px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".08em", textTransform: "uppercase", opacity: ".85" }}>
            <span style={{ whiteSpace: "nowrap" }}>
              {v.t("Run.handled")}{" "}
              <b style={{ color: "#FF6A00", fontWeight: "500" }}>
                {v.handled}
              </b>
              {" / 10"}
            </span>
            <span style={{ whiteSpace: "nowrap" }}>
              {"Status "}
              <b style={{ color: "#FF6A00", fontWeight: "500" }}>
                {v.t("Run.normal")}
              </b>
            </span>
            <span style={{ whiteSpace: "nowrap" }}>
              {v.t("Run.sampleDay")}{" "}
              <b style={{ color: "#FF6A00", fontWeight: "500" }}>
                {v.hourLabel}
              </b>
            </span>
          </div>
          {" "}
          <div className="ru-hero" style={{ position: "absolute", inset: "0", padding: "clamp(96px,14vh,140px) clamp(20px,3vw,40px) clamp(80px,12vh,110px)", boxSizing: "border-box", display: "flex", alignItems: "center" }}>
            <div className="ru-copy" style={{ position: "relative", zIndex: "2", display: "flex", flexDirection: "column", gap: "20px", maxWidth: "min(600px,calc(100% - min(64vh,40vw,540px) - 240px))" }}>
              <div style={{ display: "flex", gap: "12px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase" }}>
                <span style={{ opacity: ".55" }}>
                  {v.phNum}
                </span>
                <span>
                  {v.phLabel}
                </span>
              </div>
              <h1 style={{ margin: "0", fontSize: "clamp(46px,6.4vw,104px)", lineHeight: ".94", letterSpacing: "-0.055em", fontWeight: "600", textWrap: "balance" }}>
                {v.phHead}
              </h1>
              <p style={{ margin: "0", fontSize: "clamp(16px,1.4vw,20px)", lineHeight: "1.5", opacity: ".75", maxWidth: "500px", textWrap: "pretty" }}>
                {v.phBody}
              </p>
              {v.phLast ? (<>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <a href={v.href("@portal")} style={{ background: "#FF6A00", color: "#0A0A0A", borderRadius: "999px", padding: "14px 22px", fontWeight: "700", fontSize: "12px", letterSpacing: ".06em", textTransform: "uppercase" }}>
                    {v.t("Run.openThePortalDemo")}
                  </a>
                </div>
              </>) : null}
            </div>
            <div className="ru-dial" style={{ position: "absolute", right: "clamp(140px,12vw,200px)", top: "calc(50% + 30px)", transform: "translateY(-50%)", zIndex: "1", opacity: `${v.dialO ?? ''}`, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div className="ru-dial-box" style={{ position: "relative", width: "min(64vh,40vw,540px,calc(100vh - 300px))", aspectRatio: "1" }}>
                {" "}
                <div style={{ position: "absolute", inset: "0", borderRadius: "50%", border: `1px solid ${v.ringC ?? ''}` }} />
                {" "}
                <div style={{ position: "absolute", inset: "14%", borderRadius: "50%", border: `1px dashed ${v.ringC ?? ''}` }} />
                {" "}
                {(v.ticks ?? []).map((t, $index) => (<Fragment key={$index}>
                  <div style={{ position: "absolute", left: "50%", top: "0", height: "50%", width: "1px", transformOrigin: "50% 100%", transform: `translateX(-50%) rotate(${t?.r ?? ''})` }}>
                    <span style={{ display: "block", width: "1px", height: `${t?.h ?? ''}`, background: `${v.ringC ?? ''}` }} />
                  </div>
                </Fragment>))}
                {" "}
                {(v.hours ?? []).map((t, $index) => (<Fragment key={$index}>
                  <span style={{ position: "absolute", left: `${t?.x ?? ''}`, top: `${t?.y ?? ''}`, transform: "translate(-50%,-50%)", fontFamily: "var(--font-mono)", fontSize: "11px", opacity: ".55" }}>
                    {t?.t}
                  </span>
                </Fragment>))}
                {" "}
                <div style={{ position: "absolute", left: "50%", top: "50%", width: "2px", height: "44%", background: "#FF6A00", transformOrigin: "50% 100%", transform: `translate(-50%,-100%) rotate(${v.handDeg ?? ''})`, borderRadius: "2px", boxShadow: "0 0 14px rgba(255,106,0,.6)" }}>
                  <span style={{ position: "absolute", left: "-5px", top: "-5px", width: "12px", height: "12px", borderRadius: "50%", background: "#FF6A00" }} />
                </div>
                {" "}
                {(v.events ?? []).map((e, $index) => (<Fragment key={$index}>
                  {" "}
                  <div style={{ position: "absolute", left: `${e?.x ?? ''}`, top: `${e?.y ?? ''}`, transform: `${e?.tf ?? ''}`, display: "flex", alignItems: "center", gap: "8px", flexDirection: `${e?.dir ?? ''}` }}>
                    <span style={{ width: `${e?.dot ?? ''}`, height: `${e?.dot ?? ''}`, borderRadius: "50%", background: `${e?.dc ?? ''}`, boxShadow: `${e?.glow ?? ''}`, transition: "all .3s", flexShrink: "0" }} />
                    <span className="ru-ev" style={{ fontSize: "12px", whiteSpace: "nowrap", padding: "5px 10px", borderRadius: "999px", background: `${e?.bg ?? ''}`, color: `${e?.fg ?? ''}`, border: `1px solid ${e?.bd ?? ''}`, opacity: `${e?.o ?? ''}`, transition: "all .3s" }}>
                      {e?.t}
                    </span>
                  </div>
                  {" "}
                </Fragment>))}
                {" "}
                <div style={{ position: "absolute", inset: "30%", borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", textAlign: "center" }}>
                  <span style={{ fontSize: "clamp(40px,5vw,76px)", fontWeight: "600", letterSpacing: "-0.05em", lineHeight: "1", fontVariantNumeric: "tabular-nums" }}>
                    {v.hourLabel}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".6" }}>
                    {v.dayPart}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase", opacity: ".45" }}>
                    {v.t("Run.n24HDialScroll")}
                  </span>
                </div>
                {" "}
              </div>
            </div>
          </div>
          {" "}
          <div className="ru-segs" style={{ position: "absolute", left: "clamp(20px,3vw,40px)", right: "clamp(20px,3vw,40px)", bottom: "28px", display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: "16px" }}>
            {(v.psegs ?? []).map((g, $index) => (<Fragment key={$index}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ height: "2px", background: `${v.ringC ?? ''}`, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${g?.w ?? ''}`, background: "#FF6A00" }} />
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", opacity: `${g?.o ?? ''}` }}>
                  {g?.t}
                </span>
              </div>
            </Fragment>))}
          </div>
          {" "}
        </div>
      </div>
      <div ref={v.watchRef} data-screen-label="01 What I watch" style={{ background: "#0B0B0C", color: "#F4F4F2" }}>
        {" "}
        <div style={{ padding: "140px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))", gap: "56px", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
              {"(01) "}
              <span style={{ color: "#F4F4F2" }}>
                {v.t("Run.whatIWatch")}
              </span>
            </div>
            <h2 style={{ margin: "0", fontSize: "clamp(40px,4.8vw,76px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", textWrap: "balance" }}>
              {v.t("Run.sixLayers")}{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", color: "#FF6A00" }}>
                {v.t("Run.checkedEveryNight")}
              </span>
            </h2>
            <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.6", color: "#B8B3AA", maxWidth: "500px" }}>
              {v.t("Run.thePlatformIBuiltForYou")}
            </p>
            <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #232325" }}>
              {(v.wLayers ?? []).map((l, $index) => (<Fragment key={$index}>
                {" "}
                <div style={{ display: "grid", gridTemplateColumns: "28px minmax(0,1fr) auto", gap: "14px", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #1C1C1E", opacity: `${l?.rowOp ?? ''}`, transition: "opacity .3s" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: `${l?.c ?? ''}` }}>
                    {l?.n}
                  </span>
                  <span style={{ fontSize: "17px", fontWeight: "500" }}>
                    {l?.t}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-mono)", fontSize: "12px", color: `${l?.sc ?? ''}`, whiteSpace: "nowrap" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: `${l?.sc ?? ''}`, animation: "rdPulse 1.6s infinite" }} />
                    {l?.status}
                  </span>
                </div>
                {" "}
              </Fragment>))}
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#6B675F" }}>
              {v.t("Run.exampleFigures")}
            </span>
          </div>
          <div style={{ position: "relative", height: "clamp(460px,46vw,620px)", perspective: "2200px", contain: "paint" }}>
            {" "}
            <div style={{ position: "absolute", left: "14%", right: "14%", top: "36%", bottom: "36%", transformStyle: "preserve-3d", transform: `${v.wStackTf ?? ''}` }}>
              {" "}
              {(v.wLayers ?? []).map((l, $index) => (<Fragment key={$index}>
                {" "}
                <div style={{ position: "absolute", inset: "0", borderRadius: "18px", border: `1px solid ${l?.bd ?? ''}`, background: `${l?.bg ?? ''}`, transform: `${l?.tf ?? ''}`, transition: "transform .6s cubic-bezier(.16,1,.3,1),border-color .3s,background .3s", overflow: "hidden", boxShadow: "0 30px 50px -20px rgba(0,0,0,.8)" }}>
                  {" "}
                  <div style={{ position: "absolute", left: "18px", right: "18px", bottom: "16px", display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: "8px" }}>
                    {(l?.cells ?? []).map((x, $index) => (<Fragment key={$index}>
                      <span style={{ height: "24px", borderRadius: "6px", background: `${x ?? ''}` }} />
                    </Fragment>))}
                  </div>
                  {" "}
                  <div style={{ position: "absolute", left: "18px", right: "18px", top: "14px", display: "flex", justifyContent: "space-between", gap: "10px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".08em", textTransform: "uppercase" }}>
                    <span style={{ color: `${l?.tc ?? ''}` }}>
                      {l?.n}{" · "}{l?.t}
                    </span>
                    <span style={{ color: `${l?.sc ?? ''}` }}>
                      {l?.mark}
                    </span>
                  </div>
                  {" "}
                  {l?.on ? (<>
                    <span style={{ position: "absolute", top: "0", bottom: "0", width: "22%", background: "linear-gradient(90deg,transparent,rgba(255,106,0,.25),transparent)", animation: "rdScanX 1s linear infinite" }} />
                  </>) : null}
                  {" "}
                </div>
                {" "}
              </Fragment>))}
              {" "}
            </div>
            {" "}
            <div style={{ position: "absolute", left: "0", right: "0", bottom: "12px", display: "flex", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
              {v.t("Run.nightlyCheck")}{" "}
              <span style={{ color: "#FF9A50", marginLeft: "6px" }}>
                {v.wNow}
              </span>
            </div>
            {" "}
          </div>
        </div>
      </div>
      <div data-screen-label="02 Portal" style={{ background: "#DCD5CA" }}>
        {" "}
        <div style={{ padding: "140px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))", gap: "64px", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
              {"(02) "}
              <span style={{ color: "#0A0A0A" }}>
                {v.t("Run.yourPortal")}
              </span>
            </div>
            <h2 style={{ margin: "0", fontSize: "clamp(40px,4.8vw,76px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", textWrap: "balance" }}>
              {v.t("Run.onePlace")}{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", color: "#FF6A00" }}>
                {v.t("Run.oneThread")}
              </span>
              {" "}{v.t("Run.perTopic")}
            </h2>
            <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.6", color: "#3A3731", maxWidth: "480px" }}>
              {v.t("Run.scrollAndWatchTheGroupChat")}
            </p>
            <div style={{ display: "flex" }}>
              <a href={v.href("@portal")} style={{ borderBottom: "1px solid #0A0A0A", paddingBottom: "2px", fontSize: "15px" }}>
                {v.t("Run.openTheRealPortalDemo")}
              </a>
            </div>
          </div>
          <div ref={v.portalRef} style={{ position: "relative", height: "clamp(520px,50vw,660px)", perspective: "1600px", contain: "paint" }}>
            {" "}
            <div style={{ position: "absolute", inset: "0", transformStyle: "preserve-3d", transform: `${v.pStageTf ?? ''}` }}>
              {" "}
              <div style={{ position: "absolute", inset: "0", borderRadius: "26px", background: "#0B0B0C", boxShadow: "0 40px 80px rgba(10,10,10,.28)", opacity: `${v.pFrameOp ?? ''}`, transform: "translateZ(-20px)" }}>
                {" "}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #1C1C1E", color: "#F4F4F2" }}>
                  <span style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "14px", fontWeight: "600" }}>
                    {"RIDEFF "}
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".1em", color: "#8C877E" }}>
                      {"PORTAL"}
                    </span>
                  </span>
                  <span style={{ display: "flex", gap: "6px", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: "11px", color: "#FF9A50" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FF6A00", animation: "rdPulse 2s infinite" }} />
                    {v.t("Run.n4Threads0Lost")}
                  </span>
                </div>
                {" "}
                <div style={{ position: "absolute", left: "2.5%", right: "2.5%", top: "13%", display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: "2%" }}>
                  {(v.pTopics ?? []).map((t, $index) => (<Fragment key={$index}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "10px 12px", borderRadius: "12px", background: "#151516", borderTop: `2px solid ${t?.c ?? ''}` }}>
                      <b style={{ fontSize: "13px", color: "#F4F4F2", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {t?.t}
                      </b>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".06em", textTransform: "uppercase", color: `${t?.c ?? ''}` }}>
                        {t?.s}
                      </span>
                    </div>
                  </Fragment>))}
                </div>
                {" "}
              </div>
              {" "}
              <div style={{ position: "absolute", left: "50%", top: "6%", transform: "translate(-50%,0) translateZ(60px)", opacity: `${v.pChaosOp ?? ''}`, background: "#25D366", color: "#0A0A0A", borderRadius: "999px", padding: "9px 16px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".06em", textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: "0 14px 30px rgba(10,10,10,.2)" }}>
                {v.t("Run.groupChat214Unread")}
              </div>
              {" "}
              {(v.pBubbles ?? []).map((b, $index) => (<Fragment key={$index}>
                {" "}
                <div style={{ position: "absolute", left: `${b?.x ?? ''}`, top: `${b?.y ?? ''}`, width: "22.5%", boxSizing: "border-box", transform: `${b?.tf ?? ''}`, borderRadius: "12px", padding: "9px 11px", background: `${b?.bg ?? ''}`, color: `${b?.fg ?? ''}`, boxShadow: "0 12px 28px -10px rgba(10,10,10,.35)", display: "flex", flexDirection: "column", gap: "3px", borderLeft: `3px solid ${b?.c ?? ''}` }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: ".08em", textTransform: "uppercase", opacity: ".6" }}>
                    {b?.from}
                  </span>
                  <span style={{ fontSize: "clamp(11px,.95vw,13px)", lineHeight: "1.35" }}>
                    {b?.t}
                  </span>
                </div>
                {" "}
              </Fragment>))}
              {" "}
            </div>
            {" "}
          </div>
        </div>
        {" "}
      </div>
      <div ref={v.brkRef} data-screen-label="02 When it breaks" style={{ height: `${v.bH ?? ''}`, position: "relative", marginTop: "140px" }}>
      <div style={{ position: `${v.bPos ?? ''}`, top: "0", height: `${v.bInnerH ?? ''}`, boxSizing: "border-box", padding: `${v.bPad ?? ''}`, maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", justifyContent: "center", gap: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "24px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
              {"(03) "}
              <span style={{ color: "#0A0A0A" }}>
                {v.t("Run.whenSomethingBreaks")}
              </span>
            </div>
            <h2 style={{ margin: "0", fontSize: "clamp(40px,4.8vw,76px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", maxWidth: "900px", textWrap: "balance" }}>
              {v.t("Run.downAt")}{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", color: "#FF6A00" }}>
                {v.t("Run.backAt")}
              </span>
            </h2>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "16px" }}>
          <div style={{ position: "relative", background: "#FFFFFF", borderRadius: "24px", overflow: "hidden", boxShadow: "0 30px 70px rgba(10,10,10,.1)", transform: `rotate(${v.shopRot ?? ''})`, transition: "transform .3s" }}>
            {" "}
            <div style={{ display: "flex", gap: "6px", alignItems: "center", padding: "12px 16px", background: "#ECE8E1" }}>
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#C9C2B6" }} />
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#C9C2B6" }} />
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#C9C2B6" }} />
              <span style={{ marginLeft: "10px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "#5A5650" }}>
                {v.t("Run.yourShopDe")}
              </span>
            </div>
            {" "}
            <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: "14px", filter: `${v.shopFilter ?? ''}`, transition: "filter .3s" }}>
              <div style={{ height: "120px", borderRadius: "14px", background: `${v.heroBg ?? ''}`, display: "flex", alignItems: "flex-end", padding: "16px", boxSizing: "border-box" }}>
                <b style={{ fontSize: "22px", letterSpacing: "-0.02em", color: "#0A0A0A" }}>
                  {v.t("Run.newSeasonIsIn")}
                </b>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "10px" }}>
                {(v.prods ?? []).map((p, $index) => (<Fragment key={$index}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", transform: `translate(${p?.tx ?? ''}) rotate(${p?.r ?? ''})`, transition: "transform .4s" }}>
                    <span style={{ aspectRatio: "1", borderRadius: "10px", background: "#ECE8E1" }} />
                    <span style={{ fontSize: "12px" }}>
                      {p?.t}
                    </span>
                  </div>
                </Fragment>))}
              </div>
              <span style={{ alignSelf: "flex-end", borderRadius: "999px", padding: "12px 20px", fontSize: "13px", fontWeight: "600", background: `${v.ckBg ?? ''}`, color: "#F4F4F2", transition: "background .3s" }}>
                {v.ckLabel}
              </span>
            </div>
            {" "}
            {v.isBroken ? (<>
              <div style={{ position: "absolute", left: "16px", right: "16px", bottom: "16px", background: "#2A1A0E", color: "#FFD9BF", borderRadius: "14px", padding: "14px 16px", display: "flex", gap: "12px", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: "12px", animation: "rdIn .3s both" }}>
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#FF6A00", animation: "rdPulse .7s infinite" }} />
                {v.t("Run.error500CheckoutNotResponding")}
              </div>
            </>) : null}
            {" "}
          </div>
          <div style={{ background: "#0B0B0C", color: "#F4F4F2", borderRadius: "24px", padding: "24px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E", paddingBottom: "12px" }}>
              <span>
                {v.t("Run.fixTimeline")}
              </span>
              <span style={{ color: `${v.brkStateC ?? ''}` }}>
                {v.brkState}
              </span>
            </div>
            {(v.fixTl ?? []).map((f, $index) => (<Fragment key={$index}>
              {" "}
              <div style={{ display: "grid", gridTemplateColumns: "22px 70px minmax(0,1fr)", gap: "12px", alignItems: "center", padding: "14px 0", borderTop: "1px solid #1C1C1E", opacity: `${f?.o ?? ''}`, transition: "opacity .4s" }}>
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: `${f?.dot ?? ''}`, boxShadow: `${f?.glow ?? ''}`, transition: "all .4s" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF9A50" }}>
                  {f?.time}
                </span>
                <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "16px", fontWeight: "500" }}>
                    {f?.t}
                  </span>
                  <span style={{ fontSize: "13px", color: "#8C877E" }}>
                    {f?.d}
                  </span>
                </span>
              </div>
              {" "}
            </Fragment>))}
          </div>
        </div>
      </div>
      </div>
      <div ref={v.growRef} data-screen-label="04 Grows with you" style={{ height: `${v.gH ?? ''}`, position: "relative", marginTop: "140px" }}>
        {" "}
        <div style={{ position: `${v.gPos ?? ''}`, top: "0", height: `${v.gInnerH ?? ''}`, boxSizing: "border-box", padding: "40px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "48px", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
              {"(04) "}
              <span style={{ color: "#0A0A0A" }}>
                {v.t("Run.itGrowsWithYou")}
              </span>
            </div>
            <h2 style={{ margin: "0", fontSize: "clamp(38px,4.4vw,70px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", textWrap: "balance" }}>
              {v.t("Run.yourPlatform")}{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", color: "#FF6A00" }}>
                {v.t("Run.keepsGrowing")}
              </span>
            </h2>
            <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.6", color: "#3A3731", maxWidth: "480px" }}>
              {v.t("Run.newIdeaNewProcessNewLocation")}
            </p>
            <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #BDB6AA" }}>
              {(v.months ?? []).map((m, $index) => (<Fragment key={$index}>
                {" "}
                <div style={{ display: "grid", gridTemplateColumns: "90px minmax(0,1fr)", gap: "16px", padding: "12px 0", borderBottom: "1px solid #D3CCC0", opacity: `${m?.op ?? ''}`, transition: "opacity .4s" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".08em", textTransform: "uppercase", color: `${m?.mc ?? ''}`, paddingTop: "3px" }}>
                    {m?.m}
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <b style={{ fontSize: "17px", letterSpacing: "-0.02em" }}>
                      {m?.t}
                    </b>
                    <span style={{ fontSize: "14px", color: "#5A5650" }}>
                      {m?.d}
                    </span>
                  </span>
                </div>
                {" "}
              </Fragment>))}
            </div>
          </div>
          <div style={{ position: "relative", height: "clamp(420px,44vw,580px)", perspective: "2000px", contain: "paint" }}>
            {" "}
            <div style={{ position: "absolute", left: "18%", right: "18%", top: "30%", bottom: "30%", transformStyle: "preserve-3d", transform: "rotateX(58deg) rotateZ(-40deg)" }}>
              {" "}
              <div style={{ position: "absolute", inset: "-6%", borderRadius: "22px", background: "#D3CCC0", boxShadow: "0 40px 80px -30px rgba(10,10,10,.35)" }} />
              {" "}
              <div style={{ position: "absolute", inset: "-6%", borderRadius: "22px", backgroundImage: "linear-gradient(#C4BCAF 1px,transparent 1px),linear-gradient(90deg,#C4BCAF 1px,transparent 1px)", backgroundSize: "33.333% 50%", opacity: ".6" }} />
              {" "}
              {(v.blocks ?? []).map((b, $index) => (<Fragment key={$index}>
                {" "}
                <div style={{ position: "absolute", left: `${b?.x ?? ''}`, top: `${b?.y ?? ''}`, width: "29%", height: "42%", transformStyle: "preserve-3d", transform: `${b?.tf ?? ''}`, opacity: `${b?.op ?? ''}` }}>
                  {" "}
                  {(b?.slices ?? []).map((sl, $index) => (<Fragment key={$index}>
                    <span style={{ position: "absolute", inset: "0", borderRadius: "10px", background: `${sl?.bg ?? ''}`, transform: `${sl?.tf ?? ''}` }} />
                  </Fragment>))}
                  {" "}
                  <span style={{ position: "absolute", inset: "0", borderRadius: "10px", background: `${b?.c ?? ''}`, transform: `${b?.topTf ?? ''}`, display: "flex", alignItems: "flex-end", padding: "10px", boxSizing: "border-box", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".06em", textTransform: "uppercase", color: "#0A0A0A", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.35)" }}>
                    {b?.t}
                  </span>
                  {" "}
                </div>
                {" "}
              </Fragment>))}
              {" "}
            </div>
            {" "}
            <div style={{ position: "absolute", left: "0", right: "0", bottom: "12px", display: "flex", justifyContent: "center", gap: "8px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
              {v.t("Run.modulesLive")}{" "}
              <b style={{ color: "#FF6A00" }}>
                {v.gCount}
              </b>
              {" "}{v.t("Run.n06SamePlatform")}
            </div>
            {" "}
          </div>
        </div>
      </div>
      <div ref={v.mailRef} data-screen-label="04 Every Monday" style={{ padding: "140px clamp(20px,3vw,40px) 0", maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "64px", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
            {"(05) "}
            <span style={{ color: "#0A0A0A" }}>
              {v.t("Run.everyMonday")}
            </span>
          </div>
          <h2 style={{ margin: "0", fontSize: "clamp(40px,4.8vw,76px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", textWrap: "balance" }}>
            {v.t("Run.oneEmailThatTellsYou")}{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", color: "#FF6A00" }}>
              {v.t("Run.itSRunning")}
            </span>
          </h2>
          <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.6", color: "#3A3731", maxWidth: "460px" }}>
            {v.t("Run.whatTheSystemHandledWhatChanged")}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {(v.inbox ?? []).map((x, $index) => (<Fragment key={$index}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "14px 18px", borderRadius: "14px", background: "#F4F1EC", fontSize: "14px", color: "#8C877E", opacity: `${x?.o ?? ''}` }}>
              <span>
                {x?.a}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
                {x?.b}
              </span>
            </div>
          </Fragment>))}
          <div style={{ background: "#FFFFFF", borderRadius: "22px", padding: "32px", display: "flex", flexDirection: "column", gap: "18px", boxShadow: `0 30px 70px rgba(10,10,10,${v.mailSh ?? ''})`, transform: `translateY(${v.mailY ?? ''}) scale(${v.mailS ?? ''})`, opacity: `${v.mailO ?? ''}`, border: `2px solid ${v.mailBd ?? ''}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "12px", color: "#5A5650" }}>
              <span>
                {v.t("Run.fromRIDEFFWeekly")}
              </span>
              <span>
                {v.t("Run.mon0700")}
              </span>
            </div>
            <b style={{ fontSize: "26px", letterSpacing: "-0.03em" }}>
              {v.t("Run.yourWeekInOneRead")}
            </b>
            {(v.weekly ?? []).map((w, $index) => (<Fragment key={$index}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", padding: "12px 0", borderTop: "1px solid #ECE8E1", fontSize: "16px" }}>
                <span style={{ color: "#3A3731" }}>
                  {w?.a}
                </span>
                <b style={{ fontVariantNumeric: "tabular-nums" }}>
                  {w?.b}
                </b>
              </div>
            </Fragment>))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", background: "#FFF3EA", borderRadius: "14px", padding: "14px 16px", fontSize: "15px" }}>
              <span>
                {v.t("Run.n2OffersWaitingForYourApproval")}
              </span>
              <span style={{ background: "#0A0A0A", color: "#F4F4F2", borderRadius: "999px", padding: "8px 14px", fontSize: "12px", fontWeight: "600" }}>
                {v.t("Run.review")}
              </span>
            </div>
            <span style={{ fontSize: "12px", color: "#8C877E" }}>
              {v.t("Run.exampleFigures")}
            </span>
          </div>
        </div>
      </div>
      <div ref={v.rcRef} id="run-included" data-screen-label="04 Included" style={{ padding: "140px clamp(20px,3vw,40px) 0", maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "56px", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "22px", position: "sticky", top: "120px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
            {"(06) "}
            <span style={{ color: "#0A0A0A" }}>
              {v.t("Run.whatSIncluded")}
            </span>
          </div>
          <h2 style={{ margin: "0", fontSize: "clamp(40px,4.8vw,76px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", textWrap: "balance" }}>
            {v.t("Run.oneReceipt")}{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", color: "#FF6A00" }}>
              {v.t("Run.noSurprises")}
            </span>
          </h2>
          <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.6", color: "#3A3731", maxWidth: "440px" }}>
            {v.t("Run.everythingThatKeepsYourSystemRunning")}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "min(100%,420px)", height: "30px", borderRadius: "12px", background: "#0B0B0C", position: "relative", zIndex: "2" }} />
          <div style={{ width: "min(92%,380px)", overflow: "hidden", marginTop: "-8px", maxHeight: `${v.rcH ?? ''}` }}>
            {" "}
            <div style={{ background: "#FFFFFF", padding: "30px 26px 22px", fontFamily: "var(--font-mono)", fontSize: "13px", color: "#0A0A0A", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "4px", paddingBottom: "14px", borderBottom: "1px dashed #BDB6AA" }}>
                <b style={{ fontFamily: "var(--font-sans)", fontSize: "20px", letterSpacing: "-0.02em" }}>
                  {"RIDEFF"}
                </b>
                <span style={{ fontSize: "11px", color: "#5A5650" }}>
                  {v.t("Run.growthMonthlyEichstatt")}
                </span>
              </div>
              {(v.incl ?? []).map((i, $index) => (<Fragment key={$index}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "7px 0" }}>
                  <span>
                    {"✓ "}{i}
                  </span>
                  <span style={{ color: "#8C877E" }}>
                    {v.t("Run.incl")}
                  </span>
                </div>
              </Fragment>))}
              <div style={{ borderTop: "1px dashed #BDB6AA", marginTop: "8px", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "6px", color: "#5A5650" }}>
                {(v.offerSet ?? []).map((i, $index) => (<Fragment key={$index}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "4px 0", fontSize: "12px" }}>
                    <span>
                      {i?.a}
                    </span>
                    <span>
                      {i?.b}
                    </span>
                  </div>
                </Fragment>))}
              </div>
              <div style={{ borderTop: "2px solid #0A0A0A", marginTop: "10px", paddingTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "16px" }}>
                <b>
                  {v.t("Run.tOTAL")}
                </b>
                <b>
                  {v.t("Run.n24900Mo")}
                </b>
              </div>
              <span style={{ fontSize: "11px", color: "#8C877E" }}>
                {v.t("Run.netPlus19VAT12Month")}
              </span>
              <div style={{ textAlign: "center", paddingTop: "16px", fontSize: "11px", color: "#5A5650" }}>
                {v.t("Run.onePersonOneInvoiceThankYou")}
              </div>
            </div>
            {" "}
            <div style={{ height: "14px", background: "linear-gradient(-45deg,transparent 9px,#FFFFFF 0) 0 0/18px 14px repeat-x,linear-gradient(45deg,transparent 9px,#FFFFFF 0) 0 0/18px 14px repeat-x" }} />
            {" "}
          </div>
        </div>
      </div>
      <div ref={v.promRef} data-screen-label="06 Promise" style={{ padding: "140px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
            {"(07) "}
            <span style={{ color: "#0A0A0A" }}>
              {v.t("Run.thePromise")}
            </span>
          </div>
          <h2 style={{ margin: "0", fontSize: "clamp(40px,4.8vw,76px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600" }}>
            {v.t("Run.measured")}{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", color: "#FF6A00" }}>
              {v.t("Run.notDescribed")}
            </span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,250px),1fr))", gap: "14px" }}>
          <div style={{ background: "#F4F1EC", borderRadius: "24px", padding: "26px", display: "flex", flexDirection: "column", gap: "22px", minHeight: "320px", boxSizing: "border-box" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
              {v.t("Run.firstReply")}
            </span>
            <div style={{ position: "relative", width: "120px", height: "120px", borderRadius: "50%", background: `conic-gradient(#FF6A00 ${v.prRing ?? ''},#DCD5CA 0)` }}>
              {" "}
              <div style={{ position: "absolute", inset: "10px", borderRadius: "50%", background: "#F4F1EC", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <b style={{ fontSize: "34px", letterSpacing: "-0.04em", lineHeight: "1" }}>
                  {v.prReply}
                </b>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#8C877E" }}>
                  {v.t("Run.hoursMax")}
                </span>
              </div>
              {" "}
            </div>
            <span style={{ fontSize: "15px", lineHeight: "1.5", color: "#3A3731", marginTop: "auto" }}>
              {v.t("Run.onWorkingDaysEveryMessageIn")}
            </span>
          </div>
          <div style={{ background: "#F4F1EC", borderRadius: "24px", padding: "26px", display: "flex", flexDirection: "column", gap: "22px", minHeight: "320px", boxSizing: "border-box" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
              {v.t("Run.uptimeLast30Days")}
            </span>
            <b style={{ fontSize: "clamp(48px,4.6vw,72px)", fontWeight: "600", letterSpacing: "-0.055em", lineHeight: "1", fontVariantNumeric: "tabular-nums" }}>
              {v.prUp}{"%"}
            </b>
            <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", height: "44px" }}>
              {(v.prBars ?? []).map((x, $index) => (<Fragment key={$index}>
                <span style={{ flex: "1", height: `${x?.h ?? ''}`, borderRadius: "2px", background: `${x?.c ?? ''}`, opacity: `${x?.o ?? ''}`, transition: "opacity .3s,height .4s" }} />
              </Fragment>))}
            </div>
            <span style={{ fontSize: "15px", lineHeight: "1.5", color: "#3A3731", marginTop: "auto" }}>
              {v.t("Run.monitoredAroundTheClockYouSee")}
            </span>
          </div>
          <div style={{ background: "#F4F1EC", borderRadius: "24px", padding: "26px", display: "flex", flexDirection: "column", gap: "22px", minHeight: "320px", boxSizing: "border-box" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
              {v.t("Run.backups")}
            </span>
            <b style={{ fontSize: "clamp(48px,4.6vw,72px)", fontWeight: "600", letterSpacing: "-0.055em", lineHeight: "1" }}>
              {v.t("Run.daily")}
            </b>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,minmax(0,1fr))", gap: "6px" }}>
              {(v.prDays ?? []).map((d, $index) => (<Fragment key={$index}>
                <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "100%", aspectRatio: "1", borderRadius: "8px", background: `${d?.bg ?? ''}`, boxShadow: `${d?.sh ?? ''}`, transition: "all .4s" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#8C877E" }}>
                    {d?.t}
                  </span>
                </span>
              </Fragment>))}
            </div>
            <span style={{ fontSize: "15px", lineHeight: "1.5", color: "#3A3731", marginTop: "auto" }}>
              {v.t("Run.everyNightKeptInTheEU")}
            </span>
          </div>
          <div style={{ background: "#0B0B0C", color: "#F4F4F2", borderRadius: "24px", padding: "26px", display: "flex", flexDirection: "column", gap: "22px", minHeight: "320px", boxSizing: "border-box" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
              {v.t("Run.yourContact")}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ position: "relative", width: "76px", height: "76px", flexShrink: "0" }}>
                <img src={opt("/images/rialto-about-v3.jpg")} alt="Rialto" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", objectPosition: "50% 25%", display: "block" }} />
                <span style={{ position: "absolute", right: "2px", bottom: "2px", width: "16px", height: "16px", borderRadius: "50%", background: "#61CC80", border: "3px solid #0B0B0C", animation: "rdPulse 1.6s infinite" }} />
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <b style={{ fontSize: "clamp(40px,3.6vw,56px)", letterSpacing: "-0.05em", lineHeight: "1" }}>
                  {"1"}
                </b>
                <span style={{ fontSize: "14px", color: "#B8B3AA" }}>
                  {v.t("Run.person")}
                </span>
              </span>
            </div>
            <span style={{ fontSize: "15px", lineHeight: "1.5", color: "#B8B3AA", marginTop: "auto" }}>
              {v.t("Run.rialtoTheSamePersonFromFirst")}
            </span>
          </div>
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#8C877E" }}>
          {v.t("Run.exampleFiguresFinalReplyTimeAnd")}
        </span>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", flexWrap: "wrap", paddingTop: "28px", borderTop: "1px solid #BDB6AA" }}>
          <span style={{ fontSize: "18px" }}>
            {v.t("Run.thatSTheWholeLoop")}{" "}
            <b>
              {v.t("Run.understandBuildRun")}
            </b>
          </span>
          <a href={v.href("/contact")} style={{ background: "#FF6A00", color: "#0A0A0A", borderRadius: "999px", padding: "15px 24px", fontWeight: "700", fontSize: "13px", letterSpacing: ".06em", textTransform: "uppercase" }}>
            {v.t("Run.startAProject")}
          </a>
        </div>
      </div>
      <Footer  />
    </>
  );
};

export default function RunPage(props) {
  const dc = useDC();
  return <Logic key={dc.locale} {...dc} {...props} />;
}
