import { getAiSettings, isAiConfigured } from "@/lib/ai/settings";
import { checkAiRateLimit } from "@/lib/ai/rate-limit";
import { getClientIp } from "@/lib/get-client-ip";

type AiGuardResult =
  | { ok: true; settings: Awaited<ReturnType<typeof getAiSettings>>; ip: string }
  | { ok: false; error: string; status: number; retryAfterMs?: number };

export async function guardAiRequest(request: Request): Promise<AiGuardResult> {
  const settings = await getAiSettings();

  if (!settings.enabled) {
    return { ok: false, error: "AI_DISABLED", status: 403 };
  }

  if (!isAiConfigured()) {
    return { ok: false, error: "AI_NOT_CONFIGURED", status: 503 };
  }

  const ip = getClientIp(request);
  const rate = checkAiRateLimit(ip);
  if (!rate.allowed) {
    return {
      ok: false,
      error: "RATE_LIMITED",
      status: 429,
      retryAfterMs: rate.retryAfterMs,
    };
  }

  return { ok: true, settings, ip };
}

export function jsonError(error: string, status: number, extra?: Record<string, unknown>) {
  return Response.json({ error, ...extra }, { status });
}
