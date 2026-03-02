import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '@/lib/api/cart';
import type { Cart } from '@/types';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = { cart: null, isLoading: false, error: null };

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await cartApi.get();
    return data.data;
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(e.response?.data?.message ?? 'Failed to load cart');
  }
});

export const addToCart = createAsyncThunk(
  'cart/add',
  async (
    { productId, quantity = 1 }: { productId: string; quantity?: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await cartApi.add(productId, quantity);
      dispatch(fetchCart());
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message ?? 'Failed to add to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/update',
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await cartApi.update(productId, quantity);
      dispatch(fetchCart());
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message ?? 'Failed to update cart');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/remove',
  async (productId: string, { dispatch, rejectWithValue }) => {
    try {
      await cartApi.remove(productId);
      dispatch(fetchCart());
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message ?? 'Failed to remove item');
    }
  }
);

export const clearCart = createAsyncThunk('cart/clear', async (_, { dispatch, rejectWithValue }) => {
  try {
    await cartApi.clear();
    dispatch(fetchCart());
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(e.response?.data?.message ?? 'Failed to clear cart');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState(state) {
      state.cart = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending,   (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchCart.fulfilled, (state, action) => { state.isLoading = false; state.cart = action.payload ?? null; })
      .addCase(fetchCart.rejected,  (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(addToCart.rejected,  (state, action) => { state.error = action.payload as string; })
      .addCase(updateCartItem.rejected, (state, action) => { state.error = action.payload as string; })
      .addCase(removeFromCart.rejected, (state, action) => { state.error = action.payload as string; });
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
