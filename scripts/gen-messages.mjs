#!/usr/bin/env node
/**
 * Generates messages/en.json and messages/de.json.
 *
 * Sources:
 *   rideff_handoff/i18n/rideff-en-de.json  EN source → DE, grouped per page (source of truth)
 *   messages/custom.json                   strings that are not in the handoff (404, blog,
 *                                          newsletter mail, composed ICU strings …) as {de, en} leaves
 *   messages/no-emdash.json                handoff strings rewritten without em dashes (applied last)
 *
 * Keys: camelCase from the first words of the English source, unique per namespace and
 * stable as long as the handoff order does not change. "{x}" placeholders become ICU
 * arguments; a string with several "{x}" gets {x}, {y}, {z}.
 *
 * Also writes src/i18n/keymap.json (namespace → English source → key), which the
 * prototype port uses to look strings up.
 *
 *   npm run i18n
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const src = JSON.parse(fs.readFileSync(path.join(root, 'rideff_handoff/i18n/rideff-en-de.json'), 'utf8')).strings;
const custom = JSON.parse(fs.readFileSync(path.join(root, 'messages/custom.json'), 'utf8'));

const NAMES = ['x', 'y', 'z', 'w'];
const icu = (s) => {
  let i = 0;
  return s.replace(/\{x\}/g, () => `{${NAMES[i++]}}`);
};

const fixEscapes = (s) => s.replace(/(?<=[A-Za-z])u(20[0-9a-f]{2})(?=[a-z])/g, (_, h) => String.fromCharCode(parseInt(h, 16)));

function keyFor(en, used) {
  const words = en
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\{x\}/g, ' x ')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .slice(0, 6);
  let k = words.map((w, i) => (i === 0 ? w.charAt(0).toLowerCase() + w.slice(1) : w.charAt(0).toUpperCase() + w.slice(1))).join('');
  if (!k) k = 'sym';
  if (/^[0-9]/.test(k)) k = 'n' + k;
  let out = k;
  for (let n = 2; used.has(out); n++) out = `${k}${n}`;
  used.add(out);
  return out;
}

const en = {};
const de = {};
const keymap = {};
for (const [ns, table] of Object.entries(src)) {
  const used = new Set();
  en[ns] = {};
  de[ns] = {};
  keymap[ns] = {};
  for (const [rawEn, rawDe] of Object.entries(table)) {
    // A few handoff keys carry a lost escape ("Hereu2019s"); restore the character.
    const enStr = fixEscapes(rawEn);
    const deStr = fixEscapes(rawDe);
    const k = keyFor(enStr, used);
    en[ns][k] = icu(enStr);
    de[ns][k] = icu(deStr);
    keymap[ns][enStr] = k;
  }
}

// /demo: German source → English (messages/demo-source.json, see extract-demo-strings.mjs).
{
  const demo = JSON.parse(fs.readFileSync(path.join(root, 'messages/demo-source.json'), 'utf8'));
  const used = new Set();
  en.Demo = {};
  de.Demo = {};
  keymap.Demo = {};
  for (const [deStr, enStr] of Object.entries(demo)) {
    const k = keyFor(enStr, used);
    en.Demo[k] = enStr;
    de.Demo[k] = deStr;
    keymap.Demo[deStr] = k;
  }
}

function addCustom(node, enOut, deOut) {
  for (const [k, v] of Object.entries(node)) {
    if (v && typeof v === 'object' && 'de' in v && 'en' in v && typeof v.de === 'string') {
      enOut[k] = v.en;
      deOut[k] = v.de;
    } else {
      enOut[k] ??= {};
      deOut[k] ??= {};
      addCustom(v, enOut[k], deOut[k]);
    }
  }
}
addCustom(custom, en, de);
// House style: no em dashes. Handoff strings rewritten with commas, colons, full stops or "·".
addCustom(JSON.parse(fs.readFileSync(path.join(root, 'messages/no-emdash.json'), 'utf8')), en, de);

const write = (file, data) => fs.writeFileSync(path.join(root, file), JSON.stringify(data, null, 2) + '\n');
write('messages/en.json', en);
write('messages/de.json', de);
write('src/i18n/keymap.json', keymap);
// /demo looks runtime values up by their German text (src/components/dc/BusinessDemo.tsx).
write('src/i18n/demo-keymap.json', keymap.Demo);
console.log(`messages: ${Object.values(keymap).reduce((n, m) => n + Object.keys(m).length, 0)} handoff strings in ${Object.keys(keymap).length} namespaces`);
