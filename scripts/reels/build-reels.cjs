'use strict';
// Builds both reels: node scripts/reels/build-reels.cjs [--reuse]
//   --reuse  skip the (slow) capture and recompose from reels/out/frames
// Needs a production build first: npm run build
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { SHOTS } = require('./timeline.cjs');
const { CUES } = require('./copy.cjs');
const { startServer } = require('./serve.cjs');
const { newContext, captureShot } = require('./capture.cjs');
const { renderOverlay, closeOverlay } = require('./overlay.cjs');
const { makeMusic, BPM } = require('./music.cjs');
const { composeReel, DEFAULTS } = require('./compose.cjs');

const OUT = path.dirname(DEFAULTS.framesDir);

async function capture() {
  fs.rmSync(DEFAULTS.framesDir, { recursive: true, force: true });
  const server = await startServer();
  const browser = await chromium.launch();
  try {
    const ctx = await newContext(browser);
    const page = await ctx.newPage();
    for (const shot of SHOTS) {
      const n = await captureShot(page, shot, DEFAULTS.framesDir, server.url);
      console.log(`captured ${shot.id}: ${n} frames`);
    }
    if (ctx.blockedCount() !== 0) throw new Error(`${ctx.blockedCount()} request(s) to ElevenLabs were attempted`);
  } finally {
    await browser.close();
    await server.stop();
  }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  if (!process.argv.includes('--reuse')) await capture();
  fs.mkdirSync(DEFAULTS.overlaysDir, { recursive: true });
  for (const c of CUES) await renderOverlay(c, path.join(DEFAULTS.overlaysDir, `${c.shot}.png`));
  await closeOverlay();
  await makeMusic({ seconds: 30, bpm: BPM, out: path.join(OUT, 'music-full.wav') });
  await makeMusic({ seconds: 15, bpm: BPM, out: path.join(OUT, 'music-short.wav') });
  await composeReel({ cut: 'full', out: path.join(OUT, 'rideff-reel-30s.mp4') });
  await composeReel({ cut: 'short', out: path.join(OUT, 'rideff-reel-15s.mp4') });
  console.log('done:', path.join(OUT, 'rideff-reel-30s.mp4'), path.join(OUT, 'rideff-reel-15s.mp4'));
})().catch((e) => { console.error(e); process.exit(1); });
