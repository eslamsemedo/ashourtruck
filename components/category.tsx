"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";

// Drop in: app/components/TopCategory.tsx
// Usage: <TopCategory />
// Put 6 images in /public: cat-1.jpg ... cat-6.jpg (or rename below)

const items = [
  { title: "Tail Light", src: "/category/cat-1.jpg" },
  { title: "Wiper Blades", src: "/category/cat-2.jpg" },
  { title: "Suspension", src: "/category/cat-3.jpg" },
  { title: "Air Filter", src: "/category/cat-4.jpg" },
  { title: "Car Brakes", src: "/category/cat-5.jpg" },
  { title: "Pistons Liners", src: "/category/cat-6.jpg" },
];

export default function TopCategory() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
      {/* Heading */}
      <div className="mb-10 flex items-center gap-4">
        <span className="h-[2px] w-8 bg-red-500" />
        <h2 className="text-3xl font-extrabold uppercase tracking-wide md:text-4xl">
          Top Category
        </h2>
      </div>

      {/* Grid */}
      <ul className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((item, idx) => (
          <li key={item.title} className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.05 * idx, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto w-full max-w-[210px] overflow-hidden rounded-md bg-neutral-100  shadow-sm ring-1 ring-black/5"
            >
              <div className="relative mx-auto aspect-square w-full">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 210px, 200px"
                  className="object-cover"
                  priority={idx < 3}
                />
              </div>
            </motion.div>
            <p className="mt-5 text-lg font-medium ">{item.title}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
