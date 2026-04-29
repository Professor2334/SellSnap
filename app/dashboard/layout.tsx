import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { SignOutButton } from './_components/DashboardUtils';

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
    { href: '/dashboard', label: 'Products', icon: '📦' },
    { href: '/dashboard/orders', label: 'Orders', icon: '📋' },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-surface border-r border-[var(--color-border)] flex flex-col">
        <div className="p-6 border-b border-[var(--color-border)]">
          <Link href="/" className="text-h2 text-brand">
            SellSnap
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="sidebar-link"
                >
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-brand)] text-white flex items-center justify-center text-sm font-semibold">
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-medium text-ink truncate">{session.user.name}</p>
            </div>
          </div>
          <div className="mt-2">
            <SignOutButton />
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
