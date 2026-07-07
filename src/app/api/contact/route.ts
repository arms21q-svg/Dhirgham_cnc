import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validations/admin";
import { getClientIp } from "@/lib/get-client-ip";
import { notifyContactSubmission, safeNotify } from "@/lib/whatsapp-notify";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit("contact", ip, 5, 60_000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
    }

    const body = await request.json();
    const data = contactSchema.parse(body);

    if (data._hp?.trim()) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        message: data.message,
      },
    });

    void safeNotify(() => notifyContactSubmission(data));

    revalidatePath("/admin");
    revalidatePath("/admin/messages");

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
