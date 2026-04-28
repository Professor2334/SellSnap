'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container navbar-inner" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '24px' }}>
          <Link href="/" className="navbar-logo">
            SellSnap
          </Link>
          <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link href="#how-it-works" className="navbar-link">
              How It Works
            </Link>
            <Link href="#pricing" className="navbar-link">
              Pricing
            </Link>
            <Link href="#company" className="navbar-link">
              Company
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="flex flex-col items-center gap-8 max-w-5xl mx-auto text-center" style={{ padding: '0 24px' }}>
            <h1 className="text-display" style={{ maxWidth: '900px' }}>
              Sell anything in seconds<br />using just a link
            </h1>
            <p className="text-body text-ink-muted" style={{ maxWidth: '600px', fontWeight: 400 }}>
              Upload a product, share a link and get paid instantly
            </p>
            <div className="flex gap-4 mt-6">
              <Link href="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How SellSnap Works */}
      <section className="section" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How SellSnap Works</h2>
            <p className="section-subtitle">Start selling in three simple steps</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3 className="step-title">Upload Product</h3>
              <p className="step-desc">Add your product details, photo, and price in seconds</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3 className="step-title">Share Link</h3>
              <p className="step-desc">Get your unique link and share it on WhatsApp or social media</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3 className="step-title">Get Paid</h3>
              <p className="step-desc">Buyers pay via Flutterwave and you get notified instantly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="section" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose SellSnap</h2>
            <p className="section-subtitle">Built for Nigerian businesses who want speed and simplicity</p>
          </div>
          <div className="features">
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Lightning Fast</h3>
              <p className="feature-desc">Create a product and start selling in under 60 seconds</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Mobile Optimized</h3>
              <p className="feature-desc">Your buyers get a seamless checkout experience on any device</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure Payments</h3>
              <p className="feature-desc">Powered by Flutterwave with bank-level security</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Commerce Benefits */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Built for Social Commerce</h2>
            <p className="section-subtitle">Sell where your customers already are</p>
          </div>
          <div className="benefits">
            <div className="benefit">
              <span className="benefit-check">✓</span>
              <div className="benefit-content">
                <h4 className="benefit-title">WhatsApp Integration</h4>
                <p className="benefit-desc">Share product links directly in chats and get instant orders</p>
              </div>
            </div>
            <div className="benefit">
              <span className="benefit-check">✓</span>
              <div className="benefit-content">
                <h4 className="benefit-title">Social Media Ready</h4>
                <p className="benefit-desc">Perfect for Instagram, Facebook, and Twitter sales</p>
              </div>
            </div>
            <div className="benefit">
              <span className="benefit-check">✓</span>
              <div className="benefit-content">
                <h4 className="benefit-title">No Website Needed</h4>
                <p className="benefit-desc">Sell directly without the cost and complexity of building a store</p>
              </div>
            </div>
            <div className="benefit">
              <span className="benefit-check">✓</span>
              <div className="benefit-content">
                <h4 className="benefit-title">Instant Notifications</h4>
                <p className="benefit-desc">Get notified the moment a sale happens</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer style={{ borderTop: '1px solid var(--color-border)', padding: '32px 0', marginTop: 'auto' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ font: 'var(--sys-font-body-medium)', color: 'var(--color-ink-muted)' }}>
              © {new Date().getFullYear()} SellSnap. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <Link href="#" style={{ font: 'var(--sys-font-label-medium)', color: 'var(--color-ink-muted)', textDecoration: 'none' }}>
                Privacy
              </Link>
              <Link href="#" style={{ font: 'var(--sys-font-label-medium)', color: 'var(--color-ink-muted)', textDecoration: 'none' }}>
                Terms
              </Link>
              <Link href="#" style={{ font: 'var(--sys-font-label-medium)', color: 'var(--color-ink-muted)', textDecoration: 'none' }}>
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
