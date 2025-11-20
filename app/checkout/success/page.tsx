'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { 
  CheckCircle, 
  ShoppingBag, 
  ArrowRight, 
  Package, 
  Truck, 
  Mail,
  Calendar,
  MapPin,
  CreditCard,
  Download
} from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/client-constants';
import { getProductImage } from '@/lib/product-images';

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
  customer_info?: any;
  shipping_info?: any;
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async (id?: string) => {
    try {
      const orderIdToFetch = id || orderId;
      const response = await fetch(`${API_ENDPOINTS.ORDERS}/${orderIdToFetch}`);
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    } else {
      // Try to get from sessionStorage
      const lastOrderId = sessionStorage.getItem('lastOrderId');
      if (lastOrderId) {
        fetchOrder(lastOrderId);
      } else {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (loading) {
    return (
      <div className="relative min-h-screen py-16 sm:py-20 md:py-24 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <CheckoutSuccessUI order={order} />
  );
}

function CheckoutSuccessUI({ order }: { order: Order | null }) {
  return (
    <div className="relative min-h-screen py-12 sm:py-16 md:py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 -z-10"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <div className="inline-block p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full mb-6 animate-bounce">
              <CheckCircle className="w-20 h-20 text-green-600" strokeWidth={2} />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-green-700 to-gray-900 bg-clip-text text-transparent">
              Order Placed Successfully!
            </h1>
            
            <p className="text-gray-600 mb-2 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Thank you for your purchase. We've sent a confirmation email with your order details.
            </p>
            {order && (
              <p className="text-gray-500 text-sm">
                Order #{order.id} • {new Date(order.created_at).toLocaleDateString()}
              </p>
            )}
          </div>

          {order && (
            <div className="space-y-6 animate-fade-in">
              {/* Order Summary */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Package className="w-6 h-6 text-blue-600" />
                    Order Summary
                  </h2>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-700'
                      : order.status === 'cancelled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  {order.items?.map((item) => {
                    const itemImage = getProductImage(item.product_name, item.product_id);
                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
                      >
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {itemImage ? (
                            <img
                              src={itemImage}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              <Package />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">{item.product_name}</h3>
                          <p className="text-sm text-gray-600 mb-2">Quantity: {item.quantity}</p>
                          <p className="text-lg font-bold text-blue-600">
                            ${(parseFloat(item.price.toString()) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-blue-600">${parseFloat(order.total.toString()).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Info */}
                {order.shipping_info && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Truck className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900">Shipping Address</h3>
                    </div>
                    <div className="space-y-2 text-gray-700">
                      <p className="font-semibold">{order.customer_info?.firstName} {order.customer_info?.lastName}</p>
                      <p>{order.shipping_info.address}</p>
                      <p>
                        {order.shipping_info.city}, {order.shipping_info.state} {order.shipping_info.zipCode}
                      </p>
                      <p>{order.shipping_info.country}</p>
                    </div>
                  </div>
                )}

                {/* Order Details */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                  </div>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Number:</span>
                      <span className="font-semibold">#{order.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-semibold">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-semibold ${
                        order.status === 'completed' 
                          ? 'text-green-600'
                          : order.status === 'cancelled'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    {order.customer_info?.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-semibold">{order.customer_info.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* What's Next */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 shadow-xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">What's Next?</h3>
                </div>
                <div className="space-y-3 text-gray-700">
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>You'll receive an email confirmation with your order details and tracking information.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Your order will be processed and shipped within 1-2 business days.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>You can track your order status in your account dashboard.</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 sm:mt-12 animate-fade-in">
            <Link href="/shop">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
              >
                Continue Shopping
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/orders">
              <Button 
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:bg-white hover:border-blue-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                View All Orders
              </Button>
            </Link>
            {order && (
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:bg-white hover:border-blue-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={() => window.print()}
              >
                <Download className="w-5 h-5 mr-2" />
                Print Receipt
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-screen py-16 sm:py-20 md:py-24 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Loading order details...</p>
          </div>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
