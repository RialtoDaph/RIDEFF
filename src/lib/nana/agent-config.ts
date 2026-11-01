import 'server-only';

/**
 * The Nana agent on ElevenLabs, defined in code. src/lib/nana/elevenlabs.ts
 * creates the agent from this on the first visitor session and updates it
 * whenever this definition (or the voice env vars) change, so the owner only
 * sets ELEVENLABS_API_KEY and NANA_VOICE_ID in Vercel.
 *
 * Optional voice env vars (values as found in ElevenLabs → Text to Speech):
 *   NANA_VOICE_ID     ElevenLabs voice id (otherwise ElevenLabs' default voice)
 *   NANA_TTS_MODEL    eleven_flash_v2_5 (default, fastest) | eleven_turbo_v2_5 |
 *                     eleven_multilingual_v2 | eleven_v3_conversational | eleven_v4 | eleven_v4_turbo
 *   NANA_STABILITY    0–1 or 0–100 (%)
 *   NANA_SIMILARITY   0–1 or 0–100 (%)
 */
export const AGENT_NAME = 'Nana · rideff.com';

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
- Understand: it starts with a free 15-minute call with Rialto. He maps how the business runs, then sends one fixed-price offer to the client portal, approved with one click.
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
- A free 15-minute call with Rialto (the "Book a call with Rialto" button, or the contact page).
- Writing to Rialto on WhatsApp.
- At the end, the visitor can get a summary to send to Rialto on WhatsApp.
You cannot book appointments or send messages yourself.`;

const FIRST_DE = 'Hallo, hier ist Nana von RIDEFF. Wie kann ich helfen?';
const FIRST_EN = 'Hi, this is Nana from RIDEFF. How can I help?';

const MODELS = ['eleven_flash_v2_5', 'eleven_turbo_v2_5', 'eleven_multilingual_v2', 'eleven_v3_conversational', 'eleven_v4', 'eleven_v4_turbo'] as const;

/** "0.5" or "50" (percent) → 0.5; undefined when unset or invalid. */
function unit(name: string): number | undefined {
  const raw = process.env[name]?.trim();
  if (!raw) return undefined;
  const n = Number(raw);
  const v = n > 1 ? n / 100 : n;
  if (Number.isFinite(v) && v >= 0 && v <= 1) return v;
  console.error(`nana: ignoring ${name}=${raw} (expected 0–1 or 0–100)`);
  return undefined;
}

function voiceSettings() {
  const VOICE = process.env.NANA_VOICE_ID?.trim() || undefined;
  const requested = process.env.NANA_TTS_MODEL?.trim();
  const MODEL = requested && (MODELS as readonly string[]).includes(requested) ? requested : 'eleven_flash_v2_5';
  if (requested && MODEL !== requested) console.error(`nana: ignoring NANA_TTS_MODEL=${requested} (use one of ${MODELS.join(', ')})`);
  return { VOICE, MODEL, STABILITY: unit('NANA_STABILITY'), SIMILARITY: unit('NANA_SIMILARITY') };
}

/** Request body for POST /v1/convai/agents/create and PATCH /v1/convai/agents/{id}. */
export function agentPayload() {
  const { VOICE, MODEL, STABILITY, SIMILARITY } = voiceSettings();
  return {
    name: AGENT_NAME,
    conversation_config: {
      agent: {
        first_message: FIRST_DE,
        language: 'de',
        prompt: { prompt: PROMPT },
        dynamic_variables: { dynamic_variable_placeholders: { page: 'home', locale: 'de' } },
      },
      // German needs a multilingual voice model.
      tts: {
        model_id: MODEL,
        ...(VOICE ? { voice_id: VOICE } : {}),
        ...(STABILITY !== undefined ? { stability: STABILITY } : {}),
        ...(SIMILARITY !== undefined ? { similarity_boost: SIMILARITY } : {}),
      },
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
            'The agreed next step in one short sentence in the language of the conversation, e.g. "Pick a time for a free 15-min call with Rialto". If nothing was agreed: "Rialto replies here on WhatsApp" (German: "Rialto antwortet hier auf WhatsApp").',
        },
      },
    },
  };
}
