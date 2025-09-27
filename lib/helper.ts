import { LocaleProduct, ProductRecord, QuantityTier } from "@/types/products";

export function formatMoney(value: number, locale: "en" | "ar" = "en") {
  try {
    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

export function parseNumber(n: string | number | undefined): number {
  if (n == null) return 0;
  if (typeof n === "number") return n;
  const x = Number(n);
  return isNaN(x) ? 0 : x;
}

export function formatDate(iso: string, locale: "en" | "ar") {
  if (!iso) return "—";
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export function normalizeQuantityTiers(q: QuantityTier[]) {
  // Map to a consistent shape: {from, to, price}
  return q.map((t) => ({
    from: parseNumber(t.from),
    to: parseNumber(t.to),
    price: parseNumber(t.equal ?? t.total ?? "0"),
  }));
}
// Lightweight fuzzy includes
export function includesI(str: string, needle: string) {
  return str.toLowerCase().includes(needle.trim().toLowerCase());
}

// (((((((((((((Product Normalization and Formatting)))))))))))))
export const num = (n?: string) => {
  const x = Number.parseFloat(n || "0");
  return Number.isFinite(x) ? x : 0;
};

export function normalize(raw: ProductRecord[], lang: "en" | "ar"): LocaleProduct[] {
  return raw.map((r) => {
    const p = r[lang];
    return {
      id: p.id,
      admin_id: p.admin_id,
      category: (p.category || "").trim(),
      name: p.name,
      image: p.image,
      price_each: num(p.price_each).toFixed(2),
      description: p.description,
      weight: num(p.weight).toFixed(3),
      created_at: p.created_at,
      updated_at: p.updated_at,
      quantity: Array.isArray(p.quantity) ? p.quantity.slice(0, 3) : [],
    };
  });
}

export function fmtDate(iso?: string) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString(); // you can localize further if needed
  } catch {
    return iso ?? "—";
  }
}

export function fmtTier(t: { from?: string; to?: string; equal?: string; total?: string }) {
  const from = t.from ?? "";
  const to = t.to ?? "";
  // Some tiers use "equal", the last uses "total"
  const price = t.equal ?? t.total ?? "";
  const range = from && to ? `${from}–${to}` : from ? `${from}+` : to ? `≤${to}` : "-";
  return `${range} = ${price}`;
}

// (((((((((((((Transport Normalization and Formatting)))))))))))))
// export const num = (n: string) =>
//   Number.isFinite(parseFloat(n)) ? parseFloat(n) : 0;

