// @ts-nocheck -- ported 1:1 from rideff_handoff/design/RideffFooter.dc.html (see scripts/dc-port/convert.mjs)
'use client';
import React, { Fragment } from 'react';
import { DCLogic, dcStyle, opt, useDC } from '@/lib/dc';


class Logic extends DCLogic {
  state = {
    flash: -1
  };
  wmRef = React.createRef();
  walkRef = React.createRef();
  measure = () => {
    const row = this.walkRef.current && this.walkRef.current.parentElement;
    if (!row) return;
    const rr = row.getBoundingClientRect(),
      fs = parseFloat(getComputedStyle(row).fontSize),
      L = .8 * fs;
    const cv = this._cv || (this._cv = document.createElement('canvas')),
      ctx = cv.getContext('2d');
    ctx.font = '700 ' + fs + 'px var(--font-sans)';
    const m = ctx.measureText('E'),
      fa = m.fontBoundingBoxAscent || fs * .95,
      fd = m.fontBoundingBoxDescent || fs * .25,
      asc = m.actualBoundingBoxAscent || fs * .7;
    const capOff = (L - (fa + fd)) / 2 + fa - asc;
    const sx = rr.width / row.offsetWidth || 1;
    this.segs = [...row.querySelectorAll('[data-wl]')].map((el, k) => {
      const r = el.getBoundingClientRect(),
        c = 'RIDEFF'[k],
        x0 = (r.left - rr.left) / sx + fs * .03,
        w = r.width / sx - fs * .06,
        frac = c === 'R' || c === 'D' ? .62 : c === 'I' ? 1 : .96;
      return {
        k,
        x0,
        x1: x0 + w * frac,
        y: el.offsetTop + capOff
      };
    });
    this.scale = Math.max(.75, Math.min(1.35, fs / 230));
    this.fs = fs;
    if (this.w == null && this.segs.length) {
      this.w = {
        x: this.segs[0].x0 + 4,
        dir: 1,
        seg: 0,
        mode: 'walk',
        t: 0,
        tapped: {}
      };
    }
  };
  componentDidMount() {
    this.alive = true;
    let rm = false;
    try {
      rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {}
    const el = this.wmRef.current;
    if (el && 'IntersectionObserver' in window) {
      this.io = new IntersectionObserver(es => {
        this.vis = es[0].isIntersecting;
      }, {
        threshold: .1
      });
      this.io.observe(el);
    } else this.vis = true;
    const go = () => {
      this.measure();
      window.addEventListener('resize', () => {
        const w = this.w;
        this.measure();
        if (w && this.segs[w.seg]) {
          const sg = this.segs[w.seg];
          w.x = Math.max(sg.x0, Math.min(sg.x1, w.x));
        }
      });
      if (this.walkRef.current) this.walkRef.current.style.opacity = 1;
      let last = performance.now();
      const loop = now => {
        if (!this.alive) return;
        this.raf = requestAnimationFrame(loop);
        const dt = Math.min(.05, (now - last) / 1000);
        last = now;
        if (!this.vis && !rm) return;
        this.step(dt, now / 1000, rm);
      };
      this.raf = requestAnimationFrame(loop);
    };
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(go, 200));
  }
  componentWillUnmount() {
    this.alive = false;
    cancelAnimationFrame(this.raf);
    this.io && this.io.disconnect();
    window.removeEventListener('resize', this.measure);
    clearTimeout(this.ft);
    clearTimeout(this.tapT);
  }
  flash(k) {
    this.setState({
      flash: k
    });
    clearTimeout(this.ft);
    this.ft = setTimeout(() => this.setState({
      flash: -1
    }), 700);
  }
  ACTS = ['fix', 'bug', 'scan', 'mail'];
  LINES = {
    fix: [this.props.t("RideffFooter.updateInstalled"), this.props.t("RideffFooter.securityPatch"), this.props.t("RideffFooter.sSLRenewed")],
    bug: [this.props.t("RideffFooter.bugFixed"), this.props.t("RideffFooter.checkoutBugSquashed"), this.props.t("RideffFooter.fixedBeforeYouNoticed")],
    scan: ['Backup done · 03:00', this.props.t("RideffFooter.all6LayersOk"), this.props.t("RideffFooter.uptimeCheck")],
    mail: [this.props.t("RideffFooter.inquiryAnswered"), this.props.t("RideffFooter.invoiceSent"), this.props.t("RideffFooter.mondayReportSent")],
    slip: [this.props.t("RideffFooter.whoopsLoggedFixed"), this.props.t("RideffFooter.caughtIt"), this.props.t("RideffFooter.monitoredEvenMe")],
    rest: [this.props.t("RideffFooter.allSystemsNormal"), this.props.t("RideffFooter.hostedInFrankfurt"), this.props.t("RideffFooter.runningWhileYouSleep")]
  };
  pick(a) {
    return a[Math.random() * a.length | 0];
  }
  say(text, x, y) {
    const b = this.bub;
    if (!b) return;
    b.textContent = text;
    b.style.left = x.toFixed(1) + 'px';
    b.style.top = (y - 34 * this.scale).toFixed(1) + 'px';
    b.style.opacity = 1;
    this.bubT = performance.now() + 1800;
  }
  step(dt, time, rm) {
    const w = this.w,
      S = this.segs,
      el = this.walkRef.current;
    if (!w || !S || !S.length || !el) return;
    const row = el.parentElement;
    if (!this.bub) {
      this.bub = row.querySelector('[data-bub]');
      this.bug = row.querySelector('[data-bug]');
      this.mail = row.querySelector('[data-mail]');
    }
    const sc = this.scale,
      v = 34 * sc,
      last = S.length - 1,
      cap = S[w.seg].y;
    let yOff = 0,
      legA = 0,
      armR = 0,
      rot = 0,
      face = w.dir,
      beamR = 18 + Math.sin(time * 2.2) * 12,
      beamOn = false;
    if (this.bubT && performance.now() > this.bubT) {
      this.bubT = 0;
      this.bub.style.opacity = 0;
    }
    if (rm) {
      w.seg = last;
      w.x = S[last].x1 - 10;
      w.mode = 'rest';
      armR = 0;
    } else if (w.mode === 'walk') {
      w.x += v * dt * w.dir;
      const sg = S[w.seg],
        mid = (sg.x0 + sg.x1) / 2;
      beamOn = true;
      if (!w.tapped[w.seg] && Math.random() < .85 && (w.dir > 0 ? w.x >= mid : w.x <= mid)) {
        w.tapped[w.seg] = 1;
        w.mode = 'act';
        w.t = 0;
        let a;
        do {
          a = this.pick(this.ACTS);
        } while (a === w.lastAct);
        w.act = a;
        w.lastAct = a;
        w.fl = 0;
        w.said = 0;
      } else if (!w.tapped[w.seg] && (w.dir > 0 ? w.x >= mid : w.x <= mid)) w.tapped[w.seg] = 1;else if (w.dir > 0 ? w.x >= sg.x1 : w.x <= sg.x0) {
        const nx = w.seg + w.dir;
        if (nx >= 0 && nx <= last) {
          w.from = w.x;
          w.to = w.dir > 0 ? S[nx].x0 + 2 : S[nx].x1 - 2;
          w.nseg = nx;
          w.t = 0;
          w.mode = !w.slipped && Math.random() < .28 ? 'slip' : 'hop';
          if (w.mode === 'slip') w.slipped = 1;
        } else {
          w.mode = 'rest';
          w.t = 0;
          w.said = 0;
        }
      }
      legA = Math.sin(time * 14) * 22;
    } else if (w.mode === 'hop') {
      w.t += dt / .45;
      const u = Math.min(1, w.t);
      w.x = w.from + (w.to - w.from) * u;
      yOff = -Math.sin(u * Math.PI) * 14 * sc;
      legA = 18;
      rot = w.dir * 8 * Math.sin(u * Math.PI);
      if (u >= 1) {
        w.seg = w.nseg;
        w.mode = 'walk';
      }
    } else if (w.mode === 'slip') {
      w.t += dt;
      const t = w.t;
      if (t < .25) {
        const u = t / .25;
        w.x = w.from + w.dir * 5 * sc * u;
        yOff = u * u * 13 * sc;
        rot = w.dir * 40 * u;
        legA = 30;
        armR = -170;
      } else if (t < 1.2) {
        yOff = 13 * sc + Math.sin(t * 18) * 1.2;
        rot = w.dir * 12 + Math.sin(t * 9) * 8;
        legA = Math.sin(t * 22) * 40;
        armR = -175;
      } else if (t < 1.65) {
        const u = (t - 1.2) / .45;
        w.x = w.from + w.dir * 5 * sc + (w.to - w.from - w.dir * 5 * sc) * u;
        yOff = 13 * sc * (1 - u) - Math.sin(u * Math.PI) * 10 * sc;
        rot = w.dir * 12 * (1 - u);
        legA = 20;
        armR = -120 * (1 - u);
      } else {
        w.seg = w.nseg;
        w.x = w.to;
        w.mode = 'walk';
        this.say(this.pick(this.LINES.slip), w.x, S[w.seg].y);
      }
    } else if (w.mode === 'act') {
      w.t += dt;
      const t = w.t,
        a = w.act,
        k = S[w.seg].k;
      if (a === 'fix') {
        armR = -60 + Math.abs(Math.sin(t * 12)) * 50;
        if (t > .35 && !w.fl) {
          w.fl = 1;
          this.flash(k);
          this.say(this.pick(this.LINES.fix), w.x, cap);
        }
        if (t > 1.2) w.mode = 'walk';
      } else if (a === 'scan') {
        beamOn = true;
        beamR = 35 + Math.sin(t * 5) * 30;
        if (t > .3 && !w.fl) {
          w.fl = 1;
          this.flash(k);
          this.say(this.pick(this.LINES.scan), w.x, cap);
        }
        if (t > 1.5) w.mode = 'walk';
      } else if (a === 'mail') {
        armR = -150;
        const m = this.mail,
          u = Math.max(0, (t - .3) / 1);
        if (m) {
          m.style.opacity = t < .3 ? 1 : Math.max(0, 1 - u);
          m.style.transform = 'translate(' + (w.x - 5 + u * 60 * sc * w.dir).toFixed(1) + 'px,' + (cap - 32 * sc - u * 70 * sc).toFixed(1) + 'px) rotate(' + (u * 30 * w.dir).toFixed(1) + 'deg) scale(' + sc.toFixed(2) + ')';
        }
        if (t > .3 && !w.said) {
          w.said = 1;
          this.say(this.pick(this.LINES.mail), w.x, cap);
        }
        if (t > 1.4) {
          if (m) m.style.opacity = 0;
          w.mode = 'walk';
        }
      } else if (a === 'bug') {
        const b = this.bug,
          bx0 = w.x + w.dir * 46 * sc;
        let bx = bx0 - w.dir * Math.min(1, t / .9) * 30 * sc,
          squash = t > 1.05;
        if (b) {
          b.style.opacity = t > 1.6 ? 0 : 1;
          b.style.transform = 'translate(' + (bx - 3.5).toFixed(1) + 'px,' + (cap - 4 * (squash ? .3 : 1) + Math.abs(Math.sin(t * 30)) * (squash ? 0 : .6)).toFixed(1) + 'px) scale(' + (sc * w.dir * -1).toFixed(2) + ',' + (sc * (squash ? .3 : 1)).toFixed(2) + ')';
          b.style.background = squash ? '#8C2A2D' : '#E5484D';
        }
        if (t > .9 && t < 1.15) {
          const u = (t - .9) / .25;
          w.x += w.dir * v * dt * 2;
          yOff = -Math.sin(u * Math.PI) * 9 * sc;
          legA = 25;
        } else legA = 0;
        if (squash && !w.fl) {
          w.fl = 1;
          this.flash(k);
          this.say(this.pick(this.LINES.bug), w.x, cap);
        }
        if (t > 1.8) {
          if (b) b.style.opacity = 0;
          w.mode = 'walk';
        }
      }
    } else if (w.mode === 'rest') {
      w.t += dt;
      armR = -150 + Math.sin(w.t * 9) * 25;
      if (!w.said && w.t > .3) {
        w.said = 1;
        this.say(this.pick(this.LINES.rest), w.x, cap);
      }
      if (w.t > 2.8) {
        w.dir *= -1;
        w.tapped = {};
        w.slipped = 0;
        w.mode = 'walk';
      }
    }
    if (this.near && (w.mode === 'walk' || w.mode === 'rest')) {
      face = this.near.x > w.x ? 1 : -1;
      legA = 0;
      armR = -150 + Math.sin(time * 9) * 25;
      if (w.mode === 'walk') w.x -= v * dt * w.dir;
      if (!this.hiT || performance.now() - this.hiT > 4000) {
        this.hiT = performance.now();
        this.say(this.props.t("RideffFooter.hiIKeepRIDEFFRunning"), w.x, cap);
      }
    } else face = w.mode === 'rest' ? -w.dir : w.dir;
    const y = S[w.seg].y + yOff;
    el.style.transformOrigin = '50% 100%';
    el.style.transform = 'translate(' + (w.x - 8).toFixed(1) + 'px,' + (y - 22 * sc).toFixed(1) + 'px) rotate(' + rot.toFixed(1) + 'deg) scale(' + (sc * face).toFixed(3) + ',' + sc.toFixed(3) + ')';
    const a = el.querySelector('[data-leg="a"]'),
      b = el.querySelector('[data-leg="b"]'),
      arm = el.querySelector('[data-arm]');
    if (a) a.style.transform = 'rotate(' + legA.toFixed(1) + 'deg)';
    if (b) b.style.transform = 'rotate(' + (-legA).toFixed(1) + 'deg)';
    if (arm) arm.style.transform = 'rotate(' + armR.toFixed(1) + 'deg)';
    const led = el.querySelector('[data-led]'),
      beam = el.querySelector('[data-beam]'),
      eye = el.querySelector('[data-eye]');
    if (led) led.style.opacity = Math.sin(time * 6) > 0 || w.mode === 'act' ? 1 : .25;
    if (beam) {
      beam.style.opacity = beamOn ? (.55 + Math.sin(time * 3) * .25).toFixed(2) : '0';
      beam.style.transform = 'rotate(' + beamR.toFixed(1) + 'deg)';
    }
    if (eye) eye.style.height = (w.mode === 'slip' ? 2.5 : Math.sin(time * 1.7) > .97 ? .4 : 2) + 'px';
  }
  renderVals() {
    const s = this.state || {};
    return {
      wmRef: this.wmRef,
      walkRef: this.walkRef,
      wmMove: e => {
        const row = this.walkRef.current && this.walkRef.current.parentElement;
        if (!row || !this.w) return;
        const r = row.getBoundingClientRect(),
          sx = r.width / row.offsetWidth || 1,
          x = (e.clientX - r.left) / sx;
        this.near = Math.abs(x - this.w.x) < 140 ? {
          x
        } : null;
      },
      wmLeave: () => {
        this.near = null;
      },
      wmTap: e => {
        if (!this.w) return;
        this.near = {
          x: this.w.x + 1
        };
        clearTimeout(this.tapT);
        this.tapT = setTimeout(() => {
          this.near = null;
        }, 1800);
      },
      letters: 'RIDEFF'.split('').map((c, k) => ({
        c,
        k,
        col: s.flash === k ? '#FF6A00' : '#1C1C1E',
        sh: s.flash === k ? '0 0 40px rgba(255,106,0,.35)' : 'none'
      }))
    };
  }
}

