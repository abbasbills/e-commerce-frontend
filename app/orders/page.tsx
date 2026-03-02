'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchMyOrders } from '@/store/slices/ordersSlice';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Badge from '@/components/ui/Badge';
import { formatPrice, formatDate, getStatusColor } from '@/lib/utils';

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, isLoading } = useAppSelector((s) => s.orders);
  const { user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (user && !user.isAnonymous) dispatch(fetchMyOrders({ page: 1 }));
  }, [dispatch, user]);

  if (!user || user.isAnonymous) return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-600">Sign in to view your orders</h2>
      <Link href="/auth/login" className="mt-6 inline-block bg-[#736e6c] text-white px-8 py-3 rounded-full font-bold">Sign In</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <Package className="w-8 h-8 text-[#736e6c]" /> My Orders
      </h1>

      {isLoading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading orders…" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-200" />
          <p className="text-lg">No orders yet.</p>
          <Link href="/products" className="mt-4 inline-block text-[#736e6c] underline">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/orders/${order._id}`}>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-gray-800">#{order.orderNumber}</span>
                      <Badge className={`text-xs ${getStatusColor(order.status)}`}>{order.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)} · {order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-[#736e6c]">{formatPrice(order.totalAmount)}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
