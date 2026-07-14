'use client';

import * as React from 'react';
import { deleteProduct } from '@/app/actions/products';
import { Button } from '@/components/ui/Button';

export function DeleteProductButton({ id }: { id: string }) {
  const [loading, setLoading] = React.useState(false);

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    setLoading(true);
    await deleteProduct(id);
    setLoading(false);
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading}
      className="dropdown-item danger"
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}

export function CopyLinkButton({ slug, className }: { slug: string, className?: string }) {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    if (!slug) return;

    // Always build from the window origin so it works in both dev and prod
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${process.env.NEXT_PUBLIC_APP_URL || origin}/p/${slug}`;

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <Button
        onClick={handleCopy}
        variant="primary"
        size="sm"
        className={className}
      >
        {copied ? 'Copied!' : 'Copy Link'}
      </Button>
      {copied && (
        <div style={{ position: 'fixed', bottom: '24px', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 50, pointerEvents: 'none' }}>
          <div 
            className="animate-fade-in-up"
            style={{
              backgroundColor: 'var(--sys-secondary-container-role)',
              color: 'var(--sys-on-secondary-container-role)',
              padding: '12px 20px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>✓ Product link copied to clipboard</span>
          </div>
        </div>
      )}
    </>
  );
}

// SignOutButton
import { signOut } from 'next-auth/react';
import { Icon } from '@/components/ui/Icon';

export function SignOutButton() {
  return (
    <Button variant="ghost" size="sm" fullWidth className="logout-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }} onClick={() => signOut({ callbackUrl: '/auth?mode=login' })}>
      <Icon name="Logout" size={16} />
      Logout
    </Button>
  );
}
