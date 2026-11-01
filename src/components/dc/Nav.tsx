// @ts-nocheck -- ported 1:1 from rideff_handoff/design/RideffNav.dc.html (see scripts/dc-port/convert.mjs)
'use client';
import React, { Fragment } from 'react';
import { DCLogic, dcStyle, useDC, useSwitchLocale } from '@/lib/dc';


class Logic extends DCLogic {
  state = {
    open: false,
    w: 1400,
    sc: false
  };
  componentDidMount() {
    this.onR = () => this.setState({
      w: window.innerWidth
    });
    this.onS = () => {
      const sc = window.scrollY > 80;
      if (sc !== this.state.sc) this.setState({
        sc
      });
    };
    // SiteFx asks open overlays to close when a page transition starts.
    this.onNav = () => this.setState({ open: false });
    window.addEventListener('resize', this.onR);
    window.addEventListener('scroll', this.onS, {
      passive: true
    });
    document.addEventListener('rideff:navigate', this.onNav);
    this.onR();
    this.onS();
  }
  componentDidUpdate(_, prev) {
    // Menu overlay: stop Lenis and lock page scroll while open.
    if (prev.open !== this.state.open) {
      if (this.state.open) window.__lenis?.stop(); else window.__lenis?.start();
      document.documentElement.style.overflow = this.state.open ? 'hidden' : '';
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onR);
    window.removeEventListener('scroll', this.onS);
    document.removeEventListener('rideff:navigate', this.onNav);
    if (this.state.open) { window.__lenis?.start(); document.documentElement.style.overflow = ''; }
  }
  PAGES = [['home', this.props.t("RideffNav.home"), this.props.href("/")], ['understand', this.props.t("RideffNav.understand"), this.props.href("/understand")], ['build', this.props.t("RideffNav.build"), this.props.href("/build")], ['run', this.props.t("RideffNav.run"), this.props.href("/run")], ['work', this.props.t("RideffNav.work"), this.props.href("/work")], ['pricing', this.props.t("RideffNav.pricing"), this.props.href("/pricing")], ['about', this.props.t("RideffNav.about"), this.props.href("/about")], ['life', this.props.t("RideffNav.life"), this.props.href("/life")], ['contact', this.props.t("RideffNav.contact"), this.props.href("/contact")], ['journal', this.props.t("RideffNav.journal"), this.props.href("/journal")]];
  renderVals() {
    const a = this.props.active ?? 'home',
      dark = this.props.dark ?? false,
      s = this.state;
    const fg = dark ? '#F4F4F2' : '#0A0A0A',
      muted = dark ? '#B8B3AA' : '#5A5650';
    const wide = s.w > 1100,
      heroMode = (this.props.heroCta ?? false) && s.w > 1120 && !s.sc;
    return {
      fg,
      muted,
      full: !s.sc,
      compact: s.sc,
      justify: heroMode ? 'flex-start' : 'space-between',
      topPe: heroMode ? 'none' : 'auto',
      topBg: heroMode ? 'transparent' : dark ? 'linear-gradient(#0B0B0C,rgba(11,11,12,0))' : 'linear-gradient(#ECE8E1,rgba(236,232,225,0))',
      pillBg: dark ? 'rgba(28,28,30,.6)' : 'rgba(255,255,255,.45)',
      pillBd: dark ? 'rgba(255,255,255,.08)' : 'rgba(10,10,10,.08)',
      cBg: dark ? 'rgba(20,20,22,.82)' : 'rgba(244,241,236,.86)',
      ctaBg: dark ? '#F4F4F2' : '#0A0A0A',
      ctaFg: dark ? '#0A0A0A' : '#F4F4F2',
      linkFs: heroMode && s.w <= 1480 ? '13px' : '14px',
      linkPad: heroMode && s.w <= 1480 ? '8px 12px' : '9px 16px',
      links: this.PAGES.slice(0, 8).filter(p => s.sc ? p[0] !== 'home' : !(heroMode && s.w <= 1480 && (p[0] === 'home' || p[0] === 'life'))).map(p => {
        const on = p[0] === a,
          life = p[0] === 'life';
        return {
          t: p[1],
          href: p[2],
          bg: on ? dark ? '#F4F4F2' : '#0A0A0A' : 'transparent',
          c: on ? dark ? '#0A0A0A' : '#F4F4F2' : fg,
          ff: life ? "var(--font-serif)" : 'var(--font-sans)',
          fs: life ? 'italic' : 'normal'
        };
      }),
      menu: this.PAGES.map((p, k) => ({
        n: String(k + 1).padStart(2, '0'),
        t: p[1],
        href: p[2],
        c: p[0] === a ? '#FF6A00' : '#F4F4F2'
      })),
      showLinks: wide,
      showMenuBtn: !wide,
      showStatus: s.w > 1480,
      showCta: s.w > 560 && !heroMode,
      langs: ['de', 'en'].map(l => {
        const on = this.props.locale === l;
        return {
          t: l.toUpperCase(),
          go: () => this.props.switchLocale(l),
          bg: on ? dark ? '#F4F4F2' : '#0A0A0A' : 'transparent',
          c: on ? dark ? '#0A0A0A' : '#F4F4F2' : fg
        };
      }),
      langsMenu: ['de', 'en'].map(l => {
        const on = this.props.locale === l;
        return {
          t: l.toUpperCase(),
          go: () => this.props.switchLocale(l),
          bg: on ? '#F4F4F2' : 'transparent',
          c: on ? '#0A0A0A' : '#B8B3AA'
        };
      }),
      open: s.open,
      toggle: () => this.setState(x => ({
        open: !x.open
      }))
    };
  }
}

