"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, MessageCircle, Moon, Sun } from "lucide-react";

export default function FloatingActions() {
  const [light, setLight] = useState(false);
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+6rem)] right-3 z-[2100] flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      <button
        onClick={async () => {
          if (!("Notification" in window)) return;
          const permission = await Notification.requestPermission();
          setNotified(permission === "granted");
          if (permission === "granted") new Notification("TituHub notifications enabled");
        }}
        className={`hidden h-12 w-12 items-center justify-center rounded-full border shadow-glow backdrop-blur-xl sm:flex ${notified ? "border-orange bg-orange text-white" : "border-white/10 bg-panel text-orange"}`}
        aria-label="Enable push notifications"
      >
        <Bell size={20} />
      </button>
      <Link href="https://wa.me/919999999999" className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/20 text-emerald-300 shadow-glow backdrop-blur-xl transition hover:scale-105 sm:h-12 sm:w-12" aria-label="WhatsApp">
        <MessageCircle size={21} />
      </Link>
      <button onClick={() => setLight((value) => !value)} className="hidden h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-panel text-orange shadow-glow backdrop-blur-xl sm:flex" aria-label="Toggle theme">
        {light ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    </div>
  );
}
