"use client";

import React, { useState, useEffect } from "react";

type Tier = { from: string; to: string; price: string; fieldNames: { from: string; to: string; price: string } };

const defaultTiers: Tier[] = [
  { from: "1", to: "50", price: "500", fieldNames: { from: "from_number", to: "to_number", price: "equal" } },
  { from: "51", to: "100", price: "450", fieldNames: { from: "from_number_2", to: "to_number_2", price: "equal_2" } },
  { from: "101", to: "800", price: "400", fieldNames: { from: "from_number_3", to: "to_number_3", price: "total_3" } },
];

export default function AddProductForm({ onCreated, data }: { onCreated?: () => Promise<void> | void; data?: any }) {
  const isEditing = Boolean(data);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [tiers, setTiers] = useState<Tier[]>(defaultTiers);

  useEffect(() => {
    if (!data) return;
    try {
      // Prefill tiers from provided data if available (assumes shape similar to LocaleProduct.quantity)
      if (Array.isArray(data.quantity) && data.quantity.length) {
        const mapped: Tier[] = data.quantity.map((t: any, i: number) => ({
          from: String(t.from ?? ""),
          to: String(t.to ?? ""),
          price: String(t.equal ?? t.total ?? ""),
          fieldNames: i === 0
            ? { from: "from_number", to: "to_number", price: "equal" }
            : i === 1
              ? { from: "from_number_2", to: "to_number_2", price: "equal_2" }
              : { from: "from_number_3", to: "to_number_3", price: "total_3" },
        }));
        setTiers(mapped);
      }
    } catch { }
  }, [data]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

    // Ensure tier field names match backend exactly
    tiers.forEach((t) => {
      fd.set(t.fieldNames.from, t.from);
      fd.set(t.fieldNames.to, t.to);
      fd.set(t.fieldNames.price, t.price);
    });

    const baseUrl = "https://mediumaquamarine-loris-592285.hostingersite.com/api/v1/admin/products";
    // Always POST. When editing, include id in the URL: /products/{id}
    let url = isEditing && data?.id ? `${baseUrl}/${data.id}` : baseUrl;

    try {
      const res = await fetch(url, {
        method: "POST",
        body: fd,
        headers: {
          Authorization: `Bearer ${"9|50hnEZPE0X7WCc5gIAcERnscQ3eJLNKOjZKunwErc801516a"}`,
          Accept: "application/json",
        },
      });
      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData?.message || (isEditing ? "Failed to update" : "Failed to create"));
      setMsg(isEditing ? "Product updated successfully ✅" : "Product created successfully ✅");
      if (!isEditing) formEl.reset();
      if (onCreated) {
        try {
          await onCreated();
        } catch (error) {
          console.error('Error in onCreated callback:', error);
        }
      }
    } catch (err: any) {
      setMsg(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">{isEditing ? "Edit product" : "Add new product"}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-neutral-600">Name</span>
          <input name="name" required className="input" placeholder="sensor car" defaultValue={data?.name || ""} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-neutral-600">Category</span>
          <input name="category" required className="input" placeholder="sensors" defaultValue={data?.category || ""} />
        </label>

        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-sm text-neutral-600">Image URL</span>
          <input name="image" type="url" required className="input" placeholder="https://…" defaultValue={data?.image || ""} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-neutral-600">Base price (price_each)</span>
          <input name="price_each" type="number" step="0.01" required className="input" defaultValue={data?.price_each || "50"} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-neutral-600">Weight</span>
          <input name="weight" type="number" step="0.01" required className="input" defaultValue={data?.weight || "0.5"} />
        </label>

        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-sm text-neutral-600">Description</span>
          <textarea name="description" rows={3} className="input" placeholder="wire steel 600 meter" defaultValue={data?.description || ""} />
        </label>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Quantity tiers</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {tiers.map((t, i) => (
            <div key={i} className="rounded-xl border border-neutral-200 p-3">
              <div className="text-xs mb-2 text-neutral-500">Tier {i + 1}</div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  className="input"
                  placeholder="from"
                  value={t.from}
                  onChange={(e) => updateTier(i, { from: e.target.value })}
                />
                <input
                  className="input"
                  placeholder="to"
                  value={t.to}
                  onChange={(e) => updateTier(i, { to: e.target.value })}
                />
                <input
                  className="input"
                  placeholder="price"
                  value={t.price}
                  onChange={(e) => updateTier(i, { price: e.target.value })}
                />
              </div>
              <p className="mt-2 text-[11px] text-neutral-500">
                Fields sent as: <code>{t.fieldNames.from}</code>, <code>{t.fieldNames.to}</code>,{" "}
                <code>{t.fieldNames.price}</code>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={loading}
          className="px-4 py-2 rounded-xl border border-neutral-300 bg-black text-white disabled:opacity-50"
        >
          {loading ? "Saving…" : isEditing ? "Update product" : "Create product"}
        </button>
        {msg && <span className="text-sm text-neutral-600">{msg}</span>}
      </div>

      <style jsx>{`
        .input {
          @apply w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black;
        }
      `}</style>
    </form>
  );

  function updateTier(index: number, patch: Partial<Tier>) {
    setTiers((arr) => {
      const next = [...arr];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }
}