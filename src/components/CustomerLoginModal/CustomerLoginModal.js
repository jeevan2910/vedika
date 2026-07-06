'use client';

import React, { useState } from 'react';
import { useCustomer } from '@/context/CustomerContext';
import { X, Phone, User, CheckCircle2 } from 'lucide-react';
import styles from './CustomerLoginModal.module.css';

export default function CustomerLoginModal({ open, onClose }) {
  const { login, preventClose } = useCustomer();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name) {
      setError('Full Name is required');
      setLoading(false);
      return;
    }

    if (!phone) {
      setError('Phone number is required');
      setLoading(false);
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      setLoading(false);
      return;
    }

    const res = await login(cleanPhone, name);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPhone('');
        setName('');
        onClose();
      }, 1500);
    } else {
      setError(res.error || 'Failed to login');
    }
  };

  return (
    <>
      <div className={styles.overlay} onClick={() => !preventClose && onClose()} />
      <div className={styles.modal}>
        {!preventClose && (
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        )}

        {success ? (
          <div className={styles.successBlock}>
            <CheckCircle2 size={48} color="#ab8c52" className={styles.successIcon} />
            <h3 className={styles.modalTitle}>Welcome to Vedhika</h3>
            <p className={styles.successText}>Logged in successfully using your phone number!</p>
          </div>
        ) : (
          <div className={styles.formBlock}>
            <div className={styles.logoCircle}>🧵</div>
            <h3 className={styles.modalTitle}>Unlock Exclusive Access</h3>
            <p className={styles.modalSubtitle}>Join Vedhika Thread Affairs to view our exclusive handloom collection</p>

            {error && <div className={styles.errorAlert}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name *</label>
                <div className={styles.inputWrap}>
                  <User size={16} className={styles.inputIcon} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
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
                {loading ? 'Unlocking...' : 'Unlock Exclusive Collection'}
              </button>
            </form>
            <p className={styles.note}>We respect your privacy. Your phone number is saved securely in our database.</p>
          </div>
        )}
      </div>
    </>
  );
}
