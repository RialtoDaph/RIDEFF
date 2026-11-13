#!/usr/bin/env node
/**
 * Renders the static Open Graph images public/og/og-{de,en}.png (1200×630).
 * Run after copy changes: `npm run og`. Placeholder until the owner supplies a
 * designed OG image (see TODO.md); to use one, replace the PNGs and keep the names.
 *
 * Content: RIDEFF mark, the Home hero headline ("One person. Understands it.
 * Builds it. Keeps it running.") with its orange accent line, rideff.com.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { ImageResponse } from 'next/og.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const font = (p) => fs.readFileSync(path.join(root, 'node_modules/geist/dist/fonts', p));
const fonts = [
  { name: 'Geist', data: font('geist-sans/Geist-SemiBold.ttf'), weight: 600, style: 'normal' },
  { name: 'Geist Mono', data: font('geist-mono/GeistMono-Regular.ttf'), weight: 400, style: 'normal' },
];
const mark = 'data:image/png;base64,' + fs.readFileSync(path.join(root, 'public/images/rideff-mark.png')).toString('base64');
const h = React.createElement;

for (const lang of ['de', 'en']) {
  const m = JSON.parse(fs.readFileSync(path.join(root, `messages/${lang}.json`), 'utf8')).Home;
  const lines = [m.onePerson, m.understandsIt, m.buildsIt];
  const img = new ImageResponse(
    h(
      'div',
      { style: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px', background: '#FFF7ED', color: '#17090A', fontFamily: 'Geist' } },
      h('img', { src: mark, width: 96, height: 48 }),
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: 28 } },
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', fontSize: 92, fontWeight: 600, letterSpacing: '-0.05em', lineHeight: 0.96 } },
          h('span', null, lines.join(' ')),
          h('span', { style: { color: '#F97316' } }, m.keepsItRunning),
        ),
        h('div', { style: { fontFamily: 'Geist Mono', fontSize: 22, letterSpacing: '0.08em', color: '#5E4A43', textTransform: 'uppercase' } }, 'rideff.com · Eichstätt'),
      ),
    ),
    { width: 1200, height: 630, fonts },
  );
  const out = path.join(root, `public/og/og-${lang}.png`);
  fs.writeFileSync(out, Buffer.from(await img.arrayBuffer()));
  console.log(`${path.relative(root, out)}: ${lines.join(' ')} ${m.keepsItRunning}`);
}
