'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, animate, useTransform, useReducedMotion, Variants } from 'framer-motion';
import { Zap, Link2, Smartphone, ShieldCheck } from 'lucide-react';


const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export function TrustSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="section bg-[var(--color-bg)] overflow-hidden" id="trust">
      <div className="container">
        {/* Header Section */}
        <motion.div 
          className="max-w-2xl mx-auto text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--sys-primary-container-role)] text-[var(--color-brand)] font-medium text-sm tracking-wide shadow-sm">
              Made for Social Selling.
            </span>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-display mb-4 max-w-[15ch] mx-auto md:max-w-none text-balance">
            Built to Help You Sell Faster.
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-body text-ink-muted text-lg">
            Create a payment link, share it anywhere, and receive payments instantly.
          </motion.p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div 
          className="trust-features-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {/* Card 1 */}
          <motion.div variants={fadeInUp} className="trust-card group">
            <div className="trust-card-icon-wrap">
              <Zap size={24} className="trust-card-icon group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="trust-card-title">Under 60 Seconds</h3>
            <p className="trust-card-desc">Average setup time</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={fadeInUp} className="trust-card group">
            <div className="trust-card-icon-wrap">
              <Link2 size={24} className="trust-card-icon group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="trust-card-title">One Payment Link</h3>
            <p className="trust-card-desc">Share anywhere</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={fadeInUp} className="trust-card group">
            <div className="trust-card-icon-wrap">
              <Smartphone size={24} className="trust-card-icon group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="trust-card-title">Works Everywhere</h3>
            <p className="trust-card-desc">Mobile optimized</p>
          </motion.div>

          {/* Card 4 */}
          <motion.div variants={fadeInUp} className="trust-card group">
            <div className="trust-card-icon-wrap">
              <ShieldCheck size={24} className="trust-card-icon group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="trust-card-title">Secure Payments</h3>
            <p className="trust-card-desc">Powered by Flutterwave</p>
          </motion.div>
        </motion.div>



        {/* Animated Marquee Metrics */}
        <motion.div 
          className="marquee-container-wrapper"
          variants={fadeInUp}
        >
          <div className="marquee-container">
          <div className="marquee-track group">
            {/* Set 1 */}
            <div className="marquee-content">
              <div className="trust-metric-item">
                <div className="trust-metric-value">10,000+</div>
                <div className="trust-metric-label">Payment Links Created</div>
                <div className="trust-metric-desc">By sellers across Africa</div>
              </div>

              <div className="trust-metric-item">
                <div className="trust-metric-value">₦50M+</div>
                <div className="trust-metric-label">Payments Processed</div>
                <div className="trust-metric-desc">In successful transactions</div>
              </div>

              <div className="trust-metric-item">
                <div className="trust-metric-value">99.9%</div>
                <div className="trust-metric-label">Checkout Success</div>
                <div className="trust-metric-desc">Industry leading reliability</div>
              </div>

              <div className="trust-metric-item">
                <div className="trust-metric-value">24/7</div>
                <div className="trust-metric-label">Available</div>
                <div className="trust-metric-desc">Always online for buyers</div>
              </div>
            </div>
            
            {/* Set 2 (Duplicate for seamless loop) */}
            <div className="marquee-content" aria-hidden="true">
              <div className="trust-metric-item">
                <div className="trust-metric-value">10,000+</div>
                <div className="trust-metric-label">Payment Links Created</div>
                <div className="trust-metric-desc">By sellers across Africa</div>
              </div>

              <div className="trust-metric-item">
                <div className="trust-metric-value">₦50M+</div>
                <div className="trust-metric-label">Payments Processed</div>
                <div className="trust-metric-desc">In successful transactions</div>
              </div>

              <div className="trust-metric-item">
                <div className="trust-metric-value">99.9%</div>
                <div className="trust-metric-label">Checkout Success</div>
                <div className="trust-metric-desc">Industry leading reliability</div>
              </div>

              <div className="trust-metric-item">
                <div className="trust-metric-value">24/7</div>
                <div className="trust-metric-label">Available</div>
                <div className="trust-metric-desc">Always online for buyers</div>
              </div>
            </div>
          </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
