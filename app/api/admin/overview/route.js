import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/adminAuth";
import { adminMeta, listAdminData } from "@/lib/adminDataStore";
import { getAuthAdminSnapshot } from "@/lib/serverAuthStore";

export async function GET(request) {
  const admin = requireAdminRequest(request);
  if (!admin.ok) return admin.response;

  const db = listAdminData();
  const users = getAuthAdminSnapshot().verifiedUsers;
  const totalRevenue = db.orders.reduce((sum, order) => sum + Number(order.total || order.amount || 0), 0);
  const pendingOrders = db.orders.filter((order) => order.status === "Pending").length;

  return NextResponse.json({
    ok: true,
    metrics: {
      totalUsers: users.length,
      totalOrders: db.orders.length,
      totalRevenue,
      totalProducts: db.products.length,
      totalFoodItems: db.foods.length,
      pendingOrders,
      tableBookings: db.bookings.length
    },
    ...db,
    meta: adminMeta()
  });
}