Logic.prototype.render = function render() {
  const v = { ...this.props, ...this.renderVals() };
  return (
    <>
      <div style={{ position: "fixed", top: "0", left: "0", right: "0", zIndex: "50", pointerEvents: "none", fontFamily: "var(--font-sans)" }}>
        {" "}
        {v.full ? (<>
          {" "}
          <div style={{ display: "flex", alignItems: "center", justifyContent: `${v.justify ?? ''}`, gap: "20px", padding: "22px clamp(20px,3vw,40px)", pointerEvents: `${v.topPe ?? ''}`, background: `${v.topBg ?? ''}` }}>
            <a href={v.href("/")} style={{ pointerEvents: "auto", fontWeight: "700", fontSize: "21px", letterSpacing: "-0.03em", color: `${v.fg ?? ''}`, textDecoration: "none", display: "flex", alignItems: "baseline", gap: "2px" }}>
              <img src="/images/rideff-mark.png" alt="RIDEFF" style={{ height: "24px", width: "auto", display: "block" }} />
            </a>
            {v.showLinks ? (<>
              {" "}
              <div style={{ pointerEvents: "auto", display: "flex", gap: "2px", alignItems: "center", padding: "5px", borderRadius: "999px", border: `1px solid ${v.pillBd ?? ''}`, background: `${v.pillBg ?? ''}`, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
                {(v.links ?? []).map((l, $index) => (<Fragment key={$index}>
                  <a href={l?.href} style={{ fontSize: `${v.linkFs ?? ''}`, padding: `${v.linkPad ?? ''}`, whiteSpace: "nowrap", borderRadius: "999px", background: `${l?.bg ?? ''}`, color: `${l?.c ?? ''}`, textDecoration: "none", fontFamily: `${l?.ff ?? ''}`, fontStyle: `${l?.fs ?? ''}`, transition: "background .2s" }}>
                    {l?.t}
                  </a>
                </Fragment>))}
              </div>
              {" "}
            </>) : null}
            <div style={{ pointerEvents: "auto", display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ pointerEvents: "auto", display: "flex", gap: "2px", padding: "4px", borderRadius: "999px", border: `1px solid ${v.pillBd ?? ''}`, background: `${v.pillBg ?? ''}` }}>
                {(v.langs ?? []).map((g, $index) => (<Fragment key={$index}>
                  <button onClick={g?.go} style={{ border: "none", cursor: "pointer", borderRadius: "999px", padding: "6px 10px", font: "500 11px var(--font-mono)", letterSpacing: ".06em", background: `${g?.bg ?? ''}`, color: `${g?.c ?? ''}` }}>
                    {g?.t}
                  </button>
                </Fragment>))}
              </div>
              {v.showStatus ? (<>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: `${v.muted ?? ''}` }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#FF6A00" }} />
                  {v.t("RideffNav.takingOnSelectClients")}
                </div>
              </>) : null}
              {v.showCta ? (<>
                <a href={v.href("/contact")} style={{ background: `${v.ctaBg ?? ''}`, color: `${v.ctaFg ?? ''}`, borderRadius: "999px", padding: "12px 20px", fontSize: "13px", fontWeight: "600", letterSpacing: ".06em", textTransform: "uppercase", textDecoration: "none" }}>
                  {v.t("RideffNav.startAProject")}
                </a>
              </>) : null}
              {v.showMenuBtn ? (<>
                <button onClick={v.toggle} style={{ background: "none", border: `1px solid ${v.fg ?? ''}`, color: `${v.fg ?? ''}`, borderRadius: "999px", padding: "10px 16px", font: "500 14px var(--font-sans)", cursor: "pointer" }}>
                  {v.t("RideffNav.menu")}
                </button>
              </>) : null}
            </div>
          </div>
          {" "}
        </>) : null}
        {" "}
        {v.compact ? (<>
          {" "}
          <div style={{ display: "flex", justifyContent: "center", padding: "14px 16px" }}>
            <div style={{ pointerEvents: "auto", display: "flex", alignItems: "center", gap: "6px", padding: "6px 6px 6px 18px", borderRadius: "999px", background: `${v.cBg ?? ''}`, border: `1px solid ${v.pillBd ?? ''}`, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", boxShadow: "0 12px 40px rgba(0,0,0,.25)" }}>
              <a href={v.href("/")} style={{ fontWeight: "700", fontSize: "18px", letterSpacing: "-0.03em", color: `${v.fg ?? ''}`, textDecoration: "none", display: "flex", alignItems: "baseline", gap: "2px", marginRight: "10px" }}>
                <img src="/images/rideff-mark.png" alt="RIDEFF" style={{ height: "20px", width: "auto", display: "block" }} />
              </a>
              {v.showLinks ? (<>
                <div style={{ display: "flex", gap: "2px" }}>
                  {(v.links ?? []).map((l, $index) => (<Fragment key={$index}>
                    <a href={l?.href} style={{ fontSize: "14px", padding: "9px 14px", borderRadius: "999px", background: `${l?.bg ?? ''}`, color: `${l?.c ?? ''}`, textDecoration: "none", fontFamily: `${l?.ff ?? ''}`, fontStyle: `${l?.fs ?? ''}` }}>
                      {l?.t}
                    </a>
                  </Fragment>))}
                </div>
              </>) : null}
              {v.showMenuBtn ? (<>
                <button onClick={v.toggle} style={{ background: "none", border: "none", color: `${v.fg ?? ''}`, padding: "9px 12px", font: "500 14px var(--font-sans)", cursor: "pointer" }}>
                  {v.t("RideffNav.menu")}
                </button>
              </>) : null}
              <div style={{ pointerEvents: "auto", display: "flex", gap: "2px", padding: "4px", borderRadius: "999px", border: `1px solid ${v.pillBd ?? ''}`, background: `${v.pillBg ?? ''}` }}>
                {(v.langs ?? []).map((g, $index) => (<Fragment key={$index}>
                  <button onClick={g?.go} style={{ border: "none", cursor: "pointer", borderRadius: "999px", padding: "6px 10px", font: "500 11px var(--font-mono)", letterSpacing: ".06em", background: `${g?.bg ?? ''}`, color: `${g?.c ?? ''}` }}>
                    {g?.t}
                  </button>
                </Fragment>))}
              </div>
              <a href={v.href("/contact")} style={{ background: "#FF6A00", color: "#0A0A0A", borderRadius: "999px", padding: "11px 18px", fontSize: "12px", fontWeight: "700", letterSpacing: ".06em", textTransform: "uppercase", textDecoration: "none", marginLeft: "6px" }}>
                {v.t("RideffNav.startAProject2")}
              </a>
            </div>
          </div>
          {" "}
        </>) : null}
      </div>
      {v.open ? (<>
        {" "}
        <div data-lenis-prevent="1" style={{ position: "fixed", inset: "0", zIndex: "90", background: "#0B0B0C", color: "#F4F4F2", display: "flex", flexDirection: "column", padding: "22px clamp(20px,3vw,40px) 32px", overflow: "auto", fontFamily: "var(--font-sans)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <img src="/images/rideff-mark.png" alt="RIDEFF" style={{ height: "24px", width: "auto", display: "block" }} />
            <button onClick={v.toggle} style={{ background: "none", border: "1px solid #3A3A3C", color: "#F4F4F2", borderRadius: "999px", padding: "10px 18px", font: "500 14px var(--font-sans)", cursor: "pointer" }}>
              {v.t("RideffNav.close")}
            </button>
          </div>
          <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center", gap: "2px", padding: "40px 0" }}>
            {(v.menu ?? []).map((m, $index) => (<Fragment key={$index}>
              {" "}
              <a href={m?.href} style={{ display: "flex", alignItems: "baseline", gap: "18px", fontSize: "clamp(32px,5vw,60px)", fontWeight: "600", letterSpacing: "-0.04em", lineHeight: "1.12", color: `${m?.c ?? ''}`, textDecoration: "none" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: "400", letterSpacing: ".06em", color: "#8C877E" }}>
                  {m?.n}
                </span>
                {m?.t}{" "}
              </a>
              {" "}
            </Fragment>))}
          </div>
          <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", fontSize: "14px", color: "#B8B3AA" }}>
            <a href="https://wa.me/4917632572420" style={{ color: "#B8B3AA", textDecoration: "none" }}>
              {v.t("RideffNav.whatsAppRialto")}
            </a>
            <a href={v.href("/contact")} style={{ color: "#B8B3AA", textDecoration: "none" }}>
              {v.t("RideffNav.book15Min")}
            </a>
            <a href="mailto:hallo@rideff.com" style={{ color: "#B8B3AA", textDecoration: "none" }}>
              {"hallo@rideff.com"}
            </a>
            <span>
              {v.t("RideffNav.eichstattGermany")}
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              {(v.langsMenu ?? []).map((g, $index) => (<Fragment key={$index}>
                <button onClick={g?.go} style={{ border: "1px solid #3A3A3C", cursor: "pointer", borderRadius: "999px", padding: "6px 12px", font: "500 12px var(--font-mono)", letterSpacing: ".06em", background: `${g?.bg ?? ''}`, color: `${g?.c ?? ''}` }}>
                  {g?.t}
                </button>
              </Fragment>))}
            </div>
          </div>
        </div>
      </>) : null}
    </>
  );
};

export default function Nav(props) {
  const dc = useDC();
  const switchLocale = useSwitchLocale();
  return <Logic key={dc.locale} {...dc} switchLocale={switchLocale} {...props} />;
}
