import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/adminAuth";
import { deleteCollectionItem, saveCollectionItem } from "@/lib/adminDataStore";

function normalizeProduct(payload) {
  const images = Array.isArray(payload.images) ? payload.images.filter(Boolean) : String(payload.images || payload.img || "").split(/\n|,/).map((item) => item.trim()).filter(Boolean);
  const category = payload.category || payload.cat;
  if (!payload.name || !category || Number(payload.price) <= 0) throw new Error("Name, category and valid price are required");
  return {
    ...payload,
    category,
    cat: category,
    description: payload.description || payload.desc || "",
    desc: payload.desc || payload.description || "",
    price: Number(payload.price),
    mrp: Number(payload.mrp || payload.price),
    discount: Number(payload.discount || 0),
    stock: Number(payload.stockQuantity ?? payload.stock ?? 0),
    stockQuantity: Number(payload.stockQuantity ?? payload.stock ?? 0),
    images,
    img: images[0] || payload.img || ""
  };
}

export async function PUT(request, { params }) {
  const admin = requireAdminRequest(request);
  if (!admin.ok) return admin.response;
  try {
    const product = saveCollectionItem("products", normalizeProduct(await request.json()), params.id);
    return NextResponse.json({ ok: true, product });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const admin = requireAdminRequest(request);
  if (!admin.ok) return admin.response;
  deleteCollectionItem("products", params.id);
  return NextResponse.json({ ok: true });
}
