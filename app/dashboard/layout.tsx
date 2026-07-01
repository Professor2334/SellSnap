import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardSidebar } from './_components/DashboardSidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect('/auth');
  }

  return (
    <div className="min-h-screen flex bg-surface w-full">
      <DashboardSidebar
        userName={session.user.name || 'Merchant'}
        businessName={session.user.businessName}
        email={session.user.email || ''}
      />
      <main className="dashboard-main flex-1 flex flex-col min-w-0 w-full bg-surface">
        <div className="dashboard-content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
}
