import { guardAiRequest, jsonError } from "@/lib/ai/guard";
import { searchKnowledge } from "@/lib/ai/knowledge/retrieve";
import { logAiError, logAiEvent } from "@/lib/ai/logger";
import { searchRequestSchema } from "@/lib/validations/ai";
import { z } from "zod";

export async function POST(request: Request) {
  const guard = await guardAiRequest(request);
  const requestId = guard.requestId;

  try {
    if (!guard.ok) {
      logAiEvent("search_rejected", { requestId, error: guard.error, status: guard.status }, "warn");
      return jsonError(guard.error, guard.status, { retryAfterMs: guard.retryAfterMs, requestId });
    }

    const body = await request.json();
    const { query, limit } = searchRequestSchema.parse(body);
    const results = await searchKnowledge(query, limit);

    logAiEvent("search_success", {
      requestId,
      queryLength: query.length,
      resultCount: results.length,
    });

    return Response.json({ results, requestId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logAiEvent("search_validation_error", { requestId }, "warn");
      return jsonError("INVALID_INPUT", 400, { details: error.issues, requestId });
    }
    logAiError("search_unhandled_error", error, { requestId });
    return jsonError("SERVER_ERROR", 500, { requestId });
  }
}
