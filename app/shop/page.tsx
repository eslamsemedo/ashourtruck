// "use client";

import ShopPage from "@/components/shop";

// import React, { useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Filter, Search, ArrowUpDown, SlidersHorizontal, X, Check } from "lucide-react";

// /**
//  * SHOP PAGE — simplified: products grid + cool filters + search (no quantity)
//  * - Animated category chips (multi-select)
//  * - Slide-over filter panel includes CATEGORY CHECKBOXES + price range + Apply
//  * - Loading skeletons while fetching
//  * - Black/white/red theme to match the rest of the site
//  */

// // ===== Types from your API =====
// type QuantityTier = { from: string; to?: string; equal?: string; total?: string };
// type RawProductLang = {
//   id: number;
//   admin_id: number;
//   category: string;
//   name: string;
//   image: string;
//   price_each: string; // stringified decimal
//   description: string;
//   weight: string;
//   created_at: string;
//   updated_at: string;
//   quantity: QuantityTier[];
// };
// type RawProduct = { en: RawProductLang; ar: RawProductLang };
// type ApiResponse = { status: string; message: Record<string, string>; data: RawProduct[] };

// // ===== Normalized product used by UI =====
// export type Product = {
//   id: number;
//   category: string; // localized label as returned
//   name: string;     // localized
//   image: string;
//   priceEach: number;
//   createdAt: number; // epoch
//   description: string;
//   weight: number;
// };

// function parseMoney(s: string | undefined) {
//   if (!s) return 0;
//   const n = Number.parseFloat(s);
//   return Number.isFinite(n) ? n : 0;
// }

// function normalize(raw: RawProduct[], lang: "en" | "ar" = "en"): Product[] {
//   return raw.map((r) => {
//     const p = r[lang];
//     return {
//       id: p.id,
//       category: (p.category ?? "").trim(),
//       name: p.name,
//       image: p.image,
//       priceEach: parseMoney(p.price_each),
//       description: p.description,
//       weight: parseMoney(p.weight),
//       createdAt: new Date(p.created_at).getTime(),
//     };
//   });
// }

// // ===== UI COMPONENT =====
// export default function ShopPage({ apiUrl = "https://mediumaquamarine-loris-592285.hostingersite.com/api/v1/products", lang = "en" as "en" | "ar" }: { apiUrl?: string; lang?: "en" | "ar" }) {
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState<string | null>(null);
//   const [all, setAll] = React.useState<Product[]>([]);

//   // controls
//   const [search, setSearch] = React.useState("");
//   const [activeCats, setActiveCats] = React.useState<string[]>([]); // store CATEGORY KEYS (lowercase)
//   const [sort, setSort] = React.useState<string>("newest"); // newest | price-asc | price-desc | name

//   // slide-over filter state (mobile)
//   const [panelOpen, setPanelOpen] = React.useState(false);

//   // additional filters
//   const [priceMin, setPriceMin] = React.useState<number | "">("");
//   const [priceMax, setPriceMax] = React.useState<number | "">("");

//   useEffect(() => {
//     const ctrl = new AbortController();
//     (async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(apiUrl, { signal: ctrl.signal, cache: "no-store" });
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const json = (await res.json()) as ApiResponse;
//         const products = normalize(json.data, lang);
//         setAll(products);
//         setError(null);
//       } catch (e: any) {
//         if (e.name !== "AbortError") setError(e?.message || "Failed to load products");
//       } finally {
//         setLoading(false);
//       }
//     })();
//     return () => ctrl.abort();
//   }, [apiUrl, lang]);

//   // Build canonical categories -> keep a lowercase key and the original label for display
//   const categories = React.useMemo(() => {
//     const map = new Map<string, string>();
//     all.forEach((p) => {
//       const key = p.category.trim().toLowerCase();
//       if (key && !map.has(key)) map.set(key, p.category.trim());
//     });
//     return Array.from(map, ([key, label]) => ({ key, label }));
//   }, [all]);

