'use client';

import { useState, useRef, useEffect } from 'react';
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
  const [showLogout, setShowLogout] = useState(false);
  const logoutRef = useRef<HTMLDivElement>(null);

  function closeSidebar() {
    setIsOpen(false);
  }

  function openSidebar() {
    setIsOpen(true);
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

        <div className="px-4" style={{ borderTop: '1px solid color-mix(in srgb, var(--sys-outline-variant-color-role) 50%, transparent)', marginTop: 'auto', padding: '20px 16px 16px' }}>
          <div
            ref={logoutRef}
            onClick={() => setShowLogout((prev) => !prev)}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px', cursor: 'pointer' }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--sys-primary-color-role)',
                border: 'none',
                color: 'var(--sys-on-primary-color-role)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 700,
                flexShrink: 0,
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

            {showLogout && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 8px)',
                  left: 0,
                  right: 0,
                  backgroundColor: 'var(--sys-on-primary-color-role)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',

                  padding: '4px',
                  zIndex: 50,
                }}
              >
                <SignOutButton />
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
