import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAllQuotes } from "@/lib/quotes-db";

export async function GET() {
  try {
    await requireAdmin();
    const quotes = await getAllQuotes();
    return NextResponse.json({ quotes });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
