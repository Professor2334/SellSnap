'use client'; // trigger fast refresh

import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import {
  Menu,
  X,
  ArrowRight,
  Shield,
  ShieldCheck,
  Globe,
  Zap,
  Copy,
  MessageCircle,
  Instagram,
  Facebook,
  CheckCircle2,
  Link2,
  ChevronDown,
  Upload,
  CreditCard,
  Smartphone,
  TrendingUp,
  Check,
  Loader2,
  LayoutDashboard,
} from 'lucide-react';
import Link from 'next/link';
import { StickyStorySection } from '@/components/landing/StickyStorySection';
import { TrustSection } from '@/components/landing/TrustSection';
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('#hero');

  // Hero Animation State
  const [heroPhase, setHeroPhase] = React.useState<'idle' | 'paying' | 'success'>('idle');
  const heroAmount = 25000;

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (heroPhase === 'idle') {
      timeout = setTimeout(() => {
        setHeroPhase('paying');
      }, 3000);
    } else if (heroPhase === 'paying') {
      timeout = setTimeout(() => {
        setHeroPhase('success');
      }, 1000);
    } else if (heroPhase === 'success') {
      timeout = setTimeout(() => {
        setHeroPhase('idle');
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [heroPhase]);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile menu scroll lock and escape key handling
  React.useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMenuOpen(false);
      };
      window.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  return (
    <div className="min-h-screen w-full">
      {/* ── Sticky Navigation ───────────────────────────────── */}
      <nav className={`landing-nav${scrolled ? ' landing-nav--scrolled' : ''}`} aria-label="Main navigation">
        <div className="landing-nav-inner">
          <Link href="/" className="landing-nav-logo" aria-label="SellSnap home">
            <span className="landing-nav-logo-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="22" height="22" rx="6" fill="currentColor" />
                <path d="M6 11.5L9.5 15L16 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            SellSnap
          </Link>

          <div className="landing-nav-links" role="menubar">
            <a href="#hero" className={`landing-nav-link${activeSection === '#hero' ? ' active' : ''}`} onClick={() => setActiveSection('#hero')} role="menuitem">Home</a>
            <a href="#features" className={`landing-nav-link${activeSection === '#features' ? ' active' : ''}`} onClick={() => setActiveSection('#features')} role="menuitem">Features</a>
            <a href="#how-it-works" className={`landing-nav-link${activeSection === '#how-it-works' ? ' active' : ''}`} onClick={() => setActiveSection('#how-it-works')} role="menuitem">How it Works</a>
            <a href="#pricing" className={`landing-nav-link${activeSection === '#pricing' ? ' active' : ''}`} onClick={() => setActiveSection('#pricing')} role="menuitem">Pricing</a>
            <a href="#faq" className={`landing-nav-link${activeSection === '#faq' ? ' active' : ''}`} onClick={() => setActiveSection('#faq')} role="menuitem">FAQ</a>
          </div>

          <div className="landing-nav-actions">
            <Link href="/auth">
              <Button size="md" variant="primary" className="landing-nav-cta">
                Get Started
              </Button>
            </Link>
          </div>

          <button
            className={`landing-nav-mobile-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <div className="landing-nav-toggle-icon-wrapper">
              <Menu className="landing-nav-icon-menu" size={24} />
              <X className="landing-nav-icon-close" size={24} />
            </div>
          </button>
        </div>

        {menuOpen && (
          <>
            <div className="landing-nav-backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" />
            <motion.div 
              className="landing-nav-mobile-drawer" 
              role="menu"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.y < -50 || velocity.y < -500) {
                  setMenuOpen(false);
                }
              }}
            >
              <a href="#hero" className={`landing-nav-link${activeSection === '#hero' ? ' active' : ''}`} onClick={() => { setActiveSection('#hero'); setMenuOpen(false); }} role="menuitem">Home</a>
              <a href="#features" className={`landing-nav-link${activeSection === '#features' ? ' active' : ''}`} onClick={() => { setActiveSection('#features'); setMenuOpen(false); }} role="menuitem">Features</a>
              <a href="#how-it-works" className={`landing-nav-link${activeSection === '#how-it-works' ? ' active' : ''}`} onClick={() => { setActiveSection('#how-it-works'); setMenuOpen(false); }} role="menuitem">How it Works</a>
              <a href="#pricing" className={`landing-nav-link${activeSection === '#pricing' ? ' active' : ''}`} onClick={() => { setActiveSection('#pricing'); setMenuOpen(false); }} role="menuitem">Pricing</a>
              <a href="#faq" className={`landing-nav-link${activeSection === '#faq' ? ' active' : ''}`} onClick={() => { setActiveSection('#faq'); setMenuOpen(false); }} role="menuitem">FAQ</a>
              <div className="landing-nav-mobile-drawer-actions">
                <Link href="/auth" onClick={() => setMenuOpen(false)} style={{ width: '100%' }}>
                  <Button size="lg" variant="primary" fullWidth className="hero-cta-primary">Get Started</Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </nav>

      {/* ── 1. Hero Section ────────────────────────────────────── */}
      <section className="hero-v2" id="hero" aria-label="Hero">
        <div className="hero-v2-container">
          <div className="hero-v2-left">
            <div className="hero-badge" role="note">
              <span className="hero-badge-dot" aria-hidden="true" />
              The easiest way to sell online
            </div>

            <h1 className="hero-headline">
              Sell online using one{' '}
              <span className="hero-headline-accent">Payment link.</span>
            </h1>

            <p className="hero-subtext">
              Create a product, share one payment link, and get paid from anywhere.
            </p>

            <div className="hero-cta-row">
              <Link href="/auth">
                <Button size="lg" variant="primary" className="hero-cta-primary">
                  Start Selling <ArrowRight size={16} aria-hidden="true" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="secondary" className="hero-cta-secondary">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="hero-trust-wrapper" aria-label="Trust indicators">
              <div className="hero-trust-ticker">
                <span className="hero-trust-badge">
                  <ShieldCheck size={16} aria-hidden="true" /> Secure Payments
                </span>
                <span className="hero-trust-badge">
                  <Globe size={16} aria-hidden="true" /> No Website Needed
                </span>
                <span className="hero-trust-badge">
                  <Zap size={16} aria-hidden="true" /> Setup in 60 Seconds
                </span>
                <span className="hero-trust-badge" aria-hidden="true">
                  <ShieldCheck size={16} /> Secure Payments
                </span>
                <span className="hero-trust-badge" aria-hidden="true">
                  <Globe size={16} /> No Website Needed
                </span>
                <span className="hero-trust-badge" aria-hidden="true">
                  <Zap size={16} /> Setup in 60 Seconds
                </span>
              </div>
            </div>
          </div>

          <div className="hero-v2-right" aria-hidden="true">
            <div className="hero-photo-wrapper" style={{ 
              borderRadius: 'var(--sys-radius-xl)', 
              overflow: 'hidden', 
              boxShadow: 'var(--sys-elevation-level3)',
              position: 'relative',
              aspectRatio: '4/5',
              width: '100%',
              maxWidth: '480px',
              margin: '0 auto'
            }}>
              <img 
                src="/hero-still-life.png"
                alt="A curated arrangement of seller products: a skincare serum, a handmade candle, a notebook, gold earrings, and eucalyptus — representing the diversity of what you can sell with SellSnap"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: '24px',
                left: '24px',
                right: '24px',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--sys-radius-lg)',
                padding: 'var(--sys-space-4)',
                boxShadow: 'var(--sys-elevation-level2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                 <div>
                   <div className="text-body-sm font-medium" style={{ color: 'var(--color-ink-muted)' }}>Sell anything online</div>
                   <div className="text-h2" style={{ color: 'var(--color-brand)', fontWeight: 'bold' }}>One payment link.</div>
                 </div>
                 <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-brand)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                   <ArrowRight size={20} />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Social Proof Section [NEW] ─────────────────────── */}
      <TrustSection />

      {/* ── 3. Features Section (Sticky Story) ────────── */}
      <StickyStorySection />

      {/* ── 4. How It Works Section ───────────────────────────── */}
      <section className="section hiw-section" id="how-it-works">
        <div className="container">

          {/* Section header */}
          <div className="hiw-header animate-fade-in-up">
            <span className="hiw-eyebrow">Simple by design</span>
            <h2 className="hiw-title">How SellSnap Works</h2>
            <p className="hiw-subtitle">Three steps. One link. Paid.</p>
          </div>

          {/* Two-column body */}
          <div className="hiw-body">

            {/* LEFT — numbered steps with vertical connector */}
            <motion.ol
              className="hiw-steps"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.18 } } }}
            >
              {/* Step 01 */}
              <motion.li
                className="hiw-step"
                variants={{ hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } } }}
              >
                <div className="hiw-step-left">
                  <div className="hiw-step-number">01</div>
                  <div className="hiw-step-thread" aria-hidden="true" />
                </div>
                <div className="hiw-step-body">
                  <h3 className="hiw-step-title">Upload your product</h3>
                  <p className="hiw-step-desc">Add a photo, price, and description. Takes less than a minute — no store, no code.</p>
                </div>
              </motion.li>

              {/* Step 02 */}
              <motion.li
                className="hiw-step"
                variants={{ hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } } }}
              >
                <div className="hiw-step-left">
                  <div className="hiw-step-number hiw-step-number--secondary">02</div>
                  <div className="hiw-step-thread" aria-hidden="true" />
                </div>
                <div className="hiw-step-body">
                  <h3 className="hiw-step-title">Share your payment link</h3>
                  <p className="hiw-step-desc">SellSnap generates a unique link. Share it anywhere — WhatsApp, Instagram, or any platform your customers use.</p>
                </div>
              </motion.li>

              {/* Step 03 */}
              <motion.li
                className="hiw-step hiw-step--last"
                variants={{ hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } } }}
              >
                <div className="hiw-step-left">
                  <div className="hiw-step-number hiw-step-number--tertiary">03</div>
                </div>
                <div className="hiw-step-body">
                  <h3 className="hiw-step-title">Get paid instantly</h3>
                  <p className="hiw-step-desc">Your customer pays via Flutterwave. You receive a notification and funds settle directly to your account.</p>
                </div>
              </motion.li>
            </motion.ol>

            {/* RIGHT — product flow vignette */}
            <motion.div
              className="hiw-vignette"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.22, delayChildren: 0.1 } } }}
              aria-hidden="true"
            >
              {/* Card 1 — product created */}
              <motion.div
                className="hiw-card hiw-card--product"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
              >
                <div className="hiw-card-icon-row">
                  <div className="hiw-card-icon hiw-card-icon--primary"><Upload size={16} /></div>
                  <span className="hiw-card-label">Product created</span>
                </div>
                <div className="hiw-card-product-row">
                  <div className="hiw-card-img-placeholder" aria-hidden="true" />
                  <div className="hiw-card-product-info">
                    <div className="hiw-card-product-name">Handmade Soy Candle</div>
                    <div className="hiw-card-product-price">₦8,500</div>
                  </div>
                </div>
              </motion.div>

              {/* Connector arrow */}
              <div className="hiw-vignette-arrow" aria-hidden="true">
                <ArrowRight size={16} />
              </div>

              {/* Card 2 — link generated */}
              <motion.div
                className="hiw-card hiw-card--link"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
              >
                <div className="hiw-card-icon-row">
                  <div className="hiw-card-icon hiw-card-icon--secondary"><Link2 size={16} /></div>
                  <span className="hiw-card-label">Link generated</span>
                </div>
                <div className="hiw-link-pill">
                  <span className="hiw-link-url">sellsnap.io/<strong>soycandle</strong></span>
                  <span className="hiw-copy-btn"><Copy size={13} /></span>
                </div>
                <p className="hiw-link-share-hint">Share anywhere your customers are</p>
              </motion.div>

              {/* Connector arrow */}
              <div className="hiw-vignette-arrow" aria-hidden="true">
                <ArrowRight size={16} />
              </div>

              {/* Card 3 — payment confirmed */}
              <motion.div
                className="hiw-card hiw-card--paid"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
              >
                <div className="hiw-card-icon-row">
                  <div className="hiw-card-icon hiw-card-icon--success"><CheckCircle2 size={16} /></div>
                  <span className="hiw-card-label">Payment confirmed</span>
                </div>
                <div className="hiw-paid-amount">₦8,500</div>
                <p className="hiw-paid-sub">Received via Flutterwave · Just now</p>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* ── 5. Why SellSnap Section ("Built for Social Commerce") */}
      <section className="section" id="social-commerce" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="social-commerce-grid">
            <div className="sc-left">
              <h2 className="text-display mb-4 max-w-[14ch]">Sell Where Your Customers Already Are</h2>
              <p className="text-body text-ink-muted mb-8 max-w-[42ch]">
                Share one payment link across the platforms your customers already use. No website required.
              </p>
              <ul className="sc-checklist">
                <li><span className="sc-check">✓</span> WhatsApp</li>
                <li><span className="sc-check">✓</span> Instagram</li>
                <li><span className="sc-check">✓</span> Facebook</li>
                <li><span className="sc-check">✓</span> X (Twitter)</li>
                <li><span className="sc-check">✓</span> Telegram</li>
                <li><span className="sc-check">✓</span> TikTok</li>
              </ul>
            </div>
            
            <div className="sc-right" aria-hidden="true">
              <div className="bento-grid">
                <div className="bento-card square">
                  <div className="bento-icon-wrapper" style={{ color: '#25D366' }}>
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-h2">WhatsApp</h3>
                    <p className="text-body-sm text-ink-muted">Close sales directly in DMs.</p>
                  </div>
                </div>
                <div className="bento-card wide">
                  <div className="bento-icon-wrapper" style={{ color: '#E1306C' }}>
                    <Instagram size={24} />
                  </div>
                  <div>
                    <h3 className="text-h2">Instagram</h3>
                    <p className="text-body-sm text-ink-muted">Turn followers into customers with link in bio.</p>
                  </div>
                </div>
                <div className="bento-card wide">
                  <div className="bento-icon-wrapper" style={{ color: '#1877F2' }}>
                    <Facebook size={24} />
                  </div>
                  <div>
                    <h3 className="text-h2">Facebook</h3>
                    <p className="text-body-sm text-ink-muted">Monetize your audience on Facebook seamlessly.</p>
                  </div>
                </div>
                <div className="bento-card square">
                  <div className="bento-icon-wrapper" style={{ color: 'var(--color-brand)' }}>
                    <Zap size={24} />
                  </div>
                  <div>
                    <h3 className="text-h2">Anywhere</h3>
                    <p className="text-body-sm text-ink-muted">It's just a link.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Pricing Section [NEW] ──────────────────────────── */}
      <section className="pricing-section" id="pricing">
        <div className="container">
          <div className="section-header animate-fade-in-up text-center">
            <h2 className="text-display mb-5">Start Free. Upgrade When You Grow.</h2>
            <p className="text-body text-ink-muted max-w-[42ch] mx-auto">
              Everything you need to start selling today. Upgrade only when your business needs more.
            </p>
          </div>
          
          <div className="pricing-grid">
            {/* Free Plan */}
            <div className="pricing-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="pricing-badge">Available Now</div>
              <h3 className="pricing-plan">Free Plan</h3>
              <div className="pricing-price">₦0<span>/month</span></div>
              
              <ul className="pricing-list">
                <li><Check size={18} className="pricing-list-icon" /> Unlimited products</li>
                <li><Check size={18} className="pricing-list-icon" /> Share payment links</li>
                <li><Check size={18} className="pricing-list-icon" /> Flutterwave checkout</li>
                <li><Check size={18} className="pricing-list-icon" /> Order dashboard</li>
                <li><Check size={18} className="pricing-list-icon" /> Mobile responsive</li>
              </ul>
              
              <Link href="/auth" style={{ width: '100%' }}>
                <Button variant="primary" size="lg" fullWidth>Start Selling Free</Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="pricing-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="pricing-badge secondary">Coming Soon</div>
              <h3 className="pricing-plan">Pro Plan</h3>
              <div className="pricing-price">Custom</div>
              
              <ul className="pricing-list">
                <li><Check size={18} className="pricing-list-icon secondary" /> Custom branding</li>
                <li><Check size={18} className="pricing-list-icon secondary" /> Analytics</li>
                <li><Check size={18} className="pricing-list-icon secondary" /> Team collaboration</li>
                <li><Check size={18} className="pricing-list-icon secondary" /> Advanced integrations</li>
                <li><Check size={18} className="pricing-list-icon secondary" /> Priority support</li>
              </ul>
              
              <Button variant="secondary" size="lg" fullWidth disabled>Join Waitlist</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ────────────────────────────────────────────── */}
      <section className="section" id="faq">
        <div className="container">
          <div className="section-header animate-fade-in-up text-center" style={{ marginBottom: '64px' }}>
            <h2 className="text-display mb-5">Frequently Asked Questions</h2>
            <p className="text-body text-ink-muted max-w-[42ch] mx-auto">
              Everything you need to know before you start selling with SellSnap.
            </p>
          </div>
          <div className="faq-container">
            <Accordion faqs={faqData} />
          </div>
        </div>
      </section>

      {/* ── 8. Final Call To Action ───────────────────────────── */}
      <section className="section final-cta-section" id="cta" style={{ backgroundColor: 'var(--primitive-primary20)', padding: 'var(--sys-space-30) 20px', margin: 'var(--sys-space-20) 0', borderRadius: 'var(--sys-radius-xl)', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="final-cta-card animate-fade-in-up" style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }}>
            <h2 className="text-display text-center cta-heading" style={{ color: 'var(--primitive-primary90)', marginBottom: 'var(--sys-space-6)' }}>Start selling today.</h2>
            <p className="text-body text-center max-w-lg mx-auto cta-subtitle" style={{ color: 'var(--primitive-primary80)', marginBottom: 'var(--sys-space-8)' }}>
              Create products, generate payment links and receive payments in minutes.
            </p>
            <div className="cta-actions flex justify-center gap-6 flex-wrap">
              <Link href="/auth">
                <Button size="lg" variant="primary" style={{ backgroundColor: 'var(--primitive-primary90)', color: 'var(--primitive-primary10)', boxShadow: 'var(--sys-elevation-glow)' }}>
                  Create Free Account
                </Button>
              </Link>
            </div>
            <div className="cta-trust-indicators" style={{ color: 'var(--primitive-primary70)', marginTop: 'var(--sys-space-12)', display: 'flex', gap: 'var(--sys-space-8)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div className="cta-trust-item flex items-center gap-2"><Check size={18} /> No monthly fees</div>
              <div className="cta-trust-item flex items-center gap-2"><Zap size={18} /> Setup in under 60 seconds</div>
              <div className="cta-trust-item flex items-center gap-2"><ShieldCheck size={18} /> Powered by Flutterwave</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. Footer ─────────────────────────────────────────── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand-col">
              <Link href="/" className="footer-logo">
                <span className="footer-logo-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="22" height="22" rx="6" fill="currentColor" />
                    <path d="M6 11.5L9.5 15L16 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                SellSnap
              </Link>
              <p className="footer-desc">The easiest way for small businesses to sell online with just a payment link.</p>
            </div>
            
            <div className="footer-links-col">
              <h4 className="footer-heading">Product</h4>
              <Link href="#features" className="footer-link">Features</Link>
              <Link href="#how-it-works" className="footer-link">How it Works</Link>
              <Link href="#pricing" className="footer-link">Pricing</Link>
              <Link href="#faq" className="footer-link">FAQ</Link>
            </div>
            
            <div className="footer-links-col">
              <h4 className="footer-heading">Company</h4>
              <Link href="#" className="footer-link">About</Link>
              <Link href="#" className="footer-link">Contact</Link>
              <Link href="#" className="footer-link">Privacy Policy</Link>
              <Link href="#" className="footer-link">Terms</Link>
            </div>
            
            <div className="footer-links-col">
              <h4 className="footer-heading">Social</h4>
              <Link href="#" className="footer-link">X</Link>
              <Link href="#" className="footer-link">LinkedIn</Link>
              <Link href="#" className="footer-link">GitHub</Link>
            </div>
          </div>
          
          <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p>© {new Date().getFullYear()} SellSnap. All rights reserved.</p>
            <ThemeToggle />
          </div>
        </div>
      </footer>
    </div>
  );
}

const faqData = [
  { question: 'How do payment links work?', answer: 'Once you create a product, we generate a unique, secure URL. You can share this link anywhere, and when customers click it, they are taken to a fast checkout page to pay.' },
  { question: 'How do I receive payments?', answer: 'Payments are processed securely via Flutterwave and settled directly into your connected bank account according to their standard payout schedule.' },
  { question: 'Do I need a website?', answer: 'No! SellSnap is built specifically for businesses that want to sell online without the hassle of building and maintaining a full website.' },
  { question: 'Which payment methods are supported?', answer: 'Your customers can pay using cards, bank transfers, USSD, and other local payment methods supported by Flutterwave.' },
  { question: 'Can I sell on WhatsApp?', answer: 'Yes. In fact, most of our sellers use WhatsApp as their primary sales channel. Just paste your payment link in a chat or on your WhatsApp Status.' },
  { question: 'How much does SellSnap charge?', answer: 'SellSnap is free to use. You only pay standard Flutterwave transaction fees when you make a sale.' },
];

function Accordion({ faqs }: { faqs: { question: string, answer: string }[] }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className="accordion-wrapper">
      {faqs.map((faq, index) => (
        <div key={index} className={`accordion-item ${openIndex === index ? 'active' : ''}`}>
          <button
            className="accordion-trigger"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            aria-expanded={openIndex === index}
          >
            <span className="accordion-title">{faq.question}</span>
            <span className={`accordion-icon ${openIndex === index ? 'rotated' : ''}`}>
              <ChevronDown size={20} />
            </span>
          </button>
          <div className="accordion-content" style={{ height: openIndex === index ? 'auto' : 0 }}>
            <div className="accordion-inner">
              <p>{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
