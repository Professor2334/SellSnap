'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/FormPrimitives';
import { DeleteProductButton, CopyLinkButton } from './DashboardUtils';
import { EmptyState } from './EmptyState';
import { Product, PageHeader, EmptyIcon } from './DashboardShared';

export function ProductsView({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<'All Products' | 'Active'>('All Products');
  const [sort, setSort] = useState<'Newest' | 'Oldest' | 'Price: High to Low' | 'Price: Low to High'>('Newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const filterOptions = [
    { label: 'All Products', value: 'All Products' },
    { label: 'Active', value: 'Active' },
  ];

  const sortOptions = [
    { label: 'Newest', value: 'Newest' },
    { label: 'Oldest', value: 'Oldest' },
    { label: 'Price: High to Low', value: 'Price: High to Low' },
    { label: 'Price: Low to High', value: 'Price: Low to High' },
  ];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const filteredProducts = products.filter(product => {
    return true; 
  }).sort((a, b) => {
    if (sort === 'Newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sort === 'Oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sort === 'Price: High to Low') return b.price - a.price;
    if (sort === 'Price: Low to High') return a.price - b.price;
    return 0;
  });

  return (
    <div className="w-full animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      <PageHeader
        title="Products"
        subtitle="Manage your products and their shareable payment links."
      />

      <div className="dashboard-toolbar">
        <div style={{ position: 'relative', flex: 1, opacity: products.length === 0 ? 0.6 : 1 }}>
          <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 1, display: 'flex', pointerEvents: 'none', opacity: 0.5 }}>
            <Icon name="Search" size={18} className="text-ink-subtle" aria-hidden="true" />
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
              {filterOptions.map((option, index) => {
                const isActive = filter === option.value;
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
                      backgroundColor: isActive ? 'color-mix(in srgb, var(--sys-primary-color-role) 8%, transparent)' : 'transparent',
                      color: isActive ? 'var(--sys-primary-color-role)' : 'var(--color-ink)',
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
        <div style={{ position: 'relative' }} ref={sortRef}>
          <Button 
            variant="secondary" 
            className="dashboard-filter-button"
            disabled={products.length === 0}
            onClick={() => setIsSortOpen(!isSortOpen)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsSortOpen(false);
            }}
            aria-haspopup="listbox"
            aria-expanded={isSortOpen}
            aria-label="Sort products"
            style={{ opacity: products.length === 0 ? 0.6 : 1, cursor: products.length === 0 ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}
          >
            {sortOptions.find(o => o.value === sort)?.label}
            <svg 
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: isSortOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 150ms ease' }}
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </Button>

          {isSortOpen && (
            <div 
              className="animate-fade-in-up" 
              role="listbox"
              style={{
                position: 'absolute',
                bottom: '100%',
                right: 0,
                marginBottom: '8px',
                width: '180px',
                backgroundColor: 'var(--sys-neutral-container-lowest)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                boxShadow: '0 20px 40px -8px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.05)',
                padding: '8px',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              {sortOptions.map((option) => {
                const isActive = sort === option.value;
                return (
                  <button
                    key={option.value}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      setSort(option.value as any);
                      setIsSortOpen(false);
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
        {filteredProducts.length === 0 ? (
          <EmptyState 
            title="No products yet" 
            description="Create your first product to start selling online." 
            actionLabel="Create Product" 
            actionHref="/dashboard/products/new" 
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredProducts.map((product, index) => (
              <ProductRow 
                key={product.id} 
                product={product} 
                isLast={index === filteredProducts.length - 1} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductRow({ 
  product, 
  isLast 
}: { 
  product: Product, 
  isLast?: boolean 
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
        borderBottom: isLast ? 'none' : '1px solid var(--color-border)',
        cursor: 'pointer',
        transition: 'background-color 150ms ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--color-ink) 4%, transparent)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
    >
      <div className="product-row-main">
        <div className="product-row-image" style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', position: 'relative', backgroundColor: 'var(--dk-card-elevated-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--color-border)' }}>
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="56px" />
          ) : (
            <Icon name="Products" size={24} className="text-ink-subtle" aria-hidden="true" />
          )}
        </div>
        <div className="product-row-info">
          <h3 className="text-ink" style={{ fontSize: '1rem', fontWeight: 600, wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-ink-muted)', fontSize: '0.875rem' }}>
            <span className="text-brand" style={{ fontWeight: 600 }}>₦{product.price.toLocaleString()}</span>
            <span style={{ margin: '0 8px' }}>•</span>
            <span>Created {new Date(product.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Unified Overflow Menu (Top Right on Mobile) */}
        <div className="hide-on-desktop flex-shrink-0" style={{ marginLeft: 8, marginTop: -4 }} onClick={preventNav}>
          <ProductOverflowMenu product={product} />
        </div>
      </div>

      <div className="product-row-actions" onClick={preventNav}>
        <CopyLinkButton slug={product.uniqueSlug} className="btn-full-mobile" />
        
        <Link href={`/dashboard/products/${product.id}/edit`} style={{ textDecoration: 'none' }} className="btn-full-mobile" onClick={preventNav}>
          <Button variant="secondary" size="sm" className="btn-full-mobile">Edit Product</Button>
        </Link>

        {/* Desktop Overflow Menu */}
        <div className="hide-on-mobile" onClick={preventNav}>
          <ProductOverflowMenu product={product} />
        </div>
      </div>
    </div>
  );
}

function ProductOverflowMenu({ product }: { product: Product }) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <Button 
          variant="secondary" 
          size="sm" 
          style={{ padding: '0 8px' }}
          aria-label="More actions"
        >
          <Icon name="MoreVertical" size={18} aria-hidden="true" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content 
          side="top" 
          align="end" 
          sideOffset={4}
          className="animate-fade-in-up"
          style={{
            width: '180px',
            backgroundColor: 'var(--sys-neutral-container-lowest)',
            borderRadius: '12px',
            boxShadow: '0 20px 40px -8px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.05)',
            border: '1px solid var(--color-border)',
            padding: '8px',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
        >
          <DropdownMenu.Item asChild>
            <button disabled className="dropdown-item">
              Duplicate Product
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button disabled className="dropdown-item">
              Share Product
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button disabled className="dropdown-item">
              Archive Product
            </button>
          </DropdownMenu.Item>
          
          <DropdownMenu.Separator style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '4px 0' }} />
          
          <DropdownMenu.Item asChild>
            <div style={{ cursor: 'pointer' }}>
              <DeleteProductButton id={product.id} />
            </div>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
