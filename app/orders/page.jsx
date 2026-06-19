import { Suspense } from "react";
import OrdersList from "@/components/features/OrdersList";
import Loading from "@/components/ui/Loading";

export const metadata = {
  title: "My Orders",
  robots: { index: false, follow: false }
};

export default function OrdersPage() {
  return (
    <>
      <section className="border-b border-white/10 px-4 py-8 sm:px-6">
        <h1 className="font-heading text-3xl font-extrabold">My <span className="gradient-text">Orders</span></h1>
      </section>
      <Suspense fallback={<Loading />}>
        <OrdersList />
      </Suspense>
    </>
  );
}
