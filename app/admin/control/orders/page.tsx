"use client";

import React, { useEffect, useState } from "react";
import {
  Loader2,
  Pencil,
  Trash2,
  ArrowRight,
  X,
  Globe2, // 👈 added
} from "lucide-react";
import { changeOrderStatus } from "@/lib/api";

/** ============================
 * Admin — Orders Table
 * - GET list of orders (no pagination UI)
 * - Search (by customer name)
 * - Filters (status filter)
 * - Actions (edit, delete, and view items and full order data)
 * - Language toggle button (EN/AR)
 * ============================ */

type OrderItem = {
  id: number;
  name: string;
  qty: number;
  unit_price: string;
  line_total: string;
  image: string;
};

type Order = {
  id: number;
  currency: string;
  subtotal: string;
  discount: string;
  shipping: string;
  tax: string;
  total: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address_line1: string;
  customer_address_line2: string;
  customer_city: string;
  customer_state: string;
  customer_postal_code: string;
  customer_country: string;
  items: OrderItem[];
  status: string;
  created_at: string;
  updated_at: string;
  transportation_zone: string | null;
  transportation_weight: string | null;
  transportation_price: string | null;
};

export type ApiList = {
  status: string;
  message: Record<string, string>;
  data: Order[];
};

const API =
  "https://mediumaquamarine-loris-592285.hostingersite.com/api/v1/admin/orders";

// ⚠️ For production, don’t keep tokens client-side.
const TOKEN =
  "9|50hnEZPE0X7WCc5gIAcERnscQ3eJLNKOjZKunwErc801516a";

const STATUSES = ["pending", "confirmed", "paid", "cancelled", "refunded"] as const;

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-700 border-blue-300",
  paid: "bg-green-100 text-green-700 border-green-300",
  cancelled: "bg-red-100 text-red-700 border-red-300",
  refunded: "bg-purple-100 text-purple-700 border-purple-300",
};

