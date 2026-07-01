import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { DashboardView, ProductsView, OrdersView } from './_components/DashboardViews';
import { SettingsClient } from './settings/SettingsClient';

type Props = {
  searchParams: { tab?: string };
};

export default async function DashboardPage({ searchParams }: Props) {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect('/auth');
  }

  const tab = searchParams.tab || 'dashboard';

  const products = await db.product.findMany({
    where: { userId: session.user.id },
    include: { orders: true },
    orderBy: { createdAt: 'desc' },
  });

  const allOrders = products.flatMap(p => p.orders).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const totalProducts = products.length;
  const totalOrders = allOrders.length;
  const totalRevenue = allOrders
    .filter(o => o.status === 'PAID')
    .reduce((sum, o) => sum + o.amount, 0);

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  const thisMonthRevenue = allOrders
    .filter(o => o.status === 'PAID' && o.createdAt >= thisMonthStart)
    .reduce((sum, o) => sum + o.amount, 0);
  const lastMonthRevenue = allOrders
    .filter(o => o.status === 'PAID' && o.createdAt >= lastMonthStart && o.createdAt <= lastMonthEnd)
    .reduce((sum, o) => sum + o.amount, 0);

  const thisMonthOrders = allOrders.filter(o => o.createdAt >= thisMonthStart).length;
  const lastMonthOrders = allOrders.filter(o => o.createdAt >= lastMonthStart && o.createdAt <= lastMonthEnd).length;

  const thisMonthProducts = products.filter(p => p.createdAt >= thisMonthStart).length;
  const lastMonthProducts = products.filter(p => p.createdAt >= lastMonthStart && p.createdAt <= lastMonthEnd).length;

  function calcGrowth(current: number, previous: number): number {
    if (previous === 0 && current === 0) return 0;
    if (previous === 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
  }

  const revenueGrowth = calcGrowth(thisMonthRevenue, lastMonthRevenue);
  const ordersGrowth = calcGrowth(thisMonthOrders, lastMonthOrders);
  const productsGrowth = calcGrowth(thisMonthProducts, lastMonthProducts);

  const flatProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    description: p.description,
    imageUrl: p.imageUrl,
    uniqueSlug: p.uniqueSlug,
    createdAt: p.createdAt,
    orders: p.orders.map(o => ({
      id: o.id,
      status: o.status,
      amount: o.amount,
      createdAt: o.createdAt,
    })),
  }));

  const orders = await db.order.findMany({
    where: { product: { userId: session.user.id } },
    include: { product: { select: { name: true, uniqueSlug: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const flatOrders = orders.map(o => ({
    id: o.id,
    amount: o.amount,
    status: o.status,
    transactionReference: o.transactionReference,
    buyerEmail: o.buyerEmail,
    createdAt: o.createdAt,
    product: { name: o.product.name, uniqueSlug: o.product.uniqueSlug },
  }));

  switch (tab) {
    case 'products':
      return <ProductsView products={flatProducts} />;
    case 'orders':
      return <OrdersView orders={flatOrders} />;
    case 'settings': {
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        include: { accounts: { select: { provider: true } } },
      });
      if (!user) return redirect('/auth');
      const hasGoogleAccount = user.accounts.some((acc: any) => acc.provider === 'google');
      // @ts-ignore
      return <SettingsClient user={user} hasGoogleAccount={hasGoogleAccount} />;
    }
    default:
      return (
        <DashboardView
          userName={session.user.name || 'Merchant'}
          totalRevenue={totalRevenue}
          totalOrders={totalOrders}
          totalProducts={totalProducts}
          revenueGrowth={revenueGrowth}
          ordersGrowth={ordersGrowth}
          productsGrowth={productsGrowth}
          recentOrders={flatOrders.slice(0, 5)}
        />
      );
  }
}
