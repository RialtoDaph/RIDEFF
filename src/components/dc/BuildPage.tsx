// @ts-nocheck -- ported 1:1 from rideff_handoff/design/RIDEFF Build.dc.html (see scripts/dc-port/convert.mjs)
'use client';
import React, { Fragment } from 'react';
import { DCLogic, dcStyle, opt, press, useDC } from '@/lib/dc';
import Nav from '@/components/dc/Nav';
import { ImageSlot } from '@/lib/dc';
import Footer from '@/components/dc/Footer';
import PillarClose from '@/components/home/PillarClose';
import BrainRollout from '@/components/dc/BrainRollout';
import { num } from '@/lib/format';

class Logic extends DCLogic {
  state = {
    cap: 0,
    prog: 0,
    typed: 0,
    ce: [0, 0, 0],
    cp: 0,
    lp: 0,
    jp: 0,
    al: 0,
    pin: false
  };
  canvasRef = React.createRef();
  stageRef = React.createRef();
  termRef = React.createRef();
  casesRef = React.createRef();
  collapseRef = React.createRef();
  layersRef = React.createRef();
  journeyRef = React.createRef();
  COL = ['#FF9E47', '#9E8CF2', '#61CC80', '#54B0E6', '#E0B842', '#EB7AAB'];
  TOOLS = [['SP', this.props.t("Build.spreadsheet"), this.props.t("Build.free"), this.props.t("Build.customersPrices"), this.props.t("Build.n3Versions")], ['IN', this.props.t("Build.inbox"), this.props.t("Build.n8Mo"), this.props.t("Build.inquiriesOffers"), this.props.t("Build.lostThreads")], ['CH', this.props.t("Build.chatApp"), '–', this.props.t("Build.ordersOnWhatsApp"), this.props.t("Build.noHistory")], ['BK', this.props.t("Build.bookingTool"), this.props.t("Build.n39Mo"), this.props.t("Build.appointments"), this.props.t("Build.doesnTSync")], ['IV', this.props.t("Build.invoicingApp"), this.props.t("Build.n19Mo"), this.props.t("Build.invoicesReminders"), this.props.t("Build.typedTwice")], ['SH', this.props.t("Build.shopSoftware"), this.props.t("Build.n49Mo"), this.props.t("Build.productsStock"), this.props.t("Build.ownLogin")]];
  FAN = [[-95, -85, -60, -8], [15, -120, 50, 6], [95, -35, -30, 10], [-100, 55, 40, -6], [-5, 85, 90, -3], [90, 100, -40, 8]];
  LAYERS = [[this.props.t("Build.apps"), this.props.t("Build.whatYourTeamYourClientsAnd"), [this.props.t("Build.teamApp"), this.props.t("Build.clientPortal"), this.props.t("Build.dashboard"), this.props.t("Build.website")]], [this.props.t("Build.aIAgents"), this.props.t("Build.theyReadSortDraftAndSummarise"), [this.props.t("Build.replyAgent"), this.props.t("Build.offerAgent"), this.props.t("Build.reportAgent")]], [this.props.t("Build.automations"), this.props.t("Build.rulesThatMoveRoutineWorkOn"), [this.props.t("Build.triggers"), this.props.t("Build.reminders"), this.props.t("Build.schedules"), this.props.t("Build.approvals")]], [this.props.t("Build.dataCore"), this.props.t("Build.oneDatabaseForCustomersOrdersJobs"), [this.props.t("Build.customers"), this.props.t("Build.orders"), this.props.t("Build.jobs"), this.props.t("Build.invoices")]], [this.props.t("Build.entryPoints"), this.props.t("Build.everyWayACustomerReachesYou"), [this.props.t("Build.website"), this.props.t("Build.shop"), 'WhatsApp', this.props.t("Build.email"), this.props.t("Build.forms")]], [this.props.t("Build.integrations"), this.props.t("Build.theServicesYouKeepUsingWired"), ['Stripe', 'DATEV', 'DHL', 'Google', 'Microsoft']]];
  LCOL = ['#FF6A00', '#9E8CF2', '#61CC80', '#54B0E6', '#E0B842', '#EB7AAB'];
  STEPS = [['09:12', 4, this.props.t("Build.requestComesIn"), this.props.t("Build.canYouCater40PeopleOn")], ['09:12', 3, this.props.t("Build.matchedToCustomer"), this.props.t("Build.knownCustomerCafeLindnerThreePast")], ['09:13', 1, this.props.t("Build.replyOfferDrafted"), this.props.t("Build.anAgentWritesTheAnswerIn")], ['09:20', -1, this.props.t("Build.youApprove"), this.props.t("Build.oneTapInYourDashboardIt")], [this.props.t("Build.sat"), 0, this.props.t("Build.teamScheduled"), this.props.t("Build.shiftForThreeCreatedPackingList")], [this.props.t("Build.mon"), 2, this.props.t("Build.invoiceReport"), this.props.t("Build.invoiceR2026052SentPaid")]];
  CASES = [{
    kind: this.props.t("Build.fashionLabelGermany"),
    t: 'TIC Originals',
    d: this.props.t("Build.caseSummaryPlaceholderWhatTICOriginals"),
    bullets: [this.props.t("Build.highlight1EGStorefrontWith"), this.props.t("Build.highlight2EGOrdersFlow"), this.props.t("Build.highlight3EGFastPages"), this.props.t("Build.highlight4EGMaintainedMonthly")],
    chips: ['Next.js', 'Stripe', 'Klarna', 'Supabase'],
    stats: [[this.props.t("Build.paymentMethods"), '6'], [this.props.t("Build.languages"), '2'], [this.props.t("Build.hosting"), 'EU']],
    link: 'ticoriginals.com',
    href: this.props.href("/build/web-shops"),
    phUi: this.props.t("Build.tICHomepageScreenshot"),
    phSys: this.props.t("Build.tICShopAdminScreenshot"),
    spec: [['client', 'TIC Originals'], ['scope', this.props.t("Build.siteShopFlows")], ['payments', this.props.t("Build.cardSEPAKlarna")], ['hosting', this.props.t("Build.tICHosting")], ['status', this.props.t("Build.liveMaintained")]]
  }, {
    kind: this.props.t("Build.ownProductClientPortal"),
    t: 'RIDEFF Portal',
    d: this.props.t("Build.whereEveryClientApprovesOffersPays"),
    bullets: [this.props.t("Build.emailLoginWithA6Digit"), this.props.t("Build.offerApprovalStoresTimeIPTerms"), this.props.t("Build.invoicesRYYYYNNNCardSEPA"), this.props.t("Build.ownerSupportFinanceAndBuilderRoles")],
    chips: ['Next.js', 'Supabase', 'Stripe', 'Resend'],
    stats: [[this.props.t("Build.roles"), '6'], [this.props.t("Build.languages"), '3'], [this.props.t("Build.passwords"), '0']],
    link: this.props.t("Build.openThePortalDemo"),
    href: this.props.href("@portal"),
    phUi: this.props.t("Build.portalClientDashboard"),
    phSys: this.props.t("Build.portalAdminInbox"),
    spec: [['auth', this.props.t("Build.email6DigitCode")], ['staff', '2FA · TOTP'], ['approval', this.props.t("Build.ipTimePdfHash")], ['invoices', this.props.t("Build.n14UStGRYYYYNNN")], ['region', this.props.t("Build.supabaseFrankfurt")]]
  }, {
    kind: this.props.t("Build.ownProductConsumer"),
    t: 'RIDEFF Life',
    d: this.props.t("Build.aPersonalBrainForYourDay"),
    bullets: [this.props.t("Build.morningBriefingWrittenFromYourCalendar"), this.props.t("Build.moneyAndTimeInOneCalm"), this.props.t("Build.togetherPlanForUpTo4"), this.props.t("Build.n14DaysFreeNoCardCancel")],
    chips: ['Next.js', 'Supabase', 'Stripe', 'AI'],
    stats: [[this.props.t("Build.plans"), '4'], [this.props.t("Build.trial"), '14 d'], [this.props.t("Build.languages"), '3']],
    link: this.props.t("Build.tryTheLifeDemo"),
    href: this.props.href("@lifedemo"),
    phUi: this.props.t("Build.lifeCockpitScreenshot"),
    phSys: this.props.t("Build.lifeBriefingScreenshot"),
    spec: [['product', 'app.rideff.com'], ['users', this.props.t("Build.n14PerPlan")], ['trial', this.props.t("Build.n14DaysNoCard")], ['billing', this.props.t("Build.monthlyYearly")], ['data', this.props.t("Build.eUFrankfurt")]]
  }];
  NAMES = [this.props.t("Build.scattered"), this.props.t("Build.platform"), this.props.t("Build.inbound"), this.props.t("Build.agents"), this.props.t("Build.apps")];
  SEGS = [this.props.t("Build.sixTools"), this.props.t("Build.onePlatform2"), this.props.t("Build.everyDoor"), this.props.t("Build.flowsAgents"), this.props.t("Build.apps")];
  CAPS = [[this.props.t("Build.pillar02"), this.props.t("Build.fromSixToolsToOnePlatform"), this.props.t("Build.spreadsheetInboxChatBookingToolInvoicing")], [this.props.t("Build.n01OnePlatform"), this.props.t("Build.everythingInOnePlace"), this.props.t("Build.customersOrdersJobsAndNumbersIn")], [this.props.t("Build.n02EveryDoorLeadsIn"), this.props.t("Build.webShopWhatsAppEmailOneInbox"), this.props.t("Build.whateverTheChannelEveryRequestLands")], [this.props.t("Build.n03AutomationAgents"), this.props.t("Build.flowsRunItAgentsThinkIt"), this.props.t("Build.rulesMoveTheRoutineWorkOn")], [this.props.t("Build.n04AppsForEveryone"), this.props.t("Build.yourTeamYourClientsYourDashboard"), this.props.t("Build.aTeamAppOnEveryPhone")]];
  AREAS = [[1, .62, .28], [.38, .80, .50], [.33, .69, .90], [.62, .55, .95], [.88, .72, .26], [.92, .48, .67]];
  TERM = [['rideff map --your-business', this.props.t("Build.n6ToolsFound14HWeek")], ['rideff build platform --modules customers,orders,jobs,invoices', this.props.t("Build.oneDatabaseYourLogoYourRules")], ['rideff connect website whatsapp stripe datev', this.props.t("Build.n4DoorsIn0CopyPaste")], ['rideff agents add reply offer report && deploy --region fra1', this.props.t("Build.liveSSLDailyBackups")]];
  fxScroll = () => {
    const vh = innerHeight,
      cl = v => Math.max(0, Math.min(1, v)),
      n = {};
    const root = this.casesRef.current;
    if (root) n.ce = [...root.querySelectorAll('[data-case]')].map(el => cl((vh * 0.9 - el.getBoundingClientRect().top) / (vh * 0.65)));
    const c = this.collapseRef.current;
    // Time the collapse to the card stage itself: it starts once the stage is in view and lands as it reaches the middle.
    const cs = c && c.lastElementChild;
    if (cs) {
      const r = cs.getBoundingClientRect(),
        from = vh * .7,
        to = vh * .4 - r.height / 2;
      n.cp = cl((from - r.top) / (from - to));
    }
    const l = this.layersRef.current;
    if (l) n.lp = cl((vh * .85 - l.getBoundingClientRect().top) / (vh * .8));
    const j = this.journeyRef.current;
    if (j) {
      const r = j.getBoundingClientRect();
      n.jp = this.state.pin ? cl(-r.top / (r.height - vh)) : 1;
    }
    const s = this.state || {},
      ch = Object.keys(n).some(k => Array.isArray(n[k]) ? n[k].some((v, i) => Math.abs(v - ((s[k] || [])[i] || 0)) > .004) : Math.abs(n[k] - (s[k] || 0)) > .004);
    if (ch) this.setState(n);
  };
  calcPin = () => {
    let rm = false;
    try {
      rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {}
    const pin = !rm && innerWidth >= 1000 && innerHeight >= 640,
      narrow = innerWidth < 600;
    if (narrow !== !!(this.state || {}).narrow) this.setState({ narrow });
    if (rm !== !!(this.state || {}).rm) this.setState({ rm });
    if (pin !== (this.state || {}).pin) this.setState({
      pin
    }, this.fxScroll);
  };
  async componentDidMount() {
    this.alive = true;
    this.setState(x => ({
      cp: 0,
      lp: 0,
      jp: 0,
      ce: [0, 0, 0],
      al: 0,
      ...x
    }));
    this.calcPin();
    window.addEventListener('resize', this.calcPin);
    setTimeout(this.fxScroll, 100);
    window.addEventListener('scroll', this.fxScroll, {
      passive: true
    });
    this.fxScroll();
    this.lt = setInterval(() => {
      if (!this.lockL) this.setState(s => ({
        al: (s.al + 1) % 6
      }));
    }, 2800);
    const tr = this.termRef.current;
    if (tr && 'IntersectionObserver' in window) {
      this.io = new IntersectionObserver(es => {
        if (es[0].isIntersecting && !this.ty) {
          this.ty = setInterval(() => {
            const tot = this.TERM.reduce((a, t) => a + t[0].length + 14, 0);
            if (this.state.typed >= tot) {
              clearInterval(this.ty);
              return;
            }
            this.setState(s => ({
              typed: s.typed + 1
            }));
          }, 28);
        }
      }, {
        threshold: 0.3
      });
      this.io.observe(tr);
    }
    let THREE;
    try {
      // Bundled (npm "three"), not loaded from a CDN: no third-party request.
      THREE = await import('three');
    } catch (e) {
      console.warn('three failed', e);
      return;
    }
    const cv = this.canvasRef.current;
    if (!cv || !this.alive) return;
    this.N = window.innerWidth < 760 ? 9000 : 26000;
    this.forceUpdate();
    const N = this.N,
      dpr = Math.min(window.devicePixelRatio || 1, 2);
    const renderer = this.renderer = new THREE.WebGLRenderer({
      canvas: cv,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(dpr);
    const scene = new THREE.Scene(),
      camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 6.4);
    const group = this.group = new THREE.Group();
    scene.add(group);
    this.F = this.forms(N);
    const geo = this.geo = new THREE.BufferGeometry();
    const aD = new Float32Array(N),
      aS = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      aD[i] = Math.random();
      aS[i] = 1.4 + Math.random() * 2.2;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.F[0].p), 3));
    geo.setAttribute('aA', new THREE.BufferAttribute(new Float32Array(this.F[0].p), 3));
    geo.setAttribute('aB', new THREE.BufferAttribute(new Float32Array(this.F[1].p), 3));
    geo.setAttribute('cA', new THREE.BufferAttribute(new Float32Array(this.F[0].c), 3));
    geo.setAttribute('cB', new THREE.BufferAttribute(new Float32Array(this.F[1].c), 3));
    geo.setAttribute('aL', new THREE.BufferAttribute(this.F[2].l, 4));
    geo.setAttribute('aD', new THREE.BufferAttribute(aD, 1));
    geo.setAttribute('aS', new THREE.BufferAttribute(aS, 1));
    this.k = 0;
    const mat = this.mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uT: {
          value: 0
        },
        uTime: {
          value: 0
        },
        uPix: {
          value: dpr
        },
        uScatter: {
          value: 0
        },
        uAF: {
          value: 0
        },
        uBF: {
          value: 0
        }
      },
      vertexShader: `attribute vec3 aA; attribute vec3 aB; attribute vec3 cA; attribute vec3 cB; attribute vec4 aL; attribute float aD; attribute float aS;
        uniform float uT,uTime,uPix,uScatter,uAF,uBF; varying vec3 vC; varying float vA;
        vec3 fl(vec3 p){ if(aL.w<0.5) return p; float f=fract(aD*13.0+uTime*0.32); return vec3(mix(aL.x,aL.y,f), aL.z+sin(f*14.0+aD*30.0)*0.025, p.z); }
        void main(){ float t=clamp(uT*1.5-aD*0.5,0.0,1.0); t=t<0.5?4.0*t*t*t:1.0-pow(-2.0*t+2.0,3.0)/2.0;
          vec3 A=uAF>0.5?fl(aA):aA; vec3 B=uBF>0.5?fl(aB):aB; vec3 p=mix(A,B,t); float w=sin(t*3.14159);
          p+=vec3(sin(uTime*0.9+aD*40.0),cos(uTime*0.7+aD*31.0),sin(uTime*0.8+aD*23.0))*(0.01+w*0.5*aD+uScatter*0.3*aD);
          vec4 mv=modelViewMatrix*vec4(p,1.0); gl_PointSize=aS*uPix*(5.0/-mv.z); gl_Position=projectionMatrix*mv;
          vC=mix(cA,cB,t); vA=0.5+0.5*smoothstep(-2.0,1.5,p.z); }`,
      fragmentShader: `varying vec3 vC; varying float vA; void main(){ float d=length(gl_PointCoord-0.5); if(d>0.5) discard; float a=pow(1.0-d*2.0,1.5); gl_FragColor=vec4(vC,a*vA*0.9); }`
    });
    group.add(new THREE.Points(geo, mat));
    this.mouse = {
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      v: 0,
      lx: 0,
      ly: 0
    };
    this.onMove = e => {
      const m = this.mouse,
        nx = e.clientX / innerWidth * 2 - 1,
        ny = e.clientY / innerHeight * 2 - 1;
      m.v = Math.min(1, m.v + Math.hypot(nx - m.lx, ny - m.ly) * 3);
      m.lx = nx;
      m.ly = ny;
      m.tx = nx;
      m.ty = ny;
    };
    this.onResize = () => {
      const w = cv.clientWidth,
        h = cv.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const vw = 2 * 6.4 * Math.tan(20 * Math.PI / 180) * camera.aspect,
        wide = w > 900;
      group.scale.setScalar(Math.min(1, vw / (wide ? 11 : 6)));
      group.position.set(wide ? vw * 0.2 : 0, wide ? 0.1 : 0.9, 0);
    };
    window.addEventListener('mousemove', this.onMove);
    window.addEventListener('resize', this.onResize);
    this.onResize();
    const t0 = performance.now();
    const loop = now => {
      if (!this.alive) return;
      this.raf = requestAnimationFrame(loop);
      if (now - (this._fs || 0) > 120) {
        this._fs = now;
        this.fxScroll();
      }
      this.frame((now - t0) / 1000);
      renderer.render(scene, camera);
    };
    this.raf = requestAnimationFrame(loop);
  }
  componentWillUnmount() {
    this.alive = false;
    window.removeEventListener('scroll', this.fxScroll);
    window.removeEventListener('resize', this.calcPin);
    cancelAnimationFrame(this.raf);
    clearInterval(this.lt);
    clearInterval(this.ty);
    this.io && this.io.disconnect();
    window.removeEventListener('mousemove', this.onMove);
    window.removeEventListener('resize', this.onResize);
    this.renderer && this.renderer.dispose();
  }
  forms(N) {
    const R = Math.random,
      CR = [0.93, 0.91, 0.87],
      GR = [0.55, 0.53, 0.5],
      OR = [1, 0.42, 0.04];
    const dir = () => {
      let x, y, z, l;
      do {
        x = R() * 2 - 1;
        y = R() * 2 - 1;
        z = R() * 2 - 1;
        l = x * x + y * y + z * z;
      } while (l > 1 || l < .01);
      l = Math.sqrt(l);
      return [x / l, y / l, z / l];
    };
    const ball = (c, r) => {
      const d = dir(),
        q = r * Math.cbrt(R());
      return [c[0] + d[0] * q, c[1] + d[1] * q, c[2] + d[2] * q];
    };
    const box = (cx, cy, cz, w, h, d) => {
      const f = R() * 6 | 0,
        u = R() - .5,
        v = R() - .5;
      let p;
      if (f < 2) p = [(f ? .5 : -.5) * w, u * h, v * d];else if (f < 4) p = [u * w, (f - 2 ? .5 : -.5) * h, v * d];else p = [u * w, v * h, (f - 4 ? .5 : -.5) * d];
      return [cx + p[0], cy + p[1], cz + p[2]];
    };
    const seg = (a, b, j) => {
      const t = R();
      return [a[0] + (b[0] - a[0]) * t + (R() - .5) * j, a[1] + (b[1] - a[1]) * t + (R() - .5) * j, a[2] + (b[2] - a[2]) * t + (R() - .5) * j];
    };
    const rect = (cx, cy, w, h, j) => {
      const per = 2 * (w + h),
        s = R() * per;
      let x, y;
      if (s < w) {
        x = s;
        y = 0;
      } else if (s < w + h) {
        x = w;
        y = s - w;
      } else if (s < 2 * w + h) {
        x = s - w - h;
        y = h;
      } else {
        x = 0;
        y = s - 2 * w - h;
      }
      return [cx - w / 2 + x + (R() - .5) * j, cy - h / 2 + y + (R() - .5) * j];
    };
    const mk = fn => {
      const p = new Float32Array(N * 3),
        c = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const r = fn(i);
        p.set(r[0], i * 3);
        c.set(r[1], i * 3);
      }
      return {
        p,
        c
      };
    };
    const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    const rotF = (ry, rx) => p => {
      let [x, y, z] = p;
      const cy = Math.cos(ry),
        sy = Math.sin(ry);
      [x, z] = [x * cy + z * sy, -x * sy + z * cy];
      const cx = Math.cos(rx),
        sx = Math.sin(rx);
      [y, z] = [y * cx - z * sx, y * sx + z * cx];
      return [x, y, z];
    };
    const A = this.AREAS;
    const cubes = [[-2.4, 1.1, -.5, .7], [-.6, 1.5, .5, .5], [1.5, 1.2, -.3, .75], [-1.8, -1.1, .4, .6], [.2, -1.2, -.6, .8], [2.1, -.8, .5, .52]];
    const tools = mk(() => {
      if (R() < .08) return [[(R() - .5) * 6, (R() - .5) * 3.8, (R() - .5) * 2.4], GR];
      const k = R() * 6 | 0,
        c = cubes[k];
      return [box(c[0], c[1], c[2], c[3], c[3], c[3]), R() < .25 ? A[k] : GR];
    });
    const rp = rotF(-.5, .3);
    const plat = mk(() => {
      const r = R();
      if (r < .42) return [rp(box(0, 0, 0, 3.2, 2, 1.2)), CR];
      if (r < .56) return [rp(ball([0, 0, 0], .42)), OR];
      if (r < .82) {
        const k = R() * 3 | 0;
        return [rp([(R() - .5) * 3.1, -.5 + k * .5, (R() - .5) * 1.1]), k === 1 ? mix(GR, OR, .4) : GR];
      }
      const k = R() * 6 | 0,
        q = rect(-1.05 + k % 3 * 1.05, k < 3 ? .45 : -.45, .8, .5, .01);
      return [rp([q[0], q[1], .61]), A[k]];
    });
    const ys = [.95, .32, -.32, -.95],
      L = new Float32Array(N * 4);
    const inbound = mk(i => {
      const r = R();
      if (r < .26) {
        const k = R() * 4 | 0;
        return [box(-2.55, ys[k], 0, .55, .42, .3), A[k]];
      }
      if (r < .6) return [box(1.35, 0, 0, 1.9, 2.6, 1.1), R() < .14 ? OR : CR];
      if (r < .66) return [ball([1.35, 0, 0], .32), OR];
      const k = R() * 4 | 0,
        y = ys[k] * (1 - R() * .0) + (R() - .5) * .05;
      L.set([-2.25, .38, y, 1], i * 4);
      return [[-1, y, (R() - .5) * .08], mix(A[k], OR, .5)];
    });
    inbound.l = L;
    const chief = [0, 1.45, 0],
      hubs = [...Array(6)].map((_, k) => [-2.75 + k * 1.1, .15, k % 2 ? .2 : -.2]);
    const agents = mk(() => {
      const r = R();
      if (r < .1) return [ball(chief, .3), OR];
      const k = R() * 6 | 0,
        h = hubs[k],
        col = A[k];
      if (r < .3) return [ball(h, .17), col];
      if (r < .5) {
        const j = R() * 3 | 0,
          ag = [h[0] + (j - 1) * .32, -.95, h[2]];
        return [R() < .5 ? ball(ag, .07) : ball([ag[0], -1.6, ag[2]], .05), col];
      }
      if (r < .72) return [seg(chief, h, .025), mix(OR, col, R())];
      const j = R() * 3 | 0,
        ag = [h[0] + (j - 1) * .32, -.95, h[2]];
      return [R() < .6 ? seg(h, ag, .02) : seg(ag, [ag[0], -1.6, ag[2]], .02), col];
    });
    const rw = rotF(-.55, .22);
    const web = mk(() => {
      const r = R();
      let p,
        c = CR;
      if (r < .3) {
        const q = rect(0, 0, 3.4, 2.2, .02);
        p = [q[0], q[1], -.8];
      } else if (r < .36) {
        const k = R() * 3 | 0;
        p = [...ball([-1.5 + k * .16, .92, -.8], .05)];
        c = OR;
      } else if (r < .42) {
        p = [(R() - .5) * 3.4, .76 + (R() - .5) * .02, -.8];
      } else if (r < .6) {
        const k = R() * 4 | 0,
          w = [1.6, 1.3, 1.5, .9][k];
        p = [-1.4 + R() * w, .45 - k * .2 + (R() - .5) * .04, -.25];
      } else if (r < .8) {
        const k = R() * 3 | 0,
          q = rect(-1.05 + k * 1.05, -.55, .9, .6, .015);
        p = [q[0], q[1], .3];
      } else {
        const q = R() < .8 ? rect(1.9, .05, .72, 1.4, .015) : [1.9 + (R() - .5) * .5, .4 - R() * .7];
        p = [q[0], q[1], .85];
        c = R() < .7 ? OR : CR;
      }
      return [rw(p), c];
    });
    return [tools, plat, inbound, agents, web];
  }
  frame(time) {
    const st = this.stageRef.current;
    if (!st) return;
    const r = st.getBoundingClientRect(),
      span = r.height - innerHeight;
    // Reduced motion: no pinned scrubbing, show the final state ("One platform").
    const p01 = this.state.rm ? 1 : Math.max(0, Math.min(1, -r.top / span)),
      p = p01 * 4;
    const k = Math.min(3, Math.floor(p)),
      t = p - k;
    if (k !== this.k) {
      const g = this.geo.attributes;
      g.aA.array.set(this.F[k].p);
      g.aB.array.set(this.F[k + 1].p);
      g.cA.array.set(this.F[k].c);
      g.cB.array.set(this.F[k + 1].c);
      g.aA.needsUpdate = g.aB.needsUpdate = g.cA.needsUpdate = g.cB.needsUpdate = true;
      this.k = k;
    }
    const m = this.mouse;
    m.x += (m.tx - m.x) * .05;
    m.y += (m.ty - m.y) * .05;
    m.v *= .94;
    const u = this.mat.uniforms;
    u.uT.value = t;
    u.uTime.value = time;
    u.uScatter.value = m.v;
    u.uAF.value = k === 2 ? 1 : 0;
    u.uBF.value = k + 1 === 2 ? 1 : 0;
    const calm = p > 1.6 && p < 2.4 || p > 3.2 ? 0.25 : 1;
    this.group.rotation.y = Math.sin(time * .2) * .35 * calm + m.x * .3;
    this.group.rotation.x = Math.sin(time * .15) * .08 * calm + m.y * .15;
    const cap = Math.min(4, Math.round(p));
    if (cap !== this.state.cap || Math.abs(p01 - this.state.prog) > .003) this.setState({
      cap,
      prog: p01
    });
  }
  renderVals() {
    const s0 = this.state || {},
      s = {
        cap: 0,
        prog: 0,
        typed: 0,
        ce: [0, 0, 0],
        cp: 0,
        lp: 0,
        jp: 0,
        al: 0,
        pin: false,
        ...s0
      },
      c = this.CAPS[s.cap || 0],
      E = x => {
        x = +x || 0;
        return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
      },
      cl = v => Math.max(0, Math.min(1, +v || 0));
    let rem = s.typed;
    const term = this.TERM.map((t, i) => {
      const cmdLen = t[0].length,
        n = Math.max(0, Math.min(cmdLen, rem));
      const showOut = rem >= cmdLen + 6;
      const started = rem > 0 || i === 0;
      rem -= cmdLen + 14;
      return {
        cmd: t[0].slice(0, n),
        out: t[1],
        showOut,
        cursor: false,
        vis: started
      };
    }).filter((l, i) => i === 0 || l.vis && l.cmd.length > 0);
    const last = term[term.length - 1];
    if (last) last.cursor = true;
    const e = E(s.cp),
      fade = 1 - cl((e - .5) / .3),
      pe = cl((e - .62) / .3);
    const le = E(s.lp),
      sp = 14 + 34 * le;
    const jn = (+s.jp || 0) * 6,
      cur = Math.min(5, Math.floor(jn));
    return {
      rm: !!(this.state || {}).rm,
      canvasRef: this.canvasRef,
      stageRef: this.stageRef,
      termRef: this.termRef,
      casesRef: this.casesRef,
      collapseRef: this.collapseRef,
      layersRef: this.layersRef,
      journeyRef: this.journeyRef,
      count: num(this.N || 26000, this.props.locale),
      formName: this.NAMES[s.cap],
      capNum: c[0].split(' · ')[0],
      capLabel: c[0].split(' · ')[1] || this.props.t("Build.build"),
      capHead: c[1],
      capBody: c[2],
      isFirst: s.cap === 0,
      segs: this.SEGS.map((t, i) => ({
        t,
        w: Math.max(0, Math.min(1, s.prog * 5 - i)) * 100 + '%',
        c: i === s.cap ? '#F4F4F2' : '#6B675F'
      })),
      toolCards: this.TOOLS.map((t, k) => {
        // Phones: a tighter fan, so the scattered tools stay inside the screen.
        const f = this.FAN[k],
          q = 1 - e,
          fx = s.narrow ? .36 : 1,
          fy = s.narrow ? .55 : 1;
        return {
          ini: t[0],
          name: t[1],
          price: t[2],
          use: t[3],
          tag: t[4],
          c: this.COL[k],
          tf: `translate(-50%,-50%) translate3d(${(f[0] * fx * q).toFixed(1)}%, ${(f[1] * fy * q).toFixed(1)}%, ${(f[2] * q + k * 5).toFixed(1)}px) rotateZ(${(f[3] * q).toFixed(2)}deg)`,
          op: fade.toFixed(3)
        };
      }),
      platTf: `translate(-50%,-50%) translateZ(${(60 * pe).toFixed(1)}px) scale(${(.82 + .18 * pe).toFixed(3)})`,
      platOp: pe.toFixed(3),
      modules: [this.props.t("Build.customers"), this.props.t("Build.orders"), this.props.t("Build.jobs"), this.props.t("Build.invoices"), this.props.t("Build.stock"), this.props.t("Build.reports")],
      counters: [[this.props.t("Build.appsToOpen"), 6, 1], [this.props.t("Build.logins"), 6, 1], [this.props.t("Build.placesYourDataLives"), 6, 1], [this.props.t("Build.hoursOfCopyPasteWeek"), 14, 0]].map(x => {
        const v = Math.round(x[1] + (x[2] - x[1]) * e);
        return {
          t: x[0],
          v,
          c: e > .95 ? '#FF6A00' : '#F4F4F2'
        };
      }),
      stackTf: `rotateX(58deg) rotateZ(-38deg) translateZ(${(-2.5 * sp).toFixed(1)}px)`,
      layers: this.LAYERS.map((l, i) => {
        const on = i === s.al,
          col = this.LCOL[i];
        return {
          n: '0' + (i + 1),
          t: l[0],
          d: l[1],
          chips: l[2],
          on,
          c: col,
          tf: `translateZ(${((5 - i) * sp + (on ? 34 : 0)).toFixed(1)}px)`,
          bd: on ? col : '#2A2A2C',
          bg: on ? 'rgba(30,22,16,.97)' : 'rgba(20,20,21,.96)',
          tc: on ? '#F4F4F2' : '#6B675F',
          cells: [0, 1, 2, 3].map(j => on ? j === 0 ? col : col + '44' : '#1F1F21'),
          rowOp: on ? 1 : .55,
          go: () => {
            this.lockL = true;
            this.setState({
              al: i
            });
          }
        };
      }),
      jPin: s.pin,
      jNode: s.pin ? 'block' : 'none',
      jH: s.pin ? '300vh' : 'auto',
      jPos: s.pin ? 'sticky' : 'relative',
      jInnerH: s.pin ? '100vh' : 'auto',
      jCols: s.pin ? 'repeat(6,minmax(0,1fr))' : 'repeat(auto-fit,minmax(min(100%,220px),1fr))',
      jFill: (cl((jn - .5) / 5) * 100).toFixed(2) + '%',
      jNum: '0' + (s.pin ? cur + 1 : 6),
      steps: this.STEPS.map((x, k) => {
        const reached = !s.pin || jn >= k + .3,
          now = s.pin && k === cur,
          col = x[1] < 0 ? '#F4F4F2' : this.LCOL[x[1]];
        return {
          time: x[0],
          layer: x[1] < 0 ? this.props.t("Build.you") : this.LAYERS[x[1]][0],
          c: col,
          t: x[2],
          d: x[3],
          op: reached ? 1 : .18,
          tf: reached ? 'none' : 'translateY(24px)',
          bd: now ? '#FF6A00' : '#232325',
          nodeBd: reached ? col : '#3A3A3C',
          nodeBg: reached ? col : '#0B0B0C'
        };
      }),
      caps: [[this.props.t("Build.customPlatforms"), this.props.t("Build.yourOwnSystemInsteadOfRented")], [this.props.t("Build.teamApps"), this.props.t("Build.phoneAndDesktopShiftsTasksChecklists")], [this.props.t("Build.clientPortals"), this.props.t("Build.offersPaymentsFilesOneThreadPer")], [this.props.t("Build.aIAgents"), this.props.t("Build.replySortDraftAndReportOn")], [this.props.t("Build.automations"), this.props.t("Build.triggersRemindersSchedulesApprovals")], [this.props.t("Build.dashboards"), this.props.t("Build.liveNumbersAlertsAndAMonday")], [this.props.t("Build.websitesShops"), this.props.t("Build.fastFindableWiredIntoThePlatform")], [this.props.t("Build.aPIsIntegrations"), this.props.t("Build.connectAnythingWithAnAPIOr")]].map((x, k) => {
        const href = {
          'Team apps': this.props.href("/build/team-apps"),
          'Client portals': this.props.href("@portal"),
          'Websites & shops': this.props.href("/build/web-shops")
        }[x[0]];
        return {
          n: '0' + (k + 1),
          t: x[0],
          d: x[1],
          c: this.COL[k % 6],
          href,
          arrow: href ? this.props.t("Build.seeIt") : '',
          ac: '#FF9A50'
        };
      }),
      term,
      stack: [[this.props.t("Build.interface"), this.props.t("Build.nextJsReactTypeScriptFastOn")], [this.props.t("Build.dataHosting"), this.props.t("Build.supabasePostgresInFrankfurtDailyBackups")], [this.props.t("Build.paymentsMail"), this.props.t("Build.stripeSEPAKlarnaInvoicesThatMeet")], [this.props.t("Build.aIAgents2"), this.props.t("Build.lLMAgentsWithToolAccessHuman")]].map(k => ({
        t: k[0],
        d: k[1]
      })),
      int1: [0, 1].flatMap(() => ['Stripe', 'PayPal', 'Klarna', 'SEPA', 'DATEV', 'lexoffice', 'sevDesk', 'DHL', 'DPD', 'Shopify', 'WooCommerce', 'Etsy']),
      int2: [0, 1].flatMap(() => ['Google Workspace', 'Microsoft 365', 'Gmail', 'Outlook', 'WhatsApp Business', 'Instagram', 'Calendly', 'Slack', 'Notion', 'Airtable', 'OpenAI', 'Anthropic']),
      cases: this.CASES.map((c, i) => {
        const raw = s.ce[i] || 0,
          ee = E(raw),
          z = 70 * ee;
        return {
          ...c,
          i,
          n: '0' + (i + 1),
          idUi: 'build-case-' + i + '-ui',
          idSys: 'build-case-' + i + '-sys',
          idMob: 'build-case-' + i + '-mob',
          srcUi: [opt("/images/tic-shop.png"), opt("/images/portal-client.png"), opt("/images/life-cockpit.png")][i],
          srcSys: [opt("/images/tic-backoffice.png"), opt("/images/portal-admin.png"), opt("/images/life-briefing.png")][i],
          srcMob: [opt("/images/tic-shopall.png"), opt("/images/portal-client.png"), opt("/images/life-cockpit.png")][i],
          spec: c.spec.map(x => ({
            k: x[0],
            v: x[1]
          })),
          stats: c.stats.map(x => ({
            k: x[0],
            v: x[1]
          })),
          stage: `rotateX(${50 * ee}deg) rotateZ(${-26 * ee}deg) scale(${1 - .08 * ee})`,
          l0: `translateZ(${-z}px) translate(${4 * ee}%, ${8 * ee}%)`,
          l1: `translateZ(${z * .3}px)`,
          l2: `translateZ(${z * 1.6}px) translate(${4 * ee}%, ${-2 * ee}%)`,
          op2: Math.min(1, ee * 1.6),
          l3: `translateZ(${z * 2.1}px) translate(${-4 * ee}%, ${2 * ee}%)`,
          op3: Math.min(1, Math.max(0, ee * 1.6 - .3))
        };
      }),
      process: [[this.props.t("Build.firstCall"), this.props.t("Build.n15MinutesYouShowMeThe")], [this.props.t("Build.analysis"), this.props.t("Build.iMapWhatRepeatsAndWhat")], [this.props.t("Build.build"), this.props.t("Build.iBuildItYouWatchProgress")], [this.props.t("Build.test"), this.props.t("Build.yourTeamTriesItInA")], [this.props.t("Build.live2"), this.props.t("Build.oldToolsSwitchedOffAndI")]].map((x, k) => ({
        n: '0' + (k + 1),
        t: x[0],
        d: x[1]
      }))
    };
  }
}

