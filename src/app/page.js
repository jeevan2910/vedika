import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import HeroSlider from '@/components/HeroSlider/HeroSlider';
import { Star } from 'lucide-react';
import Newsletter from '@/components/Newsletter/Newsletter';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let featuredProducts = [];
  let newArrivals = [];
  let trendingProducts = [];
  let personalSuggestions = [];

  try {
    const allProducts = await prisma.product.findMany({});
    
    // Sort and partition products dynamically
    newArrivals = allProducts.filter(p => p.isNew).slice(0, 6);
    featuredProducts = allProducts.filter(p => p.featured).slice(0, 4);
    
    // "Trending Now" - products with highest ratings (>= 4.4)
    trendingProducts = allProducts
      .filter(p => p.rating >= 4.4)
      .slice(0, 6);

    // "Personal Suggestions" - dynamic recommended grid
    personalSuggestions = allProducts.slice(0, 8);
  } catch (e) {
    console.error('Failed to load products:', e);
  }

  // Circular Categories Strip (App UI style)
  const quickCategories = [
    { name: 'Kanjeevaram', image: '/images/cat-kanjeevaram.webp', link: '/shop?fabric=Kanjeevaram Silk' },
    { name: 'Banarasi', image: '/images/cat-banarasi.webp', link: '/shop?fabric=Banarasi Silk' },
    { name: 'Linen', image: '/images/cat-linen.webp', link: '/shop?fabric=Linen' },
    { name: 'Organza', image: '/images/cat-organza.webp', link: '/shop?fabric=Organza Silk' },
    { name: 'Kurtis', image: '/images/saree-blue.webp', link: '/shop?category=Kurtis' },
    { name: 'Dresses', image: '/images/saree-gold.webp', link: '/shop?category=Dresses' },
    { name: 'Lehengas', image: '/images/saree-crimson.webp', link: '/shop?category=Lehengas' },
  ];

  // Artisan spotlights craft data
  const artisanSpotlights = [
    { name: 'Jamdani Weave', desc: 'Sheer Mughal Artistry', image: '/images/cat-organza.webp', link: '/shop?category=Sarees&fabric=Organza Silk' },
    { name: 'Kanjeevaram Loom', desc: 'Temple Town Gold Silk', image: '/images/cat-kanjeevaram.webp', link: '/shop?fabric=Kanjeevaram Silk' },
    { name: 'Banarasi Brocade', desc: 'Varanasi Royal Heritage', image: '/images/cat-banarasi.webp', link: '/shop?fabric=Banarasi Silk' },
    { name: 'Ikat Handloom', desc: 'Precision Tied Dyeing', image: '/images/saree-blue.webp', link: '/shop?category=Sarees' },
    { name: 'Linen Weaves', desc: 'Breathable Casual Luxury', image: '/images/cat-linen.webp', link: '/shop?fabric=Linen' },
  ];

  const testimonials = [
    { text: 'Ordered the Mulberry Silk Kanjeevaram for my daughter\'s wedding. Absolutely stunning quality and fast delivery. Highly recommend Vedhika!', name: 'Priya Sharma', city: 'Hyderabad' },
    { text: 'The Banarasi saree was exactly as described. Rich zari work and gorgeous color. Will definitely order again.', name: 'Lakshmi Reddy', city: 'Vijayawada' },
    { text: 'Amazing customer service on WhatsApp. They helped me choose the perfect saree. Pure silk, worth every rupee!', name: 'Meena Iyer', city: 'Chennai' },
  ];

  const renderProductCard = (p) => {
    const productImgs = p.images.split(',').map(s => s.trim()).filter(Boolean);
    const primaryImg = productImgs[0] || '/images/placeholder.webp';
    const secondaryImg = productImgs[1] || null;
    const discountPercent = p.discount || (p.mrp && p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0);

    return (
      <Link href={`/product/${p.id}`} key={p.id} className={styles.myntraProductCard}>
        <div className={styles.myntraImgWrap}>
          {p.isNew && <span className={styles.badgeNew}>NEW</span>}
          {p.stock <= 2 && <span className={styles.badgeUrgency}>ONLY {p.stock} LEFT!</span>}
          
          <img src={primaryImg} alt={p.title} className={styles.myntraProductImg} loading="lazy" />
          {secondaryImg && (
            <img src={secondaryImg} alt={p.title} className={styles.myntraProductImgHover} loading="lazy" />
          )}
          
          {/* Rating Tag overlaying image */}
          <div className={styles.ratingBadge}>
            <span>{p.rating}</span>
            <Star size={10} fill="currentColor" stroke="none" className={styles.starIcon} />
            <span className={styles.ratingDivider}>|</span>
            <span>{p.reviewsCount || 12}</span>
          </div>
        </div>
        
        <div className={styles.myntraProductInfo}>
          <span className={styles.myntraFabric}>{p.fabric}</span>
          <h3 className={styles.myntraTitle}>{p.title}</h3>
          
          <div className={styles.myntraPriceRow}>
            <span className={styles.myntraPrice}>₹{p.price.toLocaleString('en-IN')}</span>
            {p.mrp && p.mrp > p.price && (
              <>
                <span className={styles.myntraMrp}>₹{p.mrp.toLocaleString('en-IN')}</span>
                <span className={styles.myntraDiscount}>({discountPercent}% OFF)</span>
              </>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div style={{ flexGrow: 1, backgroundColor: '#fcfbf9' }}>
      
      {/* Circular Categories Strip (App UI style) */}
      <div className={styles.circularStrip}>
        <div className={styles.circularStripContainer}>
          {quickCategories.map((c, i) => (
            <Link href={c.link} key={i} className={styles.circleItem}>
              <div className={styles.circleImgWrap}>
                <img src={c.image} alt={c.name} className={styles.circleImg} />
              </div>
              <span className={styles.circleLabel}>{c.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <HeroSlider />

      {/* 1. HORIZONTAL CAROUSEL: Trending Now */}
      <section className={`section ${styles.arrivalsSection}`} style={{ padding: '40px 0' }}>
        <div className="container">
          <div className={styles.arrivalsHeader} style={{ marginBottom: '24px' }}>
            <div>
              <span className="section-tag">Hot Sellers</span>
              <h2 className="section-title" style={{ fontSize: '1.8rem' }}>Trending Now</h2>
            </div>
            <Link href="/shop?sort=rating" className="btn-outline-gold" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>View All →</Link>
          </div>
          
          <div className={`${styles.horizontalScrollRow} reveal-on-scroll`}>
            {trendingProducts.map(renderProductCard)}
          </div>
        </div>
      </section>

      {/* 2. HORIZONTAL CAROUSEL: Artisan Spotlights */}
      <section className={`section ${styles.artisanSection}`} style={{ padding: '40px 0', background: '#f5f2eb' }}>
        <div className="container">
          <div className={styles.arrivalsHeader} style={{ marginBottom: '24px' }}>
            <div>
              <span className="section-tag">Craft Spotlights</span>
              <h2 className="section-title" style={{ fontSize: '1.8rem' }}>Artisan Spotlight</h2>
            </div>
          </div>
          
          <div className={`${styles.horizontalScrollRow} reveal-on-scroll`}>
            {artisanSpotlights.map((art, idx) => (
              <Link href={art.link} key={idx} className={styles.artisanCard}>
                <img src={art.image} alt={art.name} className={styles.artisanImg} loading="lazy" />
                <div className={styles.artisanOverlay}>
                  <span className={styles.artisanSub}>Crafted Heritage</span>
                  <h3 className={styles.artisanName}>{art.name}</h3>
                  <p className={styles.artisanDesc}>{art.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Grid */}
      <section className={`section ${styles.arrivalsSection}`} style={{ padding: '40px 0' }}>
        <div className="container">
          <div className={styles.arrivalsHeader} style={{ marginBottom: '24px' }}>
            <div>
              <span className="section-tag">Just In</span>
              <h2 className="section-title" style={{ fontSize: '1.8rem' }}>New Arrivals</h2>
            </div>
            <Link href="/shop?sort=newest" className="btn-outline-gold" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>View All →</Link>
          </div>
          
          <div className={`${styles.arrivalsRow} reveal-on-scroll`}>
            {newArrivals.map(renderProductCard)}
          </div>
        </div>
      </section>

      {/* 3. PERSONAL SUGGESTIONS: Recommended Grid */}
      <section className={`section ${styles.featuredSection}`} style={{ padding: '50px 0' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '32px' }}>
            <span className="section-tag">Custom Curation</span>
            <h2 className="section-title">Personal Suggestions</h2>
            <div className="divider-gold" />
          </div>
          
          <div className={`${styles.suggestionsGrid} reveal-on-scroll`}>
            {personalSuggestions.map(renderProductCard)}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/shop" className="btn-accent" style={{ padding: '12px 28px' }}>Shop Full Catalog →</Link>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className={styles.storySection}>
        <div className={`${styles.storyGrid} reveal-on-scroll`}>
          <div className={styles.storyImage}>
            <img src="/images/saree-gold.webp" alt="Vedhika Heritage" />
          </div>
          <div className={styles.storyContent}>
            <span className="section-tag">Our Story</span>
            <h2 className={styles.storyTitle}>A Small Start With Big Dreams.</h2>
            <p className={styles.storyText}>
              Born in the vibrant city of Vijayawada, Vedhika Thread Affairs is a celebration of India's rich textile heritage. We are a small start with big dreams, working directly with master weavers across Kanchipuram, Varanasi, and Chanderi to bring you authentic, handwoven creations that tell stories of centuries-old artistry.
            </p>
            <p className={styles.storyText}>
              Every thread we source, every motif we preserve, and every drape we deliver carries the soul of Indian weaving tradition. Visit our boutique store beside Lenskart Road in Bhavanipuram, Vijayawada, to explore more details and view our complete, exclusive collections.
            </p>
            <div className={styles.storyStats}>
              <div className={styles.stat}><span className={styles.statNum}>500+</span><span className={styles.statLabel}>Sarees</span></div>
              <div className={styles.stat}><span className={styles.statNum}>100%</span><span className={styles.statLabel}>Authentic</span></div>
              <div className={styles.stat}><span className={styles.statNum}>Est.</span><span className={styles.statLabel}>2026</span></div>
            </div>
            <div className={styles.storyBtns}>
              <Link href="/shop" className="btn-accent">Shop Now</Link>
              <a href="https://wa.me/919030496646" target="_blank" rel="noopener noreferrer" className="btn-secondary">Contact Us</a>
            </div>
          </div>
        </div>
      </section>

      {/* Guest List Lead Capture */}
      <Newsletter />

      {/* Testimonials */}
      <section className={`section ${styles.testimonialsSection}`}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Reviews</span>
            <h2 className="section-title">What Our Customers Say</h2>
            <div className="divider-gold" />
          </div>
          <div className={`${styles.testimonialsGrid} reveal-on-scroll`}>
            {testimonials.map((t, i) => (
              <div key={i} className={styles.testimonialCard}>
                <div className={styles.stars}>★★★★★</div>
                <p className={styles.quote}>"{t.text}"</p>
                <div className={styles.reviewer}>
                  <span className={styles.reviewerName}>{t.name}</span>
                  <span className={styles.reviewerCity}>{t.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className={styles.trustStrip}>
        <div className="container">
          <div className={styles.trustGrid}>
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹5,000' },
              { icon: '↩', title: 'Easy Returns', desc: '7-day return policy' },
              { icon: '✓', title: '100% Authentic', desc: 'Handwoven certified' },
              { icon: '💬', title: 'WhatsApp Support', desc: '+91 90304 96646' },
            ].map((t, i) => (
              <div key={i} className={styles.trustItem}>
                <span className={styles.trustIcon}>{t.icon}</span>
                <div>
                  <span className={styles.trustTitle}>{t.title}</span>
                  <span className={styles.trustDesc}>{t.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
