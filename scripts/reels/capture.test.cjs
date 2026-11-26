const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');
const { execFileSync } = require('node:child_process');
const { SHOTS, frameCount } = require('./timeline.cjs');
const { startServer } = require('./serve.cjs');
const { newContext, captureShot } = require('./capture.cjs');

const shot = (id) => SHOTS.find((s) => s.id === id);
const PLACEHOLDER = /\[[^\]]+\]/;

let server, browser, ctx, page, outDir;

test.before(async () => {
  server = await startServer();
  browser = await chromium.launch();
  ctx = await newContext(browser);
  page = await ctx.newPage();
  outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'reels-frames-'));
});
test.after(async () => {
  await browser?.close();
  await server?.stop();
});

test('chaos shot writes exactly frameCount(chaos) PNGs', async () => {
  const n = await captureShot(page, shot('chaos'), outDir, server.url);
  assert.strictEqual(n, frameCount(shot('chaos')));
  const files = fs.readdirSync(path.join(outDir, 'chaos')).filter((f) => f.endsWith('.png'));
  assert.strictEqual(files.length, 90);
});

// Max luma of the particle area (top of the frame, no text there) from ffmpeg signalstats.
const ymax = (png) => {
  const out = execFileSync('ffmpeg', ['-v', 'error', '-i', png, '-vf',
    'crop=1080:640:0:160,signalstats,metadata=print:key=lavfi.signalstats.YMAX:file=-', '-f', 'null', '-'],
  { encoding: 'utf8' });
  return Number(/YMAX=(\d+)/.exec(out)[1]);
};

test('chaos frame 0 already shows particles and no Nana widget', async () => {
  assert.ok(ymax(path.join(outDir, 'chaos', '00000.png')) > 60, 'frame 0 particle area is still blank');
  assert.strictEqual(await page.locator('.nana-dock').isVisible(), false);
});

test('hero shows the full 26000 particles', async () => {
  const text = await page.locator('body').innerText();
  assert.match(text, /26[.,]?000/);
});

test('Build page has no placeholder text or euro price in the hero viewport', async () => {
  const text = await page.evaluate(() =>
    [...document.querySelectorAll('body *')]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.bottom > 0 && r.top < innerHeight && el.children.length === 0;
      })
      .map((el) => el.textContent)
      .join(' '));
  assert.doesNotMatch(text, PLACEHOLDER);
  assert.doesNotMatch(text, /€/);
});

test('morph shot writes frameCount(morph) PNGs and no ElevenLabs request was made', async () => {
  const n = await captureShot(page, shot('morph'), outDir, server.url);
  assert.strictEqual(n, frameCount(shot('morph')));
  assert.strictEqual(ctx.blockedCount(), 0);
});
