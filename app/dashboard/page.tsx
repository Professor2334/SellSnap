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
    <div className="w-full">
      <div className="flex items-start justify-between mb-8">
        <div style={{ paddingLeft: '20px' }}>
          <h1 className="text-h1 font-bold text-ink">Dashboard</h1>
          <p className="text-body text-ink-muted mt-1">Welcome back, {session.user.name}</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button size="md" className="bg-[#00E676] hover:bg-[#00C853] text-black border-none px-5" style={{ paddingRight: '20px' }}>
            Create Product
          </Button>
        </Link>
      </div>

      <div className="flex mb-10">
        <div className="card-stat" style={{ paddingLeft: '20px', marginRight: '20px', flex: 1 }}>
          <p className="card-stat-label uppercase tracking-wider">Total Revenue</p>
          <p className="card-stat-value">₦{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="card-stat" style={{ marginRight: '20px', flex: 1 }}>
          <p className="card-stat-label uppercase tracking-wider">Total Orders</p>
          <p className="card-stat-value">{totalOrders}</p>
        </div>
        <div className="card-stat" style={{ paddingRight: '20px', flex: 1 }}>
          <p className="card-stat-label uppercase tracking-wider">Active Products</p>
          <p className="card-stat-value">{totalProducts}</p>
        </div>
      </div>

      <div className="mt-10 mb-6">
        <h2 className="text-h2 font-bold text-ink">Recent Orders</h2>
      </div>

      <div className="card-container min-h-[520px] flex items-center justify-center border-dashed border-2 bg-white/50">
        <div className="text-center p-24">
          <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--color-border)] shadow-sm">
            <Icon name="Orders" size={36} className="text-ink-muted" />
          </div>
          <h3 className="text-h1 font-bold text-ink mb-3">No orders yet</h3>
          <p className="text-body text-ink-muted max-w-[400px] mx-auto leading-relaxed">Share your product links on social media or WhatsApp to start receiving orders.</p>
        </div>
      </div>
    </div>
  );
}
