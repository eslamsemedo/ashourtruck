// "use client";

// import React from "react";
// import { motion, type Variants } from "framer-motion";
// import { Wrench, Lightbulb, Gauge, LifeBuoy, Car, Cpu, Disc3, Sparkles } from "lucide-react";

// // Featured Categories Section
// // Theme: black background, white text, red accents
// // Tailwind + Framer Motion animations to match the Hero style

// export type Category = {
//   id: string;
//   title: string;
//   href: string;
//   tagline?: string;
//   icon?: React.ReactNode;
//   imageUrl?: string; // optional background image
// };

// const container: Variants = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: { staggerChildren: 0.08 }
//   }
// };

// const card: Variants = {
//   hidden: { opacity: 0, y: 24, scale: 0.98 },
//   show: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
//   }
// };

// const defaultCategories: Category[] = [
//   {
//     id: "lighting",
//     title: "Lighting",
//     href: "/category/lighting",
//     tagline: "LED & Laser precision",
//     icon: <Lightbulb className="h-5 w-5 text-red-500" />,
//   },
//   {
//     id: "performance",
//     title: "Performance",
//     href: "/category/performance",
//     tagline: "Exhaust, intakes, ECU",
//     icon: <Gauge className="h-5 w-5 text-red-500" />,
//   },
//   {
//     id: "interior",
//     title: "Interior",
//     href: "/category/interior",
//     tagline: "Seats, mats, trim",
//     icon: <LifeBuoy className="h-5 w-5 text-red-500" />,
//   },
//   {
//     id: "wheels",
//     title: "Wheels & Rims",
//     href: "/category/wheels",
//     tagline: "Strength & style",
//     icon: <Disc3 className="h-5 w-5 text-red-500" />,
//   },
//   {
//     id: "exterior",
//     title: "Aero & Exterior",
//     href: "/category/exterior",
//     tagline: "Spoilers, lips, kits",
//     icon: <Car className="h-5 w-5 text-red-500" />,
//   },
//   {
//     id: "tech",
//     title: "Tech & Audio",
//     href: "/category/tech",
//     tagline: "Cams, CarPlay, subs",
//     icon: <Cpu className="h-5 w-5 text-red-500" />,
//   },
// ];

// function Shine() {
//   return (
//     <motion.span
//       initial={{ left: "-120%" }}
//       whileHover={{ left: "120%" }}
//       transition={{ duration: 0.9, ease: "easeInOut" }}
//       className="pointer-events-none absolute inset-y-0 left-0 w-[40%] skew-x-12 bg-white/20 mix-blend-overlay"
//     />
//   );
// }

// export default function FeaturedCategories({
//   categories = defaultCategories,
//   headline = "Featured Categories",
//   kicker = "Shop by style or function",
// }: {
//   categories?: Category[];
//   headline?: string;
//   kicker?: string;
// }) {
//   return (
//     <section className="relative w-full bg-black py-20 text-white">
//       {/* Background accents */}
//       <div className="pointer-events-none absolute inset-0">
//         <div className="absolute inset-0 bg-black" />
//         <motion.div
//           aria-hidden
//           className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:56px_56px]"
//           animate={{ scale: [1, 1.03, 1] }}
//           transition={{ duration: 10, repeat: Infinity }}
//         />
//       </div>

//       <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
//         {/* Heading */}
//         <motion.div
//           initial={{ opacity: 0, y: 16 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, amount: 0.6 }}
//           transition={{ duration: 0.6 }}
//           className="mb-10 flex items-end justify-between gap-6"
//         >
//           <div>
//             <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
//               <Sparkles className="h-3.5 w-3.5 text-red-500" /> {kicker}
//             </p>
//             <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{headline}</h2>
//           </div>

//           <a
//             href="/categories"
//             className="group relative inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:border-white/25 hover:bg-white/10"
//           >
//             Browse all
//             <Wrench className="h-4 w-4 transition-transform group-hover:rotate-12" />
//             <span className="absolute -inset-1 -z-10 rounded-xl bg-red-600/0 blur-xl transition group-hover:bg-red-600/10" />
//           </a>
//         </motion.div>

//         {/* Grid */}
//         <motion.ul
//           variants={container}
//           initial="hidden"
//           whileInView="show"
//           viewport={{ once: true, amount: 0.2 }}
//           className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
//         >
//           {categories.map((c) => (
//             <motion.li key={c.id} variants={card}>
//               <a
//                 href={c.href}
//                 className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_0_rgba(239,68,68,0)] backdrop-blur transition hover:border-white/20 hover:shadow-[0_0_60px_-10px_rgba(239,68,68,0.35)]"
//               >
//                 {/* optional background image */}
//                 {c.imageUrl && (
//                   <div
//                     className="absolute inset-0 -z-10 opacity-30"
//                     style={{ backgroundImage: `url(${c.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
//                   />
//                 )}

//                 {/* red corner accent */}
//                 <span className="absolute right-0 top-0 h-20 w-20 -translate-y-6 translate-x-6 rotate-45 bg-red-600/70 blur-2xl transition-opacity group-hover:opacity-90" />

