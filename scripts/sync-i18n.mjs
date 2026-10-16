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
 * - Unit rules approved by the owner (months, hours, weeks) win over the tables.
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
// --- unit rules approved by the owner (Oct 2026); they win over the tables ---
const MONTHS = {
  JAN: ['JAN', 'JAN'], FEB: ['FEB', 'FEB'], 'MÄR': ['MAR', 'MAR'], APR: ['APR', 'APR'],
  MAI: ['MAY', 'MEI'], JUN: ['JUN', 'JUN'], JUL: ['JUL', 'JUL'], AUG: ['AUG', 'AGU'],
  SEP: ['SEP', 'SEP'], OKT: ['OCT', 'OKT'], NOV: ['NOV', 'NOV'], DEZ: ['DEC', 'DES'],
};
function unitRule(k, lang) {
  const L = lang === 'en' ? 0 : 1;
  if (MONTHS[k]) return MONTHS[k][L];
  // Thousands shorthand: EN "€18.4k", ID keeps the German format.
  let k1 = k.match(/^€(\d+)(?:,(\d+))?k$/);
  if (k1) return lang === 'en' ? `€${k1[1]}${k1[2] ? '.' + k1[2] : ''}k` : k;
  // Hours: EN "3.5 h", ID "3,5 jam".
  if (k === 'h') return lang === 'en' ? 'h' : 'jam';
  let m = k.match(/^([+−-]?)(\d+)(?:,(\d+))? h$/);
  if (m) return lang === 'en' ? `${m[1]}${m[2]}${m[3] ? '.' + m[3] : ''} h` : `${m[1]}${m[2]}${m[3] ? ',' + m[3] : ''} jam`;
  // Weeks, no trailing dot; plural except 1. Timeline uppercase, lever rows lowercase.
  m = k.match(/^([+−-]?)(\d+) (WO|Wo)\.$/);
  if (m) {
    const one = m[2] === '1';
    const unit = lang === 'en' ? (one ? 'wk' : 'wks') : 'mgg';
    return `${m[1]}${m[2]} ${m[3] === 'WO' ? unit.toUpperCase() : unit}`;
  }
  return null;
}

function tr(src, lang) {
  const k = norm(src);
  if (!k) return src;
  const lead = src.match(/^\s*/)[0];
  const trail = src.match(/\s*$/)[0];
  const u = unitRule(k, lang);
  if (u !== null) return lead + u + trail;
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

// The Business demo exists in DE and EN only (/id/demo redirects to /en/demo).
const EN_ONLY = new Set(['demo']);
let enOut = null;
for (const lang of ['en', 'id']) {
  const out = lang === 'id'
    ? Object.fromEntries(Object.entries(de).map(([k, v]) => [k, EN_ONLY.has(k) ? enOut[k] : walk(v, lang, [k])]))
    : walk(de, lang, []);
  if (lang === 'en') enOut = out;
  fs.writeFileSync(path.join(msgDir, `${lang}.json`), JSON.stringify(out, null, 2) + '\n');
}

// --- Business demo mock data (DE source → EN; the demo has no Indonesian) ----
const demoSrc = path.join(root, 'src/content/demo/industries.de.json');
if (fs.existsSync(demoSrc)) {
  const SKIP_KEYS = new Set(['url', 'ini', 'tier']);
  const demoWalk = (node, keyPath) => {
    if (typeof node === 'string') {
      if (SKIP_KEYS.has(keyPath[keyPath.length - 1]) || /^#[0-9a-f]{6}$/i.test(node) || /^[A-Z]$/.test(node)) return node;
      const key = 'demo:' + keyPath.join('.');
      if (overrides[key]?.en !== undefined) return overrides[key].en;
      const t = translate(node, 'en');
      if (t === null) { missing.en.push(`${key}: ${JSON.stringify(node)}`); return node; }
      return t;
    }
    if (Array.isArray(node)) return node.map((v, i) => demoWalk(v, [...keyPath, String(i)]));
    if (node && typeof node === 'object') return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, demoWalk(v, [...keyPath, k])]));
    return node;
  };
  const demo = JSON.parse(fs.readFileSync(demoSrc, 'utf8'));
  fs.writeFileSync(path.join(root, 'src/content/demo/industries.en.json'), JSON.stringify(demoWalk(demo, []), null, 1) + '\n');
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
