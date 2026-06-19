import { NextResponse } from "next/server";
import { updatePassword, verifyOtpRecord } from "@/lib/serverAuthStore";

export async function POST(request) {
  try {
    const { email, otp, password, confirmPassword } = await request.json();
    if (!email || !otp || !password || !confirmPassword) {
      return NextResponse.json({ ok: false, error: "All fields are required" }, { status: 400 });
    }
    if (password !== confirmPassword) return NextResponse.json({ ok: false, error: "Passwords do not match" }, { status: 400 });
    if (String(password).length < 8) return NextResponse.json({ ok: false, error: "Password must be at least 8 characters" }, { status: 400 });
    const otpResult = verifyOtpRecord(email, "password_reset", otp);
    if (!otpResult.ok) return NextResponse.json(otpResult, { status: 400 });
    const result = updatePassword(email, password);
    if (!result.ok) return NextResponse.json(result, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
