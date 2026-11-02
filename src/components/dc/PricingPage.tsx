// @ts-nocheck -- ported 1:1 from rideff_handoff/design/RIDEFF Pricing.dc.html (see scripts/dc-port/convert.mjs)
'use client';
import React, { Fragment } from 'react';
import { DCLogic, dcStyle, useDC } from '@/lib/dc';
import Nav from '@/components/dc/Nav';
import Footer from '@/components/dc/Footer';

class Logic extends DCLogic {
  state = {
    life: false,
    plan: 1,
    lplan: 1,
    yearly: false,
    mx: 0,
    pin: false,
    sn_bd: false,
    sn_ph: false,
    sn_cm: false,
    areas: ['cust', 'web', 'team'],
    wants: ['brief', 'money', 'goals'],
    people: 1,
    phase: 2,
    step: 0,
    fp: 0,
    hold: false,
    faq: 0
  };
  BIZ = [{
    n: '01',
    name: 'Core',
    tag: this.props.t("Pricing.startHere"),
    for: this.props.t("Pricing.oneAreaConnectedUsuallyCustomersAnd"),
    mo: 149,
    setup: 1290,
    items: [this.props.t("Pricing.websiteOrCoreSystem"), this.props.t("Pricing.aIInboxForInquiries"), this.props.t("Pricing.clientPortal"), this.props.t("Pricing.hostingBackupsUpdates")]
  }, {
    n: '02',
    name: 'Growth',
    tag: this.props.t("Pricing.mostChosen"),
    for: this.props.t("Pricing.customersSalesTeamAndOperationsIn"),
    mo: 249,
    setup: 1990,
    items: [this.props.t("Pricing.everythingInCore"), this.props.t("Pricing.teamApp"), this.props.t("Pricing.automatedOffersFollowUps"), this.props.t("Pricing.monthlyReport")]
  }, {
    n: '03',
    name: this.props.t("Pricing.wholeSystem"),
    tag: this.props.t("Pricing.fullBrain"),
    for: this.props.t("Pricing.everyAreaConnectedFinanceAndMarketing"),
    mo: 449,
    setup: 3900,
    items: [this.props.t("Pricing.everythingInGrowth"), this.props.t("Pricing.financeInvoicingFlows"), this.props.t("Pricing.marketingAutomation"), this.props.t("Pricing.prioritySupport")]
  }];
  LIFE = [{
    n: '01',
    name: this.props.t("Pricing.life"),
    tag: '',
    for: this.props.t("Pricing.justYouTheEssentials"),
    mo: 12.9,
    items: [this.props.t("Pricing.morningBriefing"), this.props.t("Pricing.moneyOverview"), this.props.t("Pricing.calendar"), this.props.t("Pricing.n14DaysFree")]
  }, {
    n: '02',
    name: 'Life Plus',
    tag: this.props.t("Pricing.mostChosen"),
    for: this.props.t("Pricing.everythingForOnePerson"),
    mo: 19.9,
    items: [this.props.t("Pricing.everythingInLife"), this.props.t("Pricing.goalsHabits"), this.props.t("Pricing.aIResearchBrainstorm"), this.props.t("Pricing.n14DaysFree")]
  }, {
    n: '03',
    name: this.props.t("Pricing.together"),
    tag: this.props.t("Pricing.upTo4"),
    for: this.props.t("Pricing.sharedForAHousehold"),
    mo: 29.9,
    items: [this.props.t("Pricing.everythingInPlus"), this.props.t("Pricing.upTo4People"), this.props.t("Pricing.sharedCalendarBudget"), this.props.t("Pricing.n14DaysFree")]
  }, {
    n: '04',
    name: 'Life Private',
    tag: this.props.t("Pricing.byCall"),
    for: this.props.t("Pricing.setUpPersonallyWithRialto"),
    mo: 68,
    setup: 449,
    priv: true,
    items: [this.props.t("Pricing.personalSetup"), this.props.t("Pricing.yourOwnDataSources"), this.props.t("Pricing.directLine"), this.props.t("Pricing.startedByACall")]
  }];
  SLABS_B = [['00', this.props.t("Pricing.foundation"), this.props.t("Pricing.hostingDomainBackups")], ['01', 'Core', this.props.t("Pricing.websiteInboxPortal")], ['02', 'Growth', this.props.t("Pricing.teamOffersReports")], ['03', this.props.t("Pricing.whole"), this.props.t("Pricing.financeMarketing")]];
  SLABS_L = [['00', this.props.t("Pricing.foundation"), this.props.t("Pricing.yourDataEU")], ['01', this.props.t("Pricing.life"), this.props.t("Pricing.briefingMoneyCalendar")], ['02', 'Plus', this.props.t("Pricing.goalsAI")], ['03', this.props.t("Pricing.together"), this.props.t("Pricing.upTo4People")], ['04', this.props.t("Pricing.private"), this.props.t("Pricing.setUpWithRialto")]];
  COL_B = [['#DCD5CA', '#0A0A0A', '#BDB6AA'], ['#F4F1EC', '#0A0A0A', '#CFC8BC'], ['#0B0B0C', '#F4F4F2', '#000000'], ['#FF6A00', '#0A0A0A', '#B84C00']];
  COL_L = [['#DCD5CA', '#0A0A0A', '#BDB6AA'], ['#F6E9DC', '#2A1E14', '#E2CDB6'], ['#F4F1EC', '#0A0A0A', '#CFC8BC'], ['#0B0B0C', '#F4F4F2', '#000000'], ['#FF6A00', '#0A0A0A', '#B84C00']];
  AREAS = [{
    k: 'cust',
    t: this.props.t("Pricing.customersInquiries"),
    d: this.props.t("Pricing.aIInboxContactFormsClientPortal"),
    l: 0
  }, {
    k: 'web',
    t: this.props.t("Pricing.websiteOrShop"),
    d: this.props.t("Pricing.yourSiteOnYourOwnDomain"),
    l: 0
  }, {
    k: 'sales',
    t: this.props.t("Pricing.offersFollowUps"),
    d: this.props.t("Pricing.offersAndRemindersThatSendThemselves"),
    l: 1
  }, {
    k: 'team',
    t: this.props.t("Pricing.teamShifts"),
    d: this.props.t("Pricing.teamAppSchedulesLeave"),
    l: 1
  }, {
    k: 'ops',
    t: this.props.t("Pricing.operationsReports"),
    d: this.props.t("Pricing.ordersStockAMonthlyReport"),
    l: 1
  }, {
    k: 'fin',
    t: this.props.t("Pricing.financeInvoicing"),
    d: this.props.t("Pricing.invoicesPaymentsBookkeepingExport"),
    l: 2
  }, {
    k: 'mkt',
    t: this.props.t("Pricing.marketing"),
    d: this.props.t("Pricing.campaignsNewsletterReviews"),
    l: 2
  }];
  WANTS = [{
    k: 'brief',
    t: this.props.t("Pricing.morningBriefing"),
    d: this.props.t("Pricing.yourDayInOneScreen"),
    l: 0
  }, {
    k: 'money',
    t: this.props.t("Pricing.moneyOverview"),
    d: this.props.t("Pricing.accountsSpendingWhatSLeft"),
    l: 0
  }, {
    k: 'cal',
    t: this.props.t("Pricing.calendar"),
    d: this.props.t("Pricing.everythingInOneTimeline"),
    l: 0
  }, {
    k: 'goals',
    t: this.props.t("Pricing.goalsHabits"),
    d: this.props.t("Pricing.trackWhatYouWantToChange"),
    l: 1
  }, {
    k: 'ai',
    t: this.props.t("Pricing.aIResearchBrainstorm"),
    d: this.props.t("Pricing.basedOnYourOwnData"),
    l: 1
  }, {
    k: 'priv',
    t: this.props.t("Pricing.setUpPersonally"),
    d: this.props.t("Pricing.rialtoConnectsYourOwnSources"),
    l: 3
  }];
  BD_B = [[this.props.t("Pricing.eUHostingDatabase"), 18, this.props.t("Pricing.serversInFrankfurtDatabaseFileStorage")], [this.props.t("Pricing.aIUsage"), 22, this.props.t("Pricing.everyAIAnswerSummaryAndReport")], [this.props.t("Pricing.updatesFixesSecurity"), 25, this.props.t("Pricing.keepingEverythingCurrentPatchedAndWorking")], [this.props.t("Pricing.supportMyHours"), 30, this.props.t("Pricing.changesQuestionsAndChatWithMe")], [this.props.t("Pricing.backupsMonitoring"), 5, this.props.t("Pricing.dailyBackupsAndAlertsBeforeYou")]];
  BD_L = [[this.props.t("Pricing.eUHostingDatabase"), 20, this.props.t("Pricing.yourDataStaysInFrankfurt")], [this.props.t("Pricing.aIUsage"), 35, this.props.t("Pricing.briefingsResearchAndBrainstormsRunOn")], [this.props.t("Pricing.newFeatures"), 25, this.props.t("Pricing.lifeKeepsGettingBetterWhileYou")], [this.props.t("Pricing.support"), 12, this.props.t("Pricing.aRealPersonWhenSomethingFeels")], [this.props.t("Pricing.paymentFees"), 8, this.props.t("Pricing.cardSEPAAndKlarnaCostA")]];
  BDCOL = [['#0A0A0A', '#F4F4F2'], ['#FF6A00', '#0A0A0A'], ['#FF9A50', '#0A0A0A'], ['#FFB27A', '#0A0A0A'], ['#BDB6AA', '#0A0A0A']];
  PH_B = [[this.props.t("Pricing.firstCall"), this.props.t("Pricing.day1"), this.props.t("Pricing.n30MinutesWeTalkAboutHow"), 0], [this.props.t("Pricing.analysis"), this.props.t("Pricing.week12"), this.props.t("Pricing.iMapYourToolsStepsAnd"), 20], [this.props.t("Pricing.build"), this.props.t("Pricing.week25"), this.props.t("Pricing.iBuildYourSystemAndConnect"), 55], [this.props.t("Pricing.test"), this.props.t("Pricing.week56"), this.props.t("Pricing.yourTeamUsesItForReal"), 15], [this.props.t("Pricing.live"), this.props.t("Pricing.week6"), this.props.t("Pricing.switchOverDataMovedTeamShown"), 10]];
  PH_L = [[this.props.t("Pricing.signUp"), this.props.t("Pricing.day0"), this.props.t("Pricing.emailAndA6DigitCode"), 0], [this.props.t("Pricing.connect"), this.props.t("Pricing.day1"), this.props.t("Pricing.calendarAndAccountsOnlyWhatYou"), 0], [this.props.t("Pricing.firstBriefing"), this.props.t("Pricing.day2"), this.props.t("Pricing.yourMorningMoneyAndGoalsOn"), 0], [this.props.t("Pricing.makeItYours"), this.props.t("Pricing.day312"), this.props.t("Pricing.goalsHabitsAIResearchOnYour"), 0], [this.props.t("Pricing.decide"), this.props.t("Pricing.day14"), this.props.t("Pricing.pickAPlanOrSimplyLeave"), 0]];
  CM_B = [[this.props.t("Pricing.agencyWebsiteOneOff"), 4500], [this.props.t("Pricing.freelancerForAutomations"), 4800, this.props.t("Pricing.n400Mo")], [this.props.t("Pricing.n46SeparateTools"), 2160, this.props.t("Pricing.n180Mo")], [this.props.t("Pricing.yourTimeHoldingItTogether"), 3840, this.props.t("Pricing.n8HMo40")]];
  CM_L = [[this.props.t("Pricing.budgetingApp"), 60], [this.props.t("Pricing.calendarPlannerPro"), 48], [this.props.t("Pricing.aISubscription"), 240], [this.props.t("Pricing.habitTracker"), 30]];
  CMCOL = ['#3A3731', '#5A5650', '#8C877E', '#BDB6AA'];
  TB = [{
    t: this.props.t("Pricing.builtForYou"),
    rows: [[this.props.t("Pricing.websiteOrCoreSystem"), 1, 1, 1], [this.props.t("Pricing.aIInboxForInquiries"), 1, 1, 1], [this.props.t("Pricing.clientPortal"), 1, 1, 1], [this.props.t("Pricing.teamApp"), 0, 1, 1], [this.props.t("Pricing.automatedOffersFollowUps"), 0, 1, 1], [this.props.t("Pricing.monthlyReport"), 0, 1, 1], [this.props.t("Pricing.financeInvoicingFlows"), 0, 0, 1], [this.props.t("Pricing.marketingAutomation"), 0, 0, 1]]
  }, {
    t: this.props.t("Pricing.runningIt"),
    rows: [[this.props.t("Pricing.eUHostingInFrankfurt"), 1, 1, 1], [this.props.t("Pricing.ownDomainSSL"), 1, 1, 1], [this.props.t("Pricing.dailyBackups"), 1, 1, 1], [this.props.t("Pricing.updatesFixes"), 1, 1, 1], [this.props.t("Pricing.supportThroughYourPortal"), 1, 1, 1], [this.props.t("Pricing.prioritySupport"), 0, 0, 1]]
  }, {
    t: this.props.t("Pricing.limits"),
    ph: true,
    rows: [[this.props.t("Pricing.domains"), '1', '1', '3'], [this.props.t("Pricing.emailMailboxes"), '3', '10', '25'], [this.props.t("Pricing.changesPerMonth"), '2 h', '5 h', '10 h'], [this.props.t("Pricing.supportReply"), this.props.t("Pricing.n2WorkDays"), this.props.t("Pricing.nextWorkDay"), this.props.t("Pricing.sameDay")], [this.props.t("Pricing.teamAppUsers"), '–', '15', this.props.t("Pricing.unlimited")], [this.props.t("Pricing.backupHistory"), this.props.t("Pricing.n30Days"), this.props.t("Pricing.n90Days"), this.props.t("Pricing.n180Days")]]
  }];
  TL = [{
    t: this.props.t("Pricing.inTheApp"),
    rows: [[this.props.t("Pricing.morningBriefing"), 1, 1, 1, 1], [this.props.t("Pricing.moneyOverview"), 1, 1, 1, 1], [this.props.t("Pricing.calendar"), 1, 1, 1, 1], [this.props.t("Pricing.goalsHabits"), 0, 1, 1, 1], [this.props.t("Pricing.aIResearchBrainstorm"), 0, 1, 1, 1], [this.props.t("Pricing.sharedCalendarBudget"), 0, 0, 1, 1]]
  }, {
    t: this.props.t("Pricing.personal"),
    rows: [[this.props.t("Pricing.setUpByRialto"), 0, 0, 0, 1], [this.props.t("Pricing.yourOwnDataSources"), 0, 0, 0, 1], [this.props.t("Pricing.directLine"), 0, 0, 0, 1]]
  }, {
    t: this.props.t("Pricing.runningIt"),
    rows: [[this.props.t("Pricing.eUHostingInFrankfurt"), 1, 1, 1, 1], [this.props.t("Pricing.n14DaysFreeNoCard"), 1, 1, 1, 0], [this.props.t("Pricing.cancelAnyMonth"), 1, 1, 1, 1]]
  }, {
    t: this.props.t("Pricing.limits"),
    ph: true,
    rows: [[this.props.t("Pricing.people"), '1', '1', this.props.t("Pricing.upTo4"), this.props.t("Pricing.custom")], [this.props.t("Pricing.connectedAccounts"), '3', '10', this.props.t("Pricing.n10Each"), this.props.t("Pricing.custom")], [this.props.t("Pricing.aIRequestsPerDay"), '20', '100', this.props.t("Pricing.n100Each"), this.props.t("Pricing.custom")], [this.props.t("Pricing.storage"), '1 GB', '5 GB', '20 GB', this.props.t("Pricing.custom")]]
  }];
  FAQ_B = [[this.props.t("Pricing.whyASetupFeeAndA"), this.props.t("Pricing.theSetupPaysForAnalysingAnd")], [this.props.t("Pricing.whatDoesTheSetupFeeCover"), this.props.t("Pricing.analysisBuildTestingAndGoLive")], [this.props.t("Pricing.howLongIsTheContract"), this.props.t("Pricing.businessPlansRunFor12Months")], [this.props.t("Pricing.howDoIPay"), this.props.t("Pricing.cardSEPADirectDebitOrKlarna")], [this.props.t("Pricing.arePricesNetOrGross"), this.props.t("Pricing.businessPricesAreNetPlus19")], [this.props.t("Pricing.whatIfINeedMoreThan"), this.props.t("Pricing.weTalkFirstEitherWeAdd")], [this.props.t("Pricing.canIChangePlansLater"), this.props.t("Pricing.yesMostClientsStartWithCore")], [this.props.t("Pricing.howDoIApproveTheOffer"), this.props.t("Pricing.inYourClientPortalTickThe")]];
  FAQ_L = [[this.props.t("Pricing.doINeedACardFor"), this.props.t("Pricing.no14DaysFreeNoCard")], [this.props.t("Pricing.canICancelAnyMonth"), this.props.t("Pricing.yesLifePlansCanBeCancelled")], [this.props.t("Pricing.isYearlyCheaper"), this.props.t("Pricing.yesPayYearlyAndGet2")], [this.props.t("Pricing.arePricesFinal"), this.props.t("Pricing.yesLifePricesIncludeVAT")], [this.props.t("Pricing.whoCanUseTogether"), this.props.t("Pricing.upTo4PeopleInOne")], [this.props.t("Pricing.howDoesLifePrivateStart"), this.props.t("Pricing.withACallAfterThatYou")], [this.props.t("Pricing.whereIsMyData"), this.props.t("Pricing.inTheEUInFrankfurt")], [this.props.t("Pricing.howDoIPay"), this.props.t("Pricing.cardSEPADirectDebitOrKlarna2")]];
  eur = (n, dec) => '€' + (dec ? n.toFixed(2).replace('.', ',') : Math.round(n).toLocaleString('en-US'));
  toggleIn = (key, k) => this.setState(s => ({
    [key]: s[key].includes(k) ? s[key].filter(x => x !== k) : [...s[key], k]
  }));
  pick = i => this.setState(s => s.life ? {
    lplan: i
  } : {
    plan: i
  });
  sTo = top => {
    if (window.__lenis) window.__lenis.scrollTo(top, {
      duration: 1.3,
      easing: x => 1 - Math.pow(1 - x, 4)
    });else window.scrollTo({
      top,
      behavior: 'smooth'
    });
  };
  nP = () => (this.state.life ? this.LIFE : this.BIZ).length;
  pinTop = (sel, frac) => {
    const el = document.querySelector('[data-pin="' + sel + '"]');
    if (!el) return null;
    return el.getBoundingClientRect().top + scrollY + frac * (el.offsetHeight - innerHeight);
  };
  pickHero = (i, toTop) => {
    const y = this.state.pin ? this.pinTop('hero', (i + .5) / this.nP()) : null;
    if (y != null) this.sTo(y);else {
      this.pick(i);
      if (toTop) this.sTo(0);
    }
  };
  goStep = k => {
    const y = this.state.pin ? this.pinTop('flow', (k + .5) / 6) : null;
    if (y != null) this.sTo(y);else this.setState({
      step: k,
      fp: 0
    });
  };
  after = () => setTimeout(() => {
    this.fitPins && this.fitPins();
    this.scrollFx && this.scrollFx();
  }, 60);
  fxInit() {
    try {
      this.rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {}
    if (this.rm || !('IntersectionObserver' in window)) this.setState({
      sn_bd: true,
      sn_ph: true,
      sn_cm: true
    });else {
      this.io = new IntersectionObserver(es => es.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target,
          d = +(el.dataset.rv || 0);
        el.style.transition = 'opacity 1s cubic-bezier(.16,1,.3,1) ' + d + 'ms, transform 1.2s cubic-bezier(.16,1,.3,1) ' + d + 'ms';
        el.style.opacity = 1;
        el.style.transform = 'none';
        this.io.unobserve(el);
      }), {
        threshold: .12
      });
      document.querySelectorAll('[data-rv]').forEach(el => {
        if (el.getBoundingClientRect().top < innerHeight * .9) return;
        el.style.opacity = 0;
        el.style.transformOrigin = '50% 100%';
        el.style.transform = 'perspective(1200px) translateY(70px) rotateX(18deg)';
        this.io.observe(el);
      });
      this.io2 = new IntersectionObserver(es => es.forEach(en => {
        if (!en.isIntersecting) return;
        this.setState({
          ['sn_' + en.target.dataset.seen]: true
        });
        this.io2.unobserve(en.target);
      }), {
        threshold: .35
      });
      document.querySelectorAll('[data-seen]').forEach(el => this.io2.observe(el));
    }
    this.fitPins = () => document.querySelectorAll('[data-pinbox]').forEach(b => {
      b.style.transform = '';
      if (!this.state.pin) return;
      const k = Math.min(1, (innerHeight - 8) / b.scrollHeight);
      b.style.transform = k < 1 ? 'scale(' + k.toFixed(4) + ')' : '';
    });
    this.calcPin = () => {
      const pin = !this.rm && innerWidth >= 1000 && innerHeight >= 640;
      if (pin !== this.state.pin) this.setState({
        pin
      }, this.after);else this.fitPins();
    };
    this.calcPin();
    addEventListener('resize', this.calcPin);
    this.lastY = scrollY;
    this.onFx = () => {
      if (this.raf) return;
      this.raf = requestAnimationFrame(() => {
        this.raf = 0;
        this.scrollFx();
      });
    };
    addEventListener('scroll', this.onFx, {
      passive: true
    });
    addEventListener('resize', this.onFx);
    this.scrollFx();
  }
  scrollFx() {
    const vh = innerHeight,
      cl = (v, a, b) => Math.max(a, Math.min(b, v)),
      s = this.state,
      pin = s.pin;
    const hp = document.querySelector('[data-pin="hero"]');
    if (hp) {
      const r = hp.getBoundingClientRect(),
        t = pin ? cl(-r.top / Math.max(1, r.height - vh), 0, .999) : cl(-r.top / vh, 0, 1);
      const bar = hp.querySelector('[data-hbar]');
      if (bar) bar.style.transform = 'scaleX(' + t.toFixed(4) + ')';
      const st = hp.querySelector('[data-stackrot]');
      if (st && !this.rm) st.style.transform = 'translateY(' + ((.5 - t) * 50).toFixed(1) + 'px) scale(' + (.94 + t * .1).toFixed(3) + ')';
      if (pin && r.top <= 0 && r.bottom >= vh * .5) {
        const i = Math.floor(t * this.nP()),
          cur = s.life ? s.lplan : s.plan;
        if (i !== cur) this.pick(i);
      }
    }
    const words = document.querySelector('[data-words]');
    if (words) {
      const r = words.getBoundingClientRect(),
        t = cl((vh * .85 - r.top) / (r.height + vh * .35), 0, 1),
        sp = words.querySelectorAll('[data-wd]'),
        lit = Math.round(t * sp.length);
      sp.forEach((x, k) => {
        x.style.color = k < lit ? x.dataset.wd === '1' ? '#8C877E' : '#0A0A0A' : '#D3CCC0';
      });
    }
    const fp = document.querySelector('[data-pin="flow"]');
    if (fp && pin) {
      const r = fp.getBoundingClientRect(),
        t = cl(-r.top / Math.max(1, r.height - vh), 0, .9999),
        k = Math.floor(t * 6),
        fr = t * 6 - k;
      if (k !== s.step) this.setState({
        step: k
      });
      fp.querySelectorAll('[data-fl]').forEach((x, j) => {
        x.style.width = (j < k ? 100 : j === k ? fr * 100 : 0).toFixed(1) + '%';
      });
    }
  }
  componentDidMount() {
    this.t0 = setTimeout(() => this.fxInit(), 60);
    this.iv = setInterval(() => this.setState(s => {
      if (s.hold || s.pin) return null;
      const fp = s.fp + 0.03;
      return fp >= 1 ? {
        fp: 0,
        step: (s.step + 1) % 6
      } : {
        fp
      };
    }), 100);
  }
  componentWillUnmount() {
    clearTimeout(this.t0);
    clearInterval(this.iv);
    removeEventListener('scroll', this.onFx);
    removeEventListener('resize', this.onFx);
    if (this.calcPin) removeEventListener('resize', this.calcPin);
    if (this.io) this.io.disconnect();
    if (this.io2) this.io2.disconnect();
  }
  renderVals() {
    const s = this.state,
      L = s.life,
      P = L ? this.LIFE : this.BIZ,
      pi = L ? s.lplan : s.plan,
      cur = P[pi];
    const dec = L,
      yr = L && s.yearly && !cur.priv;
    const moOf = p => L && s.yearly && !p.priv ? p.mo * 10 / 12 : p.mo;
    const priceOf = p => (p.priv ? this.props.t("Pricing.from") : '') + this.eur(moOf(p), dec);
    const curMo = moOf(cur),
      curPrice = priceOf(cur);
    const slabsSrc = L ? this.SLABS_L : this.SLABS_B,
      COL = L ? this.COL_L : this.COL_B,
      gap = L ? 54 : 74;
    const slabs = slabsSrc.map((x, i) => {
      const on = i <= pi + 1,
        c = COL[i];
      return {
        n: x[0],
        t: x[1],
        sub: x[2],
        z: i * gap + (on ? 0 : 46) + 'px',
        tOp: on ? 1 : 0,
        bg: on ? c[0] : 'rgba(236,232,225,.82)',
        fg: on ? c[1] : '#8C877E',
        side: on ? c[2] : 'transparent',
        bd: on ? i === pi + 1 ? '#FF6A00' : 'transparent' : '#A39B8E',
        bs: on ? 'solid' : 'dashed',
        sh: on ? '0 40px 60px -30px rgba(10,10,10,.45)' : 'none',
        go: () => this.pickHero(Math.max(0, i - 1))
      };
    });
    // config
    const opts = L ? this.WANTS : this.AREAS,
      sel = L ? s.wants : s.areas;
    let rec = Math.max(0, ...opts.filter(o => sel.includes(o.k)).map(o => o.l));
    if (L && s.people > 1) rec = Math.max(rec, 2);
    rec = Math.min(rec, P.length - 1);
    const R = P[rec],
      rMo = moOf(R);
    const cfgRows = L ? R.priv ? [{
      l: this.props.t("Pricing.monthly"),
      v: this.props.t("Pricing.from") + this.eur(R.mo, 1)
    }, {
      l: this.props.t("Pricing.setup"),
      v: this.props.t("Pricing.from") + this.eur(R.setup, 1)
    }, {
      l: this.props.t("Pricing.startsWith"),
      v: this.props.t("Pricing.aCall")
    }, {
      l: this.props.t("Pricing.perDay"),
      v: '≈ ' + this.eur(R.mo * 12 / 365, 1)
    }] : [{
      l: s.yearly ? this.props.t("Pricing.perMonthBilledYearly") : this.props.t("Pricing.perMonth"),
      v: this.eur(rMo, 1)
    }, {
      l: this.props.t("Pricing.perYear"),
      v: this.eur(s.yearly ? R.mo * 10 : R.mo * 12, 1)
    }, {
      l: this.props.t("Pricing.perDay"),
      v: '≈ ' + this.eur(rMo * 12 / 365, 1)
    }, {
      l: this.props.t("Pricing.first14Days"),
      v: this.props.t("Pricing.free"),
      c: '#FF6A00'
    }] : [{
      l: this.props.t("Pricing.monthly"),
      v: this.eur(R.mo) + this.props.t("Pricing.mo")
    }, {
      l: this.props.t("Pricing.setup"),
      v: this.props.t("Pricing.from") + this.eur(R.setup)
    }, {
      l: this.props.t("Pricing.yearOneTotal"),
      v: this.props.t("Pricing.from") + this.eur(R.setup + 12 * R.mo),
      c: '#FF6A00'
    }, {
      l: this.props.t("Pricing.perDayAfterSetup"),
      v: '≈ ' + this.eur(R.mo * 12 / 365, 1)
    }];
    const picked = opts.filter(o => sel.includes(o.k)).map(o => o.t.toLowerCase());
    const cfgWhy = picked.length ? this.props.t("Pricing.covers") + picked.slice(0, 4).join(', ') + (picked.length > 4 ? this.props.t("Pricing.andMore") : '') + (L && s.people > 1 ? this.props.t("Pricing.for") + s.people + this.props.t("Pricing.people2") : '.') : this.props.t("Pricing.tickAtLeastOneAreaTo");
    // breakdown
    const BD = L ? this.BD_L : this.BD_B;
    const bd = BD.map((b, i) => ({
      t: b[0],
      pct: b[1],
      d: b[2],
      w: s.sn_bd ? b[1] + '%' : '0%',
      eur: this.eur(curMo * b[1] / 100, 1),
      col: this.BDCOL[i][0],
      fg: this.BDCOL[i][1]
    }));
    // phases
    const PH = L ? this.PH_L : this.PH_B;
    const phases = PH.map((p, i) => {
      const on = i === s.phase;
      return {
        n: '0' + (i + 1),
        t: p[0],
        when: p[1],
        d: p[2],
        amt: L ? p[1] : p[3] ? '≈ ' + this.eur(cur.setup * p[3] / 100) : this.props.t("Pricing.free"),
        w: L ? s.sn_ph ? (i + 1) / 5 * 100 + '%' : '0%' : s.sn_ph ? p[3] + '%' : '0%',
        bg: on ? '#0A0A0A' : '#F4F1EC',
        fg: on ? '#F4F4F2' : '#0A0A0A',
        track: on ? '#2A2A2C' : '#DCD5CA',
        ty: on ? '-8px' : '0px',
        go: () => this.setState({
          phase: i
        })
      };
    });
    // flow
    const vat = (cur.setup || 0) * 0.19;
    const STEPS = L ? [[this.props.t("Pricing.startFree"), this.props.t("Pricing.signUpWithYourEmailAnd"), 'app.rideff.com/start', this.props.t("Pricing.startYour14Days"), [[this.props.t("Pricing.trial"), this.props.t("Pricing.n14Days")], [this.props.t("Pricing.card"), this.props.t("Pricing.notNeeded")], [this.props.t("Pricing.login"), this.props.t("Pricing.n6DigitCode")]], this.props.t("Pricing.startFree"), this.props.t("Pricing.day0")], [this.props.t("Pricing.connectYourDay"), this.props.t("Pricing.addYourCalendarAndAccountsOnly"), 'app.rideff.com/connect', this.props.t("Pricing.connect"), [[this.props.t("Pricing.calendar"), this.props.t("Pricing.connected")], [this.props.t("Pricing.money"), this.props.t("Pricing.n2Accounts")], [this.props.t("Pricing.goals"), this.props.t("Pricing.n3Set")]], this.props.t("Pricing.continue"), this.props.t("Pricing.day1")], [this.props.t("Pricing.yourFirstBriefing"), this.props.t("Pricing.everyMorningYourDayYourMoney"), 'app.rideff.com', this.props.t("Pricing.goodMorning"), [[this.props.t("Pricing.today"), this.props.t("Pricing.n4Events")], [this.props.t("Pricing.money"), this.props.t("Pricing.onTrack")], [this.props.t("Pricing.goal"), this.props.t("Pricing.run3ThisWeek")]], this.props.t("Pricing.openBriefing"), this.props.t("Pricing.day2")], [this.props.t("Pricing.chooseAPlan"), this.props.t("Pricing.pickWhatFitsOrLeaveNothing"), 'app.rideff.com/plan', this.props.t("Pricing.chooseAPlan"), [[this.props.t("Pricing.life"), '€12,90'], ['Life Plus', '€19,90'], [this.props.t("Pricing.together"), '€29,90']], this.props.t("Pricing.choose"), this.props.t("Pricing.day14")], [this.props.t("Pricing.payYourWay"), this.props.t("Pricing.cardSEPAOrKlarnaYearlyGets"), 'app.rideff.com/billing', cur.name, [[this.props.t("Pricing.plan"), curPrice + (yr ? this.props.t("Pricing.moYearly") : this.props.t("Pricing.mo"))], [this.props.t("Pricing.payBy"), this.props.t("Pricing.cardSEPAKlarna")], ['VAT', this.props.t("Pricing.included")]], this.props.t("Pricing.confirm"), this.props.t("Pricing.plan")], [this.props.t("Pricing.cancelAnyMonth"), this.props.t("Pricing.noLockInStayBecauseIt"), 'app.rideff.com/settings', this.props.t("Pricing.yourPlan"), [[this.props.t("Pricing.billing"), s.yearly ? this.props.t("Pricing.yearly") : this.props.t("Pricing.monthly")], [this.props.t("Pricing.cancel"), this.props.t("Pricing.anyMonth")], [this.props.t("Pricing.data"), this.props.t("Pricing.eUFrankfurt")]], this.props.t("Pricing.managePlan"), this.props.t("Pricing.freeToGo")]] : [[this.props.t("Pricing.bookACall"), this.props.t("Pricing.n30MinutesFreeWeTalkAbout"), 'cal.com/rideff', this.props.t("Pricing.firstCall"), [[this.props.t("Pricing.length"), this.props.t("Pricing.n30Min")], [this.props.t("Pricing.cost"), this.props.t("Pricing.free")], [this.props.t("Pricing.where"), this.props.t("Pricing.videoCall")]], this.props.t("Pricing.pickATime"), this.props.t("Pricing.booked")], [this.props.t("Pricing.getYourOffer"), this.props.t("Pricing.aFixedOfferInYourClient"), 'portal.rideff.com/angebot', this.props.t("Pricing.offer") + cur.name, [[this.props.t("Pricing.setup"), this.props.t("Pricing.from") + this.eur(cur.setup)], [this.props.t("Pricing.monthly"), this.eur(cur.mo) + this.props.t("Pricing.mo")], [this.props.t("Pricing.term"), this.props.t("Pricing.n12Months")]], this.props.t("Pricing.reviewOffer"), this.props.t("Pricing.new")], [this.props.t("Pricing.approveInThePortal"), this.props.t("Pricing.tickTheTermsAndClickApprove"), 'portal.rideff.com/angebot', this.props.t("Pricing.approve"), [[this.props.t("Pricing.termsAGB"), this.props.t("Pricing.accepted")], [this.props.t("Pricing.approvedBy"), this.props.t("Pricing.owner")], [this.props.t("Pricing.saved"), this.props.t("Pricing.pDFTimestamp")]], this.props.t("Pricing.approve"), this.props.t("Pricing.approved")], [this.props.t("Pricing.payTheSetup"), this.props.t("Pricing.theSetupInvoiceAppearsByItself"), 'portal.rideff.com/rechnungen', this.props.t("Pricing.invoiceR2026014"), [[this.props.t("Pricing.setupNet"), this.eur(cur.setup)], ['VAT 19%', this.eur(vat)], [this.props.t("Pricing.payBy"), this.props.t("Pricing.cardSEPAKlarnaTransfer")]], this.props.t("Pricing.payNow"), this.props.t("Pricing.due")], [this.props.t("Pricing.iBuildIt"), this.props.t("Pricing.analyseBuildTestFollowEveryPhase"), 'portal.rideff.com/projekt', this.props.t("Pricing.projectBuild"), [[this.props.t("Pricing.analysis"), this.props.t("Pricing.done")], [this.props.t("Pricing.build"), this.props.t("Pricing.inProgress")], [this.props.t("Pricing.test"), this.props.t("Pricing.next")]], this.props.t("Pricing.openChat"), this.props.t("Pricing.phase35")], [this.props.t("Pricing.liveAndKeptRunning"), this.props.t("Pricing.yourSystemGoesLiveTheMonthly"), 'portal.rideff.com', this.props.t("Pricing.live"), [['Status', this.props.t("Pricing.running")], [this.props.t("Pricing.monthly"), this.eur(cur.mo) + this.props.t("Pricing.mo")], [this.props.t("Pricing.support"), this.props.t("Pricing.throughThePortal")]], this.props.t("Pricing.openDashboard"), this.props.t("Pricing.live")]];
    const M = STEPS[s.step];
    const steps = STEPS.map((x, i) => ({
      n: '0' + (i + 1),
      t: x[0],
      d: x[1],
      on: i === s.step,
      fg: i === s.step ? '#F4F4F2' : '#8C877E',
      nc: i === s.step ? '#FF6A00' : '#5A5650',
      w: s.pin ? '0%' : i < s.step ? '100%' : i === s.step ? (s.fp * 100).toFixed(1) + '%' : '0%',
      go: () => this.goStep(i)
    }));
    // compare
    const CM = L ? this.CM_L : this.CM_B,
      usual = CM.reduce((a, c) => a + c[1], 0);
    const rid = L ? cur.priv ? cur.setup + 12 * cur.mo : s.yearly ? cur.mo * 10 : cur.mo * 12 : cur.setup + 12 * cur.mo;
    const mx = Math.max(usual, rid);
    // table
    const TG = L ? this.TL : this.TB,
      nC = P.length;
    const tGroups = TG.map(g => ({
      t: g.t,
      ph: !!g.ph,
      rows: g.rows.map(r => ({
        t: r[0],
        cells: r.slice(1).map((v, i) => ({
          v: v === 1 ? '✓' : v === 0 ? '–' : v,
          fg: v === 0 ? '#BDB6AA' : v === 1 ? '#FF6A00' : '#0A0A0A',
          bg: i === pi ? 'rgba(255,106,0,.08)' : 'transparent'
        }))
      }))
    }));
    return {
      isLife: L,
      isBizPh: !L,
      heroSub: L ? this.props.t("Pricing.oneMonthlyPriceForALife") : this.props.t("Pricing.youPayOnceToHaveYour"),
      vatNote: L ? this.props.t("Pricing.finalPricesInclVATCancelAny") : this.props.t("Pricing.pricesNetPlus19VAT12"),
      bBg: L ? 'transparent' : '#0A0A0A',
      bFg: L ? '#3A3731' : '#F4F4F2',
      lBg: L ? '#0A0A0A' : 'transparent',
      lFg: L ? '#F4F4F2' : '#3A3731',
      setBiz: () => this.setState({
        life: false,
        phase: 2,
        step: 0,
        fp: 0,
        faq: 0
      }, this.after),
      setLife: () => this.setState({
        life: true,
        phase: 2,
        step: 0,
        fp: 0,
        faq: 0
      }, this.after),
      pin: s.pin,
      pinPos: s.pin ? 'sticky' : 'relative',
      pinH: s.pin ? '100vh' : '0px',
      heroH: s.pin ? P.length * 70 + 100 + 'vh' : 'auto',
      heroPad: s.pin ? '96px clamp(20px,3vw,40px) 24px' : '140px clamp(20px,3vw,40px) 40px',
      flowH: s.pin ? '420vh' : 'auto',
      flowPad: s.pin ? '72px clamp(20px,3vw,40px) 32px' : '130px clamp(20px,3vw,40px)',
      curN: cur.n,
      curFor: cur.for,
      curKey: 'cur' + L + pi,
      words: (L ? [[this.props.t("Pricing.youReNotPayingForAnother"), 1], [this.props.t("Pricing.youRePayingForOnePlace"), 0]] : [[this.props.t("Pricing.youReNotPayingForSoftware"), 1], [this.props.t("Pricing.youRePayingForASystem"), 0]]).flatMap(([txt, m]) => txt.split(' ').map(w => ({
        t: w + ' ',
        m: String(m)
      }))),
      mBg: s.yearly ? 'transparent' : '#0A0A0A',
      mFg: s.yearly ? '#3A3731' : '#F4F4F2',
      yBg: s.yearly ? '#0A0A0A' : 'transparent',
      yFg: s.yearly ? '#F4F4F2' : '#3A3731',
      setMonthly: () => this.setState({
        yearly: false
      }),
      setYearly: () => this.setState({
        yearly: true
      }),
      slabs,
      rz: -42 + s.mx * 10 + 'deg',
      stackY: (L ? 60 : 50) + 'px',
      stackMove: e => {
        const r = e.currentTarget.getBoundingClientRect();
        this.setState({
          mx: (e.clientX - r.left) / r.width * 2 - 1
        });
      },
      stackLeave: () => this.setState({
        mx: 0
      }),
      curName: cur.name,
      layerCount: String(pi + 2),
      curPrice,
      curDay: this.eur(curMo * 12 / 365, 1),
      planPills: P.map((p, i) => ({
        t: p.name,
        go: () => this.pickHero(i),
        bg: i === pi ? '#0A0A0A' : 'transparent',
        fg: i === pi ? '#F4F4F2' : '#3A3731',
        bd: i === pi ? '#0A0A0A' : '#BDB6AA'
      })),
      plans: P.map((p, i) => {
        const on = i === pi;
        return {
          ...p,
          price: priceOf(p),
          day: this.eur(moOf(p) * 12 / 365, 1),
          unit: L ? p.priv ? this.props.t("Pricing.monthSetupFrom449") : s.yearly ? this.props.t("Pricing.monthBilledYearlyInclVAT") : this.props.t("Pricing.monthInclVAT") : this.props.t("Pricing.monthSetupFrom") + this.eur(p.setup),
          cta: L ? p.priv ? this.props.t("Pricing.bookACall") : this.props.t("Pricing.startFree") : this.props.t("Pricing.askAbout") + p.name,
          href: L ? p.priv ? this.props.href("/contact") : this.props.signup(['life', 'plus', 'together'][i] || 'plus') : this.props.href("/contact"),
          go: () => this.pick(i),
          bg: on ? '#0B0B0C' : '#F4F1EC',
          fg: on ? '#F4F4F2' : '#0A0A0A',
          line: on ? '#2A2A2C' : '#D3CCC0',
          btnBg: on ? '#FF6A00' : '#0A0A0A',
          btnFg: on ? '#0A0A0A' : '#F4F4F2',
          dayC: on ? '#FF9A50' : '#8C877E',
          ty: on ? '-10px' : '0px'
        };
      }),
      cfgH: L ? this.props.t("Pricing.tellMe") : this.props.t("Pricing.tickWhatYour"),
      cfgH2: L ? this.props.t("Pricing.whatYouNeed") : this.props.t("Pricing.businessNeeds"),
      people: [1, 2, 3, 4].map(n => ({
        t: n === 4 ? '4' : String(n),
        go: () => this.setState({
          people: n
        }),
        bg: s.people === n ? '#FF6A00' : 'transparent',
        fg: s.people === n ? '#0A0A0A' : '#F4F4F2',
        bd: s.people === n ? '#FF6A00' : '#2A2A2C'
      })),
      cOpts: opts.map(o => {
        const on = sel.includes(o.k);
        return {
          t: o.t,
          d: o.d,
          toggle: () => this.toggleIn(L ? 'wants' : 'areas', o.k),
          bd: on ? '#FF6A00' : '#2A2A2C',
          bg: on ? 'rgba(255,106,0,.08)' : 'transparent',
          cb: on ? '#FF6A00' : '#5A5650',
          cbg: on ? '#FF6A00' : 'transparent',
          mark: on ? '✓' : ''
        };
      }),
      cfgN: R.n,
      cfgName: R.name,
      cfgKey: 'cfg' + L + rec,
      cfgWhy,
      cfgRows: cfgRows.map(r => ({
        c: '#0A0A0A',
        ...r
      })),
      useCfg: () => this.pickHero(rec, true),
      bdIntro: L ? this.props.t("Pricing.noAdsNoSellingYourData") : this.props.t("Pricing.noHiddenExtrasTheMonthlyFee"),
      bd,
      phK: L ? this.props.t("Pricing.theTrial") : this.props.t("Pricing.theSetupFee"),
      phH: L ? this.props.t("Pricing.n14Days2") : this.props.t("Pricing.whatTheSetup"),
      phH2: L ? this.props.t("Pricing.beforeYouPayAnything") : this.props.t("Pricing.paysFor"),
      phIntro: L ? this.props.t("Pricing.useEverythingForTwoWeeksIf") : this.props.t("Pricing.buildingASystemIsRealWork"),
      phases,
      phSum: L ? this.props.t("Pricing.then") + curPrice + this.props.t("Pricing.aMonthOrNothing") : this.props.t("Pricing.setupFor") + cur.name + this.props.t("Pricing.from2") + this.eur(cur.setup) + this.props.t("Pricing.once"),
      flK: L ? this.props.t("Pricing.howItWorks") : this.props.t("Pricing.howBuyingWorks"),
      flH: L ? this.props.t("Pricing.startFree2") : this.props.t("Pricing.fromFirstCall"),
      flH2: L ? this.props.t("Pricing.stayIfItHelps") : this.props.t("Pricing.toLive"),
      steps,
      flHold: () => this.setState({
        hold: true
      }),
      flRelease: () => this.setState({
        hold: false
      }),
      mkKey: 'mk' + L + s.step,
      mk: {
        n: '0' + (s.step + 1),
        url: M[2],
        mt: M[3],
        rows: M[4].map(r => ({
          l: r[0],
          v: r[1]
        })),
        btn: M[5],
        st: M[6]
      },
      cmH: L ? this.props.t("Pricing.versusADrawer") : this.props.t("Pricing.versusDoingIt"),
      cmH2: L ? this.props.t("Pricing.ofSeparateApps") : this.props.t("Pricing.theUsualWay"),
      cmIntro: L ? this.props.t("Pricing.separateAppsForMoneyCalendarHabits") : this.props.t("Pricing.anAgencyForTheWebsiteA"),
      cmUsualT: L ? this.props.t("Pricing.separateAppsOneYear") : this.props.t("Pricing.theUsualWayYearOne"),
      cmUsual: this.eur(usual),
      cmUsualW: s.sn_cm ? usual / mx * 100 + '%' : '0%',
      cmRows: CM.map((c, i) => ({
        t: c[0],
        v: this.eur(c[1]) + (c[2] ? ' · ' + c[2] : ''),
        w: c[1] / usual * 100 + '%',
        col: this.CMCOL[i]
      })),
      cmRid: this.eur(rid, L),
      cmRidW: s.sn_cm ? rid / mx * 100 + '%' : '0%',
      cmRidNote: L ? cur.priv ? this.props.t("Pricing.setupPlus12Months") : s.yearly ? this.props.t("Pricing.paidYearly2MonthsFree") : this.props.t("Pricing.n12MonthlyPayments") : this.props.t("Pricing.setupFrom") + this.eur(cur.setup) + ' + 12 × ' + this.eur(cur.mo) + this.props.t("Pricing.builtHostedMaintained"),
      tCols: 'minmax(140px,2fr) repeat(' + nC + ',minmax(0,1fr))',
      tHead: P.map((p, i) => ({
        t: p.name,
        p: priceOf(p),
        go: () => this.pick(i),
        bg: i === pi ? '#0A0A0A' : 'transparent',
        fg: i === pi ? '#F4F4F2' : '#0A0A0A'
      })),
      tGroups,
      faqs: (L ? this.FAQ_L : this.FAQ_B).map((f, k) => ({
        q: f[0],
        a: f[1],
        open: s.faq === k,
        sign: s.faq === k ? '−' : '+',
        toggle: () => this.setState({
          faq: s.faq === k ? -1 : k
        })
      })),
      ctaH: L ? this.props.t("Pricing.tryItFor") : this.props.t("Pricing.notSureWhichPlan"),
      ctaH2: L ? this.props.t("Pricing.n14DaysFree2") : this.props.t("Pricing.askMe"),
      cta1: L ? this.props.t("Pricing.startFree") : this.props.t("Pricing.bookAFreeCall"),
      cta1H: L ? this.props.signup('plus') : this.props.href("/contact"),
      cta2: L ? this.props.t("Pricing.bookACallForPrivate") : this.props.t("Pricing.seeTheWork"),
      cta2H: L ? this.props.href("/contact") : this.props.href("/work")
    };
  }
}

