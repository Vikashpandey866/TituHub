import { cn } from "@/lib/format";

export default function StatusBadge({ status, children }) {
  const map = {
    Accepted: "bg-cyan-500/15 text-cyan-300",
    Cancelled: "bg-rose-500/15 text-rose-300",
    Delivered: "bg-emerald-500/15 text-emerald-400",
    Paid: "bg-emerald-500/15 text-emerald-400",
    Processing: "bg-blue-500/15 text-blue-400",
    Preparing: "bg-blue-500/15 text-blue-400",
    Shipped: "bg-violet-500/15 text-violet-300",
    Pending: "bg-gold/15 text-gold"
  };

  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", map[status] || map.Pending)}>
      {children || status}
    </span>
  );
}
