"use client";

import { useEffect, useState } from "react";
import FormField from "@/components/forms/FormField";
import ImageUploadField from "@/components/forms/ImageUploadField";
import ModalShell from "@/components/modals/ModalShell";
import { Button } from "@/components/ui/Button";
import { foodCategories } from "@/data/food";

const emptyFood = {
  name: "",
  desc: "",
  price: "",
  category: "Starters",
  eta: "",
  veg: true,
  available: true,
  todaySpecial: false,
  bestSeller: false,
  img: ""
};

function toNumber(value) {
  return Number(value || 0);
}

function formFromFood(food) {
  const tags = food?.tags || [];
  return {
    ...emptyFood,
    ...food,
    category: food?.category || "Starters",
    veg: !tags.includes("non-veg"),
    available: food?.available !== false,
    todaySpecial: Boolean(food?.todaySpecial || tags.includes("today-special")),
    bestSeller: Boolean(food?.bestSeller || tags.includes("popular"))
  };
}

export default function FoodForm({ open, food, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyFood);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(food ? formFromFood(food) : emptyFood);
  }, [food, open]);

  if (!open) return null;

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    ["name", "desc", "price", "category", "eta", "img"].forEach((field) => {
      if (!String(form[field] || "").trim()) nextErrors[field] = "Required";
    });
    if (toNumber(form.price) <= 0) nextErrors.price = "Enter a valid price";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    const tags = [form.veg ? "veg" : "non-veg"];
    if (form.todaySpecial) tags.push("today-special");
    if (form.bestSeller) tags.push("popular");
    onSubmit({
      name: form.name.trim(),
      desc: form.desc.trim(),
      description: form.desc.trim(),
      price: toNumber(form.price),
      category: form.category,
      eta: form.eta.trim(),
      img: form.img,
      isVeg: form.veg,
      available: form.available,
      todaySpecial: form.todaySpecial,
      bestSeller: form.bestSeller,
      tags,
      popular: form.bestSeller
    });
  };

  return (
    <ModalShell
      open={open}
      title={food ? "Edit Dish" : "Add Food Item"}
      subtitle="Manage menu details, pricing, tags and food media."
      onClose={onClose}
      footer={(
        <>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="food-form">{food ? "Save Changes" : "Add Dish"}</Button>
        </>
      )}
    >
      <form id="food-form" onSubmit={submit} className="grid gap-5 p-5 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <FormField label="Dish Name" error={errors.name}>
            <input className="input-shell" value={form.name} onChange={(event) => setField("name", event.target.value)} placeholder="Paneer Butter Masala" />
          </FormField>
          <FormField label="Description" error={errors.desc}>
            <textarea className="input-shell min-h-24 resize-y" value={form.desc} onChange={(event) => setField("desc", event.target.value)} placeholder="Short buyer-facing dish description." />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Price" error={errors.price}>
              <input className="input-shell" type="number" min="0" value={form.price} onChange={(event) => setField("price", event.target.value)} />
            </FormField>
            <FormField label="Category" error={errors.category}>
              <select className="input-shell" value={form.category} onChange={(event) => setField("category", event.target.value)}>
                {foodCategories.filter((item) => !["All", "Veg", "Non-Veg"].includes(item)).map((item) => <option key={item}>{item}</option>)}
              </select>
            </FormField>
            <FormField label="Delivery Time" error={errors.eta}>
              <input className="input-shell" value={form.eta} onChange={(event) => setField("eta", event.target.value)} placeholder="20 min" />
            </FormField>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Toggle label="Veg" checked={form.veg} onChange={(checked) => setField("veg", checked)} />
            <Toggle label="Available" checked={form.available} onChange={(checked) => setField("available", checked)} />
            <Toggle label="Today's Special" checked={form.todaySpecial} onChange={(checked) => setField("todaySpecial", checked)} />
            <Toggle label="Best Seller" checked={form.bestSeller} onChange={(checked) => setField("bestSeller", checked)} />
          </div>
        </div>
        <div>
          <ImageUploadField label="Food Image Upload" value={form.img} error={errors.img} onChange={(value) => setField("img", value)} />
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[.04] p-4 text-sm text-zinc-400">
            New dishes are saved locally and instantly appear on the restaurant storefront.
          </div>
        </div>
      </form>
    </ModalShell>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition ${checked ? "border-orange bg-orange/15 text-orange" : "border-white/10 bg-panel2 text-zinc-400"}`}
    >
      <span>{label}</span>
      <span className={`h-5 w-9 rounded-full p-0.5 transition ${checked ? "bg-orange" : "bg-white/15"}`}>
        <span className={`block h-4 w-4 rounded-full bg-white transition ${checked ? "translate-x-4" : ""}`} />
      </span>
    </button>
  );
}
