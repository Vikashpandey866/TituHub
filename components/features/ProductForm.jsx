"use client";

import { useEffect, useState } from "react";
import ImageUploadField from "@/components/forms/ImageUploadField";
import FormField from "@/components/forms/FormField";
import ModalShell from "@/components/modals/ModalShell";
import { Button } from "@/components/ui/Button";
import { fashionCategories } from "@/data/fashion";

const emptyProduct = {
  name: "",
  cat: "T-Shirts",
  price: "",
  mrp: "",
  discount: "",
  stock: "",
  stockQuantity: "",
  delivery: "",
  desc: "",
  img: "",
  imagesText: "",
  sizes: "S, M, L, XL",
  colors: "Black, White, Orange"
};

function normalizeNumber(value) {
  return Number(value || 0);
}

export default function ProductForm({ open, product, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyProduct);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(product ? {
      ...emptyProduct,
      ...product,
      cat: product.cat || product.category || "T-Shirts",
      desc: product.desc || product.description || "",
      stockQuantity: product.stockQuantity ?? product.stock ?? "",
      imagesText: (product.images || [product.img].filter(Boolean)).join("\n"),
      sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : product.sizes || emptyProduct.sizes,
      colors: Array.isArray(product.colors) ? product.colors.join(", ") : product.colors || emptyProduct.colors
    } : emptyProduct);
  }, [open, product]);

  if (!open) return null;

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    ["name", "cat", "price", "mrp", "discount", "stockQuantity", "delivery", "desc"].forEach((field) => {
      if (!String(form[field] || "").trim()) nextErrors[field] = "Required";
    });
    if (!String(form.img || form.imagesText || "").trim()) nextErrors.img = "Required";
    if (normalizeNumber(form.price) <= 0) nextErrors.price = "Enter a valid price";
    if (normalizeNumber(form.mrp) <= 0) nextErrors.mrp = "Enter a valid original price";
    if (normalizeNumber(form.mrp) < normalizeNumber(form.price)) nextErrors.mrp = "Original price must be higher";
    if (normalizeNumber(form.discount) < 0) nextErrors.discount = "Enter a valid discount";
    if (normalizeNumber(form.stockQuantity) < 0) nextErrors.stockQuantity = "Enter valid stock";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    const images = String(form.imagesText || form.img).split(/\n|,/).map((item) => item.trim()).filter(Boolean);
    onSubmit({
      ...form,
      category: form.cat,
      price: normalizeNumber(form.price),
      mrp: normalizeNumber(form.mrp),
      discount: normalizeNumber(form.discount),
      stock: normalizeNumber(form.stockQuantity),
      stockQuantity: normalizeNumber(form.stockQuantity),
      delivery: form.delivery.trim(),
      desc: form.desc.trim(),
      description: form.desc.trim(),
      images,
      img: images[0] || form.img,
      sizes: String(form.sizes).split(",").map((item) => item.trim()).filter(Boolean),
      colors: String(form.colors).split(",").map((item) => item.trim()).filter(Boolean)
    });
  };

  return (
    <ModalShell
      open={open}
      title={product ? "Edit Product" : "Add Product"}
      subtitle="Manage catalog details, inventory and product media."
      onClose={onClose}
      footer={(
        <>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="product-form">{product ? "Save Changes" : "Add Product"}</Button>
        </>
      )}
    >
      <form
        id="product-form"
        onSubmit={submit}
        className="grid gap-5 p-5 lg:grid-cols-[1fr_300px]"
      >
        <div className="space-y-4">
            <FormField label="Product Name" error={errors.name}>
              <input className="input-shell" value={form.name} onChange={(event) => setField("name", event.target.value)} placeholder="Premium Linen Shirt" />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Category" error={errors.cat}>
                <select className="input-shell" value={form.cat} onChange={(event) => setField("cat", event.target.value)}>
                  {fashionCategories.filter((item) => item !== "All").map((item) => <option key={item}>{item}</option>)}
                </select>
              </FormField>
              <FormField label="Stock Quantity" error={errors.stockQuantity}>
                <input className="input-shell" type="number" min="0" value={form.stockQuantity} onChange={(event) => setField("stockQuantity", event.target.value)} />
              </FormField>
            </div>
            <div className="grid gap-4 sm:grid-cols-4">
              <FormField label="Price" error={errors.price}>
                <input className="input-shell" type="number" min="0" value={form.price} onChange={(event) => setField("price", event.target.value)} />
              </FormField>
              <FormField label="Original Price" error={errors.mrp}>
                <input className="input-shell" type="number" min="0" value={form.mrp} onChange={(event) => setField("mrp", event.target.value)} />
              </FormField>
              <FormField label="Discount" error={errors.discount}>
                <input className="input-shell" type="number" min="0" value={form.discount} onChange={(event) => setField("discount", event.target.value)} />
              </FormField>
              <FormField label="Delivery" error={errors.delivery}>
                <input className="input-shell" value={form.delivery} onChange={(event) => setField("delivery", event.target.value)} placeholder="2-3 Days" />
              </FormField>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Sizes" error={errors.sizes}>
                <input className="input-shell" value={form.sizes} onChange={(event) => setField("sizes", event.target.value)} placeholder="S, M, L, XL" />
              </FormField>
              <FormField label="Colors" error={errors.colors}>
                <input className="input-shell" value={form.colors} onChange={(event) => setField("colors", event.target.value)} placeholder="Black, White, Orange" />
              </FormField>
            </div>
            <FormField label="Description" error={errors.desc}>
              <textarea
                className="input-shell min-h-28 resize-y"
                value={form.desc}
                onChange={(event) => setField("desc", event.target.value)}
                placeholder="Describe fabric, fit, size options and other buyer-facing details."
              />
            </FormField>
          </div>

          <div>
            <ImageUploadField label="Product Image Upload" value={form.img} error={errors.img} onChange={(value) => setField("img", value)} />
            <FormField label="Multiple Image URLs" error={errors.imagesText}>
              <textarea
                className="input-shell mt-4 min-h-28 resize-y"
                value={form.imagesText}
                onChange={(event) => setField("imagesText", event.target.value)}
                placeholder="One image URL per line"
              />
            </FormField>
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[.04] p-4 text-sm text-zinc-400">
              Products are saved to the protected admin catalog and reflected in the storefront.
            </div>
          </div>
      </form>
    </ModalShell>
  );
}
