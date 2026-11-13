// @ts-nocheck -- ported 1:1 from rideff_handoff/design/RIDEFF Journal.dc.html (see scripts/dc-port/convert.mjs)
'use client';
import React, { Fragment } from 'react';
import { DCLogic, dcStyle, opt, useDC } from '@/lib/dc';
import Nav from '@/components/dc/Nav';
import { ImageSlot } from '@/lib/dc';
import Footer from '@/components/dc/Footer';

class Logic extends DCLogic {
  state = {
    tag: this.props.t("Journal.all"),
    email: '',
    sent: false
  };
  // Posts come from content/journal/*.mdx (newest first). The handoff's placeholder posts were removed.
  CAT = { understand: this.props.t("Journal.understand"), build: this.props.t("Journal.build"), run: this.props.t("Journal.run"), notes: this.props.t("Journal.notes") };
  ALL = [...(this.props.posts || []).map(p => ({
    src: opt(p.cover),
    id: 'journal-' + p.slug,
    tag: this.CAT[p.category],
    t: p.title,
    d: p.excerpt,
    date: p.dateLabel,
    min: p.minutes,
    href: this.props.href('/journal/' + p.slug)
  }))];
  renderVals() {
    const s = this.state,
      all = s.tag === this.props.t("Journal.all");
    const list = all ? this.ALL : this.ALL.filter(p => p.tag === s.tag);
    const tags = [this.props.t("Journal.all"), this.props.t("Journal.understand"), this.props.t("Journal.build"), this.props.t("Journal.run"), this.props.t("Journal.notes")].map(t => ({
      t,
      n: t === this.props.t("Journal.all") ? this.ALL.length : this.ALL.filter(p => p.tag === t).length,
      bg: s.tag === t ? '#17090A' : 'transparent',
      c: s.tag === t ? '#FFF7ED' : '#17090A',
      pick: () => this.setState({
        tag: t
      })
    })).filter(x => x.t === this.props.t("Journal.all") || x.n > 0);
    return {
      tags,
      feat: list[0] || this.ALL[0],
      showFeat: list.length > 0,
      posts: list.slice(1),
      email: s.email,
      setEmail: e => this.setState({
        email: e.target.value
      }),
      // Double opt-in: the API only sends a confirmation mail (see src/app/api/newsletter).
      send: async e => {
        e.preventDefault();
        if (s.busy) return;
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s.email.trim())) return this.setState({ err: this.props.t("journal.invalidEmail") });
        this.setState({ busy: true, err: '' });
        try {
          const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: s.email.trim(), locale: this.props.locale, company: s.company || '' }) });
          if (!res.ok) throw new Error(String(res.status));
          this.setState({ sent: true, busy: false });
        } catch (er) {
          this.setState({ busy: false, err: this.props.t("newsletter.unavailable") });
        }
      },
      setCompany: e => this.setState({ company: e.target.value }),
      company: s.company || '',
      err: s.err || '',
      busy: !!s.busy,
      sent: s.sent,
      notSent: !s.sent
    };
  }
}

