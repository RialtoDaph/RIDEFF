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
  locale: Locale;
  page: string;
  onConnect: (conversationId: string) => void;
  onEnd: (reason: 'user' | 'agent' | 'error') => void;
  onError: (message: string) => void;
};

export async function startVoice(
  o: Common & {
    token: string;
    livekitUrl: string;
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
    overrides: { agent: { language: o.locale } },
    dynamicVariables: { page: o.page, locale: o.locale },
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
    // No spoken-style greeting in the chat: Nana's greeting is already on screen.
    overrides: { agent: { language: o.locale, firstMessage: '' }, conversation: { textOnly: true } },
    dynamicVariables: { page: o.page, locale: o.locale },
    onConnect: ({ conversationId }) => o.onConnect(conversationId),
    onMessage: ({ source, message }) => source === 'ai' && message && o.onReply(message),
    onDisconnect: (d) => o.onEnd(d.reason),
    onError: (m) => o.onError(m),
  });
}

/** Show the "Book a call / WhatsApp" pills when the answer points to Rialto. */
export const suggestsContact = (text: string) => /rialto|whatsapp|termin|gespräch|anruf|call|book|buch/i.test(text);
