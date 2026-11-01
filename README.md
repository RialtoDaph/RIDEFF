# rideff.com

Marketing website for RIDEFF (Business + Life) with the Nana assistant. Next.js App Router, TypeScript, Tailwind CSS v4, next-intl. Deployed on Vercel (`fra1`).

The design handoff lives in `rideff_handoff/` (spec: `rideff_handoff/README.md`; the `design/*.dc.html` prototypes are the reference, `screenshots/` for orientation). Open items are in **`TODO.md`**.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (pages are static)
npm run lint && npm run typecheck
```

To click through the prototypes: `cd rideff_handoff/design && python3 -m http.server` and open any `*.dc.html`.

## Routes

German is the default at `/`, English lives under `/en`. Slugs are localized (`src/i18n/routing.ts`).

| DE | EN | Page |
|---|---|---|
| `/` | `/en` | Home |
| `/verstehen` | `/en/understand` | Understand (pillar 01) |
| `/bauen` | `/en/build` | Build (pillar 02) |
| `/bauen/web-shops` | `/en/build/web-shops` | Storefront |
| `/bauen/team-apps` | `/en/build/team-apps` | Workbench |
| `/betreiben` | `/en/run` | Run (pillar 03) |
| `/projekte` | `/en/work` | Work |
| `/life` | `/en/life` | RIDEFF Life |
| `/preise` | `/en/pricing` | Pricing |
| `/ueber-mich` | `/en/about` | About |
| `/kontakt` | `/en/contact` | Contact |
| `/journal`, `/journal/<slug>` | `/en/journal` | Journal (posts German only) |
| `/impressum`, `/datenschutz`, `/agb` | — | Legal, German only (`/en/…` redirects) |
| `/demo` | `/en/demo` | Business demo, client-only, noindex |

Redirects from the old one-page site (`src/proxy.ts`): `/id/…` → `/en/…`, `/?for=private` → `/life`, `/blog/…` → `/journal/…`.

## How the pages are built

The prototypes are React templates plus a logic class. `scripts/dc-port/convert.mjs` ported each one 1:1 into `src/components/dc/*.tsx`: the template becomes the class's JSX `render()` and the logic class keeps the original state, data arrays and timings (base class and helpers in `src/lib/dc.tsx`). Copy goes through next-intl message keys, `*.dc.html` links became localized routes, `style-hover` became classes in `src/styles/dc-hover.css`. These files were then edited by hand (SSR safety, reduced motion, real APIs), so **do not re-run the converter over them**. They are type-unchecked (`// @ts-nocheck`); everything else is strict TypeScript.

Site-wide effects live in `src/components/site/SiteFx.tsx`: slat page transition, scroll-progress bar, Lenis, custom cursor, smooth anchors. All except the progress bar are off under `prefers-reduced-motion`, and pinned scroll scenes then show their final state.

Nana is mounted once in the layout (`src/components/nana/NanaMount.tsx`), so a running call survives page changes.

## Copy and translations

- Source of truth: `rideff_handoff/i18n/rideff-en-de.json` (English source → German, formal "Sie").
- `npm run i18n` (`scripts/gen-messages.mjs`) generates `messages/en.json` and `messages/de.json`: one namespace per page, camelCase keys from the English text, `{x}` → ICU arguments. It also writes `src/i18n/keymap.json`.
- `messages/custom.json`: strings that are not in the handoff (meta tags, 404, newsletter, Journal article, Nana errors and labels), `{de, en}` per key. It also overrides handoff strings where the owner decided differently, e.g. the free first call is **15 minutes** (handoff: 30) in `RideffNana.*` and `Pricing.*`.
- `/demo`: `messages/demo-source.json` (German → English, made once from the demo string tables by `scripts/extract-demo-strings.mjs`) becomes the `Demo` namespace.
- Each page sends only its own namespaces to the browser (`src/components/site/Messages.tsx`).

Edit the handoff JSON or `custom.json`, then run `npm run i18n`. Do not edit `messages/en.json` / `de.json` by hand.

## Nana (ElevenLabs Agents)

Nana's chat and voice call run on one ElevenLabs agent. The server only mints short-lived credentials (`src/lib/nana/elevenlabs.ts`, API key never reaches the browser); the browser talks to ElevenLabs with `@elevenlabs/client` (`src/components/nana/elevenlabs-client.ts`): WebRTC for the call, a text-only session for the chat. Without `ELEVENLABS_API_KEY` + `ELEVENLABS_AGENT_ID` every route answers with mock data, so the site works without an account.

The agent (prompt with plans and prices, DE/EN first message, allowed overrides, data collection for the summary, privacy) is defined in `scripts/elevenlabs-agent.mjs`; run it to create or update the agent (setup steps in `TODO.md`).

| Route | Purpose |
|---|---|
| `POST /api/nana/chat/session` | signed URL for a text-only session (or `{ provider: 'mock' }`) |
| `POST /api/nana/chat` | mock chat: streamed `text/plain`, actions in `x-nana-actions` |
| `POST /api/nana/voice/session` | WebRTC conversation token (mock: scripted call) |
| `POST /api/nana/summary` | `{ sessionId, locale, kind, duration, transcript[], consent, conversationId? }` → WhatsApp template; with a conversation id, need / interest / next come from ElevenLabs' post-call analysis |
| `POST /api/nana/whatsapp` | `{ sessionId, phone, text, optIn: true }` → WhatsApp Business template message (still mock) |

Analytics (Vercel Web Analytics, no cookies): `nana_open`, `nana_call_click`, `nana_call_start`, `nana_call_end`, `nana_summary_created`, `nana_summary_wa_rialto`, `nana_summary_wa_self`, `nana_summary_copy` (`src/lib/analytics.ts`). No message text or phone numbers are sent.

## Journal

Posts are MDX files in `content/journal/` (file name = URL slug), German only for now:

```yaml
---
title: …
date: 2026-10-15          # YYYY-MM-DD
category: understand      # understand | build | run | notes (the Journal filter tags)
cover: /images/site-cafe.jpg
excerpt: …
---
```

Real posts are listed first, followed by the designed placeholder posts until those are removed. Article layout follows the old spec (680px, Geist 18/1.65, H2 32px, orange links, CTA box).

## Newsletter (double opt-in)

The Journal form calls `POST /api/newsletter`, which sends a confirmation mail with a signed link (48 h). Only the click on that link (`/api/newsletter/confirm`) adds the address to the provider's list, then redirects to `/newsletter/confirmed` or `/newsletter/expired`. Nothing is stored on our side. Provider: `NEWSLETTER_PROVIDER` (`resend` or `brevo`), see `.env.example`.

## Images and assets

Handoff assets are in `public/images` (video: `public/media/rideff-intro.mp4`). The ported pages reference them through `opt()` (`src/lib/img.ts`), which serves resized WebP/AVIF via the Next.js image optimizer. Fonts ship with the repo (`src/fonts`, SIL OFL, loaded with `next/font/local`), so builds never download them from Google Fonts. three.js is bundled, so pages make no third-party requests.

## SEO

Per-page title, description, canonical and hreflang (`src/lib/metadata.ts`, texts in `messages/custom.json` → `meta`), `sitemap.xml`, `robots.txt`. Open Graph images `public/og/og-{de,en}.png` come from `npm run og` (placeholder until a designed image exists).

## Environment

See `.env.example`: portal URL, Life demo URL, newsletter provider. No cookies are set; the locale is carried by the URL.

## Out of scope

The client portal (`portal.rideff.com`) and the Life app (`app.rideff.com`) are separate repos. The site only links to them.
