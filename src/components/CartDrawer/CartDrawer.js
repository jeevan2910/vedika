'use client';

import React from 'react';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';

export default function CartDrawer({ open, onClose }) {
  const { cartItems, updateQuantity, removeFromCart, cartCount, cartTotal } = useCart();

  const FREE_SHIPPING_THRESHOLD = 5000;
  const progressPct = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - cartTotal, 0);

  if (!open) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.drawer}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <ShoppingBag size={18} />
            <span className={styles.title}>Your Bag ({cartCount})</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className={styles.shippingBar}>
          <div className={styles.shippingProgress}>
            <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
          </div>
          <p className={styles.shippingText}>
            {remaining > 0
              ? <>Add <strong>₹{remaining.toLocaleString('en-IN')}</strong> more for <strong>Free Shipping</strong></>
              : <>🎉 You've unlocked <strong>Free Shipping!</strong></>
            }
          </p>
        </div>

        {/* Items */}
        <div className={styles.items}>
          {cartItems.length === 0 ? (
            <div className={styles.empty}>
              <ShoppingBag size={48} strokeWidth={1} color="var(--text-light)" />
              <p className={styles.emptyTitle}>Your bag is empty</p>
              <p className={styles.emptyText}>Discover our exquisite handwoven sarees</p>
              <Link href="/shop" className="btn-accent" onClick={onClose} style={{ marginTop: '16px' }}>
                Shop Collection
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.id}-${item.blouseStyle}`} className={styles.item}>
                <img
                  src={item.image || item.images?.split(',')[0]}
                  alt={item.title}
                  className={styles.itemImg}
                />
                <div className={styles.itemDetails}>
                  <p className={styles.itemTitle}>{item.title}</p>
                  {item.blouseStyle && (
                    <p className={styles.itemMeta}>Blouse: {item.blouseStyle}</p>
                  )}
                  <div className={styles.itemRow}>
                    <div className={styles.qty}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.blouseStyle)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <span className={styles.qtyNum}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.blouseStyle)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className={styles.itemPrice}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(item.id, item.blouseStyle)}
                  aria-label="Remove"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotal}>
              <span className={styles.subtotalLabel}>Subtotal</span>
              <span className={styles.subtotalAmount}>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <p className={styles.taxNote}>Taxes & shipping calculated at checkout</p>
            <Link href="/checkout" className={`btn-accent ${styles.checkoutBtn}`} onClick={onClose}>
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
            <Link href="/cart" className={`btn-secondary ${styles.viewCartBtn}`} onClick={onClose}>
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
