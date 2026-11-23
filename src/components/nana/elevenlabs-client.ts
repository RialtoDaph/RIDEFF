'use client';

import type { TextConversation, VoiceConversation } from '@elevenlabs/client';
import type { Locale } from '@/i18n/routing';

/**
 * Browser side of Nana on ElevenLabs Agents. The server hands out a short-lived
 * credential (src/app/api/nana/*); the SDK is loaded only when a session starts.
 *
 * The agent must allow these per-session overrides (src/lib/nana/agent-config.ts
 * sets them): language, first message, text only.
 */
type Common = {
  /** Nana's session id: stored with the conversation so /api/nana/summary only reads this visitor's conversations. */
  sessionId: string;
  locale: Locale;
  page: string;
  onConnect: (conversationId: string) => void;
  onEnd: (reason: 'user' | 'agent' | 'error') => void;
  onError: (message: string) => void;
};

/**
 * Client tools the Nana agent can call (declared in src/lib/nana/agent-config.ts,
 * same names). They run in the visitor's browser and reuse the public booking
 * routes, so rate limits and the "only book what Cal.com offers" check apply.
 * Return values are short strings: the agent reads them out.
 */
function nanaTools(locale: Locale) {
  type Days = Record<string, { start: string; time: string }[]>;
  const getDays = async (): Promise<Days | null> => {
    try {
      const res = await fetch('/api/cal/slots');
      return res.ok ? ((await res.json()) as { days: Days }).days : null;
    } catch {
      return null;
    }
  };
  return {
    // Next free times of the 15-minute first call, Berlin time.
    check_free_slots: async (): Promise<string> => {
      const days = await getDays();
      if (!days) return 'unavailable: tell the visitor that Rialto will send a time personally, or they can use the Book a call button.';
      const dates = Object.keys(days).sort().slice(0, 3);
      if (!dates.length) return 'none: no free times in the next days. Offer the Book a call button or WhatsApp.';
      return dates.map((d) => `${d}: ${days[d].slice(0, 4).map((s) => s.time).join(', ')}`).join('\n') + '\n(Berlin time, 24-hour format)';
    },
    // Books one of the offered times. The visitor must have confirmed name, email and time.
    book_first_call: async (p: { name?: string; email?: string; date?: string; time?: string; need?: string }): Promise<string> => {
      const days = await getDays();
      const slot = days?.[p.date ?? '']?.find((s) => s.time === p.time);
      if (!days) return 'unavailable: booking is not possible right now. Offer the Book a call button.';
      if (!slot) return 'taken: that time is no longer free. Call check_free_slots again and offer new times.';
      try {
        const res = await fetch('/api/cal/book', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name: p.name ?? '', email: p.email ?? '', start: slot.start, need: p.need ?? '', locale }),
        });
        if (res.ok) return `booked: ${p.date} at ${p.time} Berlin time. A confirmation email goes to ${p.email}.`;
        const { error } = (await res.json().catch(() => ({}))) as { error?: string };
        if (error === 'email') return 'invalid_email: the email address was not valid. Ask the visitor to spell it again.';
        if (error === 'taken') return 'taken: that time was just booked. Call check_free_slots again.';
        if (error === 'rate_limited') return 'rate_limited: too many attempts. Offer the Book a call button.';
        return 'failed: booking did not work. Offer the Book a call button.';
      } catch {
        return 'failed: booking did not work. Offer the Book a call button.';
      }
    },
  };
}

export async function startVoice(
  o: Common & {
    token: string;
    livekitUrl: string;
    /** The typed chat so far ("Visitor: …" / "Nana: …" lines), or "". */
    chatContext: string;
    /** Replaces the formal greeting when the visitor already chatted. */
    firstMessage?: string;
    onLine: (who: 'nana' | 'you', text: string) => void;
    onMode: (mode: 'speaking' | 'listening') => void;
  },
): Promise<VoiceConversation> {
  const { Conversation } = await import('@elevenlabs/client');
  return Conversation.startSession({
    conversationToken: o.token,
    connectionType: 'webrtc',
    livekitUrl: o.livekitUrl,
    textOnly: false,
    stripAudioTags: true,
    clientTools: nanaTools(o.locale),
    overrides: { agent: { language: o.locale, ...(o.firstMessage ? { firstMessage: o.firstMessage } : {}) } },
    dynamicVariables: { page: o.page, locale: o.locale, chat_context: o.chatContext, session_id: o.sessionId },
    onConnect: ({ conversationId }) => o.onConnect(conversationId),
    onMessage: ({ source, message }) => message && o.onLine(source === 'ai' ? 'nana' : 'you', message),
    onModeChange: ({ mode }) => o.onMode(mode),
    onDisconnect: (d) => o.onEnd(d.reason),
    onError: (m) => o.onError(m),
  });
}

export async function startTextChat(
  o: Common & {
    signedUrl: string;
    onReply: (text: string) => void;
  },
): Promise<TextConversation> {
  const { Conversation } = await import('@elevenlabs/client');
  return Conversation.startSession({
    signedUrl: o.signedUrl,
    connectionType: 'websocket',
    textOnly: true,
    stripAudioTags: true,
    clientTools: nanaTools(o.locale),
    // No spoken-style greeting in the chat: Nana's greeting is already on screen.
    overrides: { agent: { language: o.locale, firstMessage: '' }, conversation: { textOnly: true } },
    dynamicVariables: { page: o.page, locale: o.locale, chat_context: '', session_id: o.sessionId },
    onConnect: ({ conversationId }) => o.onConnect(conversationId),
    onMessage: ({ source, message }) => source === 'ai' && message && o.onReply(message),
    onDisconnect: (d) => o.onEnd(d.reason),
    onError: (m) => o.onError(m),
  });
}

/** Show the "Book a call / WhatsApp" pills when the answer points to Rialto. */
export const suggestsContact = (text: string) => /rialto|whatsapp|termin|gespräch|anruf|call|book|buch/i.test(text);
