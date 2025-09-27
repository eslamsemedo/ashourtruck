"use client";

import React, { useEffect } from "react";
import {
  Search,
  Plus,
  Loader2,
  Globe2,
  X,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  deleteAdminTransportations,
  editOrAddAdminTransportations,
  getAdminTransportations,
} from "@/lib/api";
import { ApiCreateOrUpdate, ApiList, Transport } from "@/types/transport";
import { num } from "@/lib/helper";
import z from "zod";

/** ============================
 * Admin — Transportations
 * - GET list (no paging)
 * - Search by zone (client-side)
 * - Add transport (modal + POST)
 * - Edit transport (same modal + PUT)
 * - EN/AR UI toggle
 * - Table shows ONLY: Zone | Weight | Price
 * ============================ */




export default function AdminTransportations({
  initialLang = "en" as "en" | "ar",
}) {
  const [lang, setLang] = React.useState<"en" | "ar">(initialLang);

  // data
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [records, setRecords] = React.useState<Transport[]>([]);
  const [total, setTotal] = React.useState(0);

  // search
  const [search, setSearch] = React.useState("");

  // modal form (add/edit)
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErr, setFormErr] = React.useState<string | null>(null);
  const [zone, setZone] = React.useState("");
  const [weightKg, setWeightKg] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [editingId, setEditingId] = React.useState<number | null>(null); // null = add, number = edit

  // Initial load and reload after delete
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const json = (await getAdminTransportations()) as ApiList;
        if (cancelled) return;
        setRecords(json.data.data || []);
        setTotal(json.data.total || 0);
        setError(null);
      } catch (e: any) {
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

  // Filter for search
  const filtered = React.useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter((r) => r.zone.toLowerCase().includes(q));
  }, [records, search]);

  // Delete with optimistic UI (not shown in table, but kept for parity)
  async function onDelete(id: number) {
    const prevRecords = [...records];
    const prevTotal = total;

    setRecords((r) => r.filter((p) => p.id !== id));
    setTotal((n) => Math.max(0, n - 1));

    try {
      await deleteAdminTransportations(id);
      void silentReload();
    } catch (e: any) {
      setRecords(prevRecords);
      setTotal(prevTotal);
      setError(e?.message || "Failed to delete transportation.");
    }
  }

  async function silentReload() {
    try {
      const json = (await getAdminTransportations()) as ApiList;
      setRecords(json.data.data || []);
      setTotal(json.data.total || 0);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Failed to reload data after deletion.");
    }
  }

  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);

  function openAddModal() {
    setEditingId(null);
    setZone("");
    setWeightKg("");
    setPrice("");
    setFormErr(null);
    setOpen(true);
  }

  function openEditModal(row: Transport) {
    setEditingId(row.id);
    setZone(row.zone);
    setWeightKg(row.weight_kg); // already "500.000"
    setPrice(row.price); // already "120.00"
    setFormErr(null);
    setOpen(true);
  }

  function validateTransportationFields(): string | null {

    const transportationSchema = z.object({
      zone: z.string().min(1, { message: "Zone is required." }), // Ensure that zone is a non-empty string
      weightKg: z
        .string()
        .refine((value) => !isNaN(Number(value)), { message: "Weight must be a number." }) // Validate that weightKg is a number
        .min(1, { message: "Weight must be a positive number." }), // Ensure weight is greater than 0
      price: z
        .string()
        .refine((value) => !isNaN(Number(value)), { message: "Price must be a number." }) // Validate that price is a number
        .min(1, { message: "Price must be greater than 0." }), // Ensure price is greater than 0
    });

    // Validate the fields against the schema
    const result = transportationSchema.safeParse({ zone, weightKg, price });

    if (!result.success) {
      // Return the error message from the validation schema
      const firstError = JSON.parse(result.error.message)[0].message;
      return firstError || t("Invalid input.", "إدخال غير صالح.");
    }

    // If validation passes, return null (no error)
    return null;
  }

  // IMPORTANT: match Transport + backend expectations
  function buildTransportationFormData() {
    return {
      zone: zone.trim(),
      weight: Number(weightKg).toFixed(3), // "500.000"
      price: Number(price).toFixed(2), // "120.00"
    };
  }

  function mapApiToTransport(
    raw?: Partial<Transport>
  ): Transport | undefined {
    if (!raw) return undefined;
    const now = new Date().toISOString();

    const weight_kg =
      (raw as any).weight_kg ??
      (typeof (raw as any).weight === "string"
        ? (raw as any).weight.replace(/\s*kg$/i, "")
        : undefined);

    const priceStr =
      typeof (raw as any).price === "number"
        ? (raw as any).price.toFixed(2)
        : typeof (raw as any).price === "string"
          ? Number((raw as any).price).toFixed(2)
          : undefined;

    if (raw.id == null || raw.zone == null) return undefined;

    const w = weight_kg != null ? Number(weight_kg) : 0;

    return {
      id: Number(raw.id),
      admin_id: Number((raw as any).admin_id ?? 1),
      zone: String(raw.zone),
      weight_kg: w.toFixed(3),
      price: priceStr ?? "0.00",
      created_at: (raw as any).created_at ?? now,
      updated_at: (raw as any).updated_at ?? now,
      weight: `${w.toFixed(0)} kg`,
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErr(null);

    const validationErr = validateTransportationFields();
    if (validationErr) return setFormErr(validationErr);

    const isEdit = editingId !== null;
    const nowISO = new Date().toISOString();

    try {
      setSubmitting(true);

      const formData = buildTransportationFormData();

      const apiRes = (await editOrAddAdminTransportations(
        formData,
        isEdit && editingId
      )) as ApiCreateOrUpdate;

      const returned = mapApiToTransport(apiRes?.data);

      if (isEdit) {
        const baseCreatedAt =
          records.find((r) => r.id === editingId)?.created_at ?? nowISO;

        const updatedLocal: Transport =
          returned ??
          ({
            id: editingId!,
            admin_id: 1,
            zone: zone.trim(),
            weight_kg: Number(weightKg).toFixed(3),
            price: Number(price).toFixed(2),
            created_at: baseCreatedAt,
            updated_at: nowISO,
            weight: `${Number(weightKg).toFixed(0)} kg`,
          } as Transport);

        setRecords((prev) =>
          prev.map((r) => (r.id === editingId ? { ...r, ...updatedLocal } : r))
        );
      } else {
        const tempId =
          typeof crypto !== "undefined" && "getRandomValues" in crypto
            ? crypto.getRandomValues(new Uint32Array(1))[0]
            : Date.now();

        const createdLocal: Transport =
          returned ??
          ({
            id: tempId,
            admin_id: 1,
            zone: zone.trim(),
            weight_kg: Number(weightKg).toFixed(3),
            price: Number(price).toFixed(2),
            created_at: nowISO,
            updated_at: nowISO,
            weight: `${Number(weightKg).toFixed(0)} kg`,
          } as Transport);

        setRecords((prev) => [createdLocal, ...prev]);
        setTotal((n) => n + 1);
      }

      setZone("");
      setWeightKg("");
      setPrice("");
      setEditingId(null);
      setOpen(false);
    } catch (err: any) {
      setFormErr(err?.message || t("Request failed.", "فشل الطلب."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="min-h-screen w-full bg-[#f6f7f8] px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("Admin Panel — Transportations", "لوحة التحكم — الشحن")}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {t(
                "Manage shipping zones, weights and prices.",
                "إدارة مناطق الشحن والأوزان والأسعار."
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold shadow"
            >
              <Globe2 className="h-4 w-4" /> {lang === "en" ? "العربية" : "English"}
            </button>
          </div>
        </div>

        {/* Controls (search + total) */}
        <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-9">
          <div className="md:col-span-6">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("Search by zone…", "ابحث حسب المنطقة…")}
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-slate-300"
              />
            </div>
          </div>
          <div className="md:col-span-1 flex items-center text-sm text-slate-500">
            {t("Total:", "الإجمالي:")} {total}
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex max-w-[150px] col-span-2 items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white shadow"
          >
            <Plus className="h-4 w-4" /> {t("Add transport", "إضافة شحن")}
          </button>
        </div>

        {/* Table — ONLY Zone | Weight | Price */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 text-left text-sm font-semibold text-slate-600">
                <tr>
                  <th className="px-5 py-3">{t("Zone", "المنطقة")}</th>
                  <th className="px-5 py-3">{t("Weight (kg)", "الوزن (كجم)")}</th>
                  <th className="px-5 py-3">{t("Price", "السعر")}</th>
                  <th className="px-5 py-3 text-right">{t("Actions", "إجراءات")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading && (
                  <tr>
                    <td colSpan={4} className="px-5 py-10">
                      <div className="flex items-center justify-center gap-2 text-slate-500">
                        <Loader2 className="h-4 w-4 animate-spin" />{" "}
                        {t("Loading…", "جارٍ التحميل…")}
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-slate-500">
                      {t("No transport records found.", "لا توجد سجلات شحن.")}
                    </td>
                  </tr>
                )}
                {!loading &&
                  filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/60">
                      <td className="px-5 py-4 font-medium text-slate-900">
                        {r.zone}
                      </td>
                      <td className="px-5 py-4 text-slate-700">
                        {num(r.weight_kg).toFixed(0)}
                      </td>
                      <td className="px-5 py-4 font-semibold">
                        ${num(r.price).toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(r)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                          >
                            <Pencil className="h-3.5 w-3.5" /> {t("Edit", "تعديل")}
                          </button>
                          <button
                            onClick={() => onDelete(r.id)}
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

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Add/Edit Modal (same form) */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingId === null
                  ? t("Add transport", "إضافة شحن")
                  : t("Edit transport", "تعديل الشحن")}
              </h3>
              <button
                className="rounded-lg p-2 hover:bg-slate-100"
                onClick={() => !submitting && (setOpen(false), setEditingId(null))}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  {t("Zone", "المنطقة")}
                </label>
                <input
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400"
                  placeholder={t("e.g. Egypt", "مثال: مصر")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {t("Weight (kg)", "الوزن (كجم)")}
                  </label>
                  <input
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    type="number"
                    step="0.001"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400"
                    placeholder="500.000"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {t("Price ($)", "السعر (دولار)")}
                  </label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    type="number"
                    step="0.01"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400"
                    placeholder="120.00"
                  />
                </div>
              </div>

              {formErr && (
                <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                  {formErr}
                </div>
              )}

              <div className="mt-2 flex items-center justify-end gap-2">
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