import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/adminAuth";
import { listAdminData, saveCollectionItem } from "@/lib/adminDataStore";

function normalizeProduct(payload) {
  const images = Array.isArray(payload.images) ? payload.images.filter(Boolean) : String(payload.images || payload.img || "").split(/\n|,/).map((item) => item.trim()).filter(Boolean);
  const category = payload.category || payload.cat;
  if (!payload.name || !category || Number(payload.price) <= 0) throw new Error("Name, category and valid price are required");
  return {
    ...payload,
    name: String(payload.name).trim(),
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
    img: images[0] || payload.img || "",
    sizes: Array.isArray(payload.sizes) ? payload.sizes : String(payload.sizes || "").split(",").map((item) => item.trim()).filter(Boolean),
    colors: Array.isArray(payload.colors) ? payload.colors : String(payload.colors || "").split(",").map((item) => item.trim()).filter(Boolean)
  };
}

export async function GET(request) {
  const admin = requireAdminRequest(request);
  if (!admin.ok) return admin.response;
  return NextResponse.json({ ok: true, products: listAdminData().products });
}

export async function POST(request) {
  const admin = requireAdminRequest(request);
  if (!admin.ok) return admin.response;
  try {
    const item = saveCollectionItem("products", normalizeProduct(await request.json()));
    return NextResponse.json({ ok: true, product: item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }
}
