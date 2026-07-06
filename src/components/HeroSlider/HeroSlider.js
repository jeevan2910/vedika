'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './HeroSlider.module.css';

export default function HeroSlider() {
  const slides = [
    {
      image: '/images/hero-saree.webp',
      subtitle: 'Vedhika',
      title: 'Thread Affairs • Est. 2026',
      desc: 'Handcrafted heritage, woven for the modern wardrobe. Explore our exclusive collection of timeless, artisan-made handlooms.',
      ctaText: 'Explore Collection',
      ctaLink: '/shop'
    },
    {
      image: '/images/saree-crimson.webp',
      subtitle: 'Artisan Weaves',
      title: 'Pure Silk Masterpieces',
      desc: 'Intricately handwoven bridal Kanjeevarams and Banarasi brocades from India\'s most prestigious looms. Made for generations.',
      ctaText: 'Shop Pure Silk',
      ctaLink: '/shop?fabric=Kanjeevaram Silk'
    },
    {
      image: '/images/saree-green.webp',
      subtitle: 'Virtual Studio',
      title: 'Drape Sarees Digitally',
      desc: 'Experience our interactive digital draping room. View fabric folds, borders, and colors on virtual models before making a choice.',
      ctaText: 'Enter Studio',
      ctaLink: '/draping'
    }
  ];

  const [current, setCurrent] = useState(0);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={styles.sliderContainer}>
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`${styles.slide} ${idx === current ? styles.activeSlide : ''}`}
          style={{ backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.7) 100%), url(${slide.image})` }}
        >
          {idx === current && (
            <div className={styles.content}>
              <span className={styles.subtitle}>{slide.subtitle}</span>
              <h1 className={styles.title}>{slide.title}</h1>
              <p className={styles.desc}>{slide.desc}</p>
              <div className={styles.btns}>
                <Link href={slide.ctaLink} className="btn-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  {slide.ctaText} <ArrowRight size={16} />
                </Link>
                <Link href="/draping" className="btn-secondary" style={{ color: '#FFFFFF', borderColor: '#FFFFFF' }}>
                  Virtual Studio
                </Link>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Slider Controls */}
      <button className={`${styles.navBtn} ${styles.leftBtn}`} onClick={prevSlide} aria-label="Previous Slide">
        <ChevronLeft size={24} />
      </button>
      <button className={`${styles.navBtn} ${styles.rightBtn}`} onClick={nextSlide} aria-label="Next Slide">
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className={styles.dots}>
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`${styles.dot} ${idx === current ? styles.activeDot : ''}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
}
