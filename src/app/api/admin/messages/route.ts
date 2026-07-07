import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAllContactMessages } from "@/lib/messages-db";

export async function GET() {
  try {
    await requireAdmin();
    const messages = await getAllContactMessages();
    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
