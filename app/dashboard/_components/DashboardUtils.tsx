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
      className="text-body-sm font-medium hover:bg-gray-50 transition-colors"
      style={{ 
        width: '100%', 
        textAlign: 'left', 
        padding: '8px 12px', 
        borderRadius: '8px', 
        color: 'var(--color-danger)', 
        backgroundColor: 'transparent', 
        border: 'none', 
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1
      }}
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}

export function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}/p/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <Button
      onClick={handleCopy}
      variant="secondary"
      size="sm"
      style={{ color: copied ? 'var(--color-success)' : undefined }}
    >
      {copied ? 'Copied!' : 'Copy Link'}
    </Button>
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
