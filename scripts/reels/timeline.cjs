'use strict';

const FPS = 30;

const shot = (id, start, end) => ({ id, start, end });

// 30 s master cut.
const SHOTS = [
  shot('chaos', 0, 3),
  shot('morph', 3, 12),
  shot('slat', 12, 16),
  shot('proof', 16, 21),
  shot('nana', 21, 25),
  shot('cta', 25, 30),
];

const frameCount = (s) => Math.round((s.end - s.start) * FPS);

// 15 s cut, same shot ids (slat and proof are dropped).
const shortCut = () => [
  shot('chaos', 0, 2),
  shot('morph', 2, 9),
  shot('nana', 9, 12),
  shot('cta', 12, 15),
];

// Ease-in-out cubic, clamped to 0..1.
const scrollProgress = (t) => {
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

module.exports = { FPS, SHOTS, frameCount, shortCut, scrollProgress };
