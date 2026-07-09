export function getGeminiApiKey(): string | null {
  const key = process.env.GEMINI_API_KEY?.trim();
  return key ? key : null;
}

export function isGeminiApiKeyConfigured(): boolean {
  return Boolean(getGeminiApiKey());
}

export type GeminiApiKeyDiagnostics = {
  configured: boolean;
  length: number;
  maskedPreview: string;
  looksLikeGoogleAiStudioKey: boolean;
  looksLikeOAuthToken: boolean;
  runtime: "vercel" | "local" | "unknown";
  nodeEnv: string;
};

export function getGeminiApiKeyDiagnostics(): GeminiApiKeyDiagnostics {
  const key = getGeminiApiKey() ?? "";
  const maskedPreview = key
    ? `${key.slice(0, 4)}...${key.slice(-4)}`
    : "(missing)";

  return {
    configured: key.length > 0,
    length: key.length,
    maskedPreview,
    looksLikeGoogleAiStudioKey: key.startsWith("AIza"),
    looksLikeOAuthToken: key.startsWith("AQ."),
    runtime: process.env.VERCEL ? "vercel" : process.env.NODE_ENV ? "local" : "unknown",
    nodeEnv: process.env.NODE_ENV ?? "unknown",
  };
}

export function validateGeminiApiKeyFormat(): string | null {
  const key = getGeminiApiKey();
  if (!key) return "GEMINI_API_KEY is not set";
  if (key.startsWith("AQ.")) {
    return "GEMINI_API_KEY looks like an OAuth token (AQ.*). Use a Google AI Studio API key (starts with AIza).";
  }
  if (!key.startsWith("AIza") && key.length < 20) {
    return "GEMINI_API_KEY format looks invalid (expected Google AI Studio key starting with AIza).";
  }
  return null;
}
