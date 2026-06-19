"use client";

import { useState } from "react";
import { Bot, Send, X } from "lucide-react";

const answers = [
  ["saree", "Premium sarees start around Rs 5,499. Open Fashion > Sarees to compare silk and wedding options."],
  ["burger", "Burger menu includes Classic Smash Burger and Paneer Makhani Burger with fast delivery."],
  ["id card", "ID card printing starts from Rs 15 per card. Bulk orders can be added from PrintHub."],
  ["delivery", "Food delivery is usually 15-30 minutes in supported zones. Fashion and PrintHub depend on service type."],
  ["timing", "Restaurant timing is 10:00 AM to 11:30 PM, with table booking available from the restaurant page."],
  ["table", "For table booking, go to Restaurant > Table Booking, enter name, phone, date, time and guests."]
];

function replyFor(message) {
  const text = message.toLowerCase();
  const found = answers.find(([keyword]) => text.includes(keyword));
  return found?.[1] || "I can help with saree price, burger menu, ID card cost, delivery time, restaurant timing and table booking.";
}

export default function TituBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi, I am TituBot. Ask about sarees, burgers, ID cards, delivery or table booking." }
  ]);

  const send = () => {
    if (!input.trim()) return;
    const question = input.trim();
    setMessages((current) => [...current, { from: "user", text: question }, { from: "bot", text: replyFor(question) }]);
    setInput("");
  };

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+9.5rem)] right-3 z-[2100] sm:bottom-24 sm:right-6">
      {open && (
        <div className="mb-3 flex h-[min(420px,62vh)] w-[min(92vw,360px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-luxury backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[.04] px-4 py-3">
            <div className="flex items-center gap-2 font-heading font-bold"><Bot className="text-orange" size={19} /> TituBot</div>
            <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-zinc-400 hover:bg-white/[.08] hover:text-white" aria-label="Close TituBot"><X size={17} /></button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div key={index} className={`max-w-[86%] rounded-2xl px-3 py-2 text-sm leading-5 ${message.from === "user" ? "ml-auto bg-orange text-white" : "bg-white/[.06] text-zinc-200"}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t border-white/10 p-3">
            <input className="input-shell py-2" placeholder="Ask TituBot..." value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send()} />
            <button onClick={send} className="rounded-xl bg-orange px-3 text-white" aria-label="Send message"><Send size={18} /></button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen((value) => !value)} className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange to-ember text-white shadow-orange transition hover:scale-105 sm:h-14 sm:w-14" aria-label="Open TituBot">
        <Bot size={22} />
      </button>
    </div>
  );
}
