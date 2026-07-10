'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import Image from 'next/image';
import { DeleteProductButton, CopyLinkButton } from './DashboardUtils';
import { Input } from '@/components/ui/FormPrimitives';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  uniqueSlug: string;
  createdAt: Date;
  orders: { id: string; status: string; amount: number; createdAt: Date }[];
};

type Order = {
  id: string;
  amount: number;
  status: string;
  transactionReference: string;
  buyerEmail: string | null;
  createdAt: Date;
  product: { name: string; uniqueSlug: string };
};

function GrowthBadge({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const isUp = value > 0;
  const isDown = value < 0;
  const color = isUp ? 'var(--color-success)' : isDown ? 'var(--sys-error-color-role)' : 'var(--color-ink-subtle)';
  const target = Math.abs(value);

  useEffect(() => {
    setDisplay(0);
    if (value === 0) return;
    const duration = 1000;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplay(target);
        clearInterval(interval);
      } else {
        setDisplay(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [target, value]);

  if (!isUp && !isDown) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 500, color: 'var(--color-ink-muted)' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'color-mix(in srgb, var(--color-success) 20%, transparent)' }} />
        Steady
      </span>
    );
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '12px', fontWeight: 600, color }}>
      {isUp ? '↑' : '↓'}
      {' '}
      {`${display}%`}
    </span>
  );
}

/* ── Shared elevated page header ─────────────────────── */
function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="dashboard-page-header">
      <div>
        <h1 className="text-display font-bold text-ink" style={{ marginBottom: 8 }}>{title}</h1>
        <p className="text-body-sm text-ink-muted" style={{ opacity: 0.9 }}>{subtitle}</p>
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}

