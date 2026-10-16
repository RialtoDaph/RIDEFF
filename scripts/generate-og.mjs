#!/usr/bin/env node
/**
 * Renders the static Open Graph images public/og/og-{de,en,id}.png (1200×630).
 * Run once after copy changes: `npm run og`. Not generated per request.
 *
 * Content: RIDEFF wordmark top left, the hero headline of each language
 * (from messages/*.json, i.e. the rideff-v7-i18n.js table), one line of the
 * hero tagline (its shortest German sentence), and rideff.com. ID uses the Life hero, because the Indonesian
 * site only exists for RIDEFF Life.
 *
 * To use designed images instead, replace the PNGs and keep the file names.
 */
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { ImageResponse } from 'next/og.js';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const font = (p) => fs.readFileSync(path.join(root, 'node_modules/geist/dist/fonts', p));
const fonts = [
  { name: 'Geist', data: font('geist-sans/Geist-Bold.ttf'), weight: 700, style: 'normal' },
  { name: 'Geist', data: font('geist-sans/Geist-Regular.ttf'), weight: 400, style: 'normal' },
  { name: 'Geist Mono', data: font('geist-mono/GeistMono-Regular.ttf'), weight: 400, style: 'normal' },
];
const mark = 'data:image/png;base64,' + fs.readFileSync(path.join(root, 'public/brand/mark-lg.png')).toString('base64');
const h = React.createElement;

const DE = JSON.parse(fs.readFileSync(path.join(root, 'messages/de.json'), 'utf8'));
export const OG_SOURCE = { de: 'business', en: 'business', id: 'private' };

for (const lang of ['de', 'en', 'id']) {
  const m = JSON.parse(fs.readFileSync(path.join(root, `messages/${lang}.json`), 'utf8'));
  const hero = m.hero[OG_SOURCE[lang]];
  // "Ihr Betrieb bekommt ein <accent>Gehirn.</accent>" → plain part + accent
  const [, plain, accent] = hero.title.match(/^(.*?)<accent>(.*)<\/accent>/);
  // One line of tagline: the sentence that is shortest in the German lead (same sentence in
  // every language), shrunk if it still would not fit.
  const split = (t) => t.match(/[^.!?]+[.!?]/g).map((x) => x.trim());
  const deSentences = split(DE.hero[OG_SOURCE[lang]].lead);
  const idx = deSentences.indexOf(deSentences.reduce((a, b) => (b.length < a.length ? b : a)));
  const tagline = split(hero.lead)[idx];
  const tagSize = Math.min(30, Math.floor(1056 / (tagline.length * 0.5)));
  const words = plain.trim().split(/\s+/);

  const img = new ImageResponse(
    h(
      'div',
      {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: '#0B0B0C',
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          color: '#F5F5F4',
          fontFamily: 'Geist',
        },
      },
      h(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: 16 } },
        h('img', { src: mark, width: 64, height: 32 }),
        h('span', { style: { fontSize: 30, fontWeight: 700, letterSpacing: '0.02em' } }, 'RIDEFF'),
      ),
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: 28 } },
        h(
          'div',
          { style: { display: 'flex', flexWrap: 'wrap', fontSize: 96, fontWeight: 700, letterSpacing: '-0.055em', lineHeight: 0.98, maxWidth: 1000 } },
          ...words.map((w, i) => h('span', { key: i, style: { marginRight: 24 } }, w)),
          h('span', { key: 'a', style: { color: '#FF6A00' } }, accent),
        ),
        h('div', { style: { fontSize: tagSize, color: '#A1A1AA', lineHeight: 1.35, whiteSpace: 'nowrap' } }, tagline),
        h('div', { style: { fontFamily: 'Geist Mono', fontSize: 22, letterSpacing: '0.08em', color: '#FF6A00' } }, 'rideff.com'),
      ),
    ),
    { width: 1200, height: 630, fonts },
  );
  const out = path.join(root, `public/og/og-${lang}.png`);
  fs.writeFileSync(out, Buffer.from(await img.arrayBuffer()));
  console.log(`${path.relative(root, out)}: ${plain.trim()} ${accent} | ${tagline}`);
}
