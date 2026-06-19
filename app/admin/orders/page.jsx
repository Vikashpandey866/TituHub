import { AdminRouteLayout, Orders } from "@/components/features/AdminDashboard";

export const metadata = {
  title: "Admin Orders",
  robots: { index: false, follow: false }
};

export default function AdminOrdersPage() {
  return (
    <AdminRouteLayout>
      <Orders />
    </AdminRouteLayout>
  );
}
