import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import {
  getAllHeroSlidesAdmin,
  getHomePageSettings,
  updateHomePageSettings,
} from "@/lib/homepage-db";
import { homePageSettingsSchema } from "@/lib/validations/admin";

export async function GET() {
  try {
    await requireAdmin();
    const [settings, slides] = await Promise.all([
      getHomePageSettings(),
      getAllHeroSlidesAdmin(),
    ]);
    return NextResponse.json({ settings, slides });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const data = homePageSettingsSchema.parse(body);
    const settings = await updateHomePageSettings(data);
    return NextResponse.json({ settings });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
