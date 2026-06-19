"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarCheck, ChevronRight, QrCode, Star, Utensils } from "lucide-react";
import { Button } from "@/components/ui/Button";
import QRBox from "@/components/features/QRBox";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink px-3 pb-10 pt-5 sm:px-6 sm:pb-8 sm:pt-6 lg:min-h-[calc(100vh-64px)]">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.08fr_.92fr] lg:items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative min-h-[520px] overflow-hidden rounded-2xl border border-white/10 bg-charcoal shadow-luxury sm:min-h-[560px] sm:rounded-[28px]"
        >
          <Image
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=90"
            alt="Premium restaurant table with gourmet food"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

          <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-between gap-8 p-4 sm:min-h-[560px] sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.07] px-3.5 py-2 text-xs font-semibold text-orange backdrop-blur-xl">
                <Star size={14} fill="currentColor" /> 4.9 rated luxury marketplace
              </span>
              <span className="rounded-full border border-white/15 bg-white/[.07] px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-xl">
                Restaurants | Fashion | PrintHub
              </span>
            </div>

            <div className="max-w-3xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.55 }}
                className="font-heading text-4xl font-extrabold leading-tight text-white drop-shadow-2xl sm:text-7xl sm:leading-[.98] lg:text-8xl"
              >
                TituHub
                <span className="block text-2xl leading-tight text-white sm:text-5xl sm:leading-[1.02] lg:text-6xl">Premium multi-business commerce.</span>
              </motion.h1>
              <p className="mt-5 max-w-xl text-base font-medium leading-7 text-zinc-100 drop-shadow">
                Order chef-made food, shop curated fashion, book tables, scan QR menus and launch professional print jobs from one polished platform.
              </p>
              <div className="mt-7 grid gap-3 min-[390px]:grid-cols-3 sm:flex sm:flex-wrap">
                <Button asChild className="min-h-12 px-3 sm:px-5"><Link href="/restaurant">Order Food <ChevronRight size={17} /></Link></Button>
                <Button variant="ghost" asChild className="min-h-12 px-3 sm:px-5"><Link href="/fashion">Shop Fashion</Link></Button>
                <Button variant="ghost" asChild className="min-h-12 px-3 sm:px-5"><Link href="/printhub">PrintHub</Link></Button>
              </div>
            </div>

            <div className="flex items-end justify-between gap-4">
              <div className="flex gap-2">
                <span className="h-2 w-8 rounded-full bg-orange" />
                <span className="h-2 w-2 rounded-full bg-white/40" />
                <span className="h-2 w-2 rounded-full bg-white/40" />
              </div>
              <div className="hidden rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl sm:block">
                <div className="text-xs text-zinc-400">Today&apos;s premium pick</div>
                <div className="mt-1 font-heading text-xl font-bold">Chef&apos;s fire-grilled menu</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1">
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18, duration: 0.5 }}
            className="premium-panel bg-white/[.045] p-5 shadow-luxury backdrop-blur-xl"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange text-white"><QrCode size={22} /></span>
              <div>
                <h2 className="font-heading text-xl font-bold">QR Menu</h2>
                <p className="text-sm text-zinc-500">Scan to open the digital restaurant menu.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <QRBox />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.26, duration: 0.5 }}
            className="premium-panel bg-white/[.045] p-5 shadow-luxury backdrop-blur-xl"
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black"><CalendarCheck size={22} /></span>
              <div>
                <h2 className="font-heading text-xl font-bold">Book a Table</h2>
                <p className="text-sm text-zinc-500">Reserve a premium dining slot in seconds.</p>
              </div>
            </div>
            <Button asChild className="w-full"><Link href="/restaurant#table-booking"><Utensils size={17} /> Reserve Now</Link></Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
