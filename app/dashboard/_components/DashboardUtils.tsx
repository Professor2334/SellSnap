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

// SignOutButton
import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/auth?mode=login' })}>
      Logout
    </Button>
  );
}
