'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import ConfirmDialog from '@/components/ConfirmDialog';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  sku: string;
  brand?: string;
  sales: number;
}

interface ProductsClientProps {
  initialData: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export default function ProductsClient({ initialData }: ProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const toast = useToast();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['products', page, search, category],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(category && { category }),
      });
      const res = await fetch(`/api/products?${params}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      const result = await res.json();
      console.log('📦 Products fetched:', result.products?.length || 0, 'products');
      return result;
    },
    initialData,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('🔄 Refetching products on mount...');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      refetch();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('🔄 Parameters changed, refetching...');
    refetch();
  }, [page, search, category, refetch]);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');
      return res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.showToast('Product deleted successfully', 'success');
      setDeleteConfirm(null);
      router.refresh();
    },
    onError: (error) => {
      toast.showToast(error.message || 'Failed to delete product', 'error');
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    router.push(`/admin/products?page=1&search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteConfirm({ id, name });
  };

  const products = data?.products || [];
  const pagination = data?.pagination || initialData.pagination;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Products
          </h1>
          <p className="mt-2 text-sm text-gray-600">Manage your product inventory</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-105"
          >
            <span className="mr-2">➕</span>
            Add Product
          </Link>
        </div>
      </div>

      {/* Search and Filter */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="glass rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products by name, SKU, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 sm:text-sm transition-all duration-200 bg-white/80 backdrop-blur-sm"
              />
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Filter by category..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 sm:text-sm transition-all duration-200 bg-white/80 backdrop-blur-sm"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 text-white rounded-xl shadow-lg hover:shadow-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 animate-gradient"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </span>
            </button>
          </div>
        </div>
      </form>

      {/* Products Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <div
              key={product._id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100/50 overflow-hidden transform hover:-translate-y-2 hover-lift animate-slideUp"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {product.images && product.images.length > 0 ? (
                <div className="relative h-56 w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-primary-700 px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {product.sku}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative h-56 w-full bg-gradient-to-br from-primary-100 via-secondary-100 to-primary-200 flex items-center justify-center">
                  <svg className="w-20 h-20 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-primary-700 px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {product.sku}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                </div>
                
                <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Stock: <span className="font-semibold ml-1">{product.stock}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs font-semibold mb-1">
                      {product.category}
                    </span>
                    {product.brand && (
                      <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Link
                    href={`/admin/products/${product._id}/edit`}
                    className="flex-1 text-center px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </span>
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id, product.name)}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-8 glass flex flex-col sm:flex-row items-center justify-between px-6 py-5 rounded-2xl shadow-lg border border-gray-200/50">
          <div className="text-sm text-gray-700 mb-4 sm:mb-0">
            Showing page <span className="font-bold text-primary-600">{pagination.page}</span> of{' '}
            <span className="font-bold text-primary-600">{pagination.pages}</span> (Total:{' '}
            <span className="font-bold text-primary-600">{pagination.total}</span> products)
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                const newPage = Math.max(1, page - 1);
                setPage(newPage);
                router.push(`/admin/products?page=${newPage}&search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`);
              }}
              disabled={page === 1}
              className="px-5 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:border-primary-500 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </span>
            </button>
            <button
              onClick={() => {
                const newPage = Math.min(pagination.pages, page + 1);
                setPage(newPage);
                router.push(`/admin/products?page=${newPage}&search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`);
              }}
              disabled={page === pagination.pages}
              className="px-5 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:border-primary-500 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              <span className="flex items-center">
                Next
                <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
        onConfirm={() => {
          if (deleteConfirm) {
            deleteMutation.mutate(deleteConfirm.id);
          }
        }}
        onCancel={() => setDeleteConfirm(null)}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
