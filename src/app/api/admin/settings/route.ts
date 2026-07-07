import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getSiteSettings, updateSiteSettings } from "@/lib/site-settings";
import { settingsSchema } from "@/lib/validations/admin";
import { z } from "zod";

export async function GET() {
  try {
    await requireAdmin();
    const settings = await getSiteSettings();
    return NextResponse.json({
      settings: {
        phone: settings.phone,
        phoneDisplay: settings.phoneDisplay,
        whatsapp: settings.whatsapp,
        email: settings.email,
        addressAr: settings.addressAr,
        addressEn: settings.addressEn,
        locationUrl: settings.locationUrl,
        instagramUrl: settings.social.instagram,
        twitterUrl: settings.social.twitter,
        facebookUrl: settings.social.facebook,
        snapchatUrl: settings.social.snapchat,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const data = settingsSchema.parse(body);
    const settings = await updateSiteSettings(data);
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
