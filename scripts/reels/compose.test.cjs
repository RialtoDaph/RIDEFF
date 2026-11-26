const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { SHOTS, frameCount } = require('./timeline.cjs');
const { CUES } = require('./copy.cjs');
const { renderOverlay, closeOverlay } = require('./overlay.cjs');
const { makeMusic, BPM } = require('./music.cjs');
const { composeReel, mapIndex } = require('./compose.cjs');

const COLORS = { chaos: '0x14080A', morph: '0x301010', slat: '0x201830', proof: '0x303018', nana: '0x103030', cta: '0x181818' };
let dir, opts;

test.before(async () => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'reels-compose-'));
  // Synthetic stand-ins for the captured frames, overlays and music.
  for (const s of SHOTS) {
    const d = path.join(dir, 'frames', s.id);
    fs.mkdirSync(d, { recursive: true });
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', `color=c=${COLORS[s.id]}:s=1080x1920:r=30`,
      '-frames:v', String(frameCount(s)), path.join(d, '%05d.png')]);
  }
  fs.mkdirSync(path.join(dir, 'overlays'));
  for (const c of CUES) await renderOverlay(c, path.join(dir, 'overlays', `${c.shot}.png`));
  await closeOverlay();
  await makeMusic({ seconds: 30, bpm: BPM, out: path.join(dir, 'music-full.wav') });
  await makeMusic({ seconds: 15, bpm: BPM, out: path.join(dir, 'music-short.wav') });
  opts = { framesDir: path.join(dir, 'frames'), overlaysDir: path.join(dir, 'overlays'), musicDir: dir, workDir: path.join(dir, 'work') };
});
test.after(() => fs.rmSync(dir, { recursive: true, force: true }));

const probe = (file, entries) => execFileSync('ffprobe', ['-v', 'error', '-show_entries', entries, '-of', 'default=nw=1', file], { encoding: 'utf8' });
const field = (txt, k) => new RegExp(`^${k}=(.*)$`, 'm').exec(txt)[1];

for (const [cut, secs] of [['full', 30], ['short', 15]]) {
  test(`${cut} cut: 1080x1920, 30 fps, ${secs} s, H.264 yuv420p + AAC, under 50 MB`, async () => {
    const out = path.join(dir, `${cut}.mp4`);
    await composeReel({ cut, out, ...opts });
    const v = probe(out, 'stream=codec_name,codec_type,width,height,pix_fmt,avg_frame_rate');
    assert.match(v, /codec_name=h264/);
    assert.match(v, /codec_name=aac/);
    assert.strictEqual(field(v, 'width'), '1080');
    assert.strictEqual(field(v, 'height'), '1920');
    assert.strictEqual(field(v, 'pix_fmt'), 'yuv420p');
    assert.strictEqual(field(v, 'avg_frame_rate'), '30/1');
    const dur = Number(field(probe(out, 'format=duration'), 'duration'));
    assert.ok(Math.abs(dur - secs) <= 0.2, `duration ${dur}`);
    assert.ok(fs.statSync(out).size < 50 * 1024 * 1024);
  });
}

test('short cut subsamples master frames: first and last map to first and last, never decreasing', () => {
  assert.strictEqual(mapIndex(0, 90, 60), 0);
  assert.strictEqual(mapIndex(59, 90, 60), 89);
  let prev = -1;
  for (let i = 0; i < 60; i++) { const k = mapIndex(i, 90, 60); assert.ok(k >= prev); prev = k; }
});

test('frame 0 already shows the hook text (it is the cover/thumbnail)', async () => {
  const out = path.join(dir, 'full.mp4');
  await composeReel({ cut: 'full', out, ...opts });
  const png = path.join(dir, 'frame0.png');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', out, '-frames:v', '1', png]);
  const txt = execFileSync('ffmpeg', ['-v', 'error', '-i', png, '-vf', 'crop=1080:360:0:1250,signalstats,metadata=print:key=lavfi.signalstats.YMAX:file=-', '-f', 'null', '-'], { encoding: 'utf8' });
  assert.ok(Number(/YMAX=(\d+)/.exec(txt)[1]) > 200, 'no white headline text in frame 0');
});
