# TODO before launch

Everything below is visible on the site (or wired as a mock) until it is done.
`[…]` placeholders are shown exactly as in the handoff, on purpose.

## 1. Content placeholders (visible on the site)

| Where | Placeholder | Source |
|---|---|---|
| About → (01) The path here | `[years]` in "Chapter one · [years]", "Chapter two · [years]", "Chapter three · [years]" (DE: `[Jahre]`) | `messages/*.json` → `About.chapterOneYears` … (from `rideff_handoff/i18n`) |
| Build → (05) Builds taken apart → TIC Originals | `[Case summary placeholder — …]` and `[Highlight 1–4 — e.g. …]` | `Build.caseSummaryPlaceholderWhatTICOriginals`, `Build.highlight1EG…` – `highlight4…` |
| Build → TIC stats | "—" for orders/month and load time | `src/components/dc/BuildPage.tsx` (case data) |
| Storefront → (01) Case | `[Case summary placeholder — …]`, `[n]` shops, "Load time · placeholder", "Orders / month · placeholder", "Your next site — placeholder" | `Storefront.*` |
| Understand → (03) The offer | `[your business]` in the mock offer | `Understand.offerYourBusiness` |
| Journal | `[date]` on the designed posts; the designed posts themselves (titles, texts, covers reuse other assets) | `Journal.date`, `POSTS` in `src/components/dc/JournalPage.tsx` |
| Home → (05) cost comparison | Rough market ranges written for this build ("ca. 3.000–8.000 €", "ca. 400–800 € / Monat", "ca. 100–300 € / Monat", "ca. 15 Std. / Monat"), labelled "typische Richtwerte": confirm or replace | `Home.cost*`, `Home.onCostPlaceholderFigures` in `messages/custom.json` |
| Pricing (Business) | "Placeholder split — to be confirmed" (where the money goes), "Split and timing are placeholders — to be confirmed", "“Usual way” figures are placeholders — to be confirmed" (year-one comparison), "Proposed — to be confirmed" (limits table) | `Pricing.*` |
| Pricing (Life) buying flow | mock app screens show `app.rideff.com/start`, `/connect`, `/plan`, `/billing`, `/settings`; Life Private links `cal.com/rideff` | `STEPS` in `src/components/dc/PricingPage.tsx` |

Journal posts: real posts go in `content/journal/<slug>.mdx` (see `README.md`). They are listed before the designed placeholder posts; delete `POSTS` in `JournalPage.tsx` once there are enough real ones.

## 2. Legal (German only) — needs legal review

`/impressum`, `/datenschutz`, `/agb` (`src/components/dc/LegalPage.tsx`) still show the handoff's draft banner and these placeholders:

- Impressum: `[Straße und Hausnummer]`, `[PLZ Ort]`, `[Telefonnummer]`, `[USt-IdNr. oder „Kleinunternehmer gemäß § 19 UStG“]`
- Datenschutz: `[Anschrift]`, `[7]` days log retention, `[Aufsichtsbehörde Ihres Bundeslandes]`, newsletter provider `[Resend, Inc., USA / Brevo (Sendinblue SAS), Frankreich]`
- Datenschutz, new sections 7 (Nana on ElevenLabs) and 8 (WhatsApp), drafted for this build and **not yet reviewed**: `[Firma und Anschrift laut Auftragsverarbeitungsvertrag]` (ElevenLabs entity), `[USA oder EU-Rechenzentrum, je nach Konto]`, `[Sprachmodell-Anbieter laut Agent-Einstellung]`, `[24 Stunden]` chat retention without consent, `[12 Monate]` portal transcript retention, `[über Anbieter, falls genutzt]` and `[30 Tagen]` for WhatsApp Business
- AGB: full terms still to be written

## 3. Nana

Chat and voice run on **ElevenLabs Agents** once the env vars are set; without them Nana keeps the mock answers. WhatsApp Business and Supabase are still mocks.

- [ ] **ElevenLabs setup** (owner), no terminal needed:
  1. ElevenLabs → Developers → API Keys: a restricted key with **ElevenAgents: Write** and **Voices: Read**, everything else No Access, plus a credit limit. Never paste it into chat or into a file in this (public) repo.
  2. Voices → My Voices → ⋯ on the Nana voice → **Copy voice ID**.
  3. Vercel → Project → Settings → Environment Variables: `ELEVENLABS_API_KEY` and `NANA_VOICE_ID`. Optional tuning (try values in ElevenLabs → Text to Speech first): `NANA_TTS_MODEL` (e.g. `eleven_v4`), `NANA_SIMILARITY` (e.g. `55`), `NANA_STABILITY` (e.g. `50`). EU residency workspace: `ELEVENLABS_REGION=eu`.
  4. Redeploy. The first visitor session creates the agent "Nana · rideff.com" in ElevenLabs (prompt, DE/EN first message, overrides, data collection, no voice recording, 30-day transcripts); later deploys update it when `src/lib/nana/agent-config.ts` or the voice vars change.
  5. Test a call and a chat in DE and EN.
  - Voice: the current clone "Nana" was recorded in Indonesian, so German has an accent. For more natural German, record ~1–2 min in German, then just change `NANA_VOICE_ID` in Vercel and redeploy.
