"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, MapPin, ShoppingBag } from "lucide-react";
import { useApp } from "@/components/providers";
import { Button } from "@/components/ui/Button";
import { money } from "@/lib/format";

const initialCheckout = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  paymentMethod: "UPI / GPay"
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user, cart, subtotal, delivery, total, placeOrder, showToast, setAuthModal } = useApp();
  const [form, setForm] = useState(() => ({
    ...initialCheckout,
    fullName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || ""
  }));
  const [successId, setSuccessId] = useState("");
  const [loading, setLoading] = useState(false);

  const missingFields = useMemo(
    () => ["fullName", "phone", "email", "address", "city", "state", "pincode"].filter((field) => !String(form[field] || "").trim()),
    [form]
  );

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!user) {
      setAuthModal("login");
      showToast("Please login before checkout");
      return;
    }
    if (!cart.length) {
      showToast("Your cart is empty");
      return;
    }
    if (missingFields.length) {
      showToast("Please complete all checkout fields");
      return;
    }
    setLoading(true);
    const orderId = placeOrder(form);
    setLoading(false);
    if (!orderId) return;
    setSuccessId(orderId);
    setTimeout(() => router.push(`/orders?success=${encodeURIComponent(orderId)}`), 1400);
  };

  return (
    <section className="section-shell">
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-widest text-orange">Checkout</div>
        <h1 className="mt-2 font-heading text-3xl font-extrabold">Complete Your Order</h1>
        <p className="mt-1 text-sm text-zinc-500">Review your products, delivery charge and customer details before placing the order.</p>
      </div>

      {!cart.length && !successId ? (
        <div className="premium-panel mx-auto max-w-xl p-8 text-center">
          <ShoppingBag className="mx-auto mb-4 text-orange" size={42} />
          <h2 className="font-heading text-2xl font-bold">Your cart is empty</h2>
          <p className="mt-2 text-sm text-zinc-500">Add restaurant, fashion or PrintHub items before checkout.</p>
          <Button asChild className="mt-6"><Link href="/">Explore TituHub</Link></Button>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
          <motion.form initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="premium-panel p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange text-white"><MapPin size={21} /></span>
              <div>
                <h2 className="font-heading text-xl font-bold">Shipping Details</h2>
                <p className="text-sm text-zinc-500">All fields are required for order creation.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input-shell" placeholder="Full Name" value={form.fullName} onChange={(event) => setField("fullName", event.target.value)} />
              <input className="input-shell" placeholder="Phone Number" value={form.phone} onChange={(event) => setField("phone", event.target.value)} />
              <input className="input-shell sm:col-span-2" placeholder="Email" type="email" value={form.email} onChange={(event) => setField("email", event.target.value)} />
              <textarea className="input-shell min-h-28 resize-y sm:col-span-2" placeholder="Address" value={form.address} onChange={(event) => setField("address", event.target.value)} />
              <input className="input-shell" placeholder="City" value={form.city} onChange={(event) => setField("city", event.target.value)} />
              <input className="input-shell" placeholder="State" value={form.state} onChange={(event) => setField("state", event.target.value)} />
              <input className="input-shell" placeholder="Pincode" value={form.pincode} onChange={(event) => setField("pincode", event.target.value)} />
              <select className="input-shell" value={form.paymentMethod} onChange={(event) => setField("paymentMethod", event.target.value)}>
                {["UPI / GPay", "Card", "Cash on Delivery"].map((method) => <option key={method}>{method}</option>)}
              </select>
            </div>

            <Button className="mt-6 w-full" disabled={loading || Boolean(successId)}>
              {loading ? "Placing Order..." : "Place Order"}
            </Button>
          </motion.form>

          <motion.aside initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="premium-panel h-fit p-5 sm:p-6">
            <h2 className="mb-4 font-heading text-xl font-bold">Order Summary</h2>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex gap-3 rounded-xl border border-white/10 bg-white/[.035] p-3">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-panel2">
                    {item.img ? <Image src={item.img} alt={item.name} fill sizes="56px" className="object-cover" /> : <ShoppingBag size={20} className="text-orange" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{item.name}</div>
                    <div className="mt-1 text-xs text-zinc-500">Qty {item.qty} | {item.type}</div>
                  </div>
                  <div className="text-sm font-bold">{money(item.price * item.qty)}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between text-zinc-500"><span>Products</span><span>{cart.reduce((sum, item) => sum + item.qty, 0)} item(s)</span></div>
              <div className="flex justify-between text-zinc-500"><span>Subtotal</span><span>{money(subtotal)}</span></div>
              <div className="flex justify-between text-zinc-500"><span>Delivery Charge</span><span className={delivery ? "" : "text-emerald-400"}>{delivery ? money(delivery) : "FREE"}</span></div>
              <div className="flex justify-between pt-2 font-heading text-lg font-bold"><span>Total Amount</span><span className="text-orange">{money(total)}</span></div>
            </div>
          </motion.aside>
        </div>
      )}

      <AnimatePresence>
        {successId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.85, y: 18 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-md rounded-2xl border border-emerald-400/20 bg-panel p-8 text-center shadow-luxury">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 14 }} className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                <CheckCircle2 size={42} />
              </motion.div>
              <h2 className="font-heading text-2xl font-bold">Order Placed Successfully</h2>
              <p className="mt-2 text-sm text-zinc-400">Your order {successId} has been created.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
