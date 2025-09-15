"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/state/store";
import {
  incrementQty,
  decrementQty,
  removeItem,
  clearCart,
  applyCoupon,
} from "@/app/state/cart/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Minus, Plus, ArrowLeft, Tag, TicketPercent } from "lucide-react";
import { useT } from "@/lib/i18n";

/**
 * Cart state contract this page expects
 * -------------------------------------------------
 * state.cart: {
 *   items: Array<{
 *     id: number | string;
 *     name: string;
 *     image: string;
 *     price: number;       // unit price currently applied
 *     qty: number;         // quantity
 *     category?: string;
 *     weight?: number;     // optional – used for shipping hint
 *     sku?: string;
 *   }>;
 *   subtotal: number;      // derived; optional if you compute here
 *   discount?: number;     // optional – value subtracted from subtotal
 *   coupon?: string | null;
 *   currency?: string;     // default USD
 * }
 */

// If your slice doesn't provide subtotal/discount, it's computed below as a fallback.
function calcSubtotal(items: { price: number; qty: number }[]) {
  return items.reduce((sum, it) => sum + it.price * it.qty, 0);
}

export default function CartPage() {
  const dispatch = useDispatch();
  const cart = useSelector((s: RootState) => s.cart);
  const { t, code: lang } = useT();

  const currency = cart?.currency ?? "USD";
  const items = cart?.items ?? [];
  const subtotal = calcSubtotal(items);
  const discountValue = cart?.discount ?? 0; // could be absolute or percentage marker
  const discount = discountValue <= 1 ? subtotal * discountValue : discountValue;
  const coupon = cart?.coupon ?? null;

  // Transportation list + selection
  type Transport = { id: number; zone: string; weight_kg: string; price: string };
  const [transports, setTransports] = React.useState<Transport[]>([]);
  const [selectedTransportId, setSelectedTransportId] = React.useState<number | null>(null);
  const selectedTransport = React.useMemo(
    () => transports.find(t => t.id === selectedTransportId) || null,
    [transports, selectedTransportId]
  );
  React.useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("https://mediumaquamarine-loris-592285.hostingersite.com/api/v1/admin/transportations", {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${"9|50hnEZPE0X7WCc5gIAcERnscQ3eJLNKOjZKunwErc801516a"}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const data = json?.data?.data ?? [];
        if (!ignore) setTransports(data);
      } catch (e) {
        console.error("Failed to load transports", e);
      }
    })();
    return () => { ignore = true };
  }, []);

  // Shipping / tax placeholders — tweak for your business rules
  // Shipping derived from selected transport. If none selected, show 0 until user chooses.
  const shipping = selectedTransport ? Number.parseFloat(selectedTransport.price) || 0 : 0;
  const taxRate = 0.0; // if you estimate tax client-side, set a rate here
  const estimatedTax = (subtotal - discount + shipping) * taxRate;
  const total = Math.max(0, subtotal - discount + shipping + estimatedTax);

  const [code, setCode] = React.useState("");
  const currencyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency });

  const onApplyCoupon = () => {
    // Example validation — replace with real API/logic
    const c = code.trim().toUpperCase();
    if (!c) return;
    dispatch(applyCoupon(c));
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-28 lg:px-8">
        {/* Language Switcher */}
        {/* <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, margin: "16px 0" }}>
          <button
            onClick={() => dispatch({ type: "lang/setLanguage", payload: "en" })}
            style={{
              padding: "6px 16px",
              borderRadius: 6,
              border: lang === "en" ? "2px solid #ef4444" : "1px solid #ccc",
              background: lang === "en" ? "#ef4444" : "#fff",
              color: lang === "en" ? "#fff" : "#222",
              fontWeight: lang === "en" ? 700 : 400,
              cursor: "pointer"
            }}
          >
            EN
          </button>
          <button
            onClick={() => dispatch({ type: "lang/setLanguage", payload: "ar" })}
            style={{
              padding: "6px 16px",
              borderRadius: 6,
              border: lang === "ar" ? "2px solid #ef4444" : "1px solid #ccc",
              background: lang === "ar" ? "#ef4444" : "#fff",
              color: lang === "ar" ? "#fff" : "#222",
              fontWeight: lang === "ar" ? 700 : 400,
              cursor: "pointer"
            }}
          >
            AR
          </button>
        </div> */}
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{t("yourCart")}</h1>
            <p className="mt-1 text-sm text-white/60">
              {items.length} {items.length === 1 ? t("item") : t("items")} {t("inYourBag")}
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-white/25 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" /> {t("continueShopping")}
          </Link>
        </div>
        {/* Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Items */}
          <section className="lg:col-span-2">
            {items.length === 0 ? (
              <EmptyState t={t} />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <ul role="list" className="divide-y divide-white/10">
                  <AnimatePresence initial={false}>
                    {items.map((it) => (
                      <motion.li
                        key={`${it.id}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-[96px_1fr_auto] items-center gap-4 p-4 sm:grid-cols-[120px_1fr_auto]"
                      >
                        {/* Image */}
                        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/50">
                          <Image
                            src={it.image}
                            alt={it.name}
                            width={120}
                            height={120}
                            className="h-24 w-24 object-cover sm:h-28 sm:w-28"
                          />
                        </div>
                        {/* Details */}
                        <div className="min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="truncate text-base font-semibold">{it.name}</h3>
                              {it.category ? (
                                <p className="mt-0.5 flex items-center gap-1 text-xs text-white/60">
                                  <Tag className="h-3 w-3" /> {it.category}
                                </p>
                              ) : null}
                              {it.sku ? (
                                <p className="mt-1 text-xs text-white/50">SKU: {it.sku}</p>
                              ) : null}
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            {/* Quantity control */}
                            <div className="inline-flex items-center rounded-xl border border-white/15 bg-black/60">
                              <button
                                type="button"
                                onClick={() => dispatch(decrementQty(it.id))}
                                aria-label={`${t("decreaseQuantityFor") || "Decrease quantity for"} ${it.name}`}
                                className="grid h-10 w-10 place-items-center rounded-l-xl border-r border-white/10 text-white/90 transition hover:bg-white/10"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="min-w-[2ch] px-3 text-center font-semibold">{it.qty}</span>
                              <button
                                type="button"
                                onClick={() => dispatch(incrementQty(it.id))}
                                aria-label={`${t("increaseQuantityFor") || "Increase quantity for"} ${it.name}`}
                                className="grid h-10 w-10 place-items-center rounded-r-xl border-l border-white/10 text-white/90 transition hover:bg-white/10"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            {/* Price */}
                            <div className="text-sm text-white/70">
                              {t("unit") || "Unit"}: <span className="font-semibold text-white">{currencyFmt.format(it.price)}</span>
                            </div>
                          </div>
                        </div>
                        {/* Line total + remove */}
                        <div className="flex flex-col items-end justify-between gap-3">
                          <div className="text-right">
                            <p className="text-xs text-white/60">{t("lineTotal") || "Line total"}</p>
                            <p className="text-lg font-extrabold">{currencyFmt.format(it.price * it.qty)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => dispatch(removeItem(it.id))}
                            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
                          >
                            <Trash2 className="h-4 w-4" /> {t("remove")}
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                {/* Bulk actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 p-4">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                  >
                    <ArrowLeft className="h-4 w-4" /> {t("continueShopping")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => dispatch(clearCart())}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                  >
                    <Trash2 className="h-4 w-4" /> {t("clearCart")}
                  </button>
                </div>
              </div>
            )}
          </section>
          {/* Summary */}
          <aside className="h-fit rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-bold">{t("orderSummary")}</h2>
            {/* Transportation selector */}
            <div className="mt-4 rounded-xl border border-white/10 bg-black/60 p-3">
              <label className="text-sm text-white/70">{t("selectTransportation")}</label>
              <select
                className="mt-2 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm outline-none"
                value={selectedTransportId ?? ""}
                onChange={(e) => setSelectedTransportId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="" className="bg-black">{t("choose")}</option>
                {transports.map((tpt: any) => (
                  <option key={tpt.id} value={tpt.id} className="bg-black">
                    {tpt.zone} • {t("upTo") || "up to"} {Number.parseFloat(tpt.weight_kg || '0').toFixed(0)}kg • ${Number.parseFloat(tpt.price || '0').toFixed(2)}
                  </option>
                ))}
              </select>
              {selectedTransport && (
                <p className="mt-2 text-xs text-white/60">
                  {t("selected")}: {selectedTransport.zone} — ${Number.parseFloat(selectedTransport.price).toFixed(2)}
                </p>
              )}
            </div>
            {/* Coupon */}
            <div className="mt-4 rounded-xl border border-white/10 bg-black/60 p-3">
              <label htmlFor="coupon" className="flex items-center gap-2 text-sm text-white/70">
                <TicketPercent className="h-4 w-4" /> {t("haveCoupon")}
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="coupon"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={t("enterCode")}
                  className="flex-1 rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-white/40"
                />
                <button
                  type="button"
                  onClick={onApplyCoupon}
                  className="rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
                >
                  {t("apply")}
                </button>
              </div>
              {coupon ? (
                <p className="mt-2 text-xs text-emerald-300/90">{t("applied")}: {coupon}</p>
              ) : null}
            </div>
            {/* Totals */}
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-white/70">{t("subtotal")}</dt>
                <dd className="font-semibold">{currencyFmt.format(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between">
                  <dt className="text-white/70">{t("discount")}</dt>
                  <dd className="font-semibold text-emerald-300">−{currencyFmt.format(discount)}</dd>
                </div>
              )}
              <div className="flex items-center justify-between">
                <dt className="text-white/70">{t("shipping")}</dt>
                <dd className="font-semibold">{currencyFmt.format(shipping)}</dd>
              </div>
              {taxRate > 0 && (
                <div className="flex items-center justify-between">
                  <dt className="text-white/70">{t("estimatedTax")}</dt>
                  <dd className="font-semibold">{currencyFmt.format(estimatedTax)}</dd>
                </div>
              )}
              <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-3 text-base">
                <dt className="font-semibold">{t("total")}</dt>
                <dd className="text-xl font-extrabold">{currencyFmt.format(total)}</dd>
              </div>
            </dl>
            <button
              disabled={items.length === 0}
              className="mt-6 w-full rounded-xl bg-red-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => {
                // Build payload for backend
                const payload = {
                  currency,
                  items: items.map((it) => ({
                    product_id: it.id,
                    name: it.name,
                    qty: it.qty,
                    unit_price: it.price,
                    line_total: Number((it.price * it.qty).toFixed(2)),
                    image: it.image,
                    category: it.category,
                    weight: it.weight,
                    sku: it.sku,
                  })),
                  summary: {
                    subtotal: Number(subtotal.toFixed(2)),
                    discount: Number(discount.toFixed(2)),
                    shipping: Number(shipping.toFixed(2)),
                    tax: Number(estimatedTax.toFixed(2)),
                    total: Number(total.toFixed(2)),
                  },
                  coupon: coupon || undefined,
                  transportation: selectedTransport
                    ? {
                        id: selectedTransport.id,
                        zone: selectedTransport.zone,
                        weight_kg: selectedTransport.weight_kg,
                        price: Number.parseFloat(selectedTransport.price),
                      }
                    : undefined,
                };
                console.log('ORDER_PAYLOAD', payload);
                console.log('ORDER_PAYLOAD_JSON', JSON.stringify(payload, null, 2));
                // Example: navigate to checkout after logging
                // window.location.href = "/checkout";
              }}
            >
              {t("proceedToCheckout")}
            </button>
            <p className="mt-3 text-xs text-white/50">
              {selectedTransport
                ? `${t("shippingVia")} ${selectedTransport.zone} — ${currencyFmt.format(shipping)}`
                : t("selectTransportationToSeeShipping")}
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

function EmptyState({ t }: { t: (k: string) => string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
      <p className="text-lg font-semibold">{t("yourCartIsEmpty")}</p>
      <p className="mt-1 text-sm text-white/60">{t("browseCategories")}</p>
      <Link
        href="/shop"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500"
      >
        {t("shopNow")}
      </Link>
    </div>
  );
}
