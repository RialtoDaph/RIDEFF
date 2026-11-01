import { mockReply } from '@/lib/nana/mock';
import type { ChatMessage } from '@/lib/nana/types';
import { bad, locale, page, readJson, sessionId, str } from '@/lib/nana/validate';

export const runtime = 'nodejs';

/**
 * POST /api/nana/chat  { sessionId, page, locale, messages[] }
 * Streams the assistant text (text/plain). Optional actions ("book", "whatsapp")
 * come in the `x-nana-actions` header.
 *
 * MOCK: canned answers from the prototype. To wire a provider, replace
 * mockReply() with a streaming call and pipe its tokens into the stream below.
 */
export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return bad('bad_request');
  const sid = sessionId(body.sessionId);
  if (!sid) return bad('bad_session');
  const messages: ChatMessage[] = (Array.isArray(body.messages) ? body.messages : [])
    .slice(-20)
    .map((m: { role?: unknown; content?: unknown }) => ({ role: m?.role === 'assistant' ? 'assistant' : 'user', content: str(m?.content, 1000) }) as ChatMessage)
    .filter((m) => m.content);
  if (!messages.length) return bad('no_messages');
  void page(body.page); // used by the real prompt (page-specific context)

  const { text, actions } = await mockReply(locale(body.locale), messages);

  // Stream word by word, like a model would.
  const enc = new TextEncoder();
  const words = text.split(/(?<=\s)/);
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const w of words) {
        controller.enqueue(enc.encode(w));
        await new Promise((r) => setTimeout(r, 25));
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'x-nana-actions': actions.join(','),
      'x-nana-mock': '1',
    },
  });
}
