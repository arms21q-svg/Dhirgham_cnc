import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { checkRateLimit } from "@/lib/rate-limit";
import { createQuoteRequest } from "@/lib/quotes-db";
import { quoteSchema } from "@/lib/validations/admin";
import { getClientIp } from "@/lib/get-client-ip";
import { notifyQuoteSubmission, safeNotify } from "@/lib/whatsapp-notify";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit("quote", ip, 5, 60_000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
    }

    const body = await request.json();
    const data = quoteSchema.parse(body);

    if (data._hp?.trim()) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const { _hp: _honeypot, ...quoteData } = data;
    void _honeypot;
    await createQuoteRequest(quoteData);

    void safeNotify(() => notifyQuoteSubmission(quoteData));

    revalidatePath("/admin");
    revalidatePath("/admin/quotes");

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
