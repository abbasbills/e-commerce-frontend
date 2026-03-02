'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Upload, X, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '@/lib/api/admin';
import { productsApi } from '@/lib/api/products';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ProductFormProps { productId?: string; }

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: '', description: '', price: '', salePrice: '',
    stock: '', category: '', tags: '', isActive: true,
  });

  useEffect(() => {
    productsApi.getCollections().then((res) => setCollections(res.data?.data ?? [])).catch(() => {});
    if (productId) {
      setLoading(true);
      adminApi.getProduct(productId)
        .then((res) => {
          const p = res.data?.data as any;
          if (p) {
            setForm({
              name: p.name || '',
              description: p.description || '',
              price: String(p.price || ''),
              salePrice: String(p.salePrice || ''),
              stock: String(p.stock || ''),
              category: p.category || '',
              tags: (p.tags || []).join(', '),
              isActive: p.isActive !== false,
            });
            setExistingImages(p.images || []);
          }
        })
        .catch(() => toast.error('Failed to load product'))
        .finally(() => setLoading(false));
    }
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewFiles((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setNewPreviews((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeNewFile = (i: number) => {
    setNewFiles((p) => p.filter((_, idx) => idx !== i));
    setNewPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const removeExisting = async (imgId: string) => {
    if (!productId) return;
    try {
      await adminApi.deleteProductImage(productId, imgId);
      setExistingImages((p) => p.filter((img) => img._id !== imgId));
      toast.success('Image removed');
    } catch { toast.error('Failed to remove image'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) {
      toast.error('Name, price and stock are required');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (form.tags) fd.set('tags', JSON.stringify(form.tags.split(',').map((t) => t.trim()).filter(Boolean)));
      newFiles.forEach((f) => fd.append('images', f));

      if (productId) {
        await adminApi.updateProduct(productId, fd);
        toast.success('Product updated');
      } else {
        await adminApi.createProduct(fd);
        toast.success('Product created');
      }
      router.push('/admin/products');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading…" /></div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* Images */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Product Images</h2>
        <div className="flex flex-wrap gap-3 mb-3">
          {existingImages.map((img) => (
            <div key={img._id} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
              <Image src={productsApi.getImageUrl(productId!, img._id)} alt="" fill className="object-cover" />
              <button type="button" onClick={() => removeExisting(img._id)}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          ))}
          {newPreviews.map((src, i) => (
            <div key={i} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-[#d4cdc9]">
              <Image src={src} alt="" fill className="object-cover" />
              <button type="button" onClick={() => removeNewFile(i)}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => fileRef.current?.click()}
            className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-[#736e6c] hover:text-[#736e6c] transition-colors">
            <Upload className="w-5 h-5 mb-1" />
            <span className="text-xs">Upload</span>
          </button>
        </div>
        <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
      </section>

      {/* Basic Info */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">Basic Info</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Premium Sneakers"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#736e6c]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe the product…"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#736e6c] resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Collection / Category</label>
          <select name="category" value={form.category} onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#736e6c]">
            <option value="">None</option>
            {collections.map((c) => <option key={c._id} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (comma separated)</label>
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="e.g. sale, new, trending"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#736e6c]" />
        </div>
      </section>

      {/* Pricing & Stock */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">Pricing & Stock</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price ($) *</label>
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required placeholder="0.00"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#736e6c]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Sale Price ($)</label>
            <input name="salePrice" type="number" min="0" step="0.01" value={form.salePrice} onChange={handleChange} placeholder="0.00"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#736e6c]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock *</label>
            <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required placeholder="0"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#736e6c]" />
          </div>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 rounded text-[#736e6c]" />
          <span className="text-sm font-medium text-gray-700">Active (visible in storefront)</span>
        </label>
      </section>

      {/* Submit */}
      <div className="flex gap-4">
        <button type="button" onClick={() => router.push('/admin/products')}
          className="flex-1 border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={saving}
          className="flex-1 bg-[#736e6c] hover:bg-[#4a4442] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
          {saving ? <LoadingSpinner size="sm" /> : <Package className="w-4 h-4" />}
          {saving ? 'Saving…' : productId ? 'Update Product' : 'Create Product'}
        </motion.button>
      </div>
    </form>
  );
}