//   const filtered = React.useMemo(() => {
//     let arr = all.slice();
//     if (activeCats.length) {
//       const set = new Set(activeCats);
//       arr = arr.filter((p) => set.has(p.category.trim().toLowerCase()));
//     }
//     if (search.trim()) {
//       const q = search.toLowerCase();
//       arr = arr.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
//     }
//     if (priceMin !== "") arr = arr.filter((p) => p.priceEach >= Number(priceMin));
//     if (priceMax !== "") arr = arr.filter((p) => p.priceEach <= Number(priceMax));
//     switch (sort) {
//       case "price-asc":
//         arr.sort((a, b) => a.priceEach - b.priceEach);
//         break;
//       case "price-desc":
//         arr.sort((a, b) => b.priceEach - a.priceEach);
//         break;
//       case "name":
//         arr.sort((a, b) => a.name.localeCompare(b.name));
//         break;
//       default:
//         arr.sort((a, b) => b.createdAt - a.createdAt);
//     }
//     return arr;
//   }, [all, activeCats, search, sort, priceMin, priceMax]);

//   const stats = React.useMemo(() => ({
//     total: filtered.length,
//     cats: new Set(filtered.map((p) => p.category.trim().toLowerCase())).size,
//   }), [filtered]);

//   function toggleCatByKey(key: string) {
//     setActiveCats((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]));
//   }

//   return (
//     // <section className="min-h-screen w-full bg-black py-24 text-white">
//     <>
//       <div className="relative isolate overflow-hidden bg-[#360606] mb-10">
//         {/* animated grid */}
//         <motion.div
//           aria-hidden
//           className="absolute inset-0 -z-10"
//           initial={{ scale: 1, opacity: 0.7 }}
//           animate={{ scale: [1, 1.02, 1], opacity: [0.7, 0.9, 0.7] }}
//           transition={{ duration: 16, repeat: Infinity }}
//           style={{
//             backgroundImage:
//               "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
//             backgroundSize: "48px 48px",
//           }}
//         />
//         {/* red beams */}
//         <motion.div
//           aria-hidden
//           className="pointer-events-none absolute inset-0 -z-10"
//           initial={{ opacity: 0.25 }}
//           animate={{ opacity: [0.25, 0.4, 0.25] }}
//           transition={{ duration: 6, repeat: Infinity }}
//         >
//           <div className="absolute -left-20 top-0 h-[140%] w-40 rotate-12 bg-red-600/15 blur-2xl" />
//           <div className="absolute left-1/2 top-10 h-[120%] w-32 -translate-x-1/2 -rotate-12 bg-red-600/20 blur-2xl" />
//           <div className="absolute -right-24 bottom-0 h-[140%] w-40 -rotate-6 bg-red-600/15 blur-2xl" />
//         </motion.div>
//         {/* speed lines */}
//         <motion.div
//           aria-hidden
//           className="absolute inset-0 -z-10 opacity-30"
//           initial={{ backgroundPosition: "0px 0px" }}
//           animate={{ backgroundPosition: ["0px 0px", "200px 0px"] }}
//           transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
//           style={{
//             backgroundImage:
//               "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 12px)",
//           }}
//         />

//         <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
//           <div className="flex items-center justify-between">
//             <motion.a
//               href="/"
//               initial={{ y: 10, opacity: 0 }}
//               whileInView={{ y: 0, opacity: 1 }}
//               viewport={{ once: true, amount: 0.6 }}
//               className="group relative inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:border-white/25 hover:bg-white/10"
//             >
//               <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
//               Back Home
//               <motion.span
//                 initial={{ left: "-120%" }}
//                 whileHover={{ left: "120%" }}
//                 transition={{ duration: 0.9, ease: "easeInOut" }}
//                 className="pointer-events-none absolute inset-y-0 left-0 w-[40%] skew-x-12 bg-white/20 mix-blend-overlay"
//               />
//             </motion.a>
//           </div>

//           <motion.h1
//             initial={{ y: 20, opacity: 0 }}
//             whileInView={{ y: 0, opacity: 1 }}
//             viewport={{ once: true, amount: 0.6 }}
//             transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
//             className="mt-8 text-4xl text-white font-extrabold tracking-tight sm:text-5xl"
//           >
//             Shop
//           </motion.h1>
//           <motion.p
//             initial={{ y: 20, opacity: 0 }}
//             whileInView={{ y: 0, opacity: 1 }}
//             viewport={{ once: true, amount: 0.6 }}
//             transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
//             className="mt-3 max-w-2xl text-white/70"
//           >
//             Browse all products, filter by category, or search for exactly what you need.
//           </motion.p>

