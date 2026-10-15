# Handoff: rideff.com (Website, Business Demo, Legal)

## Overview
RIDEFF builds custom AI "operating systems" for small businesses (**RIDEFF Business**) and sells a consumer life-assistant app (**RIDEFF Life**).

This handoff covers **only the website, rideff.com**:
1. **Marketing website**: one page with a BUSINESS / PRIVATE switch (default BUSINESS).
2. **Business Demo** at `/demo`: an interactive cockpit with 6 industries.
3. **Legal pages**: Impressum, Datenschutz, AGB.

**Not in this repo:** the Life app (`app.rideff.com`, repo `rideff-life`) and the Client Portal (`portal.rideff.com`, repo `rideff-portal`). The website only links to them.

Languages: **German (primary/source)**, English, Indonesian. Germany-first market.

Repo: `RialtoDaph/RIDEFF`.

## About the Design Files
The files in `design/` are **design references built in HTML**. They are prototypes showing the intended look, copy and behaviour, not production code. Rebuild them in a real stack. If no stack exists yet, the recommendation is:

- **Next.js (App Router) + TypeScript + Tailwind CSS** for the website, the legal pages and the portal.
- **next-intl** (or similar) for DE/EN/ID, with routes `/de`, `/en`, `/id` and German as the default.
- **Supabase or Postgres + Auth** for the portal (login, projects, files, invoices, messages).
- Both demos can be client-only React routes (`/demo/business`, `/demo/life`) using static mock data.

How the prototypes are put together:
- Each `*.dc.html` file opens directly in a browser. Serve the `design/` folder with any static server, e.g. `npx serve design`.
- Markup is written inline with `{{ }}` template holes. The logic sits in a `class Component` near the bottom of each file. Read that class for state, mock data and interactions; `renderVals()` computes every displayed value.
- `support.js` is the prototype runtime. **Do not port it.**
- `rideff-*-i18n.js` files are DE→EN/ID string tables: arrays of `[de, en, id]`. The prototype translates by walking text nodes in the DOM. In production, convert them to proper message keys. The tables are the authoritative translations.

## Fidelity
**High fidelity.** Colours, type, spacing, copy and motion are final. Recreate them pixel-accurately.

---

## Decisions (confirmed by owner, Oct 2026)
- **Market:** Germany first. Default language DE at `/`; EN and ID are secondary.
- **Default mode:** BUSINESS. PRIVATE via the toggle or `/?for=private`.
- **Trial:** 14 days **without payment details**. Payment is asked at the end of the trial. Without it the trial ends on its own, with no charge.
- **Life page section 09:** a final CTA "Morgen früh kommt Ihr erstes Briefing." with "14 Tage kostenlos testen →". There is no booking on the Life page except the Life Private card.
- **Life Private:** from €68 / month plus setup from €449. "Kostenloses Gespräch buchen" opens Cal.com (`https://cal.com/rideff/life-private`). After the call, the owner sends a **Stripe Payment Link manually**; no self-checkout.
- **Business booking:** Cal.com (connected to Google Calendar), 30-minute event `rideff/erstgespraech`. The custom day/slot widget in the prototype is the visual reference; use the Cal.com inline embed with brand colour `#FF6A00`, or the Cal.com API behind the custom UI.
- **Business demo:** keep "Demo ansehen" and rebuild the Business Demo as `/demo` (client-only, mock data).
- **Login links:**
  - Life: "Anmelden" goes to `app.rideff.com/login`.
  - Business: "Kundenportal" (top bar and footer) goes to `portal.rideff.com`.
- **Intro video:** desktop only (≥768px), once per session.
- **Extras in the first build:**
  - Vercel Analytics (no cookies).
  - **Newsletter** field in the footer: "Einmal im Monat. Ein Hebel, den kaum jemand kennt."
    - Double opt-in is required in Germany.
    - Use Resend Audiences or Brevo.
  - **404 page** in RIDEFF style: dark background, big mono "404", one line "Diese Seite gibt es nicht. Ihr Gehirn schon.", buttons to Start and Kostenlos testen.
  - **Blog** `/blog` (MDX):
    - List page: title, date, reading time, tag (Business / Life).
    - Article page: max width 680px, Geist 18px/1.65, H2 32px, orange links, CTA box at the end that matches the post's tag.
    - German posts first.

