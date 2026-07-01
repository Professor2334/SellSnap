'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import Image from 'next/image';
import { DeleteProductButton, CopyLinkButton } from './DashboardUtils';

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

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '12px', fontWeight: 600, color }}>
      {isUp ? '↑' : isDown ? '↓' : '–'}
      {' '}
      {isUp || isDown ? `${display}%` : 'steady'}
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
        <h1 className="text-display font-bold text-ink" style={{ marginBottom: 4 }}>{title}</h1>
        <p className="text-body-sm text-ink-muted">{subtitle}</p>
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
        subtitle={`Welcome back, ${userName}`}
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
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
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
          <p className="text-h1 font-bold text-ink" style={{ lineHeight: 1 }}>{totalOrders}</p>
        </div>

        <div className="card-stat">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <p className="card-stat-label">Active Products</p>
            <GrowthBadge value={productsGrowth} />
          </div>
          <p className="text-h1 font-bold text-ink" style={{ lineHeight: 1 }}>{totalProducts}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-h2 font-semibold text-ink" style={{ marginBottom: 16 }}>Recent Orders</h2>
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
        action={
          <Link href="/dashboard/products/new">
            <Button size="lg" variant="primary">Create Product</Button>
          </Link>
        }
      />

      {products.length === 0 ? (
        <div className="card-container" style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
          <div style={{ textAlign: 'center' }}>
            <EmptyIcon name="Products" />
            <h3 className="text-h2 font-bold text-ink" style={{ marginBottom: 8 }}>No products yet</h3>
            <p className="text-body-sm text-ink-muted" style={{ maxWidth: 300, margin: '0 auto 24px' }}>
              Create your first product to get a unique link you can share on WhatsApp or social media.
            </p>
            <Link href="/dashboard/products/new">
              <Button size="md" variant="primary">Create Your First Product</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {products.map((product) => (
            <div key={product.id} className="card-container" style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 52, height: 52,
                  borderRadius: '12px',
                  backgroundColor: 'var(--primitive-neutral95)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, overflow: 'hidden',
                }}>
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.name} width={52} height={52} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Icon name="Products" size={22} className="text-ink-subtle" />
                  )}
                </div>
                <div>
                  <h3 className="text-body font-bold text-ink">{product.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                    <p className="text-body-sm font-semibold text-brand">₦{product.price.toLocaleString()}</p>
                    <span style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: 'var(--color-ink-subtle)' }} />
                    <p className="text-caption text-ink-muted">{new Date(product.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Link href={`/p/${product.uniqueSlug}`} target="_blank" className="text-body-sm text-ink-muted font-medium hover:text-brand transition-colors">
                  View Page
                </Link>
                <div style={{ width: 1, height: 16, backgroundColor: 'var(--color-border)' }} />
                <CopyLinkButton slug={product.uniqueSlug} />
                <DeleteProductButton id={product.id} />
              </div>
            </div>
          ))}
        </div>
      )}
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

      {orders.length === 0 ? (
        <div className="card-container" style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
          <div style={{ textAlign: 'center' }}>
            <EmptyIcon name="Orders" />
            <h3 className="text-h2 font-bold text-ink" style={{ marginBottom: 8 }}>No orders yet</h3>
            <p className="text-body-sm text-ink-muted" style={{ maxWidth: 300, margin: '0 auto' }}>
              When a customer pays via your link, their order will appear here.
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
