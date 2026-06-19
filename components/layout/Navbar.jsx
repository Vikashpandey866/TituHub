"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Home, Percent, Phone, Shirt, Utensils, Printer, Settings, ShoppingCart, Search, Store, Package, LogOut, UserCircle } from "lucide-react";
import { useApp } from "@/components/providers";
import { cn } from "@/lib/format";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/restaurant", label: "Restaurants", icon: Utensils },
  { href: "/fashion", label: "Fashion", icon: Shirt },
  { href: "/printhub", label: "PrintHub", icon: Printer },
  { href: "/#deals", label: "Deals", icon: Percent },
  { href: "/contact", label: "Contact", icon: Phone },
  { href: "/admin", label: "Admin", icon: Settings }
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, cartCount, setCartOpen, setAuthModal } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const activePath = useMemo(() => (pathname === "/" ? "/" : `/${pathname.split("/")[1]}`), [pathname]);

  const submitSearch = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    const target = activePath === "/restaurant" ? "/restaurant" : "/fashion";
    router.push(`${target}?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-16 items-center gap-3 border-b border-white/10 bg-ink/85 px-3 backdrop-blur-xl sm:px-6">
      <Link href="/" className="shrink-0 font-heading text-[22px] font-extrabold gradient-text">
        TituHub
      </Link>

      <div className="mx-2 hidden rounded-xl border border-white/10 bg-white/[.04] p-1 lg:flex">
        {tabs.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium text-zinc-400 transition hover:bg-white/[.08] hover:text-white",
              activePath === href && "bg-gradient-to-br from-orange to-ember text-white"
            )}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </div>

      <form onSubmit={submitSearch} className="hidden max-w-sm flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3 sm:flex">
        <Search size={16} className="text-zinc-500" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products, food, services..."
          className="w-full bg-transparent py-2 text-sm text-white outline-none placeholder:text-zinc-600"
        />
      </form>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setCartOpen(true)}
          className="relative rounded-lg border border-white/10 bg-white/[.04] p-2.5 transition hover:border-orange hover:bg-white/[.08]"
          aria-label="Open cart"
        >
          <ShoppingCart size={18} />
          <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ember text-[11px] font-bold text-white">
            {cartCount}
          </span>
        </button>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setProfileOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange to-ember text-sm font-bold text-white"
              aria-label="Open profile menu"
            >
              {user.name[0].toUpperCase()}
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-11 min-w-48 rounded-xl border border-white/10 bg-panel p-2 shadow-glow">
                <Link className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/[.08] hover:text-white" href="/seller">
                  <Store size={15} /> Seller Panel
                </Link>
                <Link className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/[.08] hover:text-white" href="/profile">
                  <UserCircle size={15} /> Profile
                </Link>
                <Link className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/[.08] hover:text-white" href="/orders">
                  <Package size={15} /> My Orders
                </Link>
                <div className="my-1 h-px bg-white/10" />
                <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-ember hover:bg-white/[.08]">
                  <LogOut size={15} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button onClick={() => setAuthModal("login")} className="hidden rounded-lg border border-white/15 bg-white/[.04] px-4 py-2 text-sm font-medium text-white transition hover:border-orange sm:inline-flex">
              Login
            </button>
            <button onClick={() => setAuthModal("signup")} className="rounded-lg bg-gradient-to-br from-orange to-ember px-4 py-2 text-sm font-medium text-white">
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