export default function AdminOrders() {
  // Language
  const [lang, setLang] = useState<"en" | "ar">("en");
  const t = (en: string, ar: string) => (lang === "ar" ? ar : en);

  const [loading, setLoading] = React.useState(true);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [viewMode, setViewMode] = React.useState<"items" | "fullOrder" | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(API, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });
        const json = (await response.json()) as ApiList;
        if (!cancelled) {
          setOrders(json.data || []);
          setError(null);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(t("Failed to fetch orders.", "فشل في جلب الطلبات."));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      cancelled = true;
    };
    // no need to refetch on lang change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredOrders = React.useMemo(() => {
    let arr = orders.slice();

    if (statusFilter !== "all") {
      arr = arr.filter((order) => order.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter((order) =>
        `${order.customer_first_name} ${order.customer_last_name}`
          .toLowerCase()
          .includes(q)
      );
    }

    return arr;
  }, [orders, statusFilter, search]);

  const fmtDate = (iso?: string) => {
    if (!iso) return "—";
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso ?? "—";
    }
  };

  const handleReviewItems = (order: Order) => {
    setSelectedOrder(order);
    setViewMode("items");
  };

  const handleReviewFullOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewMode("fullOrder");
  };

  const closeReviewModal = () => {
    setSelectedOrder(null);
    setViewMode(null);
  };

  async function handleStatusChange(orderId: number, newStatus: string) {
    // optimistic update
    const previous = orders;
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    setUpdatingId(orderId);

    try {
      // Adjust endpoint/method to match your API if different
      // const res = await fetch(`${API}/${orderId}`, {
      //   method: "PATCH",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${TOKEN}`,
      //   },
      //   body: JSON.stringify({ status: newStatus }),
      // });

      // if (!res.ok) {
      //   throw new Error(`Failed to update status: ${res.status}`);
      // }
      await changeOrderStatus(orderId, newStatus);
      setError(null);
    } catch (err) {
      // rollback on error
      setOrders(previous);
      setError(
        t("Failed to update order status.", "فشل في تحديث حالة الطلب.")
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section
      className="min-h-screen w-full bg-[#f6f7f8] px-6 py-10 text-slate-900"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("Admin Panel — Orders", "لوحة التحكم — الطلبات")}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {t(
                "Manage orders, statuses, and customer information.",
                "إدارة الطلبات والحالات ومعلومات العملاء."
              )}
            </p>
          </div>

          {/* Language toggle button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold shadow"
              aria-label={t("Toggle language", "تبديل اللغة")}
              title={t("Toggle language", "تبديل اللغة")}
            >
              <Globe2 className="h-4 w-4" />
              {lang === "en" ? "العربية" : "English"}
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-9">
          {/* Search */}
          <div className="md:col-span-6">
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("Search by customer name", "ابحث باسم العميل")}
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 px-4 text-sm outline-none placeholder:text-slate-400 focus:border-slate-300"
              />
            </div>
          </div>
          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 px-4 text-sm outline-none focus:border-slate-300"
            >
              <option value="all">{t("All Orders", "جميع الطلبات")}</option>
              <option value="pending">{t("Pending", "معلق")}</option>
              <option value="completed">{t("Completed", "مكتمل")}</option>
              <option value="cancelled">{t("Cancelled", "ملغى")}</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 text-left text-sm font-semibold text-slate-600">
                <tr>
                  <th className="px-5 py-3">{t("Order ID", "رقم الطلب")}</th>
                  <th className="px-5 py-3">{t("Customer", "العميل")}</th>
                  <th className="px-5 py-3">{t("Total", "الإجمالي")}</th>
                  <th className="px-5 py-3">{t("Status", "الحالة")}</th>
                  <th className="px-5 py-3">{t("Created", "تاريخ الإنشاء")}</th>
                  <th className="px-5 py-3 text-right">{t("Actions", "إجراءات")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10">
                      <div className="flex items-center justify-center gap-2 text-slate-500">
                        <Loader2 className="h-4 w-4 animate-spin" />{" "}
                        {t("Loading…", "جارٍ التحميل…")}
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                      {t("No orders found.", "لا توجد طلبات.")}
                    </td>
                  </tr>
                )}
                {!loading &&
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/60">
                      <td className="px-5 py-4">{order.id}</td>
                      <td className="px-5 py-4">
                        {`${order.customer_first_name} ${order.customer_last_name}`}
                      </td>
                      <td className="px-5 py-4 font-semibold">
                        ${Number(order.total).toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`rounded-lg px-2 py-1.5 text-sm font-medium border outline-none focus:ring-2 focus:ring-slate-300
        ${statusColors[order.status] || "bg-slate-100 text-slate-700 border-slate-300"}`}
                            disabled={updatingId === order.id}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s} className="text-slate-800">
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>

                          {updatingId === order.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                          ) : null}
                        </div>
                      </td>
                      <td className="px-5 py-4">{fmtDate(order.created_at)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">

                          <button
                            onClick={() => handleReviewItems(order)}
                            className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                          >
                            <ArrowRight className="h-3.5 w-3.5" />{" "}
                            {t("Review Items", "مراجعة العناصر")}
                          </button>
                          <button
                            onClick={() => handleReviewFullOrder(order)}
                            className="inline-flex items-center gap-1 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700 hover:bg-orange-100"
                          >
                            <ArrowRight className="h-3.5 w-3.5" />{" "}
                            {t("Review Full Order", "مراجعة الطلب كاملًا")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Review Items Modal */}
        {selectedOrder && viewMode === "items" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {t("Order Items", "عناصر الطلب")}
                </h3>
                <button
                  onClick={closeReviewModal}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="h-12 w-16 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-sm text-slate-500">
                        {t("Quantity", "الكمية")}: {item.qty}
                      </div>
                      <div className="text-sm text-slate-500">
                        {t("Unit Price", "سعر الوحدة")}: $
                        {Number(item.unit_price).toFixed(2)}
                      </div>
                      <div className="text-sm text-slate-500">
                        {t("Line Total", "الإجمالي")}: $
                        {Number(item.line_total).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Review Full Order Modal */}
        {selectedOrder && viewMode === "fullOrder" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {t("Full Order Details", "تفاصيل الطلب كاملًا")}
                </h3>
                <button
                  onClick={closeReviewModal}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                {/* Customer Details */}
                <div>
                  <div className="font-medium text-slate-900">
                    {t("Customer", "العميل")}
                  </div>
                  <div className="text-sm text-slate-500">
                    {selectedOrder.customer_first_name}{" "}
                    {selectedOrder.customer_last_name}
                  </div>
                  <div className="text-sm text-slate-500">
                    {selectedOrder.customer_email}
                  </div>
                  <div className="text-sm text-slate-500">
                    {selectedOrder.customer_phone}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <div className="font-medium text-slate-900">
                    {t("Address", "العنوان")}
                  </div>
                  <div className="text-sm text-slate-500">
                    {selectedOrder.customer_address_line1},{" "}
                    {selectedOrder.customer_address_line2}
                  </div>
                  <div className="text-sm text-slate-500">
                    {selectedOrder.customer_city},{" "}
                    {selectedOrder.customer_state},{" "}
                    {selectedOrder.customer_postal_code},{" "}
                    {selectedOrder.customer_country}
                  </div>
                </div>

                {/* Transportation Details */}
                <div>
                  <div className="font-medium text-slate-900">
                    {t("Transportation", "النقل")}
                  </div>
                  <div className="text-sm text-slate-500">
                    {t("Transportation Zone", "منطقة النقل")}:{" "}
                    {selectedOrder.transportation_zone || t("N/A", "غير متوفر")}
                  </div>
                  <div className="text-sm text-slate-500">
                    {t("Transportation Weight", "وزن النقل")}:{" "}
                    {selectedOrder.transportation_weight || t("N/A", "غير متوفر")}
                  </div>
                  <div className="text-sm text-slate-500">
                    {t("Transportation Price", "سعر النقل")}:{" "}
                    {selectedOrder.transportation_price != null
                      ? `$${Number(selectedOrder.transportation_price).toFixed(2)}`
                      : t("N/A", "غير متوفر")}
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <div className="font-medium text-slate-900">
                    {t("Order Summary", "ملخص الطلب")}
                  </div>
                  <div className="text-sm text-slate-500">
                    {t("Subtotal", "الإجمالي الفرعي")}: $
                    {Number(selectedOrder.subtotal).toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-500">
                    {t("Discount", "الخصم")}: $
                    {Number(selectedOrder.discount).toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-500">
                    {t("Shipping", "الشحن")}: $
                    {Number(selectedOrder.shipping).toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-500">
                    {t("Tax", "الضرائب")}: $
                    {Number(selectedOrder.tax).toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-700 font-semibold">
                    {t("Total", "الإجمالي")}: $
                    {Number(selectedOrder.total).toFixed(2)}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <div className="font-medium text-slate-900">
                    {t("Items", "العناصر")}
                  </div>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="text-sm text-slate-500">
                        {item.name} — {t("Qty", "الكمية")}: {item.qty} × $
                        {Number(item.unit_price).toFixed(2)} = $
                        {Number(item.line_total).toFixed(2)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}