"use client";


import toast, { Toaster } from 'react-hot-toast';
import React, { useMemo, useState, useEffect, useCallback, memo } from "react";
import { formatMoney, parseNumber, includesI, formatDate, normalizeQuantityTiers } from "@/lib/helper";
// import ProductCard from "./ProductCard";
import TierChips from "./TierChips";
import AddProductForm from "./AddProductForm";
import { useDebounce } from "@/lib/hooks";
import { getProducts, deleteProduct } from "@/lib/api";
import { ApiPayload, ProductRecord, LocaleProduct } from "@/types/products";
import DeleteConfirm from './deleteConfirm';

// =====================================================
// Component
// =====================================================

const AdminProducts = memo(function AdminProducts({payload, refresh}: {payload: ApiPayload, refresh: ()=>{}}) {
  // UI state
  const [locale, setLocale] = useState<"en" | "ar">("en");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"created" | "updated" | "price" | "name">("created");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [localPage, setLocalPage] = useState(1);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number, name: string } | null>(null);

  // Debounce search query for better performance
  const debouncedQuery = useDebounce(query, 300);

  // Handle initial loading state
  useEffect(() => {
    if (payload && payload.data) {
      setIsInitialLoading(false);
    }
  }, [payload]);

  // Reset page when debounced query changes
  useEffect(() => {
    setLocalPage(1);
  }, [debouncedQuery]);

  // RTL support for Arabic
  // useEffect(() => {
  //   if (typeof document !== "undefined") {
  //     document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  //   }
  // }, [locale]);

  // Backend pagination data
  const paginationData = payload?.data;
  const allRecords = paginationData?.data ?? [];
  // const currentPage = paginationData?.current_page ?? 1;
  // const lastPage = paginationData?.last_page ?? 1;
  // const total = paginationData?.total ?? 0;
  const perPage = paginationData?.per_page ?? 8;
  // const hasNextPage = !!paginationData?.next_page_url;
  // const hasPrevPage = !!paginationData?.prev_page_url;

  // Transform records to locale-specific format
  const transformedRecords = useMemo(() => {
    return allRecords.map((r: ProductRecord) => (locale === "ar" ? r.ar : r.en));
  }, [allRecords, locale]);

  // Get categories from the data
  const categories = useMemo(() => {
    const set = new Set<string>();
    transformedRecords.forEach((r: LocaleProduct) => set.add(r.category || ""));
    return ["all", ...Array.from(set).filter(Boolean)];
  }, [transformedRecords]);

  // Client-side filtering with debounced search
  const filteredRecords = useMemo(() => {
    return transformedRecords.filter((p: LocaleProduct) => {
      // Search filter using debounced query
      const matchesSearch = debouncedQuery
        ? includesI(p.name, debouncedQuery) || includesI(p.category, debouncedQuery) || includesI(p.description, debouncedQuery)
        : true;

      // Category filter
      const matchesCategory = category === "all" ? true : p.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [transformedRecords, debouncedQuery, category]);

  // Client-side sorting
  const sortedRecords = useMemo(() => {
    const arr = [...filteredRecords];
    arr.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return parseNumber(a.price_each) - parseNumber(b.price_each);
        case "name":
          return a.name.localeCompare(b.name);
        case "updated":
          return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        case "created":
        default:
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
    });
    return arr;
  }, [filteredRecords, sortBy]);

  // Client-side pagination
  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / perPage));
  const pageClamped = Math.min(localPage, totalPages);
  const displayRecords = useMemo(() => {
    const start = (pageClamped - 1) * perPage;
    return sortedRecords.slice(start, start + perPage);
  }, [sortedRecords, pageClamped, perPage]);


  // Optimized event handlers with useCallback
  const handleFilterChange = useCallback(() => {
    // Reset to first page when filters change
    setLocalPage(1);
    // No API call needed - filtering is done client-side
    // The component will automatically re-render with filtered data
  }, []);

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // Don't trigger filter change immediately - let debounce handle it
  }, []);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    handleFilterChange();
  }, [handleFilterChange]);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as any);
    handleFilterChange();
  }, [handleFilterChange]);

  const handlePageChange = useCallback((direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setLocalPage(p => Math.max(1, p - 1));
    } else {
      setLocalPage(p => Math.min(totalPages, p + 1));
    }
  }, [totalPages]);

  const toggleLocale = useCallback(() => {
    setLocale(prev => prev === "en" ? "ar" : "en");
  }, []);

  const toggleAddForm = useCallback(() => {
    setEditingProduct(null);
    setShowAddForm(prev => !prev);
  }, []);

  // Function to handle product refresh after add/edit
  const handleProductRefresh = useCallback(async () => {
    if (refresh) {
      try {
        setIsLoading(true);
        await refresh();
        // Reset filters and pagination after refresh
        setQuery("");
        setCategory("all");
        setLocalPage(1);
        setShowAddForm(false);
        setEditingProduct(null);
      } catch (error) {
        console.error('Error refreshing products:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  // Function to handle product deletion
  const handleDeleteProduct = useCallback(async (productId: number, productName: string) => {
    // Show confirmation dialog
    // const confirmMessage = locale === "ar"
    //   ? `هل أنت متأكد من حذف المنتج "${productName}"؟ لا يمكن التراجع عن هذا الإجراء.`
    //   : `Are you sure you want to delete the product "${productName}"? This action cannot be undone.`;

    // if (!window.confirm(confirmMessage)) {
    //   return;
    // }

    try {
      setIsLoading(true);
      console.log('Attempting to delete product with ID:', productId);
      const deleteResult = await deleteProduct(productId);
      console.log('Delete result:', deleteResult);

      // Add a small delay to ensure backend has processed the delete
      // await new Promise(resolve => setTimeout(resolve, 500));

      // Show success message
      const successMessage = locale === "ar"
        ? `تم حذف المنتج "${productName}" بنجاح `
        : `Product "${productName}" deleted successfully `;

      // You could add a toast notification here instead of alert
      // alert(successMessage);
      toast.success(successMessage)

      // Refresh the product list
      // if (onRefresh) {
      //   console.log('Refreshing product list after deletion...');
      //   await onRefresh();
      //   console.log('Product list refreshed successfully');
      // } else {
      //   console.warn('No refresh function provided');
      // }
    } catch (error) {
      console.error('Error deleting product:', error);
      const errorMessage = locale === "ar"
        ? `فشل في حذف المنتج: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
        : `Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`;
      // alert(errorMessage);
      toast.error(errorMessage)
    } finally {
      setIsLoading(false);
    }
  }, [locale]);



  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-neutral-200 rounded mb-4"></div>
      <div className="h-4 bg-neutral-200 rounded mb-2"></div>
      <div className="h-4 bg-neutral-200 rounded mb-6 w-3/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="h-12 bg-neutral-200 rounded"></div>
        <div className="h-12 bg-neutral-200 rounded"></div>
        <div className="h-12 bg-neutral-200 rounded"></div>
      </div>
      <div className="h-4 bg-neutral-200 rounded mb-4"></div>
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-16 bg-neutral-200 rounded"></div>
        ))}
      </div>
    </div>
  );

  // Show loading skeleton while initial data is loading
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 text-neutral-900 p-6">
        <div className="mx-auto max-w-7xl">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 p-6">
      {/* Header */}
      {
        deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <DeleteConfirm
              productName={deleteTarget.name}
              onCancel={() => setDeleteTarget(null)}
              onConfirm={async () => {
                await handleDeleteProduct(deleteTarget.id, deleteTarget.name);
                handleProductRefresh()
                setDeleteTarget(null);
              }}
              locale={locale}
            />
          </div>
        )
      }
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{locale === "ar" ? "لوحة التحكم — المنتجات" : "Admin Panel — Products"}</h1>
            <p className="text-sm text-neutral-600 mt-1">
              {locale === "ar" ? payload.message.ar : payload.message.en}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={toggleLocale}
              className="px-3 py-2 rounded-xl border border-neutral-300 bg-white shadow-sm hover:shadow transition"
              aria-label="Toggle language"
            >
              {locale === "en" ? "العربية" : "English"}
            </button>
            <button
              onClick={toggleAddForm}
              className="px-3 py-2 rounded-xl border border-neutral-300 bg-black text-white shadow-sm hover:shadow transition"
            >
              {showAddForm ? (locale === "ar" ? "إغلاق النموذج" : "Close form") : (locale === "ar" ? "إضافة منتج" : "Add product")}
            </button>
            {/* <button
              onClick={handleProductRefresh}
              disabled={isLoading}
              className="px-3 py-2 rounded-xl border border-neutral-300 bg-white shadow-sm hover:shadow transition disabled:opacity-50"
              title={locale === "ar" ? "تحديث البيانات" : "Refresh data"}
            >
              {isLoading ? "⟳" : "↻"}
            </button> */}
          </div>
        </div>

        {showAddForm && (
          <div className="mt-6">
            <AddProductForm
              data={editingProduct || undefined}
              onCreated={handleProductRefresh}
            />
          </div>
        )}

        {/* Controls */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder={locale === "ar" ? "ابحث بالاسم أو الفئة أو الوصف" : "Search by name, category, or description"}
              value={query}
              onChange={handleQueryChange}
              className="w-full px-4 py-3 rounded-2xl border border-neutral-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="flex gap-2">
            <select
              className="flex-1 px-3 py-3 rounded-2xl border border-neutral-300 bg-white shadow-sm"
              value={category}
              onChange={handleCategoryChange}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? (locale === "ar" ? "كل الفئات" : "All categories") : c}
                </option>
              ))}
            </select>
            <select
              className="flex-1 px-3 py-3 rounded-2xl border border-neutral-300 bg-white shadow-sm"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="created">{locale === "ar" ? "تاريخ الإنشاء" : "Created date"}</option>
              <option value="updated">{locale === "ar" ? "تاريخ التحديث" : "Updated date"}</option>
              <option value="name">{locale === "ar" ? "الاسم" : "Name"}</option>
              <option value="price">{locale === "ar" ? "السعر" : "Price"}</option>
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 text-sm text-neutral-600">
          {locale === "ar"
            ? `إجمالي المنتجات: ${sortedRecords.length} | الصفحة ${pageClamped} من ${totalPages}`
            : `Total products: ${sortedRecords.length} | Page ${pageClamped} of ${totalPages}`}
        </div>

        {/* Grid */}
        {/* <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pageSlice.map((p) => (
            <ProductCard
              key={`${p.id}-${locale}`}
              product={p}
              locale={locale}
              onEdit={(prod) => {
                setEditingProduct(prod);
                setShowAddForm(true);
              }}
            />
          ))}
        </div> */}

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            className="px-3 py-2 rounded-xl border border-neutral-300 bg-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={pageClamped <= 1}
            onClick={() => handlePageChange('prev')}
          >
            {locale === "ar" ? "السابق" : "Previous"}
          </button>
          <div className="px-3 py-2 text-sm text-neutral-700">
            {locale === "ar" ? `صفحة ${pageClamped} من ${totalPages}` : `Page ${pageClamped} of ${totalPages}`}
          </div>
          <button
            className="px-3 py-2 rounded-xl border border-neutral-300 bg-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={pageClamped >= totalPages}
            onClick={() => handlePageChange('next')}
          >
            {locale === "ar" ? "التالي" : "Next"}
          </button>
        </div>

        {/* Table view (optional) */}
        <div className="mt-10 overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-700">
              <tr>
                <th className="text-left px-4 py-3">{locale === "ar" ? "المنتج" : "Product"}</th>
                <th className="text-left px-4 py-3">{locale === "ar" ? "الفئة" : "Category"}</th>
                <th className="text-left px-4 py-3">{locale === "ar" ? "السعر الأساسي" : "Base price"}</th>
                <th className="text-left px-4 py-3">{locale === "ar" ? "الوزن" : "Weight"}</th>
                <th className="text-left px-4 py-3">{locale === "ar" ? "الكمية (طبقات)" : "Quantity (tiers)"}</th>
                <th className="text-left px-4 py-3">{locale === "ar" ? "أُنشئ" : "Created"}</th>
                <th className="text-left px-4 py-3">{locale === "ar" ? "تحديث" : "Updated"}</th>
                <th className="text-left px-4 py-3">{locale === "ar" ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {displayRecords.map((p) => (
                <tr key={`row-${p.id}`} className="border-t border-neutral-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                      <div className="font-medium">{p.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-xl bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">{formatMoney(parseNumber(p.price_each), locale)}</td>
                  <td className="px-4 py-3">{p.weight}</td>
                  <td className="px-4 py-3">
                    <TierChips product={p} locale={locale} />
                  </td>
                  <td className="px-4 py-3">{formatDate(p.created_at, locale)}</td>
                  <td className="px-4 py-3">{formatDate(p.updated_at, locale)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="px-2.5 py-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-50"
                        onClick={() => {
                          setEditingProduct(p);
                          setShowAddForm(true);
                        }}
                      >
                        {locale === "ar" ? "تعديل" : "Edit"}
                      </button>
                      <button
                        className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        disabled={isLoading}
                        onClick={() => {
                          console.log('Delete button clicked for product:', p.id, p.name);
                          // handleDeleteProduct(p.id, p.name);
                          setDeleteTarget({ id: p.id, name: p.name })
                        }}
                      >
                        {isLoading ? (locale === "ar" ? "جاري الحذف..." : "Deleting...") : (locale === "ar" ? "حذف" : "Delete")}
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
  );
});

export default AdminProducts;