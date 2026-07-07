import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAiSettings, isAiConfigured } from "@/lib/ai/settings";
import { generateProjectContent } from "@/lib/ai/generate";
import { generateProjectSchema } from "@/lib/validations/ai";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    if (!isAiConfigured()) {
      return NextResponse.json({ error: "AI_NOT_CONFIGURED" }, { status: 503 });
    }

    const settings = await getAiSettings();
    const body = await request.json();
    const data = generateProjectSchema.parse(body);
    const result = await generateProjectContent(settings.model, data);

    return NextResponse.json({ result });
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
