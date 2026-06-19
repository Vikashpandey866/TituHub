import { Suspense } from "react";
import RestaurantStore from "@/components/features/RestaurantStore";
import Loading from "@/components/ui/Loading";

export const metadata = {
  title: "TituEats",
  description: "Order delicious food on TituHub with 15-30 minute delivery in supported zones."
};

export default function RestaurantPage() {
  return (
    <>
      <section className="border-b border-white/10 bg-gradient-to-br from-ember/10 to-red-900/5 px-4 py-8 sm:px-6">
        <h1 className="font-heading text-4xl font-extrabold text-white">TituEats <span className="gradient-text">Food</span></h1>
        <p className="mt-1 text-sm font-medium text-zinc-300">Food menu, categories, QR menu system, table booking and order tracking.</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1.5 text-emerald-400">15-30 min delivery</span>
          <span className="rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1.5 text-blue-300">Within 15 KM only</span>
          <span className="rounded-full border border-gold/30 bg-gold/15 px-3 py-1.5 text-gold">Free delivery above Rs 299</span>
        </div>
      </section>
      <Suspense fallback={<Loading />}>
        <RestaurantStore />
      </Suspense>
    </>
  );
}
