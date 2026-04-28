import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/FormPrimitives';
import Link from 'next/link';

export default async function OrdersPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const orders = await db.order.findMany({
    where: {
      product: {
        userId: session.user.id,
      },
    },
    include: {
      product: {
        select: {
          name: true,
          uniqueSlug: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const statusColors: Record<string, string> = {
    PENDING: 'var(--color-warning, #f59e0b)',
    PAID: 'var(--color-success, #10b981)',
    FAILED: 'var(--color-danger, #ef4444)',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container h-16 flex items-center justify-between">
          <Link href="/" className="text-h2" style={{ color: 'var(--color-brand)' }}>SellSnap</Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="sm">Back to Products</Button>
          </Link>
        </div>
      </header>

      <main className="container py-8 flex-1">
        <h1 className="text-h1 mb-8">Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-body" style={{ color: 'var(--color-ink-muted)' }}>
              No orders yet. Share your product links to start getting sales!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <Card key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">
                <div className="flex flex-col gap-1">
                  <Link
                    href={`/p/${order.product.uniqueSlug}`}
                    className="text-h2 hover:underline"
                    style={{ color: 'var(--color-ink)' }}
                  >
                    {order.product.name}
                  </Link>
                  <div className="flex items-center gap-4 text-body-sm" style={{ color: 'var(--color-ink-muted)' }}>
                    <span>₦{order.amount.toLocaleString()}</span>
                    <span>•</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    {order.buyerEmail && (
                      <>
                        <span>•</span>
                        <span>{order.buyerEmail}</span>
                      </>
                    )}
                  </div>
                </div>
                <div
                  className="px-3 py-1 rounded-full text-caption font-medium self-start sm:self-center"
                  style={{
                    backgroundColor: `${statusColors[order.status]}20`,
                    color: statusColors[order.status],
                  }}
                >
                  {order.status}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
