import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsApi } from '@/lib/api/products';
import type { Product, Collection, ProductFilters } from '@/types';

interface ProductsState {
  products: Product[];
  product: Product | null;
  collections: Collection[];
  total: number;
  page: number;
  pages: number;
  isLoading: boolean;
  error: string | null;
  filters: ProductFilters;
}

const initialState: ProductsState = {
  products:    [],
  product:     null,
  collections: [],
  total:       0,
  page:        1,
  pages:       1,
  isLoading:   false,
  error:       null,
  filters:     { page: 1, limit: 12 },
};

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (filters: ProductFilters | undefined, { rejectWithValue }) => {
    try {
      const { data } = await productsApi.getAll(filters);
      return data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message ?? 'Failed to load products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await productsApi.getById(id);
      return data.data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message ?? 'Product not found');
    }
  }
);

export const fetchCollections = createAsyncThunk(
  'products/fetchCollections',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await productsApi.getCollections();
      return data.data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message ?? 'Failed to load collections');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = { page: 1, limit: 12 };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending,   (state) => { state.isLoading = true;  state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products  = action.payload?.data ?? [];
        state.total     = action.payload?.total ?? 0;
        state.page      = action.payload?.page  ?? 1;
        state.pages     = action.payload?.pages ?? 1;
      })
      .addCase(fetchProducts.rejected,  (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(fetchProductById.pending,   (state) => { state.isLoading = true;  state.product = null; })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.isLoading = false; state.product = action.payload ?? null; })
      .addCase(fetchProductById.rejected,  (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(fetchCollections.fulfilled, (state, action) => { state.collections = action.payload ?? []; });
  },
});

export const { setFilters, resetFilters } = productsSlice.actions;
export default productsSlice.reducer;
