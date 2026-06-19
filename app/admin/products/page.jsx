import { AdminRouteLayout, Products } from "@/components/features/AdminDashboard";

export const metadata = {
  title: "Admin Products",
  robots: { index: false, follow: false }
};

export default function AdminProductsPage() {
  return (
    <AdminRouteLayout>
      <Products />
    </AdminRouteLayout>
  );
}
