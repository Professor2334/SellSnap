import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, Input } from '@/components/ui/FormPrimitives';
import Link from 'next/link';
import { DeleteProductButton } from './_components/DashboardUtils';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const products = await db.product.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { orders: true },
  });

  const totalProducts = products.length;
  const totalOrders = products.reduce((acc, p) => acc + p.orders.length, 0);
  const totalRevenue = products.reduce(
    (acc, p) => acc + p.orders
      .filter(o => o.status === 'PAID')
      .reduce((sum, o) => sum + o.amount, 0),
    0
  );

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-h1">Dashboard</h1>
          <p className="text-body text-ink-muted mt-2">Manage your products and track sales</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>

      <div className="dashboard-stats mb-8">
        <div className="stat-card">
          <p className="stat-card-label">Total Products</p>
          <p className="stat-card-value">{totalProducts}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card-label">Total Orders</p>
          <p className="stat-card-value">{totalOrders}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card-label">Revenue</p>
          <p className="stat-card-value brand">₦{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-h2">My Products</h2>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <p className="text-body empty-state-text">
            You haven&apos;t created any products yet.
          </p>
          <Link href="/dashboard/products/new">
            <Button variant="secondary">Create your first product</Button>
          </Link>
        </div>
      ) : (
        <div className="grid-auto-fill gap-6">
          {products.map((product) => {
            const paidOrders = product.orders.filter(o => o.status === 'PAID');
            const productRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);

            return (
              <div key={product.id} className="product-card">
                <div className="flex flex-col gap-2">
                  <h3 className="text-h2">{product.name}</h3>
                  <p className="text-h1 text-brand">₦{product.price.toLocaleString()}</p>
                  {product.description && (
                    <p className="text-body-sm text-ink-muted">{product.description}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2 mt-auto">
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/p/${product.uniqueSlug}`}
                      className="text-body-sm"
                    />
                  </div>
                  <div className="flex items-center justify-between text-body-sm text-ink-muted">
                    <span>{paidOrders.length} orders</span>
                    <span>₦{productRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Link href={`/p/${product.uniqueSlug}`} target="_blank" className="flex-1">
                      <Button variant="secondary" fullWidth size="sm">View Link</Button>
                    </Link>
                    <DeleteProductButton id={product.id} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
