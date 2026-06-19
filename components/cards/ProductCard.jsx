"use client";

import Image from "next/image";
import { Heart, Pencil, Trash2, Truck } from "lucide-react";
import { useApp } from "@/components/providers";
import { money } from "@/lib/format";

export default function ProductCard({ product, admin = false, onEdit, onDelete }) {
  const { addToCart, wishlist, toggleWish, showToast } = useApp();
  const saved = product.mrp - product.price;
  const active = wishlist.includes(product.id);
  const isDataImage = product.img?.startsWith("data:");

  return (
    <article className="premium-card group cursor-pointer overflow-hidden" onClick={() => showToast("Product detail page coming soon")}>
      <div className="relative aspect-[3/2] overflow-hidden bg-panel2">
        <Image
          src={product.img}
          alt={product.name}
          fill
          unoptimized={isDataImage}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-2.5 top-2.5 rounded-md bg-gradient-to-br from-ember to-red-700 px-2 py-1 text-xs font-bold text-white">-{product.discount}%</div>
        {admin ? (
          <div className="absolute right-2.5 top-2.5 flex gap-2">
            <button
              onClick={(event) => {
                event.stopPropagation();
                onEdit?.(product);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur transition hover:bg-orange"
              aria-label="Edit product"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                onDelete?.(product);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur transition hover:bg-ember"
              aria-label="Delete product"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={(event) => {
              event.stopPropagation();
              toggleWish(product.id);
            }}
            className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-ember"
            aria-label="Toggle wishlist"
          >
            <Heart size={16} fill={active ? "currentColor" : "none"} />
          </button>
        )}
      </div>
      <div className="p-3.5">
        <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-orange">{product.cat}</div>
        <h3 className="mb-2 font-heading text-[15px] font-semibold leading-snug">{product.name}</h3>
        {admin && (
          <div className="mb-2 grid grid-cols-2 gap-2 text-xs text-zinc-500">
            <span className="rounded-lg bg-white/[.04] px-2 py-1">Stock: <b className="text-white">{product.stock ?? 0}</b></span>
            <span className="rounded-lg bg-white/[.04] px-2 py-1">Source: <b className="text-white">{product.source === "admin" ? "Admin" : "Seed"}</b></span>
          </div>
        )}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="text-lg font-bold text-orange">{money(product.price)}</span>
          <span className="text-sm text-zinc-500 line-through">{money(product.mrp)}</span>
          <span className="text-xs font-semibold text-emerald-400">Save {money(saved)}</span>
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span className="text-gold">{"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}</span>
          <span>{product.rating} ({product.reviews})</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/30 bg-blue-500/15 px-2 py-1 text-blue-300"><Truck size={12} /> {product.delivery}</span>
        </div>
        {admin ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(event) => {
                event.stopPropagation();
                onEdit?.(product);
              }}
              className="rounded-lg border border-white/15 bg-white/[.06] px-3 py-2.5 text-sm font-semibold text-white transition hover:border-orange"
            >
              Edit
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                onDelete?.(product);
              }}
              className="rounded-lg border border-ember/30 bg-ember/15 px-3 py-2.5 text-sm font-semibold text-ember transition hover:bg-ember hover:text-white"
            >
              Delete
            </button>
          </div>
        ) : (
          <button
            onClick={(event) => {
              event.stopPropagation();
              addToCart(product, "fashion");
            }}
            className="w-full rounded-lg bg-gradient-to-br from-orange to-ember px-3 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-orange"
          >
            Add to Cart
          </button>
        )}
      </div>
    </article>
  );
}
