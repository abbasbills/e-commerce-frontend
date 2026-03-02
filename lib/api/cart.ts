import api from '@/lib/axios';
import type { Cart, ApiResponse } from '@/types';

export const cartApi = {
  get: () =>
    api.get<{ success: boolean; data: Cart }>('/api/cart'),

  add: (productId: string, quantity = 1) =>
    api.post<ApiResponse>('/api/cart/add', { productId, quantity }),

  update: (productId: string, quantity: number) =>
    api.put<ApiResponse>('/api/cart/update', { productId, quantity }),

  remove: (productId: string) =>
    api.delete<ApiResponse>(`/api/cart/remove/${productId}`),

  clear: () =>
    api.delete<ApiResponse>('/api/cart/clear'),
};