## Domains
- `rideff.com`: marketing website (this handoff). No login.
- `app.rideff.com`: RIDEFF Life app (signup, onboarding, cockpit), a separate repo and Vercel project.
- `portal.rideff.com`: Business client portal (later).
- **Private (Life) CTAs go to the app** (separate repo, not part of this build): `https://app.rideff.com/signup?plan=…&lang=…`. Signup, onboarding and the trial/payment logic are built in the app repo.
  - Top bar: "Anmelden" (text link) → `app.rideff.com/login`, plus "Kostenlos testen" (orange button) → signup with plan=plus.
  - Hero "14 Tage kostenlos testen →", pricing tier buttons (with the selected plan), the module card "Ihre eigene Frage… 14 Tage kostenlos ausprobieren →" and the footer links.
- **No Life demo on the website.** Visitors try the real app via the free trial.
- **These stay on the website:** On the Life page, only the Life Private card books a call (Cal.com). All Business CTAs stay "Erstgespräch" / "Gespräch buchen".
- Email: `hallo@rideff.com`.

## Design Tokens

### Colour
| Token | Hex | Use |
|---|---|---|
| orange-500 (brand) | `#FF6A00` | Primary CTA, accents, active states, section numbers |
| orange-400 | `#FF9A50` | Accent on dark backgrounds, glows |
| orange-300 | `#FFB27A` | Soft accent text on dark |
| orange-200 | `#FFD2B0` | Borders of orange pills, Life Private ring base |
| orange-50 | `#FFF4EC` | Orange pill background |
| orange-700 | `#C2410C` | Warnings and overdue items on light backgrounds |
| orange-900 | `#7C2D12` / `#5A2A0A` | Deep orange borders |
| ink | `#0A0A0A` | Primary text on light, dark buttons |
| ink-2 | `#0B0B0C` | Dark section and card background |
| zinc-950 | `#111113` / `#141416` / `#18181B` | Dark surfaces (portal, dark cards) |
| zinc-900 | `#1C1C1F` / `#1F1F22` / `#26262A` / `#2A2A2E` / `#3A3A40` | Dark borders, dividers |
| zinc-700 | `#3F3F46` / `#52525B` | Secondary text on light |
| zinc-500 | `#6B6B6B` / `#71717A` / `#8A8A93` | Muted text, mono labels |
| zinc-400 | `#A1A1AA` | Muted text on dark |
| zinc-300 | `#D4D4D8` | Text on dark nav |
| stone-200 | `#E4E4E1` / `#E4E4E0` / `#EDEDEB` | Light borders, dividers |
| stone-100 | `#F4F4F2` / `#F5F5F4` / `#F1F1EF` | Light surfaces, page background tint |
| white | `#FFFFFF` | Cards |
| green | `#15803D` / `#22A355` / `#14532D` on `#E8F7EE` / `#86EFAC` on dark | Success, done, paid |
| red | `#DC2626` / `#FCA5A5` on dark | Error, overdue |

The website alternates light (`#F4F4F2`/white) and dark (`#0B0B0C`) sections. Between sections the page background tint is interpolated on scroll (see Interactions).

### Typography
- **Geist** (400/500/600/700): all UI and headlines. Loaded from `fonts.bunny.net` (`geist`, `geist-mono`, `instrument-serif`).
- **Geist Mono** (400/500): labels, section numbers, metadata, prices in small print. Usually uppercase with `letter-spacing: 0.06–0.12em`.
- **Instrument Serif** (italic): occasional accent words in the website hero only.

| Role | Size / weight / tracking / leading |
|---|---|
| Hero H1 | clamp(56px → 104px) / 700 / -0.05em / 0.95 |
| Section H2 | 52px / 700 / -0.045em / 1.0, `text-wrap: balance` |
| Card H3 | 40px / 700 / -0.04em / 1.05 |
| Card title | 22px / 700 / -0.025em |
| FAQ question | 19px / 600 / -0.01em |
| Body large | 17px / 400 / 1.55, colour `#52525B` |
| Body | 15–16px / 1.45–1.55 |
| Mono label | 10–12px / 400–500 / 0.08–0.12em / uppercase |

