'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '@/store/slices/cartSlice';
import { productsApi } from '@/lib/api/products';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { cart, isLoading } = useAppSelector((s) => s.cart);

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  const handleQty = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    await dispatch(updateCartItem({ productId, quantity }));
  };

  const handleRemove = async (productId: string) => {
    await dispatch(removeFromCart(productId));
    toast.success('Removed from cart');
  };

  const handleClear = async () => {
    await dispatch(clearCart());
    toast.success('Cart cleared');
  };

  const items = cart?.items ?? [];
  const total = cart?.total ?? 0;

  if (isLoading) return <div className="flex justify-center py-40"><LoadingSpinner size="lg" text="Loading cart…" /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-[#736e6c]" /> Your Cart
          {items.length > 0 && <span className="text-sm font-normal text-gray-400">({items.length} item{items.length > 1 ? 's' : ''})</span>}
        </h1>
        {items.length > 0 && (
          <button onClick={handleClear} className="text-sm text-red-500 hover:underline flex items-center gap-1">
            <Trash2 className="w-4 h-4" /> Clear all
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center py-28 text-gray-400">
          <Package className="w-20 h-20 mb-6 text-gray-200" />
          <p className="text-xl font-medium text-gray-500">Your cart is empty</p>
          <p className="text-sm mt-2">Add some products to get started!</p>
          <Link href="/products">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="mt-8 flex items-center gap-2 bg-[#736e6c] text-white font-bold px-8 py-3.5 rounded-full">
              Shop Now <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items */}
          <div className="flex-1 space-y-4">
            <AnimatePresence>
              {items.map((item) => {
                const product = item.product as any;
                const imgSrc = product?.images?.[0]
                  ? productsApi.getImageUrl(product._id, product.images[0]._id)
                  : null;
                const price = product?.salePrice ?? product?.price ?? 0;
                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="bg-white rounded-2xl p-5 flex gap-5 shadow-sm border border-gray-100"
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {imgSrc ? (
                        <Image src={imgSrc} alt={product?.name || ''} width={96} height={96} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-gray-300" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${product?._id}`} className="font-semibold text-gray-800 hover:text-[#736e6c] line-clamp-1">
                        {product?.name}
                      </Link>
                      <p className="text-[#736e6c] font-bold mt-1">{formatPrice(price)}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                          <button onClick={() => handleQty(product._id, item.quantity - 1)}
                            className="px-3 py-1.5 hover:bg-gray-50"><Minus className="w-3.5 h-3.5" /></button>
                          <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => handleQty(product._id, item.quantity + 1)}
                            className="px-3 py-1.5 hover:bg-gray-50"><Plus className="w-3.5 h-3.5" /></button>
                        </div>
                        <button onClick={() => handleRemove(product._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatPrice(price * item.quantity)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm text-gray-600 mb-4 pb-4 border-b">
                <div className="flex justify-between">
                  <span>Subtotal ({cart?.itemCount ?? 0} items)</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">{total >= 50 ? 'Free' : '$5.99'}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900 mb-6">
                <span>Total</span>
                <span>{formatPrice(total >= 50 ? total : total + 5.99)}</span>
              </div>
              <Link href="/checkout">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="w-full bg-[#736e6c] hover:bg-[#4a4442] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                  Checkout <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/products">
                <button className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm py-2">Continue Shopping</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
