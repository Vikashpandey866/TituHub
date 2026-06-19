"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useApp } from "@/components/providers";
import { money } from "@/lib/format";

export default function CartDrawer() {
  const router = useRouter();
  const { cartOpen, setCartOpen, cart, subtotal, delivery, total, changeQty, removeItem } = useApp();

  return (
    <div className={cartOpen ? "fixed inset-0 z-[2000] flex justify-end bg-black/70 backdrop-blur-sm" : "hidden"} onClick={() => setCartOpen(false)}>
      <aside className="flex h-full w-full max-w-md animate-slideIn flex-col border-l border-white/10 bg-panel shadow-luxury" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="font-heading text-xl font-bold">Your Cart</h2>
          <button onClick={() => setCartOpen(false)} className="rounded-full border border-white/10 bg-white/[.04] p-2" aria-label="Close cart">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!cart.length ? (
            <div className="py-16 text-center text-zinc-500">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[.04] text-orange">
                <ShoppingBag size={28} />
              </div>
              <div className="font-semibold text-white">Cart is empty</div>
              <div className="mt-1 text-sm">Add items to get started</div>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.type}-${item.id}`} className="flex items-center gap-3 border-b border-white/10 py-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-panel2">
                  {item.img ? <Image src={item.img} alt={item.name} fill sizes="56px" className="object-cover" /> : <ShoppingBag size={22} className="text-orange" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{item.name}</div>
                  <div className="text-sm font-bold text-orange">{money(item.price)} each</div>
                  <div className="mt-2 flex items-center gap-2">
                    <button className="flex h-7 w-7 items-center justify-center rounded-md border border-white/15 bg-white/[.08]" onClick={() => changeQty(item.id, -1, item.type)} aria-label="Decrease quantity">
                      <Minus size={13} />
                    </button>
                    <span className="min-w-5 text-center text-sm font-semibold">{item.qty}</span>
                    <button className="flex h-7 w-7 items-center justify-center rounded-md border border-white/15 bg-white/[.08]" onClick={() => changeQty(item.id, 1, item.type)} aria-label="Increase quantity">
                      <Plus size={13} />
                    </button>
                    <button className="ml-2 rounded-md border border-ember/30 bg-ember/15 px-2 py-1 text-xs text-ember" onClick={() => removeItem(item.id, item.type)}>
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right text-sm font-bold">{money(item.price * item.qty)}</div>
              </div>
            ))
          )}
        </div>

        {!!cart.length && (
          <div className="border-t border-white/10 px-6 py-5">
            <div className="mb-2 flex justify-between text-sm text-zinc-500"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="mb-4 flex justify-between text-sm text-zinc-500"><span>Delivery Charge</span><span className={delivery ? "" : "text-emerald-400"}>{delivery ? money(delivery) : "FREE"}</span></div>
            <div className="mb-4 flex justify-between font-heading text-lg font-bold"><span>Grand Total</span><span className="text-orange">{money(total)}</span></div>
            <button
              onClick={() => {
                setCartOpen(false);
                router.push("/checkout");
              }}
              className="w-full rounded-xl bg-gradient-to-br from-orange to-ember px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-orange"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
