'use client';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Add New Product</h1>
          <p className="text-gray-500 mt-0.5 text-sm">Fill in the details below</p>
        </div>
      </div>
      <ProductForm />
    </div>
  );
}
