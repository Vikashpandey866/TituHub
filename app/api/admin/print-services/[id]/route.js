import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/adminAuth";
import { deleteCollectionItem, saveCollectionItem } from "@/lib/adminDataStore";

function normalizeService(payload) {
  if (!payload.name || Number(payload.price) <= 0) throw new Error("Service name and valid price are required");
  return {
    ...payload,
    desc: payload.description || payload.desc || "",
    description: payload.description || payload.desc || "",
    price: Number(payload.price),
    sampleImages: Array.isArray(payload.sampleImages) ? payload.sampleImages : String(payload.sampleImages || "").split(/\n|,/).map((item) => item.trim()).filter(Boolean)
  };
}

export async function PUT(request, { params }) {
  const admin = requireAdminRequest(request);
  if (!admin.ok) return admin.response;
  try {
    const service = saveCollectionItem("printServices", normalizeService(await request.json()), params.id);
    return NextResponse.json({ ok: true, service });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const admin = requireAdminRequest(request);
  if (!admin.ok) return admin.response;
  deleteCollectionItem("printServices", params.id);
  return NextResponse.json({ ok: true });
}
