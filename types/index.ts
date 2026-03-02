// ─── Auth ──────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email?: string;
  role: 'user' | 'admin' | 'anonymous';
  isAnonymous: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message: string;
}

// ─── Collection ────────────────────────────────────────────────────────────────
export interface Collection {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Product ───────────────────────────────────────────────────────────────────
export interface ProductImage {
  _id: string;
  contentType: string;
  filename?: string;
  url: string;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number | null;
  salePrice?: number | null;        // alias used by backend
  effectivePrice: number;
  discountPercentage: number;
  stock: number;
  category: Collection | string;
  images: ProductImage[];
  sku?: string;
  tags?: string[];
  isActive: boolean;
  createdAt: string;
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Product[];
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  collection?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

// ─── Cart ──────────────────────────────────────────────────────────────────────
export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

// ─── Order ─────────────────────────────────────────────────────────────────────
export interface OrderItem {
  _id: string;
  product?: string;
  productName?: string;   // some backends use productName
  name?: string;          // some backends use name
  productSku?: string;
  quantity: number;
  price: number;
  subtotal?: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface ShippingAddress {
  fullName?: string;
  name?: string;
  address?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  zip?: string;
  country?: string;
  email?: string;
  phone?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string | { name: string; email: string };
  items: (OrderItem & { name?: string })[]; // backend may use 'name' not 'productName'
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  isPaid?: boolean;                 // virtual from backend
  paymentMethod?: string;           // stored on order
  shippingAddress: ShippingAddress;
  paymentRef?: Payment;
  notes?: string;
  createdAt: string;
}

// ─── Payment ───────────────────────────────────────────────────────────────────
export type PaymentMethod = 'card' | 'bank_transfer' | 'wallet';

export interface Payment {
  _id: string;
  order: string;
  user: string;
  amount: number;
  method: PaymentMethod;
  status: 'pending' | 'success' | 'failed';
  transactionRef: string;
  gatewayResponse?: Record<string, unknown>;
  simulatedAt?: string;
  createdAt: string;
}

export interface PaymentResult {
  transactionRef: string;
  amount: number;
  method: string;
  status: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  gatewayResponse: Record<string, unknown>;
}

// ─── Admin Dashboard ───────────────────────────────────────────────────────────
export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalCollections: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface DashboardData {
  stats: DashboardStats;
  ordersByStatus: Array<{ _id: string; count: number; revenue: number }>;
  recentOrders: Order[];
}

// ─── Generic API ───────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: T[];
}
