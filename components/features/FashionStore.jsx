"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/cards/ProductCard";
import { useApp } from "@/components/providers";
import { fashionCategories } from "@/data/fashion";

export default function FashionStore({ compact = false }) {
  const params = useSearchParams();
  const { products: fashionProducts } = useApp();
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Featured");
  const search = params.get("q") || "";

  const categories = useMemo(() => {
    const dynamic = fashionProducts.map((item) => item.cat).filter(Boolean);
    return ["All", ...Array.from(new Set([...fashionCategories.filter((item) => item !== "All"), ...dynamic]))];
  }, [fashionProducts]);

  const products = useMemo(() => {
    let list = category === "All" ? fashionProducts : fashionProducts.filter((item) => item.cat === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((item) => item.name.toLowerCase().includes(q) || item.cat.toLowerCase().includes(q));
    }
    if (sort === "Price: Low to High") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "Rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return compact ? list.slice(0, 4) : list;
  }, [category, compact, fashionProducts, search, sort]);

  return (
    <>
      {!compact && (
        <div className="section-shell pb-0">
          <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${category === item ? "border-transparent bg-gradient-to-br from-orange to-ember text-white" : "border-white/10 bg-white/[.04] text-zinc-500 hover:text-white"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
      <section className="section-shell">
        {!compact && (
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="font-heading text-2xl font-bold">All <span className="gradient-text">Products</span></h2>
            <select className="rounded-lg border border-white/10 bg-panel2 px-3 py-2 text-sm text-white outline-none" value={sort} onChange={(event) => setSort(event.target.value)}>
              {["Featured", "Price: Low to High", "Price: High to Low", "Rating"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </>
  );
}
