import { useMemo } from "react";
import { normalizeQuantityTiers, formatMoney, parseNumber, formatDate } from "../lib/helper";
import TierChips from "./TierChips";
import { LocaleProduct } from "@/types/products";

function ProductCard({ product, locale, onEdit }: { product: LocaleProduct; locale: "en" | "ar"; onEdit?: (p: LocaleProduct) => void }) {
  const tiers = useMemo(() => normalizeQuantityTiers(product.quantity), [product.quantity]);
  const lowTier = tiers[0];

  return (
    <div className="group rounded-3xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="aspect-square w-full overflow-hidden bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold leading-tight line-clamp-2">{product.name}</h3>
            <div className="mt-1 text-xs text-neutral-500">#{product.id}</div>
          </div>
          <span className="inline-flex items-center whitespace-nowrap rounded-xl bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700">
            {product.category}
          </span>
        </div>

        <p className="text-sm text-neutral-600 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-500">{locale === "ar" ? "السعر الأساسي" : "Base price"}</div>
            <div className="text-lg font-semibold">{formatMoney(parseNumber(product.price_each), locale)}</div>
          </div>
          {lowTier && (
            <div className="text-right">
              <div className="text-xs text-neutral-500">
                {locale === "ar" ? `من ${lowTier.from} إلى ${lowTier.to}` : `From ${lowTier.from} to ${lowTier.to}`}
              </div>
              <div className="font-medium">{formatMoney(lowTier.price, locale)}</div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <TierChips product={product} locale={locale} />
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-neutral-500">
          <span>
            {locale === "ar" ? "أُنشئ: " : "Created: "}
            {formatDate(product.created_at, locale)}
          </span>
          <span>
            {locale === "ar" ? "تحديث: " : "Updated: "}
            {formatDate(product.updated_at, locale)}
          </span>
        </div>

        <div className="pt-2 flex items-center gap-2">
          <button
            className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-50"
            onClick={() => onEdit?.(product)}
          >
            {locale === "ar" ? "تعديل" : "Edit"}
          </button>
          <button className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50">
            {locale === "ar" ? "حذف" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
