'use client';

import { useState, useEffect } from 'react';
import AnimatedProductCard from '@/components/AnimatedProductCard';
import { ProductCardSkeleton } from '@/components/ui/Loading';
import Button from '@/components/ui/Button';
import { API_ENDPOINTS } from '@/lib/client-constants';

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

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, sortBy]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.PRODUCTS);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
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

  return (
    <div className="py-8 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="mb-8 animate-slide-down">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Shop</h1>
          <p className="text-gray-600 text-lg">
            Browse our complete collection of products
          </p>
        </div>

        {/* Search and Sort */}
        <div className="flex gap-4 mb-8 flex-wrap items-center animate-fade-in">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[200px] max-w-md px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="min-w-[200px] px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-gray-600 mb-6 text-lg">
              {searchTerm ? 'No products found matching your search.' : 'No products available yet.'}
            </p>
            {searchTerm && (
              <Button onClick={() => setSearchTerm('')}>Clear Search</Button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600 animate-fade-in">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <AnimatedProductCard {...product} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