### Spacing, radius, shadow
- Content max width **1280px**, centred. Section padding **88px vertical / 56px horizontal**.
- Gaps: 4 / 6 / 8 / 10 / 12 / 14 / 18 / 24 / 28 / 40 / 56px.
- Radius: pill `9999px`; card `14 / 16 / 18 / 22 / 24px`; input `10–12px`; small tag `4px`.
- Shadows:
  - Selected card ring: `0 0 0 3px rgba(255,106,0,0.18)`.
  - Highlight glow: `0 0 0 4px rgba(255,106,0,0.12), 0 0 24px rgba(255,106,0,0.25)`.
  - Large dark card: `0 30px 60px rgba(10,10,10,0.18)`.
  - Life Private: `0 0 0 6px rgba(255,106,0,0.06), 0 20px 50px rgba(255,106,0,0.12)`.

---

## Screens

### 1. Website (`RIDEFF Website.dc.html`)
- **Top bar:** logo mark, product name, section links, language pill switch (DE / EN / ID), "Gespräch buchen" CTA, and a **BUSINESS / PRIVATE toggle** that swaps the whole page.
- **Intro:** an intro video (`assets/rideff-intro.mp4`) plays once on first load, then reveals the hero.

**BUSINESS mode, sections in order:**
- Hero: "Ihr Betrieb bekommt ein Gehirn."
- 01 Problem: "Alles ist da. Nur nicht verbunden."
- 02 Plattform: "Drei Teile, ein Gehirn." Covers brain / body / nerves.
- 03 Nerven: "Sie müssen nicht nachsehen. Es meldet sich." Has a live notification feed.
- 04 Ablauf: "Erst Ihr Alltag. Dann die Software."
- 05 Wer: target industries, with an industry picker that shows a mini dashboard per industry (café, hotel, shop, label, practice, trades).
- 06 Projekt: "Gebaut, live, betreut." A case study using the TIC Originals images (`assets/hf/tic*.jpg`) that opens a modal.
- 07 Pakete: "So viel System, wie Sie brauchen." Three plans; the middle one is selected by default, with an orange border and the selected-card ring.
- 08 FAQ: native `<details>` accordion.
- 09 Kontakt: "Was fehlt bei Ihnen? Finden wir es heraus." A booking widget: pick a day, then a time slot, then a confirmation state showing "Termin angefragt."

**PRIVATE (Life) mode, sections in order:**
- Hero: "Ihr Leben bekommt ein Gehirn." with an animated phone briefing card.
- 01 Problem: "Wissen Sie es aus dem Kopf?" A quiz-style card.
- Flow gap: a scroll-driven connector line. The orange progress line follows the scroll with easing (`lerp 0.14` per frame).
- 02 Module: "Sie sagen das Ziel. Life findet die Hebel." A grid of modules.
- 03 Ein Tag mit Life:
  - Phone mockup with four scenes (07:00 MORGEN, 12:30 MITTAG, 18:00 ABEND, 22:00 RÜCKBLICK).
  - **Auto-advances every 4.2s** while in view (IntersectionObserver, `rootMargin: 0 0 -25% 0`).
  - Clicking a dot jumps to that scene and resets the timer.
  - It does **not** pin or scroll-jack (this was removed on purpose after feedback).
- 04 Weiterdenken: "Life denkt weiter, als Sie fragen."
  - Left column: headline, body copy and three tags (AUF IHREN DATEN, EIGENE PLATTFORM, BRAINSTORMING).
  - Right column, dark research card: a scanning progress bar (2.6s, linear), then three findings sliding in one by one:
    - KARRIERE (source LinkedIn · Gehalt).
    - FINANZEN (source Kontoauszug).
    - HÄTTEN SIE ÜBERSEHEN (source Arbeitsvertrag). This one gets the orange glow, and the header label changes from "DURCHSUCHT …" to "3 FUNDE".
  - Right column, white brainstorming card: the user bubble appears, then a typing indicator (3 dots, `rdeDot` keyframe), then the AI answer, then three path chips ("Teilzeit-Start", "Erst Kunden testen", "Vollstart 2027").
  - Timeline (ms): 500 / 1300 / 2200 / 3200 / 4300 / 5100 / 6600 / 7300; resets at 14500; loops at 15400. It starts when the section enters the viewport. **Before it starts, the final state is shown**, so the card is never empty.
