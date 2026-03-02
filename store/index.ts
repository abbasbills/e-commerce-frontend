'use client';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import authReducer    from './slices/authSlice';
import cartReducer    from './slices/cartSlice';
import productsReducer from './slices/productsSlice';
import ordersReducer  from './slices/ordersSlice';

export const store = configureStore({
  reducer: {
    auth:     authReducer,
    cart:     cartReducer,
    products: productsReducer,
    orders:   ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch     = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
