import { Suspense } from "react";
import FashionStore from "@/components/features/FashionStore";
import Loading from "@/components/ui/Loading";

export const metadata = {
  title: "Fashion Store",
  description: "Shop premium clothing and accessories on TituHub."
};

export default function FashionPage() {
  return (
    <>
      <Header title="Fashion" accent="Store" copy="Sarees, T-shirts, hoodies, shoes, watches and bags with wishlist and cart." />
      <Suspense fallback={<Loading />}>
        <FashionStore />
      </Suspense>
    </>
  );
}

function Header({ title, accent, copy }) {
  return (
    <section className="border-b border-white/10 bg-gradient-to-br from-orange/10 to-ember/5 px-4 py-8 sm:px-6">
      <h1 className="font-heading text-4xl font-extrabold text-white">{title} <span className="gradient-text">{accent}</span></h1>
      <p className="mt-1 text-sm font-medium text-zinc-300">{copy}</p>
    </section>
  );
}