/* ── Empty state icon cell ────────────────────────────── */
function EmptyIcon({ name }: { name: 'Orders' | 'Products' }) {
  return (
    <div style={{
      width: 52, height: 52,
      borderRadius: '14px',
      backgroundColor: 'var(--primitive-neutral95)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 16px',
    }}>
      <Icon name={name} size={24} className="text-ink-subtle" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Dashboard Overview
══════════════════════════════════════════════════════ */
export function DashboardView({
  userName,
  totalRevenue,
  totalOrders,
  totalProducts,
  revenueGrowth,
  ordersGrowth,
  productsGrowth,
  recentOrders,
}: {
  userName: string;
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  productsGrowth: number;
  recentOrders: Order[];
}) {
  return (
    <div className="w-full animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Elevated header card */}
      <PageHeader
        title="Dashboard"
        subtitle="Manage your products, orders, and sales in one place."
        action={
          <Link href="/dashboard/products/new">
            <Button size="lg" variant="primary">Create Product</Button>
          </Link>
        }
      />

      {/* KPI Cards */}
      <div className="dashboard-stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div className="card-stat">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <p className="card-stat-label">Total Revenue</p>
            <GrowthBadge value={revenueGrowth} />
          </div>
          <div className="card-value-container" style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span className="text-h2 font-bold text-ink-muted">₦</span>
            <p className="text-h1 font-bold text-ink" style={{ lineHeight: 1 }}>
              {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="card-stat">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <p className="card-stat-label">Total Orders</p>
            <GrowthBadge value={ordersGrowth} />
          </div>
          <div className="card-value-container">
            <p className="text-h1 font-bold text-ink" style={{ lineHeight: 1 }}>{totalOrders}</p>
          </div>
        </div>

        <div className="card-stat">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <p className="card-stat-label">Active Products</p>
            <GrowthBadge value={productsGrowth} />
          </div>
          <div className="card-value-container">
            <p className="text-h1 font-bold text-ink" style={{ lineHeight: 1 }}>{totalProducts}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ marginTop: 24 }}>
        <h2 className="text-h2 font-semibold text-ink" style={{ marginBottom: 16, marginLeft: 28 }}>Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <div className="card-container" style={{ minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
            <div style={{ textAlign: 'center' }}>
              <EmptyIcon name="Orders" />
              <h3 className="text-h2 font-bold text-ink" style={{ marginBottom: 8 }}>No orders yet</h3>
              <p className="text-body-sm text-ink-muted" style={{ maxWidth: 300, margin: '0 auto' }}>
                Your recent sales will appear here. Start sharing your links to get paid!
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentOrders.map((order) => (
              <div key={order.id} className="card-container" style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <p className="text-body font-semibold text-ink">{order.product.name}</p>
                  <p className="text-caption text-ink-muted">₦{order.amount.toLocaleString()}</p>
                </div>
                <span className="text-caption font-semibold"
                  style={{
                    padding: '3px 10px', borderRadius: 6,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    backgroundColor: order.status === 'PAID' ? 'color-mix(in srgb, var(--color-success) 12%, transparent)' : 'color-mix(in srgb, var(--color-warning) 12%, transparent)',
                    color: order.status === 'PAID' ? 'var(--color-success)' : 'var(--color-warning)',
                  }}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Products
══════════════════════════════════════════════════════ */
export function ProductsView({ products }: { products: Product[] }) {
  return (
    <div className="w-full animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      <PageHeader
        title="Products"
        subtitle="Manage your products and their shareable payment links."
      />

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '0 28px' }}>
        <div style={{ position: 'relative', flex: 1, opacity: products.length === 0 ? 0.6 : 1 }}>
          <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 1, display: 'flex', pointerEvents: 'none', opacity: 0.5 }}>
            <Icon name="Search" size={18} className="text-ink-subtle" />
          </div>
          <Input 
            className="dashboard-search-input"
            placeholder="Search products..." 
            disabled={products.length === 0}
            style={{ cursor: products.length === 0 ? 'not-allowed' : 'text' }}
          />
        </div>
        <Button 
          variant="secondary" 
          className="dashboard-filter-button"
          disabled={products.length === 0}
          style={{ opacity: products.length === 0 ? 0.6 : 1, cursor: products.length === 0 ? 'not-allowed' : 'pointer', minWidth: '130px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          All Products <span style={{ fontSize: '10px' }}>▼</span>
        </Button>
        <Link href="/dashboard/products/new" style={{ textDecoration: 'none' }}>
          <Button variant="primary" style={{ height: '48px', padding: '0 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 600 }}>
            Create Product
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="card-container" style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{
                position: 'absolute', inset: -30,
                background: 'radial-gradient(circle, var(--color-brand) 0%, transparent 70%)',
                opacity: 0.08, filter: 'blur(20px)', zIndex: 0
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <EmptyIcon name="Products" />
              </div>
            </div>
            <h3 className="text-h2 font-bold text-ink" style={{ marginBottom: 8, marginTop: 16 }}>No products yet</h3>
            <p className="text-body-sm text-ink-muted" style={{ maxWidth: 300, margin: '0 auto 24px', opacity: 0.85 }}>
              Create a product and start sharing your payment link.
            </p>
            <Link href="/dashboard/products/new">
              <Button size="md" variant="primary">Create Your First Product</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductRow({ product }: { product: Product }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isMenuOpen]);

  return (
    <div className="product-row">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div className="product-row-image">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} width={64} height={64} />
          ) : (
            <Icon name="Products" size={24} className="text-ink-subtle" />
          )}
        </div>
        <div>
          <h3 className="text-ink" style={{ fontSize: '18px', fontWeight: 600 }}>{product.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <p className="text-brand" style={{ fontSize: '16px', fontWeight: 500 }}>₦{product.price.toLocaleString()}</p>
            <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--color-border)' }} />
            <p className="text-ink-muted" style={{ fontSize: '14px' }}>
              Created {new Date(product.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <CopyLinkButton slug={product.uniqueSlug} />
        <Link href={`/dashboard/products/${product.id}/edit`} style={{ textDecoration: 'none' }}>
          <Button variant="secondary" size="sm">Edit</Button>
        </Link>

        <div style={{ position: 'relative' }} ref={menuRef}>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ padding: '0 8px' }}
            aria-label="More actions"
          >
            <Icon name="More" size={18} />
          </Button>

          {isMenuOpen && (
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                width: '180px',
                backgroundColor: 'var(--sys-neutral-container-lowest)',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.10)',
                border: '1px solid var(--color-border)',
                padding: '8px',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <button disabled className="text-body-sm font-medium hover:bg-gray-50 transition-colors" style={{ width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: '8px', color: 'var(--color-ink)', backgroundColor: 'transparent', border: 'none', opacity: 0.5, cursor: 'not-allowed' }}>
                Duplicate
              </button>
              <button disabled className="text-body-sm font-medium hover:bg-gray-50 transition-colors" style={{ width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: '8px', color: 'var(--color-ink)', backgroundColor: 'transparent', border: 'none', opacity: 0.5, cursor: 'not-allowed' }}>
                Archive
              </button>
              <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '4px 0' }} />
              <div onClick={() => setIsMenuOpen(false)}>
                <DeleteProductButton id={product.id} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Orders
══════════════════════════════════════════════════════ */
export function OrdersView({ orders }: { orders: Order[] }) {
  return (
    <div className="w-full animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      <PageHeader
        title="Orders"
        subtitle="Track and manage your sales performance and customer orders."
      />

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '0 28px' }}>
        <div style={{ position: 'relative', flex: 1, opacity: orders.length === 0 ? 0.6 : 1 }}>
          <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 1, display: 'flex', pointerEvents: 'none', opacity: 0.5 }}>
            <Icon name="Search" size={18} className="text-ink-subtle" />
          </div>
          <Input 
            className="dashboard-search-input"
            placeholder="Search orders..." 
            disabled={orders.length === 0}
            style={{ cursor: orders.length === 0 ? 'not-allowed' : 'text' }}
          />
        </div>
        <Button 
          variant="secondary" 
          className="dashboard-filter-button"
          disabled={orders.length === 0}
          style={{ opacity: orders.length === 0 ? 0.6 : 1, cursor: orders.length === 0 ? 'not-allowed' : 'pointer', minWidth: '130px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          All Orders <span style={{ fontSize: '10px' }}>▼</span>
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="card-container" style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{ 
                position: 'absolute', inset: -30,
                background: 'radial-gradient(circle, var(--color-brand) 0%, transparent 70%)',
                opacity: 0.08, filter: 'blur(20px)', zIndex: 0
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <EmptyIcon name="Orders" />
              </div>
            </div>
            <h3 className="text-h2 font-bold text-ink" style={{ marginBottom: 8, marginTop: 16 }}>No orders yet</h3>
            <p className="text-body-sm text-ink-muted" style={{ maxWidth: 300, margin: '0 auto', opacity: 0.85 }}>
              Paid orders will automatically appear here.
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map((order) => (
            <div key={order.id} className="card-container" style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h3 className="text-body font-bold text-ink">{order.product.name}</h3>
                  <span className="text-caption font-semibold"
                    style={{
                      padding: '2px 10px', borderRadius: 6,
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                      backgroundColor: order.status === 'PAID' ? 'color-mix(in srgb, var(--color-success) 12%, transparent)' : 'color-mix(in srgb, var(--color-warning) 12%, transparent)',
                      color: order.status === 'PAID' ? 'var(--color-success)' : 'var(--color-warning)',
                    }}>
                    {order.status}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <p className="text-body-sm font-semibold text-ink">₦{order.amount.toLocaleString()}</p>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: 'var(--color-ink-subtle)' }} />
                  <p className="text-caption text-ink-muted">{new Date(order.createdAt).toLocaleDateString()}</p>
                  {order.buyerEmail && (
                    <>
                      <span style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: 'var(--color-ink-subtle)' }} />
                      <p className="text-caption text-ink-muted">{order.buyerEmail}</p>
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <p className="text-caption font-mono text-ink-subtle" style={{ textTransform: 'uppercase' }}>
                  #{order.transactionReference.split('_').pop()}
                </p>
                <div style={{ width: 1, height: 16, backgroundColor: 'var(--color-border)' }} />
                <Link href={`/p/${order.product.uniqueSlug}`} target="_blank" className="text-body-sm text-brand font-medium hover:underline">
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
