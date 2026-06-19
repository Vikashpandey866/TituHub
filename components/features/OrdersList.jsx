"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Package, ShoppingBag } from "lucide-react";
import { useApp } from "@/components/providers";
import StatusBadge from "@/components/ui/StatusBadge";
import { money } from "@/lib/format";

export const trackingSteps = ["Pending", "Accepted", "Preparing", "Shipped", "Delivered"];

export function OrderTimeline({ status }) {
  const activeIndex = trackingSteps.indexOf(status);
  const completeIndex = activeIndex === -1 ? 0 : activeIndex;
  const cancelled = status === "Cancelled";

  return (
    <div className="mt-4 grid grid-cols-5 gap-2">
      {trackingSteps.map((step, index) => {
        const active = !cancelled && index <= completeIndex;
        return (
          <div key={step} className="min-w-0">
            <div className={`mb-2 h-1 rounded-full ${active ? "bg-orange" : "bg-white/10"}`}>
              {active && <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} className="h-full rounded-full bg-orange" />}
            </div>
            <div className={`flex flex-col items-center gap-1 text-center text-[10px] sm:text-xs ${active ? "text-white" : "text-zinc-600"}`}>
              <span className={`flex h-7 w-7 items-center justify-center rounded-full border ${active ? "border-orange bg-orange/15 text-orange" : "border-white/10 bg-panel2"}`}>
                {active ? <CheckCircle2 size={14} /> : <Package size={13} />}
              </span>
              <span className="truncate">{step}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function OrdersList({ compact = false }) {
  const params = useSearchParams();
  const { orders } = useApp();
  const success = params.get("success");

  return (
    <section className={compact ? "" : "section-shell"}>
      {success && (
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mb-6 max-w-xl rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5 text-center">
          <CheckCircle2 className="mx-auto mb-3 text-emerald-300" size={44} />
          <h2 className="font-heading text-2xl font-bold">Order Placed Successfully</h2>
          <p className="mt-1 text-sm text-zinc-400">Your order {success} has been confirmed.</p>
        </motion.div>
      )}
      {!orders.length ? (
        <div className="py-16 text-center text-zinc-500">
          <ShoppingBag className="mx-auto mb-4 text-orange" size={44} />
          <div className="font-semibold text-white">No orders yet</div>
          <div className="mt-1 text-sm">Start shopping on TituHub.</div>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl space-y-4">
          {(compact ? orders.slice(0, 3) : orders).map((order) => (
            <motion.article key={order.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="premium-panel p-5">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <strong className="text-orange">{order.id}</strong>
                  <div className="mt-1 text-sm text-zinc-500">{order.date} | {order.items.length} product(s)</div>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={`${order.id}-${item.type}-${item.id}`} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.035] p-3">
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-panel2">
                      {item.img ? <Image src={item.img} alt={item.name} fill sizes="44px" className="object-cover" /> : <ShoppingBag size={17} className="text-orange" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{item.name}</div>
                      <div className="text-xs text-zinc-500">Qty {item.qty}</div>
                    </div>
                    <div className="text-sm font-bold">{money(item.price * item.qty)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-sm text-zinc-500">Total Amount</span>
                <span className="font-heading text-lg font-bold text-orange">{money(order.total)}</span>
              </div>
              <OrderTimeline status={order.status} />
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
}
