'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import styles from './draping.module.css';

export default function DrapingStudio() {
  const [activeTab, setActiveTab] = useState('Nivi');
  const [currentStep, setCurrentStep] = useState(0);

  const stylesData = {
    Nivi: {
      title: 'Classic Nivi Drape',
      desc: 'Originating from Andhra Pradesh, the Nivi style is the most popular, universal, and elegant drape style across India, ideal for weddings and formal heritage events.',
      difficulty: 'Medium',
      idealFabric: 'Kanjeevaram & Georgette',
      image: '/images/saree-crimson.webp',
      steps: [
        {
          heading: 'The Foundation Wrap',
          text: 'Tuck the plain end of the saree into the waistband of your underskirt starting from the right side and sweeping around the back to complete one full, secure wrap.'
        },
        {
          heading: 'Creating the Lower Pleats',
          text: 'Make 6 to 8 neat pleats of about 4 to 5 inches each using your thumb and index finger, starting from the tucked end. Gather them evenly, tap them straight, and tuck them into the center waist facing left.'
        },
        {
          heading: 'The Heritage Pallu Drape',
          text: 'Take the remaining fabric, wrap it around your back, bring it forward under your right arm, and drape it diagonally across your chest and over your left shoulder. Make neat pleats on the shoulder and secure it with a safety pin.'
        }
      ]
    },
    Bengali: {
      title: 'Traditional Bengali Drape',
      desc: 'A classic box-pleated drape with no lower pleats, symbolizing elegance and status. Typically worn during festivals and celebratory gatherings.',
      difficulty: 'Easy',
      idealFabric: 'Handloom Cotton & Linen',
      image: '/images/saree-green.webp',
      steps: [
        {
          heading: 'The Basic Wrap',
          text: 'Tuck the saree starting from the right waist, wrap it once completely around the waist, and tuck it neatly at the right side again.'
        },
        {
          heading: 'Broad Box Pleating',
          text: 'Make broad, box-style pleats (about 8-10 inches wide) starting from the right waist to the left, tucking them flat into the center. Since this style has no tiny pleats, keep them flat and straight.'
        },
        {
          heading: 'The Keys & Shoulder Accent',
          text: 'Drape the remaining fabric over your left shoulder, leaving a long pallu. Bring the right corner of the pallu forward under your right arm and toss it over your right shoulder. You can attach a key ring ornament to the corner for authentic beauty!'
        }
      ]
    },
    Gujarati: {
      title: 'Seedha Pallu Drape',
      desc: 'A royal style from Gujarat and Rajasthan, featuring a front-hanging pallu that beautifully showcases heavy hand-embroidered border details.',
      difficulty: 'High',
      idealFabric: 'Banarasi Silk & Bandhani',
      image: '/images/saree-gold.webp',
      steps: [
        {
          heading: 'Basic Wrap & Center Pleats',
          text: 'Tuck the saree at the right waist, wrap it around once, and tuck it. Make 6-7 neat front pleats, align them evenly, and tuck them in the center waistband facing left.'
        },
        {
          heading: 'Bringing Pallu to the Front',
          text: 'Take the pallu, wrap it around your back from left to right, and drape it over your right shoulder so it hangs forward in front, displaying the border design.'
        },
        {
          heading: 'Pinning and Spanning',
          text: 'Pleat the front-hanging pallu neatly, spread it across your chest, and secure the left-most corner of the pallu to your left waist using a safety pin to showcase the gold work.'
        }
      ]
    }
  };

  const activeStyle = stylesData[activeTab];

  const handleNext = () => {
    if (currentStep < activeStyle.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setCurrentStep(0); // Reset progress on tab change
  };

  return (
    <div className={styles.container}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.sectionSubtitle}>
            <Sparkles size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Artisanal Studio
          </span>
          <h1 className={styles.title}>The Virtual Draping Studio</h1>
          <p className={styles.subtitle}>
            Master the art of traditional Indian draping. Select a style below to view fabric recommendations and step-by-step instructions.
          </p>
        </div>

        {/* Style Selector Tabs */}
        <div className={styles.tabs}>
          {Object.keys(stylesData).map((tab) => (
            <button
              key={tab}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab} Style
            </button>
          ))}
        </div>

        {/* Studio Layout */}
        <div className={styles.studioLayout}>
          {/* Left Column: Visualizer */}
          <div className={styles.visualizerCard}>
            <h2 className={styles.styleTitle}>{activeStyle.title}</h2>
            <p className={styles.styleDesc}>{activeStyle.desc}</p>
            <div className={styles.badgeRow}>
              <span className={`${styles.badge} ${styles.badgeAccent}`}>Diff: {activeStyle.difficulty}</span>
              <span className={styles.badge}>Ideal: {activeStyle.idealFabric}</span>
            </div>

            <div className={styles.visualMock}>
              <img
                src={activeStyle.image}
                alt={activeStyle.title}
                className={styles.visualMockImg}
              />
              <div className={styles.overlayText}>
                Step {currentStep + 1}: {activeStyle.steps[currentStep].heading}
              </div>
            </div>
          </div>

          {/* Right Column: Step by step instruction */}
          <div className={styles.simulatorCard}>
            <div className={styles.simHeader}>
              <h3 className={styles.simTitle}>Draping Progress</h3>
              <div className={styles.progressBar}>
                {activeStyle.steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`${styles.progressDot} ${currentStep === idx ? styles.activeDot : ''} ${currentStep > idx ? styles.completedDot : ''}`}
                  />
                ))}
              </div>
            </div>

            <div className={styles.stepContent} key={currentStep}>
              <span className={styles.stepNumber}>Instruction Step {currentStep + 1} of {activeStyle.steps.length}</span>
              <h4 className={styles.stepHeading}>{activeStyle.steps[currentStep].heading}</h4>
              <p className={styles.stepText}>{activeStyle.steps[currentStep].text}</p>
            </div>

            <div className={styles.navRow}>
              <button
                className="btn-secondary"
                onClick={handlePrev}
                disabled={currentStep === 0}
                style={{ opacity: currentStep === 0 ? 0.4 : 1, cursor: currentStep === 0 ? 'not-allowed' : 'pointer' }}
              >
                <ArrowLeft size={16} /> Back
              </button>

              {currentStep === activeStyle.steps.length - 1 ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '700', fontSize: '0.95rem' }}>
                  <CheckCircle size={20} color="var(--accent)" /> Drape Complete!
                </div>
              ) : (
                <button className="btn-primary" onClick={handleNext}>
                  Next Step <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
