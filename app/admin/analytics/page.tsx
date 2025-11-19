'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/client-constants';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  averageOrderValue: number;
  topProducts: Array<{ name: string; sales: number }>;
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        fetch(API_ENDPOINTS.USERS),
        fetch(API_ENDPOINTS.PRODUCTS),
        fetch(API_ENDPOINTS.ORDERS),
      ]);

      const [usersData, productsData, ordersData] = await Promise.all([
        usersRes.json(),
        productsRes.json(),
        ordersRes.json(),
      ]);

      const users = usersData.success ? usersData.data : [];
      const products = productsData.success ? productsData.data : [];
      const orders = ordersData.success ? ordersData.data : [];

      const totalRevenue = orders.reduce((sum: number, order: any) => {
        return sum + parseFloat(order.total || 0);
      }, 0);

      const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

      // Calculate growth (mock data for now)
      const revenueGrowth = 12.5;
      const ordersGrowth = 8.3;

      setAnalytics({
        totalRevenue,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalProducts: products.length,
        revenueGrowth,
        ordersGrowth,
        averageOrderValue,
        topProducts: [], // Would need order items data
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          Analytics
        </h1>
        <p className="text-gray-600">Track your store's performance and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className={`flex items-center gap-1 ${analytics.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.revenueGrowth > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-semibold">{Math.abs(analytics.revenueGrowth)}%</span>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Revenue</h3>
          <p className="text-3xl font-extrabold text-gray-900">${analytics.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div className={`flex items-center gap-1 ${analytics.ordersGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.ordersGrowth > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-semibold">{Math.abs(analytics.ordersGrowth)}%</span>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Orders</h3>
          <p className="text-3xl font-extrabold text-gray-900">{analytics.totalOrders}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Users</h3>
          <p className="text-3xl font-extrabold text-gray-900">{analytics.totalUsers}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Products</h3>
          <p className="text-3xl font-extrabold text-gray-900">{analytics.totalProducts}</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Average Order Value</h3>
          <p className="text-4xl font-extrabold text-blue-600">
            ${analytics.averageOrderValue.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Average amount per order
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Overview</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Revenue Growth</span>
              <span className={`font-semibold ${analytics.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analytics.revenueGrowth > 0 ? '+' : ''}{analytics.revenueGrowth}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Orders Growth</span>
              <span className={`font-semibold ${analytics.ordersGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analytics.ordersGrowth > 0 ? '+' : ''}{analytics.ordersGrowth}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

