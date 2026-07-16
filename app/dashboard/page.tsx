import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { DashboardOverview } from './_components/DashboardOverview';
import { ProductsView } from './_components/ProductsView';
import { OrdersView } from './_components/OrdersView';
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

  switch (tab) {
    case 'products': {
      const products = await db.product.findMany({
        where: { userId: session.user.id },
        select: { id: true, name: true, price: true, description: true, imageUrl: true, uniqueSlug: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 100, // Reasonable limit for performance
      });
      return <ProductsView products={products.map(p => ({ ...p, orders: [] }))} />;
    }

    case 'orders': {
      const orders = await db.order.findMany({
        where: { product: { userId: session.user.id } },
        select: { 
          id: true, amount: true, status: true, transactionReference: true, buyerEmail: true, createdAt: true, 
          product: { select: { id: true, name: true, uniqueSlug: true, imageUrl: true } } 
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      return <OrdersView orders={orders} />;
    }

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

    default: {
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

      const [
        totalProducts, totalOrders,
        thisMonthProducts, lastMonthProducts,
        thisMonthOrders, lastMonthOrders,
        totalRevenueAgg, thisMonthRevenueAgg, lastMonthRevenueAgg,
        recentOrders
      ] = await Promise.all([
        db.product.count({ where: { userId: session.user.id } }),
        db.order.count({ where: { product: { userId: session.user.id } } }),
        db.product.count({ where: { userId: session.user.id, createdAt: { gte: thisMonthStart } } }),
        db.product.count({ where: { userId: session.user.id, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
        db.order.count({ where: { product: { userId: session.user.id }, createdAt: { gte: thisMonthStart } } }),
        db.order.count({ where: { product: { userId: session.user.id }, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
        db.order.aggregate({ _sum: { amount: true }, where: { product: { userId: session.user.id }, status: 'PAID' } }),
        db.order.aggregate({ _sum: { amount: true }, where: { product: { userId: session.user.id }, status: 'PAID', createdAt: { gte: thisMonthStart } } }),
        db.order.aggregate({ _sum: { amount: true }, where: { product: { userId: session.user.id }, status: 'PAID', createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
        db.order.findMany({
          where: { product: { userId: session.user.id } },
          select: { 
            id: true, amount: true, status: true, transactionReference: true, buyerEmail: true, createdAt: true, 
            product: { select: { id: true, name: true, uniqueSlug: true, imageUrl: true } } 
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        })
      ]);

      const totalRevenue = totalRevenueAgg._sum.amount || 0;
      const thisMonthRevenue = thisMonthRevenueAgg._sum.amount || 0;
      const lastMonthRevenue = lastMonthRevenueAgg._sum.amount || 0;

      const calcGrowth = (current: number, previous: number): number => {
        if (previous === 0 && current === 0) return 0;
        if (previous === 0) return 100;
        return Math.round(((current - previous) / previous) * 100);
      };

      const revenueGrowth = calcGrowth(thisMonthRevenue, lastMonthRevenue);
      const ordersGrowth = calcGrowth(thisMonthOrders, lastMonthOrders);
      const productsGrowth = calcGrowth(thisMonthProducts, lastMonthProducts);

      return (
        <DashboardOverview
          userName={session.user.name || 'Merchant'}
          totalRevenue={totalRevenue}
          totalOrders={totalOrders}
          totalProducts={totalProducts}
          revenueGrowth={revenueGrowth}
          ordersGrowth={ordersGrowth}
          productsGrowth={productsGrowth}
          recentOrders={recentOrders}
        />
      );
    }
  }
}
