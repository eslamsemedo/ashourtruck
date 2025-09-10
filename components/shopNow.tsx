"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Drop in: app/components/PromotionsGrid.tsx
// Usage: <PromotionsGrid />
// Add images to /public: promo-1.jpg, promo-2.jpg, promo-3.jpg, promo-4.jpg
// You can swap the paths in the array below.

const promos = [
  // Top row (dark photos)
  {
    src: "/hero-1.jpg",
    theme: "dark" as const,
    href: "#",
    price: "$96",
    title: ["LATEST", "CAR WHEEL"] as [string, string],
  },
  {
    src: "/hero-2.jpg",
    theme: "dark" as const,
    href: "#",
    price: "$96",
    title: ["LATEST", "CAR WHEEL"] as [string, string],
  },

];

export default function PromotionsGrid() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {promos.map((p, i) => (
          <Card key={i} {...p} />
        ))}
      </div>
    </section>
  );
}

function Card({
  src,
  theme,
  href,
  price,
  title,
}: {
  src: string;
  theme: "dark" | "light";
  href: string;
  price: string;
  title: [string, string];
}) {
  const isDark = theme === "dark";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={
        isDark
          ? "relative overflow-hidden rounded-lg"
          : "relative overflow-hidden rounded-lg bg-neutral-100"
      }
    >
      {/* Image / Illustration */}
      <div className={isDark ? "relative aspect-[16/9] w-full" : "relative aspect-[16/9] w-full opacity-100"}>
        <Image
          src={src}
          alt={title.join(" ")}
          fill
          priority={isDark}
          className={isDark ? "object-cover" : "object-contain p-8"}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {isDark && (
          <div className="absolute inset-0 bg-black/40" />
        )}
      </div>

      {/* Text overlay / content */}
      <div
        className={
          isDark
            ? "pointer-events-none absolute inset-0 flex flex-col justify-center p-10 text-white"
            : "absolute inset-0 flex flex-col justify-center p-10 text-neutral-800"
        }
      >
        <p className={isDark ? "text-lg/6 font-medium text-white/90" : "text-lg/6 font-medium text-neutral-600"}>
          From {price}
        </p>
        <h3
          className={
            (isDark ? "text-white " : "text-neutral-900 ") +
            "mt-2 text-4xl font-extrabold tracking-tight"
          }
        >
          <span className="block">{title[0]}</span>
          <span className="block">{title[1]}</span>
        </h3>

        <div className="mt-6">
          <Link
            href={href}
            className="inline-flex select-none items-center gap-2 rounded-sm bg-red-500 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-red-600"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Hover lift / shine */}
      <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-black/10" />
      <div className="absolute inset-0 rounded-lg transition-transform duration-300 hover:-translate-y-0.5" />
    </motion.article>
  );
}
