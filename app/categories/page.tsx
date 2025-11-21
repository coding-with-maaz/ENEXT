'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { API_ENDPOINTS } from '@/lib/client-constants';
import { Tag, Package, ArrowRight, Grid3x3 } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category?: string;
  price: number;
  stock: number;
}

interface CategoryInfo {
  name: string;
  slug: string;
  productCount: number;
  minPrice: number;
  maxPrice: number;
}

function slugifyCategory(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function CategoriesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.PRODUCTS);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setProducts(data.data);
        } else {
          const { getMockProducts } = await import('@/lib/mock-data');
          setProducts(getMockProducts() as any);
        }
      } catch (error) {
        console.error('Error fetching products for categories, using mock data:', error);
        const { getMockProducts } = await import('@/lib/mock-data');
        setProducts(getMockProducts() as any);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories: CategoryInfo[] = useMemo(() => {
    if (!products || products.length === 0) return [];

    const map = new Map<string, CategoryInfo>();

    for (const p of products) {
      const rawName = p.category && p.category.trim() ? p.category.trim() : 'Uncategorized';
      const key = rawName.toLowerCase();
      const existing = map.get(key);

      if (!existing) {
        map.set(key, {
          name: rawName,
          slug: slugifyCategory(rawName),
          productCount: 1,
          minPrice: p.price,
          maxPrice: p.price,
        });
      } else {
        existing.productCount += 1;
        existing.minPrice = Math.min(existing.minPrice, p.price);
        existing.maxPrice = Math.max(existing.maxPrice, p.price);
      }
    }

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  return (
    <div className="relative min-h-screen py-12 sm:py-16 md:py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 -z-10" />
      <div
        className="absolute inset-0 opacity-25 -z-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(59 130 246 / 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            <span className="px-5 py-2.5 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 text-blue-600 rounded-full text-sm font-bold border border-blue-100 shadow-sm flex items-center gap-2">
              <Grid3x3 className="w-4 h-4" />
              Categories
            </span>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-blue-700 via-purple-600 to-gray-900 bg-clip-text text-transparent">
            Browse by Category
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
            Explore our product catalog organized into easy-to-browse categories.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4" />
            <p className="text-gray-600 text-lg font-medium">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 sm:py-20 animate-fade-in">
            <div className="inline-block p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 rounded-3xl border-2 border-gray-200 shadow-xl mb-6 max-w-md">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="w-10 h-10 text-gray-500" />
              </div>
              <p className="text-gray-800 mb-2 text-xl font-bold">No categories yet</p>
              <p className="text-gray-600 text-sm">
                Add products with categories in the admin panel to see them listed here.
              </p>
            </div>
            <Link href="/admin/products">
              <Button className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                Manage Products
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 animate-fade-in">
              {categories.map((category, index) => (
                <Link
                  key={category.slug}
                  href={`/shop?category=${encodeURIComponent(category.name)}`}
                  className="group"
                >
                  <div
                    className="relative h-full p-6 sm:p-7 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 rounded-2xl transition-all duration-300" />

                    <div className="relative flex items-start gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <Tag className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors duration-300">
                          {category.name}
                        </h2>
                        <p className="text-sm text-gray-600 mb-2">
                          {category.productCount}{' '}
                          {category.productCount === 1 ? 'product' : 'products'}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1.5">
                          <Package className="w-3 h-3" />
                          <span>
                            Price range ${category.minPrice.toFixed(2)} – $
                            {category.maxPrice.toFixed(2)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="relative mt-4 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                        View products
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center animate-fade-in">
              <Link href="/shop">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-bold"
                >
                  Browse All Products
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


