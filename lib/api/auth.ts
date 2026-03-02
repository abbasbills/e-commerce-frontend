import api from '@/lib/axios';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types';

export const authApi = {
  register: (data: RegisterPayload) =>
    api.post<AuthResponse>('/api/auth/register', data),

  login: (data: LoginPayload) =>
    api.post<AuthResponse>('/api/auth/login', data),

  adminLogin: (data: LoginPayload) =>
    api.post<AuthResponse>('/api/auth/admin/login', data),

  anonymous: () =>
    api.post<AuthResponse>('/api/auth/anonymous'),

  getMe: () =>
    api.get<{ success: boolean; data: User }>('/api/auth/me'),
};
