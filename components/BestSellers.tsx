"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Flame, ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n";

// Best Sellers / Trending Products Section
// Theme: black background, white text, red accents
// Layout: responsive grid, animated cards with hover effects

export type Product = {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  href: string;
  badge?: string;
};

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const card: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const defaultProducts: Product[] = [
  {
    id: "p1",
    name: "carbonFiberSpoiler",
    price: "$299",
    imageUrl: "/hero-1.jpg",
    href: "/products/carbon-spoiler",
    badge: "badgeHot",
  },
  {
    id: "p2",
    name: "ledHeadlightKit",
    price: "$149",
    imageUrl: "/hero-1.jpg",
    href: "/products/led-headlights",
    badge: "badgeBestSeller",
  },
  {
    id: "p3",
    name: "performanceExhaust",
    price: "$499",
    imageUrl: "/hero-1.jpg",
    href: "/products/performance-exhaust",
    badge: "badgeTrending",
  },
  {
    id: "p4",
    name: "racingSportRims",
    price: "$899",
    imageUrl: "/hero-1.jpg",
    href: "/products/sport-rims",
    badge: "badgeNew",
  },
];

export default function BestSellers({
  products = defaultProducts,
  headline = "bestSellersHeadline",
  kicker = "bestSellersKicker",
}: {
  products?: Product[];
  headline?: string;
  kicker?: string;
}) {
  const { t } = useT();
  return (
    <section className="relative w-full bg-black py-20 text-white">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex items-end justify-between gap-6"
        >
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
              <Flame className="h-3.5 w-3.5 text-red-500" /> {t(kicker as any)}
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{t(headline as any)}</h2>
          </div>

          <a
            href="/products"
            className="group relative inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:border-white/25 hover:bg-white/10"
          >
            {t('viewAll')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        {/* Products Grid */}
        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {products.map((p) => (
            <motion.li key={p.id} variants={card}>
              <a
                href={p.href}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur transition hover:border-white/20 hover:shadow-[0_0_60px_-10px_rgba(239,68,68,0.35)]"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={p.imageUrl}
                    alt={t(p.name as any)}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {p.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-red-600/90 px-3 py-1 text-xs font-semibold text-white shadow">
                      {t(p.badge as any)}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h3 className="text-base font-bold leading-snug">{t(p.name as any)}</h3>
                    <p className="mt-1 text-sm text-white/70">{p.price}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-white/60">{t('freeShipping')}</span>
                    <span className="rounded-full bg-red-600/80 px-2 py-0.5 text-[10px] font-semibold">{t('buy')}</span>
                  </div>
                </div>
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}