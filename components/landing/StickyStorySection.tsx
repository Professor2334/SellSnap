'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Package, Link2, CreditCard, LayoutDashboard, Building2 } from 'lucide-react';
import { 
  CreateProductUI, 
  ShareLinkUI, 
  ReceivePaymentUI, 
  ManageOrdersUI, 
  WithdrawEarningsUI 
} from './StoryUIComponents';

const storyData = [
  {
    id: 'create',
    icon: Package,
    title: 'Create Your Product',
    description: 'Upload your product in under 60 seconds with photos, pricing and description.',
    ui: CreateProductUI,
  },
  {
    id: 'share',
    icon: Link2,
    title: 'Share One Payment Link',
    description: 'Copy one payment link and share it on WhatsApp, Instagram, Facebook or anywhere online.',
    ui: ShareLinkUI,
  },
  {
    id: 'receive',
    icon: CreditCard,
    title: 'Receive Secure Payments',
    description: 'Customers pay securely through Flutterwave without needing an account.',
    ui: ReceivePaymentUI,
  },
  {
    id: 'manage',
    icon: LayoutDashboard,
    title: 'Manage Orders',
    description: 'Track every customer order from one dashboard.',
    ui: ManageOrdersUI,
  },
  {
    id: 'withdraw',
    icon: Building2,
    title: 'Withdraw Your Earnings',
    description: 'Transfer your available balance directly to your bank account.',
    ui: WithdrawEarningsUI,
  }
];

export function StickyStorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // We have 5 sections. We can map scrollYProgress (0 to 1) to activeIndex (0 to 4).
  // Because the container is 500vh, we can divide 1 by 5.
  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      // Small buffer to prevent early triggering of the last item
      const index = Math.min(Math.floor(latest * storyData.length), storyData.length - 1);
      setActiveIndex(index);
    });
  }, [scrollYProgress]);

  if (shouldReduceMotion) {
    return (
      <section className="section bg-[var(--color-bg)]" id="story">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How SellSnap Works</h2>
            <p className="section-subtitle">The complete journey from product to payment.</p>
          </div>
          <div className="story-fallback-grid">
            {storyData.map((item, index) => (
              <div key={item.id} className="story-fallback-item">
                <div className="story-card active">
                  <div className="story-icon-wrap active">
                    <item.icon size={24} />
                  </div>
                  <h3 className="story-title">{item.title}</h3>
                  <p className="story-desc">{item.description}</p>
                </div>
                <div className="story-ui-fallback">
                  <item.ui />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={containerRef} 
      className="story-section bg-[var(--color-bg)]" 
      id="story"
    >
      <div className="story-sticky-container">
        <div className="container w-full">
          <div className="story-header-wrapper">
            <h2 className="section-title">Everything you need to start selling.</h2>
            <p className="section-subtitle">Everything required to sell online without building a website.</p>
          </div>
          <div className="story-content-grid">
            
            {/* Left Column: Stacked Feature Cards */}
            <div className="story-left-col">
              <div className="story-cards-container">
                {storyData.map((item, index) => {
                  const isActive = index === activeIndex;
                  const isPast = index < activeIndex;
                  const isFuture = index > activeIndex;

                  let yOffset = 0;
                  let scale = 1;
                  let opacity = 1;

                  if (isPast) {
                    yOffset = -30;
                    scale = 0.95;
                    opacity = 0;
                  } else if (isFuture) {
                    yOffset = 100 * (index - activeIndex);
                    scale = 0.97;
                    opacity = 0.55;
                  }

                  return (
                    <motion.div
                      key={item.id}
                      className={`story-card ${isActive ? 'active' : ''}`}
                      initial={false}
                      animate={{
                        y: yOffset,
                        scale: scale,
                        opacity: opacity,
                        zIndex: 10 - index,
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      style={{ position: index === 0 ? 'relative' : 'absolute', top: 0, left: 0, width: '100%' }}
                    >
                      <motion.div 
                        className={`story-icon-wrap ${isActive ? 'active' : ''}`}
                        animate={{ y: isActive ? [0, -4, 0] : 0 }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      >
                        <item.icon size={24} />
                      </motion.div>
                      <h3 className="story-title">{item.title}</h3>
                      <p className="story-desc">{item.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Dynamic UI Screens */}
            <div className="story-right-col">
              <div className="story-ui-container">
                <AnimatePresence mode="wait">
                  {storyData.map((item, index) => {
                    if (index !== activeIndex) return null;
                    return (
                      <motion.div
                        key={item.id}
                        className="story-ui-wrapper"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <item.ui />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
