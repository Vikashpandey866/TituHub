import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/adminAuth";
import { updateOrder } from "@/lib/adminDataStore";

export async function PATCH(request, { params }) {
  const admin = requireAdminRequest(request);
  if (!admin.ok) return admin.response;
  const result = updateOrder(params.id, await request.json());
  if (!result.ok) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}
