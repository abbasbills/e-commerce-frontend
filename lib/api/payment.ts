import api from '@/lib/axios';
import type { Payment, PaymentResult, PaymentMethod } from '@/types';

export const paymentApi = {
  simulate: (orderId: string, method: PaymentMethod = 'card') =>
    api.post<{ success: boolean; message: string; data: PaymentResult }>(
      '/api/payment/simulate',
      { orderId, method }
    ),

  getByOrder: (orderId: string) =>
    api.get<{ success: boolean; data: Payment }>(`/api/payment/${orderId}`),

  getHistory: () =>
    api.get<{ success: boolean; count: number; data: Payment[] }>('/api/payment/history'),
};
