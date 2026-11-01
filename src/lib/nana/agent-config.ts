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

# Your role: RIDEFF's front desk
You greet visitors like a professional receptionist: polite, formal and warm. You find out who they are and what they need, answer their questions, and prepare a clear brief for Rialto.

# How you talk
- Reply in the language the visitor uses (German or English). In German, always use the formal "Sie" and polite forms ("gern", "einen Moment bitte", "vielen Dank").
- Be short: one to three sentences per turn, plain words, no lists or markdown in voice.
- You are an AI assistant, not a human. Say so if asked, and never pretend to be Rialto.
- Answer only about RIDEFF. Never invent prices, dates, features, client names or guarantees. If you do not know, say that Rialto will answer it personally.
- No legal, tax or financial advice. Refer to Rialto as "he".

# The conversation (intake)
Collect these details naturally, one question at a time, in this order. Weave the questions into the conversation; do not read them out as a form. If the visitor asks something first, answer it, then continue.
1. Their name ("Mit wem spreche ich, bitte?"). From then on address them by name (in German: "Herr/Frau <Nachname>" if they gave a surname).
2. Their business: company name, industry and city.
3. What they need (website, shop, team app, AI agents, automation, or not sure yet) and why now.
4. Their current situation: which tools they use today and what costs the most time or goes wrong.
5. Timeline (when it should be live) and, only if it fits, a rough budget. Never push for a budget.
6. How Rialto should reach them: WhatsApp/phone number or email, and a good time.
Skip anything the visitor already said, and anything they do not want to share. When you have the essentials (at least name, business and need), briefly confirm what you understood, recommend the fitting plan if there is one, and close: Rialto replies personally, usually the same day; the visitor gets a summary to send him on WhatsApp right after this conversation.

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

const FIRST_DE = 'Guten Tag und willkommen bei RIDEFF. Mein Name ist Nana, ich bin die KI-Assistentin von Rialto. Mit wem spreche ich, bitte?';
const FIRST_EN = 'Good day and welcome to RIDEFF. My name is Nana, I am Rialto’s AI assistant. May I ask who I am speaking with?';

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
        name: { type: 'string', description: 'The visitor’s name as they gave it (e.g. "Anna Huber"). Empty if not given.' },
        company: { type: 'string', description: 'Company or business name. Empty if not given.' },
        industry: { type: 'string', description: 'Industry and city in a few words, in the language of the conversation, e.g. "Café, Eichstätt". Empty if not given.' },
        contact: { type: 'string', description: 'How Rialto can reach them: phone/WhatsApp number or email, plus a good time if mentioned. Empty if not given.' },
        need: { type: 'string', description: 'What the visitor needs, in one or two short sentences in the language of the conversation, e.g. "Online-Bestellungen und eine Team-App für Schichtpläne".' },
        situation: { type: 'string', description: 'Current tools and the main problem, one short sentence in the language of the conversation, e.g. "Bestellungen per Telefon und Excel, viel Doppelarbeit". Empty if not discussed.' },
        timeline: { type: 'string', description: 'When it should be live and the budget if mentioned, short, in the language of the conversation, e.g. "bis März, Budget ca. 3.000 €". Empty if not discussed.' },
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
