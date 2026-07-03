'use client';
import React, { useState } from 'react';
import Header from './Header';
import CartDrawer from '@/components/CartDrawer/CartDrawer';
import CustomerLoginModal from '@/components/CustomerLoginModal/CustomerLoginModal';

export default function HeaderWrapper() {
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <Header 
        onCartOpen={() => setCartOpen(true)} 
        onLoginOpen={() => setLoginOpen(true)}
      />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <CustomerLoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
