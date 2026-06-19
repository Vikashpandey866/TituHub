"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useApp } from "@/components/providers";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin } = useApp();
  const [form, setForm] = useState({ email: "", password: "" });

  return (
    <section className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-charcoal p-6 shadow-luxury">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange text-white"><ShieldCheck size={24} /></span>
        <h1 className="font-heading text-3xl font-extrabold">Admin Login</h1>
        <p className="mt-2 text-sm text-zinc-500">Role-based protected dashboard access.</p>
        <div className="mt-6 space-y-3">
          <input className="input-shell" placeholder="Admin email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <input className="input-shell" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <Button
            className="w-full"
            onClick={async () => {
              const ok = await adminLogin(form);
              if (ok) router.push("/admin");
            }}
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </section>
  );
}
