'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useCustomer } from '@/context/CustomerContext';
import { ArrowLeft, CreditCard, Lock, Smartphone, CheckCircle, Gift } from 'lucide-react';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const { cart, cartTotal, isGift, giftMessage, clearCart } = useCart();
  const { customer } = useCustomer();

  const [step, setStep] = useState(0); // 0 = Shipping, 1 = Payment, 2 = Confirmation
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: ''
  });

  useEffect(() => {
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customerName: prev.customerName || customer.name || '',
        customerPhone: prev.customerPhone || customer.phone || ''
      }));
    }
  }, [customer]);
  const [paymentMode, setPaymentMode] = useState('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const giftWrapCost = 350;
  const finalTotal = cartTotal + (isGift ? giftWrapCost : 0);

  // Confetti particles generation
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (step === 2) {
      const colors = ['#D4AF37', '#722F37', '#AA7C11', '#5E2B74', '#FAF9F5', '#1C3F6E'];
      const particles = Array.from({ length: 45 }).map((_, idx) => ({
        id: idx,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: `${Math.random() * 6 + 6}px`
      }));
      setConfetti(particles);
    }
  }, [step]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const validateShipping = () => {
    const { customerName, customerEmail, customerPhone, shippingAddress } = formData;
    if (!customerName || !customerEmail || !customerPhone || !shippingAddress) {
      setErrorMessage('Please fill in all shipping fields.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep(1);
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // API call to record order in SQLite
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          shippingAddress: formData.shippingAddress,
          items: cart, // Passes the cart array directly, backend handles stringification
          totalAmount: finalTotal,
          isGift,
          giftMessage: isGift ? giftMessage : ''
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order.');
      }

      // Success
      setPlacedOrder(data.order);
      setStep(2);
      clearCart(); // Clear cart after successful checkout!
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'An error occurred during payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If cart is empty and we are not in confirmation step
  if (cart.length === 0 && step !== 2) {
    return (
      <div className={styles.container}>
        <div className="container" style={{ textAlign: 'center', padding: '100px' }}>
          <h2 className={styles.formTitle}>Your bag is empty</h2>
          <p style={{ marginBottom: '20px' }}>Please add products to checkout.</p>
          <Link href="/shop" className="btn-primary">
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  // Confirmation Step
  if (step === 2 && placedOrder) {
    return (
      <div className={styles.container} style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Render Confetti Particles */}
        {confetti.map((c) => (
          <div
            key={c.id}
            className={styles.confetti}
            style={{
              left: c.left,
              animationDelay: c.delay,
              backgroundColor: c.color,
              width: c.size,
              height: c.size
            }}
          />
        ))}

        <div className={styles.confirmationBox}>
          {/* Velvet Box unboxing animation */}
          <div className={styles.unboxingContainer}>
            <div className={styles.boxLid} />
            <div className={styles.giftReveal} />
            <div className={styles.velvetBox} />
          </div>

          <CheckCircle size={48} color="#D4AF37" style={{ margin: '0 auto 16px auto' }} />
          <h1 className={styles.formTitle} style={{ borderBottom: 'none', marginBottom: '8px' }}>
            Draped in Grace!
          </h1>
          <p style={{ color: 'var(--accent-hover)', fontWeight: '700', fontSize: '1.05rem', marginBottom: '24px' }}>
            Your Order Has Been Placed Successfully!
          </p>

          <div style={{ backgroundColor: 'var(--bg-secondary)', border: 'var(--border-light)', borderRadius: '4px', padding: '20px', textAlign: 'left', marginBottom: '30px' }}>
            <p style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
              Order ID: <strong style={{ color: 'var(--primary)' }}>{placedOrder.id}</strong>
            </p>
            <p style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
              Recipient: <strong>{placedOrder.customerName}</strong>
            </p>
            <p style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
              Shipping Address: <strong>{placedOrder.shippingAddress}</strong>
            </p>
            <p style={{ fontSize: '0.9rem' }}>
              Amount Paid: <strong style={{ color: 'var(--primary)' }}>₹{placedOrder.totalAmount.toLocaleString('en-IN')}</strong>
            </p>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '30px', lineHeight: '1.6' }}>
            A confirmation receipt and courier tracking link has been sent to <strong>{placedOrder.customerEmail}</strong>. Thank you for celebrating handloom heritage with Vedhika Thread Affairs.
          </p>

          <Link href="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className="container">
        <h1 className={styles.title}>Checkout</h1>

        {/* Steps navigation dots */}
        <div className={styles.stepsNav}>
          <div className={`${styles.stepDot} ${step >= 0 ? styles.activeStepDot : ''} ${step > 0 ? styles.completedStepDot : ''}`}>
            {step > 0 ? '✓' : '1'}
          </div>
          <div className={`${styles.stepDot} ${step >= 1 ? styles.activeStepDot : ''} ${step > 1 ? styles.completedStepDot : ''}`}>
            {step > 1 ? '✓' : '2'}
          </div>
          <div className={`${styles.stepDot} ${step === 2 ? styles.activeStepDot : ''}`}>
            3
          </div>
        </div>

        {errorMessage && (
          <div style={{ maxWidth: '1100px', margin: '0 auto 20px auto', backgroundColor: '#FEEBEE', border: '1px solid #FFCDD2', color: '#B71C1C', padding: '12px 20px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: '600' }}>
            {errorMessage}
          </div>
        )}

        <div className={styles.layout}>
          {/* Form box */}
          <div className={styles.formBox}>
            {step === 0 ? (
              // Step 1: Shipping Form
              <form onSubmit={handleProceedToPayment}>
                <h2 className={styles.formTitle}>Shipping Information</h2>
                <div className={styles.inputGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Full Name</label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      className={styles.input}
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="e.g. Priyanjali Sen"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Phone Number</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      required
                      className={styles.input}
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>
                  <div className={styles.inputGroupFull}>
                    <label className={styles.label}>Email Address</label>
                    <input
                      type="email"
                      name="customerEmail"
                      required
                      className={styles.input}
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      placeholder="e.g. priya@gmail.com"
                    />
                  </div>
                  <div className={styles.inputGroupFull}>
                    <label className={styles.label}>Shipping Address</label>
                    <textarea
                      name="shippingAddress"
                      rows={4}
                      required
                      className={`${styles.input} ${styles.textarea}`}
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      placeholder="Apt/Suite, Street, City, State, ZIP code"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                  <Link href="/cart" className="btn-secondary">
                    Back to Bag
                  </Link>
                  <button type="submit" className="btn-primary">
                    Proceed to Payment
                  </button>
                </div>
              </form>
            ) : (
              // Step 2: Payment Simulator Form
              <form onSubmit={handlePay}>
                <h2 className={styles.formTitle}>Secure Payment</h2>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                  <div
                    className={`${styles.paymentOption} ${paymentMode === 'card' ? styles.activePaymentOption : ''}`}
                    onClick={() => setPaymentMode('card')}
                    style={{ flex: 1 }}
                  >
                    <input
                      type="radio"
                      checked={paymentMode === 'card'}
                      onChange={() => setPaymentMode('card')}
                    />
                    <CreditCard size={18} />
                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Credit/Debit Card</span>
                  </div>
                  <div
                    className={`${styles.paymentOption} ${paymentMode === 'upi' ? styles.activePaymentOption : ''}`}
                    onClick={() => setPaymentMode('upi')}
                    style={{ flex: 1 }}
                  >
                    <input
                      type="radio"
                      checked={paymentMode === 'upi'}
                      onChange={() => setPaymentMode('upi')}
                    />
                    <Smartphone size={18} />
                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>UPI (GPay/PhonePe)</span>
                  </div>
                </div>

                {paymentMode === 'card' ? (
                  <div className={styles.inputGrid}>
                    <div className={styles.inputGroupFull}>
                      <label className={styles.label}>Card Number</label>
                      <input
                        type="text"
                        name="number"
                        required
                        className={styles.input}
                        placeholder="4111 2222 3333 4444"
                        value={cardData.number}
                        onChange={handleCardChange}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        required
                        className={styles.input}
                        placeholder="MM/YY"
                        value={cardData.expiry}
                        onChange={handleCardChange}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        required
                        maxLength={3}
                        className={styles.input}
                        placeholder="123"
                        value={cardData.cvv}
                        onChange={handleCardChange}
                      />
                    </div>
                    <div className={styles.inputGroupFull}>
                      <label className={styles.label}>Cardholder Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        className={styles.input}
                        placeholder="Priyanjali Sen"
                        value={cardData.name}
                        onChange={handleCardChange}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed var(--accent)', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)' }}>
                    <Smartphone size={32} color="var(--primary)" style={{ margin: '0 auto 10px auto' }} />
                    <p style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '8px' }}>UPI Instant Payment Simulator</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>You will be prompted to approve the payment request on your mobile device.</p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <Lock size={14} color="#388E3C" />
                  <span>Your transaction is encrypted using 256-bit SSL technology.</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setStep(0)}>
                    Back to Shipping
                  </button>
                  <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing Payment...' : `Pay ₹${finalTotal.toLocaleString('en-IN')}`}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Side Summary */}
          <aside className={styles.summarySide}>
            <h3 className={styles.summaryTitle}>Your Order</h3>
            <div style={{ maxHeight: '160px', overflowY: 'auto', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: '500' }}>
                    {item.title} <span style={{ color: 'var(--primary)' }}>x{item.quantity}</span>
                  </span>
                  <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className={styles.summaryItem}>
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            {isGift && (
              <div className={styles.summaryItem}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Gift size={12} color="var(--primary)" /> Gifting Wrap
                </span>
                <span>₹{giftWrapCost.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className={styles.summaryItem}>
              <span>Courier Delivery</span>
              <span style={{ color: '#388E3C', fontWeight: '600' }}>FREE</span>
            </div>

            <div className={styles.totalRow}>
              <span>Total due</span>
              <span>₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
