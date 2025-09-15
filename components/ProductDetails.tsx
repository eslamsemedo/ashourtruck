"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { addItem } from "@/app/state/cart/cartSlice";
import { motion } from "framer-motion";
import { ArrowLeft, Tag, Minus, Plus, Info } from "lucide-react";

// -------- Types --------
type QuantityTier = { from: string; to?: string; equal?: string; total?: string };

export type ProductData = {
  id: number;
  name: string;
  category: string;
  image: string;
  priceEach: number; // base price
  description: string;
  weight: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  tiers: QuantityTier[]; // raw tiers
  lang: "en" | "ar";
};

// -------- Helpers --------
function i18n(lang: "en" | "ar") {
  const ar = lang === "ar";
  return {
    dir: ar ? "rtl" : "ltr",
    back: ar ? "عودة إلى المتجر" : "Back to Shop",
    priceEach: ar ? "السعر لكل قطعة" : "Price each",
    weight: ar ? "الوزن" : "Weight",
    updated: ar ? "آخر تحديث" : "Updated",
    created: ar ? "تاريخ الإنشاء" : "Created",
    bulk: ar ? "تسعير الجملة" : "Bulk pricing",
    each: ar ? "لكل قطعة" : "each",
    addToCart: ar ? "أضف إلى السلة" : "Add to Cart",
    continueShopping: ar ? "متابعة التسوق" : "Continue shopping",
    quantity: ar ? "الكمية" : "Quantity",
    total: ar ? "الإجمالي" : "Total",
    unitPrice: ar ? "سعر الوحدة" : "Unit price",
    qtyAssistive: ar ? "تعديل كمية المنتج" : "Adjust product quantity",
  };
}

