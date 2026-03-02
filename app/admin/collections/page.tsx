'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Tag, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '@/lib/api/admin';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.getCollections()
      .then((res) => setCollections(res.data?.data ?? []))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm({ name: '', description: '' }); setSelected(null); setModal('create'); };
  const openEdit = (col: any) => { setForm({ name: col.name, description: col.description || '' }); setSelected(col); setModal('edit'); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      if (modal === 'edit' && selected) {
        await adminApi.updateCollection(selected._id, form);
        toast.success('Collection updated');
      } else {
        await adminApi.createCollection(form);
        toast.success('Collection created');
      }
      setModal(null);
      load();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await adminApi.deleteCollection(id);
      toast.success('Deleted');
      setCollections((p) => p.filter((c) => c._id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Collections</h1>
          <p className="text-gray-500 mt-1">{collections.length} collections</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={openCreate}
          className="flex items-center gap-2 bg-[#736e6c] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#4a4442] transition-colors">
          <Plus className="w-4 h-4" /> New Collection
        </motion.button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading…" /></div>
      ) : collections.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Tag className="w-16 h-16 mx-auto mb-4 text-gray-200" />
          <p>No collections yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {collections.map((col) => (
              <motion.div key={col._id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Tag className="w-4 h-4 text-[#736e6c] flex-shrink-0" />
                      <h3 className="font-bold text-gray-900 truncate">{col.name}</h3>
                    </div>
                    {col.description && <p className="text-sm text-gray-400 line-clamp-2">{col.description}</p>}
                    <p className="text-xs text-gray-300 mt-2 font-mono">/{col.slug}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(col)} className="p-1.5 text-gray-400 hover:text-[#736e6c] hover:bg-[#f5f1f0] rounded-lg transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(col._id, col.name)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModal(null)} className="fixed inset-0 bg-black/40 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-lg text-gray-900">
                    {modal === 'edit' ? 'Edit Collection' : 'New Collection'}
                  </h2>
                  <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                    <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required placeholder="e.g. Footwear"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#736e6c]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3}
                      placeholder="Short description…"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#736e6c] resize-none" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                      Cancel
                    </button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={saving}
                      className="flex-1 bg-[#736e6c] hover:bg-[#4a4442] text-white font-bold py-2.5 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                      {saving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
                      {saving ? 'Saving…' : 'Save'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
