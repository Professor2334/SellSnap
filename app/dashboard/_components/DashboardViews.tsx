'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import Image from 'next/image';
import { DeleteProductButton, CopyLinkButton } from './DashboardUtils';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  uniqueSlug: string;
  createdAt: Date;
  orders: { id: string; status: string; amount: number; createdAt: Date }[];
};

type Order = {
  id: string;
  amount: number;
  status: string;
  transactionReference: string;
  buyerEmail: string | null;
  createdAt: Date;
  product: { name: string; uniqueSlug: string };
};

export function DashboardView({
  userName,
  totalRevenue,
  totalOrders,
  totalProducts,
  recentOrders,
}: {
  userName: string;
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  recentOrders: Order[];
}) {
  return (
    <div className="w-full animate-fade-in-up">
      <div className="flex items-start justify-between gap-6" style={{ marginBottom: '50px' }}>
        <div>
          <h1 className="text-display font-bold text-ink" style={{ marginBottom: 4 }}>Dashboard</h1>
          <p className="text-body text-ink-muted">Welcome, {userName}</p>
        </div>
        <Link href="/dashboard/products/new" className="flex-shrink-0">
          <Button size="lg" variant="primary" className="shadow-lg shadow-brand/20" style={{ paddingLeft: 24, paddingRight: 24 }}>
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

export function ProductsView({ products }: { products: Product[] }) {
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

export function OrdersView({ orders }: { orders: Order[] }) {
  return (
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
  );
}
