import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/adminAuth";
import { listAdminData, updateBlockedUsers } from "@/lib/adminDataStore";
import { deleteUserByEmail, getAuthAdminSnapshot } from "@/lib/serverAuthStore";

export async function GET(request) {
  const admin = requireAdminRequest(request);
  if (!admin.ok) return admin.response;
  return NextResponse.json({ ok: true, blockedUsers: listAdminData().blockedUsers, ...getAuthAdminSnapshot() });
}

export async function PATCH(request) {
  const admin = requireAdminRequest(request);
  if (!admin.ok) return admin.response;
  const { email, blocked } = await request.json();
  if (!email) return NextResponse.json({ ok: false, error: "Email is required" }, { status: 400 });
  const blockedUsers = updateBlockedUsers(email, Boolean(blocked));
  return NextResponse.json({ ok: true, blockedUsers });
}

export async function DELETE(request) {
  const admin = requireAdminRequest(request);
  if (!admin.ok) return admin.response;
  const { email } = await request.json();
  if (!email) return NextResponse.json({ ok: false, error: "Email is required" }, { status: 400 });
  deleteUserByEmail(email);
  return NextResponse.json({ ok: true });
}
