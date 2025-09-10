"use client"
import React from "react";
import { motion, AnimatePresence, type Variants, type MotionProps } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, Sparkles } from "lucide-react";

// Hero section for a car accessory e-commerce website
// Colors: Black (base), White (text), Red (accents)
// Tailwind + Framer Motion animations


const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const float = (delay = 0): MotionProps => ({
  initial: { y: 20, opacity: 0 },
  animate: {
    y: [20, -10, 20],
    opacity: 1,
    transition: {
      delay,
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
});

const shine: Variants = {
  rest: { x: "-120%" },
  hover: {
    x: "120%",
    transition: { duration: 0.9, ease: "easeInOut" }
  }
};

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-black text-white">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0">
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(239,68,68,0.22),rgba(239,68,68,0)_60%)]" />
        {/* Subtle grid */}
        <motion.div
          aria-hidden
          className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:56px_56px]"
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ repeat: Infinity, repeatType: "mirror", duration: 8, ease: "easeInOut" }}
        />
        {/* Slanted red beams */}
        <motion.div
          className="absolute -left-40 top-20 h-[120%] w-72 -skew-x-12 bg-gradient-to-b from-red-600/70 via-red-500/20 to-transparent blur-2xl"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className="absolute -right-40 bottom-0 h-[110%] w-72 -skew-x-12 bg-gradient-to-t from-red-600/70 via-red-500/20 to-transparent blur-2xl"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col-reverse items-center gap-12 px-6 py-24 md:flex-row md:gap-8 lg:px-8 lg:py-28">
        {/* Left copy */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 w-full max-w-2xl"
        >
          <motion.div variants={item} className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs backdrop-blur">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
            <span className="text-white/80">New Season • Performance Upgrades</span>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Elevate Your <span className="text-red-500">Drive</span> with
            <br className="hidden sm:block" /> Premium Car Accessories
          </motion.h1>

          <motion.p variants={item} className="mt-5 max-w-xl text-white/70">
            From aero kits to smart lighting — discover curated parts built for precision,
            style, and speed. Engineered to fit. Designed to thrill.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
            <motion.a
              whileHover="hover"
              initial="rest"
              animate="rest"
              href="#shop"
              className="group relative inline-flex items-center justify-center rounded-2xl bg-red-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-red-600/30 outline-none transition hover:bg-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              <span>Shop now</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              <motion.span
                variants={shine}
                className="pointer-events-none absolute inset-y-0 left-0 h-full w-[40%] skew-x-12 bg-white/30 mix-blend-overlay"
              />
            </motion.a>

            <a
              href="#categories"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold text-white backdrop-blur transition hover:border-white/25 hover:bg-white/10"
            >
              Explore categories
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.ul variants={item} className="mt-10 grid grid-cols-1 gap-3 text-sm text-white/70 sm:grid-cols-3">
            <li className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
              <ShieldCheck className="h-5 w-5 text-red-500" /> 2-year warranty
            </li>
            <li className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
              <Truck className="h-5 w-5 text-red-500" /> Free fast shipping
            </li>
            <li className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
              <Sparkles className="h-5 w-5 text-red-500" /> Easy returns
            </li>
          </motion.ul>
        </motion.div>

        {/* Right visual */}
        <div className="relative z-10 w-full md:max-w-xl">
          {/* Product showcase card */}
          <motion.div
            initial={{ y: 40, opacity: 0, rotate: -2 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Track-Ready Bundle</h3>
                <p className="mt-1 text-sm text-white/60">Save up to 25% on curated kits</p>
              </div>
              <span className="rounded-full bg-red-600/90 px-3 py-1 text-xs font-semibold">Hot</span>
            </div>

            {/* Mock product image area */}
            <div className="mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black via-neutral-900 to-black">
              {/* Stylized speed lines */}
              <motion.div
                className="absolute inset-0 [background:repeating-linear-gradient(135deg,rgba(255,255,255,0.06)_0_10px,transparent_10px_20px)]"
                animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
              {/* Center emblem */}
              <div className="relative z-10 flex h-full items-center justify-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="grid h-28 w-28 place-items-center rounded-full border border-white/20 bg-black/60 shadow-[0_0_120px_rgba(239,68,68,0.25)]"
                >
                  <span className="text-2xl font-black tracking-widest text-white">RPM</span>
                </motion.div>
              </div>
            </div>

            {/* Floating accessory tags */}
            <AnimatePresence>
              <motion.div className="relative mt-6 h-28">
                <motion.div
                  {...float(0)}
                  className="absolute left-2 top-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 backdrop-blur"
                >
                  <span className="h-2 w-2 rounded-full bg-red-500" /> LED Headlights
                </motion.div>
                <motion.div
                  {...float(1)}
                  className="absolute right-4 top-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 backdrop-blur"
                >
                  <span className="h-2 w-2 rounded-full bg-red-500" /> Performance Exhaust
                </motion.div>
                <motion.div
                  {...float(0.5)}
                  className="absolute left-1/2 top-14 -translate-x-1/2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 backdrop-blur"
                >
                  <span className="h-2 w-2 rounded-full bg-red-500" /> Sport Rims
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Bottom ribbon */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-10 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-xl border border-white/10"
        >
          <div className="flex items-center justify-between gap-4 bg-white/5 px-4 py-3 text-xs text-white/70 backdrop-blur sm:text-sm">
            <span>Over <b className="text-white">200,000</b> happy drivers</span>
            <span className="hidden sm:inline">Secure checkout • 24/7 support • Price match</span>
            <a href="#deals" className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white transition hover:bg-red-500">
              Today’s deals <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
