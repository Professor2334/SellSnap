import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { DeleteProductButton } from '../_components/DashboardUtils';

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
    <div className="w-full">
      <div className="flex items-start justify-between mb-8">
        <div style={{ paddingLeft: '20px' }}>
          <h1 className="text-h1 font-bold text-ink">Products</h1>
          <p className="text-body text-ink-muted mt-1">Manage your products and links</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button size="md" className="bg-[#00E676] hover:bg-[#00C853] text-black border-none px-5" style={{ paddingRight: '20px' }}>
            Create Product
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="card-container min-h-[400px] flex items-center justify-center border-dashed border-2 bg-white/50" style={{ marginTop: '20px', marginLeft: '20px', marginRight: '20px' }}>
          <div className="text-center p-24">
            <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--color-border)] shadow-sm">
              <Icon name="Products" size={36} className="text-ink-muted" />
            </div>
            <h3 className="text-h1 font-bold text-ink mb-3">No products yet</h3>
            <p className="text-body text-ink-muted max-w-[400px] mx-auto leading-relaxed mb-8">Create your first product to get a shareable payment link.</p>
            <Link href="/dashboard/products/new">
              <Button size="md" className="bg-[#00E676] hover:bg-[#00C853] text-black border-none px-5">Create Your First Product</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          {products.map((product) => (
            <div key={product.id} className="card-container p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-surface border border-[var(--color-border)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Icon name="Products" size={24} className="text-ink-muted" />
                  )}
                </div>
                <div>
                  <h3 className="text-h2 font-semibold text-ink">{product.name}</h3>
                  <p className="text-body-sm text-ink-muted mt-1">₦{product.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/p/${product.uniqueSlug}`}
                  target="_blank"
                  className="text-body-sm text-brand font-medium hover:underline"
                >
                  View Link
                </Link>
                <DeleteProductButton productId={product.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
