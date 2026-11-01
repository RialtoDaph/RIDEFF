import 'server-only';
import { createHash } from 'node:crypto';
import { AGENT_NAME, agentPayload } from './agent-config';

/**
 * ElevenLabs Agents (Nana's voice and chat brain). Server side only: the API key
 * never reaches the browser. The browser gets a short-lived credential per
 * session and talks to ElevenLabs directly with @elevenlabs/client.
 *
 * Env (Vercel → Project → Settings → Environment Variables):
 *   ELEVENLABS_API_KEY   API key, restricted to ElevenAgents: Write (+ Voices: Read)
 *   NANA_VOICE_ID        the voice (optional; tuning vars in ./agent-config.ts)
 *   ELEVENLABS_REGION    "eu" for EU data residency (needs an EU-residency workspace), default "us"
 *   ELEVENLABS_AGENT_ID  optional: use an agent managed by hand in the dashboard instead
 *
 * Without ELEVENLABS_AGENT_ID the agent is managed from code: the first session
 * finds the agent named "Nana · rideff.com" (or creates it) and updates it when
 * ./agent-config.ts or the voice env vars change (tracked by a hash tag).
 * Without an API key the Nana routes fall back to their mock answers.
 */
const REGIONS = {
  us: { api: 'https://api.elevenlabs.io', livekit: 'wss://livekit.rtc.elevenlabs.io' },
  eu: { api: 'https://api.eu.residency.elevenlabs.io', livekit: 'wss://livekit.rtc.eu.residency.elevenlabs.io' },
} as const;

function config() {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!apiKey) return null;
  const region = process.env.ELEVENLABS_REGION?.trim().toLowerCase() === 'eu' ? 'eu' : 'us';
  return { apiKey, fixedAgentId: process.env.ELEVENLABS_AGENT_ID?.trim() || null, ...REGIONS[region] };
}

export const isElevenLabsConfigured = () => config() !== null;

async function call<T>(method: 'GET' | 'POST' | 'PATCH', path: string, opts: { query?: Record<string, string>; body?: unknown } = {}): Promise<T> {
  const c = config();
  if (!c) throw new Error('elevenlabs_not_configured');
  const url = new URL(path, c.api);
  for (const [k, v] of Object.entries(opts.query ?? {})) url.searchParams.set(k, v);
  const res = await fetch(url, {
    method,
    headers: { 'xi-api-key': c.apiKey, ...(opts.body ? { 'content-type': 'application/json' } : {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    cache: 'no-store',
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`elevenlabs ${res.status} ${method} ${path}: ${detail.slice(0, 300)}`);
  }
  return (await res.json()) as T;
}

type AgentSummary = { agent_id: string; name: string; tags?: string[]; created_at_unix_secs?: number; archived?: boolean };

/** Finds, creates or updates the Nana agent; returns its id. */
async function provisionAgent(): Promise<string> {
  const payload = agentPayload();
  const tag = 'rideff-cfg-' + createHash('sha256').update(JSON.stringify(payload)).digest('hex').slice(0, 12);
  const body = { ...payload, tags: [tag] };

  const list = await call<{ agents: AgentSummary[] }>('GET', '/v1/convai/agents', { query: { search: AGENT_NAME, page_size: '30' } });
  // Oldest exact match wins, should two instances ever have created one at the same time.
  const agent = list.agents
    .filter((a) => a.name === AGENT_NAME && !a.archived)
    .sort((a, b) => (a.created_at_unix_secs ?? 0) - (b.created_at_unix_secs ?? 0))[0];

  if (!agent) {
    const created = await call<{ agent_id: string }>('POST', '/v1/convai/agents/create', { body });
    console.info(`nana: created ElevenLabs agent ${created.agent_id}`);
    return created.agent_id;
  }
  if (!agent.tags?.includes(tag)) {
    try {
      await call('PATCH', `/v1/convai/agents/${agent.agent_id}`, { body });
      console.info(`nana: updated ElevenLabs agent ${agent.agent_id} (${tag})`);
    } catch (e) {
      // Keep serving with the current agent; the next cold start tries again.
      console.error('nana: agent update failed', e);
    }
  }
  return agent.agent_id;
}

let agentIdPromise: Promise<string> | null = null;

/** The agent id: ELEVENLABS_AGENT_ID, or the code-managed agent (cached per server instance). */
export async function agentId(): Promise<string> {
  const c = config();
  if (!c) throw new Error('elevenlabs_not_configured');
  if (c.fixedAgentId) return c.fixedAgentId;
  agentIdPromise ??= provisionAgent().catch((e) => {
    agentIdPromise = null; // retry on the next request
    throw e;
  });
  return agentIdPromise;
}

/** Voice: WebRTC conversation token (GET /v1/convai/conversation/token). */
export async function voiceSession() {
  const c = config()!;
  const r = await call<{ token: string }>('GET', '/v1/convai/conversation/token', { query: { agent_id: await agentId() } });
  return { token: r.token, livekitUrl: c.livekit };
}

/** Text chat: signed WebSocket URL (GET /v1/convai/conversation/get-signed-url). */
export async function chatSession() {
  const r = await call<{ signed_url: string }>('GET', '/v1/convai/conversation/get-signed-url', { query: { agent_id: await agentId() } });
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
  if (!config() || !/^[\w-]{6,80}$/.test(conversationId)) return null;
  const id = await agentId().catch(() => null);
  if (!id) return null;
  const until = Date.now() + timeoutMs;
  for (;;) {
    try {
      const conv = await call<Conversation>('GET', `/v1/convai/conversations/${conversationId}`);
      if (conv.agent_id !== id) return null;
      if (conv.status === 'done' || conv.status === 'failed') return conv;
    } catch {
      // Not visible yet right after the session ends: retry.
    }
    if (Date.now() > until) return null;
    await new Promise((r) => setTimeout(r, 1500));
  }
}
