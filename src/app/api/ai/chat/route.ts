import { getAiProvider } from "@/lib/ai/provider";
import { guardAiRequest, jsonError } from "@/lib/ai/guard";
import { buildAssistantPrompt } from "@/lib/ai/prompts/assistant";
import { retrieveContext } from "@/lib/ai/knowledge/retrieve";
import { containsSuspiciousPatterns, sanitizeMessages } from "@/lib/ai/sanitize";
import { logAiError, logAiEvent } from "@/lib/ai/logger";
import { chatRequestSchema } from "@/lib/validations/ai";
import { z } from "zod";

function sseData(payload: Record<string, unknown>): string {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

export async function POST(request: Request) {
  const guard = await guardAiRequest(request);
  const requestId = guard.requestId;

  try {
    if (!guard.ok) {
      logAiEvent(
        "chat_rejected",
        { requestId, error: guard.error, status: guard.status },
        guard.status >= 500 ? "error" : "warn"
      );
      return jsonError(guard.error, guard.status, {
        retryAfterMs: guard.retryAfterMs,
        requestId,
      });
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

    logAiEvent("chat_parsed", {
      requestId,
      locale,
      messageCount: sanitized.length,
      lastRole: sanitized[sanitized.length - 1]?.role,
    });

    const lastUser = sanitized[sanitized.length - 1];
    if (!lastUser || lastUser.role !== "user") {
      logAiEvent("chat_invalid_messages", { requestId }, "warn");
      return jsonError("INVALID_MESSAGES", 400, { requestId });
    }

    if (lastUser.content && containsSuspiciousPatterns(lastUser.content)) {
      logAiEvent("chat_suspicious_input", { requestId }, "warn");
      return jsonError("INVALID_INPUT", 400, { requestId });
    }

    const queryText = sanitized.map((m) => m.content).join(" ");
    const ragContext = await retrieveContext(queryText, locale);
    const systemInstruction = buildAssistantPrompt(locale, ragContext);
    const provider = getAiProvider("gemini");

    logAiEvent("chat_stream_begin", {
      requestId,
      model: guard.settings.model,
      locale,
      ragContextLength: ragContext.length,
    });

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
          controller.enqueue(encoder.encode(sseData({ done: true, requestId })));
          logAiEvent("chat_stream_complete", { requestId });
        } catch (error) {
          const code =
            error instanceof Error && error.message === "GEMINI_API_KEY_NOT_CONFIGURED"
              ? "AI_NOT_CONFIGURED"
              : "AI_ERROR";
          logAiError("chat_stream_failed", error, { requestId, code });
          controller.enqueue(encoder.encode(sseData({ error: code, requestId })));
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
        "X-AI-Request-Id": requestId,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logAiEvent("chat_validation_error", { requestId, issues: error.issues.length }, "warn");
      return jsonError("INVALID_INPUT", 400, { details: error.issues, requestId });
    }
    logAiError("chat_unhandled_error", error, { requestId });
    return jsonError("SERVER_ERROR", 500, { requestId });
  }
}
