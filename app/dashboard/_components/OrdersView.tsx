'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/FormPrimitives';
import { DeleteProductButton } from './DashboardUtils';
import { EmptyState } from './EmptyState';
import { Order, PageHeader } from './DashboardShared';

export function OrdersView({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState<'All Orders' | 'PENDING' | 'PAID' | 'REFUNDED'>('All Orders');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

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

      <div className="dashboard-toolbar">
        <div style={{ position: 'relative', flex: 1, opacity: orders.length === 0 ? 0.6 : 1 }}>
          <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 1, display: 'flex', pointerEvents: 'none', opacity: 0.5 }}>
            <Icon name="Search" size={18} className="text-ink-subtle" aria-hidden="true" />
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
              aria-hidden="true"
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
              backgroundColor: 'var(--sys-neutral-container-lowest)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              boxShadow: '0 20px 40px -8px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.05)',
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
                      backgroundColor: isActive ? 'color-mix(in srgb, var(--sys-primary-color-role) 8%, transparent)' : 'transparent',
                      color: isActive ? 'var(--sys-primary-color-role)' : 'var(--color-ink)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--color-ink) 4%, transparent)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {option.label}
                    {isActive && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

      <div className="card-container" style={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -8px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.02)', overflow: 'hidden', marginTop: 24 }}>
        {filteredOrders.length === 0 ? (
          <EmptyState 
            title="No orders yet" 
            description="Paid orders will automatically appear here." 
            actionLabel="View Products"
            actionHref="/dashboard?tab=products"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredOrders.map((order, index) => (
              <div 
                key={order.id}
                className="product-row"
                style={{ 
                  borderBottom: index !== filteredOrders.length - 1 ? '1px solid var(--color-border)' : 'none',
                  transition: 'background-color 150ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--color-ink) 4%, transparent)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
              >
                {/* Left Side / Main Info */}
                <div className="product-row-main">
                  <div className="product-row-image" style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: 'var(--dk-card-elevated-bg)', border: '1px solid var(--color-border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                    {order.product.imageUrl ? (
                      <Image src={order.product.imageUrl} alt={order.product.name} fill style={{ objectFit: 'cover' }} sizes="48px" />
                    ) : (
                      <Icon name="Products" size={20} className="text-ink-subtle" aria-hidden="true" />
                    )}
                  </div>
                  <div className="product-row-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <h3 className="text-body-sm font-bold text-ink" style={{ wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{order.product.name}</h3>
                      <span className="text-caption font-semibold"
                        style={{
                          padding: '2px 8px', borderRadius: 4,
                          textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.6875rem',
                          backgroundColor: order.status === 'PAID' ? 'color-mix(in srgb, var(--color-success) 12%, transparent)' : 'color-mix(in srgb, var(--color-warning) 12%, transparent)',
                          color: order.status === 'PAID' ? 'var(--color-success)' : 'var(--color-warning)',
                          whiteSpace: 'nowrap'
                        }}>
                        {order.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 2 }}>
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
                    {/* Reference ID aligned with text */}
                    <div style={{ marginTop: 4 }}>
                      <p className="text-caption font-mono text-ink-subtle" style={{ textTransform: 'uppercase' }}>
                        #{order.transactionReference.split('_').pop()}
                      </p>
                    </div>
                  </div>

                  {/* Unified Overflow Menu (Top Right on Mobile) */}
                  <div className="hide-on-desktop flex-shrink-0" style={{ marginLeft: 8, marginTop: -4 }} onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu.Root modal={false}>
                      <DropdownMenu.Trigger asChild>
                        <Button variant="secondary" size="sm" style={{ padding: '0 8px' }} aria-label="More actions">
                          <Icon name="MoreVertical" size={18} aria-hidden="true" />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content side="top" align="end" sideOffset={4} className="animate-fade-in-up" style={{ width: '210px', backgroundColor: 'var(--sys-neutral-container-lowest)', borderRadius: '12px', boxShadow: '0 20px 40px -8px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.05)', border: '1px solid var(--color-border)', padding: '8px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <DropdownMenu.Item asChild>
                            <Link href={`/dashboard/products/${order.product.id}/edit`} className="dropdown-item">Open Product</Link>
                          </DropdownMenu.Item>
                          <DropdownMenu.Item asChild>
                            <Link href={`/p/${order.product.uniqueSlug}`} target="_blank" className="dropdown-item">Preview Customer Page</Link>
                          </DropdownMenu.Item>
                          <DropdownMenu.Separator style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '4px 0' }} />
                          <DropdownMenu.Item asChild>
                            <div style={{ cursor: 'pointer' }}><DeleteProductButton id={order.product.id} /></div>
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                </div>

                {/* Right Side / Actions */}
                <div className="hide-on-mobile" onClick={(e) => e.stopPropagation()}>
                  <div className="product-row-actions">
                  
                  {/* Desktop Overflow Menu */}
                  <div>
                    <DropdownMenu.Root modal={false}>
                      <DropdownMenu.Trigger asChild>
                        <Button variant="secondary" size="sm" style={{ padding: '0 8px' }} aria-label="More actions">
                          <Icon name="MoreVertical" size={18} aria-hidden="true" />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content side="top" align="end" sideOffset={4} className="animate-fade-in-up" style={{ width: '210px', backgroundColor: 'var(--sys-neutral-container-lowest)', borderRadius: '12px', boxShadow: '0 20px 40px -8px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.05)', border: '1px solid var(--color-border)', padding: '8px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <DropdownMenu.Item asChild>
                            <Link href={`/dashboard/products/${order.product.id}/edit`} className="dropdown-item">Open Product</Link>
                          </DropdownMenu.Item>
                          <DropdownMenu.Item asChild>
                            <Link href={`/p/${order.product.uniqueSlug}`} target="_blank" className="dropdown-item">Preview Customer Page</Link>
                          </DropdownMenu.Item>
                          <DropdownMenu.Separator style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '4px 0' }} />
                          <DropdownMenu.Item asChild>
                            <div style={{ cursor: 'pointer' }}><DeleteProductButton id={order.product.id} /></div>
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
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
