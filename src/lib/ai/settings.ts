import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DEFAULT_AI_MODEL } from "@/lib/ai/config";

export type AiSettingsRecord = {
  enabled: boolean;
  model: string;
};

export type PublicAiSettings = {
  enabled: boolean;
};

const defaults: AiSettingsRecord = {
  enabled: false,
  model: DEFAULT_AI_MODEL,
};

async function fetchAiSettings(): Promise<AiSettingsRecord> {
  try {
    const row = await prisma.aiSettings.findUnique({ where: { id: 1 } });
    if (!row) return defaults;
    return { enabled: row.enabled, model: row.model };
  } catch {
    return defaults;
  }
}

const getCachedAiSettings = unstable_cache(fetchAiSettings, ["ai-settings"], {
  revalidate: 120,
  tags: ["ai-settings"],
});

export async function getAiSettings(): Promise<AiSettingsRecord> {
  return getCachedAiSettings();
}

export async function getPublicAiSettings(): Promise<PublicAiSettings> {
  const settings = await getAiSettings();
  return { enabled: settings.enabled };
}

export type AiSettingsInput = {
  enabled: boolean;
  model: string;
};

export async function updateAiSettings(data: AiSettingsInput) {
  const result = await prisma.aiSettings.upsert({
    where: { id: 1 },
    create: { id: 1, ...data },
    update: data,
  });
  revalidateTag("ai-settings", "max");
  return result;
}

export function isAiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}
