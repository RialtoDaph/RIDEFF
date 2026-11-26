const test = require('node:test');
const assert = require('node:assert');
const { FPS, SHOTS, frameCount, shortCut, scrollProgress } = require('./timeline.cjs');

const total = (shots) => shots.reduce((n, s) => n + frameCount(s), 0);
const contiguous = (shots) => shots.every((s, i) => i === 0 ? s.start === 0 : s.start === shots[i - 1].end);

test('master cut totals 900 frames at 30 fps', () => {
  assert.strictEqual(FPS, 30);
  assert.strictEqual(total(SHOTS), 900);
});
test('short cut totals 450 frames', () => {
  assert.strictEqual(total(shortCut()), 450);
});
test('shots are contiguous in both cuts', () => {
  assert.ok(contiguous(SHOTS));
  assert.ok(contiguous(shortCut()));
});
test('scrollProgress hits 0 and 1 and never decreases', () => {
  assert.strictEqual(scrollProgress(0), 0);
  assert.strictEqual(scrollProgress(1), 1);
  let prev = -1;
  for (let t = 0; t <= 1.0001; t += 0.05) {
    const v = scrollProgress(t);
    assert.ok(v >= prev, `decreased at ${t}`);
    prev = v;
  }
});
