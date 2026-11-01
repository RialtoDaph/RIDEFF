import 'server-only';

/**
 * ElevenLabs Agents (Nana's voice and chat brain). Server side only: the API key
 * never reaches the browser. The browser gets a short-lived credential per
 * session and talks to ElevenLabs directly with @elevenlabs/client.
 *
 * Env (Vercel → Project → Settings → Environment Variables):
 *   ELEVENLABS_API_KEY   API key with Agents access
 *   ELEVENLABS_AGENT_ID  the Nana agent (scripts/elevenlabs-agent.mjs creates/updates it)
 *   ELEVENLABS_REGION    "eu" for EU data residency (needs an EU-residency workspace), default "us"
 *
 * Without key + agent id the Nana routes fall back to their mock answers.
 */
const REGIONS = {
  us: { api: 'https://api.elevenlabs.io', ws: 'wss://api.elevenlabs.io', livekit: 'wss://livekit.rtc.elevenlabs.io' },
  eu: { api: 'https://api.eu.residency.elevenlabs.io', ws: 'wss://api.eu.residency.elevenlabs.io', livekit: 'wss://livekit.rtc.eu.residency.elevenlabs.io' },
} as const;

export type ElevenLabsRegion = keyof typeof REGIONS;

function config() {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  const agentId = process.env.ELEVENLABS_AGENT_ID?.trim();
  const region: ElevenLabsRegion = process.env.ELEVENLABS_REGION?.trim().toLowerCase() === 'eu' ? 'eu' : 'us';
  return apiKey && agentId ? { apiKey, agentId, region, ...REGIONS[region] } : null;
}

export const isElevenLabsConfigured = () => config() !== null;

async function get<T>(path: string, query: Record<string, string> = {}): Promise<T> {
  const c = config();
  if (!c) throw new Error('elevenlabs_not_configured');
  const url = new URL(path, c.api);
  for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v);
  const res = await fetch(url, { headers: { 'xi-api-key': c.apiKey }, cache: 'no-store' });
  if (!res.ok) throw new Error(`elevenlabs ${res.status} ${path}`);
  return (await res.json()) as T;
}

/** Voice: WebRTC conversation token (GET /v1/convai/conversation/token). */
export async function voiceSession() {
  const c = config()!;
  const r = await get<{ token: string; conversation_id?: string }>('/v1/convai/conversation/token', { agent_id: c.agentId });
  return { token: r.token, livekitUrl: c.livekit };
}

/** Text chat: signed WebSocket URL (GET /v1/convai/conversation/get-signed-url). */
export async function chatSession() {
  const c = config()!;
  const r = await get<{ signed_url: string }>('/v1/convai/conversation/get-signed-url', { agent_id: c.agentId });
  return { signedUrl: r.signed_url };
}

type Conversation = {
  agent_id: string;
  status: 'initiated' | 'in-progress' | 'processing' | 'done' | 'failed';
  transcript: { role: 'user' | 'agent'; message?: string | null }[];
  analysis?: {
    transcript_summary?: string;
    data_collection_results?: Record<string, { value?: unknown }>;
  } | null;
};

/**
 * A finished conversation with ElevenLabs' post-call analysis. The analysis runs
 * after the session ends, so this polls for a few seconds. Returns null if it is
 * not ready in time, or if the conversation belongs to another agent.
 */
export async function finishedConversation(conversationId: string, timeoutMs = 12_000) {
  const c = config();
  if (!c || !/^[\w-]{6,80}$/.test(conversationId)) return null;
  const until = Date.now() + timeoutMs;
  for (;;) {
    try {
      const conv = await get<Conversation>(`/v1/convai/conversations/${conversationId}`);
      if (conv.agent_id !== c.agentId) return null;
      if (conv.status === 'done' || conv.status === 'failed') return conv;
    } catch {
      // Not visible yet right after the session ends: retry.
    }
    if (Date.now() > until) return null;
    await new Promise((r) => setTimeout(r, 1500));
  }
}
