import { NextResponse } from "next/server";

export async function POST(request) {
  const booking = await request.json();
  return NextResponse.json({
    ok: true,
    booking: {
      ...booking,
      id: `TB-${Date.now()}`
    }
  });
}
