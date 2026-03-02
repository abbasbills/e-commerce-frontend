'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '@/lib/api/admin';
import { productsApi } from '@/lib/api/products';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Badge from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.getProducts({ limit: 50 })
      .then((res) => setProducts((res.data as any)?.products ?? (res.data as any)?.data ?? []))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    setDeleting(id);
    try {
      await adminApi.deleteProduct(id);
      toast.success('Product deleted');
      setProducts((p) => p.filter((x) => x._id !== id));
    } catch {
      toast.error('Failed to delete');
    } finally { setDeleting(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">{products.length} products total</p>
        </div>
        <Link href="/admin/products/new">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-[#736e6c] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#4a4442] transition-colors">
            <Plus className="w-4 h-4" /> Add Product
          </motion.button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading…" /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-200" />
          <p>No products yet.</p>
          <Link href="/admin/products/new" className="mt-4 text-[#736e6c] underline text-sm">Create first product</Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Product', 'Price', 'Stock', 'Status', 'Actions'].map((h) =>
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                )}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence>
                  {products.map((p) => (
                    <motion.tr key={p._id} layout initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            {p.images?.[0] ? (
                              <Image src={productsApi.getImageUrl(p._id, p.images[0]._id)} alt={p.name} width={48} height={48} className="object-cover w-full h-full" />
                            ) : <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-gray-300" /></div>}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 line-clamp-1">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.category || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {p.salePrice && p.salePrice < p.price ? (
                          <div>
                            <span className="font-bold text-[#736e6c]">{formatPrice(p.salePrice)}</span>
                            <span className="text-xs text-gray-400 line-through ml-1">{formatPrice(p.price)}</span>
                          </div>
                        ) : (
                          <span className="font-medium text-gray-800">{formatPrice(p.price)}</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`font-medium ${p.stock === 0 ? 'text-red-500' : p.stock < 10 ? 'text-amber-500' : 'text-green-600'}`}>{p.stock}</span>
                      </td>
                      <td className="px-5 py-4">
                        <Badge className={`text-xs px-2 py-0.5 ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {p.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/products/${p._id}/edit`}>
                            <button className="p-2 text-gray-400 hover:text-[#736e6c] hover:bg-[#f5f1f0] rounded-lg transition-colors">
                              <Pencil className="w-4 h-4" />
                            </button>
                          </Link>
                          <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                            {deleting === p._id ? <LoadingSpinner size="sm" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
