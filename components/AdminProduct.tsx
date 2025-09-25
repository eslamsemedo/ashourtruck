"use client";

import React, { useEffect } from "react";
import {
  Search,
  Plus,
  Loader2,
  Pencil,
  Trash2,
  Globe2,
  X,
  Tag,
  Layers,
  LogOut,
  ArrowRight,
} from "lucide-react";

/** ============================
 * Admin — Products (with quantity tiers)
 * - GET list (no pagination UI)
 * - Search (name/desc)
 * - Filters: category chips + price range
 * - Add/Edit with modal form (POST/PUT) using FormData (exact keys requested)
 * - EN/AR UI toggle
 * - Light rounded admin theme
 * ============================ */

type QuantityTier = { from: string; to?: string; equal?: string; total?: string };

type LangProduct = {
  id: number;
  admin_id: number;
  category: string;
  name: string;
  image: string;
  price_each: string; // "50.00"
  description: string;
  weight: string;     // "0.500"
  created_at: string;
  updated_at: string;
  quantity?: QuantityTier[];
};

type RawProduct = { en: LangProduct; ar: LangProduct };

export type ApiList = {
  status: string;
  message: Record<string, string>;
  data: {
    data: RawProduct[];
    total: number;
  };
};

type ApiCreateOrUpdate = {
  status: string;
  message: Record<string, string>;
  data?: RawProduct | LangProduct; // backend may return one of these
};

type Product = {
  id: number;
  category: string;
  name: string;
  image: string;
  priceEach: number;
  description: string;
  weight: number;
  createdAt: string;
  updatedAt: string;
  tiers: QuantityTier[]; // normalized tiers (0..3)
};
// type Product = {
//   id: number | string;
//   category: string;
//   name: string;
//   image?: string;
//   priceEach: number;
//   description?: string;
//   weight: number;
//   createdAt: string;
//   updatedAt: string;
//   tiers: Array<{ from?: number; to?: number; equal?: number; total?: number }>;
// };

const API =
  "https://mediumaquamarine-loris-592285.hostingersite.com/api/v1/admin/products";

// ⚠️ For production, don’t keep tokens client-side.
const TOKEN =
  "9|50hnEZPE0X7WCc5gIAcERnscQ3eJLNKOjZKunwErc801516a";


import { deleteAdminProduct, editOrAddAdminProduct, getAdminProduct } from "@/lib/api";

const money = (n?: string) => {
  const x = Number.parseFloat(n || "0");
  return Number.isFinite(x) ? x : 0;
};
const num = (n?: string) => {
  const x = Number.parseFloat(n || "0");
  return Number.isFinite(x) ? x : 0;
};

function normalize(raw: RawProduct[], lang: "en" | "ar"): Product[] {
  return raw.map((r) => {
    const p = r[lang];
    return {
      id: p.id,
      category: (p.category || "").trim(),
      name: p.name,
      image: p.image,
      priceEach: money(p.price_each),
      description: p.description,
      weight: num(p.weight),
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      tiers: Array.isArray(p.quantity) ? p.quantity.slice(0, 3) : [],
    };
  });
}
interface prop {
  initialLang: "en" | "ar",
}

