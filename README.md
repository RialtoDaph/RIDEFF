# rideff.com

Marketing website for RIDEFF (Business + Life). Next.js App Router, TypeScript, Tailwind CSS v4, next-intl. Deployed on Vercel (`fra1`).

The design handoff lives in `rideff_web_handoff/` (spec in its `README.md`; the prototype HTML is the reference).

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all pages static)
npm run lint && npm run typecheck
```

## Routes

| URL | Page |
|---|---|
| `/`, `/en` | BUSINESS (default). `/de` redirects to `/`. `/id` redirects to `/en` (Business has no Indonesian version in the prototype). |
| `/?for=private`, `/en?for=private`, `/id?for=private` | PRIVATE (RIDEFF Life). `src/proxy.ts` rewrites it to the static internal route `/[locale]/life`. |

## Copy and translations

- `messages/de.json` is canonical and hand-written with semantic keys.
- `npm run i18n` generates `messages/en.json` and `messages/id.json` **only** from the handoff tables (`rideff_web_handoff/design/rideff-*-i18n.js`). It lists any string without a table entry and exits non-zero; nothing is machine-translated.
- `messages/invariant.json`: brand names and labels that stay the same in every language. `messages/overrides.json` (optional): translations approved by the owner that are not in the tables.

## Design tokens

Defined in `src/app/globals.css` under `@theme` (colours, fonts, radii, shadows, keyframes), available as CSS variables and Tailwind utilities.
