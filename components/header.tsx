"use client";

import React from "react";
import { motion } from "framer-motion";
import { Car, Menu, X, ShoppingCart } from "lucide-react";

// Header / Navbar with animated Shop button
// Theme: black background, white text, red accents

export default function Header() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Brand */}
        <a href="/" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-red-500" />
          <span className="text-lg font-bold">RPM AutoGear</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <a href="/category/lighting" className="text-sm text-white/70 hover:text-white">Lighting</a>
          <a href="/category/performance" className="text-sm text-white/70 hover:text-white">Performance</a>
          <a href="/category/interior" className="text-sm text-white/70 hover:text-white">Interior</a>
          <a href="/category/wheels" className="text-sm text-white/70 hover:text-white">Wheels</a>
          <a href="/blog" className="text-sm text-white/70 hover:text-white">Blog</a>
        </nav>

        {/* Right Action Button */}
        <motion.a
          href="/shop"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative hidden items-center gap-2 overflow-hidden rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500 md:inline-flex"
        >
          <span>Shop</span>
          <ShoppingCart className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          <motion.span
            initial={{ left: "-120%" }}
            whileHover={{ left: "120%" }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-y-0 left-0 w-[40%] skew-x-12 bg-white/20 mix-blend-overlay"
          />
        </motion.a>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center rounded-lg p-2 text-white md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 1.00 }}
          className="space-y-2 border-t border-white/10 bg-black px-6 py-4 md:hidden"
        >
          <a href="/category/lighting" className="block text-sm text-white/70 hover:text-white">Lighting</a>
          <a href="/category/performance" className="block text-sm text-white/70 hover:text-white">Performance</a>
          <a href="/category/interior" className="block text-sm text-white/70 hover:text-white">Interior</a>
          <a href="/category/wheels" className="block text-sm text-white/70 hover:text-white">Wheels</a>
          <a href="/blog" className="block text-sm text-white/70 hover:text-white">Blog</a>
          <a href="/shop" className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500">
            Shop <ShoppingCart className="h-4 w-4" />
          </a>
        </motion.nav>
      )}
    </header>
  );
}