// @ts-nocheck -- ported 1:1 from rideff_handoff/design/RIDEFF Life.dc.html (see scripts/dc-port/convert.mjs)
'use client';
import React, { Fragment } from 'react';
import { DCLogic, dcStyle, opt, press, useDC } from '@/lib/dc';
import Nav from '@/components/dc/Nav';
import Footer from '@/components/dc/Footer';
import { eur } from '@/lib/format';

class Logic extends DCLogic {
  state = {
    hp: 0,
    dp: 0,
    tp: 0,
    vp: 0,
    pin: false,
    yearly: false,
    flip: -1,
    who: 0,
    ppl: 1
  };
  heroRef = React.createRef();
  dayRef = React.createRef();
  togRef = React.createRef();
  vaultRef = React.createRef();
  MOM = [[6.5, this.props.t("Life.briefing"), this.props.t("Life.goodMorning"), this.props.t("Life.oneReadThenGoYourDay"), [[this.props.t("Life.weather"), this.props.t("Life.n14Sunny")], [this.props.t("Life.today"), this.props.t("Life.n2Meetings")], [this.props.t("Life.money"), this.props.t("Life.n340Left")]], this.props.t("Life.yourBriefingIsReady")], [9, this.props.t("Life.money"), this.props.t("Life.rentDueFriday"), this.props.t("Life.billsShowUpBeforeTheyBecome"), [[this.props.t("Life.rent"), this.props.t("Life.n890Fri")], [this.props.t("Life.electricity"), this.props.t("Life.n86Paid")], [this.props.t("Life.thisWeek"), this.props.t("Life.n340Left")]], this.props.t("Life.rentTransferPrepared")], [12.6, this.props.t("Life.time"), this.props.t("Life.dentistMoved"), this.props.t("Life.whenAPlanChangesLifeRearranges"), [[this.props.t("Life.dentist"), this.props.t("Life.nowThu")], [this.props.t("Life.gym"), this.props.t("Life.gymMoved")], [this.props.t("Life.free"), '14:00 – 16:00']], this.props.t("Life.calendarUpdatedForYou")], [16, this.props.t("Life.together"), this.props.t("Life.pickUpMia"), this.props.t("Life.familyThingsLandOnTheRight"), [[this.props.t("Life.leaveIn"), this.props.t("Life.n10Min")], [this.props.t("Life.drive"), this.props.t("Life.n12Min")], ['Anna', this.props.t("Life.getsMilkOnTheWay")]], this.props.t("Life.leaveIn10Min")], [21.2, this.props.t("Life.evening"), this.props.t("Life.closeTheDay"), this.props.t("Life.whatWentWellWhatMovesTo"), [[this.props.t("Life.done"), this.props.t("Life.n6Things")], [this.props.t("Life.moved"), this.props.t("Life.n2ToTomorrow")], [this.props.t("Life.goal"), this.props.t("Life.run3Of4")]], this.props.t("Life.dayClosedSleepWell")]];
  FOUR = [[this.props.t("Life.money"), this.props.t("Life.knowWhatIsLeftWithoutA"), '#EA580C', '#FFF7ED', [[this.props.t("Life.n340LeftThisWeek"), this.props.t("Life.onTrack")], [this.props.t("Life.rent890"), this.props.t("Life.transferReadyForFri")], [this.props.t("Life.subscriptions"), this.props.t("Life.n2YouNeverUse")]]], [this.props.t("Life.time"), this.props.t("Life.yourCalendarRearrangedWhenLifeHappens"), '#2B1311', '#FFEDD8', [[this.props.t("Life.freeSlot"), this.props.t("Life.protectedForFocus")], [this.props.t("Life.dentistMoved2"), this.props.t("Life.nowThu")], [this.props.t("Life.evening"), this.props.t("Life.nothingPlannedGood")]]], [this.props.t("Life.goals"), this.props.t("Life.smallStepsNoticedAndCounted"), '#F6D9BC', '#2B1311', [[this.props.t("Life.run5Km"), this.props.t("Life.n3Of4ThisWeek")], [this.props.t("Life.saveForMayTrip"), this.props.t("Life.n620Of900")], [this.props.t("Life.read"), this.props.t("Life.n12Of20Pages")]]], [this.props.t("Life.home2"), this.props.t("Life.sharedListsSharedBillsSharedDays"), '#FFFBF5', '#2B1311', [[this.props.t("Life.shoppingList"), this.props.t("Life.n7ItemsAnnaAdded2")], [this.props.t("Life.billsSplit"), this.props.t("Life.electricity5050")], [this.props.t("Life.saturday"), this.props.t("Life.familyBreakfast")]]]];
  PEOPLE = [['R', this.props.t("Life.you"), this.props.t("Life.ownerSeesEverything"), '#F6D9BC', [[this.props.t("Life.briefing"), '07:00'], [this.props.t("Life.bills"), this.props.t("Life.n2ThisWeek")], [this.props.t("Life.familyPlan"), this.props.t("Life.allSynced")]]], ['A', 'Anna', this.props.t("Life.partnerSharedPrivate"), '#FFD2B0', [[this.props.t("Life.shoppingList"), this.props.t("Life.milkBread")], [this.props.t("Life.splitBill"), this.props.t("Life.n43ToYou")], [this.props.t("Life.dinner"), this.props.t("Life.friWithFriends")]]], ['M', 'Mia', this.props.t("Life.kidJustHerDay"), '#CFE6D6', [[this.props.t("Life.school"), 'ends 15:45'], [this.props.t("Life.piano"), 'Wed 17:00'], [this.props.t("Life.pickUp"), 'Dad · 16:00']]], ['L', 'Leo', this.props.t("Life.kidJustHisDay"), '#D6DEF2', [[this.props.t("Life.football"), 'Sat 10:00'], [this.props.t("Life.homework"), this.props.t("Life.mathSheet")], [this.props.t("Life.allowance"), this.props.t("Life.n5Saved")]]]];
  LM = [{
    n: this.props.t("Life.morning"),
    h: '06–10',
    a: 7,
    b: 9.5,
    img: opt("/images/rialto-life-morning.jpg"),
    pos: '50% 8%',
    alt: this.props.t("Life.rialtoWithCoffeeInTheMorning"),
    temp: '12°',
    line: this.props.t("Life.beforeTheCoffeeCools"),
    chip: ['€', eur(340, this.props.locale), this.props.t("Life.leftThisWeek")],
    feed: [['06:30', this.props.t("Life.briefingReady30Sec")], ['07:00', this.props.t("Life.rentPaid820")], ['07:15', this.props.t("Life.umbrellaRainAt4")]]
  }, {
    n: this.props.t("Life.day"),
    h: '10–18',
    a: 12,
    b: 16,
    img: opt("/images/rialto-about-v3.jpg"),
    pos: '50% 30%',
    alt: this.props.t("Life.rialtoOutInTheOldTown"),
    temp: '19°',
    line: this.props.t("Life.whileYouAreOut"),
    chip: ['♥', this.props.t("Life.sat"), this.props.t("Life.mumSGiftOnItsWay")],
    feed: [['11:20', this.props.t("Life.dentistMovedThu")], ['13:05', this.props.t("Life.oldGymCancelled39")], ['15:40', this.props.t("Life.linaSSchoolFormSigned")]]
  }, {
    n: this.props.t("Life.evening"),
    h: '18–23',
    a: 19,
    b: 22,
    img: opt("/images/rialto-life-evening.jpg"),
    pos: '70% 40%',
    alt: this.props.t("Life.rialtoRelaxingOnTheSofaIn"),
    temp: '14°',
    line: this.props.t("Life.andThenNothing"),
    chip: ['◷', '3 h', this.props.t("Life.freeTonight")],
    feed: [['18:30', this.props.t("Life.groceriesDelivered")], ['20:00', this.props.t("Life.tomorrowSorted2Meetings")], ['21:00', this.props.t("Life.nothingElseRest")]]
  }];
  // The top face turns its label 180° so it reads upright from the hero's viewing angle.
  cf(z, L) {
    return ['rotateY(0deg)', 'rotateY(90deg)', 'rotateY(180deg)', 'rotateY(-90deg)', 'rotateX(90deg) rotateZ(180deg)', 'rotateX(-90deg)'].map((r, i) => ({
      tf: r + ' translateZ(' + z + 'px)',
      l: L ? L[i] : ''
    }));
  }
  CAP = [['01', this.props.t("Life.remembered"), this.props.t("Life.billsBirthdaysAppointmentsHeldInOne")], ['02', this.props.t("Life.sorted"), this.props.t("Life.moneyTimeFamilyAndGoalsKeep")], ['03', this.props.t("Life.lived"), this.props.t("Life.theTechStepsBackWhatS")]];
  heroVals() {
    const s = this.state || {},
      m = s.lm ?? 0,
      p = s.lp ?? 0,
      M = this.LM[m];
    const hr = M.a + (M.b - M.a) * p,
      hh = Math.floor(hr),
      mi = Math.floor((hr - hh) * 60);
    const go = k => this.setState({
      lm: (k + 3) % 3,
      lp: 0
    });
    return {
      hWide: s.nw ? 'none' : 'flex',
      hChipR: s.nw ? '22px' : '110px',
      lmKey: 'm' + m,
      lmName: M.n,
      lmTemp: M.temp,
      lmClock: String(hh).padStart(2, '0') + ':' + String(mi).padStart(2, '0'),
      lmDeg: Math.round((hr - 6) / 17 * 360) + 'deg',
      lmFeed: M.feed.map(([t, d], k) => ({
        t,
        d,
        k: m + '-' + k,
        dl: 0.35 + k * 0.4 + 's'
      })),
      lmChipI: M.chip[0],
      lmChipB: M.chip[1],
      lmChipS: M.chip[2],
      lmCount: String(3 * m + Math.min(3, Math.floor(p * 5))) + this.props.t("Life.handled"),
      s17m: m === 0 ? 1 : 0,
      s17d: m === 1 ? 1 : 0,
      s17e: m === 2 ? 1 : 0,
      s17eImg: this.LM[2].img,
      s17eTf: m === 2 ? 'scale(1.06)' : 'scale(1)',
      cubeFaces: this.cf(85, [this.props.t("Life.bills"), this.props.t("Life.rent"), this.props.t("Life.birthdays"), this.props.t("Life.dentist"), this.props.t("Life.goals"), this.props.t("Life.mum")]),
      cubeFacesS: this.cf(35),
      cubeFacesXS: this.cf(27),
      capK: 'cap' + m,
      capN: this.CAP[m][0],
      capT: this.CAP[m][1],
      capL: this.CAP[m][2],
      orbRings: [{
        sz: '330px',
        o: '-165px',
        tf: 'rotateX(72deg)',
        dur: '8s',
        c: '#FA8229',
        l: this.props.t("Life.money")
      }, {
        sz: '430px',
        o: '-215px',
        tf: 'rotateX(72deg) rotateY(-14deg)',
        dur: '11s',
        c: '#170A08',
        l: this.props.t("Life.time")
      }, {
        sz: '530px',
        o: '-265px',
        tf: 'rotateX(72deg) rotateY(12deg)',
        dur: '14s',
        c: '#4F86C2',
        l: this.props.t("Life.family")
      }, {
        sz: '630px',
        o: '-315px',
        tf: 'rotateX(72deg) rotateY(-6deg)',
        dur: '18s',
        c: '#B65234',
        l: this.props.t("Life.goals")
      }],
      lmTabs17: this.LM.map((x, k) => ({
        n: x.n,
        h: x.h,
        go: () => go(k),
        sw: k === 2 ? 'url("' + x.img + '")' : ['radial-gradient(circle at 50% 70%,#FFFBF2 0%,#FDBA74 45%,#F97316 100%)', 'radial-gradient(circle at 40% 40%,#FA8229 0 28%,#DCEBF4 30%,#9EC6E2 100%)'][k],
        bg: k === m ? '#170A08' : '#FFFBF5',
        fg: k === m ? '#FFEDD8' : '#170A08',
        bd: k === m ? '#170A08' : '#E4D3C0',
        w: k === m ? (p * 100).toFixed(1) + '%' : '0%'
      }))
    };
  }
  onScroll = () => {
    const vh = innerHeight,
      cl = v => Math.max(0, Math.min(1, +v || 0)),
      st = this.state || {},
      n = {};
    const prog = el => {
      if (!el) return 1;
      const r = el.getBoundingClientRect();
      return st.pin ? cl(-r.top / Math.max(1, r.height - vh)) : 1;
    };
    n.hp = st.pin ? prog(this.heroRef.current) : 1;
    n.dp = prog(this.dayRef.current);
    const t = this.togRef.current;
    if (t) n.tp = cl((vh * .85 - t.getBoundingClientRect().top) / (vh * .6));
    const v = this.vaultRef.current;
    if (v) n.vp = cl((vh * .85 - v.getBoundingClientRect().top) / (vh * .9));
    if (Object.keys(n).some(k => Math.abs(n[k] - (st[k] || 0)) > .004)) this.setState(n);
  };
  calcPin = () => {
    let rm = false;
    try {
      rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {}
    const pin = !rm && innerWidth >= 1000 && innerHeight >= 640,
      nw = innerWidth < 1000;
    if (nw !== !!(this.state || {}).nw) this.setState({
      nw
    });
    if (pin !== !!(this.state || {}).pin) this.setState({
      pin
    }, this.onScroll);
  };
  componentDidMount() {
    this.setState({ today: new Date() });
    this.alive = true;
    this.calcPin();
    window.addEventListener('resize', this.calcPin);
    window.addEventListener('scroll', this.onScroll, {
      passive: true
    });
    let last = 0;
    const loop = now => {
      if (!this.alive) return;
      this.raf = requestAnimationFrame(loop);
      if (now - last > 90) {
        last = now;
        this.onScroll();
      }
    };
    this.raf = requestAnimationFrame(loop);
    this.kv = setInterval(() => this.setState(s => {
      const lp = (s.lp ?? 0) + 0.014;
      return lp >= 1 ? {
        lp: 0,
        lm: ((s.lm ?? 0) + 1) % 3
      } : {
        lp
      };
    }), 100);
    this.gt = setInterval(() => this.setState(s => ({
      g: ((s.g || 0) + 1) % 100
    })), 2400);
    this.at = setInterval(() => {
      const s = this.state || {};
      if (!s.pin && !this.lockStep) this.setState({
        ms: ((s.ms || 0) + 1) % 5
      });
    }, 3200);
  }
  componentWillUnmount() {
    this.alive = false;
    cancelAnimationFrame(this.raf);
    clearInterval(this.gt);
    clearInterval(this.kv);
    clearInterval(this.at);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.calcPin);
  }
  renderVals() {
    const s = {
        hp: 0,
        dp: 0,
        tp: 0,
        vp: 0,
        ppl: 1,
        who: 0,
        flip: -1,
        ...(this.state || {})
      },
      E = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
      cl = v => Math.max(0, Math.min(1, +v || 0));
    const mix = (a, b, t) => 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',') + ')';
    const h = E(cl(s.hp * 1.15)),
      fg = h > .55;
    const hm = 5.5 + h * 1.5,
      hc = String(Math.floor(hm)).padStart(2, '0') + ':' + String(Math.floor(hm % 1 * 60)).padStart(2, '0');
    const dpe = s.pin ? s.dp : ([6.5, 9, 12.6, 16, 21.2][s.ms || 0] - 6) / 16,
      dh = 6 + dpe * 16,
      step = Math.max(0, this.MOM.findLastIndex ? this.MOM.findLastIndex(m => dh >= m[0] - .4) : this.MOM.reduce((a, m, i) => dh >= m[0] - .4 ? i : a, 0)),
      M = this.MOM[step];
    const ang = Math.PI * (1 - dpe),
      dark = dh > 19.5;
    const y = !!s.yearly,
      fmt = v => eur(v, this.props.locale, true);
    const P = [[this.props.t("Life.life"), this.props.t("Life.justYouTheEssentials"), 12.9, ''], ['Life Plus', this.props.t("Life.everythingForOnePerson"), 19.9, this.props.t("Life.mostChosen")], [this.props.t("Life.together"), this.props.t("Life.sharedForUpTo4People"), 29.9, '']];
    const fit = s.ppl > 1 ? 2 : 1;
    const v = E(cl(s.vp)),
      tp = E(cl(s.tp));
    const g = s.g || 0,
      goal = 55 + g % 4 * 10;
    return {
      ...this.heroVals(),
      heroRef: this.heroRef,
      dayRef: this.dayRef,
      togRef: this.togRef,
      vaultRef: this.vaultRef,
      hH: s.pin ? '220vh' : 'auto',
      dH: s.pin ? '360vh' : 'auto',
      hPos: s.pin ? 'sticky' : 'relative',
      hInner: s.pin ? '100vh' : 'auto',
      hBg: mix([46, 32, 38], [251, 244, 236], h),
      hFg: fg ? '#2B1311' : '#FFEDD8',
      hGlow: 'rgba(255,170,100,' + (.15 + h * .35).toFixed(2) + ')',
      hLine: fg ? 'rgba(43,19,17,.12)' : 'rgba(255,237,216,.15)',
      hHorizon: '82%',
      sunTop: (96 - h * 64).toFixed(1) + '%',
      sunOp: (.5 + h * .5).toFixed(2),
      photoOp: (.35 + h * .65).toFixed(2),
      photoY: ((1 - h) * 40).toFixed(1) + 'px',
      hClock: hc,
      // Weekday of the visitor, set after mount so the static HTML stays stable.
      day: s.today ? s.today.toLocaleDateString(this.props.locale === 'de' ? 'de-DE' : 'en-GB', {
        weekday: 'long'
      }) : '',
      brief: [[this.props.t("Life.weather"), this.props.t("Life.n14SunnyByNoon")], [this.props.t("Life.today"), this.props.t("Life.n2MeetingsFreeEvening")], [this.props.t("Life.money"), this.props.t("Life.n340LeftThisWeek")], [this.props.t("Life.focus"), this.props.t("Life.finishTheTaxFolder")]].map((b, k) => {
        const on = h > .2 + k * .17;
        return {
          k: b[0],
          v: b[1],
          op: on ? 1 : 0,
          tf: on ? 'none' : 'translateY(8px)'
        };
      }),
      dClock: String(Math.floor(dh)).padStart(2, '0') + ':' + String(Math.floor(dh % 1 * 60)).padStart(2, '0'),
      dStep: step,
      dTag: M[1],
      dHead: M[2],
      dBody: M[3],
      dRows: M[4].map(r => ({
        k: r[0],
        v: r[1]
      })),
      dNote: M[5],
      dLast: step ? this.MOM[step - 1][5] : '',
      // The day's list inside the phone: done items show what Life did, later ones only their area.
      dAgenda: this.MOM.map((m, k) => {
        const done = k < step,
          on = k === step;
        return {
          t: (m => String(Math.floor(m[0])).padStart(2, '0') + ':' + String(Math.round(m[0] % 1 * 60)).padStart(2, '0'))(m),
          l: done || on ? m[5] : m[1],
          mark: done ? '✓' : '',
          fw: on ? '600' : '400',
          op: done ? '.62' : on ? '1' : '.5',
          dotBg: on ? '#F97316' : done ? (dark ? '#4A2622' : '#FFE4C7') : 'transparent',
          dotBd: on ? '#F97316' : done ? 'transparent' : dark ? '#5E3A31' : '#D3B9A0',
          dotFg: dark ? '#FDBA74' : '#7F1D1D'
        };
      }),
      dTabs: [[this.props.t("Life.today"), 'M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z'], [this.props.t("Life.money"), 'M3 7h18v11H3zM3 11h18M7 15h3'], [this.props.t("Life.time"), 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2'], [this.props.t("Life.goals"), 'M5 21V4M5 5h11l-2 3.5 2 3.5H5']].map((tb, k) => ({
        t: tb[0],
        d: tb[1],
        fg: k === [0, 1, 2, 0, 0][step] ? '#F97316' : dark ? 'rgba(255,237,216,.5)' : 'rgba(43,19,17,.45)'
      })),
      phW: s.pin ? 'clamp(210px,min(60vw,34vh),300px)' : 'clamp(230px,66vw,300px)',
      // How far the floating cards hang over the phone's edge; less on phones, where the column is narrow.
      phNoteR: s.pin ? '-34%' : '-15%',
      phNoteL: s.pin ? '-24%' : '-14%',
      sunX: (50 + Math.cos(ang) * 50).toFixed(1) + '%',
      sunY: (100 - Math.sin(ang) * 100).toFixed(1) + '%',
      sunC: dark ? '#C98A5A' : '#FDBA74',
      phRot: (-9 + dpe * 18).toFixed(1) + 'deg',
      dChips: this.MOM.map((m, k) => {
        const on = k === step;
        return {
          t: String(Math.floor(m[0])).padStart(2, '0') + ':' + String(Math.round(m[0] % 1 * 60)).padStart(2, '0'),
          bg: on ? '#2B1311' : 'transparent',
          fg: on ? '#FFF7ED' : '#5E3A31',
          bd: on ? '#2B1311' : '#D9C7B3',
          go: () => {
            this.lockStep = true;
            const st = this.state || {};
            if (st.pin) {
              const el = this.dayRef.current;
              if (el) {
                const top = el.getBoundingClientRect().top + scrollY + (m[0] - 6) / 16 * (el.offsetHeight - innerHeight);
                if (window.__lenis) window.__lenis.scrollTo(top, {
                  duration: 1.2
                });else scrollTo({
                  top,
                  behavior: 'smooth'
                });
              }
            } else this.setState({
              ms: k
            });
          }
        };
      }),
      scrBg: dark ? '#1C0C0D' : '#FFF7ED',
      scrFg: dark ? '#FFEDD8' : '#17090A',
      scrCard: dark ? '#2E1517' : '#FFE4C7',
      scrFeatBg: dark ? '#7F1D1D' : step === 0 ? '#F97316' : '#17090A',
      scrFeatFg: dark || step ? '#FFF7ED' : '#17090A',
      scrTag: dark ? '#FDBA74' : '#C2410C',
      scrLine: dark ? 'rgba(255,237,216,.1)' : 'rgba(127,29,29,.1)',
      scrBar: dark ? 'rgba(28,12,13,.9)' : 'rgba(255,247,237,.9)',
      scrGlow: dark ? '0' : step < 2 ? '.85' : '.35',
      four: this.FOUR.map((c, k) => ({
        n: '0' + (k + 1),
        t: c[0],
        d: c[1],
        bg: c[2],
        fg: c[3],
        back: c[4].map(r => ({
          a: r[0],
          b: r[1]
        })),
        isMoney: k === 0,
        isTime: k === 1,
        isGoal: k === 2,
        isHome: k === 3,
        flip: s.flip === k ? 'rotateY(180deg)' : 'rotateY(0deg)',
        over: () => this.setState({
          flip: k
        }),
        out: () => this.setState({
          flip: -1
        }),
        tap: () => this.setState(x => ({
          flip: x.flip === k ? -1 : k
        }))
      })),
      bars: [60, 85, 45, 95, 70, 55, 80].map((v, k) => ({
        h: v + '%',
        c: k === 3 ? '#FFF7ED' : 'rgba(255,247,237,.45)',
        d: k * .2 + 's'
      })),
      goalPct: goal + '%',
      goalTxt: goal + '%',
      homeDots: this.PEOPLE.map((p, k) => ({
        t: p[0],
        c: p[3],
        d: k * .5 + 's'
      })),
      people: this.PEOPLE.map((p, k) => {
        const a = (-90 + k * 90) * Math.PI / 180,
          x = 50 + Math.cos(a) * 46,
          yy = 50 + Math.sin(a) * 46;
        return {
          t: p[0],
          c: p[3],
          x: x + '%',
          y: yy + '%',
          lx: x.toFixed(2),
          ly: yy.toFixed(2),
          bd: s.who === k ? '#EA580C' : '#FFFBF5',
          go: () => this.setState({
            who: k
          })
        };
      }),
      tLink: (.2 + tp * .8).toFixed(2),
      tSel: (() => {
        const p = this.PEOPLE[s.who];
        return {
          t: p[0],
          name: p[1],
          role: p[2],
          c: p[3],
          rows: p[4].map(r => ({
            a: r[0],
            b: r[1]
          }))
        };
      })(),
      vChips: [[this.props.t("Life.calendar"), 12, 18], [this.props.t("Life.bankAccounts"), 78, 14], [this.props.t("Life.notes"), 8, 62], [this.props.t("Life.goals"), 88, 58], [this.props.t("Life.family"), 22, 88], [this.props.t("Life.health"), 74, 90]].map((c, k) => {
        const u = cl(v * 1.4 - k * .08);
        return {
          t: c[0],
          x: (c[1] + (50 - c[1]) * u).toFixed(1) + '%',
          y: (c[2] + (50 - c[2]) * u).toFixed(1) + '%',
          s: (1 - u * .6).toFixed(2),
          op: (1 - cl((u - .8) / .2)).toFixed(2)
        };
      }),
      vDoor: 'perspective(800px) rotateY(' + (-105 * (1 - cl((v - .55) / .4))).toFixed(1) + 'deg)',
      vDial: (v * 540).toFixed(0) + 'deg',
      vState: v > .95 ? this.props.t("Life.lockedFrankfurt") : this.props.t("Life.collectingYourData"),
      vStateC: v > .95 ? '#FDBA74' : '#A56C55',
      priv: [[this.props.t("Life.hostedInFrankfurt"), this.props.t("Life.yourDataStaysInTheEU")], [this.props.t("Life.neverSoldNeverUsedForTraining"), this.props.t("Life.yourLifeIsNotADataset")], [this.props.t("Life.deleteEverythingInOneTap"), this.props.t("Life.leaveAnyTimeAndTakeNothing")]].map((p, k) => {
        const on = v > .3 + k * .2;
        return {
          n: '0' + (k + 1),
          t: p[0],
          d: p[1],
          op: on ? 1 : .25,
          tf: on ? 'none' : 'translateX(14px)'
        };
      }),
      ppl: s.ppl,
      setPpl: e => this.setState({
        ppl: +e.target.value
      }),
      fitName: P[fit][0],
      houseW: 180 + s.ppl * 45 + 'px',
      windows: [0, 1, 2, 3].slice(0, Math.max(2, s.ppl)).map((_, k) => {
        const lit = k < s.ppl;
        return {
          bg: lit ? '#FFC58A' : '#E5D6C4',
          sh: lit ? '0 0 20px rgba(255,170,90,.7)' : 'none',
          d: k * 90 + 'ms'
        };
      }),
      mBg: y ? 'transparent' : '#2B1311',
      mFg: y ? '#5E3A31' : '#FFF7ED',
      yBg: y ? '#2B1311' : 'transparent',
      yFg: y ? '#FFF7ED' : '#5E3A31',
      setMonthly: () => this.setState({
        yearly: false
      }),
      setYearly: () => this.setState({
        yearly: true
      }),
      plans: [...P.map((p, k) => {
        const best = k === fit,
          hi = !!p[3];
        return {
          name: p[0],
          for: p[1],
          tag: best ? this.props.t("Life.bestFit2") : p[3],
          price: y ? fmt(p[2] * 10) : fmt(p[2]),
          unit: y ? this.props.t("Life.year") : this.props.t("Life.month"),
          cta: this.props.t("Life.startFree"),
          href: this.props.signup(['life', 'plus', 'together'][k] || 'plus'),
          bg: hi ? '#2B1311' : '#FFFBF5',
          fg: hi ? '#FFF7ED' : '#2B1311',
          btnBg: hi ? '#EA580C' : '#2B1311',
          btnFg: '#FFF7ED',
          bd: best ? '#EA580C' : 'transparent',
          tf: best ? 'translateY(-8px)' : 'none'
        };
      }), {
        name: 'Life Private',
        for: this.props.t("Life.setUpPersonallyWithACall"),
        tag: this.props.t("Life.byCall"),
        price: this.props.t("Life.from68"),
        unit: this.props.t("Life.month"),
        cta: this.props.t("Life.bookACall"),
        href: this.props.href("/contact"),
        bg: '#F6EDE3',
        fg: '#2B1311',
        btnBg: 'transparent',
        btnFg: '#2B1311',
        bd: 'transparent',
        tf: 'none'
      }]
    };
  }
}

