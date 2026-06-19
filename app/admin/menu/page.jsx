import { AdminRouteLayout, RestaurantProducts } from "@/components/features/AdminDashboard";
import { foodCategories } from "@/data/food";

export const metadata = {
  title: "Admin Menu",
  robots: { index: false, follow: false }
};

export default function AdminMenuPage() {
  const categories = foodCategories.filter((item) => item !== "All");

  return (
    <AdminRouteLayout>
      <div className="mb-5 rounded-2xl border border-white/10 bg-panel p-4">
        <div className="mb-3 text-sm font-semibold">Category Management</div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span key={category} className="rounded-full border border-white/10 bg-white/[.04] px-3 py-2 text-xs font-semibold text-zinc-300">
              {category}
            </span>
          ))}
        </div>
      </div>
      <RestaurantProducts />
    </AdminRouteLayout>
  );
}
