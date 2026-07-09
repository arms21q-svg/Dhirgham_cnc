import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { AI_MODELS } from "@/lib/ai/config";
import { getAiGuardDiagnostics } from "@/lib/ai/guard";
import { getAiSettings, isAiConfigured, updateAiSettings } from "@/lib/ai/settings";
import { logAiEvent } from "@/lib/ai/logger";
import { aiSettingsSchema } from "@/lib/validations/ai";
import { z } from "zod";

export async function GET() {
  try {
    await requireAdmin();
    const [settings, diagnostics] = await Promise.all([
      getAiSettings(),
      getAiGuardDiagnostics(),
    ]);

    logAiEvent("admin_settings_read", {
      enabled: settings.enabled,
      apiKeyConfigured: isAiConfigured(),
      dbAvailable: diagnostics.runtime.dbAvailable,
      keyFormatWarning: diagnostics.runtime.keyFormatWarning,
    });

    return NextResponse.json({
      settings,
      models: AI_MODELS,
      apiKeyConfigured: isAiConfigured(),
      diagnostics: diagnostics.runtime,
      publicEnabled: diagnostics.publicEnabled,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const data = aiSettingsSchema.parse(body);
    const settings = await updateAiSettings(data);
    return NextResponse.json({ settings });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.issues }, { status: 400 });
    }
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
