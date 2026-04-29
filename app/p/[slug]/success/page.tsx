import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { tx_ref?: string; transaction_id?: string };
}) {
  const txRef = searchParams.tx_ref;
  const transactionId = searchParams.transaction_id;

  if (!txRef) {
    notFound();
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md text-center flex flex-col items-center gap-6">
        <div className="rounded-full bg-success-container p-4">
          <CheckCircle size={48} className="text-on-success-container" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-h1">Payment Successful!</h1>
          <p className="text-body" style={{ color: 'var(--color-ink-muted)' }}>
            Thank you for your purchase. The seller has been notified.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3 mt-4">
          <Link href="/" className="w-full">
            <Button fullWidth variant="secondary">Back to Home</Button>
          </Link>
        </div>

        <p className="text-caption" style={{ color: 'var(--color-ink-subtle)' }}>
          Transaction Reference: {txRef}
        </p>
      </div>
    </main>
  );
}
