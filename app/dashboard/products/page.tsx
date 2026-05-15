import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import Image from 'next/image';
import { DeleteProductButton, CopyLinkButton } from '../_components/DashboardUtils';

export default async function ProductsPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect('/auth');
  }

  const products = await db.product.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="w-full animate-fade-in-up">
      <div className="dashboard-header flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-display font-bold text-ink mb-2">Products</h1>
          <p className="text-body text-ink-muted">Manage your products and their shareable payment links.</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button size="lg" variant="primary" className="shadow-lg shadow-brand/20">
            Create Product
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="card-container min-h-[400px] flex items-center justify-center border-dashed border-2 bg-surface/30 rounded-2xl">
          <div className="dashboard-empty text-center p-12">
            <div className="w-20 h-20 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[var(--color-border)] shadow-sm">
              <Icon name="Products" size={32} className="text-ink-subtle" />
            </div>
            <h3 className="text-h2 font-bold text-ink mb-2">No products yet</h3>
            <p className="text-body-sm text-ink-muted max-w-[340px] mx-auto leading-relaxed mb-8">
              Create your first product to get a unique link you can share on WhatsApp or social media.
            </p>
            <Link href="/dashboard/products/new">
              <Button size="md" variant="primary">Create Your First Product</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="products-list flex flex-col gap-4">
          {products.map((product) => (
            <div key={product.id} className="card-container p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-brand/30 transition-colors">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-xl bg-surface border border-[var(--color-border)] flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                  {product.imageUrl ? (
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      width={64} 
                      height={64} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <Icon name="Products" size={24} className="text-ink-subtle" />
                  )}
                </div>
                <div>
                  <h3 className="text-h2 font-bold text-ink">{product.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-body-sm font-semibold text-brand">₦{product.price.toLocaleString()}</p>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <p className="text-caption text-ink-muted">{new Date(product.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Link
                  href={`/p/${product.uniqueSlug}`}
                  target="_blank"
                  className="text-body-sm text-ink-muted font-medium hover:text-brand transition-colors"
                >
                  View Page
                </Link>
                <div className="h-4 w-px bg-border hidden sm:block" />
                <CopyLinkButton slug={product.uniqueSlug} />
                <DeleteProductButton id={product.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
