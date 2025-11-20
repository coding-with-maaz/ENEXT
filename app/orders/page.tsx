'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { 
  Package, 
  Calendar, 
  DollarSign, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock,
  ArrowRight,
  Eye
} from 'lucide-react';
import { API_ENDPOINTS, ORDER_STATUS_COLORS } from '@/lib/client-constants';
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
  user_name?: string;
  user_email?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ORDERS);
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        setOrders(data.data);
      } else {
        // Fallback to mock data
        const { getMockOrders } = await import('@/lib/mock-data');
        const mockOrders = getMockOrders();
        setOrders(mockOrders as Order[]);
      }
    } catch (error: any) {
      console.error('Error fetching orders, using mock data:', error);
      // Fallback to mock data
      const { getMockOrders } = await import('@/lib/mock-data');
      const mockOrders = getMockOrders();
      setOrders(mockOrders as Order[]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    return ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="relative min-h-screen py-16 sm:py-20 md:py-24 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen py-16 sm:py-20 md:py-24 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="inline-block p-6 bg-red-50 rounded-full mb-6">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Error Loading Orders</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchOrders} className="bg-gradient-to-r from-blue-600 to-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-12 sm:py-16 md:py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 -z-10"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-200/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-200/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 animate-fade-in">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-gray-900 via-blue-700 to-gray-900 bg-clip-text text-transparent">
              My Orders
            </h1>
            <p className="text-gray-600">View and track all your orders</p>
          </div>
          <Link href="/shop">
            <Button
              variant="secondary"
              className="mt-4 sm:mt-0 bg-white border-2 border-gray-200 hover:border-blue-500"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-16 sm:py-20 animate-fade-in">
            <div className="inline-block p-6 bg-blue-50 rounded-full mb-6">
              <Package className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <Link href="/shop">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Start Shopping
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {orders.map((order, index) => (
              <div
                key={order.id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-gray-200">
                  <div className="mb-4 sm:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Package className="w-6 h-6 text-blue-600" />
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Order #{order.id}
                      </h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">${parseFloat(order.total.toString()).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
                      style={{
                        backgroundColor: `${getStatusColor(order.status)}20`,
                        color: getStatusColor(order.status),
                      }}
                    >
                      {getStatusIcon(order.status)}
                      <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {order.items?.map((item) => {
                    const itemImage = getProductImage(item.product_name, item.product_id);
                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
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
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 mb-1 truncate">{item.product_name}</h3>
                          <p className="text-sm text-gray-600 mb-2">Quantity: {item.quantity}</p>
                          <p className="text-lg font-bold text-blue-600">
                            ${(parseFloat(item.price.toString()) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4" />
                    <span>
                      {order.status === 'completed' 
                        ? 'Delivered' 
                        : order.status === 'cancelled'
                        ? 'Cancelled'
                        : 'Processing'}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/checkout/success?orderId=${order.id}`}>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white border-2 border-gray-200 hover:border-blue-500"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    {order.status === 'pending' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-red-50 border-2 border-red-200 text-red-600 hover:bg-red-100"
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
