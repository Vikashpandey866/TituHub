"use client";

import Image from "next/image";
import { Clock, Pencil, Trash2 } from "lucide-react";
import { useApp } from "@/components/providers";
import { money } from "@/lib/format";

const tagStyles = {
  veg: "border-emerald-400/30 bg-emerald-500/15 text-emerald-400",
  "non-veg": "border-ember/30 bg-ember/15 text-ember",
  spicy: "border-orange/30 bg-orange/15 text-orange",
  popular: "border-gold/30 bg-gold/15 text-gold"
};

export default function FoodCard({ food, admin = false, onEdit, onDelete }) {
  const { addToCart } = useApp();
  const isDataImage = food.img?.startsWith("data:");

  return (
    <article className="premium-card flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] bg-panel2">
        <Image src={food.img} alt={food.name} fill unoptimized={isDataImage} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 hover:scale-105" />
        {admin && (
          <div className="absolute right-2.5 top-2.5 flex gap-2">
            <button
              onClick={() => onEdit?.(food)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur transition hover:bg-orange"
              aria-label="Edit dish"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => onDelete?.(food)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur transition hover:bg-ember"
              aria-label="Delete dish"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3.5">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {food.tags.map((tag) => (
            <span key={tag} className={`rounded-full border px-2 py-1 text-[11px] font-medium ${tagStyles[tag] || tagStyles.popular}`}>
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mb-1 font-heading text-[15px] font-semibold">{food.name}</h3>
        <p className="mb-3 min-h-10 flex-1 text-xs leading-5 text-zinc-500">{food.desc}</p>
        {admin && (
          <div className="mb-3 grid grid-cols-2 gap-2 text-xs text-zinc-500">
            <span className="rounded-lg bg-white/[.04] px-2 py-1">Category: <b className="text-white">{food.category || "Menu"}</b></span>
            <span className="rounded-lg bg-white/[.04] px-2 py-1">Source: <b className="text-white">{food.source === "admin" ? "Admin" : "Seed"}</b></span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-orange">{money(food.price)}</div>
            <div className="flex items-center gap-1 text-xs text-zinc-500"><Clock size={12} /> {food.deliveryTime || food.eta} | {food.rating || 4.6} rating</div>
          </div>
          {admin ? (
            <div className="flex gap-2">
              <button onClick={() => onEdit?.(food)} className="rounded-lg border border-white/15 bg-white/[.06] px-3 py-2 text-sm font-semibold text-white transition hover:border-orange">Edit</button>
              <button onClick={() => onDelete?.(food)} className="rounded-lg border border-ember/30 bg-ember/15 px-3 py-2 text-sm font-semibold text-ember transition hover:bg-ember hover:text-white">Delete</button>
            </div>
          ) : (
            <button onClick={() => addToCart(food, "food")} className="rounded-lg bg-gradient-to-br from-orange to-ember px-4 py-2 text-sm font-semibold text-white transition hover:scale-105">
              Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
