import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '@/lib/api/auth';
import type { AuthState, LoginPayload, RegisterPayload, User } from '@/types';

// ─── Persist helpers ──────────────────────────────────────────────────────────
const loadFromStorage = (): Partial<AuthState> => {
  if (typeof window === 'undefined') return {};
  try {
    return {
      token: localStorage.getItem('token') ?? null,
      user: JSON.parse(localStorage.getItem('user') ?? 'null'),
    };
  } catch {
    return {};
  }
};

const saveToStorage = (token: string, user: User) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

const clearStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// ─── Thunks ───────────────────────────────────────────────────────────────────
export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const { data } = await authApi.register(payload);
      saveToStorage(data.token, data.user);
      return data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message ?? 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const { data } = await authApi.login(payload);
      saveToStorage(data.token, data.user);
      return data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message ?? 'Login failed');
    }
  }
);

export const adminLoginUser = createAsyncThunk(
  'auth/adminLogin',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const { data } = await authApi.adminLogin(payload);
      saveToStorage(data.token, data.user);
      return data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message ?? 'Admin login failed');
    }
  }
);

export const createAnonymousSession = createAsyncThunk(
  'auth/anonymous',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await authApi.anonymous();
      saveToStorage(data.token, data.user);
      return data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message ?? 'Failed to create session');
    }
  }
);

// ─── Initial state ────────────────────────────────────────────────────────────
const persisted = typeof window !== 'undefined' ? loadFromStorage() : {};

const initialState: AuthState = {
  user:      persisted.user ?? null,
  token:     persisted.token ?? null,
  isLoading: false,
  error:     null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user  = null;
      state.token = null;
      state.error = null;
      clearStorage();
    },
    clearError(state) {
      state.error = null;
    },
    hydrateAuth(state) {
      const stored = loadFromStorage();
      if (stored.token && stored.user) {
        state.token = stored.token;
        state.user  = stored.user;
      }
    },
  },
  extraReducers: (builder) => {
    const pending   = (state: AuthState)                         => { state.isLoading = true;  state.error = null; };
    const rejected  = (state: AuthState, action: PayloadAction<unknown>) => { state.isLoading = false; state.error = action.payload as string; };
    const fulfilled = (state: AuthState, action: PayloadAction<{ token: string; user: User }>) => {
      state.isLoading = false;
      state.token     = action.payload.token;
      state.user      = action.payload.user;
    };

    [registerUser, loginUser, adminLoginUser, createAnonymousSession].forEach((thunk) => {
      builder
        .addCase(thunk.pending,   pending)
        .addCase(thunk.fulfilled, fulfilled)
        .addCase(thunk.rejected,  rejected as Parameters<typeof builder.addCase>[1]);
    });
  },
});

export const { logout, clearError, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
