'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Package, ShoppingBag, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { adminApi } from '@/lib/api/admin';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Badge from '@/components/ui/Badge';
import { formatPrice, formatDate, getStatusColor } from '@/lib/utils';
import { useState } from 'react';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard()
      .then((res) => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading dashboard…" /></div>;

  const stats = data?.stats || {};
  const CARDS = [
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue ?? 0), icon: DollarSign, color: 'from-[#736e6c] to-[#4a4442]' },
    { label: 'Total Orders', value: stats.totalOrders ?? 0, icon: ShoppingBag, color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Products', value: stats.totalProducts ?? 0, icon: Package, color: 'from-amber-400 to-orange-500' },
    { label: 'Total Users', value: stats.totalUsers ?? 0, icon: Users, color: 'from-pink-500 to-rose-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, admin!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {CARDS.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white shadow-lg`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-white/70 text-sm">{card.label}</p>
                <p className="text-3xl font-extrabold mt-1">{card.value}</p>
              </div>
              <div className="bg-white/20 rounded-xl p-2.5"><card.icon className="w-5 h-5" /></div>
            </div>
            <div className="flex items-center gap-1 text-xs text-white/70"><TrendingUp className="w-3 h-3" /><span>All time</span></div>
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: '/admin/products/new', label: 'Add New Product', icon: Package },
          { href: '/admin/collections', label: 'Manage Collections', icon: Package },
          { href: '/admin/orders', label: 'View All Orders', icon: ShoppingBag },
        ].map((l) => (
          <Link key={l.href} href={l.href}>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between">
              <span className="font-medium text-gray-800">{l.label}</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      {data?.recentOrders?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-[#736e6c] hover:underline flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>{['Order #', 'Customer', 'Amount', 'Status', 'Date'].map((h) =>
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                )}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recentOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-[#736e6c]">
                      <Link href={`/admin/orders`} className="hover:underline">#{order.orderNumber}</Link>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{order.user?.name || 'Guest'}</td>
                    <td className="px-5 py-3 font-semibold text-gray-800">{formatPrice(order.totalAmount)}</td>
                    <td className="px-5 py-3">
                      <Badge className={`text-xs px-2 py-0.5 ${getStatusColor(order.status)}`}>{order.status}</Badge>
                    </td>
                    <td className="px-5 py-3 text-gray-400">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
