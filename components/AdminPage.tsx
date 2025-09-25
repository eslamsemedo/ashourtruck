"use client";

import { useState, useEffect, useCallback } from 'react';
import AdminProducts from './Products';
import { getProducts } from '@/lib/api';
import { ApiPayload } from '@/types/products';



export default function AdminPag() {
  const [payload, setPayload] = useState<ApiPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      console.log('AdminPage: fetchProducts called with forceRefresh:');
      setIsLoading(true);
      setError(null);
      const data = await getProducts("https://mediumaquamarine-loris-592285.hostingersite.com/api/v1/admin/products");
      console.log('AdminPage: Received data:', data);
      setPayload(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleRefresh = useCallback(async () => {
    console.log('AdminPage: Starting force refresh...');
    await fetchProducts(); // Force refresh to bypass cache
    console.log('AdminPage: Force refresh completed');
  }, [fetchProducts]);

  if (isLoading && !payload) {
    return (
      <div className="min-h-screen bg-neutral-50 text-neutral-900 p-6">
        <div className="mx-auto max-w-7xl">
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
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 text-neutral-900 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h2>
            <p className="text-neutral-600 mb-6">{error}</p>
            <button
              onClick={() => fetchProducts()}
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-neutral-800 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="min-h-screen bg-neutral-50 text-neutral-900 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-neutral-600 mb-4">No Data Available</h2>
            <button
              onClick={() => fetchProducts()}
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-neutral-800 transition"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <AdminProducts payload={payload} refresh={handleRefresh}/>;
}
