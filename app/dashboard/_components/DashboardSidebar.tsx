'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { SidebarNav } from './SidebarNav';
import { SignOutButton } from './DashboardUtils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'Dashboard' as const },
  { href: '/dashboard?tab=products', label: 'Products', icon: 'Products' as const, activePrefix: '/dashboard/products' },
  { href: '/dashboard?tab=orders', label: 'Orders', icon: 'Orders' as const, activePrefix: '/dashboard/orders' },
  { href: '/dashboard?tab=settings', label: 'Settings', icon: 'Settings' as const, activePrefix: '/dashboard/settings' },
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
  const [showLogout, setShowLogout] = useState(false);
  const logoutRef = useRef<HTMLDivElement>(null);

  function closeSidebar() {
    setIsOpen(false);
  }

  function toggleSidebar() {
    setIsOpen((prev) => !prev);
  }

  useEffect(() => {
    if (!showLogout) return;
    function handleClick(e: MouseEvent) {
      if (logoutRef.current && !logoutRef.current.contains(e.target as Node)) {
        setShowLogout(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showLogout]);

  const nameParts = userName.split(' ').filter(Boolean);
  const initials = (nameParts.length >= 2
    ? nameParts[0][0] + nameParts[1][0]
    : (nameParts[0]?.[0] || 'U') + (nameParts[0]?.[1] || '')
  ).toUpperCase();
  const displayName = businessName || userName;

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="mobile-menu-btn"
        aria-label="Toggle menu"
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
          <div style={{ padding: '28px 20px 52px' }}>
            <Link
              href="/dashboard"
              className="text-h2 text-brand font-bold tracking-tight"
              onClick={closeSidebar}
              style={{ display: 'block', lineHeight: 1 }}
            >
              SellSnap
            </Link>
          </div>

          <nav style={{ flex: 1, padding: '0 12px' }}>
            <SidebarNav items={navItems} onNavigate={closeSidebar} />
          </nav>
        </div>

        <div style={{ marginTop: 'auto', padding: '32px 12px 24px' }}>
          <div
            ref={logoutRef}
            className="sidebar-profile-card"
            onClick={() => setShowLogout((prev) => !prev)}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--sys-primary-container-role)',
                border: 'none',
                color: 'var(--sys-on-primary-container-role)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
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
                  fontSize: '12px',
                  color: 'var(--sys-on-neutral-variant-role)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginTop: '2px'
                }}
              >
                {email}
              </p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sys-on-neutral-variant-role)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.8 }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>

            {showLogout && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 8px)',
                  left: 0,
                  right: 0,
                  backgroundColor: 'var(--sys-neutral-container-lowest)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.10)',
                  border: 'none',
                  padding: '8px',
                  zIndex: 50,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  cursor: 'default'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Link href="/dashboard?tab=settings&section=profile" className="hover:bg-gray-50 transition-colors" style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, color: 'var(--color-ink)', textDecoration: 'none' }} onClick={() => setShowLogout(false)}>
                  My Profile
                </Link>
                <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '4px 0' }} />
                <div style={{ padding: '4px 8px' }}>
                  <SignOutButton />
                </div>
              </div>
            )}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <span style={{ fontSize: '11px', color: 'var(--sys-on-surface-variant-role)', opacity: 0.6 }}>SellSnap v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
