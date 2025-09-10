"use client";

import React from "react";
import { motion } from "framer-motion";

// Drop in: app/components/BenefitsStrip.tsx
// Usage: <BenefitsStrip />
// Optional: Add a faint background illustration to /public as /benefits-bg.png
// then pass backgroundSrc="/benefits-bg.png"

const items = [
  {
    title: "Free Shipping",
    desc: "Provide free home delivery for all product over $100",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      // Headset icon
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
        <path d="M4 12a8 8 0 1 1 16 0" />
        <path d="M4 12v3a3 3 0 0 0 3 3h1v-6H7a3 3 0 0 0-3 3" />
        <path d="M20 12v3a3 3 0 0 1-3 3h-1v-6h1a3 3 0 0 1 3 3" />
      </svg>
    ),
  },
  {
    title: "Online Support",
    desc: "To satisfy our customer we try to give support online",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      // Airplane icon
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
        <path d="M10 13L21 3" />
        <path d="M21 3l-6 18-3-7-7-3 16-8z" />
      </svg>
    ),
  },
  {
    title: "Secure Payment",
    desc: "We ensure our product. Good quality at all times",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      // Shield icon
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
        <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />
        <path d="M9.5 12l1.8 1.8 3.2-3.2" />
      </svg>
    ),
  },
];

export default function BenefitsStrip({ backgroundSrc }: { backgroundSrc?: string }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
      <div className="relative overflow-hidden rounded-xl bg-neutral-100">
        {/* Optional faint background image on the right */}
        {backgroundSrc && (
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            aria-hidden
          >
            <div
              className="absolute right-0 top-0 h-full w-[55%] bg-cover bg-right bg-no-repeat opacity-20"
              style={{ backgroundImage: `url(${backgroundSrc})` }}
            />
          </div>
        )}

        <ul className="grid grid-cols-1 gap-8 px-6 py-8 sm:grid-cols-3 sm:px-10 md:py-12">
          {items.map((item, i) => (
            <li key={item.title} className="flex items-start gap-4">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.06 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-4"
              >
                <span className="inline-flex size-14 items-center justify-center rounded-full bg-white text-neutral-700 ring-2 ring-red-300">
                  <span className="inline-flex size-12 items-center justify-center rounded-full ring-2 ring-red-300/70">
                    <item.icon className="size-6" />
                  </span>
                </span>

                <div>
                  <h3 className="text-xl font-extrabold text-neutral-800">{item.title}</h3>
                  <p className="mt-1 max-w-sm text-neutral-600">{item.desc}</p>
                </div>
              </motion.div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
