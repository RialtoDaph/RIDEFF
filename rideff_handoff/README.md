# Handoff: rideff.com (multi-page website + Nana assistant)

## Overview
RIDEFF is a one-person studio (Rialto, Eichstätt) that builds AI systems, team apps, websites and shops for small businesses (**RIDEFF Business**), plus a consumer life assistant (**RIDEFF Life**). This bundle is the full marketing website, built around three service pillars: **Understand → Build → Run**. It also includes **Nana**, a chat and voice assistant that appears on every page.

- **Languages:** German (default) + English. The English copy is the source text; the German translations are in `i18n/rideff-en-de.json` and use the formal "Sie" form.
- **Market:** Germany. Business prices are net + 19% VAT. Life prices include VAT.
- **Out of scope:**
  - **Client portal** (`portal.rideff.com`): separate handoff, separate repo.
  - **Life app** (`app.rideff.com`): separate repo.
  - Both demos and the portal are included **only as link targets/reference**.
  - Sales Deck and Rencana Keluarga are not part of this build.

## About the design files
The files in `design/` are **design references built in HTML**. They are prototypes showing the intended look, copy and behaviour, not production code. Rebuild them in a real stack. Recommended:

- **Next.js (App Router) + TypeScript + Tailwind**, deployed on Vercel.
- **next-intl** for DE/EN:
  - Routes `/` (DE) and `/en/...`.
  - Message keys generated from `i18n/rideff-en-de.json`.
- **Lenis** smooth scroll is used in the prototype. Keep it, with a `prefers-reduced-motion` opt-out.
- **Supabase** (Frankfurt) for Nana transcripts and summaries, shared with the portal.

How to read the prototypes:
- Serve with `npx serve design` and open any `*.dc.html`.
- Markup uses `{{ }}` holes. All state, data arrays, copy and timings live in `class Component` at the bottom of each file; `renderVals()` computes everything displayed. **Copy all long-form text and data arrays from there** — they are final.
- `<dc-import name="RideffNav">` etc. mount the shared components (`RideffNav`, `RideffFooter`, `RideffNana`).
- **Prototype runtime only, do not port:**
  - `support.js`
  - `image-slot.js` (images use its `src` fallback)
  - `rideff-de.js` (DOM text-node translator)
  - `rideff-*-i18n.js` (demo-only string tables)
- **In production:** never translate by walking the DOM. Use proper message keys. Strings built from parts (e.g. `"{x} / 6 live"`, `"Enter {x} →"`) need ICU placeholders.

## Fidelity
**High fidelity.** Colours, type, spacing, copy, motion and interactions are final. Recreate pixel-accurately. Placeholders marked `[…]` are content gaps, not design gaps (see *Open items*).

---

## Sitemap / routes
| Route (DE / EN) | File | Nav key |
|---|---|---|
| `/` · `/en` | `RIDEFF Home.dc.html` | home |
| `/verstehen` · `/en/understand` | `RIDEFF Understand.dc.html` | understand |
| `/bauen` · `/en/build` | `RIDEFF Build.dc.html` | build |
| `/bauen/web-shops` · `/en/build/web-shops` | `RIDEFF Storefront.dc.html` | build |
| `/bauen/team-apps` · `/en/build/team-apps` | `RIDEFF Workbench.dc.html` | build |
| `/betreiben` · `/en/run` | `RIDEFF Run.dc.html` | run |
| `/projekte` · `/en/work` | `RIDEFF Work.dc.html` | work |
| `/life` · `/en/life` | `RIDEFF Life.dc.html` | life |
| `/preise` · `/en/pricing` | `RIDEFF Pricing.dc.html` | pricing |
| `/ueber-mich` · `/en/about` | `RIDEFF About.dc.html` | about |
| `/kontakt` · `/en/contact` | `RIDEFF Contact.dc.html` | contact |
| `/journal` · `/en/journal` | `RIDEFF Journal.dc.html` | journal |
| `/impressum`, `/datenschutz`, `/agb` | `RIDEFF Rechtliches.dc.html` (anchors) | — (DE only) |
| `/demo` | `RIDEFF Business Demo.dc.html` | client-only, mock data |

Route slugs are a suggestion; confirm them with the owner.

