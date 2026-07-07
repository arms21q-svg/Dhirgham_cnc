import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAiSettings, isAiConfigured } from "@/lib/ai/settings";
import { analyzeDesignImage } from "@/lib/ai/generate";
import { analyzeDesignSchema } from "@/lib/validations/ai";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    if (!isAiConfigured()) {
      return NextResponse.json({ error: "AI_NOT_CONFIGURED" }, { status: 503 });
    }

    const settings = await getAiSettings();
    const body = await request.json();
    const data = analyzeDesignSchema.parse(body);
    const analysis = await analyzeDesignImage(settings.model, data.imageUrl, data.locale);

    return NextResponse.json({ analysis });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.issues }, { status: 400 });
    }
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "AI_ERROR" }, { status: 500 });
  }
}
