'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/store';
import { placeOrder, simulatePayment } from '@/store/slices/ordersSlice';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { formatPrice } from '@/lib/utils';

const PAYMENT_METHODS = [
  { id: 'credit_card', label: 'Credit Card' },
  { id: 'debit_card', label: 'Debit Card' },
  { id: 'paypal', label: 'PayPal (simulated)' },
  { id: 'bank_transfer', label: 'Bank Transfer' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((s) => s.cart);
  const { isLoading } = useAppSelector((s) => s.orders);
  const { user } = useAppSelector((s) => s.auth);

  const [step, setStep] = useState<'address' | 'payment' | 'done'>('address');
  const [placed, setPlaced] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: user?.email || '',
    address: '', city: '', state: '', postalCode: '', country: 'US',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.address || !form.city || !form.postalCode) {
      toast.error('Please fill all required fields');
      return;
    }
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    try {
      const { firstName, lastName, email, phone, ...addr } = form;
      const orderRes = await dispatch(placeOrder({
        shippingAddress: { ...addr, name: `${firstName} ${lastName}`, email, phone },
        paymentMethod,
      })).unwrap();
      setPlaced(orderRes);

      // Simulate payment
      await dispatch(simulatePayment({ orderId: orderRes._id, method: paymentMethod as any })).unwrap();
      setStep('done');
      toast.success('Order placed successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Could not place order');
    }
  };

  const items = cart?.items ?? [];
  const total = cart?.total ?? 0;

  if (items.length === 0 && step !== 'done') {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-600">Your cart is empty</h2>
        <button onClick={() => router.push('/products')} className="mt-6 text-[#736e6c] underline">Go shopping</button>
      </div>
    );
  }

  if (step === 'done') return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 15 }}>
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
      </motion.div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Order Confirmed!</h1>
      <p className="text-gray-500 mb-2">Your order <strong className="text-gray-800">#{placed?.orderNumber}</strong> has been placed.</p>
      <p className="text-gray-500 mb-8">Payment simulated successfully. You&apos;ll receive a confirmation email shortly.</p>
      <div className="flex justify-center gap-4">
        <button onClick={() => router.push('/orders')} className="bg-[#736e6c] text-white font-bold px-8 py-3 rounded-full">View Orders</button>
        <button onClick={() => router.push('/products')} className="border border-gray-200 text-gray-700 font-medium px-8 py-3 rounded-full hover:bg-gray-50">Continue Shopping</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-10 text-sm font-medium">
        {['address', 'payment'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <div className="w-12 h-px bg-gray-200" />}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${step === s ? 'bg-[#736e6c] text-white' : step === 'payment' && s === 'address' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {step === 'payment' && s === 'address' ? <CheckCircle className="w-4 h-4" /> : <span>{i + 1}</span>}
              {s === 'address' ? 'Shipping' : 'Payment'}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Form */}
        <div className="flex-1">
          {step === 'address' && (
            <motion.form initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleAddress} className="space-y-5">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                <MapPin className="w-5 h-5 text-[#736e6c]" /> Shipping Address
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name *" name="firstName" value={form.firstName} onChange={handleChange} />
                <Field label="Last Name *" name="lastName" value={form.lastName} onChange={handleChange} />
              </div>
              <Field label="Email *" name="email" type="email" value={form.email} onChange={handleChange} />
              <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} />
              <Field label="Address *" name="address" value={form.address} onChange={handleChange} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="City *" name="city" value={form.city} onChange={handleChange} />
                <Field label="State" name="state" value={form.state} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Postal Code *" name="postalCode" value={form.postalCode} onChange={handleChange} />
                <Field label="Country" name="country" value={form.country} onChange={handleChange} />
              </div>
              <button type="submit" className="w-full bg-[#736e6c] text-white font-bold py-3.5 rounded-xl hover:bg-[#4a4442] transition-colors">
                Continue to Payment
              </button>
            </motion.form>
          )}

          {step === 'payment' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                <CreditCard className="w-5 h-5 text-[#736e6c]" /> Payment Method
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                This is a simulated payment — no real charges will be made.
              </div>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((pm) => (
                  <label key={pm.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === pm.id ? 'border-[#736e6c] bg-[#f5f1f0]' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="paymentMethod" value={pm.id} checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} className="text-[#736e6c]" />
                    <span className="font-medium text-gray-800">{pm.label}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-4 pt-2">
                <button onClick={() => setStep('address')} className="flex-1 border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors">← Back</button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handlePlaceOrder} disabled={isLoading}
                  className="flex-2 flex-1 bg-[#736e6c] hover:bg-[#4a4442] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {isLoading ? <LoadingSpinner size="sm" /> : null}
                  {isLoading ? 'Placing Order…' : 'Place Order'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:w-80">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4 text-sm text-gray-600 max-h-48 overflow-y-auto">
              {items.map((item) => {
                const product = item.product as any;
                const price = product?.salePrice ?? product?.price ?? 0;
                return (
                  <div key={item._id} className="flex justify-between items-start">
                    <span className="line-clamp-1 flex-1 mr-2">{product?.name} × {item.quantity}</span>
                    <span className="flex-shrink-0 font-medium text-gray-800">{formatPrice(price * item.quantity)}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t pt-4 space-y-1.5 text-sm text-gray-600 mb-4">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">{total >= 50 ? 'Free' : '$5.99'}</span></div>
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-900">
              <span>Total</span>
              <span>{formatPrice(total >= 50 ? total : total + 5.99)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = 'text' }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#736e6c]"
      />
    </div>
  );
}
