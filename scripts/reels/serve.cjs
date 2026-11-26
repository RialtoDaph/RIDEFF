'use strict';
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

// Runs the production server (`next start`); requires a prior `npm run build`.
async function startServer() {
  const child = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    cwd: ROOT,
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

module.exports = { startServer };
