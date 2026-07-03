'use client';

import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { CustomerProvider } from '@/context/CustomerContext';

export function Providers({ children }) {
  return (
    <CustomerProvider>
      <CartProvider>
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </CartProvider>
    </CustomerProvider>
  );
}