Logic.prototype.render = function render() {
  const v = { ...this.props, ...this.renderVals() };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: "body{margin:0;background:#FBF4EC;color:#2B1311;font-family:var(--font-sans);-webkit-font-smoothing:antialiased}\na{color:inherit;text-decoration:none}a:hover{color:#EA580C}\n@keyframes lfIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}\n@keyframes lfFly{0%{opacity:0;transform:translate(-30px,30px) scale(.85) rotate(-6deg)}20%{opacity:1;transform:translate(0,0) scale(1) rotate(0)}100%{opacity:1;transform:none}}\n@keyframes lfBreath{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(234,88,12,.35)}50%{transform:scale(1.03);box-shadow:0 0 0 14px rgba(234,88,12,0)}}\n@keyframes lfOrbit{to{transform:rotate(360deg)}}\n@keyframes lfOrbitR{to{transform:translate(-50%,-50%) rotate(-360deg)}}\n@keyframes lfFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}\n@keyframes lfHand{to{transform:rotate(360deg)}}\n@keyframes lfCheck{0%,40%{background:transparent;color:transparent}60%,100%{background:#FA8229;color:#170A08}}\n@keyframes lfTag{0%{opacity:0;transform:rotate(180deg) translateY(-14px);filter:blur(6px)}100%{opacity:1;transform:rotate(180deg);filter:blur(0)}}\n@keyframes lfSpin{from{transform:rotateX(-22deg) rotateY(0)}to{transform:rotateX(-22deg) rotateY(360deg)}}\n@keyframes lfOrb{to{transform:rotate(360deg)}}\n@keyframes lfOrbR{from{transform:rotate(0) rotateX(-72deg)}to{transform:rotate(-360deg) rotateX(-72deg)}}\n@keyframes lfSunUp{0%,100%{transform:translateY(50px)}50%{transform:translateY(-10px)}}\n@keyframes lfGrid{to{background-position:0 80px,0 0}}\n@keyframes lfBar{0%,100%{transform:scaleY(.55)}50%{transform:scaleY(1)}}" }} />
      <Nav active="life" />
      <div style={{ background: "#F3ECE2" }}>
        <div data-screen-label="Hero" style={{ background: "#F3ECE2", color: "#170A08", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "clamp(24px,3vw,36px)", padding: "84px clamp(10px,1.2vw,16px) clamp(48px,6vw,80px)", maxWidth: "1520px", margin: "0 auto" }}>
          <div style={{ position: "relative", height: "clamp(460px,62vh,580px)", borderRadius: "28px", overflow: "hidden", background: "#2B1311", flexShrink: "0" }}>
            {" "}
            <div style={{ position: "absolute", inset: "0", opacity: `${v.s17m ?? ''}`, transition: "opacity 1.2s ease", overflow: "hidden", background: "linear-gradient(180deg,#FFE6C8 0%,#FDBA74 48%,#F97316 100%)" }}>
              {" "}
              <div style={{ position: "absolute", left: "46%", top: "38%", width: "420px", height: "420px", margin: "-210px 0 0 -210px", borderRadius: "50%", background: "radial-gradient(circle at 50% 45%,#FFFBF2 0%,#FFD9A8 35%,rgba(255,170,100,0) 70%)", animation: "lfSunUp 9s ease-in-out infinite" }} />
              {" "}
              <div style={{ position: "absolute", left: "0", right: "0", top: "62%", bottom: "0", perspective: "420px", perspectiveOrigin: "46% 0", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: "-50%", right: "-50%", top: "0", height: "900px", transform: "rotateX(68deg)", transformOrigin: "50% 0", backgroundImage: "linear-gradient(rgba(255,248,238,.55) 1px,transparent 1px),linear-gradient(90deg,rgba(255,248,238,.55) 1px,transparent 1px)", backgroundSize: "80px 80px", animation: "lfGrid 2.4s linear infinite", maskImage: "linear-gradient(180deg,transparent,#000 30%)", WebkitMaskImage: "linear-gradient(180deg,transparent,#000 30%)" }} />
              </div>
              {" "}
              <div style={{ position: "absolute", left: "45%", top: "42%", width: "170px", height: "170px", margin: "-85px 0 0 -85px", perspective: "900px" }}>
                <div style={{ position: "absolute", inset: "0", animation: "lfFloat 5s ease-in-out infinite" }}>
                  <div style={{ position: "absolute", inset: "0", transformStyle: "preserve-3d", animation: "lfSpin 14s linear infinite" }}>
                    {(v.cubeFaces ?? []).map((fc, $index) => (<Fragment key={$index}>
                      <span style={{ position: "absolute", inset: "0", transform: `${fc?.tf ?? ''}`, background: "linear-gradient(135deg,rgba(255,248,238,.55),rgba(255,248,238,.12))", border: "1.5px solid rgba(255,248,238,.85)", borderRadius: "18px", boxShadow: "inset 0 0 40px rgba(255,180,110,.5)", backfaceVisibility: "visible", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: "13px", letterSpacing: ".12em", textTransform: "uppercase", color: "#7C2D12", fontWeight: "600", transformStyle: "preserve-3d" }}>
                        <span style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>{fc?.l}</span>
                      </span>
                    </Fragment>))}
                    <span style={{ position: "absolute", left: "50%", top: "50%", width: "56px", height: "56px", margin: "-28px 0 0 -28px", borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#FFE0B8,#FA8229 60%,#C24A00)", boxShadow: "0 0 40px rgba(250,130,41,.8)" }} />
                  </div>
                </div>
              </div>
              {" "}
              <div style={{ position: "absolute", left: "58%", top: "16%", width: "70px", height: "70px", perspective: "600px" }}>
                <div style={{ position: "absolute", inset: "0", transformStyle: "preserve-3d", animation: "lfSpin 10s linear infinite reverse" }}>
                  {(v.cubeFacesS ?? []).map((fc, $index) => (<Fragment key={$index}>
                    <span style={{ position: "absolute", inset: "0", transform: `${fc?.tf ?? ''}`, background: "linear-gradient(135deg,rgba(255,248,238,.55),rgba(255,248,238,.12))", border: "1.5px solid rgba(255,248,238,.85)", borderRadius: "18px", boxShadow: "inset 0 0 40px rgba(255,180,110,.5)", backfaceVisibility: "visible", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: "13px", letterSpacing: ".12em", textTransform: "uppercase", color: "#7C2D12", fontWeight: "600", transformStyle: "preserve-3d" }}>
                      <span style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>{fc?.l}</span>
                    </span>
                  </Fragment>))}
                </div>
              </div>
              {" "}
              <div style={{ position: "absolute", left: "36%", top: "64%", width: "54px", height: "54px", perspective: "600px" }}>
                <div style={{ position: "absolute", inset: "0", transformStyle: "preserve-3d", animation: "lfSpin 12s linear infinite" }}>
                  {(v.cubeFacesXS ?? []).map((fc, $index) => (<Fragment key={$index}>
                    <span style={{ position: "absolute", inset: "0", transform: `${fc?.tf ?? ''}`, background: "linear-gradient(135deg,rgba(255,248,238,.55),rgba(255,248,238,.12))", border: "1.5px solid rgba(255,248,238,.85)", borderRadius: "18px", boxShadow: "inset 0 0 40px rgba(255,180,110,.5)", backfaceVisibility: "visible", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: "13px", letterSpacing: ".12em", textTransform: "uppercase", color: "#7C2D12", fontWeight: "600", transformStyle: "preserve-3d" }}>
                      <span style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>{fc?.l}</span>
                    </span>
                  </Fragment>))}
                </div>
              </div>
              {" "}
            </div>
            {" "}
            <div style={{ position: "absolute", inset: "0", opacity: `${v.s17d ?? ''}`, transition: "opacity 1.2s ease", overflow: "hidden", background: "radial-gradient(ellipse at 45% 45%,#FFF8EE 0%,#DCEBF4 45%,#9EC6E2 100%)" }}>
              {" "}
              <div style={{ position: "absolute", left: "45%", top: "48%", width: "0", height: "0", perspective: "1200px" }}>
                {" "}
                {(v.orbRings ?? []).map((r, $index) => (<Fragment key={$index}>
                  <div style={{ position: "absolute", left: `${r?.o ?? ''}`, top: `${r?.o ?? ''}`, width: `${r?.sz ?? ''}`, height: `${r?.sz ?? ''}`, transformStyle: "preserve-3d", transform: `${r?.tf ?? ''}` }}>
                    <div style={{ position: "absolute", inset: "0", borderRadius: "50%", border: "1.5px solid rgba(23,10,8,.22)" }} />
                    <div style={{ position: "absolute", inset: "0", transformStyle: "preserve-3d", animation: `lfOrb ${r?.dur ?? ''} linear infinite` }}>
                      <div style={{ position: "absolute", left: "50%", top: "0", width: "0", height: "0", transformStyle: "preserve-3d", animation: `lfOrbR ${r?.dur ?? ''} linear infinite` }}>
                        <span style={{ position: "absolute", left: "-14px", top: "-14px", width: "28px", height: "28px", borderRadius: "50%", background: `radial-gradient(circle at 35% 30%,#FFFFFF,${r?.c ?? ''} 65%)`, boxShadow: `0 0 18px ${r?.c ?? ''}` }} />
                        <span style={{ position: "absolute", left: "20px", top: "-12px", background: "#FFFBF5", color: "#170A08", borderRadius: "999px", padding: "4px 10px", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: "0 6px 14px rgba(23,10,8,.15)" }}>
                          {r?.l}
                        </span>
                      </div>
                    </div>
                  </div>
                </Fragment>))}
                {" "}
                <div style={{ position: "absolute", left: "-75px", top: "-75px", width: "150px", height: "150px", borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#FFE6C8 0%,#FA8229 45%,#B84300 100%)", boxShadow: "0 30px 60px rgba(184,67,0,.35),0 0 80px rgba(250,130,41,.45)", animation: "lfFloat 6s ease-in-out infinite", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "600", letterSpacing: "-0.03em", color: "#FFF8EE" }}>
                  {v.t("Life.you")}
                </div>
                {" "}
              </div>
              {" "}
              <div style={{ position: "absolute", left: "0", right: "0", bottom: "0", height: "40%", background: "linear-gradient(0deg,rgba(243,236,226,.7),transparent)" }} />
              {" "}
            </div>
            {" "}
            <img src={v.s17eImg} alt={v.t("Life.rialtoInTheEvening")} style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "70% 40%", display: "block", opacity: `${v.s17e ?? ''}`, transform: `${v.s17eTf ?? ''}`, transition: "opacity 1.2s ease,transform 7s linear" }} />
            {" "}
            <div style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg,rgba(23,10,8,.25) 0%,rgba(23,10,8,0) 30%,rgba(23,10,8,0) 60%,rgba(23,10,8,.45) 100%)" }} />
            {" "}
            <div style={{ position: "absolute", left: "22px", top: "22px", zIndex: "3", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
              <span key={v.lmKey} style={{ animation: "lfTag .7s cubic-bezier(.16,1,.3,1) .3s both", writingMode: "vertical-rl", transform: "rotate(180deg)", background: "#FFF8EE", color: "#170A08", borderRadius: "999px", padding: "20px 12px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".14em", textTransform: "uppercase" }}>
                {v.t("Life.lifeX", { x: v.lmName })}
              </span>
              <a href={v.href("@lifedemo")} style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#FA8229", color: "#170A08", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                {"↗"}
              </a>
            </div>
            {" "}
            <div style={{ position: "absolute", left: "96px", top: "96px", width: "330px", display: `${v.hWide ?? ''}`, flexDirection: "column", gap: "8px", zIndex: "2" }}>
              {(v.lmFeed ?? []).map((f, $index) => (<Fragment key={$index}>
                <div key={f?.k} style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,248,238,.92)", backdropFilter: "blur(12px)", borderRadius: "16px", padding: "10px 14px 10px 10px", boxShadow: "0 14px 30px rgba(20,10,0,.18)", animation: `lfIn .7s cubic-bezier(.16,1,.3,1) ${f?.dl ?? ''} both` }}>
                  <span style={{ width: "30px", height: "30px", borderRadius: "50%", border: "2px solid #FA8229", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", flexShrink: "0", animation: `lfCheck 2.2s ease ${f?.dl ?? ''} both` }}>
                    {"✓"}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#B65234", width: "42px", flexShrink: "0" }}>
                    {f?.t}
                  </span>
                  <span style={{ fontSize: "15px", fontWeight: "500", flex: "1" }}>
                    {f?.d}
                  </span>
                </div>
              </Fragment>))}
            </div>
            {" "}
            <div key={v.lmKey} style={{ position: "absolute", right: `${v.hChipR ?? ''}`, top: "36%", zIndex: "2", display: "flex", alignItems: "center", animation: "lfIn .8s cubic-bezier(.16,1,.3,1) 1.3s both" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#FFF8EE", boxShadow: "0 0 0 4px rgba(255,248,238,.35)" }} />
              <span style={{ width: "56px", height: "1px", background: "#FFF8EE" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#FA8229", borderRadius: "14px", padding: "8px 18px 8px 8px", whiteSpace: "nowrap", animation: "lfFloat 5s ease-in-out infinite" }}>
                <span style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#170A08", color: "#FDBA74", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>
                  {v.lmChipI}
                </span>
                <b style={{ fontSize: "19px" }}>
                  {v.lmChipB}
                </b>
                <span style={{ fontSize: "15px" }}>
                  {v.lmChipS}
                </span>
              </div>
            </div>
            {" "}
            <div style={{ position: "absolute", top: "0", right: "0", zIndex: "3", background: "#F3ECE2", borderBottomLeftRadius: "28px", padding: "0 0 14px 14px", display: "flex" }}>
              <span style={{ position: "absolute", top: "0", right: "100%", width: "28px", height: "28px", background: "radial-gradient(circle at 0 100%,transparent 27.5px,#F3ECE2 28px)" }} />
              <span style={{ position: "absolute", top: "100%", right: "0", width: "28px", height: "28px", background: "radial-gradient(circle at 0 100%,transparent 27.5px,#F3ECE2 28px)" }} />
              <div style={{ height: "56px", borderRadius: "999px", background: "#170A08", color: "#FFEDD8", display: "flex", alignItems: "center", gap: "14px", padding: "0 22px 0 8px" }}>
                <span style={{ width: "40px", height: "40px", borderRadius: "50%", background: `conic-gradient(#FA8229 ${v.lmDeg ?? ''},#3B211D 0)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#170A08" }} />
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "24px", fontVariantNumeric: "tabular-nums" }}>
                  {v.lmClock}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#C9A888" }}>
                  {v.t("Life.wedX", { x: v.lmTemp })}
                </span>
              </div>
            </div>
            {" "}
            <div key={v.capK} style={{ position: "absolute", right: "22px", bottom: "22px", zIndex: "2", width: "340px", display: `${v.hWide ?? ''}`, flexDirection: "column", gap: "6px", background: "rgba(255,248,238,.92)", backdropFilter: "blur(12px)", borderRadius: "20px", padding: "16px 20px", boxShadow: "0 14px 30px rgba(20,10,0,.18)", animation: "lfIn .7s cubic-bezier(.16,1,.3,1) .2s both" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#B65234" }}>
                {v.capN}{" · "}{v.lmName}
              </span>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "30px", lineHeight: "1", color: "#170A08" }}>
                {v.capT}
              </span>
              <span style={{ fontSize: "14px", lineHeight: "1.45", color: "#462324", textWrap: "pretty" }}>
                {v.capL}
              </span>
            </div>
            {" "}
            <div style={{ position: "absolute", left: "0", bottom: "0", zIndex: "3", background: "#F3ECE2", borderTopRightRadius: "28px", padding: "14px 14px 0 0", display: "flex", gap: "8px" }}>
              <span style={{ position: "absolute", left: "0", bottom: "100%", width: "28px", height: "28px", background: "radial-gradient(circle at 100% 0,transparent 27.5px,#F3ECE2 28px)" }} />
              <span style={{ position: "absolute", left: "100%", bottom: "0", width: "28px", height: "28px", background: "radial-gradient(circle at 100% 0,transparent 27.5px,#F3ECE2 28px)" }} />
              {(v.lmTabs17 ?? []).map((t, $index) => (<Fragment key={$index}>
                <button className="lf-tab" onClick={t?.go} style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px", background: `${t?.bg ?? ''}`, color: `${t?.fg ?? ''}`, border: `1px solid ${t?.bd ?? ''}`, borderRadius: "999px", padding: "6px 20px 6px 6px", cursor: "pointer", overflow: "hidden", fontFamily: "var(--font-sans)", transition: "background .4s,color .4s" }}>
                  <span className="lf-sw" style={{ width: "52px", height: "52px", borderRadius: "50%", overflow: "hidden", flexShrink: "0", background: `${t?.sw ?? ''}`, backgroundSize: "cover", backgroundPosition: "center" }} />
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
                    <span style={{ fontSize: "15px", fontWeight: "600" }}>
                      {t?.n}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", opacity: ".7", whiteSpace: "nowrap" }}>
                      {t?.h}
                    </span>
                  </span>
                  <span style={{ position: "absolute", left: "0", bottom: "0", height: "3px", width: `${t?.w ?? ''}`, background: "#FA8229" }} />
                </button>
              </Fragment>))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "28px 56px", alignItems: "center", padding: "0 clamp(8px,2.4vw,40px)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <span style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "10px", background: "#FA8229", borderRadius: "999px", padding: "6px 18px 6px 6px", fontSize: "16px", fontWeight: "600", whiteSpace: "nowrap" }}>
                <span style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#170A08", color: "#FDBA74", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                  {"✓"}
                </span>
                {v.t("Life.xToday", { x: v.lmCount })}
              </span>
              <h1 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,69px)", lineHeight: ".92", letterSpacing: "-0.055em", fontWeight: "600", textWrap: "balance" }}>
                {v.t("Life.yourLifeRemembered")}
                <br />
                {v.t("Life.sorted")}{" "}
                <span style={{ color: "#FA8229" }}>
                  {v.t("Life.lived")}
                </span>
              </h1>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              <p style={{ margin: "0", maxWidth: "480px", fontSize: "19px", lineHeight: "1.5", color: "#462324", textWrap: "pretty" }}>
                {v.t("Life.lifeKeepsTrackOfBillsAppointments")}
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <a href={v.signup("plus")} style={{ background: "#170A08", color: "#FFEDD8", borderRadius: "999px", padding: "17px 26px", fontWeight: "600", fontSize: "13px", letterSpacing: ".08em", textTransform: "uppercase" }} className="hv-6842cf6">
                  {v.t("Life.try14DaysFree")}
                </a>
                <a href="#lf-day" style={{ border: "1px solid #C9B49E", borderRadius: "999px", padding: "17px 26px", fontWeight: "600", fontSize: "13px", letterSpacing: ".08em", textTransform: "uppercase" }}>
                  {v.t("Life.plansForFamilies")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="lf-day" ref={v.dayRef} data-screen-label="01 A day" style={{ height: `${v.dH ?? ''}`, position: "relative" }}>
        {" "}
        <div style={{ position: `${v.hPos ?? ''}`, top: "0", height: `${v.hInner ?? ''}`, boxSizing: "border-box", padding: "110px clamp(20px,3vw,40px) 40px", maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "48px", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#EA580C" }}>
              {v.t("Life.n01ADayWithLife")}
            </div>
            <h2 style={{ margin: "0", fontSize: "clamp(30px,3.4vw,52px)", lineHeight: "1", letterSpacing: "-0.04em", fontWeight: "600", textWrap: "balance" }}>
              {v.t("Life.itShowsUpWhenItHelps")}{" "}
              <span>
                {v.t("Life.andStaysQuiet")}
              </span>
              {" "}{v.t("Life.whenItDoesnT")}
            </h2>
            <div style={{ position: "relative", height: "90px", maxWidth: "440px" }}>
              {" "}
              <div style={{ position: "absolute", left: "0", right: "0", top: "0", height: "180px", borderRadius: "50%", border: "1px dashed #D9C7B3", clipPath: "inset(0 0 50% 0)" }} />
              {" "}
              <span style={{ position: "absolute", left: `${v.sunX ?? ''}`, top: `${v.sunY ?? ''}`, width: "18px", height: "18px", margin: "-9px 0 0 -9px", borderRadius: "50%", background: `${v.sunC ?? ''}`, boxShadow: `0 0 0 6px rgba(255,160,80,.2),0 0 24px ${v.sunC ?? ''}`, transition: "background .4s" }} />
              {" "}
              <span style={{ position: "absolute", left: "0", bottom: "-4px", fontFamily: "var(--font-mono)", fontSize: "10px", color: "#A56C55" }}>
                {"06:00"}
              </span>
              <span style={{ position: "absolute", right: "0", bottom: "-4px", fontFamily: "var(--font-mono)", fontSize: "10px", color: "#A56C55" }}>
                {"22:00"}
              </span>
              {" "}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(52px,5.4vw,84px)", lineHeight: "1", color: "#EA580C", fontVariantNumeric: "tabular-nums" }}>
                {v.dClock}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#A56C55" }}>
                {v.dTag}
              </span>
            </div>
            <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.6", color: "#5E3A31", maxWidth: "440px", minHeight: "56px" }}>
              {v.dBody}
            </p>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {(v.dChips ?? []).map((c, $index) => (<Fragment key={$index}>
                <button onClick={c?.go} style={{ border: `1px solid ${c?.bd ?? ''}`, background: `${c?.bg ?? ''}`, color: `${c?.fg ?? ''}`, borderRadius: "999px", padding: "9px 14px", font: "500 13px var(--font-mono)", cursor: "pointer", transition: "all .3s" }}>
                  {c?.t}
                </button>
              </Fragment>))}
            </div>
          </div>
          <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", padding: "52px 0 44px", minWidth: "0" }}>
            {/* The wrapper sets the phone size; everything inside scales with it (cqw units). */}
            <div className="lf-ph" style={{ position: "relative", width: `${v.phW ?? ''}`, aspectRatio: "9/19.5", containerType: "inline-size", perspective: "1600px" }}>
              <div aria-hidden="true" style={{ position: "absolute", left: "8%", right: "8%", bottom: "-5%", height: "12%", borderRadius: "50%", background: "radial-gradient(closest-side,rgba(127,29,29,.34),rgba(127,29,29,0))", filter: "blur(10px)" }} />
              <div style={{ position: "absolute", inset: "0", transform: `rotateY(${v.phRot ?? ''}) rotateX(3deg)`, transformStyle: "preserve-3d", transition: "transform .3s ease-out" }}>
                <span aria-hidden="true" style={{ position: "absolute", left: "-0.9cqw", top: "21%", width: "1.2cqw", height: "5%", borderRadius: "1cqw", background: "#3A1A18" }} />
                <span aria-hidden="true" style={{ position: "absolute", left: "-0.9cqw", top: "29%", width: "1.2cqw", height: "8%", borderRadius: "1cqw", background: "#3A1A18" }} />
                <span aria-hidden="true" style={{ position: "absolute", right: "-0.9cqw", top: "26%", width: "1.2cqw", height: "11%", borderRadius: "1cqw", background: "#3A1A18" }} />
                <div style={{ position: "absolute", inset: "0", borderRadius: "16.5cqw", background: "linear-gradient(145deg,#6B3A33 0%,#2A1211 22%,#17090A 60%,#4A2622 100%)", boxShadow: "0 1px 2px rgba(127,29,29,.2),0 34px 60px -24px rgba(127,29,29,.42),0 70px 110px -50px rgba(249,115,22,.4)" }} />
                <div style={{ position: "absolute", inset: "0.7cqw", borderRadius: "15.9cqw", background: "#0E0506" }} />
                <div style={{ position: "absolute", inset: "2.6cqw", borderRadius: "14.2cqw", overflow: "hidden", background: `${v.scrBg ?? ''}`, color: `${v.scrFg ?? ''}`, transition: "background .6s,color .6s", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
                  <div aria-hidden="true" style={{ position: "absolute", left: "-20%", right: "-20%", top: "-12%", height: "46%", background: "radial-gradient(closest-side,#FDBA74,rgba(253,186,116,0))", opacity: `${v.scrGlow ?? ''}`, transition: "opacity .6s", pointerEvents: "none" }} />
                  <span aria-hidden="true" style={{ position: "absolute", left: "50%", top: "3.4cqw", width: "30cqw", height: "8.6cqw", borderRadius: "5cqw", background: "#0E0506", transform: "translateX(-50%)", zIndex: "2" }}>
                    <span style={{ position: "absolute", right: "2.6cqw", top: "50%", width: "2.6cqw", height: "2.6cqw", margin: "-1.3cqw 0 0", borderRadius: "50%", background: "#241416", boxShadow: "inset 0 0 0 .5cqw #1A0C0E" }} />
                  </span>
                  <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5cqw 8.5cqw 0", height: "7cqw", font: "600 4.3cqw var(--font-sans)", fontVariantNumeric: "tabular-nums", flexShrink: "0" }}>
                    <span>
                      {v.dClock}
                    </span>
                    <span aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: "1.6cqw" }}>
                      <svg viewBox="0 0 18 12" style={{ width: "5.4cqw", height: "3.6cqw" }} fill="currentColor">
                        <rect x="0" y="8" width="3" height="4" rx="1" />
                        <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
                        <rect x="10" y="3" width="3" height="9" rx="1" />
                        <rect x="15" y="0" width="3" height="12" rx="1" opacity=".35" />
                      </svg>
                      <svg viewBox="0 0 26 12" style={{ width: "7.8cqw", height: "3.6cqw" }} fill="none">
                        <rect x=".6" y=".6" width="21.8" height="10.8" rx="3.4" stroke="currentColor" opacity=".45" />
                        <rect x="2.2" y="2.2" width="14" height="7.6" rx="2" fill="currentColor" />
                        <rect x="23.6" y="4" width="1.8" height="4" rx=".9" fill="currentColor" opacity=".45" />
                      </svg>
                    </span>
                  </div>
                  <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6.5cqw 6.5cqw 0", flexShrink: "0" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "2.4cqw", font: "600 4cqw var(--font-sans)", letterSpacing: "-0.01em" }}>
                      <span style={{ width: "7.4cqw", height: "7.4cqw", borderRadius: "2.4cqw", background: "#F97316", color: "#17090A", display: "flex", alignItems: "center", justifyContent: "center", font: "700 4.2cqw var(--font-sans)" }}>
                        {"L"}
                      </span>
                      {"RIDEFF Life"}
                    </span>
                    <span style={{ font: "400 3.2cqw var(--font-mono)", letterSpacing: ".06em", textTransform: "uppercase", opacity: ".6" }}>
                      {v.day}
                    </span>
                  </div>
                  <div key={v.dStep} style={{ position: "relative", display: "flex", flexDirection: "column", gap: "2.6cqw", padding: "6cqw 5.4cqw 0", flex: "1", minHeight: "0", animation: "lfIn .6s cubic-bezier(.16,1,.3,1) both" }}>
                    <span style={{ font: "500 3.2cqw var(--font-mono)", letterSpacing: ".1em", textTransform: "uppercase", color: `${v.scrTag ?? ''}`, padding: "0 1.2cqw" }}>
                      {v.dTag}
                    </span>
                    <b style={{ font: "600 9cqw/1.02 var(--font-sans)", letterSpacing: "-0.04em", padding: "0 1.2cqw 1.4cqw", textWrap: "balance" }}>
                      {v.dHead}
                    </b>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "3cqw", padding: "4.4cqw 4.6cqw", borderRadius: "6cqw", background: `${v.scrFeatBg ?? ''}`, color: `${v.scrFeatFg ?? ''}`, transition: "background .6s,color .6s" }}>
                      <span style={{ font: "500 3.5cqw var(--font-sans)", opacity: ".8" }}>
                        {v.dRows?.[0]?.k}
                      </span>
                      <b style={{ font: "600 5.6cqw/1.05 var(--font-sans)", letterSpacing: "-0.03em", textAlign: "right" }}>
                        {v.dRows?.[0]?.v}
                      </b>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.6cqw" }}>
                      {(v.dRows ?? []).slice(1).map((r, $index) => (<Fragment key={$index}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.4cqw", padding: "3.8cqw 4cqw", borderRadius: "5.4cqw", background: `${v.scrCard ?? ''}`, transition: "background .6s", minWidth: "0" }}>
                          <span style={{ font: "500 3.2cqw var(--font-sans)", opacity: ".65" }}>
                            {r?.k}
                          </span>
                          <b style={{ font: "600 4.1cqw/1.2 var(--font-sans)", letterSpacing: "-0.01em" }}>
                            {r?.v}
                          </b>
                        </div>
                      </Fragment>))}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", flex: "1", minHeight: "0", marginTop: "2cqw", padding: "0 1.2cqw 1.5cqw" }}>
                      {(v.dAgenda ?? []).map((a, $index) => (<Fragment key={$index}>
                        <div style={{ display: "flex", alignItems: "center", gap: "3cqw", flex: "1 1 0", minHeight: "0", borderTop: `1px solid ${v.scrLine ?? ''}`, font: `${a?.fw ?? ''} 3.7cqw/1.25 var(--font-sans)`, opacity: `${a?.op ?? ''}` }}>
                          <span style={{ width: "5cqw", height: "5cqw", borderRadius: "50%", flexShrink: "0", display: "flex", alignItems: "center", justifyContent: "center", background: `${a?.dotBg ?? ''}`, border: `1px solid ${a?.dotBd ?? ''}`, color: `${a?.dotFg ?? ''}`, font: "700 3cqw var(--font-sans)", boxSizing: "border-box" }}>
                            {a?.mark}
                          </span>
                          <span style={{ font: "400 3.2cqw var(--font-mono)", fontVariantNumeric: "tabular-nums", opacity: ".7", flexShrink: "0" }}>
                            {a?.t}
                          </span>
                          <span style={{ minWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {a?.l}
                          </span>
                        </div>
                      </Fragment>))}
                    </div>
                  </div>
                  <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(4,1fr)", padding: "2.6cqw 4cqw 7.4cqw", borderTop: `1px solid ${v.scrLine ?? ''}`, background: `${v.scrBar ?? ''}`, transition: "background .6s", flexShrink: "0" }}>
                    {(v.dTabs ?? []).map((tb, $index) => (<Fragment key={$index}>
                      <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2cqw", font: "500 2.9cqw var(--font-sans)", color: `${tb?.fg ?? ''}`, transition: "color .4s" }}>
                        <svg viewBox="0 0 24 24" style={{ width: "6.4cqw", height: "6.4cqw" }} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d={tb?.d} />
                        </svg>
                        {tb?.t}
                      </span>
                    </Fragment>))}
                    <span aria-hidden="true" style={{ position: "absolute", left: "50%", bottom: "2.4cqw", width: "34cqw", height: "1.5cqw", borderRadius: "1cqw", background: "currentColor", opacity: ".8", transform: "translateX(-50%)" }} />
                  </div>
                </div>
              </div>
              <div key={v.dStep} style={{ position: "absolute", right: `${v.phNoteR ?? ''}`, top: "-7.5%", zIndex: "3", width: "max(78%,190px)", maxWidth: "250px", boxSizing: "border-box", background: "rgba(255,251,245,.96)", backdropFilter: "blur(14px)", border: "1px solid rgba(127,29,29,.08)", borderRadius: "18px", padding: "12px 14px", display: "flex", gap: "11px", alignItems: "center", boxShadow: "0 18px 40px -10px rgba(127,29,29,.28),0 2px 6px rgba(127,29,29,.08)", animation: "lfFly 1s cubic-bezier(.16,1,.3,1) both" }}>
                <span style={{ width: "34px", height: "34px", borderRadius: "10px", background: "#F97316", color: "#17090A", display: "flex", alignItems: "center", justifyContent: "center", font: "700 17px var(--font-sans)", flexShrink: "0" }}>
                  {"L"}
                </span>
                <span style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                  <b style={{ fontSize: "13px", lineHeight: "1.25", color: "#17090A" }}>
                    {v.dNote}
                  </b>
                  <span style={{ fontSize: "11px", color: "#7F1D1D", opacity: ".75" }}>
                    {v.t("Life.nowLife")}
                  </span>
                </span>
              </div>
              {v.dLast ? (
                <div key={`p${v.dStep}`} style={{ position: "absolute", left: `${v.phNoteL ?? ''}`, bottom: "-4.5%", zIndex: "3", maxWidth: "max(74%,180px)", boxSizing: "border-box", display: "flex", alignItems: "center", gap: "8px", background: "#7F1D1D", color: "#FFF7ED", borderRadius: "999px", padding: "8px 14px 8px 8px", fontSize: "12px", lineHeight: "1.25", boxShadow: "0 16px 34px -10px rgba(127,29,29,.5)", animation: "lfIn .6s cubic-bezier(.16,1,.3,1) .25s both" }}>
                  <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#FDBA74", color: "#7F1D1D", display: "flex", alignItems: "center", justifyContent: "center", font: "700 11px var(--font-sans)", flexShrink: "0" }}>
                    {"✓"}
                  </span>
                  {v.dLast}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div data-screen-label="02 Four things" style={{ padding: "140px clamp(20px,3vw,40px) 0", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "44px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "32px", alignItems: "end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#EA580C" }}>
              {v.t("Life.n02FourThingsOnePlace")}
            </div>
            <h2 style={{ margin: "0", fontSize: "clamp(31px,3.8vw,56px)", lineHeight: "1", letterSpacing: "-0.04em", fontWeight: "600", textWrap: "balance" }}>
              {v.t("Life.moneyTimeGoals")}{" "}
              <span>
                {v.t("Life.home")}
              </span>
            </h2>
          </div>
          <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.6", color: "#5E3A31", maxWidth: "440px" }}>
            {v.t("Life.hoverOrTapACardTo")}
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,250px),1fr))", gap: "14px" }}>
          {(v.four ?? []).map((c, $index) => (<Fragment key={$index}>
            {" "}
            <div onMouseEnter={c?.over} onMouseLeave={c?.out} {...press(c?.tap)} style={{ position: "relative", height: "340px", perspective: "1400px", cursor: "pointer" }}>
              {" "}
              <div style={{ position: "absolute", inset: "0", transformStyle: "preserve-3d", transform: `${c?.flip ?? ''}`, transition: "transform .9s cubic-bezier(.16,1,.3,1)" }}>
                {" "}
                <div style={{ position: "absolute", inset: "0", borderRadius: "28px", background: `${c?.bg ?? ''}`, color: `${c?.fg ?? ''}`, padding: "26px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", opacity: ".7" }}>
                    <span>
                      {c?.n}
                    </span>
                    <span>
                      {"↻"}
                    </span>
                  </div>
                  <div style={{ position: "relative", height: "120px", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "8px" }}>
                    {c?.isMoney ? (<>
                      {(v.bars ?? []).map((b, $index) => (<Fragment key={$index}>
                        <span style={{ width: "16px", height: `${b?.h ?? ''}`, borderRadius: "5px", background: `${b?.c ?? ''}`, transformOrigin: "50% 100%", animation: `lfBar 3s ease-in-out ${b?.d ?? ''} infinite` }} />
                      </Fragment>))}
                    </>) : null}
                    {c?.isTime ? (<>
                      <div style={{ position: "relative", width: "120px", height: "120px", borderRadius: "50%", border: "2px solid currentColor", opacity: ".9" }}>
                        <span style={{ position: "absolute", left: "50%", top: "50%", width: "2px", height: "38px", marginLeft: "-1px", background: "currentColor", transformOrigin: "50% 0", animation: "lfHand 60s linear infinite" }} />
                        <span style={{ position: "absolute", left: "50%", top: "50%", width: "2px", height: "50px", marginLeft: "-1px", background: "#EA580C", transformOrigin: "50% 0", animation: "lfHand 6s linear infinite" }} />
                        <span style={{ position: "absolute", left: "50%", top: "50%", width: "8px", height: "8px", margin: "-4px", borderRadius: "50%", background: "currentColor" }} />
                      </div>
                    </>) : null}
                    {c?.isGoal ? (<>
                      <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: `conic-gradient(#EA580C ${v.goalPct ?? ''},rgba(255,255,255,.25) 0)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ width: "92px", height: "92px", borderRadius: "50%", background: `${c?.bg ?? ''}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontSize: "30px" }}>
                          {v.goalTxt}
                        </span>
                      </div>
                    </>) : null}
                    {c?.isHome ? (<>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,40px)", gap: "8px" }}>
                        {(v.homeDots ?? []).map((h, $index) => (<Fragment key={$index}>
                          <span style={{ width: "40px", height: "40px", borderRadius: "50%", background: `${h?.c ?? ''}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "600", color: "#2B1311", animation: `lfFloat 4s ease-in-out ${h?.d ?? ''} infinite` }}>
                            {h?.t}
                          </span>
                        </Fragment>))}
                      </div>
                    </>) : null}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <b style={{ fontFamily: "var(--font-sans)", fontWeight: "400", fontSize: "44px", lineHeight: "1" }}>
                      {c?.t}
                    </b>
                    <span style={{ fontSize: "14px", opacity: ".75" }}>
                      {c?.d}
                    </span>
                  </div>
                </div>
                {" "}
                <div style={{ position: "absolute", inset: "0", borderRadius: "28px", background: "#FFFBF5", border: "1px solid #EFE2D3", padding: "26px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "12px", transform: "rotateY(180deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#B55F45" }}>
                    {v.t("Life.xToday2", { x: c?.t })}
                  </span>
                  {(c?.back ?? []).map((r, $index) => (<Fragment key={$index}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "3px", padding: "12px 14px", borderRadius: "16px", background: "#F6EDE3" }}>
                      <span style={{ fontSize: "15px", fontWeight: "500" }}>
                        {r?.a}
                      </span>
                      <span style={{ fontSize: "13px", color: "#A56C55" }}>
                        {r?.b}
                      </span>
                    </div>
                  </Fragment>))}
                </div>
                {" "}
              </div>
              {" "}
            </div>
            {" "}
          </Fragment>))}
        </div>
      </div>
      <div ref={v.togRef} data-screen-label="03 Together" style={{ padding: "140px clamp(20px,3vw,40px) 0", maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "48px", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#EA580C" }}>
            {v.t("Life.n03Together")}
          </div>
          <h2 style={{ margin: "0", fontSize: "clamp(31px,3.8vw,56px)", lineHeight: "1", letterSpacing: "-0.04em", fontWeight: "600", textWrap: "balance" }}>
            {v.t("Life.oneHome")}{" "}
            <span>
              {v.t("Life.everyoneOnTheSamePage")}
            </span>
          </h2>
          <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.6", color: "#5E3A31", maxWidth: "460px" }}>
            {v.t("Life.sharedCalendarSharedShoppingListSplit")}
          </p>
          <div style={{ background: "#FFFBF5", borderRadius: "24px", padding: "22px", display: "flex", flexDirection: "column", gap: "10px", boxShadow: "0 20px 50px rgba(80,40,10,.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ width: "38px", height: "38px", borderRadius: "50%", background: `${v.tSel?.c ?? ''}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600" }}>
                {v.tSel?.t}
              </span>
              <span style={{ display: "flex", flexDirection: "column" }}>
                <b style={{ fontSize: "17px" }}>
                  {v.tSel?.name}
                </b>
                <span style={{ fontSize: "12px", color: "#A56C55" }}>
                  {v.tSel?.role}
                </span>
              </span>
            </div>
            {(v.tSel?.rows ?? []).map((r, $index) => (<Fragment key={$index}>
              <div key={v.tSel?.name} style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "11px 14px", borderRadius: "14px", background: "#F6EDE3", fontSize: "14px", animation: "lfIn .45s both" }}>
                <span>
                  {r?.a}
                </span>
                <span style={{ color: "#A56C55" }}>
                  {r?.b}
                </span>
              </div>
            </Fragment>))}
          </div>
        </div>
        <div style={{ position: "relative", height: "clamp(440px,42vw,560px)" }}>
          {" "}
          <div style={{ position: "absolute", left: "50%", top: "50%", width: "min(92%,480px)", aspectRatio: "1", transform: "translate(-50%,-50%)" }}>
            {" "}
            <div style={{ position: "absolute", inset: "0", borderRadius: "50%", border: "1px dashed #D9C7B3" }} />
            {" "}
            <div style={{ position: "absolute", inset: "0", animation: "lfOrbit 60s linear infinite" }}>
              {" "}
              <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", overflow: "visible" }}>
                {" "}
                {(v.people ?? []).map((p, $index) => (<Fragment key={$index}>
                  <line x1="50" y1="50" x2={p?.lx} y2={p?.ly} stroke="#EA580C" strokeWidth=".5" strokeDasharray="1.5 1.5" style={{ opacity: `${v.tLink ?? ''}`, transition: "opacity .6s" }} />
                </Fragment>))}
                {" "}
              </svg>
              {" "}
              {(v.people ?? []).map((p, $index) => (<Fragment key={$index}>
                {" "}
                <button onClick={p?.go} style={{ position: "absolute", left: `${p?.x ?? ''}`, top: `${p?.y ?? ''}`, width: "76px", height: "76px", borderRadius: "50%", border: `3px solid ${p?.bd ?? ''}`, background: `${p?.c ?? ''}`, cursor: "pointer", font: "600 18px var(--font-sans)", color: "#2B1311", animation: "lfOrbitR 60s linear infinite", boxShadow: "0 14px 30px rgba(80,40,10,.15)", transform: "translate(-50%,-50%)" }}>
                  {p?.t}
                </button>
                {" "}
              </Fragment>))}
              {" "}
            </div>
            {" "}
            <div style={{ position: "absolute", left: "50%", top: "50%", width: "120px", height: "120px", transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px" }}>
              <div style={{ width: "96px", height: "86px", position: "relative" }}>
                {" "}
                <span style={{ position: "absolute", left: "0", right: "0", top: "0", height: "40px", background: "#EA580C", clipPath: "polygon(50% 0,100% 100%,0 100%)" }} />
                {" "}
                <span style={{ position: "absolute", left: "10px", right: "10px", top: "40px", bottom: "0", background: "#FFFBF5", borderRadius: "0 0 8px 8px", boxShadow: "0 20px 40px rgba(80,40,10,.18)" }} />
                {" "}
                <span style={{ position: "absolute", left: "40px", width: "16px", bottom: "0", height: "24px", background: "#2B1311", borderRadius: "3px 3px 0 0" }} />
                {" "}
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#A56C55" }}>
                {v.t("Life.together4")}
              </span>
            </div>
            {" "}
          </div>
          {" "}
        </div>
      </div>
      <div ref={v.vaultRef} data-screen-label="04 Privacy" style={{ marginTop: "140px", background: "#2B1311", color: "#FFEDD8" }}>
        {" "}
        <div style={{ padding: "120px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "48px", alignItems: "center" }}>
          <div style={{ position: "relative", height: "clamp(420px,40vw,520px)", perspective: "1400px", order: "0" }}>
            {" "}
            {(v.vChips ?? []).map((c, $index) => (<Fragment key={$index}>
              <span style={{ position: "absolute", left: `${c?.x ?? ''}`, top: `${c?.y ?? ''}`, transform: `translate(-50%,-50%) scale(${c?.s ?? ''})`, opacity: `${c?.op ?? ''}`, background: "#3B211D", border: "1px solid #5E3A31", borderRadius: "999px", padding: "9px 15px", fontSize: "13px", whiteSpace: "nowrap", zIndex: "1" }}>
                {c?.t}
              </span>
            </Fragment>))}
            {" "}
            <div style={{ position: "absolute", left: "50%", top: "50%", width: "min(300px,64%)", aspectRatio: "1", transform: "translate(-50%,-50%)", borderRadius: "36px", background: "linear-gradient(145deg,#4C2B26,#2F1A17)", boxShadow: "inset 0 0 0 2px #5E3A31,0 40px 80px rgba(0,0,0,.45)", zIndex: "2" }}>
              {" "}
              <div style={{ position: "absolute", inset: "14%", borderRadius: "50%", background: "#1F100E", boxShadow: "inset 0 0 0 2px #5E3A31" }} />
              {" "}
              <div style={{ position: "absolute", inset: "14%", borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#6C493E,#3B211D 70%)", boxShadow: "0 0 0 2px #7D5246,0 20px 40px rgba(0,0,0,.4)", transformOrigin: "0 50%", transform: `${v.vDoor ?? ''}`, transition: "transform .2s linear", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "42%", aspectRatio: "1", borderRadius: "50%", border: "3px solid #EA580C", transform: `rotate(${v.vDial ?? ''})`, position: "relative" }}>
                  <span style={{ position: "absolute", left: "50%", top: "-3px", width: "3px", height: "30%", marginLeft: "-1.5px", background: "#EA580C" }} />
                </div>
              </div>
              {" "}
            </div>
            {" "}
            <div style={{ position: "absolute", left: "0", right: "0", bottom: "0", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: `${v.vStateC ?? ''}`, zIndex: "3" }}>
              {v.vState}
            </div>
            {" "}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FDBA74" }}>
              {v.t("Life.n04PrivateByDesign")}
            </div>
            <h2 style={{ margin: "0", fontSize: "clamp(31px,3.8vw,56px)", lineHeight: "1", letterSpacing: "-0.04em", fontWeight: "600", textWrap: "balance" }}>
              {v.t("Life.yourLifeStays")}{" "}
              <span style={{ color: "#FDBA74" }}>
                {v.t("Life.yours")}
              </span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #4C2B26" }}>
              {(v.priv ?? []).map((p, $index) => (<Fragment key={$index}>
                <div style={{ display: "grid", gridTemplateColumns: "40px minmax(0,1fr)", gap: "14px", padding: "18px 0", borderBottom: "1px solid #4C2B26", opacity: `${p?.op ?? ''}`, transform: `${p?.tf ?? ''}`, transition: "opacity .5s,transform .6s cubic-bezier(.16,1,.3,1)" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FDBA74", paddingTop: "4px" }}>
                    {p?.n}
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <b style={{ fontSize: "20px", letterSpacing: "-0.02em" }}>
                      {p?.t}
                    </b>
                    <span style={{ fontSize: "15px", lineHeight: "1.5", color: "#CDB9A4" }}>
                      {p?.d}
                    </span>
                  </span>
                </div>
              </Fragment>))}
            </div>
          </div>
        </div>
      </div>
      <div data-screen-label="05 Plans" style={{ background: "#EFE2D3" }}>
        {" "}
        <div style={{ padding: "120px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "40px", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#EA580C" }}>
                {v.t("Life.n05Plans")}
              </div>
              <h2 style={{ margin: "0", fontSize: "clamp(31px,3.8vw,56px)", lineHeight: "1", letterSpacing: "-0.04em", fontWeight: "600" }}>
                {v.t("Life.pickTheSizeOf")}{" "}
                <span>
                  {v.t("Life.yourLife")}
                </span>
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "420px" }}>
                <span style={{ fontSize: "15px", color: "#5E3A31" }}>
                  {v.t("Life.howManyPeopleLiveWithYou")}{" "}
                  <b style={{ color: "#2B1311" }}>
                    {v.ppl}
                  </b>
                </span>
                <input type="range" min="1" max="4" step="1" value={v.ppl ?? ''} onChange={v.setPpl} aria-label={v.t("Life.howManyPeopleLiveWithYou")} style={{ width: "100%", accentColor: "#EA580C" }} />
                <span style={{ fontSize: "14px", color: "#5E3A31" }}>
                  {v.t("Life.bestFit")}{" "}
                  <b style={{ color: "#EA580C" }}>
                    {v.fitName}
                  </b>
                </span>
              </div>
              <div className="lf-bill" style={{ display: "flex", gap: "4px", padding: "4px", borderRadius: "999px", background: "#F6EDE3", width: "max-content" }}>
                <button onClick={v.setMonthly} style={{ border: "none", cursor: "pointer", borderRadius: "999px", padding: "10px 20px", font: "500 14px var(--font-sans)", background: `${v.mBg ?? ''}`, color: `${v.mFg ?? ''}` }}>
                  {v.t("Life.monthly")}
                </button>
                <button onClick={v.setYearly} style={{ border: "none", cursor: "pointer", borderRadius: "999px", padding: "10px 20px", font: "500 14px var(--font-sans)", background: `${v.yBg ?? ''}`, color: `${v.yFg ?? ''}` }}>
                  {v.t("Life.yearly2MonthsFree")}
                </button>
              </div>
            </div>
            <div style={{ position: "relative", height: "300px", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
              <div style={{ position: "relative", width: `${v.houseW ?? ''}`, height: "220px", transition: "width .6s cubic-bezier(.16,1,.3,1)" }}>
                {" "}
                <span style={{ position: "absolute", left: "-6%", right: "-6%", top: "0", height: "90px", background: "#EA580C", clipPath: "polygon(50% 0,100% 100%,0 100%)" }} />
                {" "}
                <span style={{ position: "absolute", left: "0", right: "0", top: "90px", bottom: "0", background: "#FFFBF5", borderRadius: "0 0 14px 14px", boxShadow: "0 30px 60px rgba(80,40,10,.18)" }} />
                {" "}
                <div style={{ position: "absolute", left: "12px", right: "12px", top: "108px", display: "flex", justifyContent: "center", gap: "12px" }}>
                  {(v.windows ?? []).map((w, $index) => (<Fragment key={$index}>
                    <span style={{ width: "44px", height: "44px", borderRadius: "8px", background: `${w?.bg ?? ''}`, boxShadow: `${w?.sh ?? ''}`, transition: `all .5s ${w?.d ?? ''}` }} />
                  </Fragment>))}
                </div>
                {" "}
                <span style={{ position: "absolute", left: "50%", bottom: "0", width: "30px", height: "46px", marginLeft: "-15px", background: "#2B1311", borderRadius: "4px 4px 0 0" }} />
                {" "}
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: "14px" }}>
            {(v.plans ?? []).map((p, $index) => (<Fragment key={$index}>
              {" "}
              <div style={{ borderRadius: "26px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px", background: `${p?.bg ?? ''}`, color: `${p?.fg ?? ''}`, border: `2px solid ${p?.bd ?? ''}`, transform: `${p?.tf ?? ''}`, transition: "transform .5s cubic-bezier(.16,1,.3,1),border-color .4s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "22px", fontWeight: "600", letterSpacing: "-0.02em" }}>
                    {p?.name}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#EA580C" }}>
                    {p?.tag}
                  </span>
                </div>
                <span style={{ fontSize: "14px", lineHeight: "1.5", opacity: ".75", minHeight: "42px" }}>
                  {p?.for}
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                  <span style={{ fontSize: "42px", fontWeight: "600", letterSpacing: "-0.04em" }}>
                    {p?.price}
                  </span>
                  <span style={{ fontSize: "13px", opacity: ".7" }}>
                    {p?.unit}
                  </span>
                </div>
                <a href={p?.href} style={{ marginTop: "auto", textAlign: "center", borderRadius: "999px", padding: "13px 18px", fontWeight: "600", fontSize: "14px", background: `${p?.btnBg ?? ''}`, color: `${p?.btnFg ?? ''}` }}>
                  {p?.cta}
                </a>
              </div>
              {" "}
            </Fragment>))}
          </div>
          <span style={{ fontSize: "13px", color: "#A56C55" }}>
            {v.t("Life.finalPricesInclVATCancelAny")}
          </span>
        </div>
      </div>
      <div data-screen-label="Start" style={{ position: "relative", minHeight: "min(86vh,760px)", overflow: "hidden", display: "flex", alignItems: "center", background: "#2B1311" }}>
        <img loading="lazy" decoding="async" src={opt("/images/rialto-life-evening.jpg")} alt={v.t("Life.rialtoRelaxingAtHomeInThe")} style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: "0", background: "linear-gradient(90deg,rgba(43,19,17,.92) 0%,rgba(43,19,17,.6) 45%,rgba(43,19,17,0) 75%)" }} />
        <div style={{ position: "relative", padding: "120px clamp(20px,3vw,40px)", maxWidth: "1480px", width: "100%", margin: "0 auto", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "28px", alignItems: "flex-start", color: "#FFEDD8" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#FDBA74" }}>
            {v.t("Life.n2115DayClosed")}
          </span>
          <h2 style={{ margin: "0", fontFamily: "var(--font-sans)", fontWeight: "400", fontSize: "clamp(43px,5.2vw,85px)", lineHeight: ".95", maxWidth: "640px" }}>
            {v.t("Life.startTomorrowMorning")}
          </h2>
          <p style={{ margin: "0", fontSize: "18px", lineHeight: "1.55", color: "#E8D8C6", maxWidth: "440px" }}>
            {v.t("Life.fourteenDaysFreeYourFirstBriefing")}
          </p>
          <a href={v.signup("plus")} style={{ background: "#EA580C", color: "#FFF7ED", borderRadius: "999px", padding: "17px 28px", fontWeight: "600", fontSize: "15px", animation: "lfBreath 3.6s ease-in-out infinite" }}>
            {v.t("Life.try14DaysFree2")}
          </a>
        </div>
      </div>
      <Footer  />
    </>
  );
};

export default function LifePage(props) {
  const dc = useDC();
  return <Logic key={dc.locale} {...dc} {...props} />;
}
