'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, Tag, ShoppingBag, LogOut, ChevronRight } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/collections', label: 'Collections', icon: Tag },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!token || user?.role !== 'admin') {
      router.replace('/auth/login');
    }
  }, [token, user, router]);

  if (!token || user?.role !== 'admin') return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#736e6c] rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-gray-900">Admin Panel</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
        </div>
        <nav className="p-4 flex-1 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
            return (
              <Link key={href} href={href}>
                <motion.div whileHover={{ x: 2 }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-[#736e6c] text-white shadow-md shadow-[#d4cdc9]' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Icon className="w-4 h-4" />
                  {label}
                  {active && <ChevronRight className="w-4 h-4 ml-auto" />}
                </motion.div>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <button onClick={() => { dispatch(logout()); router.push('/'); }}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium px-4 py-2.5 rounded-xl hover:bg-red-50 w-full transition-colors">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2.5 rounded-xl hover:bg-gray-50 w-full mt-1 transition-colors">
            ← Storefront
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 min-w-0">{children}</main>
    </div>
  );
}
