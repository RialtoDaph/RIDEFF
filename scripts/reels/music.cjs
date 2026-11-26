'use strict';
const { execFile } = require('node:child_process');

// 120 BPM = 0.5 s per beat, so every shot boundary (3, 12, 16, 21, 25 s; 2, 9, 12 s in the short cut) is on a beat.
const BPM = 120;

// Four-on-the-floor kick, off-beat hat, 8th-note bass on a two-chord loop (A, F), soft pad.
// Synthesized with ffmpeg only: free, and no licensing question.
function expression(bpm) {
  const p = (60 / bpm).toFixed(6); // beat length in s
  const kick = `0.85*sin(2*PI*(48*mod(t,${p})+90*(1-exp(-35*mod(t,${p})))/35))*exp(-7*mod(t,${p}))`;
  const hat = `0.16*(random(0)-0.5)*exp(-70*mod(t+${p}/2,${p}))`;
  const root = `if(lt(mod(t,${p}*8),${p}*4),55,43.65)`; // A1 then F1
  const bass = `0.30*sin(2*PI*${root}*t)*exp(-3*mod(t,${p}/2))`;
  const pad = `0.05*(sin(2*PI*220*t)+sin(2*PI*277.18*t)+sin(2*PI*329.63*t))`;
  return `${kick}+${hat}+${bass}+${pad}`;
}

function makeMusic({ seconds, bpm = BPM, out }) {
  const fade = 1;
  const args = [
    '-v', 'error', '-y',
    '-f', 'lavfi', '-i', `aevalsrc=exprs='${expression(bpm)}':sample_rate=44100:duration=${seconds}`,
    '-af', `alimiter=limit=0.85,afade=t=out:st=${seconds - fade}:d=${fade}`,
    '-ac', '2', out,
  ];
  return new Promise((resolve, reject) =>
    execFile('ffmpeg', args, (err, _o, stderr) => (err ? reject(new Error(stderr || err.message)) : resolve())));
}

module.exports = { makeMusic, BPM };
