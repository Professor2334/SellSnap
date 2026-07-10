'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import Image from 'next/image';
import { DeleteProductButton, CopyLinkButton } from './DashboardUtils';
import { Input } from '@/components/ui/FormPrimitives';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

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
  product: { id: string; name: string; uniqueSlug: string; imageUrl: string | null };
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
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-ink-muted)' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'color-mix(in srgb, var(--color-success) 20%, transparent)' }} />
        Steady
      </span>
    );
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.75rem', fontWeight: 600, color }}>
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
        <div className="card-container" style={{ padding: '24px', backgroundColor: '#FFFFFF', borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -8px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.02)' }}>
          <h2 className="text-h2 font-semibold text-ink" style={{ marginBottom: 24 }}>Recent Orders</h2>
          
          {recentOrders.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', textAlign: 'center', gap: '12px' }}>
              <span style={{ fontSize: '2rem' }}>📦</span>
              <div>
                <h3 className="text-body font-bold text-ink" style={{ marginBottom: 4 }}>No orders yet</h3>
                <p className="text-body-sm text-ink-muted" style={{ maxWidth: 300, margin: '0 auto' }}>
                  Your first customer orders will appear here.
                </p>
              </div>
              <Link href="/dashboard/products" style={{ marginTop: 8 }}>
                <Button variant="secondary" size="sm">View Products</Button>
              </Link>
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

/* ═══════════════════════════════════════════════════════
   Products
══════════════════════════════════════════════════════ */
export function ProductsView({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<'All Products' | 'Active'>('All Products');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const filterRef = useRef<HTMLDivElement>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filterOptions = [
    { label: 'All Products', value: 'All Products' },
    { label: 'Active', value: 'Active' },
  ];

  useEffect(() => {
    if (!isFilterOpen) {
      setFocusedIndex(-1);
      return;
    }
    
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsFilterOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(prev => (prev < filterOptions.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault();
        setFilter(filterOptions[focusedIndex].value as any);
        setIsFilterOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFilterOpen, focusedIndex, filterOptions.length]);

  const filteredProducts = products.filter(product => {
    // Placeholder logic for 'Active' since the database lacks the field
    return true; 
  });

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
        <div style={{ position: 'relative' }} ref={filterRef}>
          <Button 
            variant="secondary" 
            className="dashboard-filter-button"
            disabled={products.length === 0}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            style={{ opacity: products.length === 0 ? 0.6 : 1, cursor: products.length === 0 ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}
          >
            {filterOptions.find(o => o.value === filter)?.label}
            <svg 
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: isFilterOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 150ms ease' }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </Button>

          {isFilterOpen && (
            <div className="animate-fade-in-up" style={{
              position: 'absolute',
              bottom: '100%',
              right: 0,
              marginBottom: '8px',
              width: '160px',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '12px',
              boxShadow: '0 20px 40px -8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
              padding: '8px',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              {filterOptions.map((option, index) => {
                const isActive = filter === option.value;
                const isFocused = focusedIndex === index;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilter(option.value as any);
                      setIsFilterOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: 'none',
                      transition: 'background-color 150ms ease, color 150ms ease',
                      backgroundColor: isActive ? 'color-mix(in srgb, var(--color-brand) 8%, transparent)' : isFocused ? 'rgba(0,0,0,0.04)' : 'transparent',
                      color: isActive ? 'var(--color-brand)' : 'var(--color-ink)',
                    }}
                    onMouseEnter={() => setFocusedIndex(index)}
                    onMouseLeave={() => setFocusedIndex(-1)}
                  >
                    {option.label}
                    {isActive && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <Link href="/dashboard/products/new" style={{ textDecoration: 'none' }}>
          <Button variant="primary" style={{ height: '48px', padding: '0 24px', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 600 }}>
            Create Product
          </Button>
        </Link>
      </div>

      <div className="card-container" style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -8px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
        {filteredProducts.length === 0 ? (
          <div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '2rem' }}>📦</span>
              <div>
                <h3 className="text-h2 font-bold text-ink" style={{ marginBottom: 4 }}>No products yet</h3>
                <p className="text-body-sm text-ink-muted" style={{ maxWidth: 300, margin: '0 auto', opacity: 0.85 }}>
                  Create your first product to start selling online.
                </p>
              </div>
              <Link href="/dashboard/products/new" style={{ marginTop: 12 }}>
                <Button size="md" variant="primary">Create Product</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredProducts.map((product, index) => (
              <ProductRow 
                key={product.id} 
                product={product} 
                isLast={index === filteredProducts.length - 1} 
                isOpen={openMenuId === product.id}
                onOpenChange={(open) => setOpenMenuId(open ? product.id : null)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductRow({ 
  product, 
  isLast,
  isOpen,
  onOpenChange 
}: { 
  product: Product, 
  isLast?: boolean,
  isOpen?: boolean,
  onOpenChange?: (open: boolean) => void 
}) {
  const router = useRouter();

  const handleRowClick = () => {
    router.push(`/dashboard/products/${product.id}/edit`);
  };

  const preventNav = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="product-row"
      onClick={handleRowClick}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '20px 24px',
        borderBottom: isLast ? 'none' : '1px solid rgba(0,0,0,0.05)',
        cursor: 'pointer',
        transition: 'background-color 150ms ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div className="product-row-image" style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', position: 'relative', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--color-border)' }}>
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="56px" />
          ) : (
            <Icon name="Products" size={24} className="text-ink-subtle" />
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h3 className="text-ink" style={{ fontSize: '1rem', fontWeight: 600 }}>{product.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <p className="text-brand" style={{ fontSize: '0.875rem', fontWeight: 600 }}>₦{product.price.toLocaleString()}</p>
            <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--color-border)' }} />
            <p className="text-ink-muted" style={{ fontSize: '0.75rem' }}>
              Created {new Date(product.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={preventNav}>
        <CopyLinkButton slug={product.uniqueSlug} />
        
        <Link href={`/dashboard/products/${product.id}/edit`} style={{ textDecoration: 'none' }} onClick={preventNav}>
          <Button variant="secondary" size="sm">Edit</Button>
        </Link>

        <div onClick={preventNav}>
          <DropdownMenu.Root open={isOpen} onOpenChange={onOpenChange}>
            <DropdownMenu.Trigger asChild>
              <Button 
                variant="secondary" 
                size="sm" 
                style={{ padding: '0 8px' }}
                aria-label="More actions"
              >
                <Icon name="More" size={18} />
              </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content 
                side="bottom" 
                align="end" 
                sideOffset={4}
                className="animate-fade-in-up"
                style={{
                  width: '180px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  boxShadow: '0 20px 40px -8px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.05)',
                  border: 'none',
                  padding: '8px',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <DropdownMenu.Item asChild>
                  <button disabled className="dropdown-item">
                    Duplicate
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <button disabled className="dropdown-item">
                    Archive
                  </button>
                </DropdownMenu.Item>
                
                <DropdownMenu.Separator style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '4px 0' }} />
                
                <DropdownMenu.Item asChild>
                  <div onClick={() => onOpenChange?.(false)} style={{ cursor: 'pointer' }}>
                    <DeleteProductButton id={product.id} />
                  </div>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Orders
══════════════════════════════════════════════════════ */
export function OrdersView({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState<'All Orders' | 'PENDING' | 'PAID' | 'REFUNDED'>('All Orders');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (!isFilterOpen) return;
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsFilterOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isFilterOpen]);

  const filteredOrders = orders.filter(order => {
    if (filter === 'All Orders') return true;
    return order.status.toUpperCase() === filter;
  });

  const filterOptions = [
    { label: 'All Orders', value: 'All Orders' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Paid', value: 'PAID' },
    { label: 'Refunded', value: 'REFUNDED' },
  ] as const;

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
        <div style={{ position: 'relative' }} ref={filterRef}>
          <Button 
            variant="secondary" 
            className="dashboard-filter-button"
            disabled={orders.length === 0}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            style={{ opacity: orders.length === 0 ? 0.6 : 1, cursor: orders.length === 0 ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}
          >
            {filterOptions.find(o => o.value === filter)?.label}
            <svg 
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: isFilterOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 150ms ease' }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </Button>

          {isFilterOpen && (
            <div className="animate-fade-in-up" style={{
              position: 'absolute',
              bottom: '100%',
              right: 0,
              marginBottom: '8px',
              width: '160px',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '12px',
              boxShadow: '0 20px 40px -8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
              padding: '8px',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              {filterOptions.map((option) => {
                const isActive = filter === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilter(option.value);
                      setIsFilterOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: 'none',
                      transition: 'background-color 150ms ease, color 150ms ease',
                      backgroundColor: isActive ? 'color-mix(in srgb, var(--color-brand) 8%, transparent)' : 'transparent',
                      color: isActive ? 'var(--color-brand)' : 'var(--color-ink)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {option.label}
                    {isActive && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="card-container" style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -8px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
        {filteredOrders.length === 0 ? (
          <div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '2rem' }}>📦</span>
              <div>
                <h3 className="text-h2 font-bold text-ink" style={{ marginBottom: 4 }}>No orders yet</h3>
                <p className="text-body-sm text-ink-muted" style={{ maxWidth: 300, margin: '0 auto', opacity: 0.85 }}>
                  Paid orders will automatically appear here.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredOrders.map((order, index) => (
              <div 
                key={order.id}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '16px 24px',
                  borderBottom: index !== filteredOrders.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                  gap: 16,
                  transition: 'background-color 150ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {/* Left Side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                    {order.product.imageUrl ? (
                      <Image src={order.product.imageUrl} alt={order.product.name} fill style={{ objectFit: 'cover' }} sizes="48px" />
                    ) : (
                      <Icon name="Products" size={20} className="text-ink-subtle" />
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <h3 className="text-body-sm font-bold text-ink">{order.product.name}</h3>
                      <span className="text-caption font-semibold"
                        style={{
                          padding: '2px 8px', borderRadius: 4,
                          textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.6875rem',
                          backgroundColor: order.status === 'PAID' ? 'color-mix(in srgb, var(--color-success) 12%, transparent)' : 'color-mix(in srgb, var(--color-warning) 12%, transparent)',
                          color: order.status === 'PAID' ? 'var(--color-success)' : 'var(--color-warning)',
                        }}>
                        {order.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <p className="text-caption font-semibold text-ink">₦{order.amount.toLocaleString()}</p>
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
                </div>

                {/* Right Side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <p className="text-caption font-mono text-ink-subtle" style={{ textTransform: 'uppercase' }}>
                    #{order.transactionReference.split('_').pop()}
                  </p>
                  
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu.Root open={openMenuId === order.id} onOpenChange={(open) => setOpenMenuId(open ? order.id : null)}>
                      <DropdownMenu.Trigger asChild>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          style={{ padding: '0 8px' }}
                          aria-label="More actions"
                        >
                          <Icon name="More" size={18} />
                        </Button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content 
                          side="bottom" 
                          align="end" 
                          sideOffset={4}
                          className="animate-fade-in-up"
                          style={{
                            width: '210px',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            boxShadow: '0 20px 40px -8px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.05)',
                            border: 'none',
                            padding: '8px',
                            zIndex: 100,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px'
                          }}
                        >
                          <DropdownMenu.Item asChild>
                            <Link href={`/dashboard/products/${order.product.id}/edit`} className="dropdown-item" onClick={() => setOpenMenuId(null)}>
                              Open Product
                            </Link>
                          </DropdownMenu.Item>
                          <DropdownMenu.Item asChild>
                            <Link href={`/p/${order.product.uniqueSlug}`} target="_blank" className="dropdown-item" onClick={() => setOpenMenuId(null)}>
                              Preview Customer Page
                            </Link>
                          </DropdownMenu.Item>
                          
                          <DropdownMenu.Separator style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '4px 0' }} />
                          
                          <DropdownMenu.Item asChild>
                            <div onClick={() => setOpenMenuId(null)} style={{ cursor: 'pointer' }}>
                              <DeleteProductButton id={order.product.id} />
                            </div>
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
