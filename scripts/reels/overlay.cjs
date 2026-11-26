'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const FONTS = path.resolve(__dirname, '..', '..', 'src', 'fonts');
const font = (file) => fs.readFileSync(path.join(FONTS, file)).toString('base64');

const MARGIN_X = 96;
const MARGIN_BOTTOM = 220;
const MARGIN_TOP = 250; // clear of the platform's top UI

const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>');

function html(cue) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:G;font-weight:700;src:url(data:font/woff2;base64,${font('Geist-Bold.woff2')})}
@font-face{font-family:G;font-weight:500;src:url(data:font/woff2;base64,${font('Geist-Medium.woff2')})}
html,body{margin:0;width:1080px;height:1920px;background:transparent;overflow:hidden}
#box{position:absolute;left:${MARGIN_X}px;${cue.pos === 'top' ? `top:${MARGIN_TOP}px` : `bottom:${MARGIN_BOTTOM}px`};width:${1080 - 2 * MARGIN_X}px;font-family:G,sans-serif;color:#FFF7ED}
.scrim{position:absolute;left:0;right:0;bottom:0;height:900px;background:linear-gradient(to top,rgba(20,8,10,.97) 0%,rgba(20,8,10,.94) 70%,rgba(20,8,10,0) 100%)}
.bar{width:96px;height:6px;border-radius:3px;background:#FF6A00;margin-bottom:28px}
.en{font-weight:700;font-size:84px;line-height:1.04;letter-spacing:-0.03em;text-shadow:0 2px 24px rgba(20,8,10,.85)}
.de{margin-top:22px;font-weight:500;font-size:42px;line-height:1.2;color:#FDBA74;text-shadow:0 2px 18px rgba(20,8,10,.9)}
.url{margin-top:34px;display:inline-block;font-weight:700;font-size:48px;color:#14080A;background:#FF6A00;border-radius:999px;padding:14px 34px}
</style></head><body>${cue.pos === 'top' ? '' : '<div class="scrim"></div>'}<div id="box"><div class="bar"></div>
<div class="en">${esc(cue.en)}</div><div class="de">${esc(cue.de)}</div>
${cue.url ? `<div class="url">${esc(cue.url)}</div>` : ''}
</div></body></html>`;
}

let browser;

// Renders one overlay as a transparent 1080x1920 PNG; returns the text block's box in px.
async function renderOverlay(cue, outPng) {
  browser = browser || (await chromium.launch());
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  try {
    await page.setContent(html(cue));
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: outPng, omitBackground: true });
    return await page.evaluate(() => {
      const r = document.getElementById('box').getBoundingClientRect();
      return { width: r.width, height: r.height, top: r.top, bottom: r.bottom };
    });
  } finally {
    await page.close();
  }
}

async function closeOverlay() {
  await browser?.close();
  browser = undefined;
}

module.exports = { renderOverlay, closeOverlay };
