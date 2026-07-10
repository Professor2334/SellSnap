import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { PayNowButton } from './PayNowButton';
import { ShieldCheck, Zap, Lock } from 'lucide-react';

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const product = await db.product.findUnique({
    where: { uniqueSlug: params.slug },
    include: { user: true },
  });

  if (!product) return {};

  return {
    title: `${product.name} — ₦${product.price.toLocaleString()}`,
    description: product.description || `Buy ${product.name} for ₦${product.price.toLocaleString()}`,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductPublicPage({ params }: { params: { slug: string } }) {
  const product = await db.product.findUnique({
    where: { uniqueSlug: params.slug },
    include: { user: true },
  });

  if (!product) {
    notFound();
  }

  const businessName = product.user.businessName || product.user.name;
  const formattedPrice = `₦${product.price.toLocaleString()}`;

  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          background-color: #FFFFFF; 
          font-family: var(--font-inter, system-ui, sans-serif); 
        }

        .checkout-container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 48px 24px;
          display: grid;
          grid-template-columns: minmax(auto, 460px) 1fr; /* Slightly reduced from 520px */
          gap: 64px;
          align-items: start;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .checkout-container {
            grid-template-columns: 1fr;
            padding: 24px 16px 48px;
            gap: 32px;
          }
        }

        .image-gallery {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .main-image-container {
          position: relative;
          width: 100%;
          max-width: 460px; /* Reduced from 560px */
          max-height: 420px; /* Reduced from 480px */
          aspect-ratio: 4/3;
          background-color: var(--color-surface, #F7F7F5);
          border-radius: 16px;
          border: 1px solid var(--color-border, #E5E7EB);
          box-shadow: 0 8px 30px rgba(0,0,0,0.04);
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .main-image-container {
            aspect-ratio: 1/1;
          }
        }

        .thumbnails {
          display: flex;
          gap: 12px;
        }

        .thumbnail {
          width: 72px;
          height: 72px;
          border-radius: 8px;
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          background-color: var(--color-surface, #F7F7F5);
          transition: border-color 0.2s ease;
        }
        
        .thumbnail:hover {
          border-color: var(--color-border, #E5E7EB);
        }
        
        .thumbnail.active {
          border-color: #0066FF;
        }

        .product-info {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .title-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .seller-name {
          font-size: 0.875rem;
          color: var(--color-ink-muted, #5A6270);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .product-title {
          font-size: clamp(32px, 5vw, 40px);
          font-weight: 700;
          color: var(--color-ink, #0F1115);
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .product-price {
          font-size: clamp(24px, 4vw, 32px);
          font-weight: 800;
          color: var(--color-brand, #1A7F3C);
          letter-spacing: -0.02em;
        }

        .product-description {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--color-ink-muted, #5A6270);
        }

        .product-cta-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .trust-features {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
        }

        .trust-feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.875rem;
          color: var(--color-ink-muted, #5A6270);
          font-weight: 400; /* Softer text weight */
        }
        
        .trust-icon {
          color: var(--color-brand, #1A7F3C); /* Brand color for hierarchy */
          opacity: 0.9;
        }
      `}</style>

      <main style={{ minHeight: '100dvh', backgroundColor: '#FFFFFF' }}>
        <div className="checkout-container">
          
          {/* Left Column: Image Gallery */}
          <div className="image-gallery">
            <div className="main-image-container">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 55vw"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-ink-subtle, #9AA1AD)',
                  }}
                >
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
            </div>

            {/* Support for future multiple images */}
            {product.imageUrl && (
              <div className="thumbnails">
                <div className="thumbnail active">
                  <Image
                    src={product.imageUrl}
                    alt={`${product.name} thumbnail`}
                    fill
                    sizes="72px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Form */}
          <div className="product-info">
            <div className="title-section">
              <span className="seller-name">{businessName}</span>
              <h1 className="product-title">{product.name}</h1>
              <span className="product-price">{formattedPrice}</span>
            </div>

            {product.description && (
              <p className="product-description">{product.description}</p>
            )}

            <div className="product-cta-container">
              <PayNowButton slug={product.uniqueSlug} />
              
              <div className="trust-features">
                <div className="trust-feature-item">
                  <ShieldCheck size={18} className="trust-icon" />
                  <span>Secure checkout</span>
                </div>
                <div className="trust-feature-item">
                  <Zap size={18} className="trust-icon" />
                  <span>Instant payment confirmation</span>
                </div>
                <div className="trust-feature-item">
                  <Lock size={18} className="trust-icon" />
                  <span>Your payment is encrypted</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </>
  );
}