Logic.prototype.render = function render() {
  const v = { ...this.props, ...this.renderVals() };
  return (
    <>
      <div className="rd-footer" style={{ background: "#0B0B0C", color: "#F4F4F2", fontFamily: "var(--font-sans)", borderTop: "1px solid #1C1C1E" }}>
        {" "}
        <div className="rd-fgrid" style={{ padding: "64px clamp(20px,3vw,40px) 32px", maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "32px", fontSize: "14px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <a href={v.href("/")} style={{ alignSelf: "flex-start" }}>
              <img src={opt("/images/rideff-mark.png")} alt="RIDEFF" style={{ height: "30px", width: "auto", display: "block" }} />
            </a>
            <span style={{ color: "#8C877E", lineHeight: "1.5" }}>
              {v.t("RideffFooter.understandBuildRunOneOperatorFrom")}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6B675F" }}>
              {v.t("RideffFooter.pillars")}
            </span>
            <a href={v.href("/understand")} style={{ color: "#B8B3AA", textDecoration: "none" }}>
              {v.t("RideffFooter.n01Understand")}
            </a>
            <a href={v.href("/build")} style={{ color: "#B8B3AA", textDecoration: "none" }}>
              {v.t("RideffFooter.n02Build")}
            </a>
            <a href={v.href("/run")} style={{ color: "#B8B3AA", textDecoration: "none" }}>
              {v.t("RideffFooter.n03Run")}
            </a>
            <a href={v.href("/life")} style={{ color: "#B8B3AA", textDecoration: "none", fontFamily: "var(--font-accent)", fontSize: "16px" }}>
              {"RIDEFF Life"}
            </a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6B675F" }}>
              {v.t("RideffFooter.pages")}
            </span>
            <a href={v.href("/work")} style={{ color: "#B8B3AA", textDecoration: "none" }}>
              {v.t("RideffFooter.work")}
            </a>
            <a href={v.href("/pricing")} style={{ color: "#B8B3AA", textDecoration: "none" }}>
              {v.t("RideffFooter.pricing")}
            </a>
            <a href={v.href("/about")} style={{ color: "#B8B3AA", textDecoration: "none" }}>
              {v.t("RideffFooter.about")}
            </a>
            <a href={v.href("/contact")} style={{ color: "#B8B3AA", textDecoration: "none" }}>
              {v.t("RideffFooter.contact")}
            </a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6B675F" }}>
              {v.t("RideffFooter.reachRialto")}
            </span>
            <a href="https://wa.me/4917632572420" style={{ color: "#B8B3AA", textDecoration: "none" }}>
              {"WhatsApp +49 176 32572420"}
            </a>
            <a href="mailto:hallo@rideff.com" style={{ color: "#B8B3AA", textDecoration: "none" }}>
              {"hallo@rideff.com"}
            </a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#6B675F" }}>
              {v.t("RideffFooter.legal")}
            </span>
            <a href={v.href("/impressum")} style={{ color: "#B8B3AA", textDecoration: "none" }}>
              {"Impressum"}
            </a>
            <a href={v.href("/datenschutz")} style={{ color: "#B8B3AA", textDecoration: "none" }}>
              {"Datenschutz"}
            </a>
            <a href={v.href("/agb")} style={{ color: "#B8B3AA", textDecoration: "none" }}>
              {"AGB"}
            </a>
          </div>
        </div>
        {" "}
        <div className="rd-copy" style={{ padding: "0 clamp(20px,3vw,40px) 32px", maxWidth: "1480px", margin: "0 auto", display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", fontSize: "12px", color: "#6B675F" }}>
          <span>
            {v.t("RideffFooter.n2026RIDEFFRialtoEichstattGermany")}
          </span>
          <span>
            {v.t("RideffFooter.hostedInTheEUFrankfurt")}
          </span>
        </div>
        {" "}
        <div ref={v.wmRef} onMouseMove={v.wmMove} onMouseLeave={v.wmLeave} onClick={v.wmTap} style={{ overflow: "hidden", padding: "64px clamp(20px,3vw,40px) 0", maxWidth: "1480px", margin: "0 auto", cursor: "default" }} aria-hidden="true">
          {" "}
          <div style={{ position: "relative", display: "flex", justifyContent: "center", fontSize: "clamp(90px,22vw,340px)", fontWeight: "700", letterSpacing: "-0.07em", lineHeight: ".8", transform: "translateY(10%)", userSelect: "none" }}>
            {(v.letters ?? []).map((l, $index) => (<Fragment key={$index}>
              <span data-wl={l?.k} style={{ display: "inline-block", padding: "0 .02em", color: `${l?.col ?? ''}`, transition: "color .7s ease-out", textShadow: `${l?.sh ?? ''}` }}>
                {l?.c}
              </span>
            </Fragment>))}
            <div ref={v.walkRef} style={{ position: "absolute", left: "0", top: "0", width: "16px", height: "22px", pointerEvents: "none", opacity: "0", transition: "opacity .6s", willChange: "transform" }}>
              {" "}
              <span style={{ position: "absolute", left: "1px", bottom: "-2px", width: "14px", height: "3px", borderRadius: "50%", background: "rgba(0,0,0,.6)" }} />
              {" "}
              <span data-beam="1" style={{ position: "absolute", left: "13px", top: "6px", width: "46px", height: "14px", transformOrigin: "0 50%", background: "linear-gradient(90deg,rgba(255,154,80,.55),rgba(255,154,80,0))", clipPath: "polygon(0 40%,100% 0,100% 100%,0 60%)", opacity: ".8" }} />
              {" "}
              <span data-leg="a" style={{ position: "absolute", left: "3px", top: "15px", width: "3px", height: "6px", borderRadius: "1px", background: "#4A4A4C", transformOrigin: "50% 0" }} />
              {" "}
              <span data-leg="b" style={{ position: "absolute", left: "10px", top: "15px", width: "3px", height: "6px", borderRadius: "1px", background: "#5A5A5C", transformOrigin: "50% 0" }} />
              {" "}
              <span style={{ position: "absolute", left: "2px", top: "8px", width: "12px", height: "8px", borderRadius: "3px", background: "#B8B3AA" }} />
              {" "}
              <span style={{ position: "absolute", left: "6px", top: "10px", width: "4px", height: "3px", borderRadius: "1px", background: "#FF6A00" }} />
              {" "}
              <span data-arm="1" style={{ position: "absolute", left: "12px", top: "9px", width: "2px", height: "6px", borderRadius: "1px", background: "#8C877E", transformOrigin: "50% 1px" }}>
                <span style={{ position: "absolute", left: "-1px", top: "5px", width: "4px", height: "2px", borderRadius: "1px", background: "#FF9A50" }} />
              </span>
              {" "}
              <span style={{ position: "absolute", left: "1px", top: "0", width: "14px", height: "8px", borderRadius: "4px", background: "#D8D3CA" }} />
              {" "}
              <span style={{ position: "absolute", left: "3.5px", top: "2px", width: "9px", height: "4px", borderRadius: "2px", background: "#0B0B0C" }} />
              {" "}
              <span data-eye="1" style={{ position: "absolute", left: "5px", top: "3px", width: "2px", height: "2px", borderRadius: "50%", background: "#FF9A50", boxShadow: "4px 0 0 #FF9A50" }} />
              {" "}
              <span style={{ position: "absolute", left: "7.3px", top: "-5px", width: "1.4px", height: "5px", background: "#8C877E" }} />
              {" "}
              <span data-led="1" style={{ position: "absolute", left: "6.3px", top: "-7px", width: "3.4px", height: "3.4px", borderRadius: "50%", background: "#FF6A00", boxShadow: "0 0 6px #FF6A00" }} />
              {" "}
            </div>
            <span data-bug="1" style={{ position: "absolute", left: "0", top: "0", width: "7px", height: "4px", borderRadius: "4px 4px 1px 1px", background: "#E5484D", opacity: "0", pointerEvents: "none", boxShadow: "-2px -1px 0 -1px #E5484D,2px 1px 0 -1px #8C2A2D" }} />
            <span data-mail="1" style={{ position: "absolute", left: "0", top: "0", width: "10px", height: "7px", borderRadius: "1.5px", background: "#F4F4F2", opacity: "0", pointerEvents: "none", backgroundImage: "linear-gradient(155deg,transparent 45%,#BDB6AA 46%,#BDB6AA 54%,transparent 55%),linear-gradient(25deg,transparent 45%,#BDB6AA 46%,#BDB6AA 54%,transparent 55%)" }} />
            <span data-bub="1" style={{ position: "absolute", left: "0", top: "0", transform: "translate(-50%,-100%)", opacity: "0", transition: "opacity .25s", pointerEvents: "none", whiteSpace: "nowrap", background: "#F4F4F2", color: "#0A0A0A", borderRadius: "999px", padding: "5px 10px", font: "500 11px var(--font-mono)", letterSpacing: ".02em", boxShadow: "0 6px 18px rgba(0,0,0,.5)" }} />
          </div>
          {" "}
        </div>
      </div>
    </>
  );
};

export default function Footer(props) {
  const dc = useDC();
  return <Logic key={dc.locale} {...dc} {...props} />;
}
