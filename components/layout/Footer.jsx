import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { contactDetails } from "../../lib/contact";

const groups = {
  Modules: [
    ["Restaurants", "/restaurant"],
    ["Fashion Store", "/fashion"],
    ["PrintHub", "/printhub"],
    ["Admin Panel", "/admin"]
  ],
  Company: [
    ["About Us", "/contact"],
    ["Contact Us", "/contact"],
    ["Profile", "/profile"],
    ["Orders", "/orders"],
    ["Checkout", "/checkout"]
  ],
  Support: [
    ["Privacy Policy", "/privacy-policy"],
    ["Terms & Conditions", "/terms"],
    ["Refund Policy", "/refund-policy"],
    ["FAQ", "/faq"]
  ]
};

export default function Footer() {
  const { email, phone, whatsappUrl, location, facebook, instagram } = contactDetails;

  return (
    <footer className="border-t border-white/10 bg-black/35 px-6 py-10 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_.8fr_.8fr_1fr]">
        <div>
          <div className="mb-3 font-heading text-[26px] font-extrabold gradient-text">TituHub</div>
          <p className="max-w-sm text-sm leading-7 text-zinc-500">Premium restaurant ordering, curated fashion and professional PrintHub services with cart, checkout, orders and admin operations.</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs text-zinc-400">
            <span className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5">Premium Dark UI</span>
            <span className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5">Secure Checkout</span>
            <span className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5">Order Emails</span>
          </div>
        </div>
        {Object.entries(groups).map(([title, links]) => (
          <div key={title}>
            <div className="mb-3 text-sm font-semibold text-white">{title}</div>
            <div className="space-y-2">
              {links.map(([label, href]) => (
                <Link key={label} href={href} className="block text-sm text-zinc-500 transition hover:text-orange">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
        <div>
          <div className="mb-3 text-sm font-semibold text-white">Business Contact</div>
          <div className="space-y-3 text-sm text-zinc-500">
            <div className="flex items-center gap-2"><Mail size={15} className="text-orange" /> <Link href={`mailto:${email}`} className="transition hover:text-orange">{email}</Link></div>
            <div className="flex items-center gap-2"><Phone size={15} className="text-orange" /> <Link href={`tel:${phone}`} className="transition hover:text-orange">{phone}</Link></div>
            <div className="flex items-center gap-2"><MapPin size={15} className="text-orange" /> {location}</div>
          </div>
          <div className="mt-5 flex gap-2">
            <Link href={facebook} target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:border-orange hover:text-orange" aria-label="Facebook"><Facebook size={17} /></Link>
            <Link href={instagram} target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:border-orange hover:text-orange" aria-label="Instagram"><Instagram size={17} /></Link>
            <Link href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:border-orange hover:text-orange" aria-label="WhatsApp"><MessageCircle size={17} /></Link>
            <Link href={`mailto:${email}`} className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:border-orange hover:text-orange" aria-label="Email"><Mail size={17} /></Link>
          </div>
          <div className="mt-5 text-xs text-zinc-600">© 2026 TituHub. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
