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
| Home → (05) cost comparison | "On cost · placeholder figures" | `Home.onCostPlaceholderFigures` |
| Home / Contact booking card | "Free first call · Cal.com link placeholder" | `Home.freeFirstCallCalComLink`, `Contact.*` |
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

- [ ] **ElevenLabs setup** (owner):
  1. ElevenLabs account; for EU data residency an EU-residency workspace (then `ELEVENLABS_REGION=eu`).
  2. API key with Agents access.
  3. Voice: for now the Instant Voice Clone "Nana" (recorded in Indonesian, so German has an accent). For more natural German, re-record ~1–2 min in German and re-run the script with the new `NANA_VOICE_ID`. Optional tuning: `NANA_TTS_MODEL`, `NANA_STABILITY`, `NANA_SIMILARITY` (try values in ElevenLabs → Text to Speech first).
  4. Run `ELEVENLABS_API_KEY=… node scripts/elevenlabs-agent.mjs` (creates the agent: prompt with plans and prices, DE/EN first message, overrides, data collection, no voice recording, 30-day transcript retention). It prints the agent id.
  5. In Vercel → Environment Variables: `ELEVENLABS_API_KEY`, `ELEVENLABS_AGENT_ID` (and `ELEVENLABS_REGION`), then redeploy.
  6. Test a call and a chat in DE and EN on the preview; adjust the prompt in `scripts/elevenlabs-agent.mjs` and re-run with `ELEVENLABS_AGENT_ID` set to update.
- [ ] Choose the agent's LLM in the ElevenLabs dashboard (the script keeps the default) and put its provider into Datenschutz.
- [ ] **WhatsApp Business API** → `POST /api/nana/whatsapp`: account, sender number, approved template, opt-in record. Today it validates the number and pretends to send ("Sent to … ✓").
- [ ] **Supabase (Frankfurt)**: store transcript + summary when `consent` is true and attach them to the lead/client in the portal (`TODO(owner)` in `src/app/api/nana/summary/route.ts`).
- [ ] Rate limiting on `/api/nana/*/session` (each call mints an ElevenLabs session) and call limits / budget alerts in ElevenLabs.

## 4. Owner decisions and assets

- [ ] **Cal.com**: slug for the 15-min first call and for Life Private. The Home "(08) Start a project" day/slot picker and the Contact form currently hand the chosen slot to WhatsApp (prefilled text). Back them with the Cal.com API (or the inline embed, brand colour `#FF6A00`).
- [ ] **Route slugs** (`src/i18n/routing.ts`): `/verstehen`, `/bauen`, `/bauen/web-shops`, `/bauen/team-apps`, `/betreiben`, `/projekte`, `/preise`, `/ueber-mich`, `/kontakt` + English equivalents under `/en` — confirm.
- [ ] **Life demo link**: `NEXT_PUBLIC_LIFE_DEMO_URL` (default `https://app.rideff.com/demo`) for the "RIDEFF Life" demo links on Work/Build/Life. Sign-up CTAs go to `app.rideff.com/signup?plan=…&lang=…`.
- [ ] **Portal**: `NEXT_PUBLIC_PORTAL_URL` once `portal.rideff.com` (separate repo) is live.
- [ ] **Newsletter provider** (Resend or Brevo) + env vars; until then the Journal form shows "That didn't work just now …".
- [ ] **OG image**: `public/og/og-{de,en}.png` are generated placeholders (`npm run og`); replace with designed images, same names.
- [ ] **Photos to replace** (README): About "Eichstätt" and "With a client" (other Rialto photos for now); Workbench team photos (empty interiors); Journal covers (reused assets).
- [ ] **Meta titles/descriptions** (`messages/custom.json` → `meta`) were written for this build (not in the handoff) — approve or edit.
- [ ] **Strings written for this build** (not in the handoff), DE + EN in `messages/custom.json`: 404 page, newsletter confirm hint and errors, Journal article CTA box, Nana mic/error lines and accessibility labels, the WhatsApp form message on Home/Contact (`common.wa*`). Please approve.

## 5. Technical follow-ups

- [ ] Vercel Analytics custom events (`nana_*`) need a Pro/Enterprise plan to show up; page views work on every plan. Add the cookie-free analytics notice to Datenschutz if wording changes (section 3 already covers it).
- [ ] The ported page components (`src/components/dc/*`) are type-unchecked 1:1 ports (`// @ts-nocheck`); refactor into typed components page by page when content changes.
- [ ] Images: served through the Next.js image optimizer (`opt()`), but the originals in `public/images` are still 2–3 MB PNGs — compress them at the source when replacing.
- [ ] Not designed in the handoff, built in RIDEFF style: 404, Journal article page, newsletter confirmed/expired pages — design review.
