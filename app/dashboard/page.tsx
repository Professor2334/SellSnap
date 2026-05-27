import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { DashboardView, ProductsView, OrdersView } from './_components/DashboardViews';

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
    default:
      return (
        <DashboardView
          userName={session.user.name || 'Merchant'}
          totalRevenue={totalRevenue}
          totalOrders={totalOrders}
          totalProducts={totalProducts}
          recentOrders={flatOrders.slice(0, 5)}
        />
      );
  }
}
