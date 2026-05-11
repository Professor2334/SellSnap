'use client';

import * as React from 'react';
import { createProduct } from '@/app/actions/products';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { Upload, Loader2 } from 'lucide-react';

export default function NewProductPage() {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const name = (e.currentTarget.elements.namedItem('name') as HTMLInputElement)?.value?.trim();
    const price = (e.currentTarget.elements.namedItem('price') as HTMLInputElement)?.value?.trim();

    if (!name) {
      setError('Product name is required');
      return;
    }
    if (!price || Number(price) < 1) {
      setError('Price must be at least 1');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await createProduct(formData);

      if (result.success) {
        router.push('/dashboard/products');
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('create product error', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>


      <main className="container py-12 max-w-lg mx-auto flex flex-col">
        <div className="mb-8">
          <h1 className="text-h1 text-ink mb-2 tracking-tight" style={{ fontSize: '24px', fontWeight: '700' }}>Create a product 🛍️</h1>
          <p className="text-ink-muted text-body leading-relaxed" style={{ fontSize: '14px', maxWidth: '420px' }}>
            Add a product and we&apos;ll generate a shareable payment link instantly.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <div>
            <label htmlFor="name" className="input-label mb-2 block" style={{ fontSize: '13px', fontWeight: '500', color: 'var(--sys-on-neutral-variant-role)' }}>Product Name</label>
            <input
              id="name"
              name="name"
              placeholder="e.g. Handmade Earrings"
              required
              className="input-field w-full"
              style={{ height: '48px', borderRadius: '12px', border: '1px solid var(--color-border)', fontSize: '14px', padding: '0 16px', backgroundColor: '#ffffff' }}
            />
          </div>

          <div>
            <label htmlFor="description" className="input-label mb-2 block" style={{ fontSize: '13px', fontWeight: '500', color: 'var(--sys-on-neutral-variant-role)' }}>Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your product — material, size, what makes it special..."
              className="input-field w-full"
              style={{ height: '96px', borderRadius: '12px', border: '1px solid var(--color-border)', fontSize: '14px', padding: '12px 16px', resize: 'none', backgroundColor: '#ffffff' }}
            />
          </div>

          <div>
            <label htmlFor="price" className="input-label mb-2 block" style={{ fontSize: '13px', fontWeight: '500', color: 'var(--sys-on-neutral-variant-role)' }}>Price (NGN)</label>
            <input
              id="price"
              name="price"
              type="number"
              placeholder="e.g. 5000"
              required
              className="input-field w-full"
              style={{ height: '48px', borderRadius: '12px', border: '1px solid var(--color-border)', fontSize: '14px', padding: '0 16px', backgroundColor: '#ffffff' }}
            />
          </div>

          <div>
            <label className="input-label mb-2 block" style={{ fontSize: '13px', fontWeight: '500', color: 'var(--sys-on-neutral-variant-role)' }}>Product Image</label>
            <div 
              className="w-full flex flex-col items-center justify-center rounded-xl cursor-pointer"
              style={{ height: '120px', border: '1px dashed var(--sys-outline-variant-color-role)', backgroundColor: 'var(--sys-neutral-container-lowest)' }}
            >
              <input type="file" name="image" id="product-image" accept="image/*" style={{ display: 'none' }} />
              <label htmlFor="product-image" className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
                <Upload size={20} className="mb-2" style={{ color: 'var(--sys-on-neutral-variant-role)' }} />
                <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--sys-on-neutral-color-role)' }}>Click or drag file to upload</span>
                <span style={{ fontSize: '12px', color: 'var(--sys-on-neutral-variant-role)', marginTop: '4px' }}>Max size 5MB</span>
              </label>
            </div>
          </div>
          
          {error && <p className="text-caption mt-2" style={{ color: 'var(--color-danger)' }}>{error}</p>}

          <div className="flex flex-col mt-4">
            <Button 
              type="submit" 
              disabled={loading} 
              className="btn-primary btn-lg btn-full rounded-xl"
              style={{ height: '56px', fontSize: '16px', backgroundColor: 'var(--color-brand)' }}
            >
              {loading ? <Loader2 className="spinner mr-2" /> : 'Create Product'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
