// Renders the print PNGs from the generated _p-*.html pages.
// Usage: node render.cjs   (needs Playwright; run `python3 build_portrait.py` first)
const { chromium } = require('playwright');
const path = require('path');
const dir = __dirname;
const jobs = [
  // name, css px width, css px height, device scale factor, output
  ['front',        650, 1004, 1, 'rideff-card-portrait-front.png'],
  ['back',         650, 1004, 1, 'rideff-card-portrait-back.png'],
  ['front-bleed2', 697, 1051, 2, 'rideff-card-portrait-front-bleed2.png'],
  ['back-bleed2',  697, 1051, 2, 'rideff-card-portrait-back-bleed2.png'],
];
(async () => {
  const b = await chromium.launch();
  for (const [n, w, h, dsf, out] of jobs) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dsf });
    await p.goto('file://' + path.join(dir, '_p-' + n + '.html'));
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(dir, out) });
    await p.close();
  }
  await b.close();
})();
