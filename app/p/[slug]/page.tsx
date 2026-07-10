import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { PayNowButton } from './PayNowButton';

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
        body { background-color: var(--color-surface, #F7F7F5); font-family: var(--font-inter, system-ui, sans-serif); }
      `}</style>

      <main
        style={{
          minHeight: '100dvh',
          backgroundColor: 'var(--color-surface, #F7F7F5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Product Card */}
        <div
          style={{
            width: '100%',
            maxWidth: '480px',
            minHeight: '100dvh',
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* ── Product Image ── */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', backgroundColor: 'var(--color-surface, #F7F7F5)', flexShrink: 0 }}>
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 480px) 100vw, 480px"
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

          {/* ── Product Info ── */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              padding: '24px 20px 0',
              gap: '12px',
            }}
          >
            {/* Seller name */}
            <p
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--color-ink-muted, #5A6270)',
                letterSpacing: '0.01em',
              }}
            >
              {businessName}
            </p>

            {/* Product name */}
            <h1
              style={{
                fontSize: 'clamp(22px, 6vw, 28px)',
                fontWeight: 700,
                color: 'var(--color-ink, #0F1115)',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
              }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <p
              style={{
                fontSize: 'clamp(20px, 5.5vw, 26px)',
                fontWeight: 800,
                color: 'var(--color-brand, #1A7F3C)',
                letterSpacing: '-0.02em',
              }}
            >
              {formattedPrice}
            </p>

            {/* Description */}
            {product.description && (
              <p
                style={{
                  fontSize: '15px',
                  lineHeight: 1.6,
                  color: 'var(--color-ink-muted, #5A6270)',
                  marginTop: '4px',
                }}
              >
                {product.description}
              </p>
            )}
          </div>

          {/* ── Sticky Pay Now footer ── */}
          <div
            style={{
              position: 'sticky',
              bottom: 0,
              backgroundColor: '#fff',
              padding: '16px 20px',
              paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
              borderTop: '1px solid var(--color-border, #E5E7EB)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginTop: '24px',
            }}
          >
            <PayNowButton slug={product.uniqueSlug} />

            {/* Trust badges */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '12px',
                  color: 'var(--color-ink-subtle, #9AA1AD)',
                  fontWeight: 500,
                }}
              >
                {/* Lock icon */}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Secure payment
              </span>
              <span style={{ width: '1px', height: '12px', backgroundColor: 'var(--color-border, #E5E7EB)' }} />
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--color-ink-subtle, #9AA1AD)',
                  fontWeight: 500,
                }}
              >
                Powered by{' '}
                <span style={{ color: 'var(--color-brand, #1A7F3C)', fontWeight: 600 }}>SellSnap</span>
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
