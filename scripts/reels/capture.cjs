'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { FPS, frameCount, scrollProgress } = require('./timeline.cjs');

const ELEVENLABS = /(^|\.)elevenlabs\.io$/;
const paused = new WeakSet();

// 810x1440 css px at 4/3 scale = 1080x1920 output. Width must stay in 760..900: >= 760 keeps the
// full 26000 particles, <= 900 uses the site's larger centred (mobile) particle layout.
async function newContext(browser) {
  const ctx = await browser.newContext({
    viewport: { width: 810, height: 1440 },
    deviceScaleFactor: 4 / 3,
    locale: 'en-US',
  });
  let blocked = 0;
  await ctx.route((url) => ELEVENLABS.test(url.hostname), (route) => {
    blocked += 1;
    return route.abort();
  });
  await ctx.clock.install(); // virtual clock: particle drift, rAF and GSAP advance per captured frame
  ctx.blockedCount = () => blocked;
  return ctx;
}

// Per-shot: page to show and the scroll position (0..1 of the hero stage) at shot-relative progress p.
const ACTIONS = {
  chaos: { path: '/en/build', scroll: () => 0 },
  morph: { path: '/en/build', scroll: (p) => scrollProgress(p) },
};

// Hide Nana (teaser, launcher) and the WhatsApp button; shots that show Nana skip this.
const HIDE_WIDGETS = 'div:has(> .nana-dock), .nana-dock, .nana-wa { visibility: hidden !important; }';

// The label reads 26000 before three.js has drawn anything, so poll the canvas until it is not blank.
async function waitForParticles(page) {
  const canvas = page.locator('canvas.bp-hero-canvas');
  const size = async () => (await canvas.screenshot({ type: 'jpeg', quality: 50 })).length;
  const blank = await size();
  for (let i = 0; i < 60; i++) {
    await page.clock.runFor(100);
    await page.waitForTimeout(100);
    if ((await size()) > blank * 1.3) return;
  }
  throw new Error('hero canvas never showed particles');
}

async function ensurePage(page, url) {
  if (page.url() === url) return;
  await page.goto(url, { waitUntil: 'load' });
  await page.addStyleTag({ content: HIDE_WIDGETS });
  await page.waitForFunction(() => /26[.,]?000/.test(document.body.innerText), null, { timeout: 30000 });
  if (!paused.has(page)) {
    const now = await page.evaluate(() => Date.now());
    await page.clock.pauseAt(now + 500);
    paused.add(page);
    await waitForParticles(page);
  }
}

async function setScroll(page, frac) {
  await page.evaluate((f) => {
    const stage = document.querySelector('[data-screen-label="Hero story"]');
    const y = stage ? f * (stage.offsetHeight - innerHeight) : 0;
    if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  }, frac);
}

async function captureShot(page, shot, outDir, baseUrl) {
  const action = ACTIONS[shot.id];
  if (!action) throw new Error(`no capture action for shot "${shot.id}"`);
  await ensurePage(page, baseUrl + action.path);
  const dir = path.join(outDir, shot.id);
  fs.mkdirSync(dir, { recursive: true });
  const n = frameCount(shot);
  for (let i = 0; i < n; i++) {
    await setScroll(page, action.scroll(i / (n - 1)));
    await page.clock.runFor(1000 / FPS);
    await page.screenshot({ path: path.join(dir, String(i).padStart(5, '0') + '.png') });
  }
  return n;
}

module.exports = { newContext, captureShot };
