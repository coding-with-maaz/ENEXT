'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { API_ENDPOINTS } from '@/lib/client-constants';
import Button from '@/components/ui/Button';
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react';

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
      <div className="relative min-h-screen py-16 sm:py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="relative min-h-screen py-16 sm:py-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="inline-block p-6 bg-red-50 rounded-full mb-6">
            <Package className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Product not found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/shop')} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const priceNum = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

  return (
    <div className="relative min-h-screen py-12 sm:py-16 md:py-20">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <Button
          onClick={() => router.back()}
          variant="secondary"
          className="mb-8 flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white shadow-lg hover:shadow-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Product Image */}
          <div className="animate-fade-in">
            <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-2xl group">
              <div className="w-full h-full flex items-center justify-center text-8xl sm:text-9xl">
                🛍️
              </div>
              {product.stock === 0 && (
                <div className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                  Out of Stock
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Product Info */}
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-4">
                Product Details
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-blue-700 to-gray-900 bg-clip-text text-transparent">
                {product.name}
              </h1>
            </div>

            <div className="mb-6 sm:mb-8">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-blue-600">
                  ${priceNum.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mb-6 sm:mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg">
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            <div className="mb-6 sm:mb-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">Stock Status:</span>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    product.stock > 0
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg">
                <label className="block mb-4 font-semibold text-gray-900">
                  Quantity:
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-xl transition-all duration-300 hover:scale-110"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                    className="w-24 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-xl transition-all duration-300 hover:scale-110"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                size="lg"
                className="flex-1 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
              <Button
                onClick={() => router.push('/shop')}
                variant="secondary"
                size="lg"
                className="flex-1 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:bg-white hover:border-blue-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
