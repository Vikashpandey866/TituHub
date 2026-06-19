import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { findSession, publicUser } from "@/lib/serverAuthStore";

export const ADMIN_SESSION_COOKIE = "tituhub_session";

export function getAdminSessionFromCookies() {
  const sessionId = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  const result = findSession(sessionId);
  if (!result || result.user.role !== "admin") return null;
  return { ...result, publicUser: publicUser(result.user) };
}

export function requireAdminRequest(request) {
  const sessionId = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const result = findSession(sessionId);
  if (!result || result.user.role !== "admin") {
    return {
      ok: false,
      response: NextResponse.json({ ok: false, error: "Admin access required" }, { status: 403 })
    };
  }
  return { ok: true, ...result };
}
