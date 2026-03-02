import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/components/providers/StoreProvider';
import AuthProvider  from '@/components/providers/AuthProvider';
import { Toaster }   from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShopNow — Premium E-Commerce',
  description: 'Your one-stop destination for premium products.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
        <body className={`${inter.className} antialiased`} style={{ background: 'var(--tp-50)', color: 'var(--tp-900)' }}>
        <StoreProvider>
          <AuthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: { borderRadius: '12px', padding: '12px 16px' },
              }}
            />
            <Navbar />
            <main className="min-h-screen pt-16">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
