import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/adminAuth";
import { listAdminData, saveCollectionItem } from "@/lib/adminDataStore";

function normalizeService(payload) {
  if (!payload.name || Number(payload.price) <= 0) throw new Error("Service name and valid price are required");
  return {
    ...payload,
    name: String(payload.name).trim(),
    desc: payload.description || payload.desc || "",
    description: payload.description || payload.desc || "",
    price: Number(payload.price),
    sampleImages: Array.isArray(payload.sampleImages) ? payload.sampleImages : String(payload.sampleImages || "").split(/\n|,/).map((item) => item.trim()).filter(Boolean)
  };
}

export async function GET(request) {
  const admin = requireAdminRequest(request);
  if (!admin.ok) return admin.response;
  return NextResponse.json({ ok: true, printServices: listAdminData().printServices });
}

export async function POST(request) {
  const admin = requireAdminRequest(request);
  if (!admin.ok) return admin.response;
  try {
    const service = saveCollectionItem("printServices", normalizeService(await request.json()));
    return NextResponse.json({ ok: true, service }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }
}
