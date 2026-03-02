'use client';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchProducts } from '@/store/slices/productsSlice';
import ProductCard from '@/components/store/ProductCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function CollectionSlugPage() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const { products, isLoading } = useAppSelector((s) => s.products);

  useEffect(() => {
    if (slug) dispatch(fetchProducts({ collection: slug, page: 1, limit: 20 }));
  }, [slug, dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/collections" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-8 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> All Collections
      </Link>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 capitalize">{slug?.replace(/-/g, ' ')}</h1>
        <p className="text-gray-500 mt-1">{products.length} products</p>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading…" /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No products in this collection yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
