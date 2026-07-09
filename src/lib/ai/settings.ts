import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DEFAULT_AI_MODEL } from "@/lib/ai/config";
import {
  getGeminiApiKeyDiagnostics,
  isGeminiApiKeyConfigured,
  validateGeminiApiKeyFormat,
} from "@/lib/ai/env";
import { logAiEvent } from "@/lib/ai/logger";

export type AiSettingsRecord = {
  enabled: boolean;
  model: string;
};

export type PublicAiSettings = {
  enabled: boolean;
};

export type AiRuntimeDiagnostics = {
  apiKey: ReturnType<typeof getGeminiApiKeyDiagnostics>;
  keyFormatWarning: string | null;
  dbAvailable: boolean;
  settingsSource: "database" | "env_fallback" | "defaults";
  forceEnableEnv: boolean;
};

function envForceEnableAi() {
  return process.env.AI_ENABLED === "true";
}

async function fetchAiSettings(): Promise<AiSettingsRecord> {
  const keyConfigured = isGeminiApiKeyConfigured();
  const forceEnable = envForceEnableAi();

  try {
    const row = await prisma.aiSettings.findUnique({ where: { id: 1 } });
    if (!row) {
      const enabled = keyConfigured && (forceEnable || process.env.VERCEL === "1");
      logAiEvent("settings_no_row", {
        enabled,
        keyConfigured,
        forceEnable,
        vercel: Boolean(process.env.VERCEL),
      });
      return {
        enabled,
        model: DEFAULT_AI_MODEL,
      };
    }

    const enabled = forceEnable ? true : row.enabled;
    logAiEvent("settings_loaded", {
      enabled,
      model: row.model,
      source: "database",
      forceEnable,
    });

    return {
      enabled,
      model: row.model || DEFAULT_AI_MODEL,
    };
  } catch (error) {
    const enabled = keyConfigured && (forceEnable || process.env.VERCEL === "1");
    logAiEvent(
      "settings_db_error",
      {
        enabled,
        keyConfigured,
        forceEnable,
        message: error instanceof Error ? error.message : String(error),
      },
      "warn"
    );

    return {
      enabled,
      model: DEFAULT_AI_MODEL,
    };
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
  return { enabled: settings.enabled && isGeminiApiKeyConfigured() };
}

export async function getAiRuntimeDiagnostics(): Promise<AiRuntimeDiagnostics> {
  const apiKey = getGeminiApiKeyDiagnostics();
  const keyFormatWarning = validateGeminiApiKeyFormat();
  let dbAvailable = false;
  let settingsSource: AiRuntimeDiagnostics["settingsSource"] = "defaults";

  try {
    const row = await prisma.aiSettings.findUnique({ where: { id: 1 } });
    dbAvailable = true;
    settingsSource = row ? "database" : "env_fallback";
  } catch {
    dbAvailable = false;
    settingsSource = "env_fallback";
  }

  return {
    apiKey,
    keyFormatWarning,
    dbAvailable,
    settingsSource,
    forceEnableEnv: envForceEnableAi(),
  };
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
  logAiEvent("settings_updated", { enabled: data.enabled, model: data.model });
  return result;
}

export function isAiConfigured(): boolean {
  return isGeminiApiKeyConfigured();
}
