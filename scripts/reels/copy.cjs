'use strict';

// On-screen text. `en` is the headline (English), `de` the subtitle (German, formal address).
// `pos: 'top'` moves the block to the top (the Nana chat panel fills the lower right in that shot).
// A cue with from: 0 is fully visible on frame 0 (the cover/thumbnail). from/to are shot-relative seconds and fit both the 30 s master and the 15 s cut.
const CUES = [
  { shot: 'chaos', from: 0, to: 1.8, en: 'Your business: chaos in 6 tools?', de: 'Ihr Betrieb: Chaos in 6 Tools?' },
  { shot: 'morph', from: 0.4, to: 6.6, en: 'Scattered. Then one system.', de: 'Verstreut. Dann ein System.' },
  { shot: 'slat', from: 0.4, to: 3.6, en: 'Understand. Build. Run.', de: 'Verstehen. Bauen. Betreiben.' },
  { shot: 'proof', from: 0.4, to: 4.6, en: 'Real shops. Real dashboards.', de: 'Echte Shops. Echte Dashboards.' },
  { shot: 'nana', from: 0.4, to: 2.8, en: 'Nana answers in seconds.', de: 'Nana antwortet in Sekunden.', pos: 'top' },
  { shot: 'cta', from: 0.2, to: 2.8, en: '15-min call. Free.', de: '15 Min. Gespräch. Kostenlos.', url: 'rideff.com' },
];

module.exports = { CUES };
