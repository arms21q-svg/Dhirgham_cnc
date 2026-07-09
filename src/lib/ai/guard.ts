import {
  getAiRuntimeDiagnostics,
  getAiSettings,
  isAiConfigured,
} from "@/lib/ai/settings";
import { checkAiRateLimit } from "@/lib/ai/rate-limit";
import { getGeminiApiKeyDiagnostics, validateGeminiApiKeyFormat } from "@/lib/ai/env";
import { createAiRequestId, logAiEvent } from "@/lib/ai/logger";
import { getClientIp } from "@/lib/get-client-ip";

type AiGuardResult =
  | { ok: true; settings: Awaited<ReturnType<typeof getAiSettings>>; ip: string; requestId: string }
  | { ok: false; error: string; status: number; requestId: string; retryAfterMs?: number };

export async function guardAiRequest(request: Request): Promise<AiGuardResult> {
  const requestId = createAiRequestId();
  const ip = getClientIp(request);
  const keyDiagnostics = getGeminiApiKeyDiagnostics();
  const keyFormatWarning = validateGeminiApiKeyFormat();

  logAiEvent("request_received", {
    requestId,
    ip,
    path: new URL(request.url).pathname,
    method: request.method,
    keyConfigured: keyDiagnostics.configured,
    keyPreview: keyDiagnostics.maskedPreview,
    runtime: keyDiagnostics.runtime,
    keyFormatWarning,
  });

  const settings = await getAiSettings();

  logAiEvent("request_settings", {
    requestId,
    enabled: settings.enabled,
    model: settings.model,
    keyConfigured: isAiConfigured(),
  });

  if (!settings.enabled) {
    logAiEvent("request_blocked", { requestId, reason: "AI_DISABLED" }, "warn");
    return { ok: false, error: "AI_DISABLED", status: 403, requestId };
  }

  if (!isAiConfigured()) {
    logAiEvent("request_blocked", { requestId, reason: "AI_NOT_CONFIGURED" }, "error");
    return { ok: false, error: "AI_NOT_CONFIGURED", status: 503, requestId };
  }

  if (keyFormatWarning) {
    logAiEvent("request_key_format_warning", { requestId, warning: keyFormatWarning }, "warn");
  }

  const rate = checkAiRateLimit(ip);
  if (!rate.allowed) {
    logAiEvent(
      "request_blocked",
      { requestId, reason: "RATE_LIMITED", retryAfterMs: rate.retryAfterMs },
      "warn"
    );
    return {
      ok: false,
      error: "RATE_LIMITED",
      status: 429,
      requestId,
      retryAfterMs: rate.retryAfterMs,
    };
  }

  logAiEvent("request_allowed", { requestId, model: settings.model, ip });
  return { ok: true, settings, ip, requestId };
}

export function jsonError(error: string, status: number, extra?: Record<string, unknown>) {
  return Response.json({ error, ...extra }, { status });
}

export async function getAiGuardDiagnostics() {
  const [settings, runtime] = await Promise.all([getAiSettings(), getAiRuntimeDiagnostics()]);
  return {
    settings,
    runtime,
    publicEnabled: settings.enabled && isAiConfigured(),
  };
}
