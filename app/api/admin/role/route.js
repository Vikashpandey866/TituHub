import { NextResponse } from "next/server";

export async function POST(request) {
  const { email } = await request.json();
  const adminEmail = process.env.ADMIN_EMAIL || "pandvikash46@gmail.com";

  return NextResponse.json({
    role: String(email || "").toLowerCase() === adminEmail.toLowerCase() ? "admin" : "customer"
  });
}

