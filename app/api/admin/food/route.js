import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/adminAuth";
import { listAdminData, saveCollectionItem } from "@/lib/adminDataStore";

function normalizeFood(payload) {
  if (!payload.name || !payload.category || Number(payload.price) <= 0) throw new Error("Name, category and valid price are required");
  const tags = [payload.isVeg === false || payload.veg === false ? "non-veg" : "veg"];
  if (payload.todaySpecial) tags.push("today-special");
  if (payload.bestSeller || payload.popular) tags.push("popular");
  return {
    ...payload,
    name: String(payload.name).trim(),
    desc: payload.description || payload.desc || "",
    description: payload.description || payload.desc || "",
    price: Number(payload.price),
    isVeg: payload.isVeg ?? payload.veg ?? true,
    available: payload.available !== false,
    todaySpecial: Boolean(payload.todaySpecial),
    bestSeller: Boolean(payload.bestSeller || payload.popular),
    tags
  };
}

export async function GET(request) {
  const admin = requireAdminRequest(request);
  if (!admin.ok) return admin.response;
  return NextResponse.json({ ok: true, foods: listAdminData().foods });
}

export async function POST(request) {
  const admin = requireAdminRequest(request);
  if (!admin.ok) return admin.response;
  try {
    const food = saveCollectionItem("foods", normalizeFood(await request.json()));
    return NextResponse.json({ ok: true, food }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }
}
