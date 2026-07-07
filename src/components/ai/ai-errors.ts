const AI_ERROR_KEYS = [
  "AI_ERROR",
  "AI_DISABLED",
  "AI_NOT_CONFIGURED",
  "RATE_LIMITED",
  "INVALID_INPUT",
  "SERVER_ERROR",
] as const;

type AiErrorKey = (typeof AI_ERROR_KEYS)[number];

export function resolveAiErrorKey(code: string | null): AiErrorKey {
  if (code && AI_ERROR_KEYS.includes(code as AiErrorKey)) {
    return code as AiErrorKey;
  }
  return "AI_ERROR";
}
