import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Main Grid - 4 columns */}
      <div className={styles.main}>
        <div className="container">
          <div className={styles.grid}>
            {/* Col 1: Brand */}
            <div className={styles.brand}>
              <div className={styles.logo}>
                <img src="/images/logo.png" alt="Vedhika" className={styles.logoImg} />
                <div>
                  <div className={styles.logoName}>Vedhika</div>
                  <div className={styles.logoSub}>Thread Affairs</div>
                </div>
              </div>
              <p className={styles.desc}>Celebrating the eternal grace of Indian heritage handlooms. Pure silks, real gold zari, and timeless designs handcrafted by master weavers of India.</p>
              <div className={styles.social}>
                {/* Instagram */}
                <a href="https://www.instagram.com/vedhikathreadaffairs" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                {/* WhatsApp */}
                <a href="https://wa.me/919030496646" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="WhatsApp">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                </a>
                {/* Facebook */}
                <a href="#" className={styles.socialLink} aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              </div>
            </div>

            {/* Col 2: Collections */}
            <div>
              <h4 className={styles.colTitle}>Collections</h4>
              <ul className={styles.links}>
                {[['Kanjeevaram Silk','/shop?fabric=Kanjeevaram Silk'],['Banarasi Brocade','/shop?fabric=Banarasi Silk'],['Organza & Georgette','/shop?fabric=Organza Silk'],['Chanderi Silk','/shop?fabric=Chanderi Silk'],['Linen & Cottons','/shop?fabric=Linen'],['All Sarees','/shop']].map(([label, href]) => (
                  <li key={href}><Link href={href} className={styles.link}>{label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Col 3: Quick Links */}
            <div>
              <h4 className={styles.colTitle}>Quick Links</h4>
              <ul className={styles.links}>
                {[['New Arrivals','/shop?sort=newest'],['Bridal Sarees','/shop?occasion=Wedding'],['Festive Collection','/shop?occasion=Festive'],['Virtual Draping Studio','/draping'],['Wishlist','/wishlist'],['My Cart','/cart']].map(([label, href]) => (
                  <li key={href}><Link href={href} className={styles.link}>{label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Col 4: Contact */}
            <div>
              <h4 className={styles.colTitle}>Visit Our Boutique</h4>
              <div className={styles.contactBlock}>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>📍</span>
                  <span>Lenskart Beside Road, Bhavanipuram,<br/>Vijayawada, AP — 520012</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>📞</span>
                  <a href="tel:+919030496646" className={styles.contactLink}>+91 90304 96646</a>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>✉️</span>
                  <a href="mailto:care@vedhikathreads.com" className={styles.contactLink}>care@vedhikathreads.com</a>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>🕐</span>
                  <span>Mon–Sat: 10am – 8pm</span>
                </div>
              </div>
              <a href="https://wa.me/919030496646" target="_blank" rel="noopener noreferrer" className={styles.whatsappBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copyright}>&copy; {new Date().getFullYear()} Vedhika Thread Affairs. All rights reserved. Made with ❤️ in India.</p>
            <div className={styles.payments}>
              <span className={styles.payIcon}>UPI</span>
              <span className={styles.payIcon}>VISA</span>
              <span className={styles.payIcon}>MC</span>
              <span className={styles.payIcon}>COD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