Logic.prototype.render = function render() {
  const v = { ...this.props, ...this.renderVals() };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: "body{margin:0;background:#ECE8E1;color:#0A0A0A;font-family:var(--font-sans);-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}a:hover{color:#FF6A00}" }} />
      <Nav active="pricing" />
      <div data-pin="hero" style={{ height: `${v.heroH ?? ''}`, position: "relative" }}>
        <div data-pinbox="1" data-screen-label="01 Hero" style={{ position: `${v.pinPos ?? ''}`, top: "0", minHeight: `${v.pinH ?? ''}`, boxSizing: "border-box", padding: `${v.heroPad ?? ''}`, maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,500px),1fr))", gap: "40px", alignItems: "center", transformOrigin: "50% 0" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
              {v.t("Pricing.home")}{" "}
              <span style={{ color: "#0A0A0A" }}>
                {v.t("Pricing.pricing")}
              </span>
            </div>
            <h1 style={{ margin: "0", fontSize: "clamp(56px,7.6vw,124px)", lineHeight: ".92", letterSpacing: "-0.055em", fontWeight: "600" }}>
              {v.t("Pricing.onePrice")}{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", letterSpacing: "-0.02em", color: "#FF6A00" }}>
                {v.t("Pricing.everyMonth")}
              </span>
            </h1>
            <p style={{ margin: "0", maxWidth: "500px", fontSize: "18px", lineHeight: "1.55", color: "#3A3731", textWrap: "pretty" }}>
              {v.heroSub}
            </p>
            <div style={{ display: "flex", gap: "4px", padding: "4px", borderRadius: "999px", background: "#DCD5CA", alignSelf: "flex-start", maxWidth: "100%", overflowX: "auto" }}>
              <button onClick={v.setBiz} style={{ border: "none", cursor: "pointer", borderRadius: "999px", padding: "12px 22px", font: "500 14px var(--font-sans)", whiteSpace: "nowrap", background: `${v.bBg ?? ''}`, color: `${v.bFg ?? ''}`, transition: "background .3s,color .3s" }}>
                {v.t("Pricing.forBusinesses")}
              </button>
              <button onClick={v.setLife} style={{ border: "none", cursor: "pointer", borderRadius: "999px", padding: "12px 22px", font: "500 14px var(--font-sans)", whiteSpace: "nowrap", background: `${v.lBg ?? ''}`, color: `${v.lFg ?? ''}`, transition: "background .3s,color .3s" }}>
                {v.t("Pricing.forYouLife")}
              </button>
            </div>
            <div key={v.curKey} style={{ display: "flex", alignItems: "baseline", gap: "6px 16px", flexWrap: "wrap", borderTop: "1px solid #C9C1B4", paddingTop: "20px", maxWidth: "520px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
                {v.curN}
              </span>
              <span style={{ fontSize: "28px", fontWeight: "600", letterSpacing: "-0.03em" }}>
                {v.curName}
              </span>
              <span style={{ fontSize: "28px", fontWeight: "600", letterSpacing: "-0.03em", color: "#FF6A00" }}>
                {v.curPrice}
              </span>
              <span style={{ width: "100%", fontSize: "15px", lineHeight: "1.5", color: "#3A3731" }}>
                {v.curFor}
              </span>
            </div>
            <span style={{ fontSize: "13px", color: "#5A5650" }}>
              {v.vatNote}
            </span>
            {v.pin ? (<>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
                <span>
                  {v.t("Pricing.scrollToAddLayers")}
                </span>
                <span style={{ position: "relative", width: "140px", height: "2px", background: "#C9C1B4", overflow: "hidden" }}>
                  <span data-hbar="1" style={{ position: "absolute", inset: "0", background: "#FF6A00", transformOrigin: "0 50%", transform: "scaleX(0)" }} />
                </span>
              </div>
            </>) : null}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
            <div onMouseMove={v.stackMove} onMouseLeave={v.stackLeave} style={{ position: "relative", width: "100%", height: "clamp(440px,44vw,580px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div data-stackrot="1" style={{ transformStyle: "preserve-3d", willChange: "transform" }}>
                <div style={{ position: "relative", width: "min(300px,62vw)", aspectRatio: "1", transformStyle: "preserve-3d", transform: `translateY(${v.stackY ?? ''}) rotateX(58deg) rotateZ(${v.rz ?? ''})`, transition: "transform .6s cubic-bezier(.16,1,.3,1)" }}>
                  {" "}
                  {(v.slabs ?? []).map((s, $index) => (<Fragment key={$index}>
                    <div onClick={s?.go} style={{ position: "absolute", inset: "0", transformStyle: "preserve-3d", transform: `translateZ(${s?.z ?? ''})`, transition: "transform .8s cubic-bezier(.16,1,.3,1)", cursor: "pointer" }}>
                      {" "}
                      <div style={{ position: "absolute", inset: "0", borderRadius: "24px", transform: "translateZ(-16px)", background: `${s?.side ?? ''}`, transition: "background .5s" }} />
                      {" "}
                      <div style={{ position: "absolute", inset: "0", borderRadius: "24px", boxSizing: "border-box", padding: "22px", display: "flex", flexDirection: "column", justifyContent: "space-between", background: `${s?.bg ?? ''}`, color: `${s?.fg ?? ''}`, border: `1.5px ${s?.bs ?? ''} ${s?.bd ?? ''}`, boxShadow: `${s?.sh ?? ''}`, transition: "background .5s,color .5s,border-color .5s,box-shadow .5s" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".75" }}>
                          {s?.n}{" · "}{s?.sub}
                        </span>
                        <span style={{ fontSize: "30px", fontWeight: "600", letterSpacing: "-0.03em", opacity: `${s?.tOp ?? ''}`, transition: "opacity .4s" }}>
                          {s?.t}
                        </span>
                      </div>
                      {" "}
                    </div>
                  </Fragment>))}
                  {" "}
                </div>
              </div>
              <div style={{ position: "absolute", left: "0", bottom: "8px", display: "flex", alignItems: "center", gap: "10px", background: "#0A0A0A", color: "#F4F4F2", borderRadius: "999px", padding: "10px 16px", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#FF6A00" }} />
                {v.t("Pricing.xXLayers", { x: v.curName, y: v.layerCount })}
              </div>
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
              {(v.planPills ?? []).map((p, $index) => (<Fragment key={$index}>
                <button onClick={p?.go} style={{ border: `1px solid ${p?.bd ?? ''}`, cursor: "pointer", borderRadius: "999px", padding: "10px 18px", font: "500 14px var(--font-sans)", whiteSpace: "nowrap", background: `${p?.bg ?? ''}`, color: `${p?.fg ?? ''}`, transition: "background .3s,color .3s" }}>
                  {p?.t}
                </button>
              </Fragment>))}
            </div>
          </div>
        </div>
      </div>
      <div data-screen-label="02 Plans" style={{ padding: "40px clamp(20px,3vw,40px) 120px", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
        {v.isLife ? (<>
          <div style={{ display: "flex", gap: "4px", padding: "4px", borderRadius: "999px", background: "#DCD5CA", alignSelf: "flex-end" }}>
            <button onClick={v.setMonthly} style={{ border: "none", cursor: "pointer", borderRadius: "999px", padding: "9px 18px", font: "500 13px var(--font-sans)", whiteSpace: "nowrap", background: `${v.mBg ?? ''}`, color: `${v.mFg ?? ''}` }}>
              {v.t("Pricing.monthly")}
            </button>
            <button onClick={v.setYearly} style={{ border: "none", cursor: "pointer", borderRadius: "999px", padding: "9px 18px", font: "500 13px var(--font-sans)", whiteSpace: "nowrap", background: `${v.yBg ?? ''}`, color: `${v.yFg ?? ''}` }}>
              {v.t("Pricing.yearly2MonthsFree")}
            </button>
          </div>
        </>) : null}
        <div data-rv="0" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,270px),1fr))", gap: "14px" }}>
          {(v.plans ?? []).map((p, $index) => (<Fragment key={$index}>
            {" "}
            <div onClick={p?.go} style={{ cursor: "pointer", borderRadius: "24px", padding: "30px", display: "flex", flexDirection: "column", gap: "24px", background: `${p?.bg ?? ''}`, color: `${p?.fg ?? ''}`, transform: `translateY(${p?.ty ?? ''})`, transition: "background .4s,color .4s,transform .5s cubic-bezier(.16,1,.3,1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
                  {p?.n}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".7" }}>
                  {p?.tag}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "28px", fontWeight: "600", letterSpacing: "-0.03em" }}>
                  {p?.name}
                </span>
                <span style={{ fontSize: "15px", lineHeight: "1.5", opacity: ".75" }}>
                  {p?.for}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "54px", fontWeight: "600", letterSpacing: "-0.05em", lineHeight: "1" }}>
                  {p?.price}
                </span>
                <span style={{ fontSize: "14px", opacity: ".7" }}>
                  {p?.unit}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".06em", color: `${p?.dayC ?? ''}` }}>
                  {v.t("Pricing.xADay", { x: p?.day })}
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
              <a href={p?.href} style={{ marginTop: "auto", textAlign: "center", borderRadius: "999px", padding: "14px 20px", fontWeight: "600", fontSize: "15px", background: `${p?.btnBg ?? ''}`, color: `${p?.btnFg ?? ''}` }} className="hv-5c2847b">
                {p?.cta}
              </a>
            </div>
            {" "}
          </Fragment>))}
        </div>
      </div>
      <div data-screen-label="02b Why" style={{ padding: "80px clamp(20px,3vw,40px) 150px", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
          {"(00) "}
          <span style={{ color: "#0A0A0A" }}>
            {v.t("Pricing.whyThisPrice")}
          </span>
        </div>
        <p data-words="1" style={{ margin: "0", maxWidth: "1240px", fontSize: "clamp(32px,4vw,64px)", lineHeight: "1.08", letterSpacing: "-0.04em", fontWeight: "500", textWrap: "pretty" }}>
          {(v.words ?? []).map((w, $index) => (<Fragment key={$index}>
            <span data-wd={w?.m} style={{ color: "#D3CCC0", transition: "color .25s" }}>
              {w?.t}
            </span>
          </Fragment>))}
        </p>
      </div>
      <div data-screen-label="03 Configurator" style={{ background: "#0B0B0C", color: "#F4F4F2" }}>
        {" "}
        <div style={{ padding: "120px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))", gap: "56px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
              {"(01) "}
              <span style={{ color: "#F4F4F2" }}>
                {v.t("Pricing.findYourPlan")}
              </span>
            </div>
            <h2 data-rv="0" style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", textWrap: "balance" }}>
              {v.cfgH}{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", color: "#FF6A00" }}>
                {v.cfgH2}
              </span>
            </h2>
            {v.isLife ? (<>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
                  {v.t("Pricing.howManyPeople")}
                </span>
                <div style={{ display: "flex", gap: "6px" }}>
                  {(v.people ?? []).map((p, $index) => (<Fragment key={$index}>
                    <button onClick={p?.go} style={{ width: "56px", height: "48px", borderRadius: "14px", border: `1px solid ${p?.bd ?? ''}`, cursor: "pointer", font: "600 16px var(--font-sans)", background: `${p?.bg ?? ''}`, color: `${p?.fg ?? ''}`, transition: "background .3s" }}>
                      {p?.t}
                    </button>
                  </Fragment>))}
                </div>
              </div>
            </>) : null}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,220px),1fr))", gap: "10px" }}>
              {(v.cOpts ?? []).map((o, $index) => (<Fragment key={$index}>
                <button onClick={o?.toggle} style={{ display: "flex", gap: "14px", alignItems: "flex-start", textAlign: "left", padding: "18px", borderRadius: "16px", border: `1px solid ${o?.bd ?? ''}`, background: `${o?.bg ?? ''}`, color: "#F4F4F2", cursor: "pointer", transition: "background .3s,border-color .3s" }}>
                  <span style={{ flexShrink: "0", width: "22px", height: "22px", borderRadius: "7px", border: `1.5px solid ${o?.cb ?? ''}`, background: `${o?.cbg ?? ''}`, color: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", transition: "background .3s" }}>
                    {o?.mark}
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ font: "600 15px var(--font-sans)" }}>
                      {o?.t}
                    </span>
                    <span style={{ font: "400 13px/1.45 var(--font-sans)", color: "#8C877E" }}>
                      {o?.d}
                    </span>
                  </span>
                </button>
              </Fragment>))}
            </div>
          </div>
          <div style={{ position: "sticky", top: "110px", borderRadius: "24px", background: "#F4F1EC", color: "#0A0A0A", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
                {v.t("Pricing.recommended")}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#FF6A00" }}>
                {v.cfgN}
              </span>
            </div>
            <span key={v.cfgKey} style={{ fontSize: "clamp(48px,5vw,76px)", fontWeight: "600", letterSpacing: "-0.05em", lineHeight: ".95" }}>
              {v.cfgName}
            </span>
            <span style={{ fontSize: "15px", lineHeight: "1.5", color: "#3A3731" }}>
              {v.cfgWhy}
            </span>
            <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #D3CCC0" }}>
              {(v.cfgRows ?? []).map((r, $index) => (<Fragment key={$index}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", padding: "14px 0", borderBottom: "1px solid #D3CCC0", fontSize: "15px" }}>
                  <span style={{ color: "#3A3731" }}>
                    {r?.l}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: "500", color: `${r?.c ?? ''}` }}>
                    {r?.v}
                  </span>
                </div>
              </Fragment>))}
            </div>
            <button onClick={v.useCfg} style={{ border: "none", cursor: "pointer", borderRadius: "999px", padding: "16px 22px", font: "600 15px var(--font-sans)", background: "#0A0A0A", color: "#F4F4F2" }} className="hv-9bccb67">
              {v.t("Pricing.showMeX", { x: v.cfgName })}
            </button>
            <span style={{ fontSize: "12px", color: "#5A5650" }}>
              {v.vatNote}
            </span>
          </div>
        </div>
      </div>
      <div data-screen-label="04 Where it goes" style={{ padding: "130px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "24px 56px", alignItems: "end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
              {"(02) "}
              <span style={{ color: "#0A0A0A" }}>
                {v.t("Pricing.whereTheMoneyGoes")}
              </span>
            </div>
            <h2 data-rv="0" style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600" }}>
              {v.t("Pricing.whereYour")}{" "}
              <span style={{ color: "#FF6A00" }}>
                {v.curPrice}
              </span>
              {" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400" }}>
                {v.t("Pricing.goes")}
              </span>
            </h2>
          </div>
          <p style={{ margin: "0", maxWidth: "520px", fontSize: "17px", lineHeight: "1.55", color: "#3A3731", textWrap: "pretty" }}>
            {v.bdIntro}
          </p>
        </div>
        <div data-seen="bd" style={{ display: "flex", height: "clamp(88px,10vw,128px)", borderRadius: "22px", overflow: "hidden", background: "#DCD5CA" }}>
          {(v.bd ?? []).map((b, $index) => (<Fragment key={$index}>
            <div style={{ width: `${b?.w ?? ''}`, background: `${b?.col ?? ''}`, color: `${b?.fg ?? ''}`, display: "flex", alignItems: "flex-end", padding: "0 0 14px 16px", boxSizing: "border-box", overflow: "hidden", transition: "width 1.1s cubic-bezier(.16,1,.3,1)" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", whiteSpace: "nowrap" }}>
                {b?.pct}{"%"}
              </span>
            </div>
          </Fragment>))}
        </div>
        <div data-rv="120" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: "12px" }}>
          {(v.bd ?? []).map((b, $index) => (<Fragment key={$index}>
            <div style={{ borderRadius: "18px", background: "#F4F1EC", padding: "22px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                <span style={{ width: "12px", height: "12px", borderRadius: "4px", background: `${b?.col ?? ''}` }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px" }}>
                  {b?.eur}
                </span>
              </div>
              <span style={{ fontSize: "17px", fontWeight: "600", letterSpacing: "-0.02em" }}>
                {b?.t}
              </span>
              <span style={{ fontSize: "14px", lineHeight: "1.5", color: "#3A3731" }}>
                {b?.d}
              </span>
            </div>
          </Fragment>))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "22px", fontWeight: "600", letterSpacing: "-0.02em" }}>
            {v.t("Pricing.thatS")}{" "}
            <span style={{ color: "#FF6A00" }}>
              {v.curDay}
            </span>
            {" "}{v.t("Pricing.aDay")}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#8C877E", border: "1px dashed #BDB6AA", borderRadius: "999px", padding: "8px 14px" }}>
            {v.t("Pricing.placeholderSplitToBeConfirmed")}
          </span>
        </div>
      </div>
      <div data-screen-label="05 Setup / Trial" style={{ background: "#E3DED5" }}>
        {" "}
        <div style={{ padding: "130px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "24px 56px", alignItems: "end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
                {"(03) "}
                <span style={{ color: "#0A0A0A" }}>
                  {v.phK}
                </span>
              </div>
              <h2 data-rv="0" style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", textWrap: "balance" }}>
                {v.phH}{" "}
                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", color: "#FF6A00" }}>
                  {v.phH2}
                </span>
              </h2>
            </div>
            <p style={{ margin: "0", maxWidth: "520px", fontSize: "17px", lineHeight: "1.55", color: "#3A3731", textWrap: "pretty" }}>
              {v.phIntro}
            </p>
          </div>
          <div data-seen="ph" data-rv="0" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,190px),1fr))", gap: "12px" }}>
            {(v.phases ?? []).map((p, $index) => (<Fragment key={$index}>
              <button onClick={p?.go} style={{ textAlign: "left", cursor: "pointer", border: "none", borderRadius: "22px", padding: "24px", minHeight: "300px", display: "flex", flexDirection: "column", gap: "14px", background: `${p?.bg ?? ''}`, color: `${p?.fg ?? ''}`, transform: `translateY(${p?.ty ?? ''})`, transition: "background .4s,color .4s,transform .5s cubic-bezier(.16,1,.3,1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
                    {p?.n}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase", opacity: ".65" }}>
                    {p?.when}
                  </span>
                </div>
                <span style={{ font: "600 22px var(--font-sans)", letterSpacing: "-0.02em" }}>
                  {p?.t}
                </span>
                <span style={{ font: "400 14px/1.5 var(--font-sans)", opacity: ".8" }}>
                  {p?.d}
                </span>
                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "20px", fontWeight: "500" }}>
                    {p?.amt}
                  </span>
                  <span style={{ height: "4px", borderRadius: "2px", background: `${p?.track ?? ''}`, overflow: "hidden", display: "flex" }}>
                    <span style={{ width: `${p?.w ?? ''}`, background: "#FF6A00", transition: "width 1s cubic-bezier(.16,1,.3,1)" }} />
                  </span>
                </div>
              </button>
            </Fragment>))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "22px", fontWeight: "600", letterSpacing: "-0.02em" }}>
              {v.phSum}
            </span>
            {v.isBizPh ? (<>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#8C877E", border: "1px dashed #BDB6AA", borderRadius: "999px", padding: "8px 14px" }}>
                {v.t("Pricing.splitAndTimingArePlaceholdersTo")}
              </span>
            </>) : null}
          </div>
        </div>
      </div>
      <div data-pin="flow" data-screen-label="06 Flow" style={{ background: "#0B0B0C", color: "#F4F4F2", height: `${v.flowH ?? ''}`, position: "relative" }}>
        {" "}
        <div data-pinbox="1" style={{ position: `${v.pinPos ?? ''}`, top: "0", minHeight: `${v.pinH ?? ''}`, boxSizing: "border-box", padding: `${v.flowPad ?? ''}`, maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))", gap: "56px", alignItems: "center", transformOrigin: "50% 0" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
              {"(04) "}
              <span style={{ color: "#F4F4F2" }}>
                {v.flK}
              </span>
            </div>
            <h2 data-rv="0" style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", textWrap: "balance" }}>
              {v.flH}{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", color: "#FF6A00" }}>
                {v.flH2}
              </span>
            </h2>
            <div onMouseEnter={v.flHold} onMouseLeave={v.flRelease} style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #2A2A2C" }}>
              {(v.steps ?? []).map((g, $index) => (<Fragment key={$index}>
                <button onClick={g?.go} style={{ position: "relative", display: "grid", gridTemplateColumns: "44px minmax(0,1fr)", gap: "12px", padding: "16px 0", border: "none", borderBottom: "1px solid #2A2A2C", background: "none", cursor: "pointer", textAlign: "left", color: `${g?.fg ?? ''}`, transition: "color .3s" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", paddingTop: "3px", color: `${g?.nc ?? ''}` }}>
                    {g?.n}
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ font: "600 18px var(--font-sans)" }}>
                      {g?.t}
                    </span>
                    {g?.on ? (<>
                      <span style={{ font: "400 15px/1.5 var(--font-sans)", color: "#B8B3AA", maxWidth: "440px" }}>
                        {g?.d}
                      </span>
                    </>) : null}
                  </span>
                  <span data-fl="1" style={{ position: "absolute", left: "0", bottom: "-1px", height: "1px", width: `${g?.w ?? ''}`, background: "#FF6A00" }} />
                </button>
              </Fragment>))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", perspective: "1400px" }}>
            <div key={v.mkKey} style={{ width: "100%", maxWidth: "520px", borderRadius: "22px", overflow: "hidden", background: "#141416", border: "1px solid #2A2A2C", boxShadow: "0 60px 120px -40px rgba(255,106,0,.35)", transform: "rotateY(-8deg) rotateX(4deg)" }}>
              {" "}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "12px 16px", background: "#1C1C1E" }}>
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#3A3A3C" }} />
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#3A3A3C" }} />
                <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#3A3A3C" }} />
                <span style={{ marginLeft: "10px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "#8C877E" }}>
                  {v.mk?.url}
                </span>
              </div>
              {" "}
              <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
                    {v.t("Pricing.stepX", { x: v.mk?.n })}
                  </span>
                  <span style={{ background: "#FF6A00", color: "#0A0A0A", borderRadius: "999px", padding: "6px 12px", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".06em", textTransform: "uppercase" }}>
                    {v.mk?.st}
                  </span>
                </div>
                <span style={{ fontSize: "clamp(28px,3vw,40px)", fontWeight: "600", letterSpacing: "-0.04em", lineHeight: "1.05" }}>
                  {v.mk?.mt}
                </span>
                <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #2A2A2C" }}>
                  {(v.mk?.rows ?? []).map((r, $index) => (<Fragment key={$index}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", padding: "14px 0", borderBottom: "1px solid #2A2A2C", fontSize: "15px" }}>
                      <span style={{ color: "#8C877E" }}>
                        {r?.l}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", color: "#F4F4F2", textAlign: "right" }}>
                        {r?.v}
                      </span>
                    </div>
                  </Fragment>))}
                </div>
                <span style={{ alignSelf: "flex-start", background: "#F4F4F2", color: "#0A0A0A", borderRadius: "999px", padding: "13px 22px", fontWeight: "600", fontSize: "14px" }}>
                  {v.mk?.btn}
                </span>
              </div>
              {" "}
            </div>
          </div>
        </div>
      </div>
      <div data-screen-label="07 Compare" style={{ padding: "130px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "44px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "24px 56px", alignItems: "end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
              {"(05) "}
              <span style={{ color: "#0A0A0A" }}>
                {v.t("Pricing.yearOneCompared")}
              </span>
            </div>
            <h2 data-rv="0" style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", textWrap: "balance" }}>
              {v.cmH}{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", color: "#FF6A00" }}>
                {v.cmH2}
              </span>
            </h2>
          </div>
          <p style={{ margin: "0", maxWidth: "520px", fontSize: "17px", lineHeight: "1.55", color: "#3A3731", textWrap: "pretty" }}>
            {v.cmIntro}
          </p>
        </div>
        <div data-seen="cm" data-rv="0" style={{ display: "flex", flexDirection: "column", gap: "28px", background: "#F4F1EC", borderRadius: "28px", padding: "clamp(24px,3vw,44px)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "baseline" }}>
              <span style={{ fontSize: "18px", fontWeight: "600" }}>
                {v.cmUsualT}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "18px", color: "#5A5650" }}>
                {v.cmUsual}
              </span>
            </div>
            <div style={{ display: "flex", height: "56px", borderRadius: "14px", overflow: "hidden", background: "#E3DED5", width: `${v.cmUsualW ?? ''}`, transition: "width 1.1s cubic-bezier(.16,1,.3,1)" }}>
              {(v.cmRows ?? []).map((c, $index) => (<Fragment key={$index}>
                <span style={{ width: `${c?.w ?? ''}`, background: `${c?.col ?? ''}`, borderRight: "2px solid #F4F1EC" }} />
              </Fragment>))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "baseline" }}>
              <span style={{ fontSize: "18px", fontWeight: "600" }}>
                {v.t("Pricing.rIDEFFX", { x: v.curName })}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "18px", color: "#FF6A00" }}>
                {v.cmRid}
              </span>
            </div>
            <div style={{ height: "56px", borderRadius: "14px", background: "#FF6A00", width: `${v.cmRidW ?? ''}`, transition: "width 1.1s cubic-bezier(.16,1,.3,1)" }} />
            <span style={{ fontSize: "13px", color: "#5A5650" }}>
              {v.cmRidNote}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,230px),1fr))", gap: "10px", borderTop: "1px solid #D3CCC0", paddingTop: "24px" }}>
            {(v.cmRows ?? []).map((c, $index) => (<Fragment key={$index}>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ flexShrink: "0", marginTop: "5px", width: "12px", height: "12px", borderRadius: "4px", background: `${c?.col ?? ''}` }} />
                <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "15px" }}>
                    {c?.t}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "#5A5650" }}>
                    {c?.v}
                  </span>
                </span>
              </div>
            </Fragment>))}
          </div>
          <span style={{ alignSelf: "flex-start", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#8C877E", border: "1px dashed #BDB6AA", borderRadius: "999px", padding: "8px 14px" }}>
            {v.t("Pricing.usualWayFiguresArePlaceholdersTo")}
          </span>
        </div>
      </div>
      <div data-screen-label="08 Every detail" style={{ background: "#E3DED5" }}>
        {" "}
        <div style={{ padding: "130px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "40px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
              {"(06) "}
              <span style={{ color: "#0A0A0A" }}>
                {v.t("Pricing.everyDetail")}
              </span>
            </div>
            <h2 data-rv="0" style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600" }}>
              {v.t("Pricing.whatSIn")}{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", color: "#FF6A00" }}>
                {v.t("Pricing.eachPlan")}
              </span>
            </h2>
          </div>
          <div data-rv="0" style={{ overflowX: "auto", borderRadius: "24px", background: "#F4F1EC" }}>
            {" "}
            <div className="pt-table" style={{ minWidth: "600px", display: "flex", flexDirection: "column", padding: "8px 28px 28px" }}>
              <div style={{ position: "sticky", top: "0", display: "grid", gridTemplateColumns: `${v.tCols ?? ''}`, gap: "8px", padding: "20px 0", borderBottom: "1px solid #0A0A0A", background: "#F4F1EC" }}>
                <span style={{ position: "sticky", left: "0", alignSelf: "stretch", margin: "0 0 0 -28px", background: "#F4F1EC" }} />
                {(v.tHead ?? []).map((h, $index) => (<Fragment key={$index}>
                  <button onClick={h?.go} style={{ border: "none", cursor: "pointer", borderRadius: "14px", padding: "12px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", background: `${h?.bg ?? ''}`, color: `${h?.fg ?? ''}`, transition: "background .3s" }}>
                    <span style={{ font: "600 16px var(--font-sans)" }}>
                      {h?.t}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", opacity: ".75" }}>
                      {h?.p}
                    </span>
                  </button>
                </Fragment>))}
              </div>
              {(v.tGroups ?? []).map((g, $index) => (<Fragment key={$index}>
                {" "}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "sticky", left: "0", alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "12px", margin: "0 0 0 -28px", padding: "28px 0 10px 28px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#FF6A00" }}>
                      {g?.t}
                    </span>
                    {g?.ph ? (<>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".06em", textTransform: "uppercase", color: "#8C877E", border: "1px dashed #BDB6AA", borderRadius: "999px", padding: "4px 10px" }}>
                        {v.t("Pricing.proposedToBeConfirmed")}
                      </span>
                    </>) : null}
                  </div>
                  {(g?.rows ?? []).map((r, $index) => (<Fragment key={$index}>
                    <div style={{ display: "grid", gridTemplateColumns: `${v.tCols ?? ''}`, gap: "8px", alignItems: "center", borderBottom: "1px solid #DCD5CA" }}>
                      <span className="pt-label" style={{ position: "sticky", left: "0", zIndex: "1", alignSelf: "stretch", display: "flex", alignItems: "center", fontSize: "15px", margin: "0 0 0 -28px", padding: "14px 8px 14px 28px", background: "#F4F1EC" }}>
                        {r?.t}
                      </span>
                      {(r?.cells ?? []).map((c, $index) => (<Fragment key={$index}>
                        <span style={{ textAlign: "center", padding: "14px 6px", fontFamily: "var(--font-mono)", fontSize: "13px", color: `${c?.fg ?? ''}`, background: `${c?.bg ?? ''}`, transition: "background .3s" }}>
                          {c?.v}
                        </span>
                      </Fragment>))}
                    </div>
                  </Fragment>))}
                </div>
                {" "}
              </Fragment>))}
            </div>
            {" "}
          </div>
        </div>
      </div>
      <div data-screen-label="09 FAQ" style={{ padding: "130px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "56px", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", position: "sticky", top: "110px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5A5650" }}>
            {"(07) "}
            <span style={{ color: "#0A0A0A" }}>
              {v.t("Pricing.questions")}
            </span>
          </div>
          <h2 data-rv="0" style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: "1", letterSpacing: "-0.045em", fontWeight: "600" }}>
            {v.t("Pricing.the")}{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", color: "#FF6A00" }}>
              {v.t("Pricing.smallPrint")}
            </span>
            {" "}{v.t("Pricing.inPlainWords")}
          </h2>
        </div>
        <div data-rv="0" style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #D3CCC0" }}>
          {(v.faqs ?? []).map((f, $index) => (<Fragment key={$index}>
            {" "}
            <div style={{ borderBottom: "1px solid #D3CCC0" }}>
              {" "}
              <button onClick={f?.toggle} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", padding: "22px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", font: "500 19px var(--font-sans)", color: "#0A0A0A" }}>
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
      <div data-screen-label="10 CTA" style={{ background: "#FF6A00", color: "#0A0A0A" }}>
        {" "}
        <div style={{ padding: "120px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px" }}>
          <h2 data-rv="0" style={{ margin: "0", fontSize: "clamp(44px,6vw,96px)", lineHeight: ".95", letterSpacing: "-0.055em", fontWeight: "600", maxWidth: "1000px", textWrap: "balance" }}>
            {v.ctaH}{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400" }}>
              {v.ctaH2}
            </span>
          </h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a href={v.cta1H} style={{ background: "#0A0A0A", color: "#F4F4F2", borderRadius: "999px", padding: "17px 28px", fontWeight: "600", fontSize: "15px" }} className="hv-b65372f">
              {v.cta1}
            </a>
            <a href={v.cta2H} style={{ border: "1.5px solid #0A0A0A", borderRadius: "999px", padding: "17px 28px", fontWeight: "500", fontSize: "15px" }} className="hv-77a5803">
              {v.cta2}
            </a>
          </div>
        </div>
      </div>
      <Footer  />
    </>
  );
};

export default function PricingPage(props) {
  const dc = useDC();
  return <Logic key={dc.locale} {...dc} {...props} />;
}
