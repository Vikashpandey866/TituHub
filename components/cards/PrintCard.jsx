"use client";

import { Award, Badge, BookOpen, BriefcaseBusiness, Camera, Coffee, FileText, Flag, Image as ImageIcon, Mail, Palette, Printer, Shirt, Sticker, Tags, Utensils } from "lucide-react";
import { useApp } from "@/components/providers";
import { money } from "@/lib/format";

export default function PrintCard({ service }) {
  const { addToCart } = useApp();
  const icons = {
    Award,
    Badge,
    BookOpen,
    BriefcaseBusiness,
    Camera,
    Coffee,
    FileText,
    Flag,
    Image: ImageIcon,
    Mail,
    Palette,
    Shirt,
    Sticker,
    Tags,
    Utensils
  };
  const Icon = icons[service.icon] || Printer;

  return (
    <article className="premium-card p-5">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-orange/30 bg-gradient-to-br from-orange/20 to-ember/20 text-orange">
        <Icon size={28} />
      </div>
      <h3 className="mb-2 font-heading text-base font-bold">{service.name}</h3>
      <p className="mb-4 min-h-12 text-sm leading-6 text-zinc-500">{service.desc}</p>
      <div className="text-sm font-semibold text-orange">From {money(service.price)} {service.unit}</div>
      <div className="mt-1 text-xs text-zinc-500">Local: {service.delivery1} | Outstation: {service.delivery2}</div>
      <button
        onClick={() => addToCart({ ...service, img: "", icon: "Print" }, "print")}
        className="mt-4 w-full rounded-lg border border-white/15 bg-white/[.08] px-4 py-2.5 text-sm font-semibold transition hover:border-transparent hover:bg-gradient-to-br hover:from-orange hover:to-ember"
      >
        Order Now
      </button>
    </article>
  );
}
