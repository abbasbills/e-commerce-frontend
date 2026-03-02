'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '@/lib/api/admin';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Badge from '@/components/ui/Badge';
import { formatPrice, formatDate, getStatusColor } from '@/lib/utils';

const STATUS_OPTIONS = ['pending','processing','shipped','delivered','cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.getOrders({ limit: 50 })
      .then((res) => setOrders((res.data as any)?.orders ?? (res.data as any)?.data ?? []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      await adminApi.updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status } : o));
      toast.success('Status updated');
    } catch { toast.error('Failed to update status'); }
    finally { setUpdating(null); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">{orders.length} orders total</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading orders…" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-200" />
          <p>No orders yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <motion.tr key={order._id} layout className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-[#736e6c]">#{order.orderNumber}</td>
                    <td className="px-5 py-4 text-gray-700">
                      <div>{order.user?.name || 'Guest'}</div>
                      <div className="text-xs text-gray-400">{order.user?.email || ''}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{order.items?.length ?? 0}</td>
                    <td className="px-5 py-4 font-semibold text-gray-800">{formatPrice(order.totalAmount)}</td>
                    <td className="px-5 py-4">
                      <Badge className={`text-xs px-2 py-0.5 ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatus(order._id, e.target.value)}
                          disabled={updating === order._id}
                          className={`appearance-none pr-8 pl-3 py-1.5 rounded-xl text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-[#736e6c] cursor-pointer ${getStatusColor(order.status)} disabled:opacity-50`}
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{formatDate(order.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
