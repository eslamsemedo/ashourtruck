import { QuantityTier } from "@/types/products";

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