import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import HeroSlider from '@/components/HeroSlider/HeroSlider';
import { Star } from 'lucide-react';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let featuredProducts = [];
  let newArrivals = [];
  try {
    featuredProducts = await prisma.product.findMany({ where: { featured: true }, take: 4 });
    newArrivals = await prisma.product.findMany({ where: { isNew: true }, take: 6, orderBy: { createdAt: 'desc' } });
  } catch (e) {
    console.error('Failed to load products:', e);
  }

  // Circular App Category items
  const quickCategories = [
    { name: 'Kanjeevaram', image: '/images/cat-kanjeevaram.webp', link: '/shop?fabric=Kanjeevaram Silk' },
    { name: 'Banarasi', image: '/images/cat-banarasi.webp', link: '/shop?fabric=Banarasi Silk' },
    { name: 'Linen', image: '/images/cat-linen.webp', link: '/shop?fabric=Linen' },
    { name: 'Organza', image: '/images/cat-organza.webp', link: '/shop?fabric=Organza Silk' },
    { name: 'Kurtis', image: '/images/saree-blue.webp', link: '/shop?category=Kurtis' },
    { name: 'Dresses', image: '/images/saree-gold.webp', link: '/shop?category=Dresses' },
    { name: 'Lehengas', image: '/images/saree-crimson.webp', link: '/shop?category=Lehengas' },
  ];

  const categories = [
    { name: 'Kanjeevaram Silk', desc: 'Pure Mulberry Silk, Real Gold Zari', image: '/images/cat-kanjeevaram.webp', link: '/shop?fabric=Kanjeevaram Silk' },
    { name: 'Banarasi Brocade', desc: 'Woven in the Heart of Varanasi', image: '/images/cat-banarasi.webp', link: '/shop?fabric=Banarasi Silk' },
    { name: 'Linen & Cottons', desc: 'Breathable Everyday Elegance', image: '/images/cat-linen.webp', link: '/shop?fabric=Linen' },
    { name: 'Organza & Georgette', desc: 'Sheer Grace, Timeless Beauty', image: '/images/cat-organza.webp', link: '/shop?fabric=Organza Silk' },
  ];

  const testimonials = [
    { text: 'Ordered the Mulberry Silk Kanjeevaram for my daughter\'s wedding. Absolutely stunning quality and fast delivery. Highly recommend Vedhika!', name: 'Priya Sharma', city: 'Hyderabad' },
    { text: 'The Banarasi saree was exactly as described. Rich zari work and gorgeous color. Will definitely order again.', name: 'Lakshmi Reddy', city: 'Vijayawada' },
    { text: 'Amazing customer service on WhatsApp. They helped me choose the perfect saree. Pure silk, worth every rupee!', name: 'Meena Iyer', city: 'Chennai' },
  ];

  const banners = [
    { title: 'Bridal Kanjeevaram', image: '/images/saree-crimson.webp', link: '/shop?fabric=Kanjeevaram Silk' },
    { title: 'Gold Banarasi', image: '/images/saree-gold.webp', link: '/shop?fabric=Banarasi Silk' },
    { title: 'Everyday Linen', image: '/images/cat-linen.webp', link: '/shop?fabric=Linen' },
  ];

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

      {/* Categories Grid */}
      <section className={`section ${styles.categoriesSection}`} style={{ padding: '40px 0' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '32px' }}>
            <span className="section-tag">Shop by Category</span>
            <h2 className="section-title">Curated Heritage Collections</h2>
            <div className="divider-gold" />
          </div>
          <div className={styles.categoriesGrid}>
            {categories.map((cat, i) => (
              <Link href={cat.link} key={i} className={styles.categoryCard}>
                <img src={cat.image} alt={cat.name} className={styles.categoryImg} loading="lazy" />
                <div className={styles.categoryOverlay}>
                  <h3 className={styles.categoryName}>{cat.name}</h3>
                  <p className={styles.categoryDesc}>{cat.desc}</p>
                  <span className={styles.categoryBtn}>Explore →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals (Horizontal Scroll Card List) */}
      <section className={`section ${styles.arrivalsSection}`} style={{ padding: '40px 0' }}>
        <div className="container">
          <div className={styles.arrivalsHeader} style={{ marginBottom: '24px' }}>
            <div>
              <span className="section-tag">Just In</span>
              <h2 className="section-title" style={{ fontSize: '1.8rem' }}>New Arrivals</h2>
            </div>
            <Link href="/shop?sort=newest" className="btn-outline-gold" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>View All →</Link>
          </div>
          
          <div className={styles.arrivalsRow}>
            {newArrivals.map((p) => (
              <Link href={`/product/${p.id}`} key={p.id} className={styles.myntraProductCard}>
                <div className={styles.myntraImgWrap}>
                  <span className={styles.badgeNew}>NEW</span>
                  <img src={p.images.split(',')[0]} alt={p.title} className={styles.myntraProductImg} loading="lazy" />
                  
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
                        <span className={styles.myntraDiscount}>({p.discount || Math.round(((p.mrp - p.price) / p.mrp) * 100)}% OFF)</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className={`section ${styles.featuredSection}`} style={{ padding: '50px 0' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '32px' }}>
            <span className="section-tag">Handpicked</span>
            <h2 className="section-title">Featured Collection</h2>
            <div className="divider-gold" />
          </div>
          
          <div className={styles.myntraFeaturedGrid}>
            {featuredProducts.map((p) => (
              <Link href={`/product/${p.id}`} key={p.id} className={styles.myntraProductCard}>
                <div className={styles.myntraImgWrap}>
                  <span className={styles.productTag}>{p.category}</span>
                  <img src={p.images.split(',')[0]} alt={p.title} className={styles.myntraProductImg} loading="lazy" />
                  
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
                        <span className={styles.myntraDiscount}>({p.discount || Math.round(((p.mrp - p.price) / p.mrp) * 100)}% OFF)</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/shop" className="btn-accent" style={{ padding: '12px 28px' }}>Shop the Collection →</Link>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className={styles.storySection}>
        <div className={styles.storyGrid}>
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

      {/* Collection Banners */}
      <section className={`section ${styles.bannersSection}`}>
        <div className="container">
          <div className={styles.bannersRow}>
            {banners.map((b, i) => (
              <Link href={b.link} key={i} className={styles.banner}>
                <img src={b.image} alt={b.title} className={styles.bannerImg} loading="lazy" />
                <div className={styles.bannerOverlay}>
                  <h3 className={styles.bannerTitle}>{b.title}</h3>
                  <span className={styles.bannerLink}>Explore Collection →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`section ${styles.testimonialsSection}`}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Reviews</span>
            <h2 className="section-title">What Our Customers Say</h2>
            <div className="divider-gold" />
          </div>
          <div className={styles.testimonialsGrid}>
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
