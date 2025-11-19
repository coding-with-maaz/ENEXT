'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/client-constants';
import Button from '@/components/ui/Button';

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: number;
  lowStockProducts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
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

      // Calculate revenue
      const revenue = orders.reduce((sum: number, order: any) => {
        return sum + parseFloat(order.total || 0);
      }, 0);

      // Recent orders (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentOrders = orders.filter((order: any) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= sevenDaysAgo;
      }).length;

      // Low stock products (stock < 10)
      const lowStockProducts = products.filter((product: any) => product.stock < 10).length;

      setStats({
        totalUsers: users.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: revenue,
        recentOrders,
        lowStockProducts,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      link: '/admin/users',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      link: '/admin/products',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      link: '/admin/orders',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      link: '/admin/orders',
    },
  ];

  const quickStats = [
    {
      title: 'Recent Orders',
      value: stats.recentOrders,
      subtitle: 'Last 7 days',
      icon: Activity,
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Low Stock Products',
      value: stats.lowStockProducts,
      subtitle: 'Need restocking',
      icon: Package,
      trend: '-5%',
      trendUp: false,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.link}
              className="group bg-white rounded-2xl border border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6"
              style={{ animationDelay: `${(index + 4) * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600">{stat.title}</h3>
                    <p className="text-xs text-gray-500">{stat.subtitle}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trendUp ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-semibold">{stat.trend}</span>
                </div>
              </div>
              <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/products/new">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl">
              <Package className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
          <Link href="/admin/users/new">
            <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl">
              <Users className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="secondary" className="w-full bg-white border-2 border-gray-200 hover:border-blue-500">
              <ShoppingCart className="w-4 h-4 mr-2" />
              View Orders
            </Button>
          </Link>
          <Link href="/admin/analytics">
            <Button variant="secondary" className="w-full bg-white border-2 border-gray-200 hover:border-blue-500">
              <Activity className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

