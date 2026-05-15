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
    <div className="min-h-screen flex bg-bg w-full">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex dashboard-sidebar w-[260px] min-w-[260px] bg-surface border-r border-[var(--color-border)] flex-col sticky top-0 h-screen z-10">
        <div className="px-7 py-10 mb-2">
          <Link href="/dashboard" className="text-h2 text-brand font-bold tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white text-lg">S</div>
            SellSnap
          </Link>
        </div>

        <nav className="flex-1 px-4">
          <SidebarNav items={navItems} />
        </nav>

        <div className="px-4 py-6 mt-auto border-t border-[var(--color-border)]">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-9 h-9 rounded-full bg-surface border border-[var(--color-border)] text-ink flex items-center justify-center text-[10px] font-bold flex-shrink-0 shadow-sm">
              {session.user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-[13px] font-bold text-ink truncate leading-tight">{session.user.businessName || session.user.name}</p>
              <p className="text-[11px] text-ink-subtle truncate">{session.user.email}</p>
            </div>
          </div>
          <SignOutButton />
        </div>
      </aside>

      <main className="dashboard-main flex-1 flex flex-col min-w-0 w-full bg-bg">
        <div className="w-full flex-1 mx-auto max-w-6xl p-6 md:p-10 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
