import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/FormPrimitives';
import Image from 'next/image';
import Link from 'next/link';

export default async function ProductPublicPage({ params }: { params: { slug: string } }) {
  const product = await db.product.findUnique({
    where: { uniqueSlug: params.slug },
    include: { user: true },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50">
       <Card className="w-full max-w-lg p-0 overflow-hidden shadow-xl" style={{ backgroundColor: 'var(--color-surface)' }}>
        {product.imageUrl && (
          <div className="relative aspect-square w-full">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="object-cover w-full h-full"
            />
          </div>
        )}
        
        <div className="p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-caption" style={{ color: 'var(--color-ink-subtle)' }}>
              Sold by {product.user.businessName || product.user.name}
            </span>
            <h1 className="text-display">{product.name}</h1>
            <p className="text-h1" style={{ color: 'var(--color-brand)' }}>
              ₦{product.price.toLocaleString()}
            </p>
          </div>

          {product.description && (
            <p className="text-body" style={{ color: 'var(--color-ink-muted)' }}>
              {product.description}
            </p>
          )}

          <div className="mt-4 pt-6 border-t">
            <Link href={`/api/payments/initialize?slug=${product.uniqueSlug}`}>
              <Button fullWidth size="lg">Pay Now</Button>
            </Link>
          </div>
          
          <div className="flex justify-center items-center gap-2 text-caption" style={{ color: 'var(--color-ink-subtle)' }}>
            <span className="flex h-2 w-2 rounded-full bg-green-500" />
            Secure payment powered by Flutterwave
          </div>
        </div>
      </Card>
    </main>
  );
}
