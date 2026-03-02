'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Star, ChevronRight, X, ShoppingCart, Heart, Ruler, CheckCircle2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchProducts, fetchCollections } from '@/store/slices/productsSlice';
import ProductCard from '@/components/store/ProductCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

/* ── Hardcoded featured showcase ── */
const FEATURED_ITEMS = [
  {
    id: 'fp-1',
    name: 'Farmhouse Linen Sofa',
    price: 285000,
    category: 'Furniture',
    rating: 4.9,
    reviews: 128,
    tag: 'Best Seller',
    tagColor: 'bg-[#8B5E3C]',
    img: 'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Beige farmhouse linen sofa with throw pillows in bright living room',
    description:
      'A beautifully crafted farmhouse-style linen sofa that brings warmth and comfort to any living room. Deep cushioning, solid wood legs, and durable stain-resistant linen upholstery.',
    details: ['3-seater configuration', 'Solid oak wood legs', 'Stain-resistant linen', 'Available in 4 colours'],
    dimensions: 'W 220 cm × D 90 cm × H 85 cm',
  },
  {
    id: 'fp-2',
    name: 'Rustic Wall Clock & Desk Set',
    price: 95000,
    category: 'Decor',
    rating: 4.7,
    reviews: 86,
    tag: 'New Arrival',
    tagColor: 'bg-[#4a4442]',
    img: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Rustic wooden desk with large Roman numeral wall clock and decor accessories',
    description:
      'A gorgeous rustic desk and oversized Roman numeral wall clock set. Crafted from reclaimed wood with a distressed finish, perfect for a farmhouse or vintage-inspired home.',
    details: ['Reclaimed wood construction', 'Oversized Roman numeral clock', 'Built-in desk drawers', 'Handcrafted finish'],
    dimensions: 'Clock: Ø 70 cm | Desk: W 120 cm × D 55 cm × H 78 cm',
  },
  {
    id: 'fp-3',
    name: 'Farmhouse Bed & Storage Frame',
    price: 195000,
    category: 'Bedroom',
    rating: 4.8,
    reviews: 104,
    tag: 'Top Rated',
    tagColor: 'bg-[#736e6c]',
    img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'White farmhouse bed frame with dark wood storage bench and chest of drawers',
    description:
      'A stunning farmhouse bed frame with matching storage bench and dresser. White-painted solid wood with dark walnut tops — a timeless country-style centrepiece for any bedroom.',
    details: ['Queen & King sizes available', 'Under-bed storage drawer', 'Matching bedside tables', 'Scratch-resistant finish'],
    dimensions: 'Queen: 160 × 200 cm | King: 180 × 200 cm',
  },
];
type FeaturedItem = (typeof FEATURED_ITEMS)[0];

