'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { API_ENDPOINTS } from '@/lib/client-constants';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_ENDPOINTS.PRODUCTS}/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.data);
      } else {
        router.push('/shop');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      router.push('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      router.push('/cart');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Product not found</h2>
        <button onClick={() => router.push('/shop')} className="btn btn-primary">
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <button
          onClick={() => router.back()}
          className="btn btn-secondary"
          style={{ marginBottom: '2rem' }}
        >
          ← Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
          {/* Product Image */}
          <div>
            <div
              style={{
                width: '100%',
                aspectRatio: '1',
                background: 'linear-gradient(135deg, var(--gray-100) 0%, var(--gray-200) 100%)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8rem',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              🛍️
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              {product.name}
            </h1>
            <div style={{ marginBottom: '1.5rem' }}>
              <span
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: 'var(--primary)',
                }}
              >
                ${product.price.toFixed(2)}
              </span>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <p style={{ color: 'var(--gray-600)', lineHeight: '1.8', fontSize: '1.125rem' }}>
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ fontWeight: '600' }}>Stock:</span>
                <span
                  style={{
                    color: product.stock > 0 ? 'var(--success)' : 'var(--danger)',
                    fontWeight: '600',
                  }}
                >
                  {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {product.stock > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Quantity:
                </label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                    style={{ width: '80px', textAlign: 'center' }}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn btn-primary btn-lg"
                style={{ flex: 1, minWidth: '200px' }}
              >
                Add to Cart
              </button>
              <button
                onClick={() => router.push('/shop')}
                className="btn btn-outline btn-lg"
                style={{ flex: 1, minWidth: '200px' }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

