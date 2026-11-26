const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { SHOTS, shortCut } = require('./timeline.cjs');
const { CUES } = require('./copy.cjs');
const { renderOverlay, closeOverlay } = require('./overlay.cjs');

const dur = (shots, id) => { const s = shots.find((x) => x.id === id); return s ? s.end - s.start : null; };
const MARGIN_X = 96;
const MARGIN_BOTTOM = 220;

test('there is exactly one cue per master shot, in order', () => {
  assert.deepStrictEqual(CUES.map((c) => c.shot), SHOTS.map((s) => s.id));
});

test('every cue has English text and a German subtitle', () => {
  for (const c of CUES) {
    assert.ok(c.en && c.en.trim(), `${c.shot}: en empty`);
    assert.ok(c.de && c.de.trim(), `${c.shot}: de empty`);
  }
});

test('copy has no placeholder brackets, euro sign or thousand-separated figure', () => {
  for (const c of CUES) {
    for (const t of [c.en, c.de, c.url ?? '']) {
      assert.doesNotMatch(t, /[[\]]/, `${c.shot}: bracket in "${t}"`);
      assert.doesNotMatch(t, /€/, `${c.shot}: euro in "${t}"`);
      assert.doesNotMatch(t, /\d[.,]\d{3}/, `${c.shot}: figure in "${t}"`);
    }
  }
});

test('German subtitles are at most 32 characters per line', () => {
  for (const c of CUES) for (const line of c.de.split('\n')) assert.ok(line.length <= 32, `${c.shot}: "${line}" is ${line.length}`);
});

test('cue timing lies inside its shot in the master cut and, where present, the short cut', () => {
  for (const c of CUES) {
    assert.ok(c.from >= 0 && c.from < c.to, `${c.shot}: bad range`);
    assert.ok(c.to <= dur(SHOTS, c.shot), `${c.shot}: ends after master shot`);
    const short = dur(shortCut(), c.shot);
    if (short !== null) assert.ok(c.to <= short, `${c.shot}: ends after short-cut shot (${short}s)`);
  }
});

test('the Nana cue sits at the top, clear of the chat panel in the lower right', () => {
  assert.strictEqual(CUES.find((c) => c.shot === 'nana').pos, 'top');
});

test('the CTA cue carries the domain', () => {
  assert.strictEqual(CUES.find((c) => c.shot === 'cta').url, 'rideff.com');
});

test('renderOverlay writes a transparent 1080x1920 PNG whose text box fits the safe area', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'reels-overlay-'));
  try {
    for (const c of CUES) {
      const out = path.join(dir, `${c.shot}.png`);
      const box = await renderOverlay(c, out);
      const png = fs.readFileSync(out);
      assert.strictEqual(png.readUInt32BE(16), 1080, `${c.shot}: width`);
      assert.strictEqual(png.readUInt32BE(20), 1920, `${c.shot}: height`);
      assert.strictEqual(png[25], 6, `${c.shot}: PNG must be RGBA`);
      assert.ok(box.width <= 1080 - 2 * MARGIN_X, `${c.shot}: text box ${box.width}px wide`);
      assert.ok(box.bottom <= 1920 - MARGIN_BOTTOM, `${c.shot}: text box bottom at ${box.bottom}px`);
      if (c.pos === 'top') {
        assert.ok(box.top >= 220 && box.bottom <= 900, `${c.shot}: top box at ${box.top}-${box.bottom}px`);
      } else {
        assert.ok(box.top >= 1100, `${c.shot}: text box starts at ${box.top}px, would cover the particles`);
      }
    }
  } finally {
    await closeOverlay();
  }
});
