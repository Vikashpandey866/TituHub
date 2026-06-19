import Link from "next/link";
import { Button } from "@/components/ui/Button";

const cards = [
  ["Fashion Store", "Manage your clothing and accessories catalog", "Manage Products", "/admin/products"],
  ["Restaurant Partner", "Update menu, manage food orders, set delivery zones", "Manage Menu", "/admin/menu"],
  ["Print Provider", "Handle print orders and manage turnaround time", "Manage Orders", "/admin/orders"]
];

export default function SellerDashboard() {
  return (
    <section className="section-shell">
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total Sales", "₹84,320", "↑ 18% this month"],
          ["Active Products", "47", "↑ 3 new"],
          ["Pending Orders", "12", "Need action"],
          ["Rating", "4.7★", "↑ 0.2 vs last month"]
        ].map(([label, value, change]) => (
          <div key={label} className="premium-panel p-5">
            <div className="text-xs text-zinc-500">{label}</div>
            <div className="my-1 font-heading text-3xl font-extrabold">{value}</div>
            <div className="text-xs text-emerald-400">{change}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(([title, desc, cta, href]) => (
          <Link key={title} href={href} className="premium-card block p-5">
            <h3 className="mb-2 font-heading text-lg font-bold">{title}</h3>
            <p className="mb-5 text-sm leading-6 text-zinc-500">{desc}</p>
            <Button asChild className="px-4 py-2.5 text-sm">
              <span>{cta}</span>
            </Button>
          </Link>
        ))}
      </div>
    </section>
  );
}
