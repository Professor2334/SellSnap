'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  uniqueSlug: string;
  createdAt: Date;
  orders: { id: string; status: string; amount: number; createdAt: Date }[];
};

export type Order = {
  id: string;
  amount: number;
  status: string;
  transactionReference: string;
  buyerEmail: string | null;
  createdAt: Date;
  product: { id: string; name: string; uniqueSlug: string; imageUrl: string | null };
};

export function GrowthBadge({ value }: { value: number }) {
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
export function PageHeader({
  title,
  subtitle,
  action,
  staticOnMobile = false,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  staticOnMobile?: boolean;
}) {
  return (
    <div className={`dashboard-page-header ${staticOnMobile ? 'static-mobile' : ''}`}>
      <div>
        <h1 className="text-display font-bold text-ink" style={{ marginBottom: 8 }}>{title}</h1>
        <p className="text-body-sm text-ink-muted" style={{ opacity: 0.9 }}>{subtitle}</p>
      </div>
      {action && <div className="dashboard-page-header-action">{action}</div>}
    </div>
  );
}

/* ── Empty state icon cell ────────────────────────────── */
export function EmptyIcon({ name }: { name: 'Orders' | 'Products' }) {
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
