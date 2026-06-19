import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Printer, Shirt, Star, Utensils } from "lucide-react";
import Hero from "@/components/sections/Hero";
import FashionStore from "@/components/features/FashionStore";
import Loading from "@/components/ui/Loading";
import { Button } from "@/components/ui/Button";
import { foodItems } from "@/data/food";
import { fashionProducts } from "@/data/fashion";
import { printServices } from "@/data/print";
import { money } from "@/lib/format";

export const metadata = {
  title: "TituHub | Premium Multi-Business Platform"
};

const businesses = [
  { title: "Restaurants", href: "/restaurant", icon: Utensils, copy: "Luxury Zomato-style ordering, QR menus and table booking.", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=85" },
  { title: "Fashion", href: "/fashion", icon: Shirt, copy: "Curated men, women, shoes, watches, bags and accessories.", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=85" },
  { title: "PrintHub", href: "/printhub", icon: Printer, copy: "Visiting cards, ID cards, banners, posters, tees, mugs and flex.", image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=1200&q=90" }
];

const reviews = [
  ["Ananya Sharma", "TituHub feels like a premium mall, restaurant and print studio in one app."],
  ["Rohan Mehta", "The QR menu and checkout flow are fast, polished and genuinely useful."],
  ["Priya Nair", "Fashion stock, food deals and printing services all look professionally managed."]
];

export default function HomePage() {
  const featured = fashionProducts.slice(0, 4);
  const trending = foodItems.filter((item) => item.tags.includes("popular")).slice(0, 4);
  const bestSellers = [...fashionProducts].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <>
      <Hero />

      <section className="mx-3 mb-8 grid overflow-hidden rounded-2xl border border-white/10 bg-charcoal sm:mx-6 md:grid-cols-4">
        {[["Fast", "Delivery"], ["Secure", "Payments"], ["Custom", "Printing"], ["Premium", "Quality"]].map(([value, label]) => (
          <div key={label} className="border-b border-white/10 p-5 text-center last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
            <div className="font-heading text-2xl font-extrabold gradient-text">{value}</div>
            <div className="mt-1 text-xs text-zinc-500">{label}</div>
          </div>
        ))}
      </section>

      <section className="section-shell">
        <SectionHead eyebrow="Multi Business" title="One Platform, Three Premium Engines" href="/contact" />
        <div className="grid gap-4 lg:grid-cols-3">
          {businesses.map(({ title, href, icon: Icon, copy, image }) => (
            <Link key={title} href={href} className="premium-card group overflow-hidden">
              <div className="relative h-56 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), linear-gradient(to top, rgba(0,0,0,.82), rgba(0,0,0,.18)), url(${image})` }}>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange text-white"><Icon size={22} /></span>
                  <h3 className="font-heading text-2xl font-bold text-white drop-shadow">{title}</h3>
                  <p className="mt-1 text-sm font-medium text-zinc-100">{copy}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ProductStrip eyebrow="Featured Products" title="Curated Fashion Drops" items={featured} type="fashion" />
      <ProductStrip eyebrow="Trending Products" title="Restaurant Favorites" items={trending} type="food" />
      <ProductStrip eyebrow="Best Sellers" title="Top Rated Picks" items={bestSellers} type="fashion" />

      <section id="deals" className="section-shell">
        <SectionHead eyebrow="Deals of the Day" title="Premium Offers, Live Today" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Deal title="Restaurant Combo" copy="Flat 20% off on biryani, burger and dessert combos." href="/restaurant" />
          <Deal title="Fashion Weekend" copy="Up to 46% off on watches, bags and accessories." href="/fashion" />
          <Deal title="PrintHub Starter" copy="Visiting cards plus QR menu design for growing businesses." href="/printhub" />
        </div>
      </section>

      <section className="section-shell">
        <SectionHead eyebrow="PrintHub Services" title="Production-Ready Print Catalog" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {printServices.slice(0, 10).map((service) => (
            <div key={service.id} className="rounded-xl border border-white/10 bg-white/[.04] p-4">
              <div className="text-sm font-semibold">{service.name}</div>
              <div className="mt-2 text-xs text-zinc-500">{service.desc}</div>
              <div className="mt-3 text-sm font-bold text-orange">From {money(service.price)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <div className="premium-panel p-6">
          <div className="text-xs font-bold uppercase tracking-widest text-orange">Founder Section</div>
          <h2 className="mt-3 font-heading text-3xl font-extrabold">Built to help local businesses sell like premium brands.</h2>
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            TituHub combines restaurant ordering, ecommerce inventory and print service workflows into a single scalable platform for modern Indian businesses.
          </p>
          <Button asChild className="mt-6"><Link href="/admin">Open Admin Dashboard</Link></Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {reviews.map(([name, review]) => (
            <div key={name} className="premium-card p-5">
              <div className="mb-3 text-gold"><Star size={16} fill="currentColor" /></div>
              <p className="text-sm leading-6 text-zinc-300">{review}</p>
              <div className="mt-4 text-sm font-semibold">{name}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell pt-0">
        <SectionHead eyebrow="Fashion Preview" title="More Trending Products" href="/fashion" />
        <Suspense fallback={<Loading />}>
          <FashionStore compact />
        </Suspense>
      </section>
    </>
  );
}

function SectionHead({ eyebrow, title, href }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-orange">{eyebrow}</div>
        <h2 className="font-heading text-2xl font-bold sm:text-3xl">{title}</h2>
      </div>
      {href && <Link href={href} className="hidden items-center gap-1 text-sm font-semibold text-orange sm:inline-flex">Explore <ArrowRight size={16} /></Link>}
    </div>
  );
}

function ProductStrip({ eyebrow, title, items, type }) {
  return (
    <section className="section-shell">
      <SectionHead eyebrow={eyebrow} title={title} href={type === "food" ? "/restaurant" : "/fashion"} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Link key={`${type}-${item.id}`} href={type === "food" ? "/restaurant" : "/fashion"} className="premium-card overflow-hidden">
            <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), linear-gradient(to top, rgba(0,0,0,.78), transparent), url(${item.img})` }} />
            <div className="p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-orange">{item.category || item.cat}</div>
              <h3 className="mt-1 font-heading text-lg font-bold">{item.name}</h3>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="font-bold text-orange">{money(item.price)}</span>
                <span className="text-zinc-500">{item.rating} rating</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Deal({ title, copy, href }) {
  return (
    <Link href={href} className="premium-card p-5">
      <div className="mb-3 inline-flex rounded-full border border-orange/30 bg-orange/10 px-3 py-1 text-xs font-bold text-orange">Limited deal</div>
      <h3 className="font-heading text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm text-zinc-500">{copy}</p>
    </Link>
  );
}
