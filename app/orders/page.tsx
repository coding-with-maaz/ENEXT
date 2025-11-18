'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import '../globals.css';

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
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

  if (loading) {
    return (
      <div className="container">
        <div className="card">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/" className="btn btn-secondary">← Back to Home</Link>
      </div>

      <div className="card">
        <h1 style={{ marginBottom: '2rem' }}>Orders</h1>

        {orders.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>
            No orders found. Create users and products first, then orders can be created via API.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  padding: '1.5rem',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h2>Order #{order.id}</h2>
                    <p style={{ color: '#6c757d', marginTop: '0.5rem' }}>
                      Customer: {order.user_name} ({order.user_email})
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                      ${order.total.toFixed(2)}
                    </div>
                    <div
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.25rem 0.75rem',
                        background: order.status === 'completed' ? '#28a745' : '#ffc107',
                        color: 'white',
                        borderRadius: '4px',
                        display: 'inline-block',
                        fontSize: '0.875rem',
                      }}
                    >
                      {order.status}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>Items:</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td>{item.product_name}</td>
                          <td>{item.quantity}</td>
                          <td>${item.price.toFixed(2)}</td>
                          <td>${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p style={{ marginTop: '1rem', color: '#6c757d', fontSize: '0.875rem' }}>
                  Created: {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

