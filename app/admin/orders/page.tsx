'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import Button from '@/components/ui/Button';
import { ShoppingCart, DollarSign, Package } from 'lucide-react';
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.ORDERS);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      // Note: You'll need to create an API endpoint for updating order status
      // For now, we'll just show an alert
      alert(`Order status update functionality requires API endpoint: PUT /api/orders/${orderId}`);
      // const res = await fetch(`${API_ENDPOINTS.ORDERS}/${orderId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus }),
      // });
      // if (res.ok) {
      //   fetchOrders();
      // }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const completedOrders = orders.filter((o) => o.status === 'completed').length;

  const columns = [
    {
      key: 'id',
      header: 'Order ID',
      sortable: true,
      render: (order: Order) => (
        <span className="font-bold text-gray-900">#{order.id}</span>
      ),
    },
    {
      key: 'user_name',
      header: 'Customer',
      sortable: true,
      render: (order: Order) => (
        <div>
          <p className="font-semibold text-gray-900">{order.user_name || 'Guest'}</p>
          {order.user_email && (
            <p className="text-xs text-gray-500">{order.user_email}</p>
          )}
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Items',
      render: (order: Order) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700">{order.items?.length || 0} item(s)</span>
        </div>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      sortable: true,
      render: (order: Order) => (
        <span className="font-bold text-blue-600">
          ${parseFloat(order.total.toString()).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (order: Order) => <StatusBadge status={order.status} />,
    },
    {
      key: 'created_at',
      header: 'Date',
      sortable: true,
      render: (order: Order) => (
        <span className="text-gray-600">
          {new Date(order.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          Order Management
        </h1>
        <p className="text-gray-600">View and manage all orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed Orders</p>
              <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={orders}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search orders by ID, customer name, or email..."
        emptyMessage="No orders found."
        actions={(order: Order) => (
          <div className="flex items-center gap-2">
            <select
              value={order.status}
              onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
              className="text-xs px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              onClick={(e) => e.stopPropagation()}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedOrder(order)}
              className="text-xs"
            >
              View
            </Button>
          </div>
        )}
      />

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order #{selectedOrder.id}</h2>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>
                </div>
                <StatusBadge status={selectedOrder.status} />
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Order Items */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item) => {
                    const itemImage = getProductImage(item.product_name, item.product_id);
                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={itemImage}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.product_name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-lg font-bold text-blue-600 mt-1">
                            ${(parseFloat(item.price.toString()) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-blue-600">
                    ${parseFloat(selectedOrder.total.toString()).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <Button
                onClick={() => setSelectedOrder(null)}
                variant="secondary"
                className="bg-white border-2 border-gray-200 hover:border-blue-500"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

