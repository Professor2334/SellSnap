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
  const [heroAmount, setHeroAmount] = React.useState(22300);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (heroPhase === 'idle') {
      setHeroAmount(22300);
      timeout = setTimeout(() => {
        setHeroPhase('paying');
      }, 3000);
    } else if (heroPhase === 'paying') {
      const startTime = Date.now();
      const duration = 1000;
      const startAmount = 22300;
      const endAmount = 25000;
      
      const animateAmount = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed < duration) {
          const progress = elapsed / duration;
          const easeOut = 1 - Math.pow(1 - progress, 3);
          setHeroAmount(Math.floor(startAmount + (endAmount - startAmount) * easeOut));
          requestAnimationFrame(animateAmount);
        } else {
          setHeroAmount(endAmount);
          setHeroPhase('success');
        }
      };
      requestAnimationFrame(animateAmount);
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
    <div className="min-h-screen">
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
            <div className="landing-nav-mobile-drawer" role="menu">
              <a href="#hero" className={`landing-nav-link${activeSection === '#hero' ? ' active' : ''}`} onClick={() => { setActiveSection('#hero'); setMenuOpen(false); }} role="menuitem">Home</a>
              <a href="#features" className={`landing-nav-link${activeSection === '#features' ? ' active' : ''}`} onClick={() => { setActiveSection('#features'); setMenuOpen(false); }} role="menuitem">Features</a>
              <a href="#how-it-works" className={`landing-nav-link${activeSection === '#how-it-works' ? ' active' : ''}`} onClick={() => { setActiveSection('#how-it-works'); setMenuOpen(false); }} role="menuitem">How it Works</a>
              <a href="#pricing" className={`landing-nav-link${activeSection === '#pricing' ? ' active' : ''}`} onClick={() => { setActiveSection('#pricing'); setMenuOpen(false); }} role="menuitem">Pricing</a>
              <a href="#faq" className={`landing-nav-link${activeSection === '#faq' ? ' active' : ''}`} onClick={() => { setActiveSection('#faq'); setMenuOpen(false); }} role="menuitem">FAQ</a>
              <div className="landing-nav-mobile-drawer-actions">
                <Link href="/auth" onClick={() => setMenuOpen(false)} style={{ width: '100%' }}>
                  <Button size="lg" variant="primary" fullWidth>Get Started</Button>
                </Link>
              </div>
            </div>
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
              Sell online<br />
              using one{' '}
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
            <div className="hero-composition">
              <div className="hc-glow" aria-hidden="true" />
              <div className="hc-main-flow">
                <div className="hc-card hc-product-card">
                  <div className="hc-product-img">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <rect width="40" height="40" rx="8" fill="var(--color-surface)" />
                      <rect x="8" y="16" width="24" height="18" rx="3" fill="var(--color-border)" />
                      <path d="M15 16v-3a5 5 0 0 1 10 0v3" stroke="var(--color-ink-subtle)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                      <rect x="17" y="20" width="6" height="4" rx="1.5" fill="var(--color-ink-subtle)" opacity=".6" />
                    </svg>
                  </div>
                  <div className="hc-product-info">
                    <div className="hc-product-name">Handmade Leather Bag</div>
                    <div className="hc-product-price">₦25,000</div>
                    <div className="hc-product-link">
                      <div className="hc-product-link-btn">
                        <Link2 size={12} />
                        <span className="hc-link-text">sellsnap.link/greenbag</span>
                        <Copy size={12} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hc-card hc-checkout-card">
                  <div className="hc-checkout-header">
                    <span className="hc-checkout-label">Pay with</span>
                    <div className="hc-checkout-provider">
                      <span className="hc-flw-logo" aria-label="Flutterwave">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                          <circle cx="7.5" cy="7.5" r="7.5" fill="#F5A623" />
                          <path d="M4.5 8C4.5 6.5 5.8 5.2 7.5 5.2s3 1.3 3 2.8-1.3 2.8-3 2.8-3-1.3-3-2.8z" fill="white" opacity=".7" />
                          <circle cx="7.5" cy="8" r="1.4" fill="white" />
                        </svg>
                      </span>
                      Flutterwave
                    </div>
                  </div>
                  <div className="hc-checkout-amount-row">
                    <span className="hc-checkout-amt-label">Total amount</span>
                    <span className="hc-checkout-amt">₦{heroAmount.toLocaleString()}</span>
                  </div>
                  <button className={`hc-pay-btn ${heroPhase === 'success' ? 'bg-success' : ''}`}>
                    {heroPhase === 'idle' && 'Pay Now'}
                    {heroPhase === 'paying' && (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        Paying...
                      </span>
                    )}
                    {heroPhase === 'success' && 'Paid ✓'}
                  </button>
                </div>

                <div className={`hc-card hc-success-card ${heroPhase === 'success' ? 'is-visible' : ''}`}>
                  <div className="hc-success-icon-wrap">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="hc-success-text">
                    <div className="hc-success-title">Payment Successful</div>
                    <div className="hc-success-sub">₦25,000 received</div>
                  </div>
                </div>
              </div>

              <div className="hc-share-stack">
                <div className="hc-share-card">
                  <span className="hc-share-icon hc-share-icon--whatsapp"><MessageCircle size={13} /></span>
                  WhatsApp
                </div>
                <div className="hc-share-card">
                  <span className="hc-share-icon hc-share-icon--instagram"><Instagram size={13} /></span>
                  Instagram
                </div>
                <div className="hc-share-card">
                  <span className="hc-share-icon hc-share-icon--facebook"><Facebook size={13} /></span>
                  Facebook
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
      <section className="section" id="how-it-works">
        <div className="container">
          <div className="section-header animate-fade-in-up">
            <h2 className="section-title">How SellSnap Works</h2>
            <p className="section-subtitle">Start selling in three simple steps.</p>
          </div>
          <motion.div 
            className="steps-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
          >
            <motion.div 
              className="step-card"
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
            >
              <div className="step-badge">01</div>
              <div className="step-icon-wrap"><Upload size={28} /></div>
              <h3 className="step-title">Upload Product</h3>
              <p className="step-desc">Create your product with a photo, price, and description.</p>
            </motion.div>
            <motion.div 
              className="step-card"
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
            >
              <div className="step-badge">02</div>
              <div className="step-icon-wrap"><Link2 size={28} /></div>
              <h3 className="step-title">Share Link</h3>
              <p className="step-desc">Share your payment link anywhere your customers are.</p>
            </motion.div>
            <motion.div 
              className="step-card"
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
            >
              <div className="step-badge">03</div>
              <div className="step-icon-wrap"><CreditCard size={28} /></div>
              <h3 className="step-title">Get Paid</h3>
              <p className="step-desc">Receive payments instantly and securely into your account.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 5. Why SellSnap Section ("Built for Social Commerce") */}
      <section className="section" id="social-commerce" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="sc-bg-container" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <div className="auth-glow-center"></div>
          <div className="auth-orb-tl"></div>
          <div className="auth-orb-br"></div>
        </div>
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
              <div className="sc-right-container">
                <div className="sc-orbit-system">
                  <div className="sc-float-card sc-pos-1">
                    <div className="sc-float-inner">
                      <span className="sc-icon sc-icon-wa"><MessageCircle size={16} /></span>
                      <span className="text-body-sm font-medium">WhatsApp</span>
                    </div>
                  </div>
                  
                  <div className="sc-float-card sc-pos-2">
                    <div className="sc-float-inner">
                      <span className="sc-icon sc-icon-ig"><Instagram size={16} /></span>
                      <span className="text-body-sm font-medium">Instagram</span>
                    </div>
                  </div>
                  
                  <div className="sc-float-card sc-pos-3">
                    <div className="sc-float-inner">
                      <span className="sc-icon sc-icon-fb"><Facebook size={16} /></span>
                      <span className="text-body-sm font-medium">Facebook</span>
                    </div>
                  </div>

                  <div className="sc-float-card sc-pos-4">
                    <div className="sc-float-inner">
                      <span className="sc-icon sc-icon-notify"><Zap size={16} /></span>
                      <span className="text-body-sm font-medium">Instant Alerts</span>
                    </div>
                  </div>
                  
                  <div className="sc-float-card sc-pos-5">
                    <div className="sc-float-inner">
                      <span className="sc-icon sc-icon-pay"><ShieldCheck size={16} /></span>
                      <span className="text-body-sm font-medium">Secure Payment</span>
                    </div>
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
      <section className="section final-cta-section" id="cta">
        <div className="container">
          <div className="final-cta-card animate-fade-in-up">
            <h2 className="text-display text-center cta-heading">Start selling today.</h2>
            <p className="text-body text-center max-w-lg mx-auto cta-subtitle">
              Create products, generate payment links and receive payments in minutes.
            </p>
            <div className="cta-actions flex justify-center gap-6 flex-wrap">
              <Link href="/auth">
                <Button size="lg" variant="primary">Create Free Account</Button>
              </Link>
            </div>
            <div className="cta-trust-indicators">
              <div className="cta-trust-item"><Check size={18} /> No monthly fees</div>
              <div className="cta-trust-item"><Zap size={18} /> Setup in under 60 seconds</div>
              <div className="cta-trust-item"><ShieldCheck size={18} /> Powered by Flutterwave</div>
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
