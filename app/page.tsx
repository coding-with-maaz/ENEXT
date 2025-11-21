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
  slug?: string;
  category?: string;
  description: string;
  short_description?: string;
  price: number;
  stock: number;
  image_url?: string;
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
      if (data.success && data.data && data.data.length > 0) {
        // Get first 6 products as featured
        setFeaturedProducts(data.data.slice(0, 6));
      } else {
        // Fallback to mock data
        const { getMockProducts } = await import('@/lib/mock-data');
        setFeaturedProducts(getMockProducts().slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching products, using mock data:', error);
      // Fallback to mock data
      const { getMockProducts } = await import('@/lib/mock-data');
      setFeaturedProducts(getMockProducts().slice(0, 6));
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
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
              Premium Services
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Experience the best shopping experience with our premium services
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { Icon: Truck, title: 'Free Shipping', desc: 'On orders over $50', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
              { Icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', textColor: 'text-green-600' },
              { Icon: Lock, title: 'Secure Payment', desc: '100% secure checkout', color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-50', textColor: 'text-yellow-600' },
            ].map((feature, index) => {
              const IconComponent = feature.Icon;
              return (
                <div
                  key={feature.title}
                  className="relative group animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Card with glassmorphism effect */}
                  <div className={`relative h-full p-6 sm:p-8 ${feature.bgColor} rounded-2xl backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2`}>
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
                    
                    {/* Icon container */}
                    <div className="relative mb-6">
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={2.5} />
                      </div>
                      {/* Decorative circle */}
                      <div className={`absolute -top-2 -right-2 w-6 h-6 ${feature.bgColor} rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    </div>
                    
                    {/* Content */}
                    <h3 className={`text-xl sm:text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300`}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      {feature.desc}
                    </p>
                    
                    {/* Bottom accent line */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="relative py-16 sm:py-20 md:py-24 bg-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(0 0 0) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Decorative gradient orbs */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
              <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 rounded-full text-sm font-semibold border border-blue-100">
                Shop Now
              </span>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-blue-700 to-gray-900 bg-clip-text text-transparent">
              Featured Products
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Discover our handpicked collection of premium products
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16 sm:py-20 animate-fade-in">
              <div className="inline-block p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-100 mb-6">
                <p className="text-gray-700 mb-2 text-lg font-semibold">No products available yet.</p>
                <p className="text-gray-500 text-sm">Start adding products to showcase them here</p>
              </div>
              <Link href="/products">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Manage Products
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {featuredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in transform hover:scale-[1.02] transition-transform duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <AnimatedProductCard
                      id={product.id}
                      name={product.name}
                      slug={product.slug}
                      category={product.category}
                      description={product.description}
                      short_description={product.short_description}
                      price={product.price}
                      stock={product.stock}
                      image_url={product.image_url}
                    />
                  </div>
                ))}
              </div>
              <div className="text-center mt-12 sm:mt-16 animate-fade-in">
                <Link href="/shop">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-bold"
                  >
                    View All Products
                    <svg className="w-5 h-5 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter/CTA Section */}
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden mb-0">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold mb-6 border border-white/30">
              Stay Updated
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 sm:mb-6">
              Get Exclusive Deals & Updates
            </h2>
            <p className="text-white/90 text-base sm:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about new products, special offers, and exclusive discounts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300"
              />
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold px-8 py-4 whitespace-nowrap"
              >
                Subscribe
              </Button>
            </div>
            <p className="text-white/70 text-xs sm:text-sm mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
