'use client';

import * as React from 'react';
import { createProduct } from '@/app/actions/products';
import { Button } from '@/components/ui/Button';
import { Card, Input } from '@/components/ui/FormPrimitives';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProductPage() {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createProduct(formData);

    setLoading(false);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Something went wrong');
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container h-16 flex items-center">
          <Link href="/dashboard" style={{ color: 'var(--color-brand)', fontWeight: 600 }}>← Back to Dashboard</Link>
        </div>
      </header>

      <main className="container py-8 max-w-xl">
        <h1 className="text-h1 mb-6">Create New Product</h1>
        
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Product Name" name="name" required placeholder="e.g. Classic Black Hoodie" />
            <Input label="Price (₦)" name="price" type="number" required placeholder="5000" />
            <Input label="Description (Optional)" name="description" placeholder="Short description for your customers" />
            <Input label="Image URL (Optional)" name="imageUrl" placeholder="Link to your product image" />
            
            {error && <p className="text-caption" style={{ color: 'var(--color-danger)' }}>{error}</p>}

            <div className="flex gap-4 mt-4">
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Generating Link...' : 'Generate Link'}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
