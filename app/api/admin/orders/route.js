import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/adminAuth";
import { listAdminData } from "@/lib/adminDataStore";

export async function GET(request) {
  const admin = requireAdminRequest(request);
  if (!admin.ok) return admin.response;
  return NextResponse.json({ ok: true, orders: listAdminData().orders });
}
