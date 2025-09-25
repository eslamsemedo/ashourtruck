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
import { Trash2, Minus, Plus, ArrowLeft, Tag, TicketPercent, Edit, X } from "lucide-react";
import { useT } from "@/lib/i18n";

// If your slice doesn't provide subtotal/discount, it's computed below as a fallback.
function calcSubtotal(items: { price: number; qty: number }[]) {
  return items.reduce((sum, it) => sum + it.price * it.qty, 0);
}

type Transport = { zone: string; weight_kg: string; price: string };

type CustomerForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes?: string;
};

const initialForm: CustomerForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  notes: "",
};

export default function CartPage() {
  const dispatch = useDispatch();
  const cart = useSelector((s: RootState) => s.cart);
  const totalW = useSelector((s: RootState) => {
    return s.cart.items
      .map((v) => (v.weight ?? 0) * v.qty)
      .reduce((acc, curr) => acc + curr, 0);
  })
  const { t, code: lang } = useT();

  const currency = cart?.currency ?? "USD";
  const items = cart?.items ?? [];
  const subtotal = calcSubtotal(items);
  const discountValue = cart?.discount ?? 0; // could be absolute or percentage marker
  const discount = discountValue <= 1 ? subtotal * discountValue : discountValue;
  const coupon = cart?.coupon ?? null;

  // Transportation list + selection
  const [transports, setTransports] = React.useState<Transport[]>([]);
  const [selectedTransportKey, setSelectedTransportKey] = React.useState<string>("");
  const makeTKey = React.useCallback((t: Transport, idx: number) => `${t.zone}|${t.weight_kg}|${t.price}|${idx}`, []);
  const selectedTransport = React.useMemo(() => {
    return transports.find((t, idx) => makeTKey(t, idx) === selectedTransportKey) ?? null;
  }, [transports, selectedTransportKey, makeTKey]);
  // ---------------------------------
  React.useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("https://mediumaquamarine-loris-592285.hostingersite.com/api/v1/user/transportations", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const data = json?.data ?? [];
        if (!ignore) setTransports(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load transports", e);
      }
    })();
    return () => { ignore = true };
  }, []);

  const shipping = selectedTransport ? totalW * Number.parseFloat(selectedTransport.price) || 0 : 0;
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

  // NEW: Modal + form state
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<CustomerForm>(initialForm);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);

  const validate = (f: CustomerForm) => {
    const e: Record<string, string> = {};
    if (!f.firstName.trim()) e.firstName = t("required");
    if (!f.lastName.trim()) e.lastName = t("required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = t("invalidemail");
    if (!f.phone.trim()) e.phone = t("required");
    if (!f.addressLine1.trim()) e.addressLine1 = t("required");
    if (!f.city.trim()) e.city = t("required");
    if (!f.country.trim()) e.country = t("required");
    if (!f.postalCode.trim()) e.postalCode = t("required");
    return e;
  };

  const handleCheckoutClick = () => {
    if (items.length === 0) return;
    setOpen(true);
  };

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    try {
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
            zone: selectedTransport.zone,
            weight_kg: selectedTransport.weight_kg,
            price: Number.parseFloat(selectedTransport.price),
          }
          : undefined,
        customer: {
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
          address: {
            line1: form.addressLine1,
            line2: form.addressLine2 || undefined,
            city: form.city,
            state: form.state,
            postal_code: form.postalCode,
            country: form.country,
          },
          notes: form.notes || undefined,
        },
      };

      console.log('ORDER_PAYLOAD', payload);
      console.log('ORDER_PAYLOAD_JSON', JSON.stringify(payload, null, 2));

      // Send to the API endpoint
      const res = await fetch('https://mediumaquamarine-loris-592285.hostingersite.com/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Checkout failed: ${res.status}`);
      }

      const data = await res.json();

      console.log('Order Created:', data); // Log the response from the API

      dispatch(clearCart())

      // Example: navigate to checkout after successful POST
      window.location.href = "/shop";

      setOpen(false);
    } catch (err) {
      console.error(err);
      // Show a toast/snackbar here if you have one
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-28 lg:px-8">
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
                            {/* Quantity control (example: edit on PDP) */}
                            <div className="inline-flex items-center rounded-xl border border-white/15 bg-black/60">
                              <span className="min-w-[2ch] px-3 text-center font-semibold">{it.qty}</span>
                              <Link
                                href={`/shop/${it.id}`}
                                aria-label={`${t("increaseQuantityFor") || "Increase quantity for"} ${it.name}`}
                                className="grid h-10 w-10 place-items-center rounded-r-xl border-l border-white/10 text-white/90 transition hover:bg-white/10"
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
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
                value={selectedTransportKey}
                onChange={(e) => setSelectedTransportKey(e.target.value)}
              >
                <option key="__placeholder" value="" className="bg-black">{t("choose")}</option>
                {transports.map((tpt: Transport, idx: number) => {
                  const optKey = makeTKey(tpt, idx);
                  return (
                    <option key={optKey} value={optKey} className="bg-black">
                      {/* {tpt.zone} • {"up to"} {Number.parseFloat(tpt.weight_kg || '0').toFixed(0)}kg • ${Number.parseFloat(tpt.price || '0').toFixed(2)} */}
                      {tpt.zone} • ${Number.parseFloat(tpt.price || '0').toFixed(2)}/kg
                    </option>
                  );
                })}
              </select>
              {selectedTransport && (
                <p className="mt-2 text-xs text-white/60">
                  {t("selected")}: {selectedTransport.zone} — ${Number.parseFloat(selectedTransport.price || '0').toFixed(2)}
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
                <dd className="text-xl font-extrabold">{ }</dd>
              </div>
            </dl>
            <button
              disabled={items.length === 0}
              className="mt-6 w-full rounded-xl bg-red-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleCheckoutClick}
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

      {/* Checkout Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="checkout-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-end sm:place-items-center bg-black/60 p-0 sm:p-4"
            aria-modal="true"
            role="dialog"
          >
            {/* Card / Sheet */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="relative w-full sm:max-w-2xl bg-neutral-900 border border-white/10 shadow-2xl sm:rounded-2xl sm:overflow-hidden rounded-t-2xl"
            >
              {/* Scroll container: full-height sheet on mobile */}
              <div className="max-h-[92svh] sm:max-h-[80vh] overflow-y-auto">
                {/* Sticky header for mobile */}
                <div className="sticky top-0 z-10 bg-neutral-900/95 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/75 border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold truncate">{t("shippingInformation") || "Shipping information"}</h3>
                      <p className="mt-1 text-[11px] sm:text-xs text-white/60">{t("weUseThisToFulfill") || "We use this info to fulfill and contact you about your order."}</p>
                    </div>
                    <button
                      className="shrink-0 rounded-lg border border-white/10 p-2 text-white/80 hover:bg-white/10"
                      onClick={() => setOpen(false)}
                      aria-label={t("close") || "Close"}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} id="checkout-form" className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
                  {/* Name */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field
                      label={t("firstName") || "First name"}
                      name="firstName"
                      value={form.firstName}
                      onChange={(v) => setForm({ ...form, firstName: v })}
                      error={errors.firstName}
                      autoComplete="given-name"
                    />
                    <Field
                      label={t("lastName") || "Last name"}
                      name="lastName"
                      value={form.lastName}
                      onChange={(v) => setForm({ ...form, lastName: v })}
                      error={errors.lastName}
                      autoComplete="family-name"
                    />
                  </div>

                  {/* Contact */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field
                      label={t("email") || "Email"}
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={(v) => setForm({ ...form, email: v })}
                      error={errors.email}
                      autoComplete="email"
                    />
                    <Field
                      label={t("phone") || "Phone"}
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(v) => setForm({ ...form, phone: v })}
                      error={errors.phone}
                      autoComplete="tel"
                    />
                  </div>

                  {/* Address */}
                  <Field
                    label={t("addressLine1") || "Address line 1"}
                    name="addressLine1"
                    value={form.addressLine1}
                    onChange={(v) => setForm({ ...form, addressLine1: v })}
                    error={errors.addressLine1}
                    autoComplete="address-line1"
                  />
                  <Field
                    label={t("addressLine2") || "Address line 2 (optional)"}
                    name="addressLine2"
                    value={form.addressLine2 || ""}
                    onChange={(v) => setForm({ ...form, addressLine2: v })}
                    autoComplete="address-line2"
                  />

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Field
                      label={t("city") || "City"}
                      name="city"
                      value={form.city}
                      onChange={(v) => setForm({ ...form, city: v })}
                      error={errors.city}
                      autoComplete="address-level2"
                    />
                    <Field
                      label={t("state") || "State/Province"}
                      name="state"
                      value={form.state}
                      onChange={(v) => setForm({ ...form, state: v })}
                      autoComplete="address-level1"
                    />
                    <Field
                      label={t("postalCode") || "Postal code"}
                      name="postalCode"
                      value={form.postalCode}
                      onChange={(v) => setForm({ ...form, postalCode: v })}
                      error={errors.postalCode}
                      autoComplete="postal-code"
                    />
                  </div>

                  <Field
                    label={t("country") || "Country"}
                    name="country"
                    value={form.country}
                    onChange={(v) => setForm({ ...form, country: v })}
                    error={errors.country}
                    autoComplete="country-name"
                  />

                  <Field
                    label={t("orderNotes") || "Order notes (optional)"}
                    name="notes"
                    as="textarea"
                    value={form.notes || ""}
                    onChange={(v) => setForm({ ...form, notes: v })}
                  />

                  {/* Actions: sticky footer on mobile */}
                  <div className="h-2" />
                </form>
              </div>

              <div className="sticky bottom-0 z-10 bg-neutral-900/95 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/75 border-t border-white/10 px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-end gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"
                  >
                    {t("cancel") || "Cancel"}
                  </button>
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={submitting}
                    className="rounded-xl bg-red-600 px-4 sm:px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? (t("processing") || "Processing…") : (t("confirmAndPay") || "Confirm & pay")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  as,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  as?: "textarea" | "input";
}) {
  const InputTag = as === "textarea" ? "textarea" : "input";
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-xs font-medium text-white/80">{label}</label>
      <InputTag
        id={name}
        name={name}
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        className={`w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-white/40 ${error ? "border-red-500/60" : "border-white/10"
          }`}
        autoComplete={autoComplete}
        rows={as === "textarea" ? 4 : undefined}
        type={as === "textarea" ? undefined : type}
      />
      {error ? <p className="mt-1 text-xs text-red-400">{error}</p> : null}
    </div>
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
