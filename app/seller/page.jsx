import SellerDashboard from "@/components/features/SellerDashboard";

export const metadata = {
  title: "Seller Dashboard",
  robots: { index: false, follow: false }
};

export default function SellerPage() {
  return (
    <>
      <section className="border-b border-white/10 px-4 py-8 sm:px-6">
        <h1 className="font-heading text-3xl font-extrabold">Seller <span className="gradient-text">Dashboard</span></h1>
        <p className="mt-1 text-sm text-zinc-500">Manage your store, products and earnings.</p>
      </section>
      <SellerDashboard />
    </>
  );
}
