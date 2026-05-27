'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SidebarNav } from './SidebarNav';
import { SignOutButton } from './DashboardUtils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'Dashboard' as const },
  { href: '/dashboard?tab=products', label: 'Products', icon: 'Products' as const },
  { href: '/dashboard?tab=orders', label: 'Orders', icon: 'Orders' as const },
];

export function DashboardSidebar({
  userName,
  businessName,
  email,
}: {
  userName: string;
  businessName?: string | null;
  email: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function closeSidebar() {
    setIsOpen(false);
  }

  function openSidebar() {
    setIsOpen(true);
  }

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';
  const displayName = businessName || userName;

  return (
    <>
      <button
        onClick={openSidebar}
        className="mobile-menu-btn"
        aria-label="Open menu"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 10H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      <aside
        className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}
        style={{ height: '100vh' }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '24px 24px 20px' }}>
            <Link
              href="/dashboard"
              className="text-h2 text-brand font-bold tracking-tight"
              onClick={closeSidebar}
            >
              SellSnap
            </Link>
          </div>

          <nav style={{ flex: 1, padding: '0 16px' }}>
            <SidebarNav items={navItems} onNavigate={closeSidebar} />
          </nav>
        </div>

        <div className="px-4 py-6 border-t" style={{ borderColor: 'var(--color-border)', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', padding: '0 8px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 700,
                flexShrink: 0,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              {initials}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--color-ink)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.2
                }}
              >
                {displayName}
              </p>
              <p
                style={{
                  fontSize: '11px',
                  color: 'var(--color-ink-subtle)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginTop: '2px'
                }}
              >
                {email}
              </p>
            </div>
          </div>
          <SignOutButton />
        </div>
      </aside>
    </>
  );
}
