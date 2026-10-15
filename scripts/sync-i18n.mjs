#!/usr/bin/env node
/**
 * Generates messages/en.json and messages/id.json from the canonical
 * messages/de.json, using only the authoritative [de, en, id] tables of the
 * design handoff (rideff_web_handoff/design/rideff-*-i18n.js).
 *
 * - Rich-text tags (<accent>…</accent>) and ICU arguments ({plan}) are kept;
 *   every text segment between them is translated on its own.
 * - Euro amounts without a table entry are reformatted for EN exactly like the
 *   prototype runtime does (12,90 € → €12.90). ID keeps the German format.
 * - messages/invariant.json lists brand names and labels the prototype never
 *   translates (RIDEFF, FAQ, …).
 * - messages/overrides.json holds owner-approved translations that are not in
 *   the tables: { "dot.path.key": { "en": "…", "id": "…" } }.
 * - Anything still missing is listed and the script exits with code 1. The
 *   German text is then used as a placeholder in en/id until the owner
 *   supplies a translation. Nothing is machine-translated.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const designDir = path.join(root, 'rideff_web_handoff/design');
const msgDir = path.join(root, 'messages');

// --- load tables -----------------------------------------------------------
const TABLES = ['rideff-v7-i18n.js', 'rideff-biz-i18n.js', 'rideff-demo-i18n.js', 'rideff-data-i18n.js'];
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const M = new Map();
for (const file of TABLES) {
  const p = path.join(designDir, file);
  if (!fs.existsSync(p)) continue;
  const sandbox = { window: {}, document: undefined };
  // Only the array assignments are evaluated; the DOM runtime bails out without a document.
  const src = fs.readFileSync(p, 'utf8').replace(/\(function\s*\(\)\s*\{[\s\S]*$/, '');
  vm.runInNewContext(src, sandbox);
  for (const v of Object.values(sandbox.window)) {
    if (!Array.isArray(v)) continue;
    for (const row of v) {
      if (Array.isArray(row) && row.length >= 3 && !M.has(norm(row[0]))) M.set(norm(row[0]), { en: row[1], id: row[2] });
    }
  }
}

const invPath = path.join(msgDir, 'invariant.json');
const INVARIANT = new Set(fs.existsSync(invPath) ? JSON.parse(fs.readFileSync(invPath, 'utf8')).strings : []);

// --- prototype translation rules (ported from rideff-v7-i18n.js) ------------
const EUR = /^(\s*)([+−-]?)\s?(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d{1,2}))?\s?€(\s*)$/;
const EUR2 = /^(\s*)([+−-]?)€\s?(\d{1,3}(?:\.\d{3})+)(?:,(\d{1,2}))?(\s*)$/;
function tr(src, lang) {
  const k = norm(src);
  if (!k) return src;
  const lead = src.match(/^\s*/)[0];
  const trail = src.match(/\s*$/)[0];
  if (M.has(k)) return lead + M.get(k)[lang] + trail;
  if (INVARIANT.has(k)) return src;
  // Pure punctuation / numbers / symbols need no translation.
  if (!/\p{L}/u.test(k)) {
    if (lang === 'en') {
      const m = src.match(EUR) || src.match(EUR2);
      if (m) return m[1] + m[2] + '€' + m[3].replace(/\./g, ',') + (m[4] ? '.' + m[4] : '') + m[5];
    }
    return src;
  }
  return null;
}

// Split on rich-text tags, ICU arguments and " · " separators; translate text in between.
const TOKEN = /(<\/?[a-zA-Z]+>|\{[a-zA-Z0-9_]+\}| · )/;
function translate(de, lang) {
  const whole = tr(de, lang);
  if (whole !== null) return whole;
  const parts = de.split(TOKEN);
  if (parts.length === 1) return null;
  const out = [];
  for (const part of parts) {
    if (TOKEN.test(part) || part === '') { out.push(part); continue; }
    const t = tr(part, lang);
    if (t === null) return null;
    out.push(t);
  }
  return out.join('');
}

// --- walk ------------------------------------------------------------------
const de = JSON.parse(fs.readFileSync(path.join(msgDir, 'de.json'), 'utf8'));
const overridesPath = path.join(msgDir, 'overrides.json');
const overrides = fs.existsSync(overridesPath) ? JSON.parse(fs.readFileSync(overridesPath, 'utf8')) : {};
const missing = { en: [], id: [] };

function walk(node, lang, keyPath) {
  if (typeof node === 'string') {
    const key = keyPath.join('.');
    if (overrides[key]?.[lang] !== undefined) return overrides[key][lang];
    const t = translate(node, lang);
    if (t === null) { missing[lang].push(`${key}: ${JSON.stringify(node)}`); return node; }
    return t;
  }
  if (Array.isArray(node)) return node.map((v, i) => walk(v, lang, [...keyPath, String(i)]));
  if (node && typeof node === 'object') {
    // Keys starting with "_" are German-only (e.g. legal pages) and copied verbatim.
    return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, k.startsWith('_') ? v : walk(v, lang, [...keyPath, k])]));
  }
  return node;
}

for (const lang of ['en', 'id']) {
  const out = walk(de, lang, []);
  fs.writeFileSync(path.join(msgDir, `${lang}.json`), JSON.stringify(out, null, 2) + '\n');
}

const total = missing.en.length + missing.id.length;
if (total) {
  for (const lang of ['en', 'id']) {
    if (!missing[lang].length) continue;
    console.log(`\nMissing ${lang.toUpperCase()} translations (${missing[lang].length}):`);
    for (const m of missing[lang]) console.log('  ' + m);
  }
  process.exitCode = 1;
} else {
  console.log(`messages/en.json and messages/id.json generated from ${M.size} table rows. No gaps.`);
}
