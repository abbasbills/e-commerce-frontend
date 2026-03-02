'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchProducts, fetchCollections, setFilters, resetFilters } from '@/store/slices/productsSlice';
import ProductCard from '@/components/store/ProductCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { products, collections, filters, total, pages, isLoading } = useAppSelector((s) => s.products);
  const pagination = { total, pages };  // shape used in JSX below
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const load = useCallback(() => {
    dispatch(fetchProducts({ ...filters }));
  }, [dispatch, filters]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { dispatch(fetchCollections()); }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilters({ search, minPrice: minPrice ? Number(minPrice) : undefined, maxPrice: maxPrice ? Number(maxPrice) : undefined, page: 1 }));
  };

  const handleCollection = (slug: string | undefined) => {
    dispatch(setFilters({ collection: slug, page: 1 }));
  };

  const handleSort = (sort: string) => {
    dispatch(setFilters({ sort, page: 1 }));
  };

  const handlePage = (page: number) => {
    dispatch(setFilters({ page }));
  };

  const handleReset = () => {
    setSearch(''); setMinPrice(''); setMaxPrice('');
    dispatch(resetFilters());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="text-gray-500 mt-1">{pagination?.total ?? 0} products found</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filters.sort || ''}
            onChange={(e) => handleSort(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#736e6c]"
          >
            <option value="">Sort: Featured</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="newest">Newest</option>
          </select>
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-50 md:hidden"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar — desktop */}
        <aside className="hidden md:block w-64 flex-shrink-0 space-y-6">
          <FilterPanel
            search={search} setSearch={setSearch}
            minPrice={minPrice} setMinPrice={setMinPrice}
            maxPrice={maxPrice} setMaxPrice={setMaxPrice}
            filters={filters} collections={collections}
            handleSearch={handleSearch} handleCollection={handleCollection} handleReset={handleReset}
          />
        </aside>

        {/* Mobile sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/40 z-40 md:hidden" />
              <motion.aside
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed left-0 top-0 h-full w-72 bg-white z-50 p-6 overflow-y-auto md:hidden"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-bold text-lg">Filters</h2>
                  <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
                </div>
                <FilterPanel
                  search={search} setSearch={setSearch}
                  minPrice={minPrice} setMinPrice={setMinPrice}
                  maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                  filters={filters} collections={collections}
                  handleSearch={handleSearch} handleCollection={handleCollection} handleReset={handleReset}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Products grid */}
        <main className="flex-1 min-w-0">
          {isLoading ? (
            <div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading products…" /></div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No products match your filters.</p>
              <button onClick={handleReset} className="mt-4 text-[#736e6c] underline text-sm">Clear filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
              </div>
              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <button onClick={() => handlePage(filters.page! - 1)} disabled={filters.page === 1}
                    className="p-2 rounded-xl border disabled:opacity-30 hover:bg-gray-50">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pg) => (
                    <button key={pg} onClick={() => handlePage(pg)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${pg === filters.page ? 'bg-[#736e6c] text-white' : 'border hover:bg-gray-50'}`}>
                      {pg}
                    </button>
                  ))}
                  <button onClick={() => handlePage(filters.page! + 1)} disabled={filters.page === pagination.pages}
                    className="p-2 rounded-xl border disabled:opacity-30 hover:bg-gray-50">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function FilterPanel({ search, setSearch, minPrice, setMinPrice, maxPrice, setMaxPrice, filters, collections, handleSearch, handleCollection, handleReset }: any) {
  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch}>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#736e6c]" />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} type="number" placeholder="Min $"
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#736e6c]" />
          <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} type="number" placeholder="Max $"
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#736e6c]" />
        </div>
        <button type="submit" className="w-full mt-3 bg-[#736e6c] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#4a4442] transition-colors">
          Apply
        </button>
      </form>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Collection</label>
        <div className="space-y-1.5">
          <button onClick={() => handleCollection(undefined)}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${!filters.collection ? 'bg-[#f5f1f0] text-[#4a4442] font-medium' : 'hover:bg-gray-50 text-gray-600'}`}>
            All Products
          </button>
          {collections.map((c: any) => (
            <button key={c._id} onClick={() => handleCollection(c.slug)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${filters.collection === c.slug ? 'bg-[#f5f1f0] text-[#4a4442] font-medium' : 'hover:bg-gray-50 text-gray-600'}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleReset} className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
        Reset Filters
      </button>
    </div>
  );
}
