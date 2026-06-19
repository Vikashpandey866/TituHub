const faqs = [
  ["How fast is delivery?", "Restaurant delivery usually takes 15-30 minutes in supported zones."],
  ["Can I book a table?", "Yes, use the Restaurant table booking form."],
  ["Can I upload print designs?", "Yes, PrintHub supports PDF, PNG, JPG, AI and PSD uploads."]
];

export default function FAQPage() {
  return <section className="section-shell"><div className="mx-auto max-w-3xl space-y-3">{faqs.map(([q,a]) => <div key={q} className="premium-panel p-5"><h2 className="font-heading text-lg font-bold">{q}</h2><p className="mt-2 text-sm text-zinc-500">{a}</p></div>)}</div></section>;
}
