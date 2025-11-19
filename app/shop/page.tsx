'use client';

import { useState, useEffect } from 'react';
import AnimatedProductCard from '@/components/AnimatedProductCard';
import { ProductCardSkeleton } from '@/components/ui/Loading';
import Button from '@/components/ui/Button';
import { API_ENDPOINTS } from '@/lib/client-constants';
import { Search, SlidersHorizontal, Grid3x3, List, X, Filter } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, sortBy, priceRange, inStockOnly]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.PRODUCTS);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        // Set max price from products
        const maxPrice = Math.max(...data.data.map((p: Product) => p.price), 1000);
        setPriceRange([0, maxPrice]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by stock
    if (inStockOnly) {
      filtered = filtered.filter((product) => product.stock > 0);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  };

  const maxPrice = Math.max(...products.map((p) => p.price), 1000);
  const hasActiveFilters = searchTerm || priceRange[0] > 0 || priceRange[1] < maxPrice || inStockOnly;

  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange([0, maxPrice]);
    setInStockOnly(false);
  };

  return (
    <div className="relative min-h-screen py-8 sm:py-12 md:py-16">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 -z-10"></div>
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgb(59 130 246 / 0.15) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            <span className="px-5 py-2.5 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 text-blue-600 rounded-full text-sm font-bold border border-blue-100 shadow-sm">
              Premium Collection
            </span>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-blue-700 via-purple-600 to-gray-900 bg-clip-text text-transparent">
            Discover Products
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
            Explore our curated selection of premium products
          </p>
        </div>

        {/* Enhanced Search and Controls Bar */}
        <div className="mb-8 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
              {/* Search Bar */}
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm hover:shadow-md"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Sort and View Controls */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full sm:w-auto min-w-[180px] px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer appearance-none pr-10"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 rounded-lg transition-all duration-300 ${
                      viewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 rounded-lg transition-all duration-300 ${
                      viewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-3.5 rounded-xl border-2 transition-all duration-300 flex items-center gap-2 font-semibold ${
                    showFilters || hasActiveFilters
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-500 shadow-sm hover:shadow-md'
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span className="hidden sm:inline">Filters</span>
                  {hasActiveFilters && (
                    <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                      Active
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Active Filters Chips */}
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">Active filters:</span>
                {searchTerm && (
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2">
                    Search: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="hover:bg-blue-200 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                  <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-2">
                    Price: ${priceRange[0]} - ${priceRange[1]}
                    <button onClick={() => setPriceRange([0, maxPrice])} className="hover:bg-purple-200 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
                    In Stock Only
                    <button onClick={() => setInStockOnly(false)} className="hover:bg-green-200 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="ml-auto px-3 py-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Price Range: ${priceRange[0]} - ${priceRange[1]}
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>$0</span>
                        <span>${maxPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stock Filter */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Availability</label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                        Show only in-stock items
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        {!loading && filteredProducts.length > 0 && (
          <div className="mb-6 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm font-bold border border-blue-100">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
              </span>
            </div>
          </div>
        )}

        {/* Products Grid/List */}
        {loading ? (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6 sm:gap-8`}>
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 sm:py-24 animate-fade-in">
            <div className="inline-block p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 rounded-3xl border-2 border-gray-200 shadow-xl mb-8 max-w-md">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-800 mb-2 text-xl font-bold">
                {searchTerm || hasActiveFilters ? 'No products match your filters' : 'No products available yet'}
              </p>
              <p className="text-gray-600 text-sm">
                {searchTerm || hasActiveFilters 
                  ? 'Try adjusting your search terms or filters' 
                  : 'Check back soon for new products'}
              </p>
            </div>
            {(searchTerm || hasActiveFilters) && (
              <Button 
                onClick={clearFilters}
                className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        ) : (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6 sm:gap-8`}>
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in transform hover:scale-[1.02] transition-transform duration-300"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <AnimatedProductCard {...product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
