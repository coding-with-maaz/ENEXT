'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Truck, RefreshCw, Lock } from 'lucide-react';
import HeroSlider from '@/components/HeroSlider';
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

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.PRODUCTS);
      const data = await res.json();
      if (data.success) {
        // Get first 6 products as featured
        setFeaturedProducts(data.data.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Slider Section */}
      <section className="relative">
        <HeroSlider />
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { Icon: Truck, title: 'Free Shipping', desc: 'On orders over $50', color: 'from-blue-500 to-blue-600' },
              { Icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy', color: 'from-green-500 to-green-600' },
              { Icon: Lock, title: 'Secure Payment', desc: '100% secure checkout', color: 'from-yellow-500 to-yellow-600' },
            ].map((feature, index) => {
              const IconComponent = feature.Icon;
              return (
                <div
                  key={feature.title}
                  className="text-center animate-fade-in group"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">
              Featured Products
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Check out our most popular items
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 sm:py-16 animate-fade-in">
              <p className="text-gray-600 mb-6 text-base sm:text-lg">No products available yet.</p>
              <Link href="/products">
                <Button className="w-full sm:w-auto">Manage Products</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {featuredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <AnimatedProductCard {...product} />
                  </div>
                ))}
              </div>
              <div className="text-center mt-8 sm:mt-12 animate-fade-in">
                <Link href="/shop">
                  <Button size="lg" className="w-full sm:w-auto">View All Products</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
