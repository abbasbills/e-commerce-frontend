import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

export const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  }).format(new Date(dateStr));

export const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    pending:    'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped:    'bg-purple-100 text-purple-800',
    delivered:  'bg-green-100 text-green-800',
    cancelled:  'bg-red-100 text-red-800',
    paid:       'bg-green-100 text-green-800',
    failed:     'bg-red-100 text-red-800',
    refunded:   'bg-gray-100 text-gray-800',
    success:    'bg-green-100 text-green-800',
  };
  return map[status] ?? 'bg-gray-100 text-gray-800';
};

export const truncate = (str: string, n: number) =>
  str.length > n ? str.slice(0, n - 1) + '…' : str;