- 05 So funktioniert's: "Kürzer als eine Kaffeepause." Steps.
- 06 Datenschutz: "Sie lernt Sie kennen. Ihre Daten bleiben Ihre." Covers data sources and EU hosting.
- 07 FAQ: 6 questions, including "Wann geht es los?" and the two AI questions (career/finances, brainstorming).
- 08 Preis: "Was soll Life für Sie tun?"
  - Tier tabs: **Life €12,90**, **Life Plus €19,90** (default selected), **Together €29,90** per month, up to 4 people.
  - Note: "14 Tage kostenlos, danach monatlich kündbar. Jährlich zahlen: zwei Monate geschenkt. Preise inkl. MwSt."
  - CTA: "14 Tage kostenlos testen →".
  - Below the tiers, the **Life Private** card spans full width:
    - Light background `#F4F4F2` inside a 2px wrapper. The wrapper holds a **rotating conic-gradient ring** (orange, `rdeSpin` 4.5s linear infinite) clipped to radius 24px.
    - Badge "LIFE PRIVATE" plus "BEGRENZTE PLÄTZE".
    - Headline "Ihr eigenes System. Mit Menschen dahinter."
    - Price "ab €68 / Monat · einmalig ab €449 Einrichtung".
    - Four ✓ features and the CTA "Kostenloses Gespräch buchen →".
- 09 Los geht's: final CTA on a dark grid background.
  - Headline "Morgen früh kommt Ihr erstes Briefing."
  - Buttons "14 Tage kostenlos testen →" and "Pakete vergleichen".
  - Tags: KEINE KARTE NÖTIG, DATEN IN DER EU, JEDERZEIT KÜNDBAR.

**Footer (both modes):** large cropped "RIDEFF" wordmark (cropped on purpose), © 2026, and links to Impressum / Datenschutz / AGB.

**Scroll background:** each section id has an RGB tint (e.g. `'p-tag':[249,249,247]`, `'p-weiter':[249,249,248]`). The body background is interpolated between them based on the viewport centre.

### 2. Business Demo (`RIDEFF Business Demo.dc.html`)
- **Layout:** dark top bar with brand and industry switcher, a role switcher (**Owner / Lead / Team**, roles limit the visible tabs), the language pill, and a "Cockpit fragen" AI ask box. A horizontal tab row scrolls (`overflow-x:auto`) and has a fade mask on the right.
- **Industries** (`IND` object in the logic): Café Linde (default), Hotel, Laden, Label, Praxis, Handwerk. Each has its own KPIs, briefing, calendar, finances, team rota, customers, stock, website preview and what-if data.
- **Tabs:**
  - Übersicht: briefing, 3 KPIs, week calendar.
  - Finanzen: revenue line chart, weekly bars, costs vs budget with progress bars, open invoices with "Erinnern" actions.
  - Team & Schichten: rota grid.
  - Kunden & Anfragen: requests and reviews with reply / publish toggles; the tab shows a badge count.
  - Lager & Einkauf: stock bars; low items show "BESTELLEN", which turns into "✓ BESTELLT".
  - Website: a live preview of the client's site, including a booking form (name, time-slot chips, submit, success state).
  - Was wäre wenn: sliders that recalculate projections.
  - Daten & Rechte: data source toggles.
- **State:** `lang, ind, role, nav, done, tdone, inv, rq, rv, st, src, wi, name, slot, sent, ask, q, open`.

### 3. Legal (`RIDEFF Rechtliches.dc.html`)
- **Sections:** Impressum (`#impressum`), Datenschutz (`#datenschutz`), AGB (`#agb`). Simple long-form text in Geist, with a highlighted notice box (`#FFF4EB`, border `#FFD2B0`).
- **AGB pricing rules:**
  - Business: prices **net plus VAT**.
  - Life: **14 days free, then monthly**, end prices **incl. VAT**.
  - Life Private: setup fee plus monthly fee as quoted.
