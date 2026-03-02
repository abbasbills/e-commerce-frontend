'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Layers } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchCollections } from '@/store/slices/productsSlice';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const GRADIENTS = [
  'from-[#736e6c] to-[#4a4442]',
  'from-pink-500 to-rose-600',
  'from-amber-500 to-orange-600',
  'from-teal-500 to-cyan-600',
  'from-green-500 to-emerald-600',
  'from-blue-500 to-[#4a4442]',
];

export default function CollectionsPage() {
  const dispatch = useAppDispatch();
  const { collections, isLoading } = useAppSelector((s) => s.products);

  useEffect(() => { dispatch(fetchCollections()); }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Collections</h1>
        <p className="text-gray-500 mt-3 text-lg">Explore our curated categories</p>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading collections…" /></div>
      ) : collections.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-gray-400">
          <Layers className="w-16 h-16 mb-4" />
          <p className="text-lg">No collections yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col, i) => (
            <motion.div
              key={col._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}
            >
              <Link href={`/collections/${col.slug}`}>
                <div className={`bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} text-white rounded-3xl p-8 h-48 flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-xl transition-shadow`}>
                  <div>
                    <h2 className="text-xl font-bold">{col.name}</h2>
                    {col.description && <p className="text-white/70 text-sm mt-2 line-clamp-2">{col.description}</p>}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    Browse collection <ArrowRight className="w-4 h-4" />
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
