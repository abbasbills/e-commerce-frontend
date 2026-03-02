import Link from 'next/link';
import { Package, Github, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a1614] text-[#b8b1af] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4a4442] to-[#736e6c] rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-[#e8e3e1]">ShopNow</span>
            </div>
              <p className="text-sm text-[#9c9694] max-w-xs leading-relaxed">
              Your one-stop destination for premium products. Quality guaranteed, delivered fast.
            </p>
            <div className="flex gap-4 mt-6">
              {[Github, Twitter, Instagram].map((Icon, i) => (
                <button key={i} className="p-2 rounded-full bg-[#2d2826] hover:bg-[#736e6c] transition-colors">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[#e8e3e1] font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              {[
                { label: 'All Products', href: '/products' },
                { label: 'Collections',  href: '/collections' },
                { label: 'New Arrivals', href: '/products?sort=-createdAt' },
                { label: 'Deals',        href: '/products?sort=discountPrice' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#9c9694] hover:text-[#b8b1af] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-[#e8e3e1] font-semibold mb-4">Account</h4>
            <ul className="space-y-2">
              {[
                { label: 'Sign In',    href: '/auth/login' },
                { label: 'Register',   href: '/auth/register' },
                { label: 'My Orders',  href: '/orders' },
                { label: 'Cart',       href: '/cart' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-[#9c9694] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2d2826] mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-[#5c5755]">© {new Date().getFullYear()} ShopNow. All rights reserved.</p>
          <p className="text-xs text-[#5c5755]">Built with Next.js · Redux · Express</p>
        </div>
      </div>
    </footer>
  );
}
