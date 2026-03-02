'use client';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, MapPin, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchOrderById, cancelOrder } from '@/store/slices/ordersSlice';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Badge from '@/components/ui/Badge';
import { formatPrice, formatDate, getStatusColor } from '@/lib/utils';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { currentOrder, isLoading } = useAppSelector((s) => ({ currentOrder: s.orders.order, isLoading: s.orders.isLoading }));

  useEffect(() => { if (id) dispatch(fetchOrderById(id)); }, [id, dispatch]);

  const handleCancel = async () => {
    if (!confirm('Cancel this order?')) return;
    try {
      await dispatch(cancelOrder(id)).unwrap();
      toast.success('Order cancelled');
    } catch { toast.error('Could not cancel order'); }
  };

  if (isLoading) return <div className="flex justify-center py-40"><LoadingSpinner size="lg" text="Loading order…" /></div>;
  if (!currentOrder) return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
      <p className="text-gray-500 text-lg">Order not found.</p>
      <Link href="/orders" className="mt-4 text-[#736e6c] underline">Back to orders</Link>
    </div>
  );

  const order = currentOrder;
  const addr = order.shippingAddress as any;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-8 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to orders
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#736e6c] to-[#4a4442] p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold">Order #{order.orderNumber}</h1>
              <p className="text-[#d4cdc9] text-sm mt-1">{formatDate(order.createdAt)}</p>
            </div>
            <Badge className={`text-sm px-3 py-1 ${getStatusColor(order.status)}`}>{order.status}</Badge>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Items */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Package className="w-4 h-4" /> Items</h2>
            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div key={item._id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-400">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <span className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          {addr && (
            <div>
              <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><MapPin className="w-4 h-4" /> Shipping Address</h2>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-800">{addr.name}</p>
                <p>{addr.address}</p>
                <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                <p>{addr.country}</p>
                {addr.phone && <p>{addr.phone}</p>}
              </div>
            </div>
          )}

          {/* Payment */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Payment</h2>
            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1.5">
              <div className="flex justify-between text-gray-600"><span>Method</span><span className="capitalize">{order.paymentMethod?.replace('_', ' ')}</span></div>
              <div className="flex justify-between text-gray-600">
                <span>Status</span>
                <span className={order.isPaid ? 'text-green-600 font-medium flex items-center gap-1' : 'text-amber-600 font-medium'}>
                  {order.isPaid ? <><CheckCircle className="w-3.5 h-3.5" />Paid</> : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t"><span>Total</span><span>{formatPrice(order.totalAmount)}</span></div>
            </div>
          </div>

          {/* Actions */}
          {order.status === 'pending' && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleCancel}
              className="w-full flex items-center justify-center gap-2 border-2 border-red-200 text-red-600 font-medium py-3 rounded-xl hover:bg-red-50 transition-colors">
              <XCircle className="w-4 h-4" /> Cancel Order
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
