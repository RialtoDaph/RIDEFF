// @ts-nocheck -- ported 1:1 from rideff_handoff/design/RIDEFF Home.dc.html (see scripts/dc-port/convert.mjs)
'use client';
import React, { Fragment } from 'react';
import { DCLogic, dcStyle, opt, press, useDC } from '@/lib/dc';
import PlatformSection from '@/components/home/PlatformSection';
import PriceAnchor from '@/components/home/PriceAnchor';
import ClosingScene from '@/components/home/ClosingScene';
import Nav from '@/components/dc/Nav';
import Footer from '@/components/dc/Footer';
import { WhatsAppIcon } from '@/components/nana/icons';
import { eur } from '@/lib/format';

class Logic extends DCLogic {
  state = {
    pin: false,
    // Phones: the doors stick bottom-aligned (mTop < 0) and scroll through the three pillars.
    mpin: false,
    dbh: 0,
    mTop: 0,
    how: 0,
    i: 0,
    d: 0,
    faq: 0,
    menu: false,
    fName: '',
    fContact: '',
    need: null,
    clock: ''
  };
  DUR = 5000;
  P = [{
    door: this.props.t("Home.understand"),
    label: this.props.t("Home.analysis"),
    bg: '#CFC6B8',
    stat: this.props.t("Home.n15Min"),
    statLabel: this.props.t("Home.firstCallFree2"),
    chips: ['Call', this.props.t("Home.map"), this.props.t("Home.audit"), this.props.t("Home.offer")],
    thumb: '#CFC6B8',
    glyph: '✎',
    ic: '#0A0A0A'
  }, {
    door: this.props.t("Home.build"),
    label: this.props.t("Home.systems"),
    bg: '#0B0B0C',
    stat: '24/7',
    statLabel: this.props.t("Home.runsWhileYouSleep"),
    chips: [this.props.t("Home.agents"), this.props.t("Home.apps"), this.props.t("Home.web"), this.props.t("Home.shops")],
    thumb: '#0B0B0C',
    glyph: '✳',
    ic: '#FF6A00'
  }, {
    door: this.props.t("Home.run"),
    label: this.props.t("Home.care"),
    bg: '#3A332B',
    stat: '1',
    statLabel: this.props.t("Home.portalForEverything"),
    chips: [this.props.t("Home.hosting2"), this.props.t("Home.updates"), this.props.t("Home.reports"), this.props.t("Home.support")],
    thumb: '#3A332B',
    glyph: '♥',
    ic: '#FF9A50'
  }];
  D = [{
    head: this.props.t("Home.iLearnHowYourBusinessActually"),
    desc: this.props.t("Home.beforeAnythingIsBuiltAFree"),
    chips: [this.props.t("Home.firstCall"), this.props.t("Home.analysis"), this.props.t("Home.processMap"), this.props.t("Home.offer")],
    status: this.props.t("Home.step1"),
    bg: '#F4F1EC',
    fg: '#0A0A0A',
    card: '#ECE8E1',
    line: '#BDB6AA',
    flow: [[this.props.t("Home.firstCall"), this.props.t("Home.n15MinutesFreeNoPitch")], [this.props.t("Home.mapTheWeek"), this.props.t("Home.everyStepToolAndPerson")], [this.props.t("Home.findWhatRepeats"), this.props.t("Home.thatIsWhereASystemPays")], [this.props.t("Home.offerInYourPortal"), this.props.t("Home.approveWithOneClickOrDon")]]
  }, {
    head: this.props.t("Home.thePlanBecomesARunningSystem"),
    desc: this.props.t("Home.aISystemsTeamAppsWebsitesAnd"),
    chips: [this.props.t("Home.aISystems"), this.props.t("Home.teamApps"), this.props.t("Home.webShops"), this.props.t("Home.integrations")],
    status: this.props.t("Home.live"),
    bg: '#0B0B0C',
    fg: '#F4F4F2',
    card: '#1C1C1E',
    line: '#3A3A3C',
    flow: [[this.props.t("Home.inquiryComesIn"), this.props.t("Home.emailWebsiteOrWhatsApp")], [this.props.t("Home.aISortsAndAnswers"), this.props.t("Home.draftsAReplyInYourTone")], [this.props.t("Home.offerPrepared"), this.props.t("Home.youApproveWithOneTap")], [this.props.t("Home.followUpRunsItself"), this.props.t("Home.remindersInvoiceReport")]]
  }, {
    head: this.props.t("Home.liveIsWhereAgenciesLeaveI"),
    desc: this.props.t("Home.hostingUpdatesBackupsFixesAndNew"),
    chips: [this.props.t("Home.hosting2"), this.props.t("Home.updates"), this.props.t("Home.portalSupport"), this.props.t("Home.weeklyReport")],
    status: this.props.t("Home.ongoing"),
    bg: '#DCD5CA',
    fg: '#0A0A0A',
    card: '#ECE8E1',
    line: '#A8A094',
    flow: [[this.props.t("Home.hostedInFrankfurt2"), this.props.t("Home.fastMonitoredEUOnly")], [this.props.t("Home.updatesBackups"), this.props.t("Home.dailyTestedDoneForYou")], [this.props.t("Home.requestsViaPortal"), this.props.t("Home.oneThreadPerTopic")], [this.props.t("Home.reportEveryMonday"), this.props.t("Home.knowItRunsWithoutChecking")]]
  }];
  FAQ = [[this.props.t("Home.whoIsBehindRIDEFF"), this.props.t("Home.meRialtoBasedInEichstattI")], [this.props.t("Home.doINeedToUnderstandAI"), this.props.t("Home.noThatIsThePointYou")], [this.props.t("Home.whatDoesItCost"), this.props.t("Home.core149Growth249WholeSystem")], [this.props.t("Home.whereIsMyData"), this.props.t("Home.hostedInTheEUInFrankfurt")], [this.props.t("Home.whatHappensAfterLaunch"), this.props.t("Home.iKeepItRunningUpdatesFixes")], [this.props.t("common.faqLeaveQ"), this.props.t("common.faqLeaveA")], [this.props.t("common.faqAwayQ"), this.props.t("common.faqAwayA")], [this.props.t("Home.howSoonCanWeStart"), this.props.t("Home.iKeepTheNumberOfClients")]];
  cardRef = React.createRef();
  tiltMove = e => {
    if (this.rm) return;
    const el = e.currentTarget,
      r = el.getBoundingClientRect(),
      x = (e.clientX - r.left) / r.width - .5,
      y = (e.clientY - r.top) / r.height - .5;
    el.style.transform = 'perspective(900px) rotateY(' + (x * 12).toFixed(2) + 'deg) rotateX(' + (-y * 12).toFixed(2) + 'deg) scale(1.02)';
    const g = el.querySelector('[data-glare]');
    if (g) {
      g.style.opacity = 1;
      g.style.background = 'radial-gradient(circle at ' + (x + .5) * 100 + '% ' + (y + .5) * 100 + '%, rgba(255,255,255,.75), transparent 55%)';
    }
  };
  goDoor = k => {
    const el = document.querySelector('[data-pin="doors"]'),
      st = this.state;
    if (!(st.pin || st.mpin && st.dbh) || !el) return this.setState({
      d: k
    });
    const top = st.pin ? el.getBoundingClientRect().top + scrollY + (k + .5) / 3 * (el.offsetHeight - innerHeight) : el.getBoundingClientRect().top + scrollY - st.mTop + (k + .5) / 3 * (el.offsetHeight - st.dbh);
    if (window.__lenis) window.__lenis.scrollTo(top, {
      duration: 1.4,
      easing: x => 1 - Math.pow(1 - x, 4)
    });else scrollTo({
      top,
      behavior: 'smooth'
    });
  };
  tiltLeave = e => {
    const el = e.currentTarget;
    el.style.transform = '';
    const g = el.querySelector('[data-glare]');
    if (g) g.style.opacity = 0;
  };
  fxInit() {
    try {
      this.rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {}
    // Scroll reveals for [data-rv] are site-wide: src/lib/motion.ts → watchReveals().
    this.fitPins = () => {
      if (this.state.mpin) {
        // Tallest door seen so far, so the pinned box doesn't jump between pillars.
        // Stick so the tabs sit just under the nav pill: the heading scrolls away whole
        // instead of being half-hidden behind the nav.
        const b = document.querySelector('[data-pinbox="doors"]'),
          h = b ? Math.max(this.state.dbh, b.scrollHeight) : 0,
          tabs = b && b.children[1],
          tabsOff = tabs ? tabs.getBoundingClientRect().top - b.getBoundingClientRect().top : 0,
          mTop = Math.round(Math.min(0, Math.max(innerHeight - h, 84 - tabsOff)));
        if (h && (h !== this.state.dbh || mTop !== this.state.mTop)) this.setState({
          dbh: h,
          mTop
        });
      }
      document.querySelectorAll('[data-pinbox]').forEach(b => {
        b.style.transform = '';
        if (!this.state.pin) return;
        const ch = b.scrollHeight,
          k = Math.min(1, (innerHeight - 8) / ch);
        b.style.transform = k < 1 ? 'scale(' + k.toFixed(4) + ')' : '';
      });
    };
    this.calcPin = () => {
      const pin = !this.rm && innerWidth >= 1000 && innerHeight >= 640,
        mpin = !this.rm && innerWidth < 1000 && innerHeight >= 560;
      if (pin !== this.state.pin || mpin !== this.state.mpin) this.setState({
        pin,
        mpin,
        dbh: 0
      }, () => {
        this.fitPins();
        this.scrollFx();
      });else this.fitPins();
    };
    this.fitT = setInterval(() => this.fitPins(), 1500);
    this.calcPin();
    window.addEventListener('resize', this.calcPin);
    this.onFxScroll = () => {
      if (this.raf) return;
      this.raf = requestAnimationFrame(() => {
        this.raf = 0;
        this.scrollFx();
      });
    };
    window.addEventListener('scroll', this.onFxScroll, {
      passive: true
    });
    window.addEventListener('resize', this.onFxScroll);
    this.scrollFx();
  }
  scrollFx() {
    const vh = innerHeight,
      cl = (v, a, b) => Math.max(a, Math.min(b, v));
    const words = document.querySelector('[data-words]');
    if (words) {
      const r = words.getBoundingClientRect(),
        t = cl((vh * .85 - r.top) / (r.height + vh * .35), 0, 1),
        sp = words.querySelectorAll('[data-wd]'),
        n = sp.length,
        lit = Math.round(t * n);
      sp.forEach((s, k) => {
        const muted = s.dataset.wd === '1';
        s.style.color = k < lit ? muted ? '#8C877E' : '#0A0A0A' : '#D3CCC0';
      });
    }
    const pin = this.state.pin,
      mp = this.state.mpin && this.state.dbh;
    const dp = document.querySelector('[data-pin="doors"]');
    if (dp && (pin || mp)) {
      const r = dp.getBoundingClientRect(),
        t = pin ? cl(-r.top / (r.height - vh), 0, .999) : cl((this.state.mTop - r.top) / (r.height - this.state.dbh), 0, .999),
        d = Math.floor(t * 3);
      if (d !== this.state.d) this.setState({
        d
      });
      const b = dp.querySelector('[data-dbar]');
      if (b) b.style.transform = 'scaleX(' + t.toFixed(4) + ')';
    }
    const hp = document.querySelector('[data-pin="how"]'),
      hr = hp && hp.getBoundingClientRect();
    const how = document.querySelector('[data-how]');
    if (how) {
      const r = how.getBoundingClientRect(),
        t = pin && hr ? cl(-hr.top / ((hr.height - vh) * .85), 0, 1) : cl((vh * .8 - r.top) / (vh * .45), 0, 1),
        line = how.querySelector('[data-howline]');
      if (line) line.style.width = t * 100 + '%';
      const a = this.rm ? 5 : Math.ceil(t * 5 - .001);
      if (a !== this.state.how) this.setState({
        how: a
      });
    }
  }
  measure = () => {
    const el = this.cardRef.current;
    if (!el) return;
    const w = el.offsetWidth,
      vw = window.innerWidth;
    const tab = Math.round(Math.min(170, Math.max(96, w * 0.185)));
    const chipsW = this.chipsRef.current ? this.chipsRef.current.offsetWidth : 180;
    const narrow = w < tab * 3 + 20 + 14 + chipsW + 24;
    const hero = vw > 1120;
    if (narrow !== this.state.narrow || tab !== this.state.tabH || hero !== this.state.hero) this.setState({
      narrow,
      tabH: tab,
      hero
    });
  };
  chipsRef = React.createRef();
  componentDidMount() {
    this.setState({ mounted: true });
    this.measure();
    window.addEventListener('resize', this.measure);
    setTimeout(this.measure, 300);
    setTimeout(() => this.fxInit(), 60);
    this.start();
    const tick = () => this.setState({
      clock: new Date().toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Berlin'
      }) + ' CET'
    });
    tick();
    this.ck = setInterval(tick, 30000);
    this.onEsc = e => {
      if (e.key === 'Escape' && this.state.caseOpen) this.renderVals().closeCase();
    };
    window.addEventListener('keydown', this.onEsc);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onFxScroll);
    if (this.calcPin) window.removeEventListener('resize', this.calcPin);
    clearInterval(this.fitT);
    window.removeEventListener('resize', this.onFxScroll);
    window.removeEventListener('resize', this.measure);
    clearInterval(this.t);
    clearInterval(this.ck);
    window.removeEventListener('keydown', this.onEsc);
  }
  tree() {
    const C = ['#FF9E47', '#61CC80', '#54B0E6', '#9E8CF2', '#E0B842', '#EB7AAB'];
    const hubs = C.map((c, k) => ({
      x: 6 + k * 17.6,
      c
    }));
    const agents = [],
      treeLines = [];
    hubs.forEach(u => {
      treeLines.push({
        x1: 50,
        y1: 0,
        x2: u.x,
        y2: 50,
        c: u.c
      });
      [-5, 0, 5].forEach(d => {
        agents.push({
          x: u.x + d + '%',
          c: u.c
        });
        treeLines.push({
          x1: u.x,
          y1: 50,
          x2: u.x + d,
          y2: 100,
          c: u.c
        });
      });
    });
    const tl = treeLines.map((l, k) => {
      const hub = Math.floor(k / 4),
        leaf = k % 4 !== 0,
        base = [0, 1.1, .4, 1.6, .8, 2][hub];
      return {
        ...l,
        dur: '2.6s',
        dl: (base + (leaf ? .75 + k % 4 * .08 : 0)).toFixed(2) + 's'
      };
    });
    return {
      hubs: hubs.map((u, k) => ({
        x: u.x + '%',
        c: u.c,
        dl: k * .4 + 's'
      })),
      agents,
      treeLines: tl
    };
  }
  fxEl(s) {
    if (this._lastI === undefined) this._lastI = s.i;
    if (this._lastI !== s.i) {
      this._lastI = s.i;
      let rm = false;
      try {
        rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
      } catch (e) {}
      if (!rm) this._fxKey = Date.now();
    }
    if (!this._fxKey) return null;
    const N = 12,
      col = this.P[s.i].bg,
      e = React.createElement;
    const slats = Array.from({
      length: N
    }, (_, k) => e('div', {
      key: k,
      style: {
        flex: 1,
        height: '100%',
        background: k % 2 ? col : '#0A0A0A',
        borderRight: '1px solid rgba(255,154,80,.18)',
        boxShadow: 'inset 0 -2px 0 #FF6A00, 0 6px 24px rgba(255,106,0,.35)',
        transform: 'translateY(-102%)',
        animation: 'rdSlat .95s cubic-bezier(.77,0,.18,1) ' + k * 32 + 'ms forwards'
      }
    }));
    const scan = e('div', {
      key: 'scan',
      style: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '2px',
        background: '#FF6A00',
        boxShadow: '0 0 24px 6px rgba(255,106,0,.55)',
        opacity: 0,
        animation: 'rdScan 1.1s cubic-bezier(.6,0,.2,1) 80ms forwards'
      }
    });
    const label = e('div', {
      key: 'lab',
      style: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        color: '#F4F4F2',
        fontFamily: "var(--font-mono)",
        fontSize: '12px',
        letterSpacing: '.24em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        mixBlendMode: 'difference',
        opacity: 0,
        animation: 'rdSlat .95s cubic-bezier(.77,0,.18,1) 120ms forwards, rdPulse .95s linear 120ms'
      }
    }, this.props.t("Home.pillar0") + (s.i + 1) + ' · ' + this.P[s.i].door);
    return e('div', {
      key: this._fxKey,
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
        display: 'flex',
        overflow: 'hidden'
      }
    }, ...slats, scan, label);
  }
  start() {
    clearInterval(this.t);
    if (this.props.autoRotate ?? true) this.t = setInterval(() => this.setState(s => ({
      i: (s.i + 1) % 3
    })), this.DUR);
  }
  renderVals() {
    const s = this.state,
      p = this.P[s.i],
      d = this.D[s.d];
    const need = [this.props.t("Home.aISystem"), this.props.t("Home.teamApp"), this.props.t("Home.websiteShop"), 'RIDEFF Life', this.props.t("Home.notSureYet")];
    // Days depend on the visitor's date: computed after mount (static HTML has none).
    if (!this._days && this.state.mounted) {
      const out = [],
        base = Date.now();
      for (let i = 1; i <= 9 && out.length < 5; i++) {
        const x = new Date(base + i * 86400000);
        const wd = x.getDay();
        if (wd !== 0 && wd !== 6) out.push(x);
      }
      this._days = out;
    }
    const days = this._days || [];
    const WD = [this.props.t("Home.sun"), this.props.t("Home.mon"), this.props.t("Home.tue"), this.props.t("Home.wed"), this.props.t("Home.thu"), this.props.t("Home.fri"), this.props.t("Home.sat")],
      MO = [this.props.t("Home.jan"), this.props.t("Home.feb"), this.props.t("Home.mar"), this.props.t("Home.apr"), this.props.t("Home.may"), this.props.t("Home.jun"), this.props.t("Home.jul"), this.props.t("Home.aug"), this.props.t("Home.sep"), this.props.t("Home.oct"), this.props.t("Home.nov"), this.props.t("Home.dec")],
      TIMES = ['09:30', '13:00', '16:30'];
    const sd = days[s.slotDay ?? -1],
      slot = sd && s.slotTime != null ? `${WD[sd.getDay()]} ${sd.getDate()} ${MO[sd.getMonth()]}, ${TIMES[s.slotTime]} CET` : null;
    const msg = this.props.t('common.waIntro', { name: s.fName || '…', contact: s.fContact || '…', need: s.need || this.props.t('common.waNotSure') }) + (slot ? this.props.t('common.waSlot', { slot }) : '');
    return {
      slotDays: days.map((d, k) => {
        const on = s.slotDay === k;
        return {
          wd: WD[d.getDay()],
          day: d.getDate(),
          bg: on ? '#FF6A00' : 'transparent',
          fg: on ? '#0A0A0A' : '#F4F4F2',
          bd: on ? '#FF6A00' : '#2A2A2C',
          go: () => this.setState({
            slotDay: k,
            slotTime: s.slotTime ?? 0
          })
        };
      }),
      slotTimes: TIMES.map((t, k) => {
        const on = s.slotTime === k;
        return {
          t,
          bg: on ? '#F4F4F2' : 'transparent',
          fg: on ? '#0A0A0A' : '#F4F4F2',
          bd: on ? '#F4F4F2' : '#2A2A2C',
          go: () => this.setState({
            slotTime: k,
            slotDay: s.slotDay ?? 0
          })
        };
      }),
      caseOpen: !!s.caseOpen,
      openCase: () => {
        this.setState({
          caseOpen: true
        });
        if (window.__lenis) window.__lenis.stop();
      },
      closeCase: () => {
        this.setState({
          caseOpen: false
        });
        if (window.__lenis) window.__lenis.start();
      },
      stopBubble: e => e.stopPropagation(),
      ticTags: [this.props.t("Home.shopDEEN"), this.props.t("Home.stripePayPal"), this.props.t("Home.backOffice"), this.props.t("Home.dHLLabels"), this.props.t("Home.restockAlerts")],
      ticBuilt: [this.props.t("Home.onlineShopInGermanAndEnglish"), this.props.t("Home.backOfficeThatOpensOnA"), this.props.t("Home.dHLShippingLabelsForAllOpen"), this.props.t("Home.restockTrackingWithCustomerWaitingLists"), this.props.t("Home.smallBusinessTaxLimitTrackedLive"), this.props.t("Home.abandonedCartWinBack")],
      ticMorning: [this.props.t("Home.n4OrdersToShip"), this.props.t("Home.n1RefundToProcess"), this.props.t("Home.n2ProductsToRestock"), this.props.t("Home.n1PaymentToChase"), this.props.t("Home.n4AbandonedCartsToWinBack")],
      menuOpen: s.menu,
      clock: s.clock,
      toggleMenu: () => this.setState(x => ({
        menu: !x.menu
      })),
      menuLinks: [[this.props.t("Home.home"), '#top'], [this.props.t("Home.theControlRoom"), '#doors'], [this.props.t("Home.theWorkbench"), '#doors'], [this.props.t("Home.theStorefront"), '#doors'], [this.props.t("Home.everyday"), '#doors'], [this.props.t("Home.work"), '#proof'], [this.props.t("Home.pricing"), '#pricing'], [this.props.t("Home.about"), '#thesis'], [this.props.t("Home.contact"), '#start']].map((m, k) => ({
        n: '0' + (k + 1),
        t: m[0],
        href: m[1]
      })),
      ...p,
      num: '0' + (s.i + 1),
      is0: s.i === 0,
      is1: s.i === 1,
      is2: s.i === 2,
      heroBars: [[this.props.t("Home.inquiries"), 4], [this.props.t("Home.offers"), 3], [this.props.t("Home.shifts"), 3], [this.props.t("Home.invoices"), 2], [this.props.t("Home.dataEntry"), 2]].map(b => ({
        t: b[0],
        w: b[1] / 4 * 100 + '%',
        h: b[1] + ' h'
      })),
      tabs: this.P.map((x, k) => ({
        n: '0' + (k + 1),
        door: x.door,
        thumb: x.thumb,
        glyph: x.glyph,
        ic: x.ic,
        bd: k === s.i ? '#F4F1EC' : 'transparent',
        w: k === s.i ? '100%' : '0%',
        dur: k === s.i ? this.DUR + 'ms' : '0ms',
        op: k === s.i ? 1 : 0.6,
        zoom: k === s.i ? 'scale(1.08)' : 'scale(1)',
        img: [opt("/images/rialto-understand-v2.jpg"), opt("/images/tic-backoffice.png"), opt("/images/rialto-run-v2.jpg")][k],
        go: () => {
          this.setState({
            i: k
          });
          this.start();
        }
      })),
      op0: s.i === 0 ? 1 : 0,
      op1: s.i === 1 ? 1 : 0,
      op2: s.i === 2 ? 1 : 0,
      fx: this.fxEl(s),
      ...Object.fromEntries([0, 1, 2].flatMap(k => {
        const on = s.i === k,
          anim = !!this._fxKey;
        return [['tf' + k, on ? 'scale(1)' : 'scale(1.08)'], ['fl' + k, on ? 'blur(0px) saturate(1)' : 'blur(14px) saturate(1.6)'], ['tr' + k, !anim ? 'opacity .6s' : on ? 'opacity .35s 420ms, transform 1.4s 420ms cubic-bezier(.16,1,.3,1), filter 1s 420ms ease-out' : 'opacity .1s 420ms, transform .1s 520ms, filter .1s 520ms']];
      })),
      pHref: [this.props.href("/understand"), this.props.href("/build"), this.props.href("/run")][s.i],
      cardRef: this.cardRef,
      chipsRef: this.chipsRef,
      heroMode: s.hero !== false,
      cardTop: s.hero !== false ? '0px' : '84px',
      cardH: s.hero !== false ? 'max(680px,calc(100vh - 32px))' : 'max(620px,calc(100vh - 116px))',
      tabFont: (s.tabH || 140) < 120 ? '12px' : '14px',
      tabW: (s.tabH || 140) + 'px',
      chipBottom: s.narrow ? Math.round((s.tabH || 140) / 1.05 + 14 + 16) + 'px' : '20px',
      chipBd: s.i === 0 ? 'rgba(10,10,10,.25)' : 'rgba(244,241,236,.25)',
      chipFg: s.i === 0 ? '#0A0A0A' : '#F4F4F2',
      chipBg: s.i === 0 ? 'rgba(244,241,236,.82)' : 'rgba(11,11,12,.82)',
      prev: () => {
        this.setState({
          i: (s.i + 2) % 3
        });
        this.start();
      },
      next: () => {
        this.setState({
          i: (s.i + 1) % 3
        });
        this.start();
      },
      avatars: [[opt("/images/site-cafe.jpg"), this.props.t("Home.cafeClient")], [opt("/images/site-hotel.jpg"), this.props.t("Home.hotelClient")], [opt("/images/tic-shop.png"), this.props.t("Home.shopClient")]].map(v => ({
        src: v[0],
        ph: v[1]
      })),
      ...this.tree(),
      runFeed: [['03:00', this.props.t("Home.backupCompleted")], ['08:02', this.props.t("Home.inquiryAnswered")], ['09:30', this.props.t("Home.invoiceR2026041Paid")], [this.props.t("Home.mon"), this.props.t("Home.weeklyReportSent")]].map((f, k) => ({
        t: f[0],
        d: f[1],
        dl: k * .3 + 's'
      })),
      ticker: [0, 1].flatMap(() => [this.props.t("Home.hostedInFrankfurt2"), this.props.t("Home.gDPRByDefault"), this.props.t("Home.oneFixedMonthlyPrice"), this.props.t("Home.builtLiveMaintained"), this.props.t("Home.germanEnglish2"), this.props.t("Home.onePersonNoHandoffs")]),
      doorTabs: this.P.map((x, k) => ({
        n: '0' + (k + 1),
        door: x.door,
        op: k === s.d ? 1 : 0.45,
        line: k === s.d ? '#FF6A00' : 'transparent',
        go: () => this.goDoor(k)
      })),
      doorsH: s.pin ? '330vh' : s.mpin && s.dbh ? s.dbh + 2 * innerHeight + 'px' : 'auto',
      howH: s.pin ? '230vh' : 'auto',
      pinPos: s.pin ? 'sticky' : 'relative',
      dPinPos: s.pin || s.mpin && s.dbh ? 'sticky' : 'relative',
      dPinTop: s.mpin ? s.mTop + 'px' : '0',
      dBoxMinH: s.mpin && s.dbh ? s.dbh + 'px' : 'auto',
      pinH: s.pin ? '100vh' : 'auto',
      doorsPad: s.pin ? '76px 40px 28px' : s.mpin ? '40px 20px 12px' : '40px clamp(20px,3vw,40px) 120px',
      tabCols: s.mpin ? 'repeat(3,minmax(0,1fr))' : 'repeat(auto-fit,minmax(min(100%,300px),1fr))',
      tabFs: s.mpin ? '15px' : '18px',
      showFlow: !s.mpin,
      showTabNum: !s.mpin,
      howPad: s.pin ? '40px' : '120px clamp(20px,3vw,40px)',
      tabPad: s.pin ? '16px' : s.mpin ? '14px' : '20px',
      panelMt: s.pin ? '20px' : '28px',
      dbarOp: s.pin || s.mpin ? 1 : 0,
      // Phones pin the doors bottom-aligned; the extra link would push the heading under the nav.
      notPin: !s.pin && !s.mpin,
      dNum: '0' + (s.d + 1),
      dHref: [this.props.href("/understand"), this.props.href("/build"), this.props.href("/run")][s.d],
      dLabel: this.P[s.d].label,
      dDoor: this.P[s.d].door,
      dHead: d.head,
      dDesc: d.desc,
      dChips: d.chips,
      dStatus: d.status,
      dBg: d.bg,
      dFg: d.fg,
      dCard: d.card,
      dLine: d.line,
      dFlow: d.flow.map((f, k) => ({
        n: '0' + (k + 1),
        t: f[0],
        d: f[1],
        dl: 180 + k * 110 + 'ms'
      })),
      thesisWords: [[this.props.t("Home.iVeStoodWhereYouStand"), '0'], [this.props.t("Home.soIBuildWhatIWished"), '1']].flatMap(([t, m]) => t.split(' ').map(w => ({
        t: w + ' ',
        m
      }))),
      tiltMove: this.tiltMove,
      tiltLeave: this.tiltLeave,
      demos: [['01', this.props.t("Home.businessDemo"), this.props.t("Home.aSampleBusinessBrainDashboardFlows"), this.props.href("/demo")], ['02', this.props.t("Home.lifeDemo"), this.props.t("Home.theRIDEFFLifeCockpitWithA"), this.props.href("@lifedemo")], ['03', this.props.t("Home.clientPortal"), this.props.t("Home.whereEveryClientApprovesOffersPays"), this.props.href("@portal")]].map(x => ({
        n: x[0],
        t: x[1],
        d: x[2],
        href: x[3]
      })),
      plans: [{
        n: '01',
        name: 'Core',
        tag: this.props.t("Home.startHere"),
        for: this.props.t("Home.oneAreaConnectedUsuallyCustomersAnd"),
        price: eur(149, this.props.locale),
        setup: eur(1290, this.props.locale),
        items: [this.props.t("Home.websiteOrCoreSystem"), this.props.t("Home.aIInboxForInquiries"), this.props.t("Home.clientPortal"), this.props.t("Home.hostingBackupsUpdates")]
      }, {
        n: '02',
        name: 'Growth',
        tag: this.props.t("Home.mostChosen"),
        for: this.props.t("Home.customersSalesTeamAndOperationsIn"),
        price: eur(249, this.props.locale),
        setup: eur(1990, this.props.locale),
        items: [this.props.t("Home.everythingInCore"), this.props.t("Home.teamApp"), this.props.t("Home.automatedOffersFollowUps"), this.props.t("Home.monthlyReport")],
        dark: true
      }, {
        n: '03',
        name: this.props.t("Home.wholeSystem"),
        tag: this.props.t("Home.fullBrain"),
        for: this.props.t("Home.everyAreaConnectedFinanceAndMarketing"),
        price: eur(449, this.props.locale),
        setup: eur(3900, this.props.locale),
        items: [this.props.t("Home.everythingInGrowth"), this.props.t("Home.financeInvoicingFlows"), this.props.t("Home.marketingAutomation"), this.props.t("Home.prioritySupport")]
      }].map(x => ({
        ...x,
        bg: x.dark ? '#0B0B0C' : '#ECE8E1',
        fg: x.dark ? '#F4F4F2' : '#0A0A0A',
        line: x.dark ? '#2A2A2C' : '#D3CCC0',
        btnBg: x.dark ? '#FF6A00' : '#0A0A0A',
        btnFg: x.dark ? '#0A0A0A' : '#F4F4F2'
      })),
      costRows: [[this.props.t("Home.agencyWebsiteOneOff"), this.props.t("Home.costAgency")], [this.props.t("Home.freelancerForAutomations"), this.props.t("Home.costFreelancer")], [this.props.t("Home.n46SeparateTools"), this.props.t("Home.costTools")], [this.props.t("Home.yourTimeKeepingItTogether"), this.props.t("Home.costTime")]].map(c => ({
        t: c[0],
        v: c[1]
      })),
      phases: [[this.props.t("Home.firstCall"), this.props.t("Home.n15MinutesYouTellMeHow")], [this.props.t("Home.analysis"), this.props.t("Home.iMapWhatRepeatsAndWhat")], [this.props.t("Home.build"), this.props.t("Home.iBuildItYouSeeProgress")], [this.props.t("Home.test"), this.props.t("Home.yourTeamTriesItInA")], [this.props.t("Home.live"), this.props.t("Home.itGoesLiveAndIKeep")]].map((x, k) => {
        const on = k < s.how,
          cur = k === s.how - 1;
        return {
          n: '0' + (k + 1),
          t: x[0],
          d: x[1],
          op: on ? 1 : .35,
          tf: on ? 'none' : 'translateY(16px)',
          nb: on ? cur ? '#FF6A00' : '#0A0A0A' : 'transparent',
          nc: on ? cur ? '#0A0A0A' : '#F4F4F2' : '#5A5650',
          ns: cur ? '0 0 0 6px rgba(255,106,0,.18), 0 0 24px rgba(255,106,0,.5)' : 'inset 0 0 0 1px #BDB6AA'
        };
      }),
      faqs: this.FAQ.map((f, k) => ({
        q: f[0],
        a: f[1],
        open: s.faq === k,
        sign: s.faq === k ? '−' : '+',
        toggle: () => this.setState({
          faq: s.faq === k ? -1 : k
        })
      })),
      fName: s.fName,
      fContact: s.fContact,
      setName: e => this.setState({
        fName: e.target.value
      }),
      setContact: e => this.setState({
        fContact: e.target.value
      }),
      needs: need.map(t => {
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
      waHref: 'https://wa.me/4917632572420?text=' + encodeURIComponent(msg),
    };
  }
}

Logic.prototype.render = function render() {
  const v = { ...this.props, ...this.renderVals() };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: "html{scroll-behavior:smooth}\nbody{margin:0;background:#ECE8E1;color:#0A0A0A;font-family:var(--font-sans);-webkit-font-smoothing:antialiased}\na{color:inherit;text-decoration:none}a:hover{color:#FF6A00}\ninput,textarea{font-family:inherit}\n@keyframes rdPulse{0%,100%{opacity:1}50%{opacity:.3}}\n@keyframes rdTicker{from{transform:translateX(0)}to{transform:translateX(-50%)}}\n@keyframes rdSlat{0%{transform:translateY(-102%)}44%,56%{transform:translateY(0)}100%{transform:translateY(102%)}}\n@keyframes rdScan{0%{left:-4%;opacity:0}12%{opacity:1}88%{opacity:1}100%{left:104%;opacity:0}}\n@keyframes rdTag{0%{opacity:0;transform:rotate(180deg) translateY(-14px);filter:blur(6px)}100%{opacity:1;transform:rotate(180deg);filter:blur(0)}}\n@keyframes rdNerve{0%{stroke-dashoffset:110;opacity:0}8%{opacity:1}70%{opacity:1}100%{stroke-dashoffset:-10;opacity:0}}\n@keyframes rdGlow{0%,100%{transform:translate(-50%,-50%) scale(1);filter:brightness(1)}50%{transform:translate(-50%,-50%) scale(1.14);filter:brightness(1.5)}}\n@keyframes rdFlipIn{0%{opacity:0;transform:rotateY(-18deg) translateX(60px) translateZ(-80px);filter:blur(8px)}100%{opacity:1;transform:none;filter:blur(0)}}\n@keyframes rdRise{0%{opacity:0;transform:translateY(26px) rotateX(-30deg)}100%{opacity:1;transform:none}}\n@keyframes rdSweep{0%{left:-35%}100%{left:110%}}\n@keyframes rdSpin{to{transform:rotate(360deg)}}\n@keyframes rdBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}\n@keyframes rdKen{0%{transform:scale(1.03) translate(0,0)}100%{transform:scale(1.14) translate(-2.5%,-1.5%)}}\n@keyframes rdFeed{0%{opacity:0;transform:translateX(-18px)}10%,88%{opacity:1;transform:none}100%{opacity:0;transform:translateX(10px)}}\n@keyframes rdFloat{0%,100%{transform:translate(0,0)}50%{transform:translate(6px,-10px)}}\n@keyframes rdRing{0%{box-shadow:0 0 0 0 rgba(255,106,0,.6)}100%{box-shadow:0 0 0 14px rgba(255,106,0,0)}}\n@keyframes rdLine{0%{left:0;opacity:0}15%{opacity:1}85%{opacity:1}100%{left:100%;opacity:0}}\n@keyframes rdOrbit{to{transform:translate(-50%,-50%) rotate(360deg)}}\n@keyframes rdFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}" }} />
      <Nav active="home" heroCta={true} />
      <div id="top" data-screen-label="Hero" style={{ background: "#ECE8E1" }}>
        {" "}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,520px),1fr))", gap: "40px", padding: "16px 16px 28px clamp(20px,3vw,40px)", maxWidth: "1680px", margin: "0 auto", alignItems: "stretch" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "28px", justifyContent: "center", paddingTop: "112px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
              {v.t("Home.aISystemsAppsWebEichstattDE")}
            </div>
            <h1 className="hp-h1" style={{ margin: "0", fontSize: "clamp(43px,5.2vw,92px)", lineHeight: ".94", letterSpacing: "-0.055em", fontWeight: "600", textWrap: "balance" }}>
              <span style={{ whiteSpace: "nowrap" }}>
                {v.t("Home.onePerson")}
                <span style={{ display: "inline-flex", verticalAlign: "middle", marginLeft: ".12em" }}>
                  {(v.avatars ?? []).map((v, $index) => (<Fragment key={$index}>
                    <span style={{ width: ".62em", height: ".62em", borderRadius: "50%", overflow: "hidden", border: "3px solid #ECE8E1", marginLeft: "-.16em", display: "inline-block" }}>
                      <img src={v?.src} alt={v?.ph} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </span>
                  </Fragment>))}
                </span>
              </span>
              <br />
              {v.t("Home.understandsIt")}
              <br />
              {v.t("Home.buildsIt")}{" "}
              <span style={{ color: "#FF6A00" }}>
                {v.t("Home.keepsItRunning")}
              </span>
            </h1>
            <p style={{ margin: "0", maxWidth: "540px", fontSize: "clamp(18px,1.5vw,22px)", lineHeight: "1.5", color: "#3A3731", textWrap: "pretty" }}>
              {v.t("Home.iMRialtoIMapHow")}
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              <a href={v.href("@cal")} target="_blank" rel="noopener" style={{ background: "#0A0A0A", color: "#F4F4F2", borderRadius: "999px", padding: "17px 26px", fontWeight: "600", fontSize: "13px", letterSpacing: ".08em", textTransform: "uppercase" }} className="hv-9bccb67">
                {v.t("common.ctaCall")}
              </a>
              <a href={v.href("/work")} style={{ border: "1px solid #BDB6AA", borderRadius: "999px", padding: "17px 26px", fontWeight: "600", fontSize: "13px", letterSpacing: ".08em", textTransform: "uppercase" }}>
                {v.t("Home.seeTheWork")}
              </a>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", paddingTop: "28px" }}>
              <div style={{ flex: "1", borderTop: "1px dashed #BDB6AA" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "44px", fontWeight: "500", letterSpacing: "-0.04em", lineHeight: "1" }}>
                  {v.num}
                  <span style={{ fontSize: "20px", color: "#8C877E" }}>
                    {" / 03"}
                  </span>
                </span>
                <button onClick={v.prev} style={{ width: "48px", height: "48px", borderRadius: "50%", border: "1px solid #BDB6AA", background: "none", cursor: "pointer", fontSize: "16px" }}>
                  {"‹"}
                </button>
                <button onClick={v.next} style={{ width: "48px", height: "48px", borderRadius: "50%", border: "1px solid #BDB6AA", background: "none", cursor: "pointer", fontSize: "16px" }}>
                  {"›"}
                </button>
              </div>
            </div>
          </div>
          <div ref={v.cardRef} style={{ position: "relative", marginTop: `${v.cardTop ?? ''}`, height: `${v.cardH ?? ''}`, borderRadius: "28px", overflow: "hidden", background: `${v.bg ?? ''}`, transition: "background .6s" }}>
            {" "}
            <div style={{ position: "absolute", inset: "0", opacity: `${v.op0 ?? ''}`, transform: `${v.tf0 ?? ''}`, filter: `${v.fl0 ?? ''}`, transition: `${v.tr0 ?? ''}` }}>
              {" "}
              <img loading="lazy" decoding="async" src={opt("/images/rialto-understand-v2.jpg")} alt={v.t("Home.rialtoWithANotebook")} style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", display: "block", animation: "rdKen 14s ease-in-out infinite alternate" }} />
              {" "}
              <div className="hc-chip" style={{ position: "absolute", left: "30%", top: "30%", display: "flex", alignItems: "center", pointerEvents: "none", animation: "rdFloat 5s ease-in-out infinite" }}>
                <div className="hc-chip-box" style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(244,241,236,.92)", backdropFilter: "blur(10px)", borderRadius: "14px", padding: "8px 18px 8px 8px", whiteSpace: "nowrap" }}>
                  <span style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#0A0A0A", color: "#FF6A00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                    {"◷"}
                  </span>
                  <b style={{ fontSize: "19px" }}>
                    {"≈14 h"}
                  </b>
                  <span style={{ fontSize: "16px", color: "#5A5650" }}>
                    {v.t("Home.weekFoundRepeatable")}
                  </span>
                </div>
                <span style={{ width: "70px", height: "1px", background: "#F4F4F2" }} />
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#F4F4F2", boxShadow: "0 0 0 4px rgba(244,241,236,.35)" }} />
              </div>
              {" "}
              <div className="hc-chip" style={{ position: "absolute", left: "18%", top: "58%", display: "flex", alignItems: "center", pointerEvents: "none", animation: "rdFloat 6s ease-in-out 1.2s infinite" }}>
                <div className="hc-chip-box" style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(244,241,236,.92)", backdropFilter: "blur(10px)", borderRadius: "14px", padding: "8px 18px 8px 8px", whiteSpace: "nowrap" }}>
                  <span style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#0A0A0A", color: "#FF6A00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                    {"✎"}
                  </span>
                  <b style={{ fontSize: "19px" }}>
                    {v.t("Home.n15Min")}
                  </b>
                  <span style={{ fontSize: "16px", color: "#5A5650" }}>
                    {v.t("Home.firstCallFree")}
                  </span>
                </div>
                <span style={{ width: "50px", height: "1px", background: "#F4F4F2" }} />
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#F4F4F2", boxShadow: "0 0 0 4px rgba(244,241,236,.35)" }} />
              </div>
              {" "}
            </div>
            {" "}
            <div style={{ position: "absolute", inset: "0", opacity: `${v.op1 ?? ''}`, transform: `${v.tf1 ?? ''}`, filter: `${v.fl1 ?? ''}`, transition: `${v.tr1 ?? ''}`, background: "radial-gradient(ellipse at 55% 60%,#17140F,#0B0B0C 70%)" }}>
              {" "}
              <div style={{ position: "absolute", left: "12%", right: "4%", top: "22px", border: "1px solid #1F1F21", borderRadius: "16px", background: "rgba(15,15,16,.8)", fontFamily: "var(--font-mono)", fontSize: "clamp(12px,1.05vw,16px)", color: "#F4F4F2", overflow: "hidden" }}>
                {" "}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 18px", color: "#6B675F", fontSize: "12px" }}>
                  <span>
                    {"● ● ● rialto@rideff · ~/your-business"}
                  </span>
                  <span style={{ color: "#FF9A50" }}>
                    {"● LIVE"}
                  </span>
                </div>
                {" "}
                <div style={{ padding: "4px 18px 18px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span>
                    <span style={{ color: "#6B675F" }}>
                      {"$"}
                    </span>
                    {" deploy --agents --plan growth"}
                  </span>
                  <span>
                    <span style={{ color: "#FF6A00" }}>
                      {"✓"}
                    </span>
                    {" "}{v.t("Home.chiefAgentOnline")}
                  </span>
                  <span>
                    <span style={{ color: "#FF6A00" }}>
                      {"✓"}
                    </span>
                    {" "}{v.t("Home.n6AreasMappedApprovalsOn")}
                  </span>
                  <span>
                    <span style={{ color: "#FF6A00" }}>
                      {"✓"}
                    </span>
                    {" "}{v.t("Home.n18AgentsToolsConnected")}
                  </span>
                </div>
                {" "}
              </div>
              {" "}
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", left: "10%", right: "3%", top: "38%", bottom: "16%", width: "87%", height: "46%", overflow: "visible" }}>
                {" "}
                {(v.treeLines ?? []).map((l, $index) => (<Fragment key={$index}>
                  <line x1={l?.x1} y1={l?.y1} x2={l?.x2} y2={l?.y2} stroke={l?.c} strokeWidth="1.2" strokeOpacity=".45" vectorEffect="non-scaling-stroke" />
                </Fragment>))}
                {" "}
                {(v.treeLines ?? []).map((l, $index) => (<Fragment key={$index}>
                  <line x1={l?.x1} y1={l?.y1} x2={l?.x2} y2={l?.y2} stroke={l?.c} strokeWidth="3" strokeLinecap="round" pathLength="100" strokeDasharray="10 100" vectorEffect="non-scaling-stroke" style={{ filter: `drop-shadow(0 0 4px ${l?.c ?? ''})`, animation: `rdNerve ${l?.dur ?? ''} linear ${l?.dl ?? ''} infinite` }} />
                </Fragment>))}
                {" "}
              </svg>
              {" "}
              <div style={{ position: "absolute", left: "10%", right: "3%", top: "38%", height: "46%" }}>
                {" "}
                <span style={{ position: "absolute", left: "50%", top: "0", transform: "translate(-50%,-50%)", animation: "rdGlow 2.4s ease-in-out infinite", width: "58px", height: "58px", borderRadius: "50%", border: "2px solid #FF6A00", background: "#2A1A0E", color: "#FF6A00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", boxShadow: "0 0 30px rgba(255,106,0,.5)" }}>
                  {"✳"}
                </span>
                {" "}
                {(v.hubs ?? []).map((u, $index) => (<Fragment key={$index}>
                  <span style={{ position: "absolute", left: `${u?.x ?? ''}`, top: "50%", transform: "translate(-50%,-50%)", animation: `rdGlow 2.4s ease-in-out ${u?.dl ?? ''} infinite`, width: "34px", height: "34px", borderRadius: "50%", border: `2px solid ${u?.c ?? ''}`, background: "#0B0B0C", color: `${u?.c ?? ''}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", boxShadow: `0 0 18px ${u?.c ?? ''}` }}>
                    {"✳"}
                  </span>
                </Fragment>))}
                {" "}
                {(v.agents ?? []).map((g, $index) => (<Fragment key={$index}>
                  <span style={{ position: "absolute", left: `${g?.x ?? ''}`, top: "100%", transform: "translate(-50%,-50%)", width: "14px", height: "14px", borderRadius: "50%", border: `2px solid ${g?.c ?? ''}`, background: "#0B0B0C" }} />
                </Fragment>))}
                {" "}
              </div>
              {" "}
              <div style={{ position: "absolute", left: "22%", top: "63%", display: "flex", alignItems: "center", pointerEvents: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(244,241,236,.94)", color: "#0A0A0A", borderRadius: "14px", padding: "8px 18px 8px 8px", whiteSpace: "nowrap" }}>
                  <span style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#0A0A0A", color: "#FF6A00", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {"✳"}
                  </span>
                  <b style={{ fontSize: "19px" }}>
                    {"6"}
                  </b>
                  <span style={{ fontSize: "16px", color: "#5A5650" }}>
                    {v.t("Home.areasOneBrain")}
                  </span>
                </div>
              </div>
              {" "}
            </div>
            {" "}
            <div style={{ position: "absolute", inset: "0", opacity: `${v.op2 ?? ''}`, transform: `${v.tf2 ?? ''}`, filter: `${v.fl2 ?? ''}`, transition: `${v.tr2 ?? ''}` }}>
              {" "}
              <img loading="lazy" decoding="async" src={opt("/images/rialto-run-v2.jpg")} alt={v.t("Home.rialtoAtHisDesk")} style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", display: "block", animation: "rdKen 12s ease-in-out infinite alternate" }} />
              {" "}
              <div style={{ position: "absolute", left: "12%", top: "20%", width: "min(340px,50%)", display: "flex", flexDirection: "column", gap: "8px", pointerEvents: "none" }}>
                {(v.runFeed ?? []).map((f, $index) => (<Fragment key={$index}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(11,11,12,.86)", backdropFilter: "blur(10px)", color: "#F4F4F2", borderRadius: "14px", padding: "12px 16px", fontSize: "14px", animation: `rdFeed 5s cubic-bezier(.16,1,.3,1) ${f?.dl ?? ''} infinite both` }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF9A50" }}>
                      {f?.t}
                    </span>
                    <span style={{ flex: "1" }}>
                      {f?.d}
                    </span>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#61CC80", animation: `rdPulse 1.6s ease-in-out ${f?.dl ?? ''} infinite` }} />
                  </div>
                </Fragment>))}
              </div>
              {" "}
              <div style={{ position: "absolute", left: "12%", top: "56%", display: "flex", alignItems: "center", gap: "12px", background: "rgba(244,241,236,.92)", borderRadius: "14px", padding: "8px 18px 8px 8px", pointerEvents: "none", whiteSpace: "nowrap", animation: "rdFloat 5.5s ease-in-out infinite" }}>
                <span style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#0A0A0A", color: "#FF6A00", display: "flex", alignItems: "center", justifyContent: "center", animation: "rdRing 1.8s ease-out infinite" }}>
                  {"♥"}
                </span>
                <b style={{ fontSize: "19px" }}>
                  {v.t("Home.mon")}
                </b>
                <span style={{ fontSize: "16px", color: "#5A5650" }}>
                  {v.t("Home.reportEveryWeek")}
                </span>
              </div>
              {" "}
            </div>
            {" "}
            {v.heroMode ? (<>
              <div style={{ position: "absolute", top: "0", right: "0", zIndex: "3", background: "#ECE8E1", borderBottomLeftRadius: "28px", padding: "0 0 14px 14px", display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ position: "absolute", top: "0", right: "100%", width: "28px", height: "28px", background: "radial-gradient(circle at 0 100%,transparent 27.5px,#ECE8E1 28px)" }} />
                <span style={{ position: "absolute", top: "100%", right: "0", width: "28px", height: "28px", background: "radial-gradient(circle at 0 100%,transparent 27.5px,#ECE8E1 28px)" }} />
                <a href="https://wa.me/4917632572420" target="_blank" rel="noopener" aria-label="WhatsApp" title="WhatsApp" style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#25D366", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <WhatsAppIcon width={28} height={28} />
                </a>
                <a href={v.href("/contact")} style={{ background: "#0A0A0A", color: "#F4F4F2", borderRadius: "999px", height: "56px", padding: "0 26px", display: "flex", alignItems: "center", fontSize: "13px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", whiteSpace: "nowrap" }} className="hv-9bccb67">
                  {v.t("Home.startAProject")}
                </a>
              </div>
            </>) : null}
            {" "}{v.fx}{" "}
            <div style={{ position: "absolute", left: "20px", top: "22px", zIndex: "3", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
              <span key={v.num} className="hc-pill" style={{ animation: "rdTag .7s cubic-bezier(.16,1,.3,1) .45s both", writingMode: "vertical-rl", transform: "rotate(180deg)", background: "#F4F1EC", color: "#0A0A0A", borderRadius: "999px", padding: "20px 12px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".14em", textTransform: "uppercase" }}>
                {v.t("Home.pillarXX", { x: v.num, y: v.door })}
              </span>
              <a href={v.pHref} style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#0A0A0A", color: "#F4F4F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                {"↗"}
              </a>
            </div>
            {" "}
            <div style={{ position: "absolute", left: "0", bottom: "0", zIndex: "3", background: "#ECE8E1", borderTopRightRadius: "28px", padding: "14px 14px 0 0", display: "flex", gap: "10px" }}>
              <span style={{ position: "absolute", left: "0", bottom: "100%", width: "28px", height: "28px", background: "radial-gradient(circle at 100% 0,transparent 27.5px,#ECE8E1 28px)" }} />
              <span style={{ position: "absolute", left: "100%", bottom: "0", width: "28px", height: "28px", background: "radial-gradient(circle at 100% 0,transparent 27.5px,#ECE8E1 28px)" }} />
              {(v.tabs ?? []).map((t, $index) => (<Fragment key={$index}>
                {" "}
                <button onClick={t?.go} style={{ position: "relative", width: `${v.tabW ?? ''}`, aspectRatio: "1.05", borderRadius: "16px", overflow: "hidden", border: `2px solid ${t?.bd ?? ''}`, background: `${t?.thumb ?? ''}`, cursor: "pointer", padding: "0" }}>
                  {" "}
                  <div style={{ position: "absolute", left: "0", top: "0", height: "3px", width: `${t?.w ?? ''}`, background: "#FF6A00", transition: `width ${t?.dur ?? ''} linear` }} />
                  {" "}
                  <img loading="lazy" decoding="async" src={t?.img} alt="" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: `${t?.op ?? ''}`, transition: "opacity .4s,transform .6s", transform: `${t?.zoom ?? ''}` }} />
                  <span style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg,rgba(10,10,10,0) 40%,rgba(10,10,10,.55))" }} />
                  <span style={{ position: "absolute", left: "8px", top: "10px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "#F4F4F2" }}>
                    {t?.n}
                  </span>
                  {" "}
                  <span style={{ position: "absolute", left: "6px", right: "6px", bottom: "6px", background: "rgba(244,241,236,.94)", color: "#0A0A0A", borderRadius: "999px", padding: "7px 0", font: `500 ${v.tabFont ?? ''} var(--font-sans)`, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {t?.door}
                  </span>
                  {" "}
                </button>
                {" "}
              </Fragment>))}
            </div>
            {" "}
            <div style={{ position: "absolute", right: "20px", bottom: `${v.chipBottom ?? ''}`, zIndex: "2", transition: "bottom .3s" }}>
              {" "}
              <div ref={v.chipsRef} style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "8px" }}>
                {(v.chips ?? []).map((c, $index) => (<Fragment key={$index}>
                  <span style={{ border: `1px solid ${v.chipBd ?? ''}`, color: `${v.chipFg ?? ''}`, background: `${v.chipBg ?? ''}`, backdropFilter: "blur(8px)", borderRadius: "999px", padding: "11px 18px", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase" }}>
                    {c}
                  </span>
                </Fragment>))}
              </div>
              {" "}
            </div>
            {" "}
          </div>
        </div>
        {" "}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", borderTop: "1px solid #D3CCC0", borderBottom: "1px solid #D3CCC0" }}>
          <div className="hp-stat" style={{ padding: "22px clamp(20px,3vw,40px)", display: "flex", alignItems: "baseline", gap: "8px" }}>
            <b style={{ fontSize: "26px", letterSpacing: "-0.03em" }}>
              {"1"}
            </b>
            <span style={{ fontSize: "14px", color: "#5A5650" }}>
              {v.t("Home.personFirstCallToLive")}
            </span>
          </div>
          <div className="hp-stat" style={{ padding: "22px clamp(20px,3vw,40px)", display: "flex", alignItems: "baseline", gap: "8px", borderLeft: "1px solid #D3CCC0" }}>
            <b style={{ fontSize: "26px", letterSpacing: "-0.03em" }}>
              {"5"}
            </b>
            <span style={{ fontSize: "14px", color: "#5A5650" }}>
              {v.t("Home.phasesToGoLive")}
            </span>
          </div>
          <div className="hp-stat" style={{ padding: "22px clamp(20px,3vw,40px)", display: "flex", alignItems: "baseline", gap: "8px", borderLeft: "1px solid #D3CCC0" }}>
            <b style={{ fontSize: "26px", letterSpacing: "-0.03em" }}>
              {"EU"}
            </b>
            <span style={{ fontSize: "14px", color: "#5A5650" }}>
              {v.t("Home.hostedInFrankfurt")}
            </span>
          </div>
          <div className="hp-stat" style={{ padding: "22px clamp(20px,3vw,40px)", display: "flex", alignItems: "baseline", gap: "8px", borderLeft: "1px solid #D3CCC0" }}>
            <b style={{ fontSize: "26px", letterSpacing: "-0.03em" }}>
              {"1"}
            </b>
            <span style={{ fontSize: "14px", color: "#5A5650" }}>
              {v.t("Home.fixedMonthlyPrice")}
            </span>
          </div>
        </div>
        {" "}
        <div style={{ overflow: "hidden", padding: "18px 0", background: "#0A0A0A", color: "#F4F4F2" }}>
          {" "}
          <div style={{ display: "flex", gap: "48px", width: "max-content", animation: "rdTicker 40s linear infinite", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".12em", textTransform: "uppercase" }}>
            {(v.ticker ?? []).map((k, $index) => (<Fragment key={$index}>
              <span style={{ display: "flex", gap: "48px", alignItems: "center", whiteSpace: "nowrap" }}>
                {k}
                <span style={{ color: "#FF6A00" }}>
                  {"●"}
                </span>
              </span>
            </Fragment>))}
          </div>
          {" "}
        </div>
      </div>
      <PlatformSection t={v.t} />
      <div id="thesis" data-screen-label="02 Thesis" style={{ padding: "clamp(72px,16vw,120px) clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "clamp(40px,8.5vw,64px)", alignItems: "start" }}>
        <div data-rv="0" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
            {v.t("Home.n01Thesis")}
          </div>
          <div onMouseMove={v.tiltMove} onMouseLeave={v.tiltLeave} style={{ position: "relative", aspectRatio: "4/5", maxWidth: "520px", borderRadius: "22px", overflow: "hidden", transition: "transform .25s ease-out", willChange: "transform", boxShadow: "0 40px 80px -40px rgba(10,10,10,.45)" }}>
            <img loading="lazy" decoding="async" src={opt("/images/rialto-about-v3.jpg")} alt={v.t("Home.rialtoFounderOfRIDEFF")} style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <span data-glare="1" style={{ position: "absolute", inset: "0", borderRadius: "22px", pointerEvents: "none", opacity: "0", transition: "opacity .3s", zIndex: "2", mixBlendMode: "soft-light" }} />
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#5A5650" }}>
            {v.t("Home.rialtoFounderOperatorRIDEFF")}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "48px", paddingTop: "40px" }}>
          <p data-words="1" style={{ margin: "0", fontSize: "clamp(22px,3.2vw,46px)", lineHeight: "1.12", letterSpacing: "-0.035em", fontWeight: "500", textWrap: "pretty" }}>
            {(v.thesisWords ?? []).map((w, $index) => (<Fragment key={$index}>
              <span data-wd={w?.m} style={{ transition: "color .35s" }}>
                {w?.t}
              </span>
            </Fragment>))}
          </p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="hp-fact" style={{ display: "grid", gridTemplateColumns: "140px minmax(0,1fr)", gap: "20px", padding: "18px 0", borderTop: "1px solid #D3CCC0" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#5A5650" }}>
                {v.t("Home.whyMe")}
              </span>
              <span style={{ fontSize: "16px" }}>
                {v.t("Home.iRanTradeMarketingAndAn")}
              </span>
            </div>
            <div className="hp-fact" style={{ display: "grid", gridTemplateColumns: "140px minmax(0,1fr)", gap: "20px", padding: "18px 0", borderTop: "1px solid #D3CCC0" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#5A5650" }}>
                {v.t("Home.based")}
              </span>
              <span style={{ fontSize: "16px" }}>
                {v.t("Home.eichstattGermanyClientsAcrossTheEU")}
              </span>
            </div>
            <div className="hp-fact" style={{ display: "grid", gridTemplateColumns: "140px minmax(0,1fr)", gap: "20px", padding: "18px 0", borderTop: "1px solid #D3CCC0", borderBottom: "1px solid #D3CCC0" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#5A5650" }}>
                {v.t("Home.how")}
              </span>
              <span style={{ fontSize: "16px" }}>
                {v.t("Home.builtPutLiveAndMaintainedBy")}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div id="doors" data-pin="doors" style={{ height: `${v.doorsH ?? ''}`, position: "relative" }}>
        <div style={{ position: `${v.dPinPos ?? ''}`, top: `${v.dPinTop ?? ''}`, height: `${v.pinH ?? ''}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div data-pinbox="doors" data-screen-label="03 Four doors" style={{ minHeight: `${v.dBoxMinH ?? ''}`, padding: `${v.doorsPad ?? ''}`, maxWidth: "1480px", margin: "0 auto", width: "100%", boxSizing: "border-box", transformOrigin: "50% 50%" }}>
            {" "}
            <div data-rv="0" className="hp-dhead" style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "24px", flexWrap: "wrap", marginBottom: "40px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
                  {v.t("Home.n02ThreePillars")}
                </div>
                <h2 style={{ margin: "0", fontSize: "clamp(31px,3.8vw,56px)", lineHeight: "1", letterSpacing: "-0.045em", fontWeight: "600", maxWidth: "820px", textWrap: "balance" }}>
                  {v.t("Home.threeDisciplines")}{" "}
                  <span>
                    {v.t("Home.onePerson2")}
                  </span>
                  {" "}{v.t("Home.theWholeWay")}
                </h2>
              </div>
              {v.notPin ? (<>
                <a href="#start" style={{ fontSize: "15px", borderBottom: "1px solid #0A0A0A", paddingBottom: "2px" }}>
                  {v.t("Home.notSureWhichAskMe")}
                </a>
              </>) : null}
            </div>
            {" "}
            <div style={{ display: "grid", gridTemplateColumns: `${v.tabCols ?? ''}`, gap: "0", borderTop: "1px solid #D3CCC0" }}>
              {(v.doorTabs ?? []).map((d, $index) => (<Fragment key={$index}>
                {" "}
                <div {...press(d?.go)} style={{ cursor: "pointer", padding: `${v.tabPad ?? ''} 4px`, display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `2px solid ${d?.line ?? ''}`, transition: "border-color .3s" }}>
                  <span style={{ fontSize: `${v.tabFs ?? ''}`, fontWeight: "600", letterSpacing: "-0.02em", opacity: `${d?.op ?? ''}` }}>
                    {d?.door}
                  </span>
                  {v.showTabNum ? (<span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#5A5650" }}>
                    {d?.n}
                  </span>) : null}
                </div>
                {" "}
              </Fragment>))}
            </div>
            {" "}
            <div style={{ height: "2px", background: "transparent", marginTop: "-2px", opacity: `${v.dbarOp ?? ''}` }}>
              <div data-dbar="1" style={{ height: "100%", background: "#FF6A00", transformOrigin: "0 50%", transform: "scaleX(0)", boxShadow: "0 0 10px #FF6A00" }} />
            </div>
            {" "}
            <div className="hp-dpanel" style={{ marginTop: `${v.panelMt ?? ''}`, borderRadius: "26px", background: `${v.dBg ?? ''}`, color: `${v.dFg ?? ''}`, padding: "clamp(28px,4vw,56px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "48px", transition: "background .5s,color .5s", perspective: "1400px", overflow: "hidden" }}>
              <div key={`${v.dNum ?? ''}a`} style={{ display: "flex", flexDirection: "column", gap: "24px", justifyContent: "space-between", animation: "rdFlipIn .9s cubic-bezier(.16,1,.3,1) both" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".65" }}>
                    {v.dNum}{" · "}{v.dLabel}
                  </div>
                  <h3 style={{ margin: "0", fontSize: "clamp(32px,3.6vw,52px)", lineHeight: "1.02", letterSpacing: "-0.04em", fontWeight: "600", textWrap: "balance" }}>
                    {v.dHead}
                  </h3>
                  <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.55", opacity: ".8", maxWidth: "460px", textWrap: "pretty" }}>
                    {v.dDesc}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {(v.dChips ?? []).map((c, $index) => (<Fragment key={$index}>
                    <span style={{ border: `1px solid ${v.dLine ?? ''}`, borderRadius: "999px", padding: "6px 12px", fontSize: "13px" }}>
                      {c}
                    </span>
                  </Fragment>))}
                </div>
                <div style={{ display: "flex" }}>
                  <a href={v.dHref} style={{ background: "#FF6A00", color: "#0A0A0A", borderRadius: "999px", padding: "13px 22px", fontWeight: "600", fontSize: "15px" }}>
                    {v.t("Home.enterX", { x: v.dDoor })}
                  </a>
                </div>
              </div>
              {v.showFlow ? (<div key={`${v.dNum ?? ''}b`} style={{ display: "flex", flexDirection: "column", gap: "16px", justifyContent: "center", perspective: "900px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", opacity: ".7" }}>
                  <span>
                    {v.t("Home.exampleFlow")}
                  </span>
                  <span style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FF6A00", animation: "rdPulse 2s infinite" }} />
                    {v.dStatus}
                  </span>
                </div>
                {(v.dFlow ?? []).map((f, $index) => (<Fragment key={$index}>
                  {" "}
                  <div style={{ display: "grid", gridTemplateColumns: "36px minmax(0,1fr)", gap: "14px", alignItems: "center", padding: "16px 18px", borderRadius: "14px", background: `${v.dCard ?? ''}`, transformOrigin: "50% 0", animation: `rdRise .75s cubic-bezier(.16,1,.3,1) ${f?.dl ?? ''} both` }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
                      {f?.n}
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontSize: "16px", fontWeight: "500" }}>
                        {f?.t}
                      </span>
                      <span style={{ fontSize: "13px", opacity: ".65" }}>
                        {f?.d}
                      </span>
                    </div>
                  </div>
                  {" "}
                </Fragment>))}
              </div>) : null}
            </div>
          </div>
        </div>
      </div>
      <div id="proof" data-screen-label="04 Proof" style={{ padding: "120px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "56px" }}>
        <div data-rv="0" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
            {v.t("Home.n04Proof")}
          </div>
          <h2 style={{ margin: "0", fontSize: "clamp(31px,3.8vw,56px)", lineHeight: "1", letterSpacing: "-0.045em", fontWeight: "600", textWrap: "balance" }}>
            {v.t("Home.donTTakeMyWordFor")}{" "}
            <span>
              {v.t("Home.clickAround")}
            </span>
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #D3CCC0" }}>
          {(v.demos ?? []).map((d, $index) => (<Fragment key={$index}>
            {" "}
            <a href={d?.href} style={{ display: "grid", gridTemplateColumns: "60px minmax(0,1fr) minmax(0,1.2fr) auto", gap: "24px", alignItems: "center", padding: "28px 0", borderBottom: "1px solid #D3CCC0", transition: "padding .45s cubic-bezier(.16,1,.3,1),color .3s" }} className="hp-demo hv-b83c21d">
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#5A5650" }}>
                {d?.n}
              </span>
              <span style={{ fontSize: "clamp(22px,2.4vw,32px)", fontWeight: "600", letterSpacing: "-0.03em" }}>
                {d?.t}
              </span>
              <span style={{ fontSize: "15px", color: "#3A3731", lineHeight: "1.5" }}>
                {d?.d}
              </span>
              <span style={{ fontSize: "22px" }}>
                {"↗"}
              </span>
            </a>
            {" "}
          </Fragment>))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingTop: "24px" }}>
          <div data-rv="0" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "48px", alignItems: "center", background: "#0B0B0C", color: "#F4F4F2", borderRadius: "28px", padding: "clamp(28px,4vw,56px)", overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", right: "-10%", top: "-30%", width: "60%", aspectRatio: "1", borderRadius: "50%", background: "radial-gradient(circle,rgba(255,106,0,.22),transparent 65%)", pointerEvents: "none" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "22px", position: "relative", zIndex: "1" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#FF9A50" }}>
                {v.t("Home.flagshipCaseTICOriginals")}
              </div>
              <h3 style={{ margin: "0", fontSize: "clamp(30px,3.4vw,50px)", letterSpacing: "-0.04em", lineHeight: "1.02", fontWeight: "600", textWrap: "balance" }}>
                {v.t("Home.aStreetwearLabelThatRunsBetween")}{" "}
                <span style={{ color: "#FF9A50" }}>
                  {v.t("Home.withoutTheBusywork")}
                </span>
              </h3>
              <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.55", color: "#B8B3AA", maxWidth: "520px", textWrap: "pretty" }}>
                {v.t("Home.tillICollapseSellsLimitedDrops")}
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {(v.ticTags ?? []).map((t, $index) => (<Fragment key={$index}>
                  <span style={{ border: "1px solid #2A2A2C", borderRadius: "999px", padding: "7px 13px", fontSize: "13px", color: "#D8D3CA" }}>
                    {t}
                  </span>
                </Fragment>))}
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", paddingTop: "6px" }}>
                <button onClick={v.openCase} style={{ background: "#FF6A00", color: "#0A0A0A", border: "none", borderRadius: "999px", padding: "15px 24px", font: "600 15px var(--font-sans)", cursor: "pointer" }} className="hv-c235bc3">
                  {v.t("Home.openTheCase")}
                </button>
                <a href={v.href("/work")} style={{ fontSize: "15px", borderBottom: "1px solid #F4F4F2", paddingBottom: "2px", color: "#F4F4F2" }}>
                  {v.t("Home.seeAllWork")}
                </a>
              </div>
            </div>
            <div onMouseMove={v.tiltMove} onMouseLeave={v.tiltLeave} onClick={v.openCase} style={{ position: "relative", aspectRatio: "5/4", cursor: "pointer", transition: "transform .3s ease-out", transformStyle: "preserve-3d" }}>
              {" "}
              <div style={{ position: "absolute", left: "0", top: "4%", width: "78%", borderRadius: "14px", overflow: "hidden", background: "#141416", border: "1px solid #2A2A2C", boxShadow: "0 40px 80px -30px rgba(0,0,0,.8)", transform: "rotate(-3deg)" }}>
                {" "}
                <div style={{ display: "flex", gap: "5px", padding: "9px 12px", background: "#1C1C1E" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3A3A3C" }} />
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3A3A3C" }} />
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3A3A3C" }} />
                  <span style={{ marginLeft: "10px", fontFamily: "var(--font-mono)", fontSize: "10px", color: "#6B675F" }}>
                    {"tilicollapse.com"}
                  </span>
                </div>
                {" "}
                <img loading="lazy" decoding="async" src={opt("/images/tic-shop.png")} alt={v.t("Home.tICOriginalsOnlineShop")} style={{ width: "100%", display: "block", aspectRatio: "16/11", objectFit: "cover", objectPosition: "top" }} />
                {" "}
              </div>
              {" "}
              <div style={{ position: "absolute", right: "0", bottom: "0", width: "62%", borderRadius: "14px", overflow: "hidden", border: "1px solid #2A2A2C", boxShadow: "0 40px 90px -20px rgba(0,0,0,.9),0 0 0 1px rgba(255,106,0,.2)", transform: "rotate(2deg)" }}>
                {" "}
                <img loading="lazy" decoding="async" src={opt("/images/tic-backoffice.png")} alt={v.t("Home.tICBackOfficeTodayList")} style={{ width: "100%", display: "block", aspectRatio: "4/3", objectFit: "cover", objectPosition: "top left" }} />
                {" "}
              </div>
              {" "}
              <div style={{ position: "absolute", left: "-4%", top: "58%", width: "30%", aspectRatio: "1", borderRadius: "14px", overflow: "hidden", background: "#F4F4F2", boxShadow: "0 24px 50px -16px rgba(0,0,0,.7)", animation: "rdBob 6s ease-in-out 0s infinite" }}>
                <img loading="lazy" decoding="async" src={opt("/images/hf/tic1.jpg", 1080)} alt={v.t("Home.tICProduct")} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ position: "absolute", left: "30%", top: "-6%", width: "22%", aspectRatio: "1", borderRadius: "14px", overflow: "hidden", background: "#F4F4F2", boxShadow: "0 24px 50px -16px rgba(0,0,0,.7)", animation: "rdBob 7s ease-in-out .8s infinite" }}>
                <img loading="lazy" decoding="async" src={opt("/images/hf/tic2.jpg", 1080)} alt={v.t("Home.tICProduct")} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ position: "absolute", left: "84%", top: "-2%", width: "20%", aspectRatio: "1", borderRadius: "14px", overflow: "hidden", background: "#F4F4F2", boxShadow: "0 24px 50px -16px rgba(0,0,0,.7)", animation: "rdBob 6.5s ease-in-out 1.6s infinite" }}>
                <img loading="lazy" decoding="async" src={opt("/images/hf/tic3.jpg", 1080)} alt={v.t("Home.tICProduct")} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              {" "}
            </div>
          </div>
        </div>
      </div>
      <div id="pricing" data-screen-label="05 Pricing" style={{ background: "#E3DED5" }}>
        {" "}
        <div style={{ padding: "120px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "56px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "40px", alignItems: "end" }}>
            <div data-rv="0" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
                {v.t("Home.n05WaysToWorkTogether")}
              </div>
              <h2 style={{ margin: "0", fontSize: "clamp(31px,3.8vw,56px)", lineHeight: "1", letterSpacing: "-0.045em", fontWeight: "600", textWrap: "balance" }}>
                {v.t("Home.threePlans")}{" "}
                <span>
                  {v.t("Home.onePerson2")}
                </span>
                {" "}{v.t("Home.theWholeWay")}
              </h2>
            </div>
            <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.55", color: "#3A3731", maxWidth: "460px" }}>
              {v.t("Home.includedInEveryPlanEUHosting")}
            </p>
          </div>
          <PriceAnchor t={v.t} rows={v.costRows} />
          <div data-rv="120" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: "14px" }}>
            {(v.plans ?? []).map((p, $index) => (<Fragment key={$index}>
              {" "}
              <div onMouseMove={v.tiltMove} onMouseLeave={v.tiltLeave} style={{ position: "relative", borderRadius: "22px", padding: "32px", display: "flex", flexDirection: "column", gap: "28px", background: `${p?.bg ?? ''}`, color: `${p?.fg ?? ''}`, transition: "transform .25s ease-out,box-shadow .3s", willChange: "transform" }} className="hv-65e47e9">
                <span data-glare="1" style={{ position: "absolute", inset: "0", borderRadius: "22px", pointerEvents: "none", opacity: "0", transition: "opacity .3s", zIndex: "2", mixBlendMode: "soft-light" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
                    {p?.n}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".7" }}>
                    {p?.tag}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={{ fontSize: "28px", fontWeight: "600", letterSpacing: "-0.03em" }}>
                    {p?.name}
                  </span>
                  <span style={{ fontSize: "15px", lineHeight: "1.5", opacity: ".75" }}>
                    {p?.for}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                  <span style={{ fontSize: "52px", fontWeight: "600", letterSpacing: "-0.05em" }}>
                    {p?.price}
                  </span>
                  <span style={{ fontSize: "14px", opacity: ".7" }}>
                    {v.t("Home.monthSetupFromX", { x: p?.setup })}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: `1px solid ${p?.line ?? ''}`, paddingTop: "20px" }}>
                  {(p?.items ?? []).map((i, $index) => (<Fragment key={$index}>
                    <span style={{ fontSize: "15px", display: "flex", gap: "10px" }}>
                      <span style={{ color: "#FF6A00" }}>
                        {"+"}
                      </span>
                      {i}
                    </span>
                  </Fragment>))}
                </div>
                <a href="#start" style={{ marginTop: "auto", textAlign: "center", borderRadius: "999px", padding: "14px 20px", fontWeight: "600", fontSize: "15px", background: `${p?.btnBg ?? ''}`, color: `${p?.btnFg ?? ''}` }}>
                  {v.t("Home.askAboutX", { x: p?.name })}
                </a>
              </div>
              {" "}
            </Fragment>))}
          </div>
        </div>
      </div>
      <div data-pin="how" style={{ height: `${v.howH ?? ''}`, position: "relative" }}>
        <div style={{ position: `${v.pinPos ?? ''}`, top: "0", height: `${v.pinH ?? ''}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div data-pinbox="how" data-screen-label="06 How it works" style={{ padding: `${v.howPad ?? ''}`, maxWidth: "1480px", margin: "0 auto", width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "56px", transformOrigin: "50% 50%" }}>
            <div data-rv="0" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
                {v.t("Home.n06HowItWorks")}
              </div>
              <h2 style={{ margin: "0", fontSize: "clamp(31px,3.8vw,56px)", lineHeight: "1", letterSpacing: "-0.045em", fontWeight: "600", textWrap: "balance" }}>
                {v.t("Home.fromFirstCallToASystem")}{" "}
                <span>
                  {v.t("Home.runs")}
                </span>
              </h2>
            </div>
            <div data-how="1" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ height: "2px", background: "#D3CCC0", borderRadius: "2px", overflow: "hidden" }}>
                <div data-howline="1" style={{ height: "100%", width: "0%", background: "#FF6A00", boxShadow: "0 0 14px #FF6A00" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "32px" }}>
                {(v.phases ?? []).map((p, $index) => (<Fragment key={$index}>
                  {" "}
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", paddingTop: "22px", opacity: `${p?.op ?? ''}`, transform: `${p?.tf ?? ''}`, transition: "opacity .5s,transform .7s cubic-bezier(.16,1,.3,1)" }}>
                    <span style={{ width: "42px", height: "42px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: "12px", background: `${p?.nb ?? ''}`, color: `${p?.nc ?? ''}`, boxShadow: `${p?.ns ?? ''}`, transition: "all .45s" }}>
                      {p?.n}
                    </span>
                    <span style={{ fontSize: "24px", fontWeight: "600", letterSpacing: "-0.03em" }}>
                      {p?.t}
                    </span>
                    <span style={{ fontSize: "15px", lineHeight: "1.5", color: "#3A3731" }}>
                      {p?.d}
                    </span>
                  </div>
                  {" "}
                </Fragment>))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div data-screen-label="07 FAQ" style={{ padding: "40px clamp(20px,3vw,40px) 120px", maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "56px", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div data-rv="0" style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
            {v.t("Home.n07Questions")}
          </div>
          <h2 style={{ margin: "0", fontSize: "clamp(31px,3.8vw,56px)", lineHeight: "1", letterSpacing: "-0.045em", fontWeight: "600" }}>
            {v.t("Home.beforeYou")}{" "}
            <span>
              {v.t("Home.message")}
            </span>
          </h2>
          <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.55", color: "#3A3731", maxWidth: "380px" }}>
            {v.t("Home.stillUnsureWhatsAppIsTheFastest")}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #D3CCC0" }}>
          {(v.faqs ?? []).map((f, $index) => (<Fragment key={$index}>
            {" "}
            <div style={{ borderBottom: "1px solid #D3CCC0" }}>
              {" "}
              <button onClick={f?.toggle} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", padding: "22px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", font: "500 19px var(--font-sans)", color: "#0A0A0A", letterSpacing: "-0.01em" }}>
                {f?.q}
                <span style={{ fontSize: "22px", color: "#FF6A00" }}>
                  {f?.sign}
                </span>
              </button>
              {" "}
              {f?.open ? (<>
                <p style={{ margin: "0 0 22px", fontSize: "16px", lineHeight: "1.6", color: "#3A3731", maxWidth: "620px" }}>
                  {f?.a}
                </p>
              </>) : null}
              {" "}
            </div>
            {" "}
          </Fragment>))}
        </div>
      </div>
      <div style={{ maxWidth: "1480px", margin: "0 auto", padding: "0 clamp(20px,3vw,40px) 72px" }}>
        <div style={{ borderTop: "1px solid #D3CCC0", paddingTop: "22px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px 24px", flexWrap: "wrap", fontSize: "15px", color: "#5A5650" }}>
          <span>
            {v.t("Home.lifeLine")}
          </span>
          <a href={v.href("/life")} style={{ fontWeight: "500", color: "#0A0A0A", borderBottom: "1px solid #0A0A0A" }}>
            {v.t("Home.enterRIDEFFLife")}
          </a>
        </div>
      </div>
      <div id="start" data-screen-label="08 Start" style={{ background: "#0B0B0C", color: "#F4F4F2" }}>
        <ClosingScene />
        {" "}
        <div style={{ padding: "120px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "64px" }}>
          <div data-rv="0" style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
              {v.t("Home.n08StartAProject")}
            </div>
            <h2 style={{ margin: "0", fontSize: "clamp(34px,4.4vw,69px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", textWrap: "balance" }}>
              {v.t("Home.bringTheBusyworkILlMake")}{" "}
              <span style={{ color: "#FF6A00" }}>
                {v.t("Home.runItself")}
              </span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #2A2A2C" }}>
              <a href={v.href("@cal")} target="_blank" rel="noopener" style={{ display: "flex", justifyContent: "space-between", gap: "20px", padding: "22px 0", borderBottom: "1px solid #2A2A2C" }} className="hv-eace579">
                <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <b style={{ fontSize: "20px", fontWeight: "600" }}>
                    {v.t("Home.book15Minutes")}
                  </b>
                  <span style={{ fontSize: "14px", color: "#8C877E" }}>
                    {v.t("Home.freeFirstCallCalComLink")}
                  </span>
                </span>
                <span style={{ fontSize: "22px" }}>
                  {"↗"}
                </span>
              </a>
              <a href="https://wa.me/4917632572420?text=Hi%20Rialto%2C%20I%20found%20rideff.com%20and%20I%27d%20like%20to%20talk%20about%20a%20project." style={{ display: "flex", justifyContent: "space-between", gap: "20px", padding: "22px 0", borderBottom: "1px solid #2A2A2C" }} className="hv-eace579">
                <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <b style={{ fontSize: "20px", fontWeight: "600" }}>
                    {"WhatsApp +49 176 32572420"}
                  </b>
                  <span style={{ fontSize: "14px", color: "#8C877E" }}>
                    {v.t("Home.rialtoDirectLine")}
                  </span>
                </span>
                <span style={{ fontSize: "22px" }}>
                  {"↗"}
                </span>
              </a>
              <a href="mailto:hallo@rideff.com" style={{ display: "flex", justifyContent: "space-between", gap: "20px", padding: "22px 0", borderBottom: "1px solid #2A2A2C" }} className="hv-eace579">
                <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <b style={{ fontSize: "20px", fontWeight: "600" }}>
                    {"hallo@rideff.com"}
                  </b>
                  <span style={{ fontSize: "14px", color: "#8C877E" }}>
                    {v.t("Home.forLongerBriefs")}
                  </span>
                </span>
                <span style={{ fontSize: "22px" }}>
                  {"↗"}
                </span>
              </a>
            </div>
            <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#8C877E" }}>
              <span>
                {v.t("Home.eichstattX", { x: v.clock })}
              </span>
              <span>
                {v.t("Home.remoteEU")}
              </span>
              <span>
                {v.t("Home.germanEnglish")}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", background: "#161618", borderRadius: "24px", padding: "clamp(24px,3vw,40px)" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", overflow: "hidden", flexShrink: "0" }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "repeating-linear-gradient(135deg,#2A2A2C 0 5px,#222224 5px 10px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: "13px", color: "#8C877E" }}>
                  {"R"}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <b style={{ fontSize: "17px" }}>
                  {v.t("Home.freeCall15Min11")}
                </b>
                <span style={{ fontSize: "14px", color: "#8C877E" }}>
                  {v.t("Home.threeQuickQuestionsILlReply")}
                </span>
              </div>
            </div>
            <input value={v.fName ?? ''} onChange={v.setName} aria-label={v.t("Home.yourName")} autoComplete="name" placeholder={v.t("Home.yourName")} style={{ background: "#0B0B0C", border: "1px solid #2A2A2C", borderRadius: "12px", padding: "15px 16px", color: "#F4F4F2", fontSize: "15px", outline: "none" }} />
            <input value={v.fContact ?? ''} onChange={v.setContact} aria-label={v.t("Home.whatsAppNumberOrEmail")} placeholder={v.t("Home.whatsAppNumberOrEmail")} style={{ background: "#0B0B0C", border: "1px solid #2A2A2C", borderRadius: "12px", padding: "15px 16px", color: "#F4F4F2", fontSize: "15px", outline: "none" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontSize: "14px", color: "#B8B3AA" }}>
                {v.t("Home.whatDoYouNeed")}
              </span>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {(v.needs ?? []).map((n, $index) => (<Fragment key={$index}>
                  <button onClick={n?.go} style={{ cursor: "pointer", borderRadius: "999px", padding: "9px 15px", font: "500 14px var(--font-sans)", border: `1px solid ${n?.bd ?? ''}`, background: `${n?.bg ?? ''}`, color: `${n?.fg ?? ''}` }}>
                    {n?.t}
                  </button>
                </Fragment>))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontSize: "14px", color: "#B8B3AA" }}>
                {v.t("Home.pickATimeForTheCall")}{" "}
                <span style={{ color: "#6B675F" }}>
                  {v.t("Home.centralEuropeanTime")}
                </span>
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,minmax(0,1fr))", gap: "6px" }}>
                {(v.slotDays ?? []).map((d, $index) => (<Fragment key={$index}>
                  <button onClick={d?.go} style={{ cursor: "pointer", borderRadius: "12px", padding: "10px 4px", border: `1px solid ${d?.bd ?? ''}`, background: `${d?.bg ?? ''}`, color: `${d?.fg ?? ''}`, display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", fontFamily: "var(--font-sans)" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase", opacity: ".75" }}>
                      {d?.wd}
                    </span>
                    <span style={{ fontSize: "17px", fontWeight: "600" }}>
                      {d?.day}
                    </span>
                  </button>
                </Fragment>))}
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {(v.slotTimes ?? []).map((t, $index) => (<Fragment key={$index}>
                  <button onClick={t?.go} style={{ cursor: "pointer", borderRadius: "999px", padding: "9px 15px", font: "500 14px var(--font-mono)", border: `1px solid ${t?.bd ?? ''}`, background: `${t?.bg ?? ''}`, color: `${t?.fg ?? ''}` }}>
                    {t?.t}
                  </button>
                </Fragment>))}
              </div>
            </div>
            <a href={v.waHref} style={{ marginTop: "8px", textAlign: "center", background: "#FF6A00", color: "#0A0A0A", borderRadius: "999px", padding: "16px 22px", fontWeight: "600", fontSize: "15px" }} className="hv-e9a718d">
              {v.t("Home.bookMyFreeSlot")}
            </a>
            <span style={{ fontSize: "12px", color: "#6B675F" }}>
              {v.t("Home.noPitchNoObligationYourDetails")}
            </span>
          </div>
        </div>
        {" "}
      </div>
      <Footer  />
      {v.caseOpen ? (<>
        {" "}
        <div onClick={v.closeCase} style={{ position: "fixed", inset: "0", zIndex: "95", background: "rgba(11,11,12,.72)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", animation: "rdFade .3s" }}>
          <div data-lenis-prevent="1" role="dialog" aria-modal="true" onClick={v.stopBubble} style={{ width: "min(1120px,100%)", maxHeight: "calc(100vh - 48px)", overflow: "auto", background: "#0B0B0C", color: "#F4F4F2", borderRadius: "28px", border: "1px solid #2A2A2C", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", padding: "22px 28px", borderBottom: "1px solid #1F1F21", position: "sticky", top: "0", background: "#0B0B0C", zIndex: "2" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#FF9A50" }}>
                {v.t("Home.caseTICOriginalsTillICollapse")}
              </div>
              <button onClick={v.closeCase} style={{ background: "none", border: "1px solid #3A3A3C", color: "#F4F4F2", borderRadius: "999px", padding: "9px 16px", font: "500 14px var(--font-sans)", cursor: "pointer" }}>
                {v.t("Home.close")}
              </button>
            </div>
            <div style={{ padding: "clamp(24px,4vw,48px)", display: "flex", flexDirection: "column", gap: "40px" }}>
              <h3 style={{ margin: "0", fontSize: "clamp(32px,4vw,58px)", letterSpacing: "-0.045em", lineHeight: "1", fontWeight: "600", maxWidth: "820px", textWrap: "balance" }}>
                {v.t("Home.fromDropToDoorstep")}{" "}
                <span style={{ color: "#FF9A50" }}>
                  {v.t("Home.oneSystem")}
                </span>
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <img loading="lazy" decoding="async" src={opt("/images/tic-shop.png")} alt={v.t("Home.tICOriginalsOnlineShop")} style={{ width: "100%", borderRadius: "18px", display: "block", border: "1px solid #2A2A2C" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#8C877E" }}>
                  {v.t("Home.n01TheShopStripePayPalDE")}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: "32px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
                    {v.t("Home.whatIBuilt")}
                  </div>
                  {(v.ticBuilt ?? []).map((b, $index) => (<Fragment key={$index}>
                    <div style={{ display: "flex", gap: "12px", fontSize: "16px", lineHeight: "1.45", borderTop: "1px solid #1F1F21", paddingTop: "12px" }}>
                      <span style={{ color: "#FF6A00" }}>
                        {"+"}
                      </span>
                      {b}
                    </div>
                  </Fragment>))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
                    {v.t("Home.everyMorningOneList")}
                  </div>
                  {(v.ticMorning ?? []).map((b, $index) => (<Fragment key={$index}>
                    <div style={{ display: "flex", gap: "12px", fontSize: "16px", lineHeight: "1.45", borderTop: "1px solid #1F1F21", paddingTop: "12px" }}>
                      <span style={{ color: "#FF6A00" }}>
                        {"→"}
                      </span>
                      {b}
                    </div>
                  </Fragment>))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <img loading="lazy" decoding="async" src={opt("/images/tic-backoffice.png")} alt={v.t("Home.tICBackOffice")} style={{ width: "100%", borderRadius: "18px", display: "block", border: "1px solid #2A2A2C" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#8C877E" }}>
                  {v.t("Home.n02TheBackOfficeTodayS")}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: "14px" }}>
                <img loading="lazy" decoding="async" src={opt("/images/hf/tic1.jpg", 1080)} alt={v.t("Home.tICOriginalsProduct")} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "16px", display: "block", background: "#F4F4F2" }} />
                <img loading="lazy" decoding="async" src={opt("/images/hf/tic2.jpg", 1080)} alt={v.t("Home.tICOriginalsProduct")} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "16px", display: "block", background: "#F4F4F2" }} />
                <img loading="lazy" decoding="async" src={opt("/images/hf/tic3.jpg", 1080)} alt={v.t("Home.tICOriginalsProduct")} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "16px", display: "block", background: "#F4F4F2" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", flexWrap: "wrap", borderTop: "1px solid #1F1F21", paddingTop: "28px" }}>
                <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", fontFamily: "var(--font-mono)", fontSize: "12px", color: "#B8B3AA" }}>
                  <span>
                    <span style={{ color: "#FF9A50" }}>
                      {v.t("Home.hosting")}
                    </span>
                    {" "}{v.t("Home.eUFrankfurt")}
                  </span>
                  <span>
                    <span style={{ color: "#FF9A50" }}>
                      {v.t("Home.phase")}
                    </span>
                    {" "}{v.t("Home.liveMaintained")}
                  </span>
                  <span>
                    <span style={{ color: "#FF9A50" }}>
                      {v.t("Home.builtBy")}
                    </span>
                    {" "}{v.t("Home.onePerson3")}
                  </span>
                </div>
                <a href="#start" onClick={v.closeCase} style={{ background: "#FF6A00", color: "#0A0A0A", borderRadius: "999px", padding: "14px 22px", fontWeight: "600", fontSize: "15px" }}>
                  {v.t("Home.iWantThisForMyBrand")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </>) : null}
    </>
  );
};

export default function HomePage(props) {
  const dc = useDC();
  return <Logic key={dc.locale} {...dc} {...props} />;
}
