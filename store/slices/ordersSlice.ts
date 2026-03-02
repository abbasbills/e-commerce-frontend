import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordersApi } from '@/lib/api/orders';
import { paymentApi } from '@/lib/api/payment';
import type { Order, ShippingAddress, PaymentResult, PaymentMethod } from '@/types';

interface OrdersState {
  orders: Order[];
  order: Order | null;
  total: number;
  page: number;
  pages: number;
  paymentResult: PaymentResult | null;
  isLoading: boolean;
  isPlacing: boolean;
  isPaying: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders:        [],
  order:         null,
  total:         0,
  page:          1,
  pages:         1,
  paymentResult: null,
  isLoading:     false,
  isPlacing:     false,
  isPaying:      false,
  error:         null,
};

export const placeOrder = createAsyncThunk(
  'orders/place',
  async (
    { shippingAddress, notes, paymentMethod }: { shippingAddress?: Partial<ShippingAddress>; notes?: string; paymentMethod?: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await ordersApi.place(shippingAddress, notes, paymentMethod);
      return data.data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message ?? 'Failed to place order');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchAll',
  async ({ page, limit }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const { data } = await ordersApi.getAll(page, limit);
      return data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message ?? 'Failed to load orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await ordersApi.getById(id);
      return data.data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message ?? 'Order not found');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await ordersApi.cancel(id);
      dispatch(fetchMyOrders({ page: 1 }));
      return data.data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message ?? 'Cannot cancel order');
    }
  }
);

export const simulatePayment = createAsyncThunk(
  'orders/pay',
  async (
    { orderId, method }: { orderId: string; method?: PaymentMethod },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await paymentApi.simulate(orderId, method);
      return data.data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message ?? 'Payment failed');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearPaymentResult(state) { state.paymentResult = null; },
    clearOrderError(state)    { state.error = null; },
    clearCurrentOrder(state)  { state.order = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending,   (state) => { state.isPlacing = true;  state.error = null; })
      .addCase(placeOrder.fulfilled, (state, action) => { state.isPlacing = false; state.order   = action.payload ?? null; })
      .addCase(placeOrder.rejected,  (state, action) => { state.isPlacing = false; state.error   = action.payload as string; })
      .addCase(fetchMyOrders.pending,   (state) => { state.isLoading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders    = action.payload?.data ?? [];
        state.total     = action.payload?.total ?? 0;
        state.page      = action.payload?.page  ?? 1;
        state.pages     = action.payload?.pages ?? 1;
      })
      .addCase(fetchMyOrders.rejected,  (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(fetchOrderById.pending,   (state) => { state.isLoading = true; state.order = null; })
      .addCase(fetchOrderById.fulfilled, (state, action) => { state.isLoading = false; state.order = action.payload ?? null; })
      .addCase(fetchOrderById.rejected,  (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(simulatePayment.pending,   (state) => { state.isPaying = true;  state.error = null; state.paymentResult = null; })
      .addCase(simulatePayment.fulfilled, (state, action) => { state.isPaying = false; state.paymentResult = action.payload ?? null; })
      .addCase(simulatePayment.rejected,  (state, action) => { state.isPaying = false; state.error = action.payload as string; });
  },
});

export const { clearPaymentResult, clearOrderError, clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
