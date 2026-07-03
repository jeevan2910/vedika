'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, ShoppingBag, Gift, ArrowRight } from 'lucide-react';
import styles from './cart.module.css';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    isGift,
    setIsGift,
    giftMessage,
    setGiftMessage
  } = useCart();

  const giftWrapCost = 350;
  const finalTotal = cartTotal + (isGift ? giftWrapCost : 0);

  if (cart.length === 0) {
    return (
      <div className={styles.container}>
        <div className="container">
          <div className={styles.emptyCart}>
            <ShoppingBag size={48} color="var(--primary)" style={{ margin: '0 auto 16px auto' }} />
            <h2 className={styles.emptyCartTitle}>Your Bag is Empty</h2>
            <p className={styles.emptyCartText}>It seems you haven't added any luxury heritage handlooms to your bag yet.</p>
            <Link href="/shop" className="btn-primary">
              Explore Our Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className="container">
        <h1 className={styles.title}>Your Silk Bag</h1>

        <div className={styles.layout}>
          {/* Cart items list */}
          <div className={styles.cartList}>
            {cart.map((item, idx) => (
              <div key={`${item.id}-${item.blouseStyle}-${idx}`} className={styles.cartItem}>
                <img src={item.image} alt={item.title} className={styles.itemImg} />
                <div className={styles.itemDetails}>
                  <span className={styles.itemSub}>{item.fabric}</span>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Blouse: <strong>{item.blouseStyle}</strong>
                  </span>
                  <span className={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')}</span>
                </div>

                <div className={styles.controls}>
                  <div className={styles.qtyWrapper}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(item.id, item.blouseStyle, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className={styles.qtyVal}>{item.quantity}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(item.id, item.blouseStyle, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item.id, item.blouseStyle)}
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout / Summary column */}
          <div className={styles.summaryBox}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <div className={styles.summaryRow}>
              <span>Bag Subtotal</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Heritage Shipping</span>
              <span style={{ color: '#388E3C', fontWeight: '600' }}>FREE</span>
            </div>

            {/* Gift Wrap options */}
            <div className={styles.giftBox}>
              <h3 className={styles.giftTitle}>
                <Gift size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Premium Packaging
              </h3>
              <label className={styles.giftLabel}>
                <input
                  type="checkbox"
                  checked={isGift}
                  onChange={(e) => setIsGift(e.target.checked)}
                />
                <span>Add Velvet Gift Box Wrap (+₹{giftWrapCost})</span>
              </label>

              {isGift && (
                <div>
                  <textarea
                    rows={3}
                    placeholder="Enter an optional handwritten gift message here..."
                    className={styles.giftTextarea}
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                  />
                </div>
              )}
            </div>

            {isGift && (
              <div className={styles.summaryRow} style={{ marginTop: '16px' }}>
                <span>Gift Wrapping</span>
                <span>₹{giftWrapCost.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className={styles.summaryTotal}>
              <span>Total Amount</span>
              <span>₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ marginTop: '30px' }}>
              <Link
                href="/checkout"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
