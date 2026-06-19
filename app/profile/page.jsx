"use client";

import Link from "next/link";
import { Heart, MapPin, Settings, ShoppingBag, UserCircle } from "lucide-react";
import { useApp } from "@/components/providers";
import OrdersList from "@/components/features/OrdersList";
import { fashionProducts } from "@/data/fashion";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  const { user, wishlist, setAuthModal, orders } = useApp();
  const wishlistProducts = fashionProducts.filter((product) => wishlist.includes(product.id));
  const lastAddress = orders[0]?.shippingAddress;

  if (!user) {
    return (
      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10">
        <div className="premium-panel max-w-md p-8 text-center">
          <UserCircle className="mx-auto mb-4 text-orange" size={48} />
          <h1 className="font-heading text-3xl font-extrabold">Login Required</h1>
          <p className="mt-2 text-sm text-zinc-500">Access your orders, wishlist, saved addresses and account settings.</p>
          <Button className="mt-6" onClick={() => setAuthModal("login")}>Login to Profile</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="section-shell">
      <div className="mb-6 rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,107,0,.16),rgba(255,255,255,.035))] p-6 shadow-luxury">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange font-heading text-2xl font-bold text-white">{user.name?.[0]?.toUpperCase() || "T"}</div>
          <div>
            <h1 className="font-heading text-3xl font-extrabold">{user.name || "TituHub User"}</h1>
            <p className="text-sm text-zinc-400">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <Panel icon={ShoppingBag} title="My Orders">
            <OrdersList compact />
            <Button asChild variant="ghost" className="mt-4"><Link href="/orders">View All Orders</Link></Button>
          </Panel>

          <Panel icon={Heart} title="Wishlist">
            {wishlistProducts.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {wishlistProducts.map((product) => (
                  <div key={product.id} className="rounded-xl border border-white/10 bg-white/[.035] p-4">
                    <div className="text-sm font-semibold">{product.name}</div>
                    <div className="mt-1 text-xs text-zinc-500">{product.cat}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No wishlist items yet.</p>
            )}
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel icon={MapPin} title="Saved Addresses">
            {lastAddress ? (
              <div className="rounded-xl border border-white/10 bg-white/[.035] p-4 text-sm leading-6 text-zinc-300">
                <div className="font-semibold text-white">{lastAddress.fullName}</div>
                <div>{lastAddress.address}</div>
                <div>{lastAddress.city}, {lastAddress.state} - {lastAddress.pincode}</div>
                <div className="mt-2 text-zinc-500">{lastAddress.phone}</div>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">Saved addresses appear after checkout.</p>
            )}
          </Panel>

          <Panel icon={Settings} title="Account Settings">
            <div className="space-y-3 text-sm">
              <Info label="Full Name" value={user.name || "Not set"} />
              <Info label="Email" value={user.email || "Not set"} />
              <Info label="Phone" value={user.phone || lastAddress?.phone || "Not set"} />
              <Info label="Email Verification" value={user.emailVerified ? "Verified" : "Pending"} />
            </div>
          </Panel>
        </div>
      </div>
    </section>
  );
}

function Panel({ icon: Icon, title, children }) {
  return (
    <section className="premium-panel p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange text-white"><Icon size={20} /></span>
        <h2 className="font-heading text-xl font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[.035] px-4 py-3">
      <span className="text-zinc-500">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  );
}
