'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { getProductImage } from '@/lib/product-images';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="relative min-h-screen py-16 sm:py-20 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 -z-10"></div>
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="inline-block p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full mb-6 animate-bounce">
            <ShoppingCart className="w-16 h-16 text-blue-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 bg-gradient-to-r from-gray-900 via-blue-700 to-gray-900 bg-clip-text text-transparent">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
          </p>
          <Link href="/shop">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="relative min-h-screen py-12 sm:py-16 md:py-20">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-gray-900 via-blue-700 to-gray-900 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
            <p className="text-gray-600">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
          </div>
          <Button
            onClick={clearCart}
            variant="secondary"
            className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 hover:border-red-300"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
              return (
                <div
                  key={item.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6 animate-fade-in"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                  <div className="relative w-full sm:w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || getProductImage(item.name, item.id)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getProductImage(item.name, item.id);
                      }}
                    />
                  </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-blue-600 font-semibold mb-4">
                        ${itemPrice.toFixed(2)} each
                      </p>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="min-w-[40px] text-center font-bold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <Button
                          onClick={() => removeFromCart(item.id)}
                          variant="secondary"
                          className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-blue-600">
                        ${(itemPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-4 flex justify-between text-xl font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={() => router.push('/checkout')}
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mb-4 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Link href="/shop" className="block">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:bg-white hover:border-blue-500 shadow-lg hover:shadow-xl"
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
