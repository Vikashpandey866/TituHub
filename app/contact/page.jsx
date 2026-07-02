import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { contactDetails } from "../../lib/contact";

export const metadata = {
  title: "Contact"
};

export default function ContactPage() {
  const { email, phone, whatsapp, whatsappUrl, serviceArea } = contactDetails;

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-charcoal p-6 shadow-luxury">
        <div className="text-xs font-bold uppercase tracking-widest text-orange">Contact</div>
        <h1 className="mt-2 font-heading text-4xl font-extrabold">Talk to TituHub</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
          Reach out for restaurant onboarding, fashion catalog management, print service orders or platform support.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Tile icon={Mail} label="Email" value={email} href={`mailto:${email}`} />
          <Tile icon={Phone} label="Phone" value={phone} href={`tel:${phone}`} />
          <Tile icon={MessageCircle} label="WhatsApp" value={whatsapp} href={whatsappUrl} />
          <Tile icon={MapPin} label="Service Area" value={serviceArea} />
        </div>
      </div>
    </section>
  );
}

function Tile({ icon: Icon, label, value, href }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[.04] p-4">
      <Icon className="text-orange" size={22} />
      <div className="mt-4 text-xs uppercase tracking-widest text-zinc-500">{label}</div>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="mt-1 block text-sm font-semibold text-zinc-100 transition hover:text-orange">
          {value}
        </a>
      ) : (
        <div className="mt-1 text-sm font-semibold">{value}</div>
      )}
    </div>
  );
}
