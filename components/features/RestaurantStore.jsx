"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarCheck, Clock, LocateFixed, MapPin, Sparkles, Truck, Zap } from "lucide-react";
import FoodCard from "@/components/cards/FoodCard";
import AIChat from "@/components/features/AIChat";
import QRBox from "@/components/features/QRBox";
import { useApp } from "@/components/providers";
import { foodCategories } from "@/data/food";

export default function RestaurantStore() {
  const params = useSearchParams();
  const { foods: foodItems, bookTable } = useApp();
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("Prayagraj, UP - 3.2 KM away");
  const [available, setAvailable] = useState(true);
  const search = params.get("q") || "";

  const foods = useMemo(() => {
    let list = foodItems;
    if (category === "Veg") list = list.filter((item) => item.tags.includes("veg"));
    if (category === "Non-Veg") list = list.filter((item) => item.tags.includes("non-veg"));
    if (!["All", "Veg", "Non-Veg"].includes(category)) list = list.filter((item) => (item.category || "").toLowerCase() === category.toLowerCase());
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((item) => item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || (item.category || "").toLowerCase().includes(q));
    }
    return list;
  }, [category, foodItems, search]);

  const categories = useMemo(() => {
    const dynamic = foodItems.map((item) => item.category).filter(Boolean);
    return ["All", "Veg", "Non-Veg", ...Array.from(new Set([...foodCategories.filter((item) => !["All", "Veg", "Non-Veg"].includes(item)), ...dynamic]))];
  }, [foodItems]);

  const checkLocation = () => {
    const options = [
      ["Prayagraj, UP - 3.2 KM away", true],
      ["Lucknow, UP - 8.1 KM away", true],
      ["Varanasi, UP - 22 KM outside range", false]
    ];
    const [next, ok] = options[Math.floor(Math.random() * options.length)];
    setLocation(next);
    setAvailable(ok);
  };

  if (!available) {
    return (
      <section className="section-shell text-center">
        <div className="mx-auto max-w-md py-16">
          <div className="mb-4 text-6xl">😔</div>
          <h2 className="mb-2 font-heading text-2xl font-bold">Delivery Unavailable</h2>
          <p className="mb-6 text-zinc-500">Currently delivery is unavailable in your area. We&apos;re expanding soon.</p>
          <button className="rounded-xl border border-white/15 bg-white/[.04] px-5 py-3 text-sm font-semibold text-orange" onClick={() => setAvailable(true)}>Try Another Location</button>
        </div>
        <AIChat />
      </section>
    );
  }

  return (
    <>
      <div className="mx-3 mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-panel2 px-4 py-3 sm:mx-6">
        <MapPin className="text-orange" size={22} />
        <div>
          <div className="text-xs text-zinc-500">Delivering to</div>
          <strong className="text-sm">{location}</strong>
        </div>
        <button onClick={checkLocation} className="ml-auto inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[.04] px-3 py-2 text-xs text-orange">
          <LocateFixed size={14} /> Change
        </button>
      </div>

      <section className="section-shell pb-0">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="premium-panel p-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange"><Clock size={16} /> Restaurant Timing</div>
            <div className="font-heading text-2xl font-bold text-white">10:00 AM - 11:30 PM</div>
            <p className="mt-2 text-sm text-zinc-500">Table booking and QR menu ordering available daily.</p>
          </div>
          <div className="premium-panel p-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange"><Sparkles size={16} /> Today&apos;s Special</div>
            <div className="font-heading text-2xl font-bold text-white">Biryani + Burger Combo</div>
            <p className="mt-2 text-sm text-zinc-500">Chef-picked combo with premium packaging and fast dispatch.</p>
          </div>
          <div className="premium-panel p-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange"><Truck size={16} /> Delivery Status</div>
            <div className="font-heading text-2xl font-bold text-white">Live Tracking Ready</div>
            <p className="mt-2 text-sm text-zinc-500">Orders move through pending, accepted, preparing, shipped and delivered.</p>
          </div>
        </div>
      </section>

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

      <section className="section-shell">
        <h2 className="mb-6 font-heading text-2xl font-bold"><span className="gradient-text">Popular</span> Dishes</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {foods.map((food) => <FoodCard key={food.id} food={food} />)}
        </div>
        {!foods.length && (
          <div className="premium-panel py-12 text-center text-zinc-500">No dishes found for this filter.</div>
        )}
      </section>

      <section className="section-shell pt-0">
        <div className="premium-panel flex flex-wrap items-center gap-6 p-6">
          <div className="flex-1">
            <h3 className="mb-1 font-heading text-xl font-bold">QR Code Menu For Every Table</h3>
            <p className="mb-3 text-sm text-zinc-500">Scan table QR codes to open the digital menu and order from your seat.</p>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
              <Zap size={13} /> Scan & Order Instantly
            </span>
          </div>
          <QRBox />
        </div>
      </section>

      <TableBooking onSubmit={bookTable} />

      <AIChat />
    </>
  );
}

function TableBooking({ onSubmit }) {
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "", guests: "2" });
  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <section id="table-booking" className="section-shell pt-0">
      <div className="grid gap-5 rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,107,0,.14),rgba(255,255,255,.035))] p-5 shadow-luxury lg:grid-cols-[.8fr_1.2fr] lg:p-7">
        <div>
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange text-white"><CalendarCheck size={24} /></span>
          <div className="text-xs font-bold uppercase tracking-widest text-orange">Table Booking</div>
          <h2 className="mt-2 font-heading text-3xl font-extrabold">Reserve a premium dining table.</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">Bookings are saved in Firestore when Firebase is configured and mirrored locally for instant admin visibility.</p>
        </div>
        <form
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(form);
          }}
        >
          <input className="input-shell" placeholder="Name" value={form.name} onChange={(event) => setField("name", event.target.value)} />
          <input className="input-shell" placeholder="Phone" value={form.phone} onChange={(event) => setField("phone", event.target.value)} />
          <input className="input-shell" type="date" value={form.date} onChange={(event) => setField("date", event.target.value)} />
          <input className="input-shell" type="time" value={form.time} onChange={(event) => setField("time", event.target.value)} />
          <input className="input-shell" type="number" min="1" max="20" placeholder="Guests" value={form.guests} onChange={(event) => setField("guests", event.target.value)} />
          <button className="rounded-xl bg-gradient-to-br from-orange to-ember px-5 py-3 text-sm font-bold text-white shadow-orange transition hover:-translate-y-0.5">
            Confirm Booking
          </button>
        </form>
      </div>
    </section>
  );
}
