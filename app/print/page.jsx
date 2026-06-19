import PrintStore from "@/components/features/PrintStore";

export const metadata = {
  title: "Print Services",
  description: "Order professional ID cards, banners, posters, visiting cards and more on TituHub."
};

export default function PrintPage() {
  return (
    <>
      <section className="border-b border-white/10 bg-gradient-to-br from-orange/10 to-blue-500/5 px-4 py-8 sm:px-6">
        <h1 className="font-heading text-4xl font-extrabold text-white">PrintHub <span className="gradient-text">Services</span></h1>
        <p className="mt-1 text-sm font-medium text-zinc-300">ID cards, custom T-shirt printing, banners, posters, upload design and pricing calculator.</p>
      </section>
      <PrintStore />
    </>
  );
}
