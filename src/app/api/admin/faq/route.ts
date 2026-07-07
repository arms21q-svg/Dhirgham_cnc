import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createFaq, getAllFaqsAdmin } from "@/lib/faq-db";
import { faqSchema } from "@/lib/validations/admin";

export async function GET() {
  try {
    await requireAdmin();
    const faqs = await getAllFaqsAdmin();
    return NextResponse.json({ faqs });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const data = faqSchema.parse(body);
    const faq = await createFaq(data);
    return NextResponse.json({ faq }, { status: 201 });
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
