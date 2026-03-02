'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Star, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchProductById } from '@/store/slices/productsSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { productsApi } from '@/lib/api/products';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Badge from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { product: currentProduct, isLoading } = useAppSelector((s) => s.products);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [adding, setAdding] = useState(false);

  useEffect(() => { if (id) dispatch(fetchProductById(id)); }, [id, dispatch]);

  const product = currentProduct;

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await dispatch(addToCart({ productId: product._id, quantity: qty })).unwrap();
      toast.success('Added to cart!');
    } catch {
      toast.error('Could not add to cart');
    } finally { setAdding(false); }
  };

  if (isLoading) return <div className="flex justify-center py-40"><LoadingSpinner size="lg" text="Loading…" /></div>;
  if (!product) return (
    <div className="flex flex-col items-center justify-center py-40 text-gray-400">
      <Package className="w-16 h-16 mb-4" />
      <p className="text-lg">Product not found.</p>
      <Link href="/products" className="mt-4 text-[#736e6c] underline">Back to products</Link>
    </div>
  );

  const images = product.images ?? [];
  const currentImg = images[imgIdx];
  const imgSrc = currentImg ? productsApi.getImageUrl(product._id, currentImg._id) : null;
  const isOutOfStock = product.stock === 0;
  const discount = product.salePrice && product.salePrice < product.price
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-8 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 mb-4">
            <AnimatePresence mode="wait">
              {imgSrc ? (
                <motion.div key={imgIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                  <Image src={imgSrc} alt={product.name} fill className="object-contain" />
                </motion.div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Package className="w-24 h-24" />
                </div>
              )}
            </AnimatePresence>
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                -{discount}%
              </div>
            )}
            {images.length > 1 && (
              <>
                <button onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur rounded-full p-1.5 shadow hover:bg-white">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur rounded-full p-1.5 shadow hover:bg-white">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button key={img._id} onClick={() => setImgIdx(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === imgIdx ? 'border-[#736e6c]' : 'border-transparent'}`}>
                  <Image src={productsApi.getImageUrl(product._id, img._id)} alt="" width={64} height={64} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          {product.category && (
            <Badge variant="default" className="text-xs">
              {typeof product.category === 'string' ? product.category : product.category.name}
            </Badge>
          )}
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <div className="flex items-center gap-3">
            {product.salePrice && product.salePrice < product.price ? (
              <>
                <span className="text-3xl font-extrabold text-[#736e6c]">{formatPrice(product.salePrice)}</span>
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="text-3xl font-extrabold text-gray-900">{formatPrice(product.price)}</span>
            )}
          </div>

          {product.description && (
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          )}

          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${isOutOfStock ? 'bg-red-400' : 'bg-green-400'}`} />
            <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
              {isOutOfStock ? 'Out of stock' : `${product.stock} in stock`}
            </span>
          </div>

          {!isOutOfStock && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2.5 hover:bg-gray-50 text-lg font-bold">−</button>
                <span className="w-12 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="px-4 py-2.5 hover:bg-gray-50 text-lg font-bold">+</button>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart} disabled={adding}
                className="flex-1 flex items-center justify-center gap-2 bg-[#736e6c] hover:bg-[#4a4442] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60"
              >
                {adding ? <LoadingSpinner size="sm" /> : <ShoppingCart className="w-5 h-5" />}
                {adding ? 'Adding…' : 'Add to Cart'}
              </motion.button>
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full">{tag}</span>
              ))}
            </div>
          )}

          <div className="border-t pt-4 text-sm text-gray-500 space-y-1">
            <div className="flex gap-2"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" /><span>Free shipping on orders over $50</span></div>
            <div className="flex gap-2"><Package className="w-4 h-4 flex-shrink-0" /><span>Ships within 2-3 business days</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
