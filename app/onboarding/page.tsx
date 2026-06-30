import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import OnboardingClient from './OnboardingClient';
import { SessionProvider } from 'next-auth/react';

export default async function OnboardingPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect('/auth');
  }

  return (
    <SessionProvider session={session}>
      <OnboardingClient userName={session.user.name || 'Merchant'} businessName={session.user.businessName || ''} />
    </SessionProvider>
  );
}
