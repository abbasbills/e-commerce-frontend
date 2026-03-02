'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ShoppingCart, Check, Sparkles, Home, ChevronRight,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { addToCart } from '@/store/slices/cartSlice';
import toast from 'react-hot-toast';

const ESSENTIALS = [
  {
    id: 'he-001', name: 'Living Room Sofa', price: 185000, tag: 'Best Seller',
    category: 'Furniture', size: 'large',
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'he-002', name: 'Kitchen Cookware Set', price: 28500, tag: 'Hot',
    category: 'Kitchen', size: 'normal',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'he-003', name: 'Bedroom Wardrobe', price: 95000, tag: null,
    category: 'Furniture', size: 'normal',
    img: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'he-004', name: 'Dining Table & Chairs', price: 145000, tag: 'Popular',
    category: 'Furniture', size: 'normal',
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'he-005', name: 'Wall Art & Decor', price: 12500, tag: null,
    category: 'Decor', size: 'normal',
    img: 'https://images.unsplash.com/photo-1513519245775-60b52c7e8f5a?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'he-006', name: 'Luxury Bed Linen Set', price: 18500, tag: null,
    category: 'Bedroom', size: 'tall',
    img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'he-007', name: 'Bathroom Accessories', price: 22000, tag: 'New',
    category: 'Bathroom', size: 'normal',
    img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'he-008', name: 'Modern Floor Lamp', price: 35000, tag: 'New',
    category: 'Lighting', size: 'normal',
    img: 'https://images.unsplash.com/photo-1513506003901-1e6a35086527?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'he-009', name: 'Storage Shelves', price: 42000, tag: null,
    category: 'Storage', size: 'normal',
    img: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'he-010', name: 'Kitchen Blender', price: 15500, tag: null,
    category: 'Kitchen', size: 'normal',
    img: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'he-011', name: 'Curtains & Blinds', price: 24000, tag: null,
    category: 'Decor', size: 'normal',
    img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'he-012', name: 'Door Mats & Rugs', price: 9500, tag: null,
    category: 'Decor', size: 'normal',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'he-013', name: 'Microwave Oven', price: 65000, tag: 'Popular',
    category: 'Kitchen', size: 'large',
    img: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'he-014', name: 'Throw Pillows Set', price: 11000, tag: null,
    category: 'Bedroom', size: 'normal',
    img: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'he-015', name: 'Full-Length Mirror', price: 28000, tag: null,
    category: 'Decor', size: 'normal',
    img: 'https://images.unsplash.com/photo-1618220179428-22791853aaff?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'he-016', name: 'Vacuum Cleaner', price: 78000, tag: null,
    category: 'Appliances', size: 'normal',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=500&q=80',
  },
];

const TAG_COLORS: Record<string, string> = {
  'Best Seller': 'bg-green-500',
  'Hot':         'bg-red-500',
  'New':         'bg-blue-500',
  'Popular':     'bg-[#736e6c]',
};

const CATEGORIES = ['All', ...Array.from(new Set(ESSENTIALS.map((e) => e.category)))];

export default function HouseEssentialsPage() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((s) => s.auth);
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? ESSENTIALS
    : ESSENTIALS.filter((e) => e.category === activeCategory);

  const handleAddToCart = async (item: typeof ESSENTIALS[0]) => {
    if (!token) {
      toast.error('Please log in to add items to cart', {
        style: { borderRadius: '14px', background: '#1a1a1a', color: '#fff' },
      });
      return;
    }
    setAdded((prev) => ({ ...prev, [item.id]: true }));
    toast.success(`${item.name} added to cart!`, {
      icon: '🛒',
      style: { borderRadius: '14px', background: '#1a1a1a', color: '#fff' },
    });
    setTimeout(() => setAdded((prev) => ({ ...prev, [item.id]: false })), 2500);
  };

  return (
    <div className="min-h-screen bg-[#1a1614]">
      {/* Top hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1614] via-[#2d2826] to-[#4a4442]">
        {/* Ambient blobs */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, 40, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -right-20 w-80 h-80 bg-[#736e6c]/25 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], x: [0, -30, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#9c9694]/20 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/40 text-sm mb-8">
            <Link href="/" className="hover:text-white/70 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/70">House Essentials</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-yellow-400/15 border border-yellow-400/30 rounded-full px-3 py-1 text-xs font-semibold text-yellow-300 mb-4"
              >
                <Sparkles className="w-3 h-3" /> New Collection Just Dropped
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight"
              >
                House<br />
                <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                  Essentials
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="mt-3 text-white/50 text-base max-w-md"
              >
                16 everyday items to make your home complete — quality picks, great prices in ₦.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3"
            >
              <Home className="w-5 h-5 text-white/40" />
              <div>
                <p className="text-white font-bold text-xl">{ESSENTIALS.length}</p>
                <p className="text-white/40 text-xs">Products</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="sticky top-0 z-20 bg-[#1a1614]/95 backdrop-blur-md border-b border-[#2d2826]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[#736e6c] text-white shadow-lg'
                  : 'bg-[#2d2826] text-[#9c9694] hover:text-[#e8e3e1] hover:bg-[#3d3533] border border-[#3d3533]'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
              style={{ gridAutoRows: '185px' }}
          >
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className={`relative group overflow-hidden rounded-2xl cursor-pointer ${
                  item.size === 'large'
                    ? 'col-span-2 row-span-2'
                    : item.size === 'tall'
                    ? 'row-span-2'
                    : ''
                }`}
              >
                {/* Photo */}
                <img
                  src={item.img}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Tag badge */}
                {item.tag && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.04 + 0.2 }}
                    className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white ${TAG_COLORS[item.tag] ?? 'bg-gray-500'}`}
                  >
                    {item.tag}
                  </motion.span>
                )}

                {/* Category pill */}
                <span className="absolute top-3 right-3 text-[10px] font-medium bg-black/40 backdrop-blur text-white/70 px-2 py-0.5 rounded-full">
                  {item.category}
                </span>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-sm leading-tight drop-shadow-md">{item.name}</p>
                  <p className="text-yellow-300 font-extrabold text-base mt-0.5">₦{item.price.toLocaleString()}</p>

                  {/* Add to Cart button — visible on hover */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddToCart(item)}
                    className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                      added[item.id]
                        ? 'bg-green-500 text-white'
                        : 'bg-white/95 text-black hover:bg-white'
                    } translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100`}
                  >
                    {added[item.id] ? (
                      <><Check className="w-4 h-4" /> Added!</>
                    ) : (
                      <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-r from-[#2d2826] to-[#3d3533] border border-[#4a4442] rounded-3xl p-8 md:p-12 text-center"
        >
          <h3 className="text-white text-2xl md:text-3xl font-extrabold">Looking for more?</h3>
          <p className="text-white/50 mt-2 mb-6">Browse thousands more products across all categories.</p>
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="bg-white text-black font-bold px-8 py-3.5 rounded-full shadow-xl text-sm"
            >
              Browse All Products
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