**External links**
- **Portal:** `portal.rideff.com`. The demo file `RIDEFF Portal.dc.html` stands in for it.
- **Life app:** `app.rideff.com/signup?plan=…` (Life CTAs) and `app.rideff.com/login`.
- **Life Demo:** `RIDEFF Life Demo.dc.html` is a design reference for the app; link it only where the prototype does.
- **WhatsApp:** `https://wa.me/4917632572420`, plus a prefilled `?text=` on some CTAs (copy exact strings from the files).
- **Email:** `hallo@rideff.com`.
- **Booking:** Cal.com, 15-min first call (slug TBD). The prototype shows a custom day/slot picker on Home "(08) Start a project". Keep that UI and back it with the Cal.com API, or use the inline embed with brand colour `#FF6A00`.

## Screenshots
`screenshots/NN-page/` holds captures at a 924px-wide viewport:
- `01` is the top of the page in DE.
- `02`–`04` are scroll positions (~35%, ~70%, end) in DE.
- The **last file** in each folder is the top of the page in EN.

`13-nana/` shows the Nana states in order:
1. launcher
2. chat opened
3. pre-call sheet
4. live call
5. call ended
6. after two questions
7. after summarizing
8. summary in chat
9. summary card alone

`14-demos/` holds the link targets.

Pinned and scroll-driven sections show one frame only, and WebGL canvases (Build hero particles) render blank in captures. **Always check motion in the HTML.**

---

## Design tokens

### Colour
| Role | Hex |
|---|---|
| Brand orange (CTA, accents, active, section numbers) | `#FF6A00` |
| Orange on dark / soft accent | `#FF9A50`, `#FF7A1A`; pressed/deep `#E25F00` |
| Ink (text on light, dark buttons) | `#0A0A0A` |
| Dark section bg | `#0B0B0C`; dark cards `#111112`; dark surfaces `#1C1C1E`; dark borders `#1F1F21` `#232325` `#2A2A2C` `#3A3A3C` |
| Light page bg (warm) | `#ECE8E1`; launcher/pill bg `#F4F1EC`; light surface `#F7F5F1`; text on dark `#F4F4F2` |
| Light borders | `#E2DDD4`, `#D3CCC0`, `#BDB6AA`, `#DCD5CA` |
| Muted text | on light `#5A5650` / body `#3A3731`; mono labels `#8C877E`; on dark `#B8B3AA` / `#6B675F` |
| Warm dark accents (Life / Run) | `#2A1E14`, `#140D08`, `#5A4636`, `#9A7354`; cream `#FFFAF4` `#FFF8F0` `#FFF3E6` |
| Success / online dot | `#61C784` / `#61CC80` |
| Error / end call | `#E5484D` |
| Data accents (charts, layers) | `#9E8CF2`, `#54B0E6`, `#E0B842` |

Sections alternate light (`#ECE8E1` family) and dark (`#0B0B0C`). The Nav switches its palette with the `dark` prop.

### Typography
Loaded from Google Fonts:
- **Geist** 400/500/600/700: all UI and headlines.
- **Geist Mono** 400/500: labels, section numbers `(01)`, metadata, small prices. Usually uppercase, `letter-spacing .06–.12em`, 10–13px.
- **Instrument Serif** italic: one accent word per headline (e.g. *Keeps it running.*, *connects*, *run itself.*), usually in orange.

Headline sizes use `clamp()`. Copy the exact values per element from the files, e.g.:
- Home hero: `clamp(50px,6.4vw,100px)`, `line-height .94`, `letter-spacing -0.05em`, weight 600.
- Section H2s: ~`clamp(42px,5.6vw,88px)`.
- Body text: 15–19px, line-height 1.45–1.55.
- Use `text-wrap: balance` on headings and `pretty` on body text.

### Spacing, radius, shadow
- **Content:** max width **1480px**, side padding `clamp(20px,3vw,40px)`, section padding ~`120–140px` vertical.
- **Gaps:** 2 / 4 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 20 / 24 / 28 / 32 / 40 / 64px.
- **Radius:**
  - pills `999px` (all buttons and chips)
  - cards `14 / 16 / 18 / 20 / 22 / 24 / 28px`
  - phone mockups `44–46px`
  - small tags `4px`
- **Shadows:**
  - Launcher / pills: `0 12px 30px rgba(10,10,10,.2)`
  - Panels: `0 30px 80px rgba(10,10,10,.3–.45)`
  - Hover-lift cards: `translateY(-6px)` + border → `#FF6A00`
  - Orange glow: `0 0 0 6px rgba(255,106,0,.18), 0 0 24px rgba(255,106,0,.5)`

