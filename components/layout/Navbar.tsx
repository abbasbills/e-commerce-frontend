'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Menu, X, User, LogOut, Package, LayoutDashboard } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { clearCartState } from '@/store/slices/cartSlice';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const dispatch  = useAppDispatch();
  const router    = useRouter();
  const { user }  = useAppSelector((s) => s.auth);
  const { cart }  = useAppSelector((s) => s.cart);
  const [open, setOpen]         = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch]     = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCartState());
    setUserMenu(false);
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setOpen(false);
    }
  };

  const itemCount = cart?.itemCount ?? 0;

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#f5f1f0]/95 backdrop-blur-md shadow-md shadow-[#d4cdc9]/40' : 'bg-[#f5f1f0]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="w-8 h-8 bg-gradient-to-br from-[#4a4442] to-[#736e6c] rounded-lg flex items-center justify-center"
            >
              <Package className="w-4 h-4 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#4a4442] to-[#736e6c] bg-clip-text text-transparent">
              ShopNow
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-[#5c5755] hover:text-[#736e6c] transition-colors font-medium text-sm">
              All Products
            </Link>
            <Link href="/collections" className="text-[#5c5755] hover:text-[#736e6c] transition-colors font-medium text-sm">
              Collections
            </Link>
          </div>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-52 pl-4 pr-10 py-2 text-sm rounded-full border border-[#d4cdc9] focus:outline-none focus:ring-2 focus:ring-[#736e6c] bg-[#ede8e6]"
            />
            <button type="submit" className="absolute right-3 text-[#9c9694] hover:text-[#736e6c]">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link href="/cart">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-full hover:bg-[#e8e3e1] transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-[#4a4442]" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-[#736e6c] text-white text-xs rounded-full flex items-center justify-center font-bold"
                    >
                      {itemCount > 99 ? '99+' : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </Link>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-[#e8e3e1] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4a4442] to-[#736e6c] flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.[0]?.toUpperCase() ?? <User className="w-4 h-4" />}
                </div>
              </motion.button>

              <AnimatePresence>
                {userMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50"
                  >
                    {user && !user.isAnonymous ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-50">
                          <p className="font-semibold text-sm text-gray-800 truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        {user.role === 'admin' ? (
                          <Link href="/admin" onClick={() => setUserMenu(false)}>
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#4a4442] hover:bg-[#e8e3e1] hover:text-[#736e6c] transition-colors">
                              <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                            </button>
                          </Link>
                        ) : (
                          <Link href="/orders" onClick={() => setUserMenu(false)}>
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#4a4442] hover:bg-[#e8e3e1] hover:text-[#736e6c] transition-colors">
                              <Package className="w-4 h-4" /> My Orders
                            </button>
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/auth/login" onClick={() => setUserMenu(false)}>
                          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#4a4442] hover:bg-[#e8e3e1] transition-colors">
                            <User className="w-4 h-4" /> Sign In
                          </button>
                        </Link>
                        <Link href="/auth/register" onClick={() => setUserMenu(false)}>
                          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#736e6c] font-semibold hover:bg-[#e8e3e1] transition-colors">
                            Create Account
                          </button>
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              <form onSubmit={handleSearch} className="flex items-center relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products…"
                  className="w-full pl-4 pr-10 py-2 text-sm rounded-full border border-[#d4cdc9] focus:outline-none focus:ring-2 focus:ring-[#736e6c] bg-[#ede8e6]"
                />
                <button type="submit" className="absolute right-3 text-gray-400">
                  <Search className="w-4 h-4" />
                </button>
              </form>
              <Link href="/products"     onClick={() => setOpen(false)} className="block py-2 text-gray-700 font-medium">All Products</Link>
              <Link href="/collections"  onClick={() => setOpen(false)} className="block py-2 text-gray-700 font-medium">Collections</Link>
              <Link href="/cart"         onClick={() => setOpen(false)} className="block py-2 text-gray-700 font-medium">Cart ({itemCount})</Link>
              {user && !user.isAnonymous && (
                <Link href="/orders" onClick={() => setOpen(false)} className="block py-2 text-gray-700 font-medium">My Orders</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click-outside to close user menu */}
      {userMenu && <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} />}
    </motion.nav>
  );
}
