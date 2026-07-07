import { geminiProvider } from "@/lib/ai/providers/gemini";
import type { AiProvider } from "@/lib/ai/types";

export type AiProviderId = "gemini";

const providers: Record<AiProviderId, AiProvider> = {
  gemini: geminiProvider,
};

export function getAiProvider(id: AiProviderId = "gemini"): AiProvider {
  return providers[id];
}
