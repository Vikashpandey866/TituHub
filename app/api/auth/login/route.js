import { NextResponse } from "next/server";
import { createSession, findPendingUser, findUser, publicUser, verifyPassword } from "@/lib/serverAuthStore";
import { ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";
import { listAdminData } from "@/lib/adminDataStore";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return NextResponse.json({ ok: false, error: "Email and password are required" }, { status: 400 });
    console.info("[Login Attempt]", { email: String(email).trim().toLowerCase() });
    const user = findUser(email);
    if (!user && findPendingUser(email)) {
      console.warn("[Login Blocked]", { email: String(email).trim().toLowerCase(), reason: "pending_verification" });
      return NextResponse.json({ ok: false, unverified: true, error: "Please verify your email before logging in." }, { status: 403 });
    }
    if (!user || !verifyPassword(password, user.passwordHash)) {
      console.warn("[Login Blocked]", { email: String(email).trim().toLowerCase(), reason: "invalid_credentials" });
      return NextResponse.json({ ok: false, error: "Invalid email or password" }, { status: 401 });
    }
    if (listAdminData().blockedUsers.includes(String(email).trim().toLowerCase())) {
      console.warn("[Login Blocked]", { email: String(email).trim().toLowerCase(), reason: "blocked_user" });
      return NextResponse.json({ ok: false, error: "This account has been blocked. Please contact support." }, { status: 403 });
    }
    if (!user.isVerified) {
      console.warn("[Login Blocked]", { email: String(email).trim().toLowerCase(), reason: "unverified_user" });
      return NextResponse.json({ ok: false, unverified: true, error: "Please verify your email before logging in." }, { status: 403 });
    }
    const response = NextResponse.json({ ok: true, user: publicUser(user) });
    const session = createSession(user);
    response.cookies.set(ADMIN_SESSION_COOKIE, session.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(session.expiresAt)
    });
    return response;
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
