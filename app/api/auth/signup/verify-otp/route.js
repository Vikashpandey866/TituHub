import { NextResponse } from "next/server";
import { publicUser, verifyOtpRecord, verifyPendingUser } from "@/lib/serverAuthStore";

export async function POST(request) {
  try {
    const { email, otp } = await request.json();
    if (!email || !otp) return NextResponse.json({ ok: false, error: "Email and OTP are required" }, { status: 400 });
    const otpResult = verifyOtpRecord(email, "signup", otp);
    if (!otpResult.ok) return NextResponse.json(otpResult, { status: 400 });
    const userResult = verifyPendingUser(email);
    if (!userResult.ok) return NextResponse.json(userResult, { status: 400 });
    return NextResponse.json({ ok: true, user: publicUser(userResult.user) });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
