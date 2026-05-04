import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { SignOutButton } from './_components/DashboardUtils';
import { SidebarNav } from './_components/SidebarNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect('/auth');
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'Dashboard' as const },
    { href: '/dashboard/products', label: 'Products', icon: 'Products' as const },
    { href: '/dashboard/orders', label: 'Orders', icon: 'Orders' as const },
  ];

  return (
    <div className="min-h-screen flex bg-bg w-full overflow-x-hidden">
      <aside className="w-[240px] min-w-[240px] bg-surface border-r border-[var(--color-border)] flex flex-col sticky top-0 h-screen z-10">
        <div className="px-6 py-8 mb-2">
          <Link href="/dashboard" className="text-h2 text-brand font-bold tracking-tight">
            SellSnap
          </Link>
        </div>

        <nav className="flex-1 px-3">
          <SidebarNav items={navItems} />
        </nav>

        <div className="px-3 py-5 mt-auto border-t border-[var(--color-border)]">
          <div className="flex items-center gap-3 px-3 py-2 mb-4 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-[var(--sys-success-container-role)] text-[var(--sys-on-success-container-role)] flex items-center justify-center text-xs font-bold flex-shrink-0">
              {session.user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-body-sm font-semibold text-ink truncate">{session.user.businessName || session.user.name}</p>
              <p className="text-caption text-ink-muted truncate">{session.user.email}</p>
            </div>
          </div>
          <div className="px-1">
            <SignOutButton />
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 w-full">
        <div className="p-8 px-10 pt-10 w-full flex-1 max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}
