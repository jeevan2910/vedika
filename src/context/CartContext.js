'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  useEffect(() => {
    const savedCart = localStorage.getItem('saree_cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('saree_cart', JSON.stringify(newCart));
  };

  const addToCart = (product, quantity, blouseStyle) => {
    // Support both old format (product, qty, blouseStyle) and new format (single object with all fields)
    let id, title, price, image, fabric, bs, qty;
    if (typeof product === 'object' && product.quantity !== undefined && quantity === undefined) {
      // New format: addToCart({ id, title, price, image, blouseStyle, quantity })
      id = product.id;
      title = product.title;
      price = product.price;
      image = product.image || (product.images ? product.images.split(',')[0] : '');
      fabric = product.fabric || '';
      bs = product.blouseStyle || 'Standard Unstitched';
      qty = product.quantity || 1;
    } else {
      // Old format: addToCart(product, quantity, blouseStyle)
      id = product.id;
      title = product.title;
      price = product.price;
      image = product.images ? product.images.split(',')[0] : (product.image || '');
      fabric = product.fabric || '';
      bs = blouseStyle || 'Standard Unstitched';
      qty = quantity || 1;
    }

    const existingIndex = cart.findIndex(item => item.id === id && item.blouseStyle === bs);
    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += qty;
      saveCart(newCart);
    } else {
      saveCart([...cart, { id, title, price, image, fabric, blouseStyle: bs, quantity: qty }]);
    }
  };

  const removeFromCart = (id, blouseStyle) => {
    saveCart(cart.filter(item => !(item.id === id && item.blouseStyle === blouseStyle)));
  };

  const updateQuantity = (id, quantityOrBlouse, blouseStyleOrUndefined) => {
    // Support both: updateQuantity(id, blouseStyle, quantity) AND updateQuantity(id, quantity, blouseStyle)
    let quantity, blouseStyle;
    if (typeof quantityOrBlouse === 'number') {
      quantity = quantityOrBlouse;
      blouseStyle = blouseStyleOrUndefined;
    } else {
      blouseStyle = quantityOrBlouse;
      quantity = blouseStyleOrUndefined;
    }

    if (quantity <= 0) { removeFromCart(id, blouseStyle); return; }
    saveCart(cart.map(item => {
      if (item.id === id && (!blouseStyle || item.blouseStyle === blouseStyle)) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => { saveCart([]); setIsGift(false); setGiftMessage(''); };

  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);
  const cartTotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, cartItems: cart, // alias for CartDrawer
      addToCart, removeFromCart, updateQuantity, clearCart,
      cartCount, cartTotal,
      isGift, setIsGift, giftMessage, setGiftMessage
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() { return useContext(CartContext); }
