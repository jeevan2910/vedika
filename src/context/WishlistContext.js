'use client';

import React, { useState, createContext, useContext } from 'react';
import { useCustomer } from '@/context/CustomerContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isLoggedIn, setShowLoginModal } = useCustomer();
  const [wishlist, setWishlist] = useState(() => {
    if (typeof window !== 'undefined') {
      try { return JSON.parse(localStorage.getItem('vta_wishlist') || '[]'); } catch { return []; }
    }
    return [];
  });

  const toggle = (product) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      const next = exists ? prev.filter((p) => p.id !== product.id) : [...prev, product];
      if (typeof window !== 'undefined') localStorage.setItem('vta_wishlist', JSON.stringify(next));
      return next;
    });
  };

  const isWishlisted = (id) => wishlist.some((p) => p.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be inside WishlistProvider');
  return ctx;
}
