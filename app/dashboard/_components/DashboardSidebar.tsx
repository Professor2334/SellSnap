'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { SidebarNav } from './SidebarNav';
import { SignOutButton } from './DashboardUtils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

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

  useEffect(() => {
    if (isOpen) {
      // Save current scroll position before locking
      const scrollY = window.scrollY;
      const html = document.documentElement;
      const body = document.body;

      // Lock both html and body to prevent Safari viewport resizing
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      body.style.position = 'fixed';
      body.style.width = '100%';
      body.style.top = `-${scrollY}px`;

      return () => {
        // Restore everything
        html.style.overflow = '';
        body.style.overflow = '';
        body.style.position = '';
        body.style.width = '';
        body.style.top = '';
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const nameParts = userName.split(' ').filter(Boolean);
  const initials = (nameParts.length >= 2
    ? nameParts[0][0] + nameParts[1][0]
    : (nameParts[0]?.[0] || 'U') + (nameParts[0]?.[1] || '')
  ).toUpperCase();
  const displayName = businessName || userName;

  // The overlay + sidebar drawer content (shared between portal and inline)
  const drawerContent = (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={closeSidebar} />

      <aside
        className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}
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

        <div style={{ marginTop: 'auto', padding: '24px 12px 24px' }}>


          <button
            ref={logoutRef as unknown as React.RefObject<HTMLButtonElement>}
            className="sidebar-profile-card"
            onClick={() => setShowLogout((prev) => !prev)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowLogout(false);
              }
            }}
            aria-haspopup="menu"
            aria-expanded={showLogout}
            aria-label="User profile menu"
            style={{
              width: '100%',
              textAlign: 'left',
              border: 'none',
              background: 'transparent',
              padding: '12px',
              cursor: 'pointer'
            }}
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
                fontSize: '0.6875rem',
                fontWeight: 700,
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              {initials}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
              <p
                style={{
                  fontSize: '0.8125rem',
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
                  fontSize: '0.75rem',
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sys-on-neutral-variant-role)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.8 }} aria-hidden="true">
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
                <Link href="/dashboard?tab=settings&section=profile" style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-ink)', textDecoration: 'none' }} onClick={() => setShowLogout(false)}>
                  My Profile
                </Link>
                <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '4px 0' }} />
                <div style={{ padding: '4px 8px' }}>
                  <SignOutButton />
                </div>
              </div>
            )}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px', padding: '0 4px', position: 'relative', minHeight: '40px' }}>
            <div style={{ position: 'absolute', left: '4px' }}>
              <ThemeToggle />
            </div>
            <span style={{ fontSize: '0.6875rem', color: 'var(--sys-on-surface-variant-role)', opacity: 0.6 }}>SellSnap v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );

  return (
    <>
      <div className="mobile-app-bar">
        <button
          onClick={toggleSidebar}
          className="mobile-app-bar-btn"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <Link href="/dashboard" className="text-h2 text-brand font-bold tracking-tight" style={{ lineHeight: 1, textDecoration: 'none' }} onClick={closeSidebar}>
          SellSnap
        </Link>
        <div className="mobile-app-bar-btn" style={{ pointerEvents: 'none' }}></div>
      </div>

      {/* On mobile: render through a Portal directly under <body> to avoid
          parent containers with transform/filter/contain that break position:fixed on Safari.
          On desktop: render inline so the sticky sidebar stays in the flex flow. */}
      {mounted && isMobile
        ? createPortal(drawerContent, document.body)
        : drawerContent
      }
    </>
  );
}
