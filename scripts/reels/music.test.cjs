const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const { SHOTS, shortCut } = require('./timeline.cjs');
const { makeMusic, BPM } = require('./music.cjs');

let dir, wav;
test.before(async () => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'reels-music-'));
  wav = path.join(dir, 'm.wav');
  await makeMusic({ seconds: 30, bpm: BPM, out: wav });
});
test.after(() => fs.rmSync(dir, { recursive: true, force: true }));

const probe = (args) => execFileSync('ffprobe', ['-v', 'error', ...args, wav], { encoding: 'utf8' }).trim();

test('music lasts 30 s (+-0.1) and has exactly one audio stream', () => {
  const streams = probe(['-show_entries', 'stream=codec_type', '-of', 'csv=p=0']).split('\n');
  assert.deepStrictEqual(streams, ['audio']);
  assert.ok(Math.abs(Number(probe(['-show_entries', 'format=duration', '-of', 'csv=p=0'])) - 30) <= 0.1);
});

test('peak level is at most -1.0 dB', () => {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-i', wav, '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' });
  const max = Number(/max_volume: (-?[\d.]+) dB/.exec(r.stderr)[1]);
  assert.ok(max <= -1.0, `max_volume ${max} dB`);
});

test('the music is not silent (mean volume above -40 dB)', () => {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-i', wav, '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' });
  assert.ok(Number(/mean_volume: (-?[\d.]+) dB/.exec(r.stderr)[1]) > -40);
});

test('every shot boundary of both cuts lies within 0.15 s of a beat', () => {
  const bounds = [...SHOTS, ...shortCut()].map((s) => s.start).filter((t) => t > 0);
  const beat = 60 / BPM;
  for (const t of bounds) {
    const off = Math.abs(t - Math.round(t / beat) * beat);
    assert.ok(off <= 0.15, `boundary ${t}s is ${off.toFixed(3)}s from a beat at ${BPM} BPM`);
  }
});
