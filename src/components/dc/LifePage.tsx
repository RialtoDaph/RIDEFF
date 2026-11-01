// @ts-nocheck -- ported 1:1 from rideff_handoff/design/RIDEFF Life.dc.html (see scripts/dc-port/convert.mjs)
'use client';
import React, { Fragment } from 'react';
import { DCLogic, dcStyle, useDC } from '@/lib/dc';
import Nav from '@/components/dc/Nav';
import Footer from '@/components/dc/Footer';

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
  MOM = [[6.5, this.props.t("Life.briefing"), this.props.t("Life.goodMorning"), this.props.t("Life.oneReadThenGoYourDay"), [[this.props.t("Life.weather"), this.props.t("Life.n14Sunny")], [this.props.t("Life.today"), this.props.t("Life.n2Meetings")], [this.props.t("Life.money"), this.props.t("Life.n340Left")]], this.props.t("Life.yourBriefingIsReady")], [9, this.props.t("Life.money"), this.props.t("Life.rentDueFriday"), this.props.t("Life.billsShowUpBeforeTheyBecome"), [[this.props.t("Life.rent"), this.props.t("Life.n890Fri")], [this.props.t("Life.electricity"), this.props.t("Life.n86Paid")], [this.props.t("Life.thisWeek"), this.props.t("Life.n340Left")]], this.props.t("Life.rentTransferPrepared")], [12.6, this.props.t("Life.time"), this.props.t("Life.dentistMoved"), this.props.t("Life.whenAPlanChangesLifeRearranges"), [[this.props.t("Life.dentist"), 'now Thu 10:00'], [this.props.t("Life.gym"), 'moved to 18:30'], [this.props.t("Life.free"), '14:00 – 16:00']], this.props.t("Life.calendarUpdatedForYou")], [16, this.props.t("Life.together"), this.props.t("Life.pickUpMia"), this.props.t("Life.familyThingsLandOnTheRight"), [[this.props.t("Life.leaveIn"), this.props.t("Life.n10Min")], [this.props.t("Life.drive"), this.props.t("Life.n12Min")], ['Anna', this.props.t("Life.getsMilkOnTheWay")]], this.props.t("Life.leaveIn10Min")], [21.2, this.props.t("Life.evening"), this.props.t("Life.closeTheDay"), this.props.t("Life.whatWentWellWhatMovesTo"), [[this.props.t("Life.done"), this.props.t("Life.n6Things")], [this.props.t("Life.moved"), this.props.t("Life.n2ToTomorrow")], [this.props.t("Life.goal"), this.props.t("Life.run3Of4")]], this.props.t("Life.dayClosedSleepWell")]];
  FOUR = [[this.props.t("Life.money"), this.props.t("Life.knowWhatIsLeftWithoutA"), '#E25F00', '#FFF8F0', [[this.props.t("Life.n340LeftThisWeek"), this.props.t("Life.onTrack")], [this.props.t("Life.rent890"), this.props.t("Life.transferReadyForFri")], [this.props.t("Life.subscriptions"), this.props.t("Life.n2YouNeverUse")]]], [this.props.t("Life.time"), this.props.t("Life.yourCalendarRearrangedWhenLifeHappens"), '#2A1E14', '#FFF3E6', [['Free: 14:00 – 16:00', this.props.t("Life.protectedForFocus")], [this.props.t("Life.dentistMoved2"), 'now Thu 10:00'], [this.props.t("Life.evening"), this.props.t("Life.nothingPlannedGood")]]], [this.props.t("Life.goals"), this.props.t("Life.smallStepsNoticedAndCounted"), '#F6D9BC', '#2A1E14', [[this.props.t("Life.run5Km"), this.props.t("Life.n3Of4ThisWeek")], [this.props.t("Life.saveForMayTrip"), this.props.t("Life.n620Of900")], [this.props.t("Life.read"), this.props.t("Life.n12Of20Pages")]]], [this.props.t("Life.home2"), this.props.t("Life.sharedListsSharedBillsSharedDays"), '#FFFAF4', '#2A1E14', [[this.props.t("Life.shoppingList"), this.props.t("Life.n7ItemsAnnaAdded2")], [this.props.t("Life.billsSplit"), this.props.t("Life.electricity5050")], [this.props.t("Life.saturday"), 'family breakfast · 09:00']]]];
  PEOPLE = [['R', this.props.t("Life.you"), this.props.t("Life.ownerSeesEverything"), '#F6D9BC', [[this.props.t("Life.briefing"), '07:00'], [this.props.t("Life.bills"), this.props.t("Life.n2ThisWeek")], [this.props.t("Life.familyPlan"), this.props.t("Life.allSynced")]]], ['A', 'Anna', this.props.t("Life.partnerSharedPrivate"), '#FFD2B0', [[this.props.t("Life.shoppingList"), this.props.t("Life.milkBread")], [this.props.t("Life.splitBill"), this.props.t("Life.n43ToYou")], [this.props.t("Life.dinner"), this.props.t("Life.friWithFriends")]]], ['M', 'Mia', this.props.t("Life.kidJustHerDay"), '#CFE6D6', [[this.props.t("Life.school"), 'ends 15:45'], [this.props.t("Life.piano"), 'Wed 17:00'], [this.props.t("Life.pickUp"), 'Dad · 16:00']]], ['L', 'Leo', this.props.t("Life.kidJustHisDay"), '#D6DEF2', [[this.props.t("Life.football"), 'Sat 10:00'], [this.props.t("Life.homework"), this.props.t("Life.mathSheet")], [this.props.t("Life.allowance"), this.props.t("Life.n5Saved")]]]];
  LM = [{
    n: this.props.t("Life.morning"),
    h: '06–10',
    a: 7,
    b: 9.5,
    img: "/images/rialto-life-morning.jpg",
    pos: '50% 8%',
    alt: this.props.t("Life.rialtoWithCoffeeInTheMorning"),
    temp: '12°',
    line: this.props.t("Life.beforeTheCoffeeCools"),
    chip: ['€', '€340', this.props.t("Life.leftThisWeek")],
    feed: [['06:30', this.props.t("Life.briefingReady30Sec")], ['07:00', this.props.t("Life.rentPaid820")], ['07:15', this.props.t("Life.umbrellaRainAt4")]]
  }, {
    n: this.props.t("Life.day"),
    h: '10–18',
    a: 12,
    b: 16,
    img: "/images/rialto-about-v3.jpg",
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
    img: "/images/rialto-life-evening.jpg",
    pos: '70% 40%',
    alt: this.props.t("Life.rialtoRelaxingOnTheSofaIn"),
    temp: '14°',
    line: this.props.t("Life.andThenNothing"),
    chip: ['◷', '3 h', this.props.t("Life.freeTonight")],
    feed: [['18:30', this.props.t("Life.groceriesDelivered")], ['20:00', this.props.t("Life.tomorrowSorted2Meetings")], ['21:00', this.props.t("Life.nothingElseRest")]]
  }];
  cf(z, L) {
    return ['rotateY(0deg)', 'rotateY(90deg)', 'rotateY(180deg)', 'rotateY(-90deg)', 'rotateX(90deg)', 'rotateX(-90deg)'].map((r, i) => ({
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
        c: '#FF7A1A',
        l: this.props.t("Life.money")
      }, {
        sz: '430px',
        o: '-215px',
        tf: 'rotateX(72deg) rotateY(-14deg)',
        dur: '11s',
        c: '#140D08',
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
        c: '#B0683A',
        l: this.props.t("Life.goals")
      }],
      lmTabs17: this.LM.map((x, k) => ({
        n: x.n,
        h: x.h,
        go: () => go(k),
        sw: k === 2 ? 'url("' + x.img + '")' : ['radial-gradient(circle at 50% 70%,#FFFBF2 0%,#FFB37A 45%,#F07A3A 100%)', 'radial-gradient(circle at 40% 40%,#FF7A1A 0 28%,#DCEBF4 30%,#9EC6E2 100%)'][k],
        bg: k === m ? '#140D08' : '#FFFAF4',
        fg: k === m ? '#FFF3E6' : '#140D08',
        bd: k === m ? '#140D08' : '#E4D3C0',
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
      fmt = v => '€' + v.toFixed(2).replace('.', ',');
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
      hFg: fg ? '#2A1E14' : '#FFF3E6',
      hGlow: 'rgba(255,170,100,' + (.15 + h * .35).toFixed(2) + ')',
      hLine: fg ? 'rgba(42,30,20,.12)' : 'rgba(255,243,230,.15)',
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
      dPast: this.MOM.slice(0, step).map(m => '✓ ' + m[5]).slice(-3),
      sunX: (50 + Math.cos(ang) * 50).toFixed(1) + '%',
      sunY: (100 - Math.sin(ang) * 100).toFixed(1) + '%',
      sunC: dark ? '#C98A5A' : '#FFA35C',
      phRot: (-18 + dpe * 36).toFixed(1) + 'deg',
      dChips: this.MOM.map((m, k) => {
        const on = k === step;
        return {
          t: String(Math.floor(m[0])).padStart(2, '0') + ':' + String(Math.round(m[0] % 1 * 60)).padStart(2, '0'),
          bg: on ? '#2A1E14' : 'transparent',
          fg: on ? '#FFF8F0' : '#5A4636',
          bd: on ? '#2A1E14' : '#D9C7B3',
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
      scrBg: dark ? '#2A1E14' : '#FFFAF4',
      scrFg: dark ? '#FFF3E6' : '#2A1E14',
      scrCard: dark ? '#3A2A1E' : '#F6EDE3',
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
        c: k === 3 ? '#FFF8F0' : 'rgba(255,248,240,.45)',
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
          bd: s.who === k ? '#E25F00' : '#FFFAF4',
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
      vStateC: v > .95 ? '#FF9A50' : '#9A7354',
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
      mBg: y ? 'transparent' : '#2A1E14',
      mFg: y ? '#5A4636' : '#FFF8F0',
      yBg: y ? '#2A1E14' : 'transparent',
      yFg: y ? '#FFF8F0' : '#5A4636',
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
          href: this.props.href("@lifedemo"),
          bg: hi ? '#2A1E14' : '#FFFAF4',
          fg: hi ? '#FFF8F0' : '#2A1E14',
          btnBg: hi ? '#E25F00' : '#2A1E14',
          btnFg: '#FFF8F0',
          bd: best ? '#E25F00' : 'transparent',
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
        fg: '#2A1E14',
        btnBg: 'transparent',
        btnFg: '#2A1E14',
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
      <style dangerouslySetInnerHTML={{ __html: "body{margin:0;background:#FBF4EC;color:#2A1E14;font-family:var(--font-sans);-webkit-font-smoothing:antialiased}\na{color:inherit;text-decoration:none}a:hover{color:#E25F00}\n@keyframes lfIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}\n@keyframes lfFly{0%{opacity:0;transform:translate(-30px,30px) scale(.85) rotate(-6deg)}20%{opacity:1;transform:translate(0,0) scale(1) rotate(0)}100%{opacity:1;transform:none}}\n@keyframes lfBreath{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(226,95,0,.35)}50%{transform:scale(1.03);box-shadow:0 0 0 14px rgba(226,95,0,0)}}\n@keyframes lfOrbit{to{transform:rotate(360deg)}}\n@keyframes lfOrbitR{to{transform:translate(-50%,-50%) rotate(-360deg)}}\n@keyframes lfFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}\n@keyframes lfHand{to{transform:rotate(360deg)}}\n@keyframes lfCheck{0%,40%{background:transparent;color:transparent}60%,100%{background:#FF7A1A;color:#140D08}}\n@keyframes lfTag{0%{opacity:0;transform:rotate(180deg) translateY(-14px);filter:blur(6px)}100%{opacity:1;transform:rotate(180deg);filter:blur(0)}}\n@keyframes lfSpin{from{transform:rotateX(-22deg) rotateY(0)}to{transform:rotateX(-22deg) rotateY(360deg)}}\n@keyframes lfOrb{to{transform:rotate(360deg)}}\n@keyframes lfOrbR{from{transform:rotate(0) rotateX(-72deg)}to{transform:rotate(-360deg) rotateX(-72deg)}}\n@keyframes lfSunUp{0%,100%{transform:translateY(50px)}50%{transform:translateY(-10px)}}\n@keyframes lfGrid{to{background-position:0 80px,0 0}}\n@keyframes lfBar{0%,100%{transform:scaleY(.55)}50%{transform:scaleY(1)}}" }} />
      <Nav active="life" />
      <div style={{ background: "#F3ECE2" }}>
        <div data-screen-label="Hero" style={{ background: "#F3ECE2", color: "#140D08", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "clamp(24px,3vw,36px)", padding: "84px clamp(10px,1.2vw,16px) clamp(48px,6vw,80px)", maxWidth: "1520px", margin: "0 auto" }}>
          <div style={{ position: "relative", height: "clamp(460px,62vh,580px)", borderRadius: "28px", overflow: "hidden", background: "#2A1E14", flexShrink: "0" }}>
            {" "}
            <div style={{ position: "absolute", inset: "0", opacity: `${v.s17m ?? ''}`, transition: "opacity 1.2s ease", overflow: "hidden", background: "linear-gradient(180deg,#FFE6C8 0%,#FFB37A 48%,#F07A3A 100%)" }}>
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
                      <span style={{ position: "absolute", inset: "0", transform: `${fc?.tf ?? ''}`, background: "linear-gradient(135deg,rgba(255,248,238,.55),rgba(255,248,238,.12))", border: "1.5px solid rgba(255,248,238,.85)", borderRadius: "18px", boxShadow: "inset 0 0 40px rgba(255,180,110,.5)", backfaceVisibility: "visible", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: "13px", letterSpacing: ".12em", textTransform: "uppercase", color: "#7A2E00", fontWeight: "600" }}>
                        {fc?.l}
                      </span>
                    </Fragment>))}
                    <span style={{ position: "absolute", left: "50%", top: "50%", width: "56px", height: "56px", margin: "-28px 0 0 -28px", borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#FFE0B8,#FF7A1A 60%,#C24A00)", boxShadow: "0 0 40px rgba(255,122,26,.8)" }} />
                  </div>
                </div>
              </div>
              {" "}
              <div style={{ position: "absolute", left: "58%", top: "16%", width: "70px", height: "70px", perspective: "600px" }}>
                <div style={{ position: "absolute", inset: "0", transformStyle: "preserve-3d", animation: "lfSpin 10s linear infinite reverse" }}>
                  {(v.cubeFacesS ?? []).map((fc, $index) => (<Fragment key={$index}>
                    <span style={{ position: "absolute", inset: "0", transform: `${fc?.tf ?? ''}`, background: "linear-gradient(135deg,rgba(255,248,238,.55),rgba(255,248,238,.12))", border: "1.5px solid rgba(255,248,238,.85)", borderRadius: "18px", boxShadow: "inset 0 0 40px rgba(255,180,110,.5)", backfaceVisibility: "visible", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: "13px", letterSpacing: ".12em", textTransform: "uppercase", color: "#7A2E00", fontWeight: "600" }}>
                      {fc?.l}
                    </span>
                  </Fragment>))}
                </div>
              </div>
              {" "}
              <div style={{ position: "absolute", left: "36%", top: "64%", width: "54px", height: "54px", perspective: "600px" }}>
                <div style={{ position: "absolute", inset: "0", transformStyle: "preserve-3d", animation: "lfSpin 12s linear infinite" }}>
                  {(v.cubeFacesXS ?? []).map((fc, $index) => (<Fragment key={$index}>
                    <span style={{ position: "absolute", inset: "0", transform: `${fc?.tf ?? ''}`, background: "linear-gradient(135deg,rgba(255,248,238,.55),rgba(255,248,238,.12))", border: "1.5px solid rgba(255,248,238,.85)", borderRadius: "18px", boxShadow: "inset 0 0 40px rgba(255,180,110,.5)", backfaceVisibility: "visible", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: "13px", letterSpacing: ".12em", textTransform: "uppercase", color: "#7A2E00", fontWeight: "600" }}>
                      {fc?.l}
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
                    <div style={{ position: "absolute", inset: "0", borderRadius: "50%", border: "1.5px solid rgba(20,13,8,.22)" }} />
                    <div style={{ position: "absolute", inset: "0", transformStyle: "preserve-3d", animation: `lfOrb ${r?.dur ?? ''} linear infinite` }}>
                      <div style={{ position: "absolute", left: "50%", top: "0", width: "0", height: "0", transformStyle: "preserve-3d", animation: `lfOrbR ${r?.dur ?? ''} linear infinite` }}>
                        <span style={{ position: "absolute", left: "-14px", top: "-14px", width: "28px", height: "28px", borderRadius: "50%", background: `radial-gradient(circle at 35% 30%,#FFFFFF,${r?.c ?? ''} 65%)`, boxShadow: `0 0 18px ${r?.c ?? ''}` }} />
                        <span style={{ position: "absolute", left: "20px", top: "-12px", background: "#FFFAF4", color: "#140D08", borderRadius: "999px", padding: "4px 10px", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: "0 6px 14px rgba(20,13,8,.15)" }}>
                          {r?.l}
                        </span>
                      </div>
                    </div>
                  </div>
                </Fragment>))}
                {" "}
                <div style={{ position: "absolute", left: "-75px", top: "-75px", width: "150px", height: "150px", borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#FFE6C8 0%,#FF7A1A 45%,#B84300 100%)", boxShadow: "0 30px 60px rgba(184,67,0,.35),0 0 80px rgba(255,122,26,.45)", animation: "lfFloat 6s ease-in-out infinite", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "600", letterSpacing: "-0.03em", color: "#FFF8EE" }}>
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
            <div style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg,rgba(20,13,8,.25) 0%,rgba(20,13,8,0) 30%,rgba(20,13,8,0) 60%,rgba(20,13,8,.45) 100%)" }} />
            {" "}
            <div style={{ position: "absolute", left: "22px", top: "22px", zIndex: "3", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
              <span key={v.lmKey} style={{ animation: "lfTag .7s cubic-bezier(.16,1,.3,1) .3s both", writingMode: "vertical-rl", transform: "rotate(180deg)", background: "#FFF8EE", color: "#140D08", borderRadius: "999px", padding: "20px 12px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".14em", textTransform: "uppercase" }}>
                {v.t("Life.lifeX", { x: v.lmName })}
              </span>
              <a href={v.href("@lifedemo")} style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#FF7A1A", color: "#140D08", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                {"↗"}
              </a>
            </div>
            {" "}
            <div style={{ position: "absolute", left: "96px", top: "96px", width: "330px", display: `${v.hWide ?? ''}`, flexDirection: "column", gap: "8px", zIndex: "2" }}>
              {(v.lmFeed ?? []).map((f, $index) => (<Fragment key={$index}>
                <div key={f?.k} style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,248,238,.92)", backdropFilter: "blur(12px)", borderRadius: "16px", padding: "10px 14px 10px 10px", boxShadow: "0 14px 30px rgba(20,10,0,.18)", animation: `lfIn .7s cubic-bezier(.16,1,.3,1) ${f?.dl ?? ''} both` }}>
                  <span style={{ width: "30px", height: "30px", borderRadius: "50%", border: "2px solid #FF7A1A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", flexShrink: "0", animation: `lfCheck 2.2s ease ${f?.dl ?? ''} both` }}>
                    {"✓"}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#B0683A", width: "42px", flexShrink: "0" }}>
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
              <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#FF7A1A", borderRadius: "14px", padding: "8px 18px 8px 8px", whiteSpace: "nowrap", animation: "lfFloat 5s ease-in-out infinite" }}>
                <span style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#140D08", color: "#FF9A50", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>
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
              <div style={{ height: "56px", borderRadius: "999px", background: "#140D08", color: "#FFF3E6", display: "flex", alignItems: "center", gap: "14px", padding: "0 22px 0 8px" }}>
                <span style={{ width: "40px", height: "40px", borderRadius: "50%", background: `conic-gradient(#FF7A1A ${v.lmDeg ?? ''},#3A2A1E 0)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#140D08" }} />
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
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#B0683A" }}>
                {v.capN}{" · "}{v.lmName}
              </span>
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "30px", lineHeight: "1", color: "#140D08" }}>
                {v.capT}
              </span>
              <span style={{ fontSize: "14px", lineHeight: "1.45", color: "#3A2E24", textWrap: "pretty" }}>
                {v.capL}
              </span>
            </div>
            {" "}
            <div style={{ position: "absolute", left: "0", bottom: "0", zIndex: "3", background: "#F3ECE2", borderTopRightRadius: "28px", padding: "14px 14px 0 0", display: "flex", gap: "8px" }}>
              <span style={{ position: "absolute", left: "0", bottom: "100%", width: "28px", height: "28px", background: "radial-gradient(circle at 100% 0,transparent 27.5px,#F3ECE2 28px)" }} />
              <span style={{ position: "absolute", left: "100%", bottom: "0", width: "28px", height: "28px", background: "radial-gradient(circle at 100% 0,transparent 27.5px,#F3ECE2 28px)" }} />
              {(v.lmTabs17 ?? []).map((t, $index) => (<Fragment key={$index}>
                <button onClick={t?.go} style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px", background: `${t?.bg ?? ''}`, color: `${t?.fg ?? ''}`, border: `1px solid ${t?.bd ?? ''}`, borderRadius: "999px", padding: "6px 20px 6px 6px", cursor: "pointer", overflow: "hidden", fontFamily: "var(--font-sans)", transition: "background .4s,color .4s" }}>
                  <span style={{ width: "52px", height: "52px", borderRadius: "50%", overflow: "hidden", flexShrink: "0", background: `${t?.sw ?? ''}`, backgroundSize: "cover", backgroundPosition: "center" }} />
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
                    <span style={{ fontSize: "15px", fontWeight: "600" }}>
                      {t?.n}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", opacity: ".7" }}>
                      {t?.h}
                    </span>
                  </span>
                  <span style={{ position: "absolute", left: "0", bottom: "0", height: "3px", width: `${t?.w ?? ''}`, background: "#FF7A1A" }} />
                </button>
              </Fragment>))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "28px 56px", alignItems: "center", padding: "0 clamp(8px,2.4vw,40px)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <span style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "10px", background: "#FF7A1A", borderRadius: "999px", padding: "6px 18px 6px 6px", fontSize: "16px", fontWeight: "600", whiteSpace: "nowrap" }}>
                <span style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#140D08", color: "#FF9A50", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                  {"✓"}
                </span>
                {v.t("Life.xToday", { x: v.lmCount })}
              </span>
              <h1 style={{ margin: "0", fontSize: "clamp(46px,5.6vw,84px)", lineHeight: ".92", letterSpacing: "-0.055em", fontWeight: "600", textWrap: "balance" }}>
                {v.t("Life.yourLifeRemembered")}
                <br />
                {v.t("Life.sorted")}{" "}
                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", letterSpacing: "-0.02em", color: "#FF7A1A" }}>
                  {v.t("Life.lived")}
                </span>
              </h1>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              <p style={{ margin: "0", maxWidth: "480px", fontSize: "19px", lineHeight: "1.5", color: "#3A2E24", textWrap: "pretty" }}>
                {v.t("Life.lifeKeepsTrackOfBillsAppointments")}
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <a href={v.href("@lifedemo")} style={{ background: "#140D08", color: "#FFF3E6", borderRadius: "999px", padding: "17px 26px", fontWeight: "600", fontSize: "13px", letterSpacing: ".08em", textTransform: "uppercase" }} className="hv-6842cf6">
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
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#E25F00" }}>
              {v.t("Life.n01ADayWithLife")}
            </div>
            <h2 style={{ margin: "0", fontSize: "clamp(36px,4.2vw,64px)", lineHeight: "1", letterSpacing: "-0.04em", fontWeight: "600", textWrap: "balance" }}>
              {v.t("Life.itShowsUpWhenItHelps")}{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400" }}>
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
              <span style={{ position: "absolute", left: "0", bottom: "-4px", fontFamily: "var(--font-mono)", fontSize: "10px", color: "#9A7354" }}>
                {"06:00"}
              </span>
              <span style={{ position: "absolute", right: "0", bottom: "-4px", fontFamily: "var(--font-mono)", fontSize: "10px", color: "#9A7354" }}>
                {"22:00"}
              </span>
              {" "}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(52px,5.4vw,84px)", lineHeight: "1", color: "#E25F00", fontVariantNumeric: "tabular-nums" }}>
                {v.dClock}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#9A7354" }}>
                {v.dTag}
              </span>
            </div>
            <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.6", color: "#5A4636", maxWidth: "440px", minHeight: "56px" }}>
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
          <div style={{ position: "relative", height: "min(70vh,600px)", minHeight: "480px", perspective: "1600px" }}>
            {" "}
            <div style={{ position: "absolute", left: "50%", top: "50%", width: "min(280px,64%)", aspectRatio: "9/18.5", transform: `translate(-50%,-50%) rotateY(${v.phRot ?? ''}) rotateX(6deg)`, transformStyle: "preserve-3d", transition: "transform .3s ease-out" }}>
              {" "}
              <div style={{ position: "absolute", inset: "0", borderRadius: "42px", background: "#2A1E14", boxShadow: "0 50px 90px -30px rgba(80,40,10,.5),inset 0 0 0 2px #4A3828" }} />
              {" "}
              <div style={{ position: "absolute", inset: "10px", borderRadius: "34px", overflow: "hidden", background: `${v.scrBg ?? ''}`, color: `${v.scrFg ?? ''}`, transition: "background .6s,color .6s", display: "flex", flexDirection: "column", padding: "44px 18px 18px", gap: "12px", boxSizing: "border-box" }}>
                <span style={{ position: "absolute", left: "50%", top: "12px", width: "80px", height: "22px", borderRadius: "12px", background: "#2A1E14", transform: "translateX(-50%)" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "10px", opacity: ".6" }}>
                  <span>
                    {v.dClock}
                  </span>
                  <span>
                    {"RIDEFF Life"}
                  </span>
                </div>
                <div key={v.dStep} style={{ display: "flex", flexDirection: "column", gap: "12px", animation: "lfIn .6s cubic-bezier(.16,1,.3,1) both" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#E25F00" }}>
                    {v.dTag}
                  </span>
                  <b style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", fontSize: "32px", lineHeight: "1" }}>
                    {v.dHead}
                  </b>
                  {(v.dRows ?? []).map((r, $index) => (<Fragment key={$index}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", padding: "11px 12px", borderRadius: "14px", background: `${v.scrCard ?? ''}`, fontSize: "12px" }}>
                      <span style={{ opacity: ".7" }}>
                        {r?.k}
                      </span>
                      <b>
                        {r?.v}
                      </b>
                    </div>
                  </Fragment>))}
                </div>
              </div>
              {" "}
            </div>
            {" "}
            <div key={v.dStep} style={{ position: "absolute", right: "0", top: "12%", zIndex: "3", maxWidth: "240px", background: "#FFFAF4", borderRadius: "18px", padding: "14px 16px", display: "flex", gap: "12px", alignItems: "center", boxShadow: "0 20px 40px rgba(80,40,10,.18)", animation: "lfFly 1s cubic-bezier(.16,1,.3,1) both" }}>
              <span style={{ width: "34px", height: "34px", borderRadius: "10px", background: "#E25F00", color: "#FFF8F0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "18px", flexShrink: "0" }}>
                {"L"}
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <b style={{ fontSize: "13px" }}>
                  {v.dNote}
                </b>
                <span style={{ fontSize: "11px", color: "#9A7354" }}>
                  {v.t("Life.nowLife")}
                </span>
              </span>
            </div>
            {" "}
            <div style={{ position: "absolute", left: "0", bottom: "6%", display: "flex", flexDirection: "column", gap: "6px", zIndex: "3" }}>
              {(v.dPast ?? []).map((p, $index) => (<Fragment key={$index}>
                <span style={{ background: "rgba(255,250,244,.9)", border: "1px solid #EFE2D3", borderRadius: "999px", padding: "7px 12px", fontSize: "12px", color: "#5A4636", animation: "lfIn .5s both" }}>
                  {p}
                </span>
              </Fragment>))}
            </div>
            {" "}
          </div>
        </div>
      </div>
      <div data-screen-label="02 Four things" style={{ padding: "140px clamp(20px,3vw,40px) 0", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "44px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "32px", alignItems: "end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#E25F00" }}>
              {v.t("Life.n02FourThingsOnePlace")}
            </div>
            <h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: "1", letterSpacing: "-0.04em", fontWeight: "600", textWrap: "balance" }}>
              {v.t("Life.moneyTimeGoals")}{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400" }}>
                {v.t("Life.home")}
              </span>
            </h2>
          </div>
          <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.6", color: "#5A4636", maxWidth: "440px" }}>
            {v.t("Life.hoverOrTapACardTo")}
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,250px),1fr))", gap: "14px" }}>
          {(v.four ?? []).map((c, $index) => (<Fragment key={$index}>
            {" "}
            <div onMouseEnter={c?.over} onMouseLeave={c?.out} onClick={c?.tap} style={{ position: "relative", height: "340px", perspective: "1400px", cursor: "pointer" }}>
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
                        <span style={{ position: "absolute", left: "50%", top: "50%", width: "2px", height: "50px", marginLeft: "-1px", background: "#E25F00", transformOrigin: "50% 0", animation: "lfHand 6s linear infinite" }} />
                        <span style={{ position: "absolute", left: "50%", top: "50%", width: "8px", height: "8px", margin: "-4px", borderRadius: "50%", background: "currentColor" }} />
                      </div>
                    </>) : null}
                    {c?.isGoal ? (<>
                      <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: `conic-gradient(#E25F00 ${v.goalPct ?? ''},rgba(255,255,255,.25) 0)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ width: "92px", height: "92px", borderRadius: "50%", background: `${c?.bg ?? ''}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "30px" }}>
                          {v.goalTxt}
                        </span>
                      </div>
                    </>) : null}
                    {c?.isHome ? (<>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,40px)", gap: "8px" }}>
                        {(v.homeDots ?? []).map((h, $index) => (<Fragment key={$index}>
                          <span style={{ width: "40px", height: "40px", borderRadius: "50%", background: `${h?.c ?? ''}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "600", color: "#2A1E14", animation: `lfFloat 4s ease-in-out ${h?.d ?? ''} infinite` }}>
                            {h?.t}
                          </span>
                        </Fragment>))}
                      </div>
                    </>) : null}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <b style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", fontSize: "44px", lineHeight: "1" }}>
                      {c?.t}
                    </b>
                    <span style={{ fontSize: "14px", opacity: ".75" }}>
                      {c?.d}
                    </span>
                  </div>
                </div>
                {" "}
                <div style={{ position: "absolute", inset: "0", borderRadius: "28px", background: "#FFFAF4", border: "1px solid #EFE2D3", padding: "26px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "12px", transform: "rotateY(180deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#B0784A" }}>
                    {v.t("Life.xToday2", { x: c?.t })}
                  </span>
                  {(c?.back ?? []).map((r, $index) => (<Fragment key={$index}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "3px", padding: "12px 14px", borderRadius: "16px", background: "#F6EDE3" }}>
                      <span style={{ fontSize: "15px", fontWeight: "500" }}>
                        {r?.a}
                      </span>
                      <span style={{ fontSize: "13px", color: "#9A7354" }}>
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
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#E25F00" }}>
            {v.t("Life.n03Together")}
          </div>
          <h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: "1", letterSpacing: "-0.04em", fontWeight: "600", textWrap: "balance" }}>
            {v.t("Life.oneHome")}{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400" }}>
              {v.t("Life.everyoneOnTheSamePage")}
            </span>
          </h2>
          <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.6", color: "#5A4636", maxWidth: "460px" }}>
            {v.t("Life.sharedCalendarSharedShoppingListSplit")}
          </p>
          <div style={{ background: "#FFFAF4", borderRadius: "24px", padding: "22px", display: "flex", flexDirection: "column", gap: "10px", boxShadow: "0 20px 50px rgba(80,40,10,.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ width: "38px", height: "38px", borderRadius: "50%", background: `${v.tSel?.c ?? ''}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600" }}>
                {v.tSel?.t}
              </span>
              <span style={{ display: "flex", flexDirection: "column" }}>
                <b style={{ fontSize: "17px" }}>
                  {v.tSel?.name}
                </b>
                <span style={{ fontSize: "12px", color: "#9A7354" }}>
                  {v.tSel?.role}
                </span>
              </span>
            </div>
            {(v.tSel?.rows ?? []).map((r, $index) => (<Fragment key={$index}>
              <div key={v.tSel?.name} style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "11px 14px", borderRadius: "14px", background: "#F6EDE3", fontSize: "14px", animation: "lfIn .45s both" }}>
                <span>
                  {r?.a}
                </span>
                <span style={{ color: "#9A7354" }}>
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
                  <line x1="50" y1="50" x2={p?.lx} y2={p?.ly} stroke="#E25F00" strokeWidth=".5" strokeDasharray="1.5 1.5" style={{ opacity: `${v.tLink ?? ''}`, transition: "opacity .6s" }} />
                </Fragment>))}
                {" "}
              </svg>
              {" "}
              {(v.people ?? []).map((p, $index) => (<Fragment key={$index}>
                {" "}
                <button onClick={p?.go} style={{ position: "absolute", left: `${p?.x ?? ''}`, top: `${p?.y ?? ''}`, width: "76px", height: "76px", borderRadius: "50%", border: `3px solid ${p?.bd ?? ''}`, background: `${p?.c ?? ''}`, cursor: "pointer", font: "600 18px var(--font-sans)", color: "#2A1E14", animation: "lfOrbitR 60s linear infinite", boxShadow: "0 14px 30px rgba(80,40,10,.15)", transform: "translate(-50%,-50%)" }}>
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
                <span style={{ position: "absolute", left: "0", right: "0", top: "0", height: "40px", background: "#E25F00", clipPath: "polygon(50% 0,100% 100%,0 100%)" }} />
                {" "}
                <span style={{ position: "absolute", left: "10px", right: "10px", top: "40px", bottom: "0", background: "#FFFAF4", borderRadius: "0 0 8px 8px", boxShadow: "0 20px 40px rgba(80,40,10,.18)" }} />
                {" "}
                <span style={{ position: "absolute", left: "40px", width: "16px", bottom: "0", height: "24px", background: "#2A1E14", borderRadius: "3px 3px 0 0" }} />
                {" "}
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#9A7354" }}>
                {v.t("Life.together4")}
              </span>
            </div>
            {" "}
          </div>
          {" "}
        </div>
      </div>
      <div ref={v.vaultRef} data-screen-label="04 Privacy" style={{ marginTop: "140px", background: "#2A1E14", color: "#FFF3E6" }}>
        {" "}
        <div style={{ padding: "120px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "48px", alignItems: "center" }}>
          <div style={{ position: "relative", height: "clamp(420px,40vw,520px)", perspective: "1400px", order: "0" }}>
            {" "}
            {(v.vChips ?? []).map((c, $index) => (<Fragment key={$index}>
              <span style={{ position: "absolute", left: `${c?.x ?? ''}`, top: `${c?.y ?? ''}`, transform: `translate(-50%,-50%) scale(${c?.s ?? ''})`, opacity: `${c?.op ?? ''}`, background: "#3A2A1E", border: "1px solid #5A4636", borderRadius: "999px", padding: "9px 15px", fontSize: "13px", whiteSpace: "nowrap", zIndex: "1" }}>
                {c?.t}
              </span>
            </Fragment>))}
            {" "}
            <div style={{ position: "absolute", left: "50%", top: "50%", width: "min(300px,64%)", aspectRatio: "1", transform: "translate(-50%,-50%)", borderRadius: "36px", background: "linear-gradient(145deg,#4A3828,#2E2218)", boxShadow: "inset 0 0 0 2px #5A4636,0 40px 80px rgba(0,0,0,.45)", zIndex: "2" }}>
              {" "}
              <div style={{ position: "absolute", inset: "14%", borderRadius: "50%", background: "#1E150F", boxShadow: "inset 0 0 0 2px #5A4636" }} />
              {" "}
              <div style={{ position: "absolute", inset: "14%", borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#6A5240,#3A2A1E 70%)", boxShadow: "0 0 0 2px #7A6048,0 20px 40px rgba(0,0,0,.4)", transformOrigin: "0 50%", transform: `${v.vDoor ?? ''}`, transition: "transform .2s linear", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "42%", aspectRatio: "1", borderRadius: "50%", border: "3px solid #E25F00", transform: `rotate(${v.vDial ?? ''})`, position: "relative" }}>
                  <span style={{ position: "absolute", left: "50%", top: "-3px", width: "3px", height: "30%", marginLeft: "-1.5px", background: "#E25F00" }} />
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
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF9A50" }}>
              {v.t("Life.n04PrivateByDesign")}
            </div>
            <h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: "1", letterSpacing: "-0.04em", fontWeight: "600", textWrap: "balance" }}>
              {v.t("Life.yourLifeStays")}{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", color: "#FF9A50" }}>
                {v.t("Life.yours")}
              </span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #4A3828" }}>
              {(v.priv ?? []).map((p, $index) => (<Fragment key={$index}>
                <div style={{ display: "grid", gridTemplateColumns: "40px minmax(0,1fr)", gap: "14px", padding: "18px 0", borderBottom: "1px solid #4A3828", opacity: `${p?.op ?? ''}`, transform: `${p?.tf ?? ''}`, transition: "opacity .5s,transform .6s cubic-bezier(.16,1,.3,1)" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF9A50", paddingTop: "4px" }}>
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
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#E25F00" }}>
                {v.t("Life.n05Plans")}
              </div>
              <h2 style={{ margin: "0", fontSize: "clamp(38px,4.6vw,68px)", lineHeight: "1", letterSpacing: "-0.04em", fontWeight: "600" }}>
                {v.t("Life.pickTheSizeOf")}{" "}
                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400" }}>
                  {v.t("Life.yourLife")}
                </span>
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "420px" }}>
                <span style={{ fontSize: "15px", color: "#5A4636" }}>
                  {v.t("Life.howManyPeopleLiveWithYou")}{" "}
                  <b style={{ color: "#2A1E14" }}>
                    {v.ppl}
                  </b>
                </span>
                <input type="range" min="1" max="4" step="1" value={v.ppl ?? ''} onChange={v.setPpl} style={{ width: "100%", accentColor: "#E25F00" }} />
                <span style={{ fontSize: "14px", color: "#5A4636" }}>
                  {v.t("Life.bestFit")}{" "}
                  <b style={{ color: "#E25F00" }}>
                    {v.fitName}
                  </b>
                </span>
              </div>
              <div style={{ display: "flex", gap: "4px", padding: "4px", borderRadius: "999px", background: "#F6EDE3", width: "max-content" }}>
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
                <span style={{ position: "absolute", left: "-6%", right: "-6%", top: "0", height: "90px", background: "#E25F00", clipPath: "polygon(50% 0,100% 100%,0 100%)" }} />
                {" "}
                <span style={{ position: "absolute", left: "0", right: "0", top: "90px", bottom: "0", background: "#FFFAF4", borderRadius: "0 0 14px 14px", boxShadow: "0 30px 60px rgba(80,40,10,.18)" }} />
                {" "}
                <div style={{ position: "absolute", left: "12px", right: "12px", top: "108px", display: "flex", justifyContent: "center", gap: "12px" }}>
                  {(v.windows ?? []).map((w, $index) => (<Fragment key={$index}>
                    <span style={{ width: "44px", height: "44px", borderRadius: "8px", background: `${w?.bg ?? ''}`, boxShadow: `${w?.sh ?? ''}`, transition: `all .5s ${w?.d ?? ''}` }} />
                  </Fragment>))}
                </div>
                {" "}
                <span style={{ position: "absolute", left: "50%", bottom: "0", width: "30px", height: "46px", marginLeft: "-15px", background: "#2A1E14", borderRadius: "4px 4px 0 0" }} />
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
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#E25F00" }}>
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
          <span style={{ fontSize: "13px", color: "#9A7354" }}>
            {v.t("Life.finalPricesInclVATCancelAny")}
          </span>
        </div>
      </div>
      <div data-screen-label="Start" style={{ position: "relative", minHeight: "min(86vh,760px)", overflow: "hidden", display: "flex", alignItems: "center", background: "#2A1E14" }}>
        <img src="/images/rialto-life-evening.jpg" alt={v.t("Life.rialtoRelaxingAtHomeInThe")} style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: "0", background: "linear-gradient(90deg,rgba(42,30,20,.92) 0%,rgba(42,30,20,.6) 45%,rgba(42,30,20,0) 75%)" }} />
        <div style={{ position: "relative", padding: "120px clamp(20px,3vw,40px)", maxWidth: "1480px", width: "100%", margin: "0 auto", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "28px", alignItems: "flex-start", color: "#FFF3E6" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#FF9A50" }}>
            {v.t("Life.n2115DayClosed")}
          </span>
          <h2 style={{ margin: "0", fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: "400", fontSize: "clamp(52px,6.4vw,104px)", lineHeight: ".95", maxWidth: "640px" }}>
            {v.t("Life.startTomorrowMorning")}
          </h2>
          <p style={{ margin: "0", fontSize: "18px", lineHeight: "1.55", color: "#E8D8C6", maxWidth: "440px" }}>
            {v.t("Life.fourteenDaysFreeYourFirstBriefing")}
          </p>
          <a href={v.href("@lifedemo")} style={{ background: "#E25F00", color: "#FFF8F0", borderRadius: "999px", padding: "17px 28px", fontWeight: "600", fontSize: "15px", animation: "lfBreath 3.6s ease-in-out infinite" }}>
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
