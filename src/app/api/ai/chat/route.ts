import { getAiProvider } from "@/lib/ai/provider";
import { guardAiRequest, jsonError } from "@/lib/ai/guard";
import { buildAssistantPrompt } from "@/lib/ai/prompts/assistant";
import { retrieveContext } from "@/lib/ai/knowledge/retrieve";
import { containsSuspiciousPatterns, sanitizeMessages } from "@/lib/ai/sanitize";
import { chatRequestSchema } from "@/lib/validations/ai";
import { z } from "zod";

function sseData(payload: Record<string, unknown>): string {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

export async function POST(request: Request) {
  try {
    const guard = await guardAiRequest(request);
    if (!guard.ok) {
      return jsonError(guard.error, guard.status, { retryAfterMs: guard.retryAfterMs });
    }

    const body = await request.json();
    const cleaned = {
      ...body,
      messages: Array.isArray(body.messages)
        ? body.messages.filter(
            (m: { content?: string; image?: unknown }) =>
              (m.content?.trim().length ?? 0) > 0 || Boolean(m.image)
          )
        : [],
    };
    const { messages, locale } = chatRequestSchema.parse(cleaned);
    const sanitized = sanitizeMessages(messages);

    const lastUser = sanitized[sanitized.length - 1];
    if (!lastUser || lastUser.role !== "user") {
      return jsonError("INVALID_MESSAGES", 400);
    }

    if (lastUser.content && containsSuspiciousPatterns(lastUser.content)) {
      return jsonError("INVALID_INPUT", 400);
    }

    const queryText = sanitized.map((m) => m.content).join(" ");
    const ragContext = await retrieveContext(queryText, locale);
    const systemInstruction = buildAssistantPrompt(locale, ragContext);
    const provider = getAiProvider("gemini");

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of provider.streamChat({
            model: guard.settings.model,
            systemInstruction,
            messages: sanitized,
          })) {
            controller.enqueue(encoder.encode(sseData({ text: chunk })));
          }
          controller.enqueue(encoder.encode(sseData({ done: true })));
        } catch (error) {
          const code =
            error instanceof Error && error.message === "GEMINI_API_KEY_NOT_CONFIGURED"
              ? "AI_NOT_CONFIGURED"
              : "AI_ERROR";
          controller.enqueue(encoder.encode(sseData({ error: code })));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonError("INVALID_INPUT", 400, { details: error.issues });
    }
    return jsonError("SERVER_ERROR", 500);
  }
}
