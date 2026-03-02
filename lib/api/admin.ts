import api from '@/lib/axios';
import type {
  DashboardData,
  Collection,
  Product,
  Order,
  PaginatedResponse,
} from '@/types';

export const adminApi = {
  // Dashboard
  getDashboard: () =>
    api.get<{ success: boolean; data: DashboardData }>('/api/admin/dashboard'),

  // Collections
  getCollections: () =>
    api.get<{ success: boolean; count: number; data: Collection[] }>('/api/admin/collections'),

  getCollection: (id: string) =>
    api.get<{ success: boolean; data: Collection }>(`/api/admin/collections/${id}`),

  createCollection: (data: { name: string; description?: string; isActive?: boolean }) =>
    api.post<{ success: boolean; data: Collection }>('/api/admin/collections', data),

  updateCollection: (
    id: string,
    data: { name?: string; description?: string; isActive?: boolean }
  ) =>
    api.put<{ success: boolean; data: Collection }>(`/api/admin/collections/${id}`, data),

  deleteCollection: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/collections/${id}`),

  // Products
  getProducts: (params?: {
    page?: number;
    limit?: number;
    collection?: string;
    search?: string;
    isActive?: boolean;
  }) => api.get<PaginatedResponse<Product>>('/api/admin/products', { params }),

  getProduct: (id: string) =>
    api.get<{ success: boolean; data: Product }>(`/api/admin/products/${id}`),

  createProduct: (formData: FormData) =>
    api.post<{ success: boolean; data: Product }>('/api/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateProduct: (id: string, formData: FormData) =>
    api.put<{ success: boolean; data: Product }>(`/api/admin/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteProduct: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/products/${id}`),

  deleteProductImage: (productId: string, imageId: string) =>
    api.delete(`/api/admin/products/${productId}/images/${imageId}`),

  // Orders
  getOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
  }) => api.get<PaginatedResponse<Order>>('/api/admin/orders', { params }),

  getOrder: (id: string) =>
    api.get<{ success: boolean; data: Order }>(`/api/admin/orders/${id}`),

  updateOrderStatus: (id: string, status: string) =>
    api.put<{ success: boolean; data: Order }>(`/api/admin/orders/${id}/status`, { status }),
};