function formatDate(iso: string, lang: "en" | "ar") {
  try {
    return new Date(iso).toLocaleString(lang === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function parseNum(v?: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function resolveUnitPrice(qty: number, base: number, tiers?: QuantityTier[]) {
  if (!tiers?.length || !qty) return base;
  // Find exact match first
  for (const t of tiers) {
    const eq = parseNum(t.equal);
    if (eq && qty === eq) return eq;
  }
  // Then range match (from-to) or open-ended (from+)
  let matched: number | undefined;
  for (const t of tiers) {
    const from = parseNum(t.from) ?? 0;
    const to = parseNum(t.to);
    const price = parseNum(t.total) ?? parseNum(t.equal);
    if (!price) continue;
    if (to != null) {
      if (qty >= from && qty <= to) matched = price;
    } else {
      if (qty >= from) matched = price;
    }
  }
  return matched ?? base;
}

// -------- UI subcomponents --------
function PriceTiers({ tiers, lang }: { tiers: QuantityTier[]; lang: "en" | "ar" }) {
  const t = i18n(lang);
  if (!tiers?.length) return null;
  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold text-white/90">{t.bulk}</h4>
      <ul className="mt-3 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
        {tiers.map((tier, i) => {
          const title = tier.to ? `${tier.from}–${tier.to}` : `${tier.from}+`;
          const per = parseNum(tier.equal ?? tier.total) ?? 0;
          return (
            <li key={i} className="grid grid-cols-2 items-center bg-white/5 px-4 py-3 text-sm">
              <span className="text-white/80">{title}</span>
              <span className="text-right font-semibold text-white">${per.toFixed(2)} {t.each}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// -------- Main component --------
export default function ProductDetails({ product }: { product: ProductData }) {
  const { name, category, image, priceEach, description, weight, createdAt, updatedAt, tiers, lang } = product;
  const t = i18n(lang);
  const [qty, setQty] = React.useState<number>(1);
  const dispatch = useDispatch();

  const unitPrice = resolveUnitPrice(qty, priceEach, tiers);
  const lineTotal = unitPrice * qty;

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(9999, q + 1));
  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const n = Math.min(9999, Math.max(1, Number(value || 1)));
    setQty(n);
  };

  return (
    <section className="w-full bg-black text-white" >
      {/* Banner like hero */}
      <div className="relative isolate overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute inset-0 -z-10"
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: [1, 1.02, 1], opacity: [0.7, 0.9, 0.7] }}
          transition={{ duration: 16, repeat: Infinity }}
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
          <a
            href="/shop"
            className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-white/25 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.back}
          </a>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">{name}</h1>
          <p className="mt-1 text-white/70">{category}</p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <img src={image} alt={name} className="h-full w-full object-cover" />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-red-600/90 px-3 py-1 text-xs font-semibold">
              <Tag className="h-3.5 w-3.5" /> {category}
            </span>
          </div>

          {/* Info */}
          <div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <h2 className="text-xl font-bold">{name}</h2>
                  <p className="mt-1 text-sm text-white/70">{t.priceEach}</p>
                </div>
                <div className="text-2xl font-extrabold">${unitPrice.toFixed(2)}</div>
              </div>

              <p className="mt-4 text-sm text-white/80">{description}</p>

              {/* Key facts */}
              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl border border-white/10 bg-black/60 p-3">
                  <dt className="text-white/60">{t.weight}</dt>
                  <dd className="font-semibold">{weight.toFixed(3)} kg</dd>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/60 p-3">
                  <dt className="text-white/60">{t.updated}</dt>
                  <dd className="font-semibold">{formatDate(updatedAt, lang)}</dd>
                </div>
              </dl>

              {/* Quantity selector + total */}
              <div className="mt-6">
                <label className="text-sm text-white/70" htmlFor="qty-input">
                  {t.quantity}
                </label>
                <div className="mt-2 flex items-stretch gap-3">
                  <div className="inline-flex items-center rounded-xl border border-white/15 bg-black/60">
                    <button
                      type="button"
                      aria-label={`${t.qtyAssistive} -`}
                      onClick={dec}
                      disabled={qty <= 1}
                      className="grid h-11 w-11 place-items-center rounded-l-xl border-r border-white/10 text-white/90 transition hover:bg-white/10 disabled:opacity-40"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      id="qty-input"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={qty}
                      onChange={onInput}
                      className="h-11 w-16 bg-transparent text-center text-base font-semibold outline-none"
                      aria-live="polite"
                    />
                    <button
                      type="button"
                      aria-label={`${t.qtyAssistive} +`}
                      onClick={inc}
                      className="grid h-11 w-11 place-items-center rounded-r-xl border-l border-white/10 text-white/90 transition hover:bg-white/10"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex-1 rounded-xl border border-white/10 bg-black/60 px-4 py-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">{t.unitPrice}</span>
                      <span className="font-semibold">${unitPrice.toFixed(2)}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-sm">
                      <span className="text-white/60">{t.total}</span>
                      <span className="text-lg font-extrabold">${lineTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                {/* hint when tier pricing applies */}
                {tiers?.length ? (
                  <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
                    <Info className="h-3.5 w-3.5" />
                    <span>
                      {lang === "ar"
                        ? "قد يختلف سعر الوحدة حسب الكمية (تسعير الجملة)."
                        : "Unit price may change with quantity (bulk pricing)."}
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Tiers */}
              <PriceTiers tiers={tiers} lang={lang} />

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500"
                  onClick={() => {
                    dispatch(addItem({
                      id: product.id,
                      name: product.name,
                      image: product.image,
                      price: unitPrice,
                      qty,
                      category: product.category,
                      weight: product.weight,
                    }))
                  }}
                >
                  {t.addToCart}
                </button>
                <a
                  href="/shop"
                  className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white hover:border-white/25 hover:bg-white/10"
                >
                  {t.continueShopping}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="mt-10 text-xs text-white/50">
          ID: {product.id} • {t.created}: {formatDate(createdAt, lang)} • {t.updated}: {formatDate(updatedAt, lang)}
        </div>
      </div>
    </section>
  );
}
