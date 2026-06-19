import AdminDashboard from "@/components/features/AdminDashboard";

export const metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false }
};

export default function AdminPage() {
  return <AdminDashboard />;
}
