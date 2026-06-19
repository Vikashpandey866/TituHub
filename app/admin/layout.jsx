import { redirect } from "next/navigation";
import { getAdminSessionFromCookies } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }) {
  const admin = getAdminSessionFromCookies();
  if (!admin) redirect("/admin-login");
  return children;
}
