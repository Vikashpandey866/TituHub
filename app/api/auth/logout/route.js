import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";
import { deleteSession } from "@/lib/serverAuthStore";

export async function POST(request) {
  const sessionId = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (sessionId) deleteSession(sessionId);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
  return response;
}
