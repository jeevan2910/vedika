'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import styles from './wishlist.module.css';

export default function WishlistPage() {
  const { wishlist, toggle } = useWishlist();

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <Heart size={24} color="var(--accent)" />
          <h1 className={styles.title}>My Wishlist</h1>
          <span className={styles.count}>{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</span>
        </div>

        {wishlist.length === 0 ? (
          <div className={styles.empty}>
            <Heart size={56} strokeWidth={1} color="var(--text-light)" />
            <h2 className={styles.emptyTitle}>Your wishlist is empty</h2>
            <p className={styles.emptyText}>Save your favourite sarees and come back to them anytime</p>
            <Link href="/shop" className="btn-accent" style={{ marginTop: '24px' }}>
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {wishlist.map((p) => (
              <div key={p.id} className={styles.card}>
                <Link href={`/product/${p.id}`} className={styles.imgWrap}>
                  <img src={p.images?.split(',')[0] || p.image} alt={p.title} className={styles.img} />
                </Link>
                <div className={styles.info}>
                  <span className={styles.fabric}>{p.fabric}</span>
                  <Link href={`/product/${p.id}`} className={styles.name}>{p.title}</Link>
                  <span className={styles.price}>₹{p.price?.toLocaleString('en-IN')}</span>
                  <div className={styles.actions}>
                    <Link href={`/product/${p.id}`} className={styles.viewBtn}>
                      <ShoppingBag size={14} /> View
                    </Link>
                    <button className={styles.removeBtn} onClick={() => toggle(p)}>
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
