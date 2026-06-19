"use client";

import { useApp } from "@/components/providers";
import { cn } from "@/lib/format";

export default function Toast() {
  const { toast } = useApp();

  return (
    <div
      className={cn(
        "fixed bottom-24 left-1/2 z-[5000] -translate-x-1/2 translate-y-5 rounded-xl border border-white/15 bg-panel2 px-5 py-3 text-sm font-medium opacity-0 transition duration-300",
        toast && "translate-y-0 opacity-100"
      )}
    >
      {toast}
    </div>
  );
}
