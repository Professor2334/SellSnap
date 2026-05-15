import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/FormPrimitives';
import Link from 'next/link';

export default async function OrdersPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect('/auth');
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

    <div className="w-full animate-fade-in-up">
      <div className="dashboard-header flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-display font-bold text-ink mb-2">Orders</h1>
          <p className="text-body text-ink-muted">Track and manage your sales performance and customer orders.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="card-container min-h-[400px] flex items-center justify-center border-dashed border-2 bg-surface/30 rounded-2xl">
          <div className="dashboard-empty text-center p-12">
            <div className="w-20 h-20 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[var(--color-border)] shadow-sm">
              <Icon name="Orders" size={32} className="text-ink-subtle" />
            </div>
            <h3 className="text-h2 font-bold text-ink mb-2">No orders yet</h3>
            <p className="text-body-sm text-ink-muted max-w-[340px] mx-auto leading-relaxed">
              When a customer pays via your link, their order will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="card-container p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-brand/30 transition-colors">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-h2 font-bold text-ink">{order.product.name}</h3>
                  <span className="text-caption px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider" 
                    style={{ 
                      backgroundColor: order.status === 'PAID' ? 'var(--color-success)20' : 'var(--color-warning)20',
                      color: order.status === 'PAID' ? 'var(--color-success)' : 'var(--color-warning)'
                    }}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-body-sm font-semibold text-ink">₦{order.amount.toLocaleString()}</p>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <p className="text-caption text-ink-muted">{new Date(order.createdAt).toLocaleDateString()}</p>
                  {order.buyerEmail && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <p className="text-caption text-ink-muted italic">{order.buyerEmail}</p>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <p className="text-caption font-mono text-ink-subtle uppercase truncate max-w-[120px]">
                  Ref: {order.transactionReference.split('_').pop()}
                </p>
                <div className="h-4 w-px bg-border hidden sm:block" />
                <Link
                  href={`/p/${order.product.uniqueSlug}`}
                  target="_blank"
                  className="text-body-sm text-brand font-medium hover:underline"
                >
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
}
