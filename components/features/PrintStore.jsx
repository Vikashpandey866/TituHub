"use client";

import { useMemo, useState } from "react";
import PrintCard from "@/components/cards/PrintCard";
import { useApp } from "@/components/providers";
import { printServices } from "@/data/print";
import { Button } from "@/components/ui/Button";
import { money } from "@/lib/format";

export default function PrintStore() {
  const { addCustomPrintOrder } = useApp();
  const [file, setFile] = useState(null);
  const [serviceName, setServiceName] = useState(printServices[0].name);
  const [qty, setQty] = useState(1);
  const [distance, setDistance] = useState("");

  const selected = printServices.find((item) => item.name === serviceName) || printServices[0];
  const estimate = useMemo(() => {
    const km = Number(distance);
    if (!km) return null;
    return {
      type: km <= 15 ? "Local Express" : "Outstation Standard",
      delivery: km <= 15 ? "1-2 Business Days" : "3+ Business Days"
    };
  }, [distance]);

  return (
    <>
      <section className="section-shell">
        <h2 className="mb-6 font-heading text-2xl font-bold">Our <span className="gradient-text">Print Services</span></h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {printServices.map((service) => <PrintCard key={service.id} service={service} />)}
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="premium-panel p-6 sm:p-7">
          <h3 className="mb-1 font-heading text-xl font-bold">Upload Design & Order Form</h3>
          <p className="mb-5 text-sm text-zinc-500">Upload your file, choose a printing service, calculate pricing and add the job to cart.</p>
          <label className="block cursor-pointer rounded-xl border-2 border-dashed border-white/15 p-8 text-center transition hover:border-orange hover:bg-orange/5">
            <input className="hidden" type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} />
            <div className="mb-3 font-heading text-4xl font-bold text-orange">PDF</div>
            <div className="mb-1 text-sm font-semibold">Drop files here or click to upload</div>
            <div className="text-sm text-zinc-500">PDF, PNG, JPG, AI, PSD supported</div>
            {file && <div className="mt-3 text-sm font-semibold text-orange">{file.name} uploaded ({Math.round(file.size / 1024)} KB)</div>}
          </label>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm text-zinc-500">Service Type</label>
              <select className="input-shell" value={serviceName} onChange={(event) => setServiceName(event.target.value)}>
                {printServices.map((service) => <option key={service.id}>{service.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-500">Quantity</label>
              <div className="flex items-center gap-2">
                <button className="h-10 w-10 rounded-lg border border-white/15 bg-white/[.08]" onClick={() => setQty((value) => Math.max(1, value - 1))}>-</button>
                <input className="input-shell max-w-24 text-center" type="number" min="1" value={qty} onChange={(event) => setQty(Math.max(1, Number(event.target.value) || 1))} />
                <button className="h-10 w-10 rounded-lg border border-white/15 bg-white/[.08]" onClick={() => setQty((value) => value + 1)}>+</button>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-500">Your Location (KM)</label>
              <input className="input-shell" type="number" placeholder="e.g. 10" value={distance} onChange={(event) => setDistance(event.target.value)} />
            </div>
          </div>

          {estimate && (
            <div className="mt-5 grid gap-4 rounded-xl border border-white/10 bg-panel2 p-4 text-sm sm:grid-cols-3">
              <div><div className="text-xs text-zinc-500">Distance</div><strong>{distance} KM</strong></div>
              <div><div className="text-xs text-zinc-500">Delivery Type</div><strong>{estimate.type}</strong></div>
              <div><div className="text-xs text-zinc-500">Estimated Delivery</div><strong className="text-orange">{estimate.delivery}</strong></div>
            </div>
          )}

          <Button className="mt-5" onClick={() => addCustomPrintOrder({ name: serviceName, price: selected.price * qty, icon: "Print", img: "", file: file?.name || "" })}>
            Add Print Order to Cart ({money(selected.price * qty)})
          </Button>
        </div>
      </section>
    </>
  );
}