---

## Shared components

### Nav (`RideffNav.dc.html`)
- **Props:** `active` (nav key), `dark` (bool), `heroCta` (bool; transparent bar over a hero).
- **Full bar (top of page, scrollY ≤ 80):**
  - Logo mark on the left.
  - Centre: pill of links Home, Understand, Build, Run, Work, Pricing, About, Life. **Life** is set in Instrument Serif italic. The active link gets an inverted pill.
  - Right side: the **DE | EN** switch, the status "Taking on select clients" (>1480px), and the CTA "Start a project →" (>560px).
- **Compact bar (scrollY > 80):** centred floating pill with logo, links (minus Home), DE|EN and an orange "Start a project".
- **Menu (≤1100px):** a "Menu" button opens a full-screen dark overlay. It lists numbered links (Journal and Contact included), and has WhatsApp / Book 15 min / email / Eichstätt plus DE|EN at the bottom.
- **Site-wide effects** (in `siteFx()`, all disabled under reduced motion):
  - Page transition: 7 dark slats `scaleY` 0→1 (`.6s cubic-bezier(.77,0,.18,1)`, 45ms stagger) with the logo; reversed on the next page load.
  - 2px orange scroll-progress bar at the top.
  - Lenis smooth scroll (`lerp .075`).
  - Custom cursor on fine pointers: 34px orange ring with a 6px dot; grows to 64px over interactive elements.
  - Smooth anchor scroll.
- **Language:** persisted in `localStorage.rideff_lang` (`de` | `en`, default `de`), the same key the demos use. In production this becomes the locale route.

### Footer (`RideffFooter.dc.html`)
- Pillars, pages, "Reach Rialto" (WhatsApp, email), Legal (Impressum / Datenschutz / AGB).
- Line "© 2026 RIDEFF — Rialto. Eichstätt, Germany." and "Hosted in the EU · Frankfurt".
- Plus the animated "Rialto bot" (hover speech bubbles; see the arrays in the file).

### Nana (`RideffNana.dc.html`): chat + voice + WhatsApp summary
Fixed bottom-right (`right/bottom 20px`, z 60). **The chat AI, voice and sending are placeholders in the prototype; wire real APIs.**

**Launcher**
- Split pill: avatar + "Ask Nana" opens chat; a divider; a black "Call" pill (orange dot) opens the call flow.
- A black "WA" circle next to it links to WhatsApp.
- During a call the label reads "On call · m:ss" and the button "Back to call".

**Chat panel** (380 × min(600px, 100vh−120), radius 24, `#F7F5F1`)
- **Header:** `#0A0A0A`, avatar with green online dot, status line, orange "Call" button, ×.
- **Greeting:** shows two choice buttons, "Type a question" (focuses the input) and orange "Call Nana · voice". They hide once the user sends or a call happens.
- **Messages:**
  - Nana: `#ECE8E1` bubbles, radius 14 14 14 4.
  - User: `#0A0A0A` bubbles, radius 14 14 4 14.
  - System lines: mono, uppercase, centred.
  - Some answers append action pills "Book a call with Rialto" and "WhatsApp".
- **Quick-reply chips:** chosen per page (`CHIPS` in the logic).
- **Summary chip:** after ≥2 user messages, an orange chip **"Summarize for WhatsApp"** is prepended to the chips.
- **Input:** pill-shaped input and a 44px round send button.
- **Auto-scroll:** scrolls to the bottom on every new message.

**Pre-call sheet** (dark `#0B0B0C`, shown before every call; tweak `callSheet=false` skips it)
- Heading "Talk to Nana".
- Three rows: **Mic** ("used only during the call"), **Length** (~2 min, switch to chat any time), **After** (summary for WhatsApp).
- **Consent checkbox** (default on): "Save the transcript and summary to my RIDEFF client portal" + Privacy link → `/datenschutz`.
- Buttons: "Start call" (orange, full width) and "Not now — type instead".

**Call panel** (dark)
- Mono header "Voice · preview" and a timer.
- 112px orange orb with two pulsing rings while ringing (`nnRing 1.6s`). The orb scales slightly while Nana speaks.
- State label: Connecting… → Speaking / Listening / Muted.
- 7 audio bars: orange while Nana speaks, grey otherwise.
- Rolling transcript of the last 3 lines; older lines at 45% opacity.
- Controls: three 56px round buttons, Mute, Chat (back to chat, call continues), End (`#E5484D`).