export default function AdminProducts({ initialLang = "en" as "en" | "ar" }: prop) {
  const [lang, setLang] = React.useState<"en" | "ar">(initialLang);

  // data
  const [loading, setLoading] = React.useState(true);
  const [pageload, setPageload] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [records, setRecords] = React.useState<Product[]>([]);
  const [total, setTotal] = React.useState(0);

  // search + filters
  const [search, setSearch] = React.useState("");
  const [activeCats, setActiveCats] = React.useState<string[]>([]);
  // const [priceMin, setPriceMin] = React.useState<string>("");
  // const [priceMax, setPriceMax] = React.useState<string>("");

  // modal form (add/edit)
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErr, setFormErr] = React.useState<string | null>(null);
  const [editingId, setEditingId] = React.useState<number | null>(null);

  // form fields (product)
  const [fCategory, setFCategory] = React.useState("");
  const [fName, setFName] = React.useState("");
  const [fImage, setFImage] = React.useState("");
  const [fPriceEach, setFPriceEach] = React.useState("");
  const [fDescription, setFDescription] = React.useState("");
  const [fWeight, setFWeight] = React.useState("");

  // form fields (tiers 1..3)
  const [t1_from, setT1_from] = React.useState("");
  const [t1_to, setT1_to] = React.useState("");
  const [t1_equal, setT1_equal] = React.useState("");

  const [t2_from, setT2_from] = React.useState("");
  const [t2_to, setT2_to] = React.useState("");
  const [t2_equal, setT2_equal] = React.useState("");

  const [t3_from, setT3_from] = React.useState("");
  const [t3_to, setT3_to] = React.useState("");
  const [t3_total, setT3_total] = React.useState("");

  const [apiData, setApiData] = React.useState<ApiList>()

  // Load once / on language switch
  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const json = await getAdminProduct() as ApiList;
        if (cancelled) return;
        setApiData(json);
        setRecords(normalize(json.data.data ?? [], lang));
        setTotal(json.data.total ?? 0);
        setError(null);
      } catch (e: unknown) {
        if (!cancelled) {
          const msg =
            e instanceof Error ? e.message : typeof e === "string" ? e : "Unknown error";
          setError(msg); // ✅ pass a string
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    records.forEach((p) => set.add(p.category.trim().toLowerCase()));
    return Array.from(set).map((key) => ({
      key,
      label: records.find((p) => p.category.trim().toLowerCase() === key)?.category || key,
    }));
  }, [records]);

  const filtered = React.useMemo(() => {
    let arr = records.slice();

    if (activeCats.length) {
      const set = new Set(activeCats);
      arr = arr.filter((p) => set.has(p.category.trim().toLowerCase()));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (p) =>
          p.name.toLowerCase().includes(q)

      );
    }

    // const min = priceMin.trim() ? Number(priceMin) : null;
    // const max = priceMax.trim() ? Number(priceMax) : null;
    // if (min !== null && !Number.isNaN(min)) arr = arr.filter((p) => p.priceEach >= min);
    // if (max !== null && !Number.isNaN(max)) arr = arr.filter((p) => p.priceEach <= max);

    return arr;
  }, [records, activeCats, search]);

  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);

  // helpers
  function resetForm() {
    setFCategory(""); setFName(""); setFImage("");
    setFPriceEach(""); setFDescription(""); setFWeight("");
    setT1_from(""); setT1_to(""); setT1_equal("");
    setT2_from(""); setT2_to(""); setT2_equal("");
    setT3_from(""); setT3_to(""); setT3_total("");
    setFormErr(null);
  }

  function fmtDate(iso?: string) {
    if (!iso) return "—";
    try {
      const d = new Date(iso);
      return d.toLocaleString(); // you can localize further if needed
    } catch {
      return iso ?? "—";
    }
  }

  function fmtTier(t: { from?: string; to?: string; equal?: string; total?: string }) {
    const from = t.from ?? "";
    const to = t.to ?? "";
    // Some tiers use "equal", the last uses "total"
    const price = t.equal ?? t.total ?? "";
    const range = from && to ? `${from}–${to}` : from ? `${from}+` : to ? `≤${to}` : "-";
    return `${range} = ${price}`;
  }

  function openAdd() {
    setEditingId(null);
    resetForm();
    setOpen(true);
  }

  function openEdit(p: Product) {
    setEditingId(p.id);
    setFCategory(p.category);
    setFName(p.name);
    setFImage(p.image);
    setFPriceEach(p.priceEach.toFixed(2));
    setFDescription(p.description);
    setFWeight(p.weight.toFixed(3));

    // prefill tiers (map to 3 slots)
    const [a, b, c] = p.tiers || [];
    setT1_from(a?.from ?? ""); setT1_to(a?.to ?? ""); setT1_equal(a?.equal ?? "");
    setT2_from(b?.from ?? ""); setT2_to(b?.to ?? ""); setT2_equal(b?.equal ?? "");
    setT3_from(c?.from ?? ""); setT3_to(c?.to ?? ""); setT3_total(c?.total ?? "");

    setFormErr(null);
    setOpen(true);
  }

  function toggleCat(key: string) {
    setActiveCats((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );
  }

  // Build FormData exactly as requested
  function buildFormData(): FormData {
    const fd = new FormData();
    fd.append("category", fCategory.trim());
    fd.append("image", fImage.trim());
    fd.append("price_each", Number(fPriceEach || 0).toString());
    fd.append("name", fName.trim());
    fd.append("description", fDescription.trim());
    fd.append("weight", Number(fWeight || 0).toString());

    // tier 1
    if (t1_from) fd.append("from_number", t1_from);
    if (t1_to) fd.append("to_number", t1_to);
    if (t1_equal) fd.append("equal", t1_equal);

    // tier 2
    if (t2_from) fd.append("from_number_2", t2_from);
    if (t2_to) fd.append("to_number_2", t2_to);
    if (t2_equal) fd.append("equal_2", t2_equal);

    // tier 3
    if (t3_from) fd.append("from_number_3", t3_from);
    if (t3_to) fd.append("to_number_3", t3_to);
    if (t3_total) fd.append("total_3", t3_total);

    return fd;
  }

  function toFiniteNumber(v: unknown): number | null {
    const n = typeof v === "string" ? Number(v) : (v as number);
    return Number.isFinite(n) ? n : null;
  }

  function validateFields() {
    if (!fCategory || !fCategory.trim()) return t("Category is required.", "الفئة مطلوبة.");
    if (!fName || !fName.trim()) return t("Name is required.", "الاسم مطلوب.");

    const price = toFiniteNumber(fPriceEach);
    if (price == null) return t("Price must be a number.", "يجب أن يكون السعر رقمًا.");
    if (price <= 0) return t("Price must be positive.", "يجب أن يكون السعر موجبًا.");

    const weight = toFiniteNumber(fWeight);
    if (weight == null) return t("Weight must be a number.", "يجب أن يكون الوزن رقمًا.");
    if (weight <= 0) return t("Weight must be positive.", "يجب أن يكون الوزن موجبًا.");

    return null;
  }

  function mapApiToProduct(input: unknown, lang: "en" | "ar"): Product | null {
    if (!input || typeof input !== "object") return null;

    // Case 1: multilingual object (has en + ar). Use your existing normalize()
    if ("en" in (input as any) && "ar" in (input as any)) {
      const normalized = normalize([input as RawProduct], lang);
      return normalized?.[0] ?? null;
    }

    // Case 2: LangProduct
    const p = input as Partial<LangProduct>;
    if (p.id == null || p.category == null || p.name == null || p.image == null) return null;

    const priceEach = toFiniteNumber(p.price_each);
    const weight = toFiniteNumber(p.weight);
    if (priceEach == null || weight == null) return null;

    return {
      id: p.id,
      category: p.category,
      name: p.name,
      image: p.image,
      priceEach,
      description: p.description ?? "",
      weight,
      createdAt: p.created_at ?? new Date().toISOString(),
      updatedAt: p.updated_at ?? new Date().toISOString(),
      tiers: p.quantity ?? [],
    };
  }

  function buildTiers() {
    // assumes t1_* etc. are in scope; otherwise pass them in
    const tiers: QuantityTier[] = [];
    if (t1_from || t1_to || t1_equal) tiers.push({ from: t1_from, to: t1_to, equal: t1_equal });
    if (t2_from || t2_to || t2_equal) tiers.push({ from: t2_from, to: t2_to, equal: t2_equal });
    // NOTE: you used `total` for the third tier; keep or change to `equal` intentionally:
    if (t3_from || t3_to || t3_total) tiers.push({ from: t3_from, to: t3_to, total: t3_total });
    return tiers;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErr(null);

    const validationErr = validateFields();
    if (validationErr) {
      setFormErr(validationErr);
      return;
    }

    const isEdit = editingId !== null;

    const nowISO = new Date().toISOString();

    try {
      setSubmitting(true);
      const formdata = buildFormData();
      const json = (await editOrAddAdminProduct(formdata, (isEdit && editingId))) as ApiCreateOrUpdate;
      // Try parse returned row
      let returned = mapApiToProduct(json?.data, lang);

      if (isEdit) {
        const baseCreatedAt =
          records.find((r) => r.id === editingId)?.createdAt ?? nowISO;

        const updatedLocal: Product =
          returned ?? {
            id: editingId!,
            category: fCategory.trim(),
            name: fName.trim(),
            image: fImage?.trim(),
            priceEach: toFiniteNumber(fPriceEach)!,
            description: fDescription?.trim() ?? "",
            weight: toFiniteNumber(fWeight)!,
            createdAt: baseCreatedAt,
            updatedAt: nowISO,
            tiers: buildTiers(),
          };

        setRecords((prev) =>
          prev.map((r) => (r.id === editingId ? { ...r, ...updatedLocal } : r))
        );
      } else {
        const tempId =
          typeof crypto !== "undefined" && "getRandomValues" in crypto
            ? crypto.getRandomValues(new Uint32Array(1))[0] // secure random 32-bit number
            : Date.now();

        const createdLocal: Product =
          returned ?? {
            id: tempId,
            category: fCategory.trim(),
            name: fName.trim(),
            image: fImage?.trim(),
            priceEach: toFiniteNumber(fPriceEach)!,
            description: fDescription?.trim() ?? "",
            weight: toFiniteNumber(fWeight)!,
            createdAt: nowISO,
            updatedAt: nowISO,
            tiers: buildTiers(),
          };

        setRecords((prev) => [createdLocal, ...prev]);
        setTotal((n) => n + 1);
      }

      // close + reset
      setOpen(false);
      setEditingId(null);
      resetForm();
    } catch (err: any) {
      setFormErr(err?.message || t("Request failed.", "فشل الطلب."));
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: number) {
    // (1) snapshot for rollback
    const prevRecords = records;
    const prevTotal = total;

    // (2) optimistic UI
    setRecords(r => r.filter(p => p.id !== id));
    setTotal(n => Math.max(0, n - 1));

    try {
      await deleteAdminProduct(id)

      // (3) background revalidate — don't flip the global spinner
      void silentReload(); // defined below
    } catch (e: any) {
      // (4) rollback on failure
      setRecords(prevRecords);
      setTotal(prevTotal);
      setError(e?.message || "Failed to delete");
    }
  }

  // Silent reload that doesn't show the big loading UI
  async function silentReload() {
    try {
      const json = (await getAdminProduct()) as ApiList;
      setApiData(json);
      setRecords(normalize(json.data.data || [], lang));
      setTotal(json.data.total || 0);
    } catch {
      // ignore silent reload errors; UI is already updated optimistically
    }
  }


  useEffect(() => {
    setRecords(normalize(apiData?.data.data || [], lang));
  }, [lang])


  return (
    <section className="min-h-screen w-full bg-[#f6f7f8] px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("Admin Panel — Products", "لوحة التحكم — المنتجات")}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {t("Manage products, categories, price & quantity tiers.", "إدارة المنتجات والفئات والأسعار ومستويات الكميات.")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Existing Buttons */}
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold shadow"
            >
              <Globe2 className="h-4 w-4" /> {lang === "en" ? "العربية" : "English"}
            </button>

            

            {/* New Transportation Button */}
            {/* <button
              onClick={() => window.location.href = "/admin/transportations"}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
            >
              <ArrowRight className="h-4 w-4" /> {t("Transportations", "النقل")}
            </button> */}
            {/* <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-700"
            >
              <LogOut className="h-4 w-4" /> {t("Logout", "إضافة منتج")}
            </button> */}
          </div>
        </div>

        {/* Controls */}
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-9">
          {/* Search */}
          <div className="md:col-span-6">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("Search by name", "ابحث بالاسم")}
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-slate-300"
              />

            </div>
          </div>
          {/* Total */}
          <div className="md:col-span-1 flex items-center text-sm text-slate-500">
            {t("Total:", "الإجمالي:")} {total}
          </div>
          <button
            onClick={openAdd}
            className="inline-flex max-w-[150px] col-span-2 items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white shadow"
          >
            <Plus className="h-4 w-4" /> {t("Add product", "إضافة منتج")}
          </button>
        </div>

        {/* Category chips */}
        <div className="mb-4 flex flex-wrap gap-2">
          {categories.length === 0 && (
            <span className="text-sm text-slate-500">{t("No categories", "لا توجد فئات")}</span>
          )}
          {categories.map(({ key, label }) => {
            const active = activeCats.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggleCat(key)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${active
                  ? "border-slate-300 bg-slate-800 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
              >
                <span className={`h-2 w-2 rounded-full ${active ? "bg-emerald-400" : "bg-slate-300"}`} />
                {label}
              </button>
            );
          })}
          {activeCats.length > 0 && (
            <button
              onClick={() => setActiveCats([])}
              className="ml-1 inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50"
            >
              {t("Clear", "مسح")}
            </button>
          )}
        </div>
        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 text-left text-sm font-semibold text-slate-600">
                <tr>
                  <th className="px-5 py-3">{t("Product", "المنتج")}</th>
                  <th className="px-5 py-3">{t("Category", "الفئة")}</th>
                  <th className="px-5 py-3">{t("Price", "السعر")}</th>
                  <th className="px-5 py-3">{t("Weight (kg)", "الوزن (كجم)")}</th>
                  <th className="px-5 py-3">{t("Tiers", "المستويات")}</th>
                  <th className="px-5 py-3">{t("Created", "تاريخ الإنشاء")}</th>
                  <th className="px-5 py-3">{t("Updated", "تاريخ التحديث")}</th>
                  <th className="px-5 py-3 text-right">{t("Actions", "إجراءات")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10">
                      <div className="flex items-center justify-center gap-2 text-slate-500">
                        <Loader2 className="h-4 w-4 animate-spin" /> {t("Loading…", "جارٍ التحميل…")}
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                      {t("No products found.", "لا توجد منتجات.")}
                    </td>
                  </tr>
                )}
                {!loading &&
                  filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-16 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                            {p.image ? (
                              <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                            ) : null}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{p.name}</div>
                            <div className="max-w-[120px] truncate text-xs text-slate-500">
                              {p.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                          <Tag className="h-3 w-3" /> {p.category || "-"}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold">${p.priceEach.toFixed(2)}</td>
                      <td className="px-5 py-4">{p.weight.toFixed(3)}</td>
                      <td className="px-5 py-4">
                        {p.tiers && p.tiers.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 min-w-[190px]">
                            {p.tiers.map((t, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700"
                                title={fmtTier(t)}
                              >
                                {/* small badge number */}
                                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white">
                                  {idx + 1}
                                </span>
                                {fmtTier(t)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {fmtDate(p.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {fmtDate(p.updatedAt)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(p)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                          >
                            <Pencil className="h-3.5 w-3.5" /> {t("Edit", "تعديل")}
                          </button>
                          <button
                            onClick={() => onDelete(p.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> {t("Delete", "حذف")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>


      </div>

      {/* Add/Edit Modal (with 3 quantity tiers) */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingId === null ? t("Add product", "إضافة منتج") : t("Edit product", "تعديل المنتج")}
              </h3>
              <button
                className="rounded-lg p-2 hover:bg-slate-100"
                onClick={() => !submitting && (setOpen(false), setEditingId(null))}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Basic */}
              <div className="md:col-span-1">
                <label className="mb-1 block text-sm font-medium">{t("Name", "الاسم")}</label>
                <input
                  value={fName}
                  onChange={(e) => setFName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400"
                  placeholder={t("e.g. Sensor Car", "مثال: حساس سيارة")}
                />
              </div>
              <div className="md:col-span-1">
                <label className="mb-1 block text-sm font-medium">{t("Category", "الفئة")}</label>
                <input
                  value={fCategory}
                  onChange={(e) => setFCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400"
                  placeholder={t("e.g. sensors", "مثال: أجهزة استشعار")}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">{t("Image URL", "رابط الصورة")}</label>
                <input
                  value={fImage}
                  onChange={(e) => setFImage(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400"
                  placeholder="https://…"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">{t("Price ($)", "السعر (دولار)")}</label>
                <input
                  value={fPriceEach}
                  onChange={(e) => setFPriceEach(e.target.value)}
                  type="number"
                  step="0.01"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400"
                  placeholder="50.00"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">{t("Weight (kg)", "الوزن (كجم)")}</label>
                <input
                  value={fWeight}
                  onChange={(e) => setFWeight(e.target.value)}
                  type="number"
                  step="0.001"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400"
                  placeholder="0.500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">{t("Description", "الوصف")}</label>
                <textarea
                  value={fDescription}
                  onChange={(e) => setFDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400"
                  placeholder={t("Short description…", "وصف قصير…")}
                />
              </div>

              {/* Quantity Tiers */}
              <div className="md:col-span-2 mt-2">
                <div className="text-sm font-semibold text-slate-700 mb-2">{t("Quantity tiers (up to 3)", "مستويات الكمية (حتى 3)")}</div>

                {/* Tier 1 */}
                <div className="mb-2 grid grid-cols-1 gap-3 md:grid-cols-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium">{t("From # (tier 1)", "من رقم (المستوى 1)")}</label>
                    <input value={t1_from} onChange={(e) => setT1_from(e.target.value)} type="number" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="1" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium">{t("To # (tier 1)", "إلى رقم (المستوى 1)")}</label>
                    <input value={t1_to} onChange={(e) => setT1_to(e.target.value)} type="number" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="50" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-medium">{t("Equal (total) (tier 1)", "إجمالي السعر (المستوى 1)")}</label>
                    <input value={t1_equal} onChange={(e) => setT1_equal(e.target.value)} type="number" step="0.01" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="500" />
                  </div>
                </div>

                {/* Tier 2 */}
                <div className="mb-2 grid grid-cols-1 gap-3 md:grid-cols-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium">{t("From # (tier 2)", "من رقم (المستوى 2)")}</label>
                    <input value={t2_from} onChange={(e) => setT2_from(e.target.value)} type="number" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="51" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium">{t("To # (tier 2)", "إلى رقم (المستوى 2)")}</label>
                    <input value={t2_to} onChange={(e) => setT2_to(e.target.value)} type="number" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="100" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-medium">{t("Equal (total) (tier 2)", "إجمالي السعر (المستوى 2)")}</label>
                    <input value={t2_equal} onChange={(e) => setT2_equal(e.target.value)} type="number" step="0.01" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="450" />
                  </div>
                </div>

                {/* Tier 3 */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium">{t("From # (tier 3)", "من رقم (المستوى 3)")}</label>
                    <input value={t3_from} onChange={(e) => setT3_from(e.target.value)} type="number" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="101" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium">{t("To # (tier 3)", "إلى رقم (المستوى 3)")}</label>
                    <input value={t3_to} onChange={(e) => setT3_to(e.target.value)} type="number" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="800" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-medium">{t("Total (tier 3)", "الإجمالي (المستوى 3)")}</label>
                    <input value={t3_total} onChange={(e) => setT3_total(e.target.value)} type="number" step="0.01" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="400" />
                  </div>
                </div>
              </div>

              {formErr && (
                <div className="md:col-span-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                  {formErr}
                </div>
              )}

              <div className="md:col-span-2 mt-1 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => (setOpen(false), setEditingId(null))}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm"
                  disabled={submitting}
                >
                  {t("Cancel", "إلغاء")}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId === null ? t("Save", "حفظ") : t("Update", "تحديث")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}