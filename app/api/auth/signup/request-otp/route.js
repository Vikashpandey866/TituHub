import { NextResponse } from "next/server";
import { createOtpRecord, createPendingUser, normalizeEmail, removeAuthChallenge } from "@/lib/serverAuthStore";
import { maskEmail, sendOtpEmail } from "@/lib/otpMailer";

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email));
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, email, mobile, password, confirmPassword } = body;
    if (!fullName || !email || !mobile || !password || !confirmPassword) {
      return NextResponse.json({ ok: false, error: "All fields are required" }, { status: 400 });
    }
    if (!validEmail(email)) return NextResponse.json({ ok: false, error: "Enter a valid email" }, { status: 400 });
    if (password !== confirmPassword) return NextResponse.json({ ok: false, error: "Passwords do not match" }, { status: 400 });
    if (String(password).length < 8) return NextResponse.json({ ok: false, error: "Password must be at least 8 characters" }, { status: 400 });

    const pending = createPendingUser({ fullName, email, mobile, password });
    if (!pending.ok) return NextResponse.json(pending, { status: 409 });

    const { otp } = createOtpRecord(email, "signup");
    let emailResult;
    try {
      emailResult = await sendOtpEmail({ email: normalizeEmail(email), otp, purpose: "signup" });
    } catch (error) {
      removeAuthChallenge(email, "signup");
      console.error("[OTP Sent Failure]", { email: normalizeEmail(email), reason: error.message });
      return NextResponse.json({ ok: false, error: "Failed to send verification email. Please try again." }, { status: 502 });
    }
    return NextResponse.json({
      ok: true,
      email: normalizeEmail(email),
      maskedEmail: maskEmail(email),
      expiresIn: 300,
      resendAfter: 30,
      emailSent: emailResult.sent,
      provider: emailResult.provider
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
