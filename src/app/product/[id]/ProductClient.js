'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCustomer } from '@/context/CustomerContext';
import { Heart, ShoppingBag, Truck, RefreshCw, Shield, MessageCircle, ChevronDown, Star, Minus, Plus, Lock, Award } from 'lucide-react';
import styles from '../product-detail.module.css';

export default function ProductClient({ product, relatedProducts = [] }) {
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { customer } = useCustomer();
  const images = product.images?.split(',').map(s => s.trim()).filter(Boolean) || [];
  const [mainImage, setMainImage] = useState(images[0] || '/images/placeholder.webp');
  const isSaree = product.category?.toLowerCase() === 'sarees';
  const sizeOptions = product.sizes ? product.sizes.split(',').map(s => s.trim()) : ['S', 'M', 'L', 'XL', 'XXL'];
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0] || 'M');
  const [blouseStyle, setBlouseStyle] = useState('Without Blouse');
  const [quantity, setQuantity] = useState(1);
  const [openTab, setOpenTab] = useState('description');
  const [addedMsg, setAddedMsg] = useState('');
  const wishlisted = isWishlisted(product.id);

  useEffect(() => {
    if (!customer || !product) return;

    const reportBrowseActivity = async () => {
      try {
        await fetch('/api/abandoned-sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: customer.phone,
            name: customer.name,
            productTitle: product.title,
            productId: product.id,
            productImage: product.images?.split(',')[0] || '/images/placeholder.webp'
          })
        });
      } catch (err) {
        console.error('Failed to log browse tracking:', err);
      }
    };

    reportBrowseActivity();
  }, [customer, product]);

  const blouseOptions = [
    { label: 'Without Blouse', extra: 0 },
    { label: 'Unstitched Blouse', extra: 0 },
    { label: 'Readymade Blouse (+₹500)', extra: 500 },
  ];

  const selectedBlouse = blouseOptions.find(b => b.label === blouseStyle) || blouseOptions[0];
  const finalPrice = isSaree ? (product.price + selectedBlouse.extra) : product.price;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: finalPrice,
      image: images[0],
      blouseStyle: isSaree ? blouseStyle : `Size: ${selectedSize}`,
      quantity
    });
    setAddedMsg('Added to bag!');
    setTimeout(() => setAddedMsg(''), 2000);
  };

  const tabs = [
    { key: 'description', label: 'Description' },
    { key: 'care', label: 'Care Instructions' },
    { key: 'shipping', label: 'Shipping & Returns' },
  ];

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / <span>{product.title}</span>
        </nav>

        <div className={styles.productGrid}>
          {/* LEFT: Gallery */}
          <div className={styles.gallery}>
            <div className={styles.mainImageWrap}>
              {product.isNew && <span className="badge-new">NEW</span>}
              {product.discount && <span className={styles.discountBadge}>{product.discount}% OFF</span>}
              <button className={`${styles.heartBtn} ${wishlisted ? styles.heartActive : ''}`} onClick={() => toggle(product)}>
                <Heart size={20} fill={wishlisted ? '#d32f2f' : 'none'} />
              </button>
              <img src={mainImage} alt={product.title} className={styles.mainImage} />
            </div>
            {images.length > 1 && (
              <div className={styles.thumbs}>
                {images.map((img, i) => (
                  <button key={i} className={`${styles.thumb} ${mainImage === img ? styles.thumbActive : ''}`} onClick={() => setMainImage(img)}>
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Details */}
          <div className={styles.details}>
            <span className={styles.fabricTag}>{product.fabric}</span>
            <h1 className={styles.title}>{product.title}</h1>

            <div className={styles.ratingRow}>
              <div className={styles.stars}>
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= Math.round(product.rating) ? '#ab8c52' : 'none'} color="#ab8c52" />)}
              </div>
              <span className={styles.ratingText}>{product.rating} ({product.reviewsCount} reviews)</span>
            </div>

            <div className={styles.priceBlock}>
              <span className={styles.price}>₹{finalPrice.toLocaleString('en-IN')}</span>
              {product.mrp && product.mrp > product.price && (
                <>
                  <span className={styles.mrp}>₹{product.mrp.toLocaleString('en-IN')}</span>
                  <span className={styles.discount}>{product.discount}% off</span>
                </>
              )}
            </div>
            <p className={styles.taxNote}>Inclusive of all taxes</p>

            {isSaree ? (
              /* Blouse Option */
              <div className={styles.optionGroup}>
                <span className={styles.optionLabel}>Blouse Option</span>
                <div className={styles.optionBtns}>
                  {blouseOptions.map(b => (
                    <button key={b.label} className={`${styles.optionBtn} ${blouseStyle === b.label ? styles.optionBtnActive : ''}`} onClick={() => setBlouseStyle(b.label)}>
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Clothes Sizes */
              <div className={styles.optionGroup}>
                <span className={styles.optionLabel}>Select Size</span>
                <div className={styles.optionBtns}>
                  {sizeOptions.map(sz => (
                    <button key={sz} className={`${styles.optionBtn} ${selectedSize === sz ? styles.optionBtnActive : ''}`} onClick={() => setSelectedSize(sz)}>
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className={styles.optionGroup}>
              <span className={styles.optionLabel}>Quantity</span>
              <div className={styles.qtyRow}>
                <button className={styles.qtyBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}><Minus size={14} /></button>
                <span className={styles.qtyNum}>{quantity}</span>
                <button className={styles.qtyBtn} onClick={() => setQuantity(quantity + 1)}><Plus size={14} /></button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className={styles.ctaRow}>
              <button onClick={handleAddToCart} className={styles.addToCartBtn}>
                <ShoppingBag size={18} /> Add to Bag
              </button>
              <a href={`https://wa.me/919030496646?text=Hi, I'm interested in ${product.title} (₹${product.price.toLocaleString('en-IN')})`} target="_blank" rel="noopener noreferrer" className={styles.whatsappBtn}>
                <MessageCircle size={18} /> Chat to Order
              </a>
            </div>
            {addedMsg && <p className={styles.addedMsg}>✓ {addedMsg}</p>}

            {/* Trust Icons */}
            <div className={styles.trustRow}>
              <div className={styles.trustItem}><Shield size={16} /> <span>100% Authentic Handloom</span></div>
              <div className={styles.trustItem}><Award size={16} /> <span>Artisan Certified</span></div>
              <div className={styles.trustItem}><Lock size={16} /> <span>Secure Checkout</span></div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              {tabs.map(t => (
                <button key={t.key} className={`${styles.tab} ${openTab === t.key ? styles.tabActive : ''}`} onClick={() => setOpenTab(openTab === t.key ? null : t.key)}>
                  {t.label} <ChevronDown size={14} style={{ transform: openTab === t.key ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                </button>
              ))}
            </div>

            {openTab === 'description' && (
              <div className={styles.tabContent}>
                <p>{product.description}</p>
                {product.design && <p><strong>{isSaree ? 'Design' : 'Style'}:</strong> {product.design}</p>}
                {isSaree && product.borderType && <p><strong>Border:</strong> {product.borderType}</p>}
                {isSaree && product.zari && <p><strong>Zari:</strong> {product.zari}</p>}
                {product.sizes && <p><strong>{isSaree ? 'Available Lengths' : 'Available Sizes'}:</strong> {product.sizes}</p>}
              </div>
            )}
            {openTab === 'care' && (
              <div className={styles.tabContent}>
                <p>• Dry clean recommended for first wash</p>
                <p>• Store in muslin cloth to preserve fabric</p>
                <p>• Avoid direct sunlight for extended periods</p>
                <p>• Iron on low heat — use a pressing cloth</p>
              </div>
            )}
            {openTab === 'shipping' && (
              <div className={styles.tabContent}>
                <p>• Free shipping on orders above ₹5,000</p>
                <p>• Delivery within 5-7 business days</p>
                <p>• Cash on Delivery available</p>
                <p>• 7-day easy return policy</p>
                <p>• For immediate assistance, WhatsApp us at +91 90304 96646</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>You May Also Like</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map(p => (
                <Link href={`/product/${p.id}`} key={p.id} className={styles.relatedCard}>
                  <div className={styles.relatedImgWrap}>
                    <img src={p.images.split(',')[0]} alt={p.title} className={styles.relatedImg} />
                  </div>
                  <div className={styles.relatedInfo}>
                    <span className={styles.relatedFabric}>{p.fabric}</span>
                    <h3 className={styles.relatedName}>{p.title}</h3>
                    <span className={styles.relatedPrice}>₹{p.price.toLocaleString('en-IN')}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
