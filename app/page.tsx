'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
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
      <section
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
          color: 'var(--white)',
          padding: '6rem 0',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              lineHeight: '1.2',
            }}
          >
            Welcome to ENEXT
          </h1>
          <p
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
              marginBottom: '2rem',
              opacity: 0.9,
              maxWidth: '600px',
              margin: '0 auto 2rem',
            }}
          >
            Discover amazing products at unbeatable prices. Shop with confidence and enjoy fast, reliable delivery.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/shop" className="btn btn-lg" style={{ background: 'var(--white)', color: 'var(--primary)' }}>
              Shop Now
            </Link>
            <Link href="/about" className="btn btn-lg btn-outline" style={{ borderColor: 'var(--white)', color: 'var(--white)' }}>
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0', background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="grid grid-3" style={{ gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  background: 'var(--primary)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '2rem',
                }}
              >
                🚚
              </div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Free Shipping</h3>
              <p style={{ color: 'var(--gray-600)' }}>On orders over $50</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  background: 'var(--success)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '2rem',
                }}
              >
                🔄
              </div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Easy Returns</h3>
              <p style={{ color: 'var(--gray-600)' }}>30-day return policy</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  background: 'var(--accent)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '2rem',
                }}
              >
                🔒
              </div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Secure Payment</h3>
              <p style={{ color: 'var(--gray-600)' }}>100% secure checkout</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Featured Products</h2>
            <p style={{ color: 'var(--gray-600)', fontSize: '1.125rem' }}>
              Check out our most popular items
            </p>
          </div>

          {loading ? (
            <div className="spinner"></div>
          ) : featuredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>No products available yet.</p>
              <Link href="/products" className="btn btn-primary">
                Manage Products
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-3">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <Link href="/shop" className="btn btn-primary btn-lg">
                  View All Products
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