//           {/* sweeping shine across the banner */}
//           <motion.span
//             aria-hidden
//             className="pointer-events-none absolute left-[-30%] top-0 h-full w-[35%] -skew-x-12 bg-white/5"
//             initial={{ x: "-30%", opacity: 0 }}
//             animate={{ x: ["-30%", "130%"], opacity: [0, 1, 0] }}
//             transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 4 }}
//           />
//         </div>
//       </div>
//       <div className="mx-auto max-w-7xl p-6 lg:p-8  ">
//         {/* Header */}
//         <div className="mb-6 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
//           <div>
//             {/* <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">Shop • All Products</p> */}
//             {/* <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">Shop</h1> */}
//           </div>
//           <div className="flex items-center gap-2 text-xs text-white/60">
//             <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">{stats.total} items</span>
//             <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">{stats.cats} categories</span>
//           </div>
//         </div>

//         {/* Fancy controls row */}
//         <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-12">
//           {/* Search */}
//           <div className="sm:col-span-6">
//             <div className="relative">
//               <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder={lang === "ar" ? "ابحث عن المنتجات" : "Search products"}
//                 className="w-full rounded-2xl border border-white/15 bg-black/60 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:ring-2 focus:ring-red-500/60"
//               />
//             </div>
//           </div>

//           {/* Sort */}
//           <div className="sm:col-span-3">
//             <div className="relative">
//               <ArrowUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
//               <select
//                 value={sort}
//                 onChange={(e) => setSort(e.target.value)}
//                 className="w-full appearance-none rounded-2xl border border-white/15 bg-black/60 px-3 py-3 text-sm focus:border-white/30 focus:ring-2 focus:ring-red-500/60"
//               >
//                 <option value="newest">Newest</option>
//                 <option value="price-asc">Price: Low → High</option>
//                 <option value="price-desc">Price: High → Low</option>
//                 <option value="name">Name A→Z</option>
//               </select>
//             </div>
//           </div>

//           {/* Slide-over trigger */}
//           <div className="sm:col-span-3">
//             <button
//               onClick={() => setPanelOpen(true)}
//               className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-3 py-3 text-sm text-white transition hover:border-white/25 hover:bg-white/10"
//             >
//               <SlidersHorizontal className="h-4 w-4" /> More filters
//             </button>
//           </div>
//         </div>

//         {/* Category chips (fun, animated) */}
//         <div className="mb-6 flex flex-wrap gap-2">
//           {categories.map(({ key, label }) => {
//             const active = activeCats.includes(key);
//             return (
//               <motion.button
//                 key={key}
//                 onClick={() => toggleCatByKey(key)}
//                 whileTap={{ scale: 0.96 }}
//                 className={`relative inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs backdrop-blur transition ${active ? "border-red-500/40 bg-red-600/30 text-white" : "border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10"
//                   }`}
//               >
//                 <span className={`h-2 w-2 rounded-full ${active ? "bg-red-500" : "bg-white/40"}`} />
//                 {label}
//               </motion.button>
//             );
//           })}
//           {categories.length === 0 && (
//             <span className="text-sm text-white/60">No categories</span>
//           )}
//         </div>

//         {/* Slide-over Panel (mobile/desktop) */}
//         <AnimatePresence>
//           {panelOpen && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
//               onClick={() => setPanelOpen(false)}
//             >
//               <motion.div
//                 initial={{ x: "100%" }}
//                 animate={{ x: 0 }}
//                 exit={{ x: "100%" }}
//                 transition={{ type: "spring", stiffness: 260, damping: 24 }}
//                 className="absolute right-0 top-0 h-full w-full max-w-md overflow-auto border-l border-white/10 bg-black p-6 text-sm"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="mb-4 flex items-center justify-between">
//                   <h3 className="text-lg font-bold">Filters</h3>
//                   <button onClick={() => setPanelOpen(false)} className="rounded-lg border border-white/10 p-2 hover:border-white/20"><X className="h-4 w-4" /></button>
//                 </div>
//                 <div className="space-y-6">
//                   {/* Price */}
//                   <div>
//                     <h4 className="mb-2 text-white/80">Price range</h4>
//                     <div className="flex items-center gap-3">
//                       <input
//                         type="number"
//                         placeholder="Min"
//                         value={priceMin}
//                         onChange={(e) => setPriceMin(e.target.value === "" ? "" : Number(e.target.value))}
//                         className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-2 focus:ring-red-500/60"
//                       />
//                       <span className="text-white/40">—</span>
//                       <input
//                         type="number"
//                         placeholder="Max"
//                         value={priceMax}
//                         onChange={(e) => setPriceMax(e.target.value === "" ? "" : Number(e.target.value))}
//                         className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-2 focus:ring-red-500/60"
//                       />
//                     </div>
//                   </div>