**Summary card** (in the chat, after a call or "Summarize")
- Header "Your summary", with meta "Voice call · 0:42" or "Chat · 2 questions", and an Edit/Done toggle.
- "WhatsApp message" preview bubble (`#F3EFE8`, radius 4 14 14 14). It renders WhatsApp formatting: `*bold*` lines at weight 600, `_italic_` in a muted colour.
- Edit mode: a monospace textarea with an orange border and the hint "*bold* and _italic_ show as formatting in WhatsApp."
- **Actions:**
  - Black full-width **"Send to Rialto on WhatsApp →"** opens `https://wa.me/4917632572420?text=<urlencoded summary>`.
  - "Copy text" (shows "Copied ✓" for 1.8s).
  - **"Send to my WhatsApp"** expands a phone field and Send. Shows "Sent to … ✓". **v1 scope: needs the WhatsApp Business API plus user opt-in.**

**WhatsApp template.** Keep it exactly like this, translated per locale (DE strings are in the i18n file):
```
*Hi Rialto — summary from Nana*
Voice call · 1 Nov 2026 · 0:42

*What I need*
A system for my café

*Interested in*
Growth — €249/month, setup from €1,990

*Next step*
Pick a time for a free 30-min call with Rialto

_Sent from Nana on rideff_
```
- **Kind:** "Voice call" or "Chat".
- **Date:** `de-DE` / `en-GB` short month.
- **Duration:** `m:ss` for a call, "n questions" for a chat.
- **In production** the AI fills *What I need / Interested in / Next step* from the transcript. Interest must map to a real plan:

| Plan | Price |
|---|---|
| Core | €149/mo, setup from €1,290 |
| Growth | €249/mo, setup from €1,990 |
| Whole system | €449/mo, setup from €3,900 |
| Life | €12,90 |
| Life Plus | €19,90 |
| Together | €29,90 |
| Life Private | from €68 + €449 setup |

**Mobile (<560px):** chat, pre-call and call panels go full-screen (`100vw × 100dvh`, radius 0). The launcher is hidden while a panel is open.

**State:** `open, mode ('chat'|'pre'|'call'), msgs[], typing, draft, call ('idle'|'ringing'|'live'), sec, muted, consent, sum {meta,text}, editing, copied, mineOpen, mineSent, phone`.

**Suggested API contract (owner wires later):**
- **Chat:** `POST /api/nana/chat`
  - Request: `{ sessionId, page, locale, messages[] }`
  - Streams back the assistant text plus optional `actions: ['book','whatsapp']`.
- **Voice:** `POST /api/nana/voice/session`
  - Returns a realtime token (provider TBD).
  - The client streams mic audio; the server returns audio and transcript lines.
- **Summary:** `POST /api/nana/summary`
  - Request: `{ sessionId }`
  - Response: `{ kind, duration, need, interest, next, text }`.
  - If `consent` is true, store the transcript and summary in Supabase (Frankfurt) and attach them to the lead/client in the portal.
- **Send to my WhatsApp:** `POST /api/nana/whatsapp`
  - Request: `{ sessionId, phone }`
  - Uses a WhatsApp Business API template message; only after explicit opt-in.
- **Analytics events** (Vercel Analytics, no cookies): `nana_open`, `nana_call_click`, `nana_call_start`, `nana_call_end`, `nana_summary_created`, `nana_summary_wa_rialto`, `nana_summary_wa_self`, `nana_summary_copy`.

---

## Pages (sections in order; copy, data and timings are in each file)

### Home
1. **Hero:**
   - "One person. Understands it. Builds it. *Keeps it running.*"
   - Three round thumbnails inline in the headline.
   - CTAs "See the work →", "Plans & pricing", and an Intro video button (0:45, `assets/rideff-intro.mp4`).
   - A 3-door carousel (Understand / Build / Run) cycles every 5s (`DUR = 5000`).
   - The intro showreel plays once per session.
2. **(01) Thesis:** Rialto quote, photo `rialto-about-v3.jpg`.
3. **Kinetic band:** marquee.
4. **(02) Three pillars:** pinned. Each door has an example flow (4 steps) and "Enter {pillar} →".
5. **(03) Your business brain:**
   - Plan toggle Core / Growth / Whole system.
   - Radial diagram of 6 areas, each Connected or Not in plan.
