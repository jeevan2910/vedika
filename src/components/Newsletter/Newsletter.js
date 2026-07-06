'use client';

import React, { useState } from 'react';
import { Mail, X, CheckCircle } from 'lucide-react';
import styles from './Newsletter.module.css';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    
    // Simulate API lead capture
    setTimeout(() => {
      setStatus('success');
      localStorage.setItem('vedhika_newsletter_subscribed', 'true');
    }, 1200);
  };

  if (!isVisible) return null;

  return (
    <section className={styles.newsletterSection}>
      <div className={styles.container}>
        <button 
          onClick={() => setIsVisible(false)} 
          className={styles.closeBtn}
          aria-label="Dismiss newsletter signup"
        >
          <X size={18} />
        </button>

        <div className={styles.contentWrap}>
          {status === 'success' ? (
            <div className={styles.successBlock}>
              <CheckCircle size={32} className={styles.successIcon} />
              <h3 className={styles.title}>You are on the Guest List</h3>
              <p className={styles.desc}>Welcome to Vedhika Thread Affairs. We will notify you of exclusive weaver collaborations and private collection previews.</p>
            </div>
          ) : (
            <>
              <div className={styles.textBlock}>
                <span className={styles.tag}>Private Access</span>
                <h3 className={styles.title}>Join The Threads Club</h3>
                <p className={styles.desc}>
                  Receive private invitations to new weaver collections, exclusive silk launches, and handloom stories straight from Bhavanipuram, Vijayawada.
                </p>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputWrap}>
                  <Mail size={16} className={styles.mailIcon} />
                  <input
                    type="email"
                    required
                    disabled={status === 'loading'}
                    placeholder="Enter your email for private previews"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className={styles.submitBtn}
                >
                  {status === 'loading' ? 'Requesting...' : 'Request Invitation'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
