"use client";

import { useState } from "react";
import { Bot, X } from "lucide-react";
import { aiResponses } from "@/data/food";

const suggestions = ["Where is my order?", "How long delivery?", "Suggest spicy food", "Veg items?", "Payment failed"];

function responseFor(message) {
  const lower = message.toLowerCase();
  if (lower.includes("order") || lower.includes("where")) return aiResponses.order;
  if (lower.includes("delivery") || lower.includes("time") || lower.includes("long")) return aiResponses.delivery;
  if (lower.includes("spicy") || lower.includes("spice")) return aiResponses.spicy;
  if (lower.includes("veg")) return aiResponses.veg;
  if (lower.includes("payment") || lower.includes("pay") || lower.includes("failed")) return aiResponses.payment;
  return aiResponses.fallback;
}

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([{ role: "ai", text: "Hi! I'm TituAI, your food assistant. How can I help?" }]);

  const send = (text = input) => {
    const clean = text.trim();
    if (!clean) return;
    setOpen(true);
    setInput("");
    setMessages((current) => [...current, { role: "user", text: clean }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((current) => [...current, { role: "ai", text: responseFor(clean) }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1500]">
      {open && (
        <div className="mb-4 flex h-[480px] w-[min(340px,calc(100vw-48px))] animate-fadeIn flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-glow">
          <div className="flex items-center gap-3 bg-gradient-to-br from-orange to-ember px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20"><Bot size={20} /></div>
            <div><div className="font-heading text-sm font-bold">TituAI Assistant</div><div className="text-xs opacity-80">Online • Powered by AI</div></div>
            <button onClick={() => setOpen(false)} className="ml-auto rounded-full bg-white/20 p-1.5"><X size={15} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div key={index} className={`mb-3 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[240px] rounded-xl border px-3 py-2 text-sm leading-6 ${message.role === "user" ? "rounded-br-sm border-orange/30 bg-orange/20" : "rounded-bl-sm border-white/10 bg-panel2"}`}>
                  {message.text}
                </div>
              </div>
            ))}
            {typing && <div className="mb-3 max-w-[90px] rounded-xl border border-white/10 bg-panel2 px-3 py-3 text-orange">•••</div>}
          </div>
          <div className="flex flex-wrap gap-1.5 px-4 pb-3">
            {suggestions.map((item) => <button key={item} onClick={() => send(item)} className="rounded-full border border-white/15 px-2.5 py-1.5 text-xs text-zinc-500 hover:border-orange hover:text-orange">{item}</button>)}
          </div>
          <form className="flex gap-2 border-t border-white/10 p-3" onSubmit={(event) => { event.preventDefault(); send(); }}>
            <input className="min-w-0 flex-1 rounded-lg border border-white/10 bg-panel2 px-3 py-2 text-sm outline-none focus:border-orange" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask me anything..." />
            <button className="rounded-lg bg-gradient-to-br from-orange to-ember px-3 py-2 text-sm font-semibold">Send</button>
          </form>
        </div>
      )}
      <button onClick={() => setOpen((value) => !value)} className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange to-ember shadow-orange transition hover:scale-105" aria-label="Toggle AI chat">
        <Bot size={24} />
      </button>
    </div>
  );
}
