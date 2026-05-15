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
    <Button 
      variant="danger" 
      size="sm" 
      onClick={handleDelete} 
      disabled={loading}
    >
      {loading ? '...' : 'Delete'}
    </Button>
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
    <button
      onClick={handleCopy}
      className="text-body-sm font-medium hover:underline"
      style={{ color: copied ? 'var(--color-success)' : 'var(--color-brand)' }}
    >
      {copied ? 'Copied!' : 'Copy Link'}
    </button>
  );
}

// SignOutButton
import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <Button variant="ghost" size="sm" fullWidth onClick={() => signOut({ callbackUrl: '/auth?mode=login' })}>
      Logout
    </Button>
  );
}
