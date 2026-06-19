"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Printer, Shirt, ShoppingCart, Utensils } from "lucide-react";
import { useApp } from "@/components/providers";
import { cn } from "@/lib/format";

const items = [
  ["/", "Home", Home],
  ["/restaurant", "Food", Utensils],
  ["/fashion", "Fashion", Shirt],
  ["/printhub", "Print", Printer]
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { setCartOpen, cartCount } = useApp();
  const active = pathname === "/" ? "/" : `/${pathname.split("/")[1]}`;

  return (
    <nav className="fixed inset-x-2 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] z-[2050] grid grid-cols-5 rounded-2xl border border-white/10 bg-panel/95 p-1 shadow-luxury backdrop-blur-xl sm:inset-x-4 lg:hidden">
      {items.map(([href, label, Icon]) => (
        <Link key={href} href={href} className={cn("flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-[11px] text-zinc-500 transition", active === href && "bg-orange text-white")}>
          <Icon size={17} />
          {label}
        </Link>
      ))}
      <button onClick={() => setCartOpen(true)} className="relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-[11px] text-zinc-500 transition">
        <ShoppingCart size={17} />
        Cart
        <span className="absolute right-3 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-ember text-[10px] font-bold text-white">{cartCount}</span>
      </button>
    </nav>
  );
}
