'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Load customer from localStorage on mount
    const savedCustomer = localStorage.getItem('vta_customer');
    if (savedCustomer) {
      try {
        setCustomer(JSON.parse(savedCustomer));
      } catch (e) {
        console.error('Failed to parse customer session:', e);
      }
    }
  }, []);

  const login = async (phone, name) => {
    try {
      const res = await fetch('/api/auth/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCustomer(data.customer);
        localStorage.setItem('vta_customer', JSON.stringify(data.customer));
        setShowLoginModal(false); // Close login modal on success!
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login request error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setCustomer(null);
    localStorage.removeItem('vta_customer');
    // Clear cookie by setting past maxAge
    document.cookie = 'customer_session=; path=/; max-age=0;';
  };

  return (
    <CustomerContext.Provider value={{ customer, login, logout, isLoggedIn: !!customer, showLoginModal, setShowLoginModal }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomer must be inside CustomerProvider');
  return ctx;
}
