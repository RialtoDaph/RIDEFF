const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const { startServer, PORT } = require('./serve.cjs');

test('startServer refuses to run when the port is already taken (a stale server would serve an old build)', async () => {
  // If something else already listens on PORT, that is exactly the condition under test.
  const squatter = http.createServer((_q, r) => r.end('stale'));
  const bound = await new Promise((resolve) => {
    squatter.once('error', () => resolve(false));
    squatter.listen(PORT, () => resolve(true));
  });
  try {
    await assert.rejects(startServer(), /already in use/);
  } finally {
    if (bound) squatter.close();
  }
});