- **Leave as a template for now** (owner's decision). **⚠ Still has placeholders** that must be filled before launch: `[Straße und Hausnummer]`, `[PLZ Ort]`, `[Telefonnummer]`, `[Anschrift]`, `[Anbieter, z. B. Vercel Inc.]` (hosting provider), `[Tool für Terminbuchung, falls genutzt]` (booking tool), `[Aufsichtsbehörde Ihres Bundeslandes]` (state data-protection authority). The text needs **legal review**. German only, no translations.

---

## Interactions & Behaviour
- **Language:** a global DE / EN / ID switch, persisted, broadcast via the `rideff-lang` event across pages.
  - Prices format per locale: DE `12,90 €` or `€12,90`, EN `€12.90` and `€2,140`, ID uses the German format.
  - Weekday abbreviations are translated (MO→MON/SEN, …, SA→SAT/SAB, SO→SUN/MIN).
- **Motion defaults:**
  - Fades: `opacity .4–.6s ease`.
  - Slide-ins: `transform .5–.7s cubic-bezier(.2,.8,.2,1)` from `translateY(8–14px)`.
  - Colour and border changes: `.5–.6s`.
- **Keyframes:**
  - `rdeDot`: typing dots; opacity .3↔1 and translateY 0↔-3px, 1s, staggered by 0.15s.
  - `rdeSpin`: Life Private ring; rotate 360°, 4.5s linear infinite.
  - `rdeGlow`: glow pulse used in the hero.
- **Viewport-triggered animations** use IntersectionObserver and pause when off-screen. Clear all timers on unmount.
- **Reduced motion:** add a `prefers-reduced-motion` fallback in production. Show final states and stop the loops and the spinning ring.
- **Booking widget:** select day, then time, then the button enables; submitting shows the confirmation. In production, connect it to a booking tool (e.g. Cal.com) and send a confirmation email.
- **There is no waiting list.** RIDEFF Life is live; sign-up goes straight to the 14-day trial.
- **Email validation** (sign-up / contact): `/^[^@\s]+@[^@\s]+\.[^@\s]+$/`. On error, show an orange note "BITTE EINE GÜLTIGE E-MAIL-ADRESSE EINGEBEN."
- **FAQ:** native `<details>` / `<summary>`, with a "+" marker in orange.
- **Responsive:**
  - Two-column grids use `repeat(auto-fit, minmax(min(100%, 340–420px), 1fr))`, so they stack on narrow screens.
  - The website is designed at a 1280px content width. **Below about 1000px some business sections are not fully optimised. Build a proper mobile layout** (single column, hamburger nav, 44px touch targets).
  - Chips and price values use `white-space: nowrap`.

## State Management
- Website: mode (business/private, in the URL as `?for=private`), language, selected plan tab, FAQ open state, animation step per section, newsletter form. All local UI state; no database.
- Business Demo: client-only, using the mock data object `IND` in its logic class.

## Assets (`design/assets/`)
- `rideff-mark.png`, `rideff-logo.png`, `favicon.png`: brand marks.
- `rideff-intro.mp4`: website intro video.
- `site-cafe.jpg`, `site-hotel.jpg`, `site-laden.jpg`, `site-label.jpg`, `site-praxis.jpg`, `site-handwerk.jpg`: industry website previews.
- `hf/`: case-study and persona photography, including `tic1–3.jpg` for the TIC Originals case and `t_*.jpg` thumbnails.
- `image-slot.js`: drag-and-drop image placeholder used in the prototype only. Replace with real images.

## Files
```
design/
  RIDEFF Website.dc.html        Marketing site (Business + Private)
  RIDEFF Business Demo.dc.html  Business cockpit demo → /demo
  RIDEFF Rechtliches.dc.html    Impressum / Datenschutz / AGB (template)
  rideff-v7-i18n.js             Website + shared strings [de,en,id]
  rideff-biz-i18n.js            Business demo strings
  rideff-demo-i18n.js           Demo strings
  rideff-data-i18n.js           Demo data strings
  support.js, image-slot.js     Prototype runtime only (do not port)
  assets/                       Images, logo, intro video
screenshots/                    Orientation only; the HTML wins
PROMPT.md                       Paste into Claude Code
```




## Ignore in the prototype
- Website logic still contains `pDays`, `pTimes`, `pBook` and `pNotBooked` from the removed Life booking section. This is dead code; do not port it.
- "Warteliste" in the Praxis demo data means a patient waiting list. It is not a product waiting list.

## Open items before launch
1. **Owner to provide:** Cal.com usernames/event slugs, newsletter provider (Resend or Brevo), OG image, Impressum data.
2. **Rechtliches** stays a template. The Datenschutz text now covers Vercel hosting, Vercel Analytics, fonts, Cal.com + Google Calendar, the newsletter (double opt-in) and the app/portal services. Fill in the [placeholders] and get legal review before going live.
3. **Not designed yet (build in RIDEFF style per README):** 404 page, blog list and article, mobile layout of the website.
4. **Kundenportal** links to `portal.rideff.com` (separate repo). Until it is live, the link can show "Bald verfügbar".
5. Demo numbers on the website (salary gap 11 %, €310 interest, €1,200 training budget, etc.) are illustrative.