const FEATURES = [
  { icon: Truck,       title: 'Free Shipping',   desc: 'On all orders over $50' },
  { icon: ShieldCheck, title: 'Secure Payments', desc: '100% protected checkout' },
  { icon: Star,        title: 'Top Quality',     desc: 'Curated premium products' },
  { icon: Sparkles,    title: 'Exclusive Deals', desc: 'Members-only discounts' },
];

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { products, collections, isLoading } = useAppSelector((s) => s.products);
  const { token } = useAppSelector((s) => s.auth);
  const [selected, setSelected] = useState<FeaturedItem | null>(null);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!token) { import('react-hot-toast').then(({ default: toast }) => toast.error('Please log in to add items to cart')); return; }
    setAdded(true);
    import('react-hot-toast').then(({ default: toast }) => toast.success(`${selected?.name} added to cart!`));
    setTimeout(() => setAdded(false), 2500);
  };

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 8 }));
    dispatch(fetchCollections());
  }, [dispatch]);

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden text-black" style={{ minHeight: '92vh' }}>
        {/* Full-bleed background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1920&q=90')" }}
        />
        {/* Light overlay — makes black text readable over the photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/75 via-white/50 to-transparent" />
        {/* Subtle bottom vignette */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/40 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-36 md:py-52 flex items-center" style={{ minHeight: '92vh' }}>
          <div className="max-w-xl">
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
              <Link href="/collections/house-essentials">
                <motion.span
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 bg-[#8B5E3C]/15 backdrop-blur border border-[#8B5E3C]/30 hover:bg-[#8B5E3C]/25 rounded-full px-4 py-1.5 text-sm font-semibold mb-6 cursor-pointer transition-colors text-[#5C3D1E]">
                  <Sparkles className="w-3.5 h-3.5 text-[#8B5E3C]" /> New collection just dropped — shop now
                </motion.span>
              </Link>
            </motion.div>
            <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
              className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-[#3B1F0E] drop-shadow-2xl">
              Make Your
              <span className="block text-[#8B5E3C]">Home Shine</span>
            </motion.h1>
            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
              className="mt-6 text-lg text-[#5C3D1E] leading-relaxed max-w-md">
              Curated everyday essentials to transform every corner of your home. Warm, beautiful, and built to last.
            </motion.p>
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
              className="mt-10 flex flex-wrap gap-4">
              <Link href="/products">
                <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
                  className="flex items-center gap-2 bg-[#8B5E3C] text-white font-bold px-8 py-3.5 rounded-full shadow-xl hover:bg-[#5C3D1E] transition-colors">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/collections">
                <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
                  className="flex items-center gap-2 border border-[#8B5E3C]/50 hover:bg-[#8B5E3C]/10 text-[#5C3D1E] font-medium px-8 py-3.5 rounded-full backdrop-blur-sm">
                  Browse Collections
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-[#e8e3e1] text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#f5f1f0] rounded-xl flex items-center justify-center mx-auto mb-3">
                <f.icon className="w-6 h-6 text-[#736e6c]" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">{f.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Collections */}
      {collections.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Collections</h2>
              <p className="text-gray-500 mt-1">Shop by category</p>
            </div>
            <Link href="/collections" className="flex items-center gap-1 text-[#736e6c] font-medium hover:underline text-sm">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {collections.map((col, i) => (
              <motion.div key={col._id} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.05 }}>
                <Link href={`/collections/${col.slug}`}>
                  <div className="flex-shrink-0 bg-gradient-to-br from-[#4a4442] to-[#736e6c] text-white rounded-2xl px-6 py-4 hover:scale-105 transition-transform cursor-pointer min-w-max shadow-md">
                    <p className="font-semibold text-sm">{col.name}</p>
                    <p className="text-[#b8b1af] text-xs mt-0.5">{col.description || 'Explore'}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-sm font-semibold tracking-widest text-[#8B5E3C] uppercase mb-1">Handpicked just for you</p>
            <h2 className="text-4xl font-extrabold text-[#2d2826]">Featured Products</h2>
          </div>
          <Link href="/products" className="hidden sm:flex items-center gap-1 text-[#736e6c] font-medium hover:text-[#4a4442] text-sm transition-colors">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3-card showcase grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_ITEMS.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              onClick={() => { setSelected(item); setAdded(false); }}
              className="group text-left bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-[#e8e3e1] transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            >
              {/* Image — explicit height so photo is always visible */}
              <div className="relative h-64 w-full overflow-hidden bg-[#f5f1f0]">
                <img
                  src={item.img}
                  alt={item.imgAlt}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="eager"
                />
                {/* Tag */}
                <span className={`absolute top-4 left-4 z-10 ${item.tagColor} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow`}>
                  {item.tag}
                </span>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#2d2826]/0 group-hover:bg-[#2d2826]/30 transition-all duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-[#2d2826] font-bold text-sm px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2">
                    View Details <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <p className="text-xs font-semibold tracking-wider text-[#8B5E3C] uppercase mb-1">{item.category}</p>
                <h3 className="text-lg font-bold text-[#2d2826] group-hover:text-[#8B5E3C] transition-colors leading-snug">{item.name}</h3>
                <div className="flex items-center gap-1.5 mt-2 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s < Math.floor(item.rating) ? 'text-[#8B5E3C] fill-[#8B5E3C]' : 'text-gray-300'}`} />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">{item.rating} ({item.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-[#2d2826]">₦{item.price.toLocaleString()}</span>
                  <span className="flex items-center gap-1 text-xs text-[#736e6c] border border-[#e8e3e1] rounded-full px-3 py-1">
                    <ShoppingCart className="w-3 h-3" /> Add to cart
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link href="/products" className="inline-flex items-center gap-1 text-[#736e6c] font-medium underline text-sm">
            View all products <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
            style={{ backdropFilter: 'blur(8px)', background: 'rgba(29,24,20,0.65)' }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Close */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition"
              >
                <X className="w-5 h-5 text-[#2d2826]" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image side */}
                <div className="relative bg-[#f5f1f0] h-72 md:h-auto md:min-h-[380px]">
                  <img
                    src={selected.img}
                    alt={selected.imgAlt}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                  />
                  <span className={`absolute top-4 left-4 z-10 ${selected.tagColor} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow`}>
                    {selected.tag}
                  </span>
                </div>

                {/* Details side */}
                <div className="p-7 sm:p-9 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-semibold tracking-widest text-[#8B5E3C] uppercase mb-2">{selected.category}</p>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2d2826] leading-tight">{selected.name}</h2>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, s) => (
                          <Star key={s} className={`w-4 h-4 ${s < Math.floor(selected.rating) ? 'text-[#8B5E3C] fill-[#8B5E3C]' : 'text-gray-200 fill-gray-200'}`} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{selected.rating} · {selected.reviews} reviews</span>
                    </div>

                    {/* Price */}
                    <p className="text-3xl font-extrabold text-[#2d2826] mt-5">₦{selected.price.toLocaleString()}</p>

                    {/* Divider */}
                    <div className="border-t border-[#e8e3e1] my-5" />

                    {/* Description */}
                    <p className="text-sm text-[#5c5755] leading-relaxed">{selected.description}</p>

                    {/* Details list */}
                    <ul className="mt-5 space-y-2">
                      {selected.details.map((d) => (
                        <li key={d} className="flex items-center gap-2 text-sm text-[#4a4442]">
                          <CheckCircle2 className="w-4 h-4 text-[#8B5E3C] flex-shrink-0" /> {d}
                        </li>
                      ))}
                    </ul>

                    {/* Dimensions */}
                    <div className="flex items-center gap-2 mt-5 text-xs text-gray-400">
                      <Ruler className="w-3.5 h-3.5" />
                      <span>{selected.dimensions}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-8">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={handleAddToCart}
                      className={`flex-1 flex items-center justify-center gap-2 font-bold py-3.5 rounded-full transition-all text-sm ${
                        added
                          ? 'bg-green-500 text-white'
                          : 'bg-[#8B5E3C] hover:bg-[#5C3D1E] text-white'
                      }`}
                    >
                      {added ? <><CheckCircle2 className="w-4 h-4" /> Added!</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      className="border border-[#e8e3e1] hover:bg-[#f5f1f0] rounded-full p-3.5 transition"
                      title="Save for later"
                    >
                      <Heart className="w-5 h-5 text-[#736e6c]" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <motion.div initial={{ opacity:0, scale:0.97 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
          className="bg-gradient-to-r from-[#2d2826] to-[#4a4442] rounded-3xl p-10 md:p-16 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to Start Shopping?</h2>
          <p className="text-[#b8b1af] mb-8 max-w-md mx-auto">
            Create an account to track orders and get exclusive member discounts.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/auth/register">
              <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
                className="bg-white text-[#4a4442] font-bold px-8 py-3.5 rounded-full shadow-xl">
                Create Free Account
              </motion.button>
            </Link>
            <Link href="/products">
              <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
                className="border border-white/30 hover:bg-white/10 font-medium px-8 py-3.5 rounded-full">
                Browse First
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