//                   {/* Categories list with checkboxes */}
//                   <div>
//                     <h4 className="mb-2 text-white/80">Categories</h4>
//                     <div className="grid max-h-64 grid-cols-1 gap-2 overflow-auto pr-1">
//                       {categories.length ? (
//                         categories.map(({ key, label }) => {
//                           const active = activeCats.includes(key);
//                           return (
//                             <button
//                               key={key}
//                               onClick={() => toggleCatByKey(key)}
//                               className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left ${active ? "border-red-500/40 bg-red-600/20" : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"}`}
//                             >
//                               <span className="text-white/90">{label}</span>
//                               <span className={`grid h-5 w-5 place-items-center rounded ${active ? "bg-red-600" : "bg-white/10"}`}>
//                                 {active && <Check className="h-4 w-4" />}
//                               </span>
//                             </button>
//                           );
//                         })
//                       ) : (
//                         <span className="text-white/50">No categories found</span>
//                       )}
//                     </div>
//                     {activeCats.length > 0 && (
//                       <div className="mt-2 flex flex-wrap gap-2">
//                         {activeCats.map((key) => {
//                           const label = categories.find((c) => c.key === key)?.label ?? key;
//                           return (
//                             <span key={key} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
//                               {label}
//                               <button onClick={() => toggleCatByKey(key)} className="rounded-full border border-white/10 p-0.5 hover:border-white/20">×</button>
//                             </span>
//                           );
//                         })}
//                       </div>
//                     )}
//                   </div>

//                   <div className="pt-2">
//                     <button
//                       onClick={() => setPanelOpen(false)}
//                       className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500"
//                     >
//                       Apply filters
//                     </button>
//                     <button
//                       onClick={() => { setActiveCats([]); setPriceMin(""); setPriceMax(""); }}
//                       className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 font-semibold text-white hover:border-white/25 hover:bg-white/10"
//                     >
//                       Reset
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Loading state */}
//         {loading && (
//           <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {Array.from({ length: 8 }).map((_, i) => (
//               <li key={i} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
//                 <div className="relative aspect-[4/3] w-full overflow-hidden">
//                   <div className="h-full w-full animate-pulse bg-gradient-to-r from-white/10 via-white/20 to-white/10" />
//                 </div>
//                 <div className="space-y-3 p-4">
//                   <div className="h-4 w-2/3 animate-pulse rounded bg-white/20" />
//                   <div className="h-3 w-full animate-pulse rounded bg-white/10" />
//                   <div className="h-3 w-5/6 animate-pulse rounded bg-white/10" />
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}

//         {/* Grid */}
//         {!loading && (
//           <AnimatePresence initial={false}>
//             <motion.ul
//               layout
//               className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
//             >
//               {filtered.map((p) => (
//                 <motion.li
//                   key={p.id}
//                   layout
//                   initial={{ opacity: 0, y: 12 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   // exit={{ opacity: 0, y: -12 }}
//                   transition={{ duration: 0.35 }}
//                   className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur transition hover:border-white/20 hover:shadow-[0_0_60px_-10px_rgba(239,68,68,0.35)]"
//                 >
//                   <div className="relative aspect-[4/3] w-full overflow-hidden">
//                     <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
//                     <span className="absolute left-3 top-3 rounded-full bg-red-600/90 px-3 py-1 text-xs font-semibold">{p.category}</span>
//                   </div>
//                   <div className="flex flex-1 flex-col justify-between p-4">
//                     <div>
//                       <h3 className="text-base font-bold leading-snug">{p.name}</h3>
//                       <p className="mt-1 line-clamp-2 text-sm text-white/70">{p.description}</p>
//                     </div>
//                     <div className="mt-4 flex items-end justify-between">
//                       <div className="text-lg font-bold">${p.priceEach.toFixed(2)}</div>
//                       <a href={`/products/${p.id}`} className="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500">View</a>
//                     </div>
//                   </div>
//                 </motion.li>
//               ))}
//             </motion.ul>
//           </AnimatePresence>
//         )}

//         {/* Empty state */}
//         {!loading && !error && filtered.length === 0 && (
//           <div className="py-24 text-center text-white/70">No products match your filters.</div>
//         )}
//       </div>
//     </>
//     // </section>
//   );
// }



// app/shop/page.tsx


export default function Page() {
  return (
    <ShopPage
      apiUrl="https://mediumaquamarine-loris-592285.hostingersite.com/api/v1/products"
      lang="en"
    />
  );
}