import ProductDetails, { ProductData } from "@/components/ProductDetails";

type RawTier = { from: string; to?: string; equal?: string; total?: string };
type RawLang = {
  id: number; admin_id: number; category: string; name: string; image: string;
  price_each: string; description: string; weight: string;
  created_at: string; updated_at: string; quantity: RawTier[];
};
type ApiRes = { status: string; message: Record<string, string>; data: { en: RawLang; ar: RawLang } };

function money(n?: string) { const x = Number.parseFloat(n || "0"); return Number.isFinite(x) ? x : 0; }

async function getProduct(id: string, lang: "en" | "ar" = "en"): Promise<ProductData | null> {
  const url = `https://mediumaquamarine-loris-592285.hostingersite.com/api/v1/products/${id}`;
  const res = await fetch(url, { cache: "no-store" }); // disable caching for fresh data
  if (!res.ok) return null;
  const json = (await res.json()) as ApiRes;
  const p = json?.data?.[lang];
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    category: (p.category ?? "").trim(),
    image: p.image,
    priceEach: money(p.price_each),
    description: p.description,
    weight: money(p.weight),
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    tiers: p.quantity || [],
    lang,
  };
}

export default async function Page(props: PageProps<'/shop/[id]'>) {
  const { id } = await props.params;
  const query = await props.searchParams
  const lang = (query.lang === "ar" ? "ar" : "en") as "en" | "ar";
  const product = await getProduct(id, lang);

  if (!product) {
    return (
      <section className="min-h-[60vh] bg-black px-6 py-24 text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p className="mt-2 text-white/70">
            We couldn’t load this product. It may have been removed or the link is invalid.
          </p>
          <a href="/shop" className="mt-6 inline-block rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500">
            Back to Shop
          </a>
        </div>
      </section>
    );
  }

  return <ProductDetails product={product} />;
}