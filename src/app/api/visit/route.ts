import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getVisitorCount, recordVisitor } from "@/lib/visitors-db";

const VISITOR_COOKIE = "cnc_visitor";
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function GET() {
  const cookieStore = await cookies();

  if (cookieStore.get(VISITOR_COOKIE)) {
    const visitorCount = await getVisitorCount();
    return NextResponse.json({ counted: false, visitorCount });
  }

  const visitorCount = await recordVisitor();
  const response = NextResponse.json({ counted: true, visitorCount });

  response.cookies.set(VISITOR_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: VISITOR_COOKIE_MAX_AGE,
  });

  return response;
}
