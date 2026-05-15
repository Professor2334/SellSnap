import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect('/auth');
  }

  const products = await db.product.findMany({
    where: { userId: session.user.id },
    include: { orders: true },
  });

  const orders = products.flatMap(p => p.orders).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter(o => o.status === 'PAID')
    .reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="w-full animate-fade-in-up">
      <div className="flex items-start justify-between gap-6" style={{ marginBottom: '50px' }}>
        <div>
          <h1 className="text-display font-bold text-ink mb-2">Dashboard</h1>
          <p className="text-body text-ink-muted">Welcome, {session.user.name}</p>
        </div>
        <Link href="/dashboard/products/new" className="flex-shrink-0">
          <Button size="lg" variant="primary" className="shadow-lg shadow-brand/20">
            Create Product
          </Button>
        </Link>
      </div>

      <div className="dashboard-stats-row grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
        <div className="card-stat hover:border-brand/50 transition-all">
          <p className="card-stat-label mb-1">Total Revenue</p>
          <div className="flex items-baseline gap-1">
            <span className="text-h2 font-bold text-ink-muted">₦</span>
            <p className="text-h1 font-bold text-ink leading-none">{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="card-stat hover:border-brand/50 transition-all">
          <p className="card-stat-label mb-1">Total Orders</p>
          <p className="text-h1 font-bold text-ink leading-none">{totalOrders}</p>
        </div>
        <div className="card-stat hover:border-brand/50 transition-all">
          <p className="card-stat-label mb-1">Active Products</p>
          <p className="text-h1 font-bold text-ink leading-none">{totalProducts}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-h1 font-bold text-ink">Recent Orders</h2>
      </div>

      <div className="card-container min-h-[320px] flex items-center justify-center border-dashed border-2 bg-surface/30 rounded-2xl">
        <div className="dashboard-empty text-center p-12">
          <div className="w-20 h-20 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[var(--color-border)] shadow-sm">
            <Icon name="Orders" size={32} className="text-ink-subtle" />
          </div>
          <h3 className="text-h2 font-bold text-ink mb-2">No orders yet</h3>
          <p className="text-body-sm text-ink-muted max-w-[340px] mx-auto leading-relaxed">
            Your recent sales will appear here. Start sharing your links to get paid!
          </p>
        </div>
      </div>
    </div>
  );
}
