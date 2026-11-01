/**
 * Nana API contract (rideff_handoff/README.md → "Suggested API contract").
 * Voice and chat run on an ElevenLabs agent when ELEVENLABS_API_KEY is set
 * (src/lib/nana/elevenlabs.ts, agent defined in ./agent-config.ts); otherwise the
 * routes answer with mock data. WhatsApp Business is still a mock (TODO.md).
 */
import type { Locale } from '@/i18n/routing';

export type NanaPage = 'home' | 'pricing' | 'work' | 'life' | 'contact';
export type NanaAction = 'book' | 'whatsapp';
export type ChatMessage = { role: 'user' | 'assistant'; content: string };

/** POST /api/nana/chat → streamed text/plain; actions in the `x-nana-actions` header. */
export type ChatRequest = { sessionId: string; page: NanaPage; locale: Locale; messages: ChatMessage[] };

/** POST /api/nana/voice/session */
export type VoiceSessionRequest = { sessionId: string; locale: Locale; page: NanaPage };
export type VoiceSessionResponse =
  | {
      provider: 'elevenlabs';
      /** WebRTC conversation token for @elevenlabs/client (short-lived). */
      token: string;
      /** LiveKit endpoint of the configured region (EU residency or default). */
      livekitUrl: string;
    }
  | {
      provider: 'mock';
      token: null;
      /** The scripted conversation the call panel plays. */
      script: { who: 'nana' | 'you'; text: string }[];
    };

/** POST /api/nana/chat/session → a text-only session with the same agent, or mock mode. */
export type ChatSessionResponse = { provider: 'elevenlabs'; signedUrl: string } | { provider: 'mock' };

/** POST /api/nana/summary */
export type SummaryRequest = {
  sessionId: string;
  locale: Locale;
  kind: 'call' | 'chat';
  /** Call length in seconds (call) or number of user questions (chat). */
  duration: number;
  transcript: { from: 'nana' | 'you'; text: string }[];
  /** "Save the transcript and summary to my RIDEFF client portal." */
  consent: boolean;
  /** ElevenLabs conversation id: the summary then uses ElevenLabs' post-call analysis. */
  conversationId?: string;
};
export type SummaryResponse = {
  kind: string;
  duration: string;
  need: string;
  interest: string;
  next: string;
  /** WhatsApp message (template in the README), with *bold* and _italic_. */
  text: string;
  /** True once the transcript is stored in Supabase for the portal (never in mock mode). */
  stored: boolean;
};

/** POST /api/nana/whatsapp — WhatsApp Business template message, only after explicit opt-in. */
export type WhatsAppRequest = { sessionId: string; phone: string; text: string; optIn: boolean };
export type WhatsAppResponse = { ok: boolean; mock?: boolean; error?: string };
