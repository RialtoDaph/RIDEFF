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

// Typed into Nana during the nana shot (one character every 2 frames).
const NANA_QUESTION = 'Can you build my shop?';

// Per-shot config. `scroll(p)` returns where to scroll at shot progress p (0..1): {stage: 0..1} of the
// Build hero's pinned stage, or {abs: px}. `step(page, i, n)` runs UI actions at frame i of n.
// `widgets: true` keeps Nana/WhatsApp visible. Shots without `scroll` keep the page's scroll position.
const ACTIONS = {
  chaos: { path: '/en/build', scroll: () => ({ stage: 0 }) },
  morph: { path: '/en/build', scroll: (p) => ({ stage: scrollProgress(p) }) },
  slat: {
    path: '/en/build',
    step: async (page, i, n) => {
      if (i === 6) await page.getByRole('button', { name: 'Menu' }).click();
      if (i === 36) await page.locator('#rn-menu a[href="/en/run"]').click();
      // The transition has settled by frame 84; then the Run page scrolls so the shot never goes static.
      if (i >= 84) await setScroll(page, { abs: ((i - 84) / (n - 1 - 84)) * 700 });
    },
  },
  proof: { path: '/en/build/web-shops', scroll: (p) => ({ abs: 250 + p * 1650 }) },
  nana: {
    path: '/en/build',
    fresh: true, // always start from a reloaded page: the chat toggle is stateful
    widgets: true,
    scroll: () => ({ stage: 0 }),
    step: async (page, i) => {
      if (i === 6) await page.getByText('Ask Nana', { exact: true }).first().click();
      if (i === 20) await page.getByLabel('Message to Nana').focus(); // else spaces would toggle the launcher
      const k = (i - 24) / 2;
      if (i >= 24 && Number.isInteger(k) && k < NANA_QUESTION.length) await page.keyboard.type(NANA_QUESTION[k]);
      if (i === 24 + NANA_QUESTION.length * 2 + 8) await page.keyboard.press('Enter');
    },
  },
  // Calm dark backdrop (particle hero at its final "Apps" stage); dimmed and blurred under the CTA card in compose.
  cta: { path: '/en/build', scroll: () => ({ stage: 1 }) },
};

// Hide Nana (teaser, launcher) and the WhatsApp button, unless the shot shows them.
const HIDE_WIDGETS = 'div:has(> .nana-dock), .nana-dock, .nana-wa { visibility: hidden !important; }';
async function setWidgetsHidden(page, hidden) {
  await page.evaluate(({ hidden: h, css }) => {
    let el = document.getElementById('reels-hide');
    if (h && !el) {
      el = document.createElement('style');
      el.id = 'reels-hide';
      el.textContent = css;
      document.head.appendChild(el);
    }
    if (!h && el) el.remove();
  }, { hidden, css: HIDE_WIDGETS });
}

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

async function ensurePage(page, url, fresh = false) {
  if (page.url() === url && !fresh) return;
  await page.goto(url, { waitUntil: 'load' });
  if (!paused.has(page)) {
    const now = await page.evaluate(() => Date.now());
    await page.clock.pauseAt(now + 500);
    paused.add(page);
  }
  if (url.endsWith('/en/build')) {
    await page.waitForFunction(() => /26[.,]?000/.test(document.body.innerText), null, { timeout: 30000 });
    await waitForParticles(page);
  } else {
    await page.clock.runFor(1000);
    await page.waitForTimeout(500);
  }
}

async function setScroll(page, pos) {
  await page.evaluate((p) => {
    let y = p.abs ?? 0;
    if (p.stage !== undefined) {
      const stage = document.querySelector('[data-screen-label="Hero story"]');
      y = stage ? p.stage * (stage.offsetHeight - innerHeight) : 0;
    }
    if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  }, pos);
}

// CSS transitions/animations run on real time; pin them to the virtual clock instead.
async function syncAnimations(page) {
  await page.evaluate(() => {
    const now = performance.now();
    window.__reelsAnims = window.__reelsAnims || new Map();
    for (const a of document.getAnimations()) {
      if (!window.__reelsAnims.has(a)) {
        window.__reelsAnims.set(a, now);
        a.pause();
      }
      a.currentTime = now - window.__reelsAnims.get(a);
    }
  });
}

async function captureShot(page, shot, outDir, baseUrl, opts = {}) {
  const action = ACTIONS[shot.id];
  if (!action) throw new Error(`no capture action for shot "${shot.id}"`);
  await ensurePage(page, baseUrl + action.path, action.fresh);
  await setWidgetsHidden(page, !action.widgets);
  const dir = path.join(outDir, shot.id);
  fs.mkdirSync(dir, { recursive: true });
  const n = frameCount(shot);
  for (let i = 0; i < n; i++) {
    if (action.scroll) await setScroll(page, action.scroll(i / (n - 1)));
    if (action.step) await action.step(page, i, n);
    await page.clock.runFor(1000 / FPS);
    await syncAnimations(page);
    if (opts.onFrame) await opts.onFrame(i, page);
    await page.screenshot({ path: path.join(dir, String(i).padStart(5, '0') + '.png') });
  }
  return n;
}

module.exports = { newContext, captureShot };
