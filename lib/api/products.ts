import api from '@/lib/axios';
import type { ProductsResponse, Product, ProductFilters, Collection } from '@/types';

export const productsApi = {
  getAll: (filters?: ProductFilters) =>
    api.get<ProductsResponse>('/api/products', { params: filters }),

  getById: (id: string) =>
    api.get<{ success: boolean; data: Product }>(`/api/products/${id}`),

  getByCollectionSlug: (slug: string, page = 1, limit = 20) =>
    api.get<ProductsResponse>(`/api/products/collection/${slug}`, {
      params: { page, limit },
    }),

  getCollections: () =>
    api.get<{ success: boolean; count: number; data: Collection[] }>('/api/collections'),

  getImageUrl: (productId: string, imageId: string) =>
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/image/${productId}/${imageId}`,
};
