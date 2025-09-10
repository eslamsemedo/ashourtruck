import { useMemo } from "react";
import { normalizeQuantityTiers, formatMoney } from "../lib/helper";
import { LocaleProduct } from "@/types/products";


function TierChips({ product, locale }: { product: LocaleProduct; locale: "en" | "ar" }) {
  const tiers = useMemo(() => normalizeQuantityTiers(product.quantity), [product.quantity]);
  if (!tiers.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tiers.map((t, i) => (
        <span
          key={`${product.id}-tier-${i}`}
          className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-neutral-700"
          title={
            locale === "ar"
              ? `من ${t.from} إلى ${t.to}: ${formatMoney(t.price, locale)}`
              : `From ${t.from} to ${t.to}: ${formatMoney(t.price, locale)}`
          }
        >
          {locale === "ar"
            ? `${t.from}-${t.to}: ${formatMoney(t.price, locale)}`
            : `${t.from}-${t.to}: ${formatMoney(t.price, locale)}`}
        </span>
      ))}
    </div>
  );
}

export default TierChips;