Logic.prototype.render = function render() {
  const v = { ...this.props, ...this.renderVals() };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: "body{margin:0;background:#0B0B0C;color:#F4F4F2;font-family:var(--font-sans);-webkit-font-smoothing:antialiased}\na{color:inherit;text-decoration:none}a:hover{color:#FF9A50}\n@keyframes rdPulse{0%,100%{opacity:1}50%{opacity:.3}}\n@keyframes rdBlink{0%,49%{opacity:1}50%,100%{opacity:0}}\n@keyframes rdMarq{from{transform:translateX(0)}to{transform:translateX(-50%)}}\n@keyframes rdMarqR{from{transform:translateX(-50%)}to{transform:translateX(0)}}\n@keyframes rdScanX{0%{left:-20%}100%{left:110%}}\n@keyframes rdGlow{0%,100%{box-shadow:0 0 0 0 rgba(255,106,0,.45)}50%{box-shadow:0 0 0 12px rgba(255,106,0,0)}}" }} />
      <Nav active="build" dark={true} />
      <div ref={v.stageRef} data-screen-label="Hero story" style={{ height: v.rm ? "auto" : "420vh", position: "relative" }}>
        {" "}
        <div style={{ position: v.rm ? "relative" : "sticky", top: "0", height: "100vh", overflow: "hidden", background: "radial-gradient(ellipse at 66% 48%,#15120F 0%,#0B0B0C 62%)" }}>
          {" "}
          <canvas ref={v.canvasRef} className="bp-hero-canvas" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", display: "block" }} />
          {" "}
          <div style={{ position: "absolute", left: "clamp(20px,3vw,40px)", top: "110px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E", pointerEvents: "none" }}>
            {v.t("Build.home")}{" "}
            <span style={{ color: "#4A4A4C" }}>
              {"/"}
            </span>
            {" "}
            <span style={{ color: "#B8B3AA" }}>
              {v.t("Build.build")}
            </span>
          </div>
          {" "}
          <div style={{ position: "absolute", right: "clamp(20px,3vw,40px)", top: "110px", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".08em", textTransform: "uppercase", color: "#6B675F", pointerEvents: "none" }}>
            <span>
              {v.t("Build.particles")}{" "}
              <b style={{ color: "#FF9A50", fontWeight: "500" }}>
                {v.count}
              </b>
            </span>
            <span>
              {v.t("Build.stage")}{" "}
              <b style={{ color: "#FF9A50", fontWeight: "500" }}>
                {v.formName}
              </b>
            </span>
          </div>
          {" "}
          <div style={{ position: "absolute", left: "clamp(20px,3vw,40px)", top: "150px", bottom: "120px", maxWidth: "min(620px,calc(100% - 40px))", display: "flex", flexDirection: "column", justifyContent: "center", gap: "clamp(12px,2.4vh,22px)", pointerEvents: "none", overflow: "hidden" }}>
            <div style={{ display: "flex", gap: "12px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase" }}>
              <span style={{ color: "#6B675F" }}>
                {v.capNum}
              </span>
              <span style={{ color: "#F4F4F2" }}>
                {v.capLabel}
              </span>
            </div>
            <h1 style={{ margin: "0", fontSize: "clamp(30px,min(4.6vw,6.6vh),75px)", lineHeight: ".95", letterSpacing: "-0.05em", fontWeight: "600", textWrap: "balance" }}>
              {v.capHead}
            </h1>
            <p style={{ margin: "0", fontSize: "clamp(17px,1.5vw,21px)", lineHeight: "1.5", color: "#B8B3AA", textWrap: "pretty", maxWidth: "540px" }}>
              {v.capBody}
            </p>
            {v.isFirst ? (<>
              {" "}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", pointerEvents: "auto", paddingTop: "8px" }}>
                <a href="#inside" style={{ background: "#FF6A00", color: "#0A0A0A", borderRadius: "999px", padding: "15px 24px", fontWeight: "700", fontSize: "13px", letterSpacing: ".06em", textTransform: "uppercase" }}>
                  {v.t("Build.seeInsideThePlatform")}
                </a>
                <a href={v.href("@cal")} target="_blank" rel="noopener" style={{ border: "1px solid #3A3A3C", borderRadius: "999px", padding: "15px 24px", fontWeight: "600", fontSize: "13px", letterSpacing: ".06em", textTransform: "uppercase" }}>
                  {v.t("common.ctaCall")}
                </a>
              </div>
              {" "}
            </>) : null}
          </div>
          {" "}
          <div style={{ position: "absolute", left: "clamp(20px,3vw,40px)", right: "clamp(20px,3vw,40px)", bottom: "28px", display: "flex", flexDirection: "column", gap: "16px", pointerEvents: "none" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,minmax(0,1fr))", gap: "16px" }}>
              {(v.segs ?? []).map((g, $index) => (<Fragment key={$index}>
                {" "}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ height: "2px", background: "#232325", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${g?.w ?? ''}`, background: "#FF6A00" }} />
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: `${g?.c ?? ''}`, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {g?.t}
                  </span>
                </div>
                {" "}
              </Fragment>))}
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6B675F" }}>
              {v.t("Build.scrollToWatchItComeTogether")}
            </span>
          </div>
          {" "}
        </div>
      </div>
      <div ref={v.collapseRef} data-screen-label="01 Tool tax" style={{ padding: "140px clamp(20px,3vw,40px) 0", maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))", gap: "56px", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
            {"(01) "}
            <span style={{ color: "#F4F4F2" }}>
              {v.t("Build.theToolTax")}
            </span>
          </div>
          <h2 style={{ margin: "0", fontSize: "clamp(33px,3.9vw,62px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", textWrap: "balance" }}>
            {v.t("Build.sixAppsYouRent")}{" "}
            <span style={{ color: "#FF6A00" }}>
              {v.t("Build.onePlatformYouOwn")}
            </span>
          </h2>
          <p style={{ margin: "0", fontSize: "clamp(17px,1.5vw,21px)", lineHeight: "1.55", color: "#B8B3AA", maxWidth: "560px", textWrap: "pretty" }}>
            {v.t("Build.everyToolSolvesOneProblemAnd")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #232325" }}>
            {(v.counters ?? []).map((k, $index) => (<Fragment key={$index}>
              {" "}
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 120px", gap: "20px", alignItems: "baseline", padding: "18px 0", borderBottom: "1px solid #1C1C1E" }}>
                <span style={{ fontSize: "17px", color: "#D8D3CA" }}>
                  {k?.t}
                </span>
                <span style={{ textAlign: "right", fontSize: "clamp(30px,3vw,44px)", fontWeight: "500", letterSpacing: "-0.04em", lineHeight: "1", color: `${k?.c ?? ''}` }}>
                  {k?.v}
                </span>
              </div>
              {" "}
            </Fragment>))}
          </div>
        </div>
        <div style={{ position: "relative", height: "clamp(460px,46vw,620px)", perspective: "1600px", contain: "paint" }}>
          {" "}
          <div style={{ position: "absolute", inset: "0", transformStyle: "preserve-3d", transform: "rotateX(16deg) rotateY(-14deg)" }}>
            {" "}
            {(v.toolCards ?? []).map((t, $index) => (<Fragment key={$index}>
              {" "}
              <div style={{ position: "absolute", left: "50%", top: "50%", width: "clamp(180px,19vw,250px)", borderRadius: "18px", background: "#141415", border: "1px solid #2A2A2C", padding: "16px 18px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "12px", transform: `${t?.tf ?? ''}`, opacity: `${t?.op ?? ''}`, boxShadow: "0 30px 60px -20px rgba(0,0,0,.75)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "30px", height: "30px", borderRadius: "8px", background: `${t?.c ?? ''}`, color: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", font: "600 12px var(--font-mono)", flexShrink: "0" }}>
                    {t?.ini}
                  </span>
                  <b style={{ fontSize: "15px", whiteSpace: "nowrap" }}>
                    {t?.name}
                  </b>
                  <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "11px", color: "#8C877E", whiteSpace: "nowrap" }}>
                    {t?.price}
                  </span>
                </div>
                <span style={{ fontSize: "13px", color: "#B8B3AA" }}>
                  {t?.use}
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ height: "6px", borderRadius: "3px", background: "#232325", width: "90%" }} />
                  <span style={{ height: "6px", borderRadius: "3px", background: "#232325", width: "62%" }} />
                  <span style={{ height: "6px", borderRadius: "3px", background: "#232325", width: "76%" }} />
                </div>
                <span style={{ alignSelf: "flex-start", border: "1px solid #4A2A1C", color: "#FF9A50", borderRadius: "999px", padding: "4px 10px", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase" }}>
                  {t?.tag}
                </span>
              </div>
              {" "}
            </Fragment>))}
            {" "}
            <div style={{ position: "absolute", left: "50%", top: "50%", width: "clamp(260px,28vw,380px)", borderRadius: "22px", background: "radial-gradient(ellipse at 30% 0%,#2A1A0E,#121213 70%)", border: "1px solid #FF6A00", padding: "22px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "16px", transform: `${v.platTf ?? ''}`, opacity: `${v.platOp ?? ''}`, boxShadow: "0 0 60px rgba(255,106,0,.25),0 40px 80px -20px rgba(0,0,0,.8)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ width: "40px", height: "40px", borderRadius: "11px", background: "#FF6A00", color: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", font: "700 16px var(--font-sans)" }}>
                  {"Y"}
                </span>
                <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <b style={{ fontSize: "18px" }}>
                    {v.t("Build.yourPlatform")}
                  </b>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#8C877E" }}>
                    {v.t("Build.appYourbusinessDe")}
                  </span>
                </span>
                <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "#61CC80" }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#61CC80", animation: "rdPulse 1.6s infinite" }} />
                  {v.t("Build.live")}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "6px" }}>
                {(v.modules ?? []).map((m, $index) => (<Fragment key={$index}>
                  <span style={{ border: "1px solid #3A2A1C", background: "rgba(255,106,0,.06)", borderRadius: "10px", padding: "10px 8px", fontSize: "12px", textAlign: "center" }}>
                    {m}
                  </span>
                </Fragment>))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".06em", textTransform: "uppercase", color: "#FF9A50", borderTop: "1px solid #2A2A2C", paddingTop: "12px" }}>
                <span>
                  {v.t("Build.n1Login")}
                </span>
                <span>
                  {v.t("Build.n1Database")}
                </span>
                <span>
                  {v.t("Build.n1Price")}
                </span>
              </div>
            </div>
            {" "}
          </div>
          {" "}
        </div>
      </div>
      <div id="inside" ref={v.layersRef} data-screen-label="02 Inside the platform" style={{ padding: "160px clamp(20px,3vw,40px) 0", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "40px", alignItems: "end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
              {"(02) "}
              <span style={{ color: "#F4F4F2" }}>
                {v.t("Build.insideYourPlatform")}
              </span>
            </div>
            <h2 style={{ margin: "0", fontSize: "clamp(33px,3.9vw,62px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", textWrap: "balance" }}>
              {v.t("Build.sixLayers")}{" "}
              <span style={{ color: "#FF6A00" }}>
                {v.t("Build.builtAsOne")}
              </span>
            </h2>
          </div>
          <p style={{ margin: "0", fontSize: "18px", lineHeight: "1.55", color: "#B8B3AA", maxWidth: "520px" }}>
            {v.t("Build.youOnlySeeTheTopThe")}
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,480px),1fr))", gap: "40px", alignItems: "center" }}>
          <div style={{ position: "relative", height: "clamp(460px,48vw,640px)", perspective: "2200px", contain: "paint" }}>
            {" "}
            <div style={{ position: "absolute", left: "14%", right: "14%", top: "36%", bottom: "36%", transformStyle: "preserve-3d", transform: `${v.stackTf ?? ''}`, transition: "transform .2s linear" }}>
              {" "}
              {(v.layers ?? []).map((l, $index) => (<Fragment key={$index}>
                {" "}
                <div {...press(l?.go)} style={{ position: "absolute", inset: "0", borderRadius: "18px", border: `1px solid ${l?.bd ?? ''}`, background: `${l?.bg ?? ''}`, transform: `${l?.tf ?? ''}`, transition: "transform .6s cubic-bezier(.16,1,.3,1),background .4s,border-color .4s", cursor: "pointer", overflow: "hidden", boxShadow: "0 30px 50px -20px rgba(0,0,0,.8)" }}>
                  {" "}
                  <div style={{ position: "absolute", left: "18px", right: "18px", top: "14px", display: "flex", gap: "10px", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: "13px", letterSpacing: ".08em", textTransform: "uppercase", color: `${l?.tc ?? ''}` }}>
                    <span style={{ width: "9px", height: "9px", borderRadius: "2px", background: `${l?.c ?? ''}` }} />
                    {l?.n}{" · "}{l?.t}
                  </div>
                  {" "}
                  <div style={{ position: "absolute", left: "18px", right: "18px", bottom: "16px", display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: "8px" }}>
                    {(l?.cells ?? []).map((x, $index) => (<Fragment key={$index}>
                      <span style={{ height: "26px", borderRadius: "6px", background: `${x ?? ''}` }} />
                    </Fragment>))}
                  </div>
                  {" "}
                  {l?.on ? (<>
                    <span style={{ position: "absolute", top: "0", bottom: "0", width: "18%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent)", animation: "rdScanX 1.8s linear infinite" }} />
                  </>) : null}
                  {" "}
                </div>
                {" "}
              </Fragment>))}
              {" "}
            </div>
            {" "}
          </div>
          <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #232325" }}>
            {(v.layers ?? []).map((l, $index) => (<Fragment key={$index}>
              {" "}
              <button onClick={l?.go} style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "left", background: "none", border: "none", borderBottom: "1px solid #1C1C1E", padding: "20px 0", cursor: "pointer", color: "#F4F4F2", fontFamily: "var(--font-sans)", opacity: `${l?.rowOp ?? ''}`, transition: "opacity .3s" }}>
                <span style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: `${l?.c ?? ''}` }}>
                    {l?.n}
                  </span>
                  <span style={{ fontSize: "clamp(22px,2vw,30px)", fontWeight: "600", letterSpacing: "-0.03em" }}>
                    {l?.t}
                  </span>
                </span>
                {l?.on ? (<>
                  {" "}
                  <span style={{ display: "flex", flexDirection: "column", gap: "12px", paddingLeft: "36px" }}>
                    <span style={{ fontSize: "16px", lineHeight: "1.55", color: "#B8B3AA", maxWidth: "520px" }}>
                      {l?.d}
                    </span>
                    <span style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {(l?.chips ?? []).map((k, $index) => (<Fragment key={$index}>
                        <span style={{ border: "1px solid #3A3A3C", borderRadius: "999px", padding: "7px 13px", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase" }}>
                          {k}
                        </span>
                      </Fragment>))}
                    </span>
                  </span>
                  {" "}
                </>) : null}
              </button>
              {" "}
            </Fragment>))}
          </div>
        </div>
      </div>
      <div ref={v.journeyRef} data-screen-label="03 One request" style={{ height: `${v.jH ?? ''}`, position: "relative", marginTop: "140px" }}>
        {" "}
        <div style={{ position: `${v.jPos ?? ''}`, top: "0", height: `${v.jInnerH ?? ''}`, display: "flex", flexDirection: "column", justifyContent: "center", gap: "48px", padding: "40px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", boxSizing: "border-box" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "24px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
                {"(03) "}
                <span style={{ color: "#F4F4F2" }}>
                  {v.t("Build.oneRequestStartToFinish")}
                </span>
              </div>
              <h2 style={{ margin: "0", fontSize: "clamp(33px,3.9vw,62px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", maxWidth: "900px", textWrap: "balance" }}>
                {v.t("Build.fromWebsiteForm")}{" "}
                <span style={{ color: "#FF6A00" }}>
                  {v.t("Build.toPaidInvoice")}
                </span>
              </h2>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", fontFamily: "var(--font-mono)", fontSize: "13px", letterSpacing: ".08em", textTransform: "uppercase", color: "#8C877E" }}>
              <b style={{ fontSize: "40px", color: "#F4F4F2", fontFamily: "var(--font-sans)", letterSpacing: "-0.04em", fontWeight: "500" }}>
                {v.jNum}
              </b>
              {v.t("Build.n06YourInput")}{" "}
              <span style={{ color: "#FF9A50" }}>
                {v.t("Build.n1Tap")}
              </span>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            {" "}
            {v.jPin ? (<>
              {" "}
              <div style={{ position: "absolute", left: "calc(100% / 12)", right: "calc(100% / 12)", top: "9px", height: "2px", background: "#232325" }}>
                {" "}
                <div style={{ height: "100%", width: `${v.jFill ?? ''}`, background: "#FF6A00", boxShadow: "0 0 12px #FF6A00" }} />
                {" "}
                <span style={{ position: "absolute", top: "-7px", left: `${v.jFill ?? ''}`, width: "16px", height: "16px", marginLeft: "-8px", borderRadius: "50%", background: "#FF6A00", boxShadow: "0 0 0 6px rgba(255,106,0,.2),0 0 24px #FF6A00" }} />
                {" "}
              </div>
              {" "}
            </>) : null}
            {" "}
            <div style={{ display: "grid", gridTemplateColumns: `${v.jCols ?? ''}`, gap: "16px" }}>
              {(v.steps ?? []).map((p, $index) => (<Fragment key={$index}>
                {" "}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                  <span style={{ position: "relative", width: "20px", height: "20px", display: `${v.jNode ?? ''}`, borderRadius: "50%", boxSizing: "border-box", border: `2px solid ${p?.nodeBd ?? ''}`, background: `${p?.nodeBg ?? ''}`, transition: "all .4s" }} />
                  <div style={{ width: "100%", boxSizing: "border-box", borderRadius: "20px", border: `1px solid ${p?.bd ?? ''}`, background: "#111112", padding: "20px", display: "flex", flexDirection: "column", gap: "12px", opacity: `${p?.op ?? ''}`, transform: `${p?.tf ?? ''}`, transition: "opacity .5s,transform .6s cubic-bezier(.16,1,.3,1),border-color .4s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase" }}>
                      <span style={{ color: "#8C877E" }}>
                        {p?.time}
                      </span>
                      <span style={{ color: `${p?.c ?? ''}` }}>
                        {p?.layer}
                      </span>
                    </div>
                    <b style={{ fontSize: "19px", letterSpacing: "-0.02em", lineHeight: "1.2" }}>
                      {p?.t}
                    </b>
                    <span style={{ fontSize: "14px", lineHeight: "1.55", color: "#B8B3AA" }}>
                      {p?.d}
                    </span>
                  </div>
                </div>
                {" "}
              </Fragment>))}
            </div>
            {" "}
          </div>
        </div>
      </div>
      <div data-screen-label="04 What I build" style={{ padding: "140px clamp(20px,3vw,40px) 0", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "40px", alignItems: "end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
              {"(04) "}
              <span style={{ color: "#F4F4F2" }}>
                {v.t("Build.whatIBuild")}
              </span>
            </div>
            <h2 style={{ margin: "0", fontSize: "clamp(33px,3.9vw,62px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", textWrap: "balance" }}>
              {v.t("Build.ifItRunsYourBusiness")}{" "}
              <span style={{ color: "#FF6A00" }}>
                {v.t("Build.iCanBuildIt")}
              </span>
            </h2>
          </div>
          <p style={{ margin: "0", fontSize: "18px", lineHeight: "1.55", color: "#B8B3AA", maxWidth: "520px" }}>
            {v.t("Build.customSoftwareUsedToMeanAn")}
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: "12px" }}>
          {(v.caps ?? []).map((k, $index) => (<Fragment key={$index}>
            {" "}
            <a href={k?.href} className="bd-cap hv-b35902a" style={{ color: "#F4F4F2", textDecoration: "none", background: "#111112", border: "1px solid #232325", borderRadius: "22px", padding: "26px", display: "flex", flexDirection: "column", gap: "40px", minHeight: "200px", boxSizing: "border-box", transition: "transform .4s cubic-bezier(.16,1,.3,1),border-color .3s,background .3s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "12px", color: "#6B675F" }}>
                <span style={{ color: `${k?.c ?? ''}` }}>
                  {k?.n}
                </span>
                <span style={{ color: `${k?.ac ?? ''}` }}>
                  {k?.arrow}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto" }}>
                <b style={{ fontSize: "22px", letterSpacing: "-0.03em" }}>
                  {k?.t}
                </b>
                <span style={{ fontSize: "15px", lineHeight: "1.5", color: "#B8B3AA" }}>
                  {k?.d}
                </span>
              </div>
            </a>
            {" "}
          </Fragment>))}
        </div>
        <div ref={v.termRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))", gap: "40px", alignItems: "start" }}>
          <div style={{ background: "#0F0F10", border: "1px solid #232325", borderRadius: "22px", overflow: "hidden", fontFamily: "var(--font-mono)", fontSize: "clamp(12px,1vw,14px)" }}>
            {" "}
            <div style={{ display: "flex", gap: "7px", alignItems: "center", padding: "14px 18px", borderBottom: "1px solid #1C1C1E", color: "#6B675F", fontSize: "12px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#2E2E30" }} />
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#2E2E30" }} />
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#2E2E30" }} />
              <span style={{ marginLeft: "12px" }}>
                {"rialto@rideff · ~/your-platform"}
              </span>
            </div>
            {" "}
            <div style={{ padding: "24px 22px", display: "flex", flexDirection: "column", gap: "10px", lineHeight: "1.6", minHeight: "260px" }}>
              {(v.term ?? []).map((l, $index) => (<Fragment key={$index}>
                {" "}
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span>
                    <span style={{ color: "#6B675F" }}>
                      {"$ "}
                    </span>
                    <span style={{ color: "#F4F4F2" }}>
                      {l?.cmd}
                    </span>
                    {l?.cursor ? (<>
                      <span style={{ display: "inline-block", width: "8px", height: "15px", background: "#FF6A00", verticalAlign: "-2px", marginLeft: "2px", animation: "rdBlink 1s infinite" }} />
                    </>) : null}
                  </span>
                  {l?.showOut ? (<>
                    <span style={{ color: "#FF9A50" }}>
                      {l?.out}
                    </span>
                  </>) : null}
                </div>
                {" "}
              </Fragment>))}
            </div>
            {" "}
          </div>
          <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #232325" }}>
            {(v.stack ?? []).map((k, $index) => (<Fragment key={$index}>
              {" "}
              <div style={{ display: "grid", gridTemplateColumns: "150px minmax(0,1fr)", gap: "20px", padding: "20px 0", borderBottom: "1px solid #1C1C1E" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
                  {k?.t}
                </span>
                <span style={{ fontSize: "16px", lineHeight: "1.55" }}>
                  {k?.d}
                </span>
              </div>
              {" "}
            </Fragment>))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
            {v.t("Build.connectsWithTheToolsYouAlready")}
          </span>
          <div style={{ overflow: "hidden", display: "flex", flexDirection: "column", gap: "10px", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)", maskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)" }}>
            <div style={{ display: "flex", gap: "10px", width: "max-content", animation: "rdMarq 38s linear infinite" }}>
              {(v.int1 ?? []).map((i, $index) => (<Fragment key={$index}>
                <span style={{ border: "1px solid #2A2A2C", borderRadius: "999px", padding: "12px 20px", fontSize: "15px", whiteSpace: "nowrap", color: "#D8D3CA" }}>
                  {i}
                </span>
              </Fragment>))}
            </div>
            <div style={{ display: "flex", gap: "10px", width: "max-content", animation: "rdMarqR 44s linear infinite" }}>
              {(v.int2 ?? []).map((i, $index) => (<Fragment key={$index}>
                <span style={{ border: "1px solid #2A2A2C", borderRadius: "999px", padding: "12px 20px", fontSize: "15px", whiteSpace: "nowrap", color: "#D8D3CA" }}>
                  {i}
                </span>
              </Fragment>))}
            </div>
          </div>
        </div>
      </div>
      <div ref={v.casesRef} data-screen-label="05 Builds taken apart" style={{ padding: "140px clamp(20px,3vw,40px) 0", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "24px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
              {"(05) "}
              <span style={{ color: "#F4F4F2" }}>
                {v.t("Build.buildsTakenApart")}
              </span>
            </div>
            <h2 style={{ margin: "0", fontSize: "clamp(33px,3.9vw,62px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", maxWidth: "960px", textWrap: "balance" }}>
              {v.t("Build.threeBuilds")}{" "}
              <span style={{ color: "#FF6A00" }}>
                {v.t("Build.layerByLayer")}
              </span>
            </h2>
          </div>
          <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.55", color: "#B8B3AA", maxWidth: "420px" }}>
            {v.t("Build.eachOneSplitIntoWhatYou")}
          </p>
        </div>
        {(v.cases ?? []).map((c, $index) => (<Fragment key={$index}>
          {" "}
          <div data-case={c?.i} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,460px),1fr))", gap: "56px", alignItems: "center", padding: "72px 0", borderTop: "1px solid #232325" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              <div style={{ display: "flex", gap: "12px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase" }}>
                <span style={{ color: "#6B675F" }}>
                  {c?.n}{" / 03"}
                </span>
                <span style={{ color: "#F4F4F2" }}>
                  {c?.kind}
                </span>
              </div>
              <h3 style={{ margin: "0", fontSize: "clamp(44px,5.2vw,84px)", lineHeight: ".95", letterSpacing: "-0.05em", fontWeight: "600" }}>
                {c?.t}
              </h3>
              <p style={{ margin: "0", fontSize: "clamp(17px,1.5vw,22px)", lineHeight: "1.5", color: "#B8B3AA", maxWidth: "560px" }}>
                {c?.d}
              </p>
              <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #3A3A3C" }}>
                {(c?.bullets ?? []).map((b, $index) => (<Fragment key={$index}>
                  <div style={{ display: "flex", gap: "16px", alignItems: "baseline", padding: "16px 0", borderBottom: "1px solid #1C1C1E", fontSize: "16px", lineHeight: "1.5", color: "#D8D3CA" }}>
                    <span style={{ width: "9px", height: "9px", background: "#FF6A00", borderRadius: "2px", flexShrink: "0", transform: "translateY(1px)" }} />
                    {b}
                  </div>
                </Fragment>))}
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {(c?.chips ?? []).map((k, $index) => (<Fragment key={$index}>
                  <span style={{ border: "1px solid #3A3A3C", borderRadius: "999px", padding: "8px 14px", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase" }}>
                    {k}
                  </span>
                </Fragment>))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "16px" }}>
                {(c?.stats ?? []).map((s, $index) => (<Fragment key={$index}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingTop: "14px", borderTop: "1px solid #232325" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
                      {s?.k}
                    </span>
                    <span style={{ fontSize: "clamp(34px,3.4vw,52px)", fontWeight: "500", letterSpacing: "-0.04em", lineHeight: "1" }}>
                      {s?.v}
                    </span>
                  </div>
                </Fragment>))}
              </div>
              <a href={c?.href} style={{ display: "flex", gap: "14px", alignItems: "center", padding: "10px 0", fontFamily: "var(--font-mono)", fontSize: "13px", letterSpacing: ".1em", textTransform: "uppercase" }}>
                <span style={{ color: "#FF6A00" }}>
                  {"⟶"}
                </span>
                <span style={{ borderBottom: "1px solid #F4F4F2", paddingBottom: "3px" }}>
                  {c?.link}
                </span>
              </a>
            </div>
            <div style={{ position: "relative", height: "clamp(420px,46vw,660px)", perspective: "1800px", marginTop: "clamp(40px,6vw,80px)", contain: "paint" }}>
              {" "}
              <div style={{ position: "absolute", left: "8%", right: "8%", top: "18%", bottom: "18%", transformStyle: "preserve-3d", transform: `${c?.stage ?? ''}` }}>
                {" "}
                <div style={{ position: "absolute", inset: "0", borderRadius: "18px", overflow: "hidden", background: "#EDEAE4", transform: `${c?.l0 ?? ''}`, boxShadow: "0 40px 80px rgba(0,0,0,.5)" }}>
                  <ImageSlot src={c?.srcSys} alt={c?.phSys} shape="rect" />
                  <span style={{ position: "absolute", left: "14px", top: "12px", background: "rgba(11,11,12,.8)", color: "#F4F4F2", borderRadius: "999px", padding: "5px 11px", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase" }}>
                    {v.t("Build.n02System")}
                  </span>
                </div>
                {" "}
                <div style={{ position: "absolute", inset: "0", borderRadius: "18px", overflow: "hidden", background: "#1A1A1C", transform: `${c?.l1 ?? ''}`, boxShadow: "0 40px 80px rgba(0,0,0,.45)" }}>
                  <ImageSlot src={c?.srcUi} alt={c?.phUi} shape="rect" />
                  <span style={{ position: "absolute", left: "14px", bottom: "12px", background: "rgba(11,11,12,.8)", color: "#F4F4F2", borderRadius: "999px", padding: "5px 11px", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase" }}>
                    {v.t("Build.n01Interface")}
                  </span>
                </div>
                {" "}
                <div style={{ position: "absolute", right: "6%", top: "8%", width: "58%", borderRadius: "16px", background: "rgba(11,11,12,.94)", border: "1px solid #2A2A2C", padding: "22px 24px", boxSizing: "border-box", fontFamily: "var(--font-mono)", fontSize: "clamp(11px,1vw,14px)", lineHeight: "1.9", transform: `${c?.l2 ?? ''}`, opacity: `${c?.op2 ?? ''}`, boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>
                  {" "}
                  {(c?.spec ?? []).map((x, $index) => (<Fragment key={$index}>
                    <div style={{ display: "grid", gridTemplateColumns: "90px minmax(0,1fr)", gap: "12px" }}>
                      <span style={{ color: "#FF9A50" }}>
                        {x?.k}
                      </span>
                      <span style={{ color: "#D8D3CA" }}>
                        {x?.v}
                      </span>
                    </div>
                  </Fragment>))}
                  {" "}
                  <span style={{ display: "block", paddingTop: "8px", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6B675F" }}>
                    {v.t("Build.n03Spec")}
                  </span>
                  {" "}
                </div>
                {" "}
                <div style={{ position: "absolute", left: "4%", bottom: "4%", width: "19%", aspectRatio: "9/18", borderRadius: "22px", overflow: "hidden", background: "#0A0A0A", border: "5px solid #0A0A0A", transform: `${c?.l3 ?? ''}`, opacity: `${c?.op3 ?? ''}`, boxShadow: "0 30px 60px rgba(0,0,0,.55)" }}>
                  <ImageSlot src={c?.srcMob} alt={v.t("Build.mobile")} shape="rect" />
                </div>
                {" "}
              </div>
              {" "}
            </div>
          </div>
          {" "}
        </Fragment>))}
      </div>
      <BrainRollout t={v.t} contactHref={v.href("@cal")} pricingHref={v.href("/pricing")} />
      <div data-screen-label="07 Process" style={{ padding: "140px clamp(20px,3vw,40px) 100px", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "48px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
            {"(07) "}
            <span style={{ color: "#F4F4F2" }}>
              {v.t("Build.process")}
            </span>
          </div>
          <h2 style={{ margin: "0", fontSize: "clamp(33px,3.9vw,62px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600" }}>
            {v.t("Build.fromFirstCallTo")}{" "}
            <span style={{ color: "#FF6A00" }}>
              {v.t("Build.yourOwnPlatform")}
            </span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "32px" }}>
          {(v.process ?? []).map((p, $index) => (<Fragment key={$index}>
            {" "}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", borderTop: "1px solid #3A3A3C", paddingTop: "22px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FF6A00" }}>
                {p?.n}
              </span>
              <span style={{ fontSize: "26px", fontWeight: "600", letterSpacing: "-0.03em" }}>
                {p?.t}
              </span>
              <span style={{ fontSize: "16px", lineHeight: "1.5", color: "#B8B3AA" }}>
                {p?.d}
              </span>
            </div>
            {" "}
          </Fragment>))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", flexWrap: "wrap", paddingTop: "28px", borderTop: "1px solid #232325" }}>
          <span style={{ fontSize: "18px", color: "#B8B3AA" }}>
            {v.t("Build.nextPillar")}{" "}
            <b style={{ color: "#F4F4F2" }}>
              {v.t("Build.run")}
            </b>
            {v.t("Build.whatHappensAfterLaunch")}
          </span>
          <a href={v.href("/run")} style={{ border: "1px solid #F4F4F2", borderRadius: "999px", padding: "14px 22px", fontWeight: "600", fontSize: "13px", letterSpacing: ".06em", textTransform: "uppercase" }}>
            {v.t("Build.enterRun")}
          </a>
        </div>
      </div>
      <PillarClose t={v.t} label={v.t("Build.startHere")} head={v.t("Build.bringYourSixToolsLeaveWith")} accent={v.t("Build.onePlatform")} body={v.t("Build.closeBody")} />
      <Footer  />
    </>
  );
};

export default function BuildPage(props) {
  const dc = useDC();
  return <Logic key={dc.locale} {...dc} {...props} />;
}
