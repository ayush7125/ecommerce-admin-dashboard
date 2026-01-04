'use client';

import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from 'recharts';

interface DashboardClientProps {
  stats: {
    totalProducts: number;
    totalStock: number;
    totalSales: number;
    lowStockProducts: number;
    categoryStats: Array<{ _id: string; count: number; totalSales: number }>;
    topProducts: Array<{ _id: string; name: string; sales: number }>;
  };
}

const COLORS = [
  '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#ef4444', '#f97316', '#f59e0b', '#eab308'
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-medium">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardClient({ stats: initialStats }: DashboardClientProps) {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await fetch('/api/products/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
    initialData: initialStats,
    refetchInterval: 30000,
  });

  const categoryData = stats.categoryStats.map((cat: { _id: string; count: number; totalSales: number }) => ({
    name: cat._id || 'Uncategorized',
    value: cat.count,
    sales: cat.totalSales || 0,
  }));

  const topProductsData = stats.topProducts
    .filter((product: any) => product.sales > 0) // Only show products with sales
    .map((product: any) => ({
      name: product.name.length > 12 ? product.name.substring(0, 12) + '...' : product.name,
      sales: product.sales || 0,
    }));

  const categorySalesData = categoryData.filter((cat: { name: string; value: number; sales: number }) => cat.sales > 0);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-600">Real-time overview of your e-commerce store</p>
      </div>

      {/* Stats Grid with Animations */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Total Products */}
        <div className="group relative bg-gradient-to-br from-blue-500 to-blue-600 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute inset-0 bg-white opacity-10"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Products</p>
                <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
              </div>
              <div className="w-14 h-14 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Total Stock */}
        <div className="group relative bg-gradient-to-br from-green-500 to-emerald-600 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute inset-0 bg-white opacity-10"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Total Stock</p>
                <p className="text-3xl font-bold text-white">{stats.totalStock.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Total Sales */}
        <div className="group relative bg-gradient-to-br from-yellow-500 to-orange-500 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute inset-0 bg-white opacity-10"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium mb-1">Total Sales</p>
                <p className="text-3xl font-bold text-white">{stats.totalSales.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="group relative bg-gradient-to-br from-red-500 to-pink-600 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute inset-0 bg-white opacity-10"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium mb-1">Low Stock</p>
                <p className="text-3xl font-bold text-white">{stats.lowStockProducts}</p>
              </div>
              <div className="w-14 h-14 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Products by Category - Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Products by Category</h2>
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {categoryData.map((entry: { name: string; value: number; sales: number }, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p>No category data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Top Selling Products - Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Top Selling Products</h2>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          {topProductsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProductsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="sales" 
                  fill="url(#colorGradient)"
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                >
                  <LabelList dataKey="sales" position="top" fill="#6b7280" fontSize={12} />
                </Bar>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={1} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <p>No sales data available</p>
                <p className="text-sm mt-2">Products need sales to appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sales by Category - Full Width Bar Chart */}
      {categorySalesData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Sales by Category</h2>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={categorySalesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="sales" 
                fill="url(#salesGradient)"
                radius={[8, 8, 0, 0]}
                animationDuration={800}
              >
                <LabelList dataKey="sales" position="top" fill="#6b7280" fontSize={12} />
              </Bar>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
