"use client";

import React from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import Image from "next/image";

// ----------
// Drop this file in: app/components/Hero.tsx (or anywhere in your Next app)
// Usage in a page: <Hero />
// Put 3 images in /public (eg: /hero-1.jpg, /hero-2.jpg, /hero-3.jpg)
// Or point to remote images and add their domains to next.config.js images.domains
// ----------

const words = ["Build", "bold.", "Ship", "faster."];

export default function Hero() {
  const { scrollY } = useScroll();

  // Parallax for the image stack
  const y1 = useTransform(scrollY, [0, 600], [0, -40]);
  const y2 = useTransform(scrollY, [0, 600], [0, -80]);
  const y3 = useTransform(scrollY, [0, 600], [0, -120]);

  // Subtle scale (Ken Burns feel)
  const scale1 = useTransform(scrollY, [0, 600], [1, 1.06]);
  const scale2 = useTransform(scrollY, [0, 600], [1, 1.08]);
  const scale3 = useTransform(scrollY, [0, 600], [1, 1.1]);

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section className="relative isolate overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -inset-[20%] bg-[radial-gradient(ellipse_at_top_left,rgba(56,189,248,0.25),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(192,132,252,0.25),transparent_50%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/40 to-background" />
      </div>

      <div className="mx-auto flex min-h-[92vh] w-full max-w-7xl flex-col items-center gap-10 px-6 py-24 md:flex-row md:gap-16 lg:px-8">
        {/* Left: Text */}
        <div className="relative z-10 w-full max-w-xl md:flex-1">
          <motion.h1
            className="text-balance text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
            initial="hidden"
            animate="show"
          >
            {words.map((w, i) => (
              <motion.span
                key={w + i}
                custom={i}
                variants={wordVariants}
                className={
                  i % 2 === 0
                    ? "mr-3 inline-block bg-gradient-to-r from-sky-400 to-red-500 bg-clip-text text-transparent"
                    : "mr-3 inline-block"
                }
              >
                {w}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            className="mt-6 max-w-prose text-lg text-muted-foreground md:text-xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            The kind of hero that lands with a smooth staggered reveal, subtle parallax, and a gentle zoom on media. Swap images, tweak speeds, and ship.
          </motion.p>

          <div className="mt-8 flex items-center gap-4">
            <motion.a
              href="#get-started"
              className="rounded-2xl px-5 py-3 font-medium shadow-lg shadow-sky-500/10 ring-1 ring-sky-400/30 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-sky-500/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              Get started
            </motion.a>
            <motion.a
              href="#learn-more"
              className="rounded-2xl px-5 py-3 font-medium text-muted-foreground ring-1 ring-border transition hover:-translate-y-0.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              Learn more
            </motion.a>
          </div>
        </div>

        {/* Right: Image Stack */}
        <div className="relative w-full md:flex-1">
          <div className="relative mx-auto grid max-w-lg grid-cols-3 gap-4 sm:gap-5">
            {/* Card 1 */}
            <motion.div
              style={{ y: y1, scale: scale1 }}
              className="col-span-2 row-span-2 overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5"
              initial={{ opacity: 0, y: 20, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            >
              <Image
                src="/hero-1.jpg"
                alt="Showcase 1"
                width={1200}
                height={900}
                priority
                className="h-full w-full object-cover"
              />
            </motion.div>

            {/* Card 2 */}
            <motion.div
              style={{ y: y2, scale: scale2 }}
              className="col-span-1 row-span-1 overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5"
              initial={{ opacity: 0, y: 24, rotate: 2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
            >
              <Image
                src="/hero-2.jpg"
                alt="Showcase 2"
                width={800}
                height={800}
                className="h-full w-full object-cover"
              />
            </motion.div>

            {/* Card 3 */}
            <motion.div
              style={{ y: y3, scale: scale3 }}
              className="col-span-1 row-span-1 overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5"
              initial={{ opacity: 0, y: 28, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
            >
              <Image
                src="/hero-3.jpg"
                alt="Showcase 3"
                width={800}
                height={800}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>

          {/* Floating glow */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="pointer-events-none absolute -inset-10 -z-10 blur-3xl"
          >
            <div className="size-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.25),transparent),radial-gradient(closest-side,rgba(192,132,252,0.25),transparent)]" />
          </motion.div>
        </div>
      </div>

      {/* Bottom scroll hint */}
      <motion.div
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 md:flex"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        {/* <span className="text-sm text-muted-foreground">Scroll</span> */}
        <span className="h-5 w-px bg-border " />
        <span className=" bg-black inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/60" />
      </motion.div>
    </section>
  );
}