6. **(04) Proof:** TIC Originals case card that opens a modal ("From drop to doorstep — one system."), images `assets/hf/tic1–3.jpg`.
7. **(05) Ways to work together:**
   - 3 plans (Growth = "Most chosen").
   - Life cross-sell card.
   - Cost comparison (placeholder figures).
8. **(06) How it works:** 5 steps (Call → Analysis → Build → Test → Live), pinned line.
9. **(07) FAQ:** accordion.
10. **(08) Start a project:**
    - Direct-line card (WhatsApp, Book 15 minutes, email).
    - 3-question form: name; WhatsApp number or email; need (AI system / Team app / Website / shop / Not sure yet).
    - Day/slot picker in CET, then "Book my free slot →".

### Understand (Pillar 01)
- **Lens stage hero:** the cursor moves a lens over a chaotic "as it feels" collage of sticky notes, which resolves to "Understood". Scroll-pinned.
- **01 First call:** a scripted call transcript builds a "What I hear" map.
- **02 Your week:** a 40-hour grid. Tap the blocks that repeat → "Hand it to RIDEFF →" → shows hours back.
- **03 The offer:** a mock portal offer. Tick "I accept the terms" → Approve → "Approved ✓ · hash stored".
- Next-pillar link to Build.

### Build (Pillar 02)
1. Hero story: WebGL particles go from "Six tools" to "One platform". Pinned; 5 segments.
2. 01 Tool tax: six rented apps → one platform.
3. 02 Six layers: Apps, AI agents, Automations, Data core, Entry points, Integrations.
4. 03 One request: website form → paid invoice, as a 6-step timeline.
5. 04 What I build: 8 capability cards. **Team apps → Workbench, Client portals → Portal, Websites & shops → Storefront** (each shows "See it ↗"). Plus a terminal animation and an integrations marquee.
6. 05 Builds taken apart: 3 cases (TIC, Portal, Life). Each explodes in 3D into Interface / System / Spec / Mobile layers on scroll.
7. 06 Process.
8. Start CTA.

### Storefront (Build → web & shops)
- Hero with 3 overlapping browser windows; hovering one brings it to the front.
- 01 Case layers: tabs UI / System / Spec.
- 02 Included: Design, Shop & payments, Speed & search, Hosting & domain.
- Order flow: Visit → Product → Checkout → Stock update → Invoice.
- CTA.

### Workbench (Build → team apps)
- Hero with a phone mockup ("Good morning, Lena") over a photo.
- 01 What it does: 4 cards.
- 02 Inside: 4 tabs switch the phone screen (Today / Shifts / Tasks / Chat).
- 03 Made for: 4 photo cards.
- CTA (WhatsApp prefilled).

### Run (Pillar 03)
1. 24h stage: a 24-hour dial driven by scroll with Day / Evening / Night / Morning scenes and an event feed.
2. 01 What I watch: 6 layers checked nightly.
3. 02 Portal: a group chat sorts itself into threads as you scroll.
4. 02 When it breaks: "Break something ⚡" breaks a mock shop checkout, then a 5-step fix timeline plays and it resolves.
5. 04 Grows with you: modules timeline, month 1 → 12.
6. 04 Every Monday: weekly report email.
7. 04 Included: receipt-style list.
8. 06 Promise: first reply, uptime, backups, one person. All example figures.

### Work
Hero "Built, live, running." and project cards:
- TIC Originals
- Mami I Patisserie
- RIDEFF Portal
- RIDEFF Life
- Business demo
- "Your business"

### Life
1. Hero: "Your life. Remembered. Sorted. Lived."
2. 01 A day with Life: phone scenes plus Rialto photos.
3. 02 Four things: flip cards for Money / Time / Goals / Together.
4. 03 Together: tap a family member to see their view.
5. 04 Private by design.
6. 05 Plans: people selector, Monthly / Yearly (2 months free), Life Private card.
7. Start CTA.

### Pricing
- **Business / Life switch.** Everything below swaps.
- **Sections:**
  1. Hero with layered stack: scroll adds layers.
  2. Plans.
  3. Why this price.
  4. Configurator: tick areas → recommended plan live.
  5. Where the money goes.
  6. Setup fee / trial.
  7. Buying flow: a mock app/portal walk-through.
  8. Year-one comparison.
  9. Every detail (comparison table).
  10. FAQ.
  11. CTA.
- **Business terms:** prices net + 19% VAT, 12-month term.
- **Life terms:** prices incl. VAT, cancel monthly, 14 days free with no card.

