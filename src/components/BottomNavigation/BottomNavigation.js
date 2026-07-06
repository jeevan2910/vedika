'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCustomer } from '@/context/CustomerContext';
import { Home, Grid, Heart, ShoppingBag, User } from 'lucide-react';
import styles from './BottomNavigation.module.css';

export default function BottomNavigation({ onCartOpen, onLoginOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useCart();
  const { isLoggedIn, customer } = useCustomer();

  const handleProfileClick = () => {
    if (isLoggedIn) {
      router.push('/admin'); // Redirect logged in customers or admins to dashboard/admin portal
    } else {
      onLoginOpen();
    }
  };

  return (
    <div className={styles.navBar}>
      <Link href="/" className={`${styles.navItem} ${pathname === '/' ? styles.active : ''}`}>
        <Home size={20} />
        <span className={styles.label}>Home</span>
      </Link>
      
      <Link href="/shop" className={`${styles.navItem} ${pathname === '/shop' ? styles.active : ''}`}>
        <Grid size={20} />
        <span className={styles.label}>Categories</span>
      </Link>

      <Link href="/wishlist" className={`${styles.navItem} ${pathname === '/wishlist' ? styles.active : ''}`}>
        <Heart size={20} />
        <span className={styles.label}>Wishlist</span>
      </Link>

      <button onClick={onCartOpen} className={styles.navItemButton}>
        <div className={styles.iconWrap}>
          <ShoppingBag size={20} />
          {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
        </div>
        <span className={styles.label}>Bag</span>
      </button>

      <button onClick={handleProfileClick} className={styles.navItemButton}>
        <User size={20} />
        <span className={styles.label}>
          {isLoggedIn ? (customer?.name ? customer.name.split(' ')[0] : 'Profile') : 'Profile'}
        </span>
      </button>
    </div>
  );
}