Logic.prototype.render = function render() {
  const v = { ...this.props, ...this.renderVals() };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: "body{margin:0;background:#FFF7ED;color:#17090A;font-family:var(--font-sans);-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}a:hover{color:#F97316}" }} />
      <Nav active="journal" />
      <div data-screen-label="Hero" style={{ padding: "140px clamp(20px,3vw,40px) 56px", maxWidth: "1480px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#5E4A43" }}>
          {v.t("Journal.home")}{" "}
          <span style={{ color: "#17090A" }}>
            {v.t("Journal.journal")}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "40px", alignItems: "end" }}>
          <h1 style={{ margin: "0", fontSize: "clamp(46px,6.1vw,95px)", lineHeight: ".92", letterSpacing: "-0.055em", fontWeight: "600", textWrap: "balance" }}>
            {v.t("Journal.notesFromThe")}{" "}
            <span style={{ color: "#F97316" }}>
              {v.t("Journal.workbench")}
            </span>
          </h1>
          <p style={{ margin: "0", maxWidth: "460px", fontSize: "19px", lineHeight: "1.55", color: "#3D2B27", textWrap: "pretty" }}>
            {v.t("Journal.whatILearnBuildingSystemsFor")}
          </p>
        </div>
      </div>
      <div data-screen-label="Filter" style={{ padding: "0 clamp(20px,3vw,40px) 40px", maxWidth: "1480px", margin: "0 auto" }}>
        {" "}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", borderTop: "1px solid #17090A", paddingTop: "20px" }}>
          {(v.tags ?? []).map((t, $index) => (<Fragment key={$index}>
            {" "}
            <button onClick={t?.pick} style={{ border: "1px solid #17090A", background: `${t?.bg ?? ''}`, color: `${t?.c ?? ''}`, borderRadius: "999px", padding: "9px 16px", font: "500 14px var(--font-sans)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
              {t?.t}
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", opacity: ".6" }}>
                {t?.n}
              </span>
            </button>
            {" "}
          </Fragment>))}
        </div>
      </div>
      {v.showFeat ? (<>
        <div data-screen-label="Featured" style={{ padding: "0 clamp(20px,3vw,40px) 80px", maxWidth: "1480px", margin: "0 auto" }}>
          {" "}
          <a href={v.feat?.href} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "40px", alignItems: "center", background: "#14080A", color: "#FFF7ED", borderRadius: "28px", padding: "clamp(20px,3vw,40px)" }}>
            <div style={{ aspectRatio: "16/10", borderRadius: "18px", overflow: "hidden" }}>
              <ImageSlot src={v.feat?.href !== '#' ? v.feat?.src : opt("/images/tic-backoffice.png")} alt={v.t("Journal.featuredPostCoverImage")} shape="rounded" radius={18} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", gap: "14px", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#F97316" }}>
                <span>
                  {v.feat?.tag}
                </span>
                <span style={{ color: "#927A6D" }}>
                  {v.t("Journal.xXMin", { x: v.feat?.date, y: v.feat?.min })}
                </span>
              </div>
              <h2 style={{ margin: "0", fontSize: "clamp(26px,3vw,44px)", lineHeight: "1", letterSpacing: "-0.04em", fontWeight: "600", textWrap: "balance" }}>
                {v.feat?.t}
              </h2>
              <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.6", color: "#CBB7A8", maxWidth: "520px" }}>
                {v.feat?.d}
              </p>
              <span style={{ fontWeight: "600", fontSize: "15px", color: "#F97316" }}>
                {v.t("Journal.readTheNote")}
              </span>
            </div>
          </a>
        </div>
      </>) : null}
      <div data-screen-label="Posts" style={{ padding: "0 clamp(20px,3vw,40px) 120px", maxWidth: "1480px", margin: "0 auto" }}>
        {" "}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,320px),1fr))", gap: "48px 28px" }}>
          {(v.posts ?? []).map((p, $index) => (<Fragment key={$index}>
            {" "}
            <a href={p?.href} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ aspectRatio: "4/3", borderRadius: "20px", overflow: "hidden" }}>
                <ImageSlot src={p?.src} alt={v.t("Journal.postCover")} shape="rounded" radius={20} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#5E4A43" }}>
                <span style={{ color: "#F97316" }}>
                  {p?.tag}
                </span>
                <span>
                  {v.t("Journal.xXMin", { x: p?.date, y: p?.min })}
                </span>
              </div>
              <span style={{ fontSize: "24px", fontWeight: "600", letterSpacing: "-0.03em", lineHeight: "1.15", textWrap: "balance" }}>
                {p?.t}
              </span>
              <span style={{ fontSize: "15px", lineHeight: "1.55", color: "#3D2B27" }}>
                {p?.d}
              </span>
            </a>
            {" "}
          </Fragment>))}
        </div>
      </div>
      {/* Hidden until a newsletter provider is configured (next.config.ts → NEXT_PUBLIC_NEWSLETTER_ON). */}
      {process.env.NEXT_PUBLIC_NEWSLETTER_ON ? (<div data-screen-label="Subscribe" style={{ background: "#14080A", color: "#FFF7ED" }}>
        {" "}
        <div style={{ padding: "120px clamp(20px,3vw,40px)", maxWidth: "1480px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "40px", alignItems: "end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#F97316" }}>
              {v.t("Journal.oneEmailAMonth")}
            </div>
            <h2 style={{ margin: "0", fontSize: "clamp(34px,4.6vw,72px)", lineHeight: ".98", letterSpacing: "-0.05em", fontWeight: "600", textWrap: "balance" }}>
              {v.t("Journal.newNote")}{" "}
              <span style={{ color: "#F97316" }}>
                {v.t("Journal.youLlKnow")}
              </span>
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {v.notSent ? (<>
              {" "}
              <form onSubmit={v.send} noValidate style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" value={v.company ?? ''} onChange={v.setCompany} style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: "0" }} />
                <input type="email" name="email" autoComplete="email" aria-label={v.t("journal.emailLabel")} placeholder={v.t("Journal.youBusinessDe")} value={v.email ?? ''} onChange={v.setEmail} style={{ flex: "1", minWidth: "220px", background: "transparent", border: "1px solid #4F2C2C", borderRadius: "999px", padding: "16px 22px", color: "#FFF7ED", font: "400 15px var(--font-sans)", outline: "none" }} />
                <button type="submit" disabled={v.busy} style={{ background: "#F97316", color: "#17090A", border: "none", borderRadius: "999px", padding: "16px 26px", font: "600 15px var(--font-sans)", cursor: "pointer", opacity: v.busy ? ".6" : "1" }}>
                  {v.t("Journal.subscribe")}
                </button>
              </form>
              {v.err ? (<div role="alert" style={{ fontSize: "14px", color: "#FDBA74" }}>{v.err}</div>) : null}
              {" "}
            </>) : null}
            {v.sent ? (<>
              <div style={{ fontSize: "17px", color: "#FFF7ED" }}>
                {v.t("Journal.thanksFirstNoteLandsNextMonth")}
              </div>
              <div role="status" style={{ fontSize: "14px", color: "#CBB7A8" }}>
                {v.t("journal.confirmHint")}
              </div>
            </>) : null}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#927A6D" }}>
              {v.t("Journal.noTrackingPixelsUnsubscribeInOne")}
            </span>
          </div>
        </div>
      </div>) : null}
      <Footer  />
    </>
  );
};

export default function JournalPage(props) {
  const dc = useDC();
  return <Logic key={dc.locale} {...dc} {...props} />;
}
