'use strict';
const net = require('node:net');
const { spawn } = require('node:child_process');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');
const PORT = 3100;

async function waitUp(url, ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`server did not answer 200 at ${url} within ${ms} ms`);
}

const inUse = (port) =>
  new Promise((resolve) => {
    const c = net.connect(port, '127.0.0.1');
    c.once('connect', () => { c.destroy(); resolve(true); });
    c.once('error', () => resolve(false));
  });

// Runs the production server (`next start`); requires a prior `npm run build`.
async function startServer() {
  if (await inUse(PORT)) throw new Error(`port ${PORT} is already in use (a stale server would serve an old build)`);
  // Credit guard: without these keys Nana answers from its mock, so no ElevenLabs credits can be spent.
  const env = { ...process.env };
  for (const k of Object.keys(env)) if (/^(ELEVENLABS_|NANA_)/.test(k)) delete env[k];
  const child = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    cwd: ROOT,
    env,
    stdio: 'ignore',
    detached: true,
  });
  const url = `http://localhost:${PORT}`;
  try {
    await waitUp(`${url}/en/build`, 60000);
  } catch (e) {
    process.kill(-child.pid);
    throw e;
  }
  return {
    url,
    async stop() {
      try { process.kill(-child.pid); } catch {}
    },
  };
}

module.exports = { startServer, PORT };
