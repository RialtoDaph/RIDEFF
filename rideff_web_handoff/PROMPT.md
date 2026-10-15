# Prompt for Claude Code: rideff.com (website)

Run in the repo `RialtoDaph/RIDEFF` with the folder `rideff_web_handoff/` copied into the repo root. Paste everything below the line.

---

Build **rideff.com**, the marketing website for RIDEFF, from the design handoff in `rideff_web_handoff/`.

**Read first:**
1. `rideff_web_handoff/README.md`: the full spec (tokens, every section, interactions, prices, domains).
2. `rideff_web_handoff/screenshots/`: for orientation.
3. `rideff_web_handoff/design/RIDEFF Website.dc.html` and `RIDEFF Rechtliches.dc.html`.
   - Run `npx serve rideff_web_handoff/design` to click through them.
   - The `class Component` at the bottom of each file holds state, data and animation timings.
   - `rideff-v7-i18n.js` holds every string as `[de, en, id]`.
   - Do not port `support.js` or `image-slot.js`.

**Confirmed decisions:** read the "Decisions" section in the README first. Germany first, BUSINESS is the default mode, the trial needs no card, Cal.com for booking, Life Private is paid via a manual Stripe link.

**Scope: website only.**
- The Life app (signup, onboarding, cockpit) lives in a **separate repo** at `app.rideff.com`. Do not build it here.
- Website CTAs link out:
  - "14 Tage kostenlos testen" → `https://app.rideff.com/signup?plan={life|plus|together}&lang={de|en|id}`
  - "Anmelden" in the top bar → `https://app.rideff.com/login?lang=…`
  - In PRIVATE mode, every self-serve CTA (top bar, hero, module card, pricing, footer) goes to signup. "Gespräch buchen" stays only for Life Private and section 09. Business keeps "Gespräch buchen" everywhere.
  - No Life demo on the website; visitors use the 14-day trial.
  - The Business "Demo ansehen" goes to `/demo` (rebuilt here, see step 4b).
  - "Kundenportal" goes to `https://portal.rideff.com`.
- Email everywhere: `hallo@rideff.com`.

**Stack:**
- Next.js (App Router), TypeScript, Tailwind CSS v4, deployed on Vercel (region `fra1`).
- Mostly static pages (SSG); no database.
- Fonts: Geist, Geist Mono and Instrument Serif via `next/font`.
- next-intl with routes `/de` (default, also served at `/`), `/en`, `/id`; `hreflang` tags; language switch keeps the current section.

**Rules:**
- Match the design pixel-accurately: colours, type, spacing, radii, shadows, copy and motion timings from the README and prototype.
- Put the tokens in the Tailwind theme as CSS variables.
- German copy is canonical. Convert the i18n table to `messages/de.json`, `en.json`, `id.json` with semantic keys. Never invent or machine-translate new copy; ask me.
- Prices: Life 12,90 € / Life Plus 19,90 € (default) / Together 29,90 € per month, incl. VAT; Life Private from 68 € a month plus setup from 449 €. Business prices are net. EN shows `€12.90`.
- There is no waiting list and no "Start Dezember" anywhere. Life is live.
- No scroll-jacking. Section 03 "Ein Tag mit Life" auto-advances on a 4.2 s timer while in view and its dots are clickable.
- Viewport animations use IntersectionObserver and pause off-screen.
- `prefers-reduced-motion` shows final states and stops loops, including the rotating Life Private ring.
- Accessibility: semantic landmarks, focus rings, alt text, 44 px touch targets.
- Lighthouse target: 95+ on Performance, Accessibility and SEO, on mobile.

**Build in this order, and stop after each step for my review:**
1. **Foundation:** project setup, tokens, fonts, i18n routing, top bar (logo, section links, DE/EN/ID switch, BUSINESS/PRIVATE toggle, CTA), footer with the cropped RIDEFF wordmark, plus the intro video on first visit (desktop only, once per session).
2. **PRIVATE (Life) page, sections 01–09:**
   - Including the scroll-eased flow line, the 04 Weiterdenken research and brainstorm animation, pricing tabs and the Life Private card.
   - The toggle switches the page content (state in the URL: `?for=private`).
3. **BUSINESS page, sections 01–09:** the industry picker, the case-study modal and the plans.
4. **Booking:**
   - Use Cal.com for the Business Erstgespräch (inline embed, brand colour `#FF6A00`, event `rideff/erstgespraech`), styled to match the prototype widget.
   - The Life Private card links to `https://cal.com/rideff/life-private`.
   - Ask me for the Cal.com usernames before wiring.
   **4b. Business Demo:** `/demo`, rebuilt from `RIDEFF Business Demo.dc.html` as a client-only route with its mock data, all 6 industries, roles and tabs.
5. **Legal pages:** `/impressum`, `/datenschutz`, `/agb` from `RIDEFF Rechtliches.dc.html`. **Keep the [placeholders] visible**; they are filled in later. German only.
6. **Extras:**
   - **Newsletter** in the footer with double opt-in (Resend Audiences or Brevo; ask me which).
   - **404 page** in RIDEFF style (see README).
   - **Blog** `/blog` with MDX, a list page and an article page as described in the README, plus 1 sample post I will replace.
7. **SEO and meta:**
   - Titles and descriptions per locale, Open Graph image, `sitemap.xml`, `robots.txt`, favicon from `assets/`.
   - Cookie-free analytics (Vercel Analytics). No cookie banner needed as long as no tracking cookies are set.
8. **Mobile pass:** single column below 768 px, a hamburger menu, phone mockups scaled down, and no horizontal scroll at 360 px.

**Before coding each step:** list the components you will create and any question where the prototype is unclear. Use the real copy; no lorem ipsum.

**Domains (I set these up in Vercel):**
- `rideff.com` points to this project.
- `www.rideff.com` redirects to `rideff.com`.
- `app.rideff.com` belongs to the separate Life project.
