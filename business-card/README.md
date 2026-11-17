# RIDEFF business card

Vertical card, 55 x 85 mm (printer option: Standard 85 x 55 mm, Vertikal).

## Files to upload to the printer

| Side | File | Size |
|---|---|---|
| Front (Vorderseite) | `rideff-card-portrait-front-bleed2.png` | 59 x 89 mm incl. 2 mm bleed, ~600 dpi |
| Back (Rückseite) | `rideff-card-portrait-back-bleed2.png` | 59 x 89 mm incl. 2 mm bleed, ~600 dpi |

`rideff-card-portrait-front.png` / `-back.png` are the trimmed 55 x 85 mm previews (300 dpi). Everything in `archive/` is superseded; do not upload it.

## Rebuild

```bash
python3 build_portrait.py   # writes portrait.html and the _p-*.html print pages
node render.cjs             # renders the four PNGs above (needs Playwright)
```

`build.py` is imported by `build_portrait.py` for the logo and QR data. The other `build_*.py` / `*.html` files are option comparisons from the design process.

## Content

- Name: Rialto Daphino Effendy, Founder & Operator
- Phone +49 176 32572420, Email hallo@rideff.com, Instagram @rialtorideff
- QR: https://rideff.com
