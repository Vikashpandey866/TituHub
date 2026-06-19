"use client";

import { X } from "lucide-react";

export default function ModalShell({ open, title, subtitle, children, footer, onClose, width = "max-w-4xl" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[3200] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <section
        className={`max-h-[92vh] w-full ${width} animate-fadeIn overflow-y-auto rounded-2xl border border-white/10 bg-panel shadow-glow`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-panel/95 px-5 py-4 backdrop-blur">
          <div>
            <h2 className="font-heading text-xl font-bold">{title}</h2>
            {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 bg-white/[.04] p-2 text-zinc-400 transition hover:text-white">
            <X size={18} />
          </button>
        </div>
        {children}
        {footer && (
          <div className="sticky bottom-0 flex flex-wrap justify-end gap-3 border-t border-white/10 bg-panel/95 px-5 py-4 backdrop-blur">
            {footer}
          </div>
        )}
      </section>
    </div>
  );
}
