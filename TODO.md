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
- Datenschutz, new sections 7 (Nana) and 8 (WhatsApp), drafted for this build and **not yet reviewed**: `[Anbieter, Sitz, Verarbeitungsort]` (AI), `[Sprachanbieter, Sitz, Verarbeitungsort]` (voice), `[24 Stunden]` chat retention without consent, `[12 Monate]` portal transcript retention, `[über Anbieter, falls genutzt]` and `[30 Tagen]` for WhatsApp Business
- AGB: full terms still to be written

## 3. Nana (all mocked behind API routes)

The UI is final; `src/app/api/nana/*` answer with mock data (contract in `src/lib/nana/types.ts`).

- [ ] **AI provider** → `POST /api/nana/chat` (replace `mockReply()`; keep streaming text/plain and the `x-nana-actions` header). Write the system prompt with the real plans and prices (README → Nana → plan table).
- [ ] **Voice provider** → `POST /api/nana/voice/session` must return a realtime token; the client then streams mic audio (mic permission is already requested in `startCall`). Today the call panel plays the scripted café call.
- [ ] **Summary** → `POST /api/nana/summary`: let the AI fill need / interest / next from the transcript (interest must map to a real plan). The WhatsApp template and date/duration formats are already final.
- [ ] **Supabase (Frankfurt)**: tables for transcripts and summaries; store them when `consent` is true and attach them to the lead/client in the portal (`TODO(owner)` in the summary route).
- [ ] **WhatsApp Business API** → `POST /api/nana/whatsapp`: account, sender number, approved template, opt-in record. Today it validates the number and pretends to send ("Sent to … ✓").
- [ ] Rate limiting / abuse protection on the Nana routes before real providers are connected.
- [ ] Keys go into Vercel env vars (see `.env.example`).

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
