#!/usr/bin/env node
/**
 * Creates or updates the Nana agent on ElevenLabs Agents from this file, so the
 * prompt, languages and settings are versioned with the site.
 *
 *   ELEVENLABS_API_KEY=… node scripts/elevenlabs-agent.mjs --dry-run   # print the payload
 *   ELEVENLABS_API_KEY=… node scripts/elevenlabs-agent.mjs             # create → prints the agent id
 *   ELEVENLABS_API_KEY=… ELEVENLABS_AGENT_ID=agent_… node scripts/elevenlabs-agent.mjs   # update
 *
 * Optional: ELEVENLABS_REGION=eu (EU data residency workspace), NANA_VOICE_ID (an
 * ElevenLabs voice id; otherwise the agent keeps its current / default voice).
 *
 * Then set ELEVENLABS_API_KEY, ELEVENLABS_AGENT_ID (and ELEVENLABS_REGION) in Vercel.
 * The site needs these agent settings, which this script sets:
 *   - auth enabled (private agent: the site mints a token / signed URL per session)
 *   - overrides allowed: language, first message, text only (chat mode)
 *   - data collection "need", "interest", "next_step" (the WhatsApp summary)
 *   - privacy: no voice recording, transcripts kept 30 days (see Datenschutz)
 */

const API = process.env.ELEVENLABS_REGION?.trim().toLowerCase() === 'eu' ? 'https://api.eu.residency.elevenlabs.io' : 'https://api.elevenlabs.io';
const KEY = process.env.ELEVENLABS_API_KEY?.trim();
const AGENT = process.env.ELEVENLABS_AGENT_ID?.trim();
const VOICE = process.env.NANA_VOICE_ID?.trim();
const DRY = process.argv.includes('--dry-run');

// Facts Nana may use. Keep in sync with the site (Pricing page, rideff_handoff/README.md).
const PROMPT = `You are Nana, the assistant on rideff.com. RIDEFF is a one-person studio: Rialto, based in Eichstätt, Germany. He builds AI systems, team apps, websites and shops for small businesses (RIDEFF Business) and offers a personal life assistant app (RIDEFF Life). The visitor is on the "{{page}}" page; the site language is "{{locale}}".

# How you talk
- Reply in the language the visitor uses (German or English). In German, always use the formal "Sie".
- Be short and warm: one to three sentences, plain words, no lists or markdown in voice. You are an assistant, not a human; say so if asked.
- Answer only about RIDEFF. Never invent prices, dates, features, client names or guarantees. If you do not know, say that Rialto can answer it and offer the next step.
- No legal, tax or financial advice.
- Refer to Rialto as "he".

# How RIDEFF works
Three steps: Understand, Build, Run.
- Understand: it starts with a free 30-minute call with Rialto. He maps how the business runs, then sends one fixed-price offer to the client portal, approved with one click.
- Build: one platform instead of many rented tools: apps, AI agents, automations, data, entry points (website, WhatsApp, forms) and integrations. Websites & shops, team apps, client portals.
- Run: Rialto monitors and maintains the system, fixes issues, and sends a report every Monday. Hosted in the EU (Frankfurt).
Examples: TIC Originals (streetwear shop built around limited drops, plus an owner dashboard for orders, DHL labels and insights; Rialto still runs it) and Mami I Patisserie (bakery in Bandung: website, seasonal hampers and a team app).

# Plans and prices (only these)
RIDEFF Business, prices net plus 19% VAT, 12-month term, setup fee once:
- Core: €149 per month, setup from €1,290
- Growth: €249 per month, setup from €1,990 (most businesses start here; connects customers, sales, team and operations)
- Whole system: €449 per month, setup from €3,900
The setup pays for analysis, build, testing and go-live once; the monthly fee keeps it running: hosting, AI, updates and Rialto's time.
RIDEFF Life, prices include VAT, cancel monthly, 14 days free without a card:
- Life: €12,90 per month
- Life Plus: €19,90 per month
- Together: €29,90 per month, up to 4 people, shared calendar and budget
- Life Private: from €68 per month plus €449 setup, starts with a call

# Next steps you can offer
- A free 30-minute call with Rialto (the "Book a call with Rialto" button, or the contact page).
- Writing to Rialto on WhatsApp.
- At the end, the visitor can get a summary to send to Rialto on WhatsApp.
You cannot book appointments or send messages yourself.`;

const FIRST_DE = 'Hallo, hier ist Nana von RIDEFF. Wie kann ich helfen?';
const FIRST_EN = 'Hi, this is Nana from RIDEFF. How can I help?';

const payload = {
  name: 'Nana · rideff.com',
  conversation_config: {
    agent: {
      first_message: FIRST_DE,
      language: 'de',
      prompt: { prompt: PROMPT },
      dynamic_variables: { dynamic_variable_placeholders: { page: 'home', locale: 'de' } },
    },
    // German needs a multilingual voice model.
    tts: { model_id: 'eleven_flash_v2_5', ...(VOICE ? { voice_id: VOICE } : {}) },
    language_presets: {
      en: { overrides: { agent: { language: 'en', first_message: FIRST_EN } } },
    },
  },
  platform_settings: {
    auth: { enable_auth: true },
    // Matches the Datenschutz text: no audio recordings, transcripts kept 30 days
    // (the WhatsApp summary is built from them right after the call).
    privacy: { record_voice: false, retention_days: 30 },
    overrides: {
      conversation_config_override: {
        agent: { language: true, first_message: true },
        conversation: { text_only: true },
      },
    },
    // Read by POST /api/nana/summary after a call or chat (in the visitor's language).
    data_collection: {
      need: { type: 'string', description: 'What the visitor needs, in one short sentence in the language of the conversation, e.g. "A system for my café".' },
      interest: {
        type: 'string',
        description:
          'The RIDEFF plan the visitor is interested in, written as plan name and price in the language of the conversation, e.g. "Growth — €249/month, setup from €1,990". Only Core, Growth, Whole system, Life, Life Plus, Together or Life Private. If none was discussed: "Not decided yet" (German: "Noch nicht entschieden").',
      },
      next_step: {
        type: 'string',
        description:
          'The agreed next step in one short sentence in the language of the conversation, e.g. "Pick a time for a free 30-min call with Rialto". If nothing was agreed: "Rialto replies here on WhatsApp" (German: "Rialto antwortet hier auf WhatsApp").',
      },
    },
  },
};

if (DRY) {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}
if (!KEY) {
  console.error('Set ELEVENLABS_API_KEY (or use --dry-run).');
  process.exit(1);
}

const res = await fetch(AGENT ? `${API}/v1/convai/agents/${AGENT}` : `${API}/v1/convai/agents/create`, {
  method: AGENT ? 'PATCH' : 'POST',
  headers: { 'xi-api-key': KEY, 'content-type': 'application/json' },
  body: JSON.stringify(payload),
});
const out = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error(`ElevenLabs ${res.status}:`, JSON.stringify(out, null, 2));
  process.exit(1);
}
const id = AGENT || out.agent_id;
console.log(`${AGENT ? 'Updated' : 'Created'} agent ${id}`);
if (!AGENT) console.log(`Set ELEVENLABS_AGENT_ID=${id} in Vercel (and locally to update it later).`);
