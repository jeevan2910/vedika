'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header/Header';
import CartDrawer from '@/components/CartDrawer/CartDrawer';
import CustomerLoginModal from '@/components/CustomerLoginModal/CustomerLoginModal';
import BottomNavigation from '@/components/BottomNavigation/BottomNavigation';
import Footer from '@/components/Footer/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget/WhatsAppWidget';
import { useCustomer } from '@/context/CustomerContext';
import { Phone, User, Lock, CheckCircle2 } from 'lucide-react';
import styles from './LayoutShell.module.css';

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const isApi = pathname.startsWith('/api');
  
  const { customer, login, isLoggedIn, showLoginModal, setShowLoginModal, preventClose, setPreventClose } = useCustomer();
  
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [cartOpen, setCartOpen] = useState(false);

  // Trigger login modal after 15 seconds browsing on the homepage if they are not logged in
  useEffect(() => {
    if (pathname === '/' && !isLoggedIn) {
      const timer = setTimeout(() => {
        setPreventClose(true);
        setShowLoginModal(true);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [pathname, isLoggedIn, setShowLoginModal, setPreventClose]);

  // Dynamic Scroll Reveal Intersection Observer (Antigravity animations)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-on-scroll-active');
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );

    // Give it a tiny delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [pathname, success]);

  // Admin and API routes bypass the customer gate
  if (isAdmin || isApi) {
    return <>{children}</>;
  }

  const handleGateSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!phone) {
      setError('Phone number is required to enter');
      setLoading(false);
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      setLoading(false);
      return;
    }

    const res = await login(cleanPhone, name);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || 'Failed to verify. Please try again.');
    }
  };

  // If customer is trying to checkout but is not logged in, show the exclusive boutique entry gate
  const isCheckout = pathname.startsWith('/checkout');
  if (isCheckout && !isLoggedIn) {
    return (
      <div className={styles.gatePage}>
        <div className={styles.gateCard}>
          <div className={styles.brandBadge}>🧵 Est. 2026</div>
          <h1 className={styles.gateTitle}>Vedhika</h1>
          <span className={styles.gateSubtitle}>Thread Affairs</span>
          <div className={styles.dividerGold} />
          
          {success ? (
            <div className={styles.successBlock}>
              <CheckCircle2 size={40} color="#ab8c52" className={styles.successIcon} />
              <h3 className={styles.welcomeTitle}>Welcome to the Boutique</h3>
              <p className={styles.welcomeText}>Entering Vedhika Thread Affairs...</p>
            </div>
          ) : (
            <div className={styles.formBlock}>
              <p className={styles.gateDescription}>
                We welcome you to our exclusive handloom collection. Please register with your mobile number to unlock access to our boutique website.
              </p>

              {error && <div className={styles.errorAlert}>{error}</div>}

              <form onSubmit={handleGateSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name</label>
                  <div className={styles.inputWrap}>
                    <User size={16} className={styles.inputIcon} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Mobile Number *</label>
                  <div className={styles.inputWrap}>
                    <Phone size={16} className={styles.inputIcon} />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className={styles.input}
                      maxLength={15}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className={styles.submitBtn}
                >
                  {loading ? 'Verifying...' : 'Unlock Boutique Access'}
                </button>
              </form>
              <p className={styles.privacyNote}>
                🔒 Your details are stored securely in our database. We will never share your number.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Logged-in customers browse normally
  return (
    <>
      <Header 
        onCartOpen={() => setCartOpen(true)} 
        onLoginOpen={() => setShowLoginModal(true)} 
      />
      <main style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', paddingBottom: '30px' }}>
        {children}
      </main>
      <Footer />
      <BottomNavigation 
        onCartOpen={() => setCartOpen(true)} 
        onLoginOpen={() => setShowLoginModal(true)} 
      />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <CustomerLoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <WhatsAppWidget />
    </>
  );
}
