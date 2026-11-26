'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFile } = require('node:child_process');
const { FPS, SHOTS, frameCount, shortCut } = require('./timeline.cjs');
const { CUES } = require('./copy.cjs');

const OUT = path.resolve(__dirname, '..', '..', 'reels', 'out');
const DEFAULTS = {
  framesDir: path.join(OUT, 'frames'),
  overlaysDir: path.join(OUT, 'overlays'),
  musicDir: OUT,
  workDir: path.join(OUT, 'work'),
};
const pad = (n) => String(n).padStart(5, '0');

// The short cut reuses the master frames: frame i of an n-frame shot shows master frame mapIndex(i, m, n).
const mapIndex = (i, masterFrames, cutFrames) => (cutFrames <= 1 ? 0 : Math.round((i * (masterFrames - 1)) / (cutFrames - 1)));

// One numbered symlink per output frame, so ffmpeg reads a plain image sequence.
function buildSequence(shots, framesDir, seqDir) {
  fs.rmSync(seqDir, { recursive: true, force: true });
  fs.mkdirSync(seqDir, { recursive: true });
  let k = 0;
  for (const s of shots) {
    const m = frameCount(SHOTS.find((x) => x.id === s.id));
    const n = frameCount(s);
    for (let i = 0; i < n; i++) {
      fs.symlinkSync(path.resolve(framesDir, s.id, pad(mapIndex(i, m, n)) + '.png'), path.join(seqDir, pad(k++) + '.png'));
    }
  }
  return k;
}

function composeReel({ cut, out, ...o }) {
  const { framesDir, overlaysDir, musicDir, workDir } = { ...DEFAULTS, ...o };
  const shots = cut === 'short' ? shortCut() : SHOTS;
  const seqDir = path.join(workDir, `seq-${cut}`);
  const frames = buildSequence(shots, framesDir, seqDir);
  const total = frames / FPS;

  const cues = CUES.filter((c) => shots.some((s) => s.id === c.shot));
  const cta = shots.find((s) => s.id === 'cta');
  const args = ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(seqDir, '%05d.png')];
  for (const c of cues) args.push('-loop', '1', '-framerate', String(FPS), '-t', String(total), '-i', path.join(overlaysDir, `${c.shot}.png`));
  args.push('-i', path.join(musicDir, `music-${cut}.wav`));

  // Under the CTA card the busy backdrop is dimmed and blurred so the text stays readable.
  const on = `enable='between(t,${cta.start},${cta.end})'`;
  const chains = [`[0:v]gblur=sigma=18:${on},eq=brightness=-0.22:${on}[b0]`];
  cues.forEach((c, i) => {
    const s = shots.find((x) => x.id === c.shot).start + c.from;
    const e = shots.find((x) => x.id === c.shot).start + c.to;
    const fadeIn = s > 0 ? `fade=t=in:st=${s}:d=0.2:alpha=1,` : ''; // from: 0 means visible on frame 0
    chains.push(`[${i + 1}:v]format=rgba,${fadeIn}fade=t=out:st=${e - 0.2}:d=0.2:alpha=1[o${i}]`);
    chains.push(`[b${i}][o${i}]overlay=0:0:format=auto[b${i + 1}]`);
  });
  chains.push(`[b${cues.length}]format=yuv420p[vout]`);

  args.push('-filter_complex', chains.join(';'), '-map', '[vout]', '-map', `${cues.length + 1}:a`,
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-c:a', 'aac', '-b:a', '192k', '-t', String(total), '-movflags', '+faststart', out);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  return new Promise((resolve, reject) =>
    execFile('ffmpeg', args, { maxBuffer: 1 << 26 }, (err, _o, stderr) => (err ? reject(new Error(stderr || err.message)) : resolve())));
}

module.exports = { composeReel, mapIndex, DEFAULTS };