//                 <div className="flex items-center justify-between gap-3">
//                   <div className="flex items-center gap-3">
//                     <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-black/60 shadow-inner">
//                       {c.icon ?? <Lightbulb className="h-5 w-5 text-red-500" />}
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-bold">{c.title}</h3>
//                       <p className="text-xs text-white/70">{c.tagline ?? "Explore now"}</p>
//                     </div>
//                   </div>

//                   <motion.span
//                     initial={{ x: 0 }}
//                     whileHover={{ x: 4 }}
//                     transition={{ type: "spring", stiffness: 200, damping: 18 }}
//                     aria-hidden
//                     className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80"
//                   >
//                     ➜
//                   </motion.span>
//                 </div>

//                 {/* bottom meta */}
//                 <div className="mt-5 flex items-center justify-between text-xs text-white/70">
//                   <span>Handpicked gear</span>
//                   <span className="rounded-full bg-red-600/80 px-2 py-0.5 text-[10px] font-semibold">Hot</span>
//                 </div>

//                 {/* shine effect */}
//                 <Shine />
//               </a>
//             </motion.li>
//           ))}
//         </motion.ul>
//       </div>
//     </section>
//   );
// }


"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Wrench, Lightbulb, Gauge, LifeBuoy, Car, Cpu, Disc3, Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n";

export type Category = {
  id: string;
  title: string;
  href: string;
  tagline?: string;
  icon?: React.ReactNode;
  imageUrl?: string;
};

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const card: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const defaultCategories: Category[] = [
  { id: "lighting", title: "lighting", href: "/category/lighting", tagline: "taglineLighting", icon: <Lightbulb className="h-5 w-5 text-red-500" /> },
  { id: "performance", title: "performance", href: "/category/performance", tagline: "taglinePerformance", icon: <Gauge className="h-5 w-5 text-red-500" /> },
  { id: "interior", title: "interior", href: "/category/interior", tagline: "taglineInterior", icon: <LifeBuoy className="h-5 w-5 text-red-500" /> },
  { id: "wheels", title: "wheelsRims", href: "/category/wheels", tagline: "taglineWheels", icon: <Disc3 className="h-5 w-5 text-red-500" /> },
  { id: "exterior", title: "aeroExterior", href: "/category/exterior", tagline: "taglineExterior", icon: <Car className="h-5 w-5 text-red-500" /> },
  { id: "tech", title: "techAudio", href: "/category/tech", tagline: "taglineTech", icon: <Cpu className="h-5 w-5 text-red-500" /> },
];

function Shine() {
  return (
    <motion.span
      initial={{ left: "-120%" }}
      whileHover={{ left: "120%" }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
      className="pointer-events-none absolute inset-y-0 left-0 w-[40%] skew-x-12 bg-white/20 mix-blend-overlay"
    />
  );
}

export default function FeaturedCategories({
  categories = defaultCategories,
  headline = "featuredHeadline",
  kicker = "featuredKicker",
}: {
  categories?: Category[];
  headline?: string;
  kicker?: string;
}) {
  const { t } = useT();
  return (
    <section className="relative w-full bg-black py-20 text-white">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex items-end justify-between gap-6"
        >
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-red-500" /> {t(kicker as any)}
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{t(headline as any)}</h2>
          </div>

          <a
            href="/categories"
            className="group relative inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:border-white/25 hover:bg-white/10"
          >
            {t('browseAll')}
            <Wrench className="h-4 w-4 transition-transform group-hover:rotate-12" />
            <span className="absolute -inset-1 -z-10 rounded-xl bg-red-600/0 blur-xl transition group-hover:bg-red-600/10" />
          </a>
        </motion.div>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((c) => (
            <motion.li key={c.id} variants={card}>
              <a
                href={c.href}
                className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_0_rgba(239,68,68,0)] backdrop-blur transition hover:border-white/20 hover:shadow-[0_0_60px_-10px_rgba(239,68,68,0.35)]"
              >
                {c.imageUrl && (
                  <div
                    className="absolute inset-0 -z-10 opacity-30"
                    style={{ backgroundImage: `url(${c.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
                  />
                )}

                <span className="absolute right-0 top-0 h-20 w-20 -translate-y-6 translate-x-6 rotate-45 bg-red-600/70 blur-2xl transition-opacity group-hover:opacity-90" />

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-black/60 shadow-inner">
                      {c.icon ?? <Lightbulb className="h-5 w-5 text-red-500" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{t(c.title as any)}</h3>
                      <p className="text-xs text-white/70">{c.tagline ? t(c.tagline as any) : t('exploreNow')}</p>
                    </div>
                  </div>

                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    aria-hidden
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80"
                  >
                    ➜
                  </motion.span>
                </div>

                <div className="mt-5 flex items-center justify-between text-xs text-white/70">
                  <span>{t('handpickedGear')}</span>
                  <span className="rounded-full bg-red-600/80 px-2 py-0.5 text-[10px] font-semibold">{t('hot')}</span>
                </div>

                <Shine />
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}