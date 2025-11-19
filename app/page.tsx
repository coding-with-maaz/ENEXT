'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Truck, RefreshCw, Lock } from 'lucide-react';
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-24 md:py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
              Welcome to <span className="text-yellow-300">ENEXT</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90 animate-slide-up animation-delay-200">
              Discover amazing products at unbeatable prices. Shop with confidence and enjoy fast, reliable delivery.
            </p>
            <div className="flex gap-4 justify-center flex-wrap animate-slide-up animation-delay-400">
              <Link href="/shop">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Shop Now
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <IconComponent className="w-10 h-10 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Featured Products
            </h2>
            <p className="text-gray-600 text-lg">
              Check out our most popular items
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <p className="text-gray-600 mb-6 text-lg">No products available yet.</p>
              <Link href="/products">
                <Button>Manage Products</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="text-center mt-12 animate-fade-in">
                <Link href="/shop">
                  <Button size="lg">View All Products</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