- [ ] Check which LLM the agent uses in the ElevenLabs dashboard (ElevenLabs' default) and put its provider into Datenschutz.
- [ ] **WhatsApp Business API** → `POST /api/nana/whatsapp`: account, sender number, approved template, opt-in record. Today it validates the number and pretends to send ("Sent to … ✓").
- [ ] **Supabase (Frankfurt)**: store transcript + summary when `consent` is true and attach them to the lead/client in the portal (`TODO(owner)` in `src/app/api/nana/summary/route.ts`).
- [x] Rate limiting on `/api/nana/*/session`: per IP and per session, in memory per server instance (`src/lib/nana/rate-limit.ts`).
- [ ] Call limits / budget alerts in ElevenLabs as the hard stop (the in-memory limit does not cover many instances or a distributed attack).

## 4. Owner decisions and assets

- [ ] **Cal.com**: the 15-min first call links to `CAL_URL` in `src/lib/site.ts` (Home and Contact booking rows). Still open: the Life Private link. The Home "(08) Start a project" day/slot picker and the Contact form currently hand the chosen slot to WhatsApp (prefilled text). Back them with the Cal.com API (or the inline embed, brand colour `#FF6A00`).
- [ ] **Route slugs** (`src/i18n/routing.ts`): `/verstehen`, `/bauen`, `/bauen/web-shops`, `/bauen/team-apps`, `/betreiben`, `/projekte`, `/preise`, `/ueber-mich`, `/kontakt` + English equivalents under `/en` — confirm.
- [ ] **Life app URL**: CTAs point to the temporary `https://ridef-life.vercel.app` (not deployed yet, links 404 until it is). Sign-up goes to `<app>/signup?plan=…&lang=…`, demo to `<app>/demo` (`NEXT_PUBLIC_LIFE_DEMO_URL` overrides). Once `app.rideff.com` is live, set `NEXT_PUBLIC_LIFE_APP_URL=https://app.rideff.com` in Vercel (or change the default in `src/lib/site.ts`) and redeploy.
- [ ] **Portal**: `NEXT_PUBLIC_PORTAL_URL` once `portal.rideff.com` (separate repo) is live.
- [ ] **Newsletter provider** (Resend or Brevo) + env vars; until then the Journal sign-up section is hidden (`NEXT_PUBLIC_NEWSLETTER_ON` in `next.config.ts`) and appears on the next deploy after the env vars are set.
- [ ] **Domain rideff.com** is not registered yet. Register it, add it in Vercel (apex + www) as the primary domain and set up `hallo@rideff.com`. Canonicals, hreflang, sitemap, OG images and JSON-LD follow `SITE_URL` (`src/lib/site.ts`): Vercel's production domain, or `NEXT_PUBLIC_SITE_URL` if set. `app.rideff.com` (Life sign-up/demo) and `portal.rideff.com` also need DNS.
- [ ] **Search**: after the domain is live, add it to Google Search Console and Bing Webmaster Tools and submit `/sitemap.xml`; create a Google Business Profile (Eichstätt) with the same name, address and number as the Impressum.
- [ ] **OG image**: `public/og/og-{de,en}.png` are generated placeholders (`npm run og`); replace with designed images, same names.
- [ ] **Photos to replace** (README): About "Eichstätt" and "With a client" (other Rialto photos for now); Workbench team photos (empty interiors); Journal covers (reused assets).
- [ ] **Meta titles/descriptions** (`messages/custom.json` → `meta`) were written for this build (not in the handoff) — approve or edit.
- [ ] **Strings written for this build** (not in the handoff), DE + EN in `messages/custom.json`: 404 page, newsletter confirm hint and errors, Journal article CTA box, Nana mic/error lines and accessibility labels, the WhatsApp form message on Home/Contact (`common.wa*`). Please approve.

## 5. Technical follow-ups

- [ ] Vercel Analytics custom events (`nana_*`, and `cta_click` with `type` = whatsapp | call | email | phone | life_signup | life_demo | portal | contact_page and `page`) need a Pro/Enterprise plan to show up; Cal.com links get `utm_source/utm_medium/utm_content` (the page) on click; page views work on every plan. Add the cookie-free analytics notice to Datenschutz if wording changes (section 3 already covers it).
- [ ] The ported page components (`src/components/dc/*`) are type-unchecked 1:1 ports (`// @ts-nocheck`); refactor into typed components page by page when content changes.
- [ ] Structured data (`src/lib/jsonld.tsx`: business, founder, website, FAQs, offers, articles, breadcrumbs) and `/llms.txt` (`src/app/llms.txt/route.ts`) repeat facts from the site: update them when prices, address or FAQs change. Add `address.streetAddress`/`postalCode` once the Impressum has them.
- [ ] Content-Security-Policy runs **report-only** (`next.config.ts`): a production build showed no violations on Home, Life, Build, Contact and the Nana chat. After a live ElevenLabs chat + call on production also shows none in the console, rename the header to `Content-Security-Policy`.
- [ ] Security, owner side: 2FA on GitHub, Vercel, ElevenLabs, Cal.com and the domain registrar; GitHub secret scanning, push protection and Dependabot alerts (the repo is public; consider making it private); ElevenLabs agent allowlist (rideff.vercel.app, later rideff.com) and budget alerts; a Vercel Firewall rate-limit rule for `/api/nana/*` (the in-code limits are per instance); SPF, DKIM and DMARC once mail runs on rideff.com; DPA/AVV with ElevenLabs and Vercel.
- [ ] Images: served through the Next.js image optimizer (`opt()`), but the originals in `public/images` are still 2–3 MB PNGs — compress them at the source when replacing.
- [ ] Not designed in the handoff, built in RIDEFF style: 404, Journal article page, newsletter confirmed/expired pages — design review.
