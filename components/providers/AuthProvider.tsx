'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { hydrateAuth, createAnonymousSession } from '@/store/slices/authSlice';
import { fetchCart } from '@/store/slices/cartSlice';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((s) => s.auth);

  useEffect(() => {
    // Hydrate from localStorage
    dispatch(hydrateAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!token) {
      // No session at all → create anonymous one
      dispatch(createAnonymousSession());
    } else {
      // Logged in (any role) → load cart
      dispatch(fetchCart());
    }
  }, [token, dispatch]);

  // Admin users don't need a cart
  const _ = user; // keep reference

  return <>{children}</>;
}
