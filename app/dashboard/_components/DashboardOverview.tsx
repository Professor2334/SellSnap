'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Order, GrowthBadge, PageHeader } from './DashboardShared';

export function DashboardOverview({
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
    <div className="w-full animate-fade-in-up dashboard-view-container">

      {/* Elevated header card */}
      <PageHeader
        title="Dashboard"
        subtitle="Manage your products, orders, and sales in one place."
        staticOnMobile
        action={
          <Link href="/dashboard/products/new">
            <Button size="lg" variant="primary">Create Product</Button>
          </Link>
        }
      />

      {/* KPI Cards */}
      <div className="dashboard-stats-row">
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
      <div className="recent-orders-container">
        <div className="card-container" style={{ padding: '24px', backgroundColor: 'var(--color-surface)', borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -8px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.02)' }}>
          <h2 className="text-h2 font-semibold text-ink" style={{ marginBottom: 24 }}>Recent Orders</h2>
          
          {recentOrders.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', textAlign: 'center', gap: '12px' }}>
              <div>
                <h3 className="text-body font-bold text-ink" style={{ marginBottom: 4 }}>No orders yet</h3>
                <p className="text-body-sm text-ink-muted" style={{ maxWidth: 300, margin: '0 auto' }}>
                  Your first customer orders will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {recentOrders.map((order, index) => (
                <div 
                  key={order.id} 
                  className="animate-fade-in-up"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '16px 0',
                    borderBottom: index !== recentOrders.length - 1 ? '1px solid var(--color-border)' : 'none',
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both',
                    gap: 16
                  }}
                >
                  {/* Left Side */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                      {order.product.imageUrl ? (
                        <Image src={order.product.imageUrl} alt={order.product.name} fill style={{ objectFit: 'cover' }} sizes="48px" />
                      ) : (
                        <Icon name="Products" size={20} className="text-ink-subtle" />
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <p className="text-body-sm font-semibold text-ink">{order.product.name}</p>
                      <p className="text-caption text-ink-muted font-medium">₦{order.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {/* Right Side */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span className="text-caption font-semibold"
                      style={{
                        padding: '2px 8px', borderRadius: 4,
                        textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.6875rem',
                        backgroundColor: order.status === 'PAID' ? 'color-mix(in srgb, var(--color-success) 12%, transparent)' : 'color-mix(in srgb, var(--color-warning) 12%, transparent)',
                        color: order.status === 'PAID' ? 'var(--color-success)' : 'var(--color-warning)',
                      }}>
                      {order.status}
                    </span>
                    <p className="text-caption text-ink-muted">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
