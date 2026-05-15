import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/FormPrimitives';
import Image from 'next/image';

export default async function ProductPublicPage({ params }: { params: { slug: string } }) {
  const product = await db.product.findUnique({
    where: { uniqueSlug: params.slug },
    include: { user: true },
  });

  if (!product) {
    notFound();
  }

  const businessName = product.user.businessName || product.user.name;

  return (
    <main className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto md:py-12 md:px-4">
        <Card className="w-full p-0 overflow-hidden border-none md:border md:shadow-xl bg-surface">
          {/* Product Image */}
          {product.imageUrl && (
            <div className="relative aspect-square w-full">
              <Image 
                src={product.imageUrl} 
                alt={product.name} 
                fill
                priority
                className="object-cover"
              />
            </div>
          )}
          
          <div className="p-6 md:p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-body-sm text-ink-subtle">
                Sold by {businessName}
              </span>
              <h1 className="text-display">{product.name}</h1>
              <p className="text-h1 font-bold text-brand">
                ₦{product.price.toLocaleString()}
              </p>
            </div>

            {product.description && (
              <p className="text-body text-ink-muted">
                {product.description}
              </p>
            )}

            {/* Pay Now Button - Sticky on Mobile */}
            <div className="mt-8 pt-6 border-t md:static sticky bottom-0 left-0 right-0 p-4 md:p-0 bg-surface md:bg-transparent border-t md:border-none z-10">
              <a href={`/api/payments/initialize?slug=${product.uniqueSlug}`} className="w-full">
                <Button fullWidth size="lg">Pay Now</Button>
              </a>
            </div>
            
            <div className="flex justify-center items-center gap-2 text-caption text-ink-subtle pb-8 md:pb-0">
              <span className="flex h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--color-success)' }} />
              Secure payment powered by Flutterwave
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
