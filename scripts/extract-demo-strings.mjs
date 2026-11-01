#!/usr/bin/env node
/**
 * One-off: builds messages/demo-source.json (German → English) for /demo.
 *
 * The Business Demo prototype is written in German and translated at runtime
 * from the DE/EN/ID tables in rideff_handoff/design/rideff-{v7,demo,biz,data}-i18n.js.
 * Those tables are plain data; this script evaluates them in a sandbox (no DOM,
 * the v7 translator itself is cut off), keeps the rows whose German text occurs
 * in "RIDEFF Business Demo.dc.html" and drops Indonesian. gen-messages.mjs then
 * turns the result into the "Demo" message namespace.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const D = path.join(root, 'rideff_handoff/design');
const ctx = { window: {} };
vm.createContext(ctx);
for (const f of ['rideff-v7-i18n.js', 'rideff-demo-i18n.js', 'rideff-biz-i18n.js', 'rideff-data-i18n.js']) {
  let src = fs.readFileSync(path.join(D, f), 'utf8');
  const cut = src.indexOf('(function(){');
  if (cut >= 0) src = src.slice(0, cut); // keep the data, not the DOM translator
  vm.runInContext(src, ctx, { timeout: 2000 });
}
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const demo = norm(fs.readFileSync(path.join(D, 'RIDEFF Business Demo.dc.html'), 'utf8').replace(/&amp;/g, '&').replace(/\\u2019/g, '’'));
const out = {};
for (const [de, en] of [...ctx.window.RIDEFF_V7_I18N, ...(ctx.window.RIDEFF_I18N_EXTRA || [])]) {
  const k = norm(String(de));
  if (k && en && !(k in out) && demo.includes(k)) out[k] = norm(String(en));
}
fs.writeFileSync(path.join(root, 'messages/demo-source.json'), JSON.stringify(out, null, 1) + '\n');
console.log(`demo-source.json: ${Object.keys(out).length} strings`);
