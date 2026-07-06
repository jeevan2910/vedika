'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCustomer } from '@/context/CustomerContext';
import { ShoppingBag, Search, Heart, User, LogOut, X, Menu, ChevronDown } from 'lucide-react';
import styles from './Header.module.css';

const NAV_ITEMS = [
  { label: 'New Arrivals', href: '/shop?sort=newest' },
  {
    label: 'Sarees',
    href: '/shop?category=Sarees',
    dropdown: [
      { label: 'Kanjeevaram Silk', href: '/shop?category=Sarees&fabric=Kanjeevaram Silk', desc: 'Pure mulberry silk, gold zari' },
      { label: 'Banarasi Brocade', href: '/shop?category=Sarees&fabric=Banarasi Silk', desc: 'Woven in Varanasi' },
      { label: 'Organza & Georgette', href: '/shop?category=Sarees&fabric=Organza Silk', desc: 'Sheer elegance' },
      { label: 'Chanderi Silk', href: '/shop?category=Sarees&fabric=Chanderi Silk', desc: 'Madhya Pradesh heritage' },
      { label: 'Linen & Cottons', href: '/shop?category=Sarees&fabric=Linen', desc: 'Everyday luxury' },
      { label: 'All Sarees', href: '/shop?category=Sarees', desc: 'Browse full saree collection' },
    ],
  },
  {
    label: 'Kurtis & Sets',
    href: '/shop?category=Kurtis',
    dropdown: [
      { label: 'Short Kurtis', href: '/shop?category=Kurtis&design=Short Kurti', desc: 'Chic everyday short tunics' },
      { label: 'Kurti Sets', href: '/shop?category=Kurtis&design=Kurti Set', desc: 'Premium Kurti with Pants/Palazzos' },
      { label: 'All Kurtis', href: '/shop?category=Kurtis', desc: 'Browse full kurti range' },
    ],
  },
  {
    label: 'Dresses & Lehengas',
    href: '/shop?category=Dresses',
    dropdown: [
      { label: 'Ethnic Dresses', href: '/shop?category=Dresses', desc: 'Flared gowns & Anarkali dresses' },
      { label: 'Designer Lehengas', href: '/shop?category=Lehengas', desc: 'Opulent wedding & festive lehengas' },
    ],
  },
  { label: 'Virtual Studio', href: '/draping' },
];

export default function Header({ onCartOpen, onLoginOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useCart();
  const { customer, logout, isLoggedIn } = useCustomer();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className={styles.announcementBar}>
        <div className={styles.marqueeTrack}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className={styles.marqueeContent}>
              {['Free Shipping on Orders Above ₹5,000', 'Visit our store for more details and collections', '100% Authentic Handwoven Sarees', 'Easy Returns within 7 Days', 'Cash on Delivery Available', 'WhatsApp Support: +91 90304 96646', 'New Arrivals Every Week'].map((item, j) => (
                <span key={j} className={styles.marqueeItem}>
                  <span className={styles.marqueeDot} />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Header Container wrapper */}
      <div className={`${styles.headerWrapper} ${scrolled ? styles.headerWrapperScrolled : ''}`}>
        
        {/* Main Header Row */}
        <header className={styles.header}>
          {/* Mobile Menu Toggle (keep fallback toggle just in case) */}
          <button className={styles.mobileMenuBtn} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <img src="/images/logo.png" alt="Vedhika" className={styles.logoImg} />
            <div className={styles.logoText}>
              <span className={styles.logoName}>Vedhika</span>
              <span className={styles.logoSub}>Thread Affairs</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.nav}>
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className={styles.navItem}
                onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.dropdown ? (
                  <>
                    <Link href={item.href} className={`${styles.navLink} ${pathname.startsWith(item.href) ? styles.navLinkActive : ''}`}>
                      {item.label}
                      <ChevronDown size={13} className={styles.chevron} />
                    </Link>
                    {openDropdown === item.label && (
                      <div className={styles.dropdown}>
                        {item.dropdown.map((d) => (
                          <Link key={d.href} href={d.href} className={styles.dropdownItem}>
                            <span className={styles.dropdownLabel}>{d.label}</span>
                            <span className={styles.dropdownDesc}>{d.desc}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Centered Desktop Search Bar (Myntra-style) */}
          <form onSubmit={handleSearchSubmit} className={styles.desktopSearch}>
            <Search size={16} className={styles.searchIconInline} />
            <input 
              type="text" 
              placeholder="Search for products, brands and more..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.desktopSearchInput}
            />
          </form>

          {/* Right Action Icons */}
          <div className={styles.actions}>
            <Link href="/wishlist" className={styles.iconBtn} aria-label="Wishlist">
              <Heart size={20} />
            </Link>
            <button className={styles.iconBtn} onClick={onCartOpen} aria-label="Cart" style={{ position: 'relative' }}>
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
            </button>

            {isLoggedIn ? (
              <div className={styles.userMenu}>
                <span className={styles.userInfo} title={customer.phone}>
                  Hi, {customer.name || customer.phone.slice(-10)}
                </span>
                <button className={styles.iconBtn} onClick={logout} title="Log Out" aria-label="Log Out" style={{ width: '28px', height: '28px' }}>
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button className={styles.iconBtn} onClick={onLoginOpen} aria-label="Login">
                <User size={20} />
              </button>
            )}
          </div>
        </header>

        {/* Mobile Search Bar Row (Prominent Ajio/Myntra style) */}
        <div className={styles.mobileSearchRow}>
          <form onSubmit={handleSearchSubmit} className={styles.mobileSearchForm}>
            <Search size={16} className={styles.searchIconInline} />
            <input 
              type="text" 
              placeholder="Search for sarees, kurtis, dresses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.mobileSearchInput}
            />
          </form>
        </div>

        {/* Mobile Horizontal scrollable category options (User can see options clearly, no three-dashes menu required!) */}
        <div className={styles.mobileCategoryScroll}>
          {NAV_ITEMS.map((item, idx) => (
            <Link 
              key={idx} 
              href={item.href} 
              className={`${styles.mobileCategoryTab} ${pathname === item.href ? styles.mobileCategoryTabActive : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

      </div>

      {/* Mobile Drawer (Backup/extra menu navigation) */}
      {mobileOpen && (
        <div className={styles.mobileDrawerOverlay} onClick={() => setMobileOpen(false)}>
          <div className={styles.mobileDrawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileDrawerHeader}>
              <span className={styles.logoName} style={{ fontFamily: 'var(--font-serif)' }}>Vedhika Thread Affairs</span>
              <button onClick={() => setMobileOpen(false)} className={styles.iconBtn}><X size={20} /></button>
            </div>
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className={styles.mobileNavItem}>
                {item.dropdown ? (
                  <>
                    <button
                      className={styles.mobileNavLink}
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    >
                      {item.label}
                      <ChevronDown size={14} style={{ transform: openDropdown === item.label ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                    </button>
                    {openDropdown === item.label && (
                      <div className={styles.mobileDropdown}>
                        {item.dropdown.map((d) => (
                          <Link key={d.href} href={d.href} className={styles.mobileDropdownItem}>{d.label}</Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={item.href} className={styles.mobileNavLink}>{item.label}</Link>
                )}
              </div>
            ))}
            <div className={styles.mobileNavFooter}>
              <a href="https://wa.me/919030496646" target="_blank" rel="noopener noreferrer" className="btn-whatsapp" style={{ width: '100%', justifyContent: 'center' }}>
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
