import { NextResponse } from "next/server";
import { createOtpRecord, findPendingUser, findUser, normalizeEmail } from "@/lib/serverAuthStore";
import { maskEmail, sendOtpEmail } from "@/lib/otpMailer";

export async function POST(request) {
  try {
    const { email, purpose = "signup" } = await request.json();
    if (!email) return NextResponse.json({ ok: false, error: "Email is required" }, { status: 400 });
    if (purpose === "signup" && !findPendingUser(email)) {
      return NextResponse.json({ ok: false, error: "Signup session expired. Please sign up again." }, { status: 404 });
    }
    if (purpose === "password_reset" && !findUser(email)) {
      return NextResponse.json({ ok: false, error: "No account found for this email" }, { status: 404 });
    }
    const { otp } = createOtpRecord(email, purpose);
    let emailResult;
    try {
      emailResult = await sendOtpEmail({ email: normalizeEmail(email), otp, purpose });
    } catch (error) {
      console.error("[OTP Sent Failure]", { email: normalizeEmail(email), purpose, reason: error.message });
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
