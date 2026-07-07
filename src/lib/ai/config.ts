import type { AiModelOption } from "@/lib/ai/types";

export const AI_MODELS: AiModelOption[] = [
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { id: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" },
  { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
];

export const DEFAULT_AI_MODEL = AI_MODELS[0].id;

export const AI_LIMITS = {
  maxMessageLength: 2000,
  maxMessagesPerRequest: 20,
  maxRequestsPerWindow: 30,
  rateLimitWindowMs: 60_000,
  maxImageBytes: 4 * 1024 * 1024,
  allowedImageTypes: ["image/jpeg", "image/png", "image/webp"] as const,
} as const;

export function isAllowedModel(model: string): boolean {
  return AI_MODELS.some((m) => m.id === model);
}
