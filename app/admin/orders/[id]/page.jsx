import { AdminOrderDetails, AdminRouteLayout } from "@/components/features/AdminDashboard";

export const metadata = {
  title: "Admin Order Details",
  robots: { index: false, follow: false }
};

export default function AdminOrderDetailsPage({ params }) {
  return (
    <AdminRouteLayout>
      <AdminOrderDetails orderId={params.id} />
    </AdminRouteLayout>
  );
}
