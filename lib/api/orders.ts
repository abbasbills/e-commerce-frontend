import api from '@/lib/axios';
import type { Order, ShippingAddress, PaginatedResponse } from '@/types';

export const ordersApi = {
  place: (shippingAddress?: Partial<ShippingAddress>, notes?: string, paymentMethod?: string) =>
    api.post<{ success: boolean; data: Order }>('/api/orders', { shippingAddress, notes, paymentMethod }),

  getAll: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<Order>>('/api/orders', { params: { page, limit } }),

  getById: (id: string) =>
    api.get<{ success: boolean; data: Order }>(`/api/orders/${id}`),

  cancel: (id: string) =>
    api.put<{ success: boolean; data: Order }>(`/api/orders/${id}/cancel`),
};
