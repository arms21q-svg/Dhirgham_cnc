import { guardAiRequest, jsonError } from "@/lib/ai/guard";
import { searchKnowledge } from "@/lib/ai/knowledge/retrieve";
import { searchRequestSchema } from "@/lib/validations/ai";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const guard = await guardAiRequest(request);
    if (!guard.ok) {
      return jsonError(guard.error, guard.status, { retryAfterMs: guard.retryAfterMs });
    }

    const body = await request.json();
    const { query, limit } = searchRequestSchema.parse(body);
    const results = await searchKnowledge(query, limit);

    return Response.json({ results });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonError("INVALID_INPUT", 400, { details: error.issues });
    }
    return jsonError("SERVER_ERROR", 500);
  }
}
