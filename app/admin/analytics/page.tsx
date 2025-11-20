'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/client-constants';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  usersGrowth: number;
  averageOrderValue: number;
  conversionRate: number;
  topProducts: Array<{ id: number; name: string; sales: number; revenue: number; quantity: number }>;
  topCustomers: Array<{ id: number; name: string; email: string; orders: number; revenue: number }>;
  revenueByStatus: { pending: number; completed: number; cancelled: number };
  ordersByStatus: { pending: number; completed: number; cancelled: number };
  dailyRevenue: Array<{ date: string; revenue: number; orders: number }>;
  monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>;
  customerRetention: number;
  averageItemsPerOrder: number;
}

type TimeRange = 'today' | 'week' | 'month' | 'year' | 'all';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const getDateRange = (range: TimeRange) => {
    const now = new Date();
    const start = new Date();
    
    switch (range) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        start.setFullYear(2020); // Arbitrary old date
        break;
    }
    
    return { start, end: now };
  };

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
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

      let users = usersData.success && usersData.data ? usersData.data : [];
      let products = productsData.success && productsData.data ? productsData.data : [];
      let orders = ordersData.success && ordersData.data ? ordersData.data : [];

      // Fallback to mock data if no data available
      if (users.length === 0 || products.length === 0 || orders.length === 0) {
        const { getMockUsers, getMockProducts, getMockOrders } = await import('@/lib/mock-data');
        if (users.length === 0) users = getMockUsers() as any[];
        if (products.length === 0) products = getMockProducts() as any[];
        if (orders.length === 0) orders = getMockOrders() as any[];
      }

      const { start, end } = getDateRange(timeRange);
      
      // Filter orders by time range
      const filteredOrders = orders.filter((order: any) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= start && orderDate <= end;
      });

      // Calculate previous period for comparison
      const periodDiff = end.getTime() - start.getTime();
      const prevStart = new Date(start.getTime() - periodDiff);
      const prevEnd = start;
      
      const prevOrders = orders.filter((order: any) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= prevStart && orderDate < prevEnd;
      });

      // Revenue calculations
      const totalRevenue = filteredOrders.reduce((sum: number, order: any) => {
        return sum + parseFloat(order.total || 0);
      }, 0);

      const prevRevenue = prevOrders.reduce((sum: number, order: any) => {
        return sum + parseFloat(order.total || 0);
      }, 0);

      const revenueGrowth = prevRevenue > 0 
        ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 
        : totalRevenue > 0 ? 100 : 0;

      // Orders growth
      const ordersGrowth = prevOrders.length > 0
        ? ((filteredOrders.length - prevOrders.length) / prevOrders.length) * 100
        : filteredOrders.length > 0 ? 100 : 0;

      // Users growth
      const newUsers = users.filter((user: any) => {
        const userDate = new Date(user.created_at);
        return userDate >= start && userDate <= end;
      });
      
      const prevNewUsers = users.filter((user: any) => {
        const userDate = new Date(user.created_at);
        return userDate >= prevStart && userDate < prevEnd;
      });

      const usersGrowth = prevNewUsers.length > 0
        ? ((newUsers.length - prevNewUsers.length) / prevNewUsers.length) * 100
        : newUsers.length > 0 ? 100 : 0;

      // Average order value
      const averageOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;

      // Top products by sales
      const productSales: { [key: number]: { name: string; revenue: number; quantity: number } } = {};
      
      filteredOrders.forEach((order: any) => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item: any) => {
            if (!productSales[item.product_id]) {
              const product = products.find((p: any) => p.id === item.product_id);
              productSales[item.product_id] = {
                name: product?.name || 'Unknown',
                revenue: 0,
                quantity: 0,
              };
            }
            productSales[item.product_id].revenue += parseFloat(item.price || 0) * parseInt(item.quantity || 0);
            productSales[item.product_id].quantity += parseInt(item.quantity || 0);
          });
        }
      });

      const topProducts = Object.entries(productSales)
        .map(([id, data]) => ({
          id: parseInt(id),
          name: data.name,
          sales: data.quantity,
          revenue: data.revenue,
          quantity: data.quantity,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // Top customers
      const customerStats: { [key: number]: { name: string; email: string; orders: number; revenue: number } } = {};
      
      filteredOrders.forEach((order: any) => {
        if (!customerStats[order.user_id]) {
          const user = users.find((u: any) => u.id === order.user_id);
          customerStats[order.user_id] = {
            name: user?.name || 'Unknown',
            email: user?.email || '',
            orders: 0,
            revenue: 0,
          };
        }
        customerStats[order.user_id].orders += 1;
        customerStats[order.user_id].revenue += parseFloat(order.total || 0);
      });

      const topCustomers = Object.entries(customerStats)
        .map(([id, data]) => ({
          id: parseInt(id),
          ...data,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // Revenue by status
      const revenueByStatus = {
        pending: 0,
        completed: 0,
        cancelled: 0,
      };

      const ordersByStatus = {
        pending: 0,
        completed: 0,
        cancelled: 0,
      };

      filteredOrders.forEach((order: any) => {
        const status = order.status?.toLowerCase() || 'pending';
        revenueByStatus[status as keyof typeof revenueByStatus] += parseFloat(order.total || 0);
        ordersByStatus[status as keyof typeof ordersByStatus] += 1;
      });

      // Daily revenue (last 30 days)
      const dailyRevenueMap: { [key: string]: { revenue: number; orders: number } } = {};
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toISOString().split('T')[0];
      });

      last30Days.forEach(date => {
        dailyRevenueMap[date] = { revenue: 0, orders: 0 };
      });

      filteredOrders.forEach((order: any) => {
        const orderDate = new Date(order.created_at).toISOString().split('T')[0];
        if (dailyRevenueMap[orderDate]) {
          dailyRevenueMap[orderDate].revenue += parseFloat(order.total || 0);
          dailyRevenueMap[orderDate].orders += 1;
        }
      });

      const dailyRevenue = last30Days.map(date => ({
        date,
        revenue: dailyRevenueMap[date].revenue,
        orders: dailyRevenueMap[date].orders,
      }));

      // Monthly revenue (last 12 months)
      const monthlyRevenueMap: { [key: string]: { revenue: number; orders: number } } = {};
      const last12Months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      });

      const monthKeys = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        return date.toISOString().slice(0, 7); // YYYY-MM format
      });

      monthKeys.forEach((monthKey, index) => {
        monthlyRevenueMap[last12Months[index]] = { revenue: 0, orders: 0 };
      });

      filteredOrders.forEach((order: any) => {
        const orderDate = new Date(order.created_at);
        const monthKey = orderDate.toISOString().slice(0, 7);
        const monthIndex = monthKeys.indexOf(monthKey);
        if (monthIndex !== -1) {
          const monthLabel = last12Months[monthIndex];
          monthlyRevenueMap[monthLabel].revenue += parseFloat(order.total || 0);
          monthlyRevenueMap[monthLabel].orders += 1;
        }
      });

      const monthlyRevenue = last12Months.map(month => ({
        month,
        revenue: monthlyRevenueMap[month].revenue,
        orders: monthlyRevenueMap[month].orders,
      }));

      // Average items per order
      let totalItems = 0;
      filteredOrders.forEach((order: any) => {
        if (order.items && Array.isArray(order.items)) {
          totalItems += order.items.reduce((sum: number, item: any) => sum + parseInt(item.quantity || 0), 0);
        }
      });
      const averageItemsPerOrder = filteredOrders.length > 0 ? totalItems / filteredOrders.length : 0;

      // Conversion rate (mock - would need visitor data)
      const conversionRate = filteredOrders.length > 0 ? (filteredOrders.length / users.length) * 100 : 0;

      // Customer retention (users with multiple orders)
      const customerOrderCounts: { [key: number]: number } = {};
      filteredOrders.forEach((order: any) => {
        customerOrderCounts[order.user_id] = (customerOrderCounts[order.user_id] || 0) + 1;
      });
      const returningCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length;
      const customerRetention = filteredOrders.length > 0 
        ? (returningCustomers / Object.keys(customerOrderCounts).length) * 100 
        : 0;

      setAnalytics({
        totalRevenue,
        totalOrders: filteredOrders.length,
        totalUsers: users.length,
        totalProducts: products.length,
        revenueGrowth,
        ordersGrowth,
        usersGrowth,
        averageOrderValue,
        conversionRate,
        topProducts,
        topCustomers,
        revenueByStatus,
        ordersByStatus,
        dailyRevenue,
        monthlyRevenue,
        customerRetention,
        averageItemsPerOrder,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Chart components
  const RevenueChart = ({ data }: { data: Array<{ date: string; revenue: number }> }) => {
    const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
    const chartHeight = 200;
    const chartWidth = 1000;
    const padding = 40;
    const barWidth = (chartWidth - padding * 2) / data.length - 4;

    return (
      <div className="w-full overflow-x-auto">
        <svg width={chartWidth} height={chartHeight + padding} className="min-w-full">
          {data.map((item, index) => {
            const barHeight = (item.revenue / maxRevenue) * chartHeight;
            const x = padding + index * (barWidth + 4);
            const y = chartHeight - barHeight + padding;
            
            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="url(#revenueGradient)"
                  rx={4}
                  className="hover:opacity-80 transition-opacity"
                />
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + padding + 15}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                  fontSize="10"
                >
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </text>
              </g>
            );
          })}
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  const MonthlyChart = ({ data }: { data: Array<{ month: string; revenue: number }> }) => {
    const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
    const chartHeight = 200;
    const chartWidth = 1000;
    const padding = 40;
    const barWidth = (chartWidth - padding * 2) / data.length - 4;

    return (
      <div className="w-full overflow-x-auto">
        <svg width={chartWidth} height={chartHeight + padding} className="min-w-full">
          {data.map((item, index) => {
            const barHeight = (item.revenue / maxRevenue) * chartHeight;
            const x = padding + index * (barWidth + 4);
            const y = chartHeight - barHeight + padding;
            
            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="url(#monthlyGradient)"
                  rx={4}
                  className="hover:opacity-80 transition-opacity"
                />
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + padding + 15}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                  fontSize="10"
                >
                  {item.month}
                </text>
              </g>
            );
          })}
          <defs>
            <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  const StatusPieChart = ({ revenueByStatus, ordersByStatus }: { revenueByStatus: any; ordersByStatus: any }) => {
    const totalRevenue = revenueByStatus.completed + revenueByStatus.pending + revenueByStatus.cancelled;
    const totalOrders = ordersByStatus.completed + ordersByStatus.pending + ordersByStatus.cancelled;
    
    const calculatePath = (value: number, total: number, startAngle: number) => {
      if (total === 0) return '';
      const percentage = value / total;
      const angle = percentage * 360;
      const radius = 60;
      const centerX = 80;
      const centerY = 80;
      
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = ((startAngle + angle) * Math.PI) / 180;
      
      const x1 = centerX + radius * Math.cos(startAngleRad);
      const y1 = centerY + radius * Math.sin(startAngleRad);
      const x2 = centerX + radius * Math.cos(endAngleRad);
      const y2 = centerY + radius * Math.sin(endAngleRad);
      
      const largeArc = angle > 180 ? 1 : 0;
      
      return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    };

    let currentAngle = 0;
    const completedAngle = totalRevenue > 0 ? (revenueByStatus.completed / totalRevenue) * 360 : 0;
    const pendingAngle = totalRevenue > 0 ? (revenueByStatus.pending / totalRevenue) * 360 : 0;
    const cancelledAngle = totalRevenue > 0 ? (revenueByStatus.cancelled / totalRevenue) * 360 : 0;

    const completedPath = calculatePath(revenueByStatus.completed, totalRevenue, currentAngle);
    currentAngle += completedAngle;
    const pendingPath = calculatePath(revenueByStatus.pending, totalRevenue, currentAngle);
    currentAngle += pendingAngle;
    const cancelledPath = calculatePath(revenueByStatus.cancelled, totalRevenue, currentAngle);

    return (
      <div className="flex items-center justify-center">
        <svg width="160" height="160" viewBox="0 0 160 160">
          {completedPath && (
            <path
              d={completedPath}
              fill="#10b981"
              className="hover:opacity-80 transition-opacity"
            />
          )}
          {pendingPath && (
            <path
              d={pendingPath}
              fill="#f59e0b"
              className="hover:opacity-80 transition-opacity"
            />
          )}
          {cancelledPath && (
            <path
              d={cancelledPath}
              fill="#ef4444"
              className="hover:opacity-80 transition-opacity"
            />
          )}
          <text
            x="80"
            y="80"
            textAnchor="middle"
            className="text-xs fill-gray-700 font-semibold"
            fontSize="12"
            dy="0.3em"
          >
            {totalRevenue > 0 ? `${((revenueByStatus.completed / totalRevenue) * 100).toFixed(0)}%` : '0%'}
          </text>
        </svg>
      </div>
    );
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">Track your store's performance and insights</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Time Range Filter */}
          <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1">
            {(['today', 'week', 'month', 'year', 'all'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={fetchAnalytics}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-md">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center gap-1 ${analytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.revenueGrowth >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span className="text-sm font-semibold">{Math.abs(analytics.revenueGrowth).toFixed(1)}%</span>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Revenue</h3>
          <p className="text-3xl font-extrabold text-gray-900">{formatCurrency(analytics.totalRevenue)}</p>
          <p className="text-xs text-gray-500 mt-2">vs previous period</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center gap-1 ${analytics.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.ordersGrowth >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span className="text-sm font-semibold">{Math.abs(analytics.ordersGrowth).toFixed(1)}%</span>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Orders</h3>
          <p className="text-3xl font-extrabold text-gray-900">{formatNumber(analytics.totalOrders)}</p>
          <p className="text-xs text-gray-500 mt-2">vs previous period</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-md">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center gap-1 ${analytics.usersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.usersGrowth >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span className="text-sm font-semibold">{Math.abs(analytics.usersGrowth).toFixed(1)}%</span>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Users</h3>
          <p className="text-3xl font-extrabold text-gray-900">{formatNumber(analytics.totalUsers)}</p>
          <p className="text-xs text-gray-500 mt-2">vs previous period</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200 shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-md">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Products</h3>
          <p className="text-3xl font-extrabold text-gray-900">{formatNumber(analytics.totalProducts)}</p>
          <p className="text-xs text-gray-500 mt-2">Active inventory</p>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-600">Avg Order Value</h3>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{formatCurrency(analytics.averageOrderValue)}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-semibold text-gray-600">Conversion Rate</h3>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{analytics.conversionRate.toFixed(1)}%</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <h3 className="text-sm font-semibold text-gray-600">Avg Items/Order</h3>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{analytics.averageItemsPerOrder.toFixed(1)}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-orange-600" />
            <h3 className="text-sm font-semibold text-gray-600">Customer Retention</h3>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{analytics.customerRetention.toFixed(1)}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Daily Revenue (Last 30 Days)</h3>
              <p className="text-sm text-gray-600">Revenue trends over time</p>
            </div>
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <RevenueChart data={analytics.dailyRevenue} />
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Monthly Revenue (Last 12 Months)</h3>
              <p className="text-sm text-gray-600">Long-term revenue trends</p>
            </div>
            <Activity className="w-6 h-6 text-purple-600" />
          </div>
          <MonthlyChart data={analytics.monthlyRevenue} />
        </div>
      </div>

      {/* Revenue by Status & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Status */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Revenue by Status</h3>
              <p className="text-sm text-gray-600">Breakdown by order status</p>
            </div>
            <PieChart className="w-6 h-6 text-green-600" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Completed</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(analytics.revenueByStatus.completed)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Pending</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(analytics.revenueByStatus.pending)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Cancelled</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(analytics.revenueByStatus.cancelled)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <StatusPieChart 
                revenueByStatus={analytics.revenueByStatus} 
                ordersByStatus={analytics.ordersByStatus} 
              />
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Top Products</h3>
              <p className="text-sm text-gray-600">Best performing products</p>
            </div>
            <Package className="w-6 h-6 text-orange-600" />
          </div>
          <div className="space-y-3">
            {analytics.topProducts.length > 0 ? (
              analytics.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{formatNumber(product.quantity)} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(product.revenue)}</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No product sales data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Top Customers</h3>
            <p className="text-sm text-gray-600">Most valuable customers</p>
          </div>
          <Users className="w-6 h-6 text-purple-600" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Orders</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topCustomers.length > 0 ? (
                analytics.topCustomers.map((customer, index) => (
                  <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{customer.name}</td>
                    <td className="py-3 px-4 text-gray-600">{customer.email}</td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">{customer.orders}</td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900">{formatCurrency(customer.revenue)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No customer data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
