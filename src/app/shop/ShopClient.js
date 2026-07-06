'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Minus, RotateCcw, Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import styles from './shop.module.css';
import pageStyles from '../page.module.css';

// Accordion Filter Group Component
function FilterAccordion({ label, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.accordion}>
      <button
        className={styles.accordionHeader}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className={styles.accordionLabel}>{label}</span>
        {open ? <Minus size={16} strokeWidth={1.5} /> : <Plus size={16} strokeWidth={1.5} />}
      </button>
      {open && <div className={styles.accordionBody}>{children}</div>}
    </div>
  );
}

export default function ShopClient({ initialProducts }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { toggle, isWishlisted } = useWishlist();

  // Read current filters from URL
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedFabric = searchParams.get('fabric') || 'all';
  const selectedOccasion = searchParams.get('occasion') || 'all';
  const selectedColor = searchParams.get('color') || 'all';
  const selectedSort = searchParams.get('sort') || 'newest';
  const selectedPrice = searchParams.get('price') || 'all';
  const selectedDesign = searchParams.get('design') || 'all';
  const selectedBorder = searchParams.get('border') || 'all';
  const selectedBlouse = searchParams.get('blouse') || 'all';
  const selectedZari = searchParams.get('zari') || 'all';
  const selectedFamily = searchParams.get('family') || 'all';

  // Client-side search query state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync client-side search query with URL changes (for header search submissions)
  React.useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  // Filter options
  const categoriesList = ['Sarees', 'Kurtis', 'Dresses', 'Lehengas'];
  const fabrics = [
    'Kanjeevaram Silk', 'Banarasi Silk', 'Organza Silk', 'Linen',
    'Georgette', 'Chanderi Silk', 'Cotton', 'Chiffon', 'Crepe', 'Net', 'Munga Tussar'
  ];
  const occasions = ['Wedding', 'Festive', 'Party', 'Casual', 'Office Wear'];
  const colors = [
    { name: 'Red', hex: '#A62B2B' },
    { name: 'Gold', hex: '#D4AF37' },
    { name: 'Purple', hex: '#5E2B74' },
    { name: 'Green', hex: '#2A5D3F' },
    { name: 'Ivory', hex: '#FAF9F5' },
    { name: 'Blue', hex: '#1C3F6E' },
    { name: 'Pink', hex: '#E07A8B' },
    { name: 'Orange', hex: '#D96B27' },
    { name: 'Yellow', hex: '#E5B842' },
    { name: 'Black', hex: '#111111' },
    { name: 'Peach', hex: '#F8C39E' },
    { name: 'Brown', hex: '#7B4F2E' },
    { name: 'Maroon', hex: '#6B1823' }
  ];
  const colorFamilies = ['pastel', 'bright', 'dark', 'earthy', 'jewel', 'muted', 'metallic', 'neon', 'neutral'];
  const designs = ['Abstract', 'All Over Design', 'Border Highlight', 'Butti', 'Checks', 'Floral', 'Geometric', 'Jaal', 'Minimal', 'Paisley', 'Stripes', 'Temple', 'Short Kurti', 'Kurti Set'];
  const borderTypes = ['Contrast Border', 'Cut Work Border', 'Heavy Border', 'No Border', 'Piping Border', 'Self Border', 'Woven Border', 'Zari Border'];
  const blouseTypes = ['Full Sleeves', 'Half Sleeves', 'Sleeveless', 'Readymade Blouse', 'Running Blouse', 'Without Blouse'];
  const zariOptions = ['Gold Zari', 'Silver Zari', 'Copper Zari', 'Antique Zari', 'No Zari'];

  // Occasion circle icons
  const occasionCircles = [
    { name: 'Wedding', image: '/images/cat-kanjeevaram.webp' },
    { name: 'Festive', image: '/images/cat-banarasi.webp' },
    { name: 'Party', image: '/images/cat-organza.webp' },
    { name: 'Casual', image: '/images/cat-linen.webp' }
  ];

  // URL filter updater
  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all' || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasActiveFilters =
    selectedCategory !== 'all' || selectedFabric !== 'all' || selectedOccasion !== 'all' || selectedColor !== 'all' ||
    selectedPrice !== 'all' || selectedDesign !== 'all' || selectedBorder !== 'all' ||
    selectedBlouse !== 'all' || selectedZari !== 'all' || selectedFamily !== 'all' || searchQuery !== '';

  // Client-side filtering & sorting
  const getFilteredAndSortedProducts = () => {
    let items = [...initialProducts];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      items = items.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedFabric !== 'all') {
      items = items.filter((p) => p.fabric?.toLowerCase() === selectedFabric.toLowerCase());
    }

    if (selectedOccasion !== 'all') {
      items = items.filter((p) => p.occasion?.toLowerCase() === selectedOccasion.toLowerCase());
    }

    if (selectedColor !== 'all') {
      items = items.filter((p) => p.color?.toLowerCase() === selectedColor.toLowerCase());
    }

    if (selectedDesign !== 'all') {
      items = items.filter((p) => p.design?.toLowerCase() === selectedDesign.toLowerCase());
    }

    if (selectedBorder !== 'all') {
      items = items.filter((p) => p.borderType?.toLowerCase() === selectedBorder.toLowerCase());
    }

    if (selectedBlouse !== 'all') {
      items = items.filter((p) => p.blouseType?.toLowerCase() === selectedBlouse.toLowerCase());
    }

    if (selectedZari !== 'all') {
      items = items.filter((p) => p.zari?.toLowerCase() === selectedZari.toLowerCase());
    }

    if (selectedFamily !== 'all') {
      items = items.filter((p) => p.colorFamily?.toLowerCase() === selectedFamily.toLowerCase());
    }

    if (selectedPrice !== 'all') {
      if (selectedPrice === 'under-5k') items = items.filter((p) => p.price < 5000);
      else if (selectedPrice === '5k-10k') items = items.filter((p) => p.price >= 5000 && p.price <= 10000);
      else if (selectedPrice === '10k-15k') items = items.filter((p) => p.price >= 10000 && p.price <= 15000);
      else if (selectedPrice === 'above-15k') items = items.filter((p) => p.price > 15000);
    }

    if (selectedSort === 'price-low') items.sort((a, b) => a.price - b.price);
    else if (selectedSort === 'price-high') items.sort((a, b) => b.price - a.price);
    else if (selectedSort === 'rating') items.sort((a, b) => b.rating - a.rating);

    return items;
  };

  const sortedProducts = getFilteredAndSortedProducts();

  const SidebarContent = () => {
    const isKurtis = selectedCategory.toLowerCase() === 'kurtis';
    const isSarees = selectedCategory.toLowerCase() === 'sarees' || selectedCategory === 'all';
    const isDresses = selectedCategory.toLowerCase() === 'dresses';

    return (
      <div className={styles.sidebarInner}>
        <div className={styles.sidebarHeader}>
          <h3 className={styles.sidebarTitle}>Filters</h3>
          {hasActiveFilters && (
            <button className={styles.clearBtn} onClick={clearAllFilters}>
              <RotateCcw size={12} /> Clear All
            </button>
          )}
        </div>

        {/* Search */}
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Category */}
        <FilterAccordion label="Category" defaultOpen={true}>
          {['all', 'Sarees', 'Kurtis', 'Dresses', 'Lehengas'].map((cat) => (
            <label key={cat} className={styles.checkRow}>
              <input
                type="checkbox"
                checked={selectedCategory.toLowerCase() === cat.toLowerCase()}
                onChange={() => updateFilter('category', selectedCategory.toLowerCase() === cat.toLowerCase() ? 'all' : cat)}
                className={styles.checkInput}
              />
              <span className={styles.checkLabel}>{cat === 'all' ? 'All Collections' : cat}</span>
            </label>
          ))}
        </FilterAccordion>

        {/* Price */}
        <FilterAccordion label="Price" defaultOpen={true}>
          {['all', 'under-5k', '5k-10k', '10k-15k', 'above-15k'].map((val) => (
            <label key={val} className={styles.checkRow}>
              <input
                type="radio"
                name="price"
                checked={selectedPrice === val}
                onChange={() => updateFilter('price', val)}
                className={styles.radioInput}
              />
              <span className={styles.checkLabel}>
                {val === 'all' ? 'All Prices' : val === 'under-5k' ? 'Under ₹5,000' : val === '5k-10k' ? '₹5,000 – ₹10,000' : val === '10k-15k' ? '₹10,000 – ₹15,000' : 'Above ₹15,000'}
              </span>
            </label>
          ))}
        </FilterAccordion>

        {/* Material */}
        <FilterAccordion label="Material" defaultOpen={true}>
          {(isKurtis ? ['Cotton', 'Silk', 'Linen', 'Georgette'] : fabrics).map((fabric) => (
            <label key={fabric} className={styles.checkRow}>
              <input
                type="checkbox"
                checked={selectedFabric === fabric}
                onChange={() => updateFilter('fabric', selectedFabric === fabric ? 'all' : fabric)}
                className={styles.checkInput}
              />
              <span className={styles.checkLabel}>{fabric}</span>
            </label>
          ))}
        </FilterAccordion>

        {/* Kurti Styles (if Kurtis is selected) */}
        {isKurtis && (
          <FilterAccordion label="Kurti Style" defaultOpen={true}>
            {['Short Kurti', 'Kurti Set'].map((style) => (
              <label key={style} className={styles.checkRow}>
                <input
                  type="checkbox"
                  checked={selectedDesign === style}
                  onChange={() => updateFilter('design', selectedDesign === style ? 'all' : style)}
                  className={styles.checkInput}
                />
                <span className={styles.checkLabel}>{style}</span>
              </label>
            ))}
          </FilterAccordion>
        )}

        {/* Saree Designs (if Sarees or All is selected) */}
        {!isKurtis && (
          <FilterAccordion label="Design Style" defaultOpen={false}>
            {designs.filter(d => d !== 'Short Kurti' && d !== 'Kurti Set').map((d) => (
              <label key={d} className={styles.checkRow}>
                <input
                  type="checkbox"
                  checked={selectedDesign === d}
                  onChange={() => updateFilter('design', selectedDesign === d ? 'all' : d)}
                  className={styles.checkInput}
                />
                <span className={styles.checkLabel}>{d}</span>
              </label>
            ))}
          </FilterAccordion>
        )}

        {/* Saree Specific Filters */}
        {isSarees && (
          <>
            {/* Border Type */}
            <FilterAccordion label="Border Type" defaultOpen={false}>
              {borderTypes.map((b) => (
                <label key={b} className={styles.checkRow}>
                  <input
                    type="checkbox"
                    checked={selectedBorder === b}
                    onChange={() => updateFilter('border', selectedBorder === b ? 'all' : b)}
                    className={styles.checkInput}
                  />
                  <span className={styles.checkLabel}>{b}</span>
                </label>
              ))}
            </FilterAccordion>

            {/* Blouse Type */}
            <FilterAccordion label="Blouse Type" defaultOpen={false}>
              {blouseTypes.map((bl) => (
                <label key={bl} className={styles.checkRow}>
                  <input
                    type="checkbox"
                    checked={selectedBlouse === bl}
                    onChange={() => updateFilter('blouse', selectedBlouse === bl ? 'all' : bl)}
                    className={styles.checkInput}
                  />
                  <span className={styles.checkLabel}>{bl}</span>
                </label>
              ))}
            </FilterAccordion>

            {/* Zari */}
            <FilterAccordion label="Zari Weave" defaultOpen={false}>
              {zariOptions.map((z) => (
                <label key={z} className={styles.checkRow}>
                  <input
                    type="checkbox"
                    checked={selectedZari === z}
                    onChange={() => updateFilter('zari', selectedZari === z ? 'all' : z)}
                    className={styles.checkInput}
                  />
                  <span className={styles.checkLabel}>{z}</span>
                </label>
              ))}
            </FilterAccordion>
          </>
        )}

        {/* Color Swatches */}
        <FilterAccordion label="Color" defaultOpen={false}>
          <div className={styles.swatchGrid}>
            <div
              className={`${styles.swatch} ${selectedColor === 'all' ? styles.activeSwatch : ''}`}
              style={{ background: 'conic-gradient(red, orange, yellow, green, blue, purple, red)' }}
              onClick={() => updateFilter('color', 'all')}
              title="All"
            />
            {colors.map((color) => (
              <div
                key={color.name}
                className={`${styles.swatch} ${selectedColor === color.name ? styles.activeSwatch : ''}`}
                style={{ backgroundColor: color.hex, border: color.name === 'Ivory' ? '1px solid #ccc' : 'none' }}
                onClick={() => updateFilter('color', color.name)}
                title={color.name}
              />
            ))}
          </div>
        </FilterAccordion>

        {/* Color Family */}
        <FilterAccordion label="Color Family" defaultOpen={false}>
          {colorFamilies.map((fam) => (
            <label key={fam} className={styles.checkRow}>
              <input
                type="checkbox"
                checked={selectedFamily === fam}
                onChange={() => updateFilter('family', selectedFamily === fam ? 'all' : fam)}
                className={styles.checkInput}
              />
              <span className={styles.checkLabel}>{fam}</span>
            </label>
          ))}
        </FilterAccordion>

        {/* Occasion */}
        <FilterAccordion label="Occasion" defaultOpen={false}>
          {occasions.map((occ) => (
            <label key={occ} className={styles.checkRow}>
              <input
                type="checkbox"
                checked={selectedOccasion === occ}
                onChange={() => updateFilter('occasion', selectedOccasion === occ ? 'all' : occ)}
                className={styles.checkInput}
              />
              <span className={styles.checkLabel}>{occ}</span>
            </label>
          ))}
        </FilterAccordion>
      </div>
    );
  };

  return (
    <div className={styles.shopContainer}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>The Weaving Catalog</h1>
          <p className={styles.subtitle}>Browse through our collection of premium handwoven sarees</p>
        </div>

        {/* Shop By Occasion Circle Navigation */}
        <div className={styles.occasionsRow}>
          <div
            className={`${styles.occasionCircle} ${selectedOccasion === 'all' ? styles.activeOccasion : ''}`}
            onClick={() => updateFilter('occasion', 'all')}
          >
            <div className={styles.circle}>
              <div style={{ fontStyle: 'italic', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>All</div>
            </div>
            <span className={styles.circleName}>All Sarees</span>
          </div>
          {occasionCircles.map((occ, idx) => (
            <div
              key={idx}
              className={`${styles.occasionCircle} ${selectedOccasion === occ.name ? styles.activeOccasion : ''}`}
              onClick={() => updateFilter('occasion', occ.name)}
            >
              <div className={styles.circle}>
                <img src={occ.image} alt={occ.name} className={styles.circleImg} />
              </div>
              <span className={styles.circleName}>{occ.name}</span>
            </div>
          ))}
        </div>

        {/* Mobile Filter Toggle */}
        <div className={styles.mobileFilterBar}>
          <button className={styles.mobileFilterBtn} onClick={() => setSidebarOpen(true)}>
            <span>Filters</span>
            {hasActiveFilters && <span className={styles.filterBadge} />}
          </button>
          <select
            value={selectedSort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className={styles.sortSelect}
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>

        {/* Mobile Filter Drawer Overlay */}
        {sidebarOpen && (
          <div className={styles.drawerOverlay} onClick={() => setSidebarOpen(false)}>
            <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
              <button className={styles.drawerClose} onClick={() => setSidebarOpen(false)}>✕ Close</button>
              <SidebarContent />
            </div>
          </div>
        )}

        {/* Layout Grid */}
        <div className={styles.layout}>
          {/* Sticky Sidebar — desktop */}
          <aside className={styles.sidebar}>
            <SidebarContent />
          </aside>

          {/* Catalog Grid */}
          <section style={{ opacity: isPending ? 0.7 : 1, transition: 'opacity 0.2s ease' }}>
            <div className={styles.catalogHeader}>
              <span className={styles.resultsCount}>
                Showing {sortedProducts.length} saree{sortedProducts.length === 1 ? '' : 's'}
              </span>
              <select
                value={selectedSort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className={`${styles.sortSelect} ${styles.desktopSort}`}
              >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>

            {sortedProducts.length > 0 ? (
              <div className={styles.productsGrid}>
                {sortedProducts.map((product) => {
                   const wishlisted = isWishlisted(product.id);
                   const discountPercent = product.discount || (product.mrp && product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0);
                   return (
                     <div key={product.id} className={pageStyles.myntraProductCard} style={{ position: 'relative', flex: 'unset' }}>
                       <Link href={`/product/${product.id}`} className={pageStyles.myntraImgWrap}>
                         {product.isNew && <span className={pageStyles.badgeNew}>NEW</span>}
                         <img
                           src={product.images.split(',')[0]}
                           alt={product.title}
                           className={pageStyles.myntraProductImg}
                           loading="lazy"
                         />
                         
                         {/* Rating Tag overlaying image */}
                         <div className={pageStyles.ratingBadge}>
                           <span>{product.rating}</span>
                           <Plus size={10} style={{ display: 'none' }} /> {/* dummy just to verify icons */}
                           <svg width="10" height="10" viewBox="0 0 24 24" fill="#149253" stroke="none" style={{ color: '#149253' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                           <span className={pageStyles.ratingDivider}>|</span>
                           <span>{product.reviewsCount || 12}</span>
                         </div>
                       </Link>
                       <button 
                         onClick={() => toggle(product)}
                         style={{
                           position: 'absolute',
                           top: '10px',
                           right: '10px',
                           zIndex: 10,
                           width: '30px',
                           height: '30px',
                           borderRadius: '50%',
                           background: 'rgba(255, 255, 255, 0.95)',
                           border: '1px solid rgba(0,0,0,0.08)',
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           cursor: 'pointer',
                           color: wishlisted ? '#d32f2f' : 'var(--text-muted)',
                           boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                           transition: 'all 0.2s'
                         }}
                         aria-label="Toggle Wishlist"
                       >
                         <Heart size={14} fill={wishlisted ? '#d32f2f' : 'none'} />
                       </button>
                       
                       <div className={pageStyles.myntraProductInfo}>
                         <span className={pageStyles.myntraFabric}>{product.fabric}</span>
                         <Link href={`/product/${product.id}`} className={pageStyles.myntraTitle} style={{ minHeight: '34px', textDecoration: 'none' }}>
                           {product.title}
                         </Link>
                         <div className={pageStyles.myntraPriceRow}>
                           <span className={pageStyles.myntraPrice}>₹{product.price.toLocaleString('en-IN')}</span>
                           {product.mrp && product.mrp > product.price && (
                             <>
                               <span className={pageStyles.myntraMrp}>₹{product.mrp.toLocaleString('en-IN')}</span>
                               <span className={pageStyles.myntraDiscount}>({discountPercent}% OFF)</span>
                             </>
                           )}
                         </div>
                       </div>
                     </div>
                   );
                })}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <h3 className={styles.emptyTitle}>No Sarees Match Your Filters</h3>
                <p className={styles.emptyText}>Try adjusting your filters or clearing them to see more results.</p>
                <button className="btn-primary" onClick={clearAllFilters}>Reset Filters</button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