### About
- Hero "I'm Rialto. I *get* the AI, so you don't have to." with portrait.
- 01 Path: four chapters, years still `[years]`.
- 02 Three rules.
- Photo row.
- CTA.

### Contact
- "Got a problem worth 15 minutes?"
- WhatsApp as the primary channel, the Book 15 min form, and email.
- Privacy note.

### Journal
- Filter tags, featured post, grid of 6 posts.
- Newsletter: "One email a month", with **double opt-in** required in Germany.
- Post pages are not designed. Use the old spec: max width 680px, Geist 18/1.65, H2 32px, orange links, CTA box at the end.

### Rechtliches
Impressum / Datenschutz / AGB. German only. Still a template with `[placeholders]` and needs legal review.

**Datenschutz must be extended for:**
- Nana chat (AI provider, processing location).
- Voice and microphone use.
- Transcript storage in the portal (consent).
- WhatsApp handover (wa.me link) and WhatsApp Business messaging (opt-in).

---

## Interactions & motion (general)
- **Reveals:**
  - opacity + `translateY(8–14px)`, `.4–.7s cubic-bezier(.16,1,.3,1)`
  - perspective tilts on some cards (`perspective(1200px) rotateX(18deg)` → 0)
- **Scroll-pinned sections** use sticky containers with tall wrappers (`230–420vh`). Progress is mapped 0→1 to drive transforms.
- **Hover:** cards lift 6px with an orange border; buttons invert (black ↔ orange).
- **Reduced motion:**
  - Show the final states.
  - Disable Lenis, page transitions, the cursor, pinned scrubbing and loops.
- **Responsive:**
  - Grids use `repeat(auto-fit,minmax(min(100%,Npx),1fr))`.
  - The Nav collapses at 1100px.
  - Nana goes full-screen under 560px.
  - Check every pinned section on mobile; un-pin to stacked content below ~800px where it feels cramped.

## Assets (`design/assets/`)
- **Brand:** `rideff-mark.png` (nav/logo), `rideff-logo.png`, `favicon.png`.
- **Video:** `rideff-intro.mp4`, the Home intro.
- **Rialto photos:** `rialto-*.jpg`, generated from a reference photo. **His face must never be altered**; new shots may change only the outfit, setting, light and pose.
- **TIC Originals:** `tic-*.png` (shop and back-office screenshots), `hf/tic1–3.jpg`.
- **Mami I Patisserie:** `mami-*.png`.
- **Industry scenes:** `site-*.jpg` (café, hotel, shop, label, practice, trades).
- **Product screenshots:** `portal-client.png`, `portal-admin.png`, `life-cockpit.png`, `life-briefing.png`, taken from the demos.

**Stand-ins to replace with real photos before launch:**
- About: "Eichstätt" and "With a client" (currently other Rialto photos).
- Workbench: team photos (currently empty interiors).
- Journal: covers (reused assets).

## Files
```
design/
  RIDEFF Home|Understand|Build|Run|Work|Life|Pricing|About|Contact|Journal|Storefront|Workbench|Rechtliches.dc.html
  RideffNav.dc.html, RideffFooter.dc.html, RideffNana.dc.html      shared components
  RIDEFF Business Demo.dc.html, RIDEFF Life Demo.dc.html, RIDEFF Portal.dc.html   link targets / reference only
  rideff-de.js                 prototype translator + EN→DE table (do not port)
  rideff-*-i18n.js             demo/portal string tables (DE/EN/ID)
  support.js, image-slot.js    prototype runtime (do not port)
  assets/
i18n/rideff-en-de.json         EN→DE strings, grouped per page (source of truth for German)
screenshots/                   see "Screenshots"
```

## Open items before launch
1. **Owner to provide:**
   - Cal.com slug for the 15-min call and the Life Private call
   - newsletter provider (Resend or Brevo)
   - OG image
   - Impressum data
   - real TIC case copy (`[Case summary placeholder…]`, highlights, stats)
   - About chapter years
   - Journal dates and posts
2. **Pricing:** figures marked "placeholder — to be confirmed" (cost split, "usual way" comparison, limits table).
3. **Nana:**
   - AI provider and voice provider
   - WhatsApp Business account and template approval
   - Supabase tables for transcripts and summaries
   - DSGVO text update
4. **Not designed yet:** 404, Journal article page, cookie-free analytics notice. Build them in RIDEFF style.
5. **Portal:** separate handoff.
