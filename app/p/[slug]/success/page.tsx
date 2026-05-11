'use client';

import * as React from 'react';
import { notFound, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <React.Suspense fallback={
      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center flex flex-col items-center gap-6">
          <Loader2 size={48} className="spinner" style={{ color: 'var(--color-brand)' }} />
        </div>
      </main>
    }>
      <PaymentStatus />
    </React.Suspense>
  );
}

function PaymentStatus() {
  const searchParams = useSearchParams();
  const txRef = searchParams.get('tx_ref');

  const [status, setStatus] = React.useState<'PENDING' | 'PAID' | 'FAILED' | 'TIMEOUT'>('PENDING');

  const transactionId = searchParams.get('transaction_id');

  React.useEffect(() => {
    if (!txRef) return;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 30;

    async function verify() {
      if (cancelled) return;

      // First attempt: verify directly with Flutterwave
      if (attempts === 0 && transactionId) {
        try {
          const res = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tx_ref: txRef, transaction_id: transactionId }),
          });
          const data = await res.json();
          if (data.status === 'PAID') {
            setStatus('PAID');
            return;
          }
        } catch {
          // fall through to polling
        }
      }

      const poll = async () => {
        if (cancelled || attempts >= maxAttempts) {
          if (!cancelled) setStatus('TIMEOUT');
          return;
        }

        attempts++;
        try {
          const res = await fetch(`/api/payments/status?tx_ref=${encodeURIComponent(txRef!)}`);
          const data = await res.json();
          if (data.status === 'PAID') {
            setStatus('PAID');
            return;
          }
          if (data.status === 'FAILED') {
            setStatus('FAILED');
            return;
          }
        } catch {
          // retry
        }

        setTimeout(poll, 1000);
      };

      poll();
    }

    verify();
    return () => { cancelled = true; };
  }, [txRef, transactionId]);

  if (!txRef) {
    notFound();
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md text-center flex flex-col items-center gap-6">
        {status === 'PAID' ? (
          <>
            <div className="rounded-full bg-success-container p-4">
              <CheckCircle size={48} className="text-on-success-container" />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-h1">Payment Successful!</h1>
              <p className="text-body" style={{ color: 'var(--color-ink-muted)' }}>
                Thank you for your purchase. The seller has been notified.
              </p>
            </div>
          </>
        ) : status === 'TIMEOUT' ? (
          <>
            <div className="rounded-full p-4" style={{ backgroundColor: 'var(--sys-error-container-role, #fce4ec)' }}>
              <Loader2 size={48} style={{ color: 'var(--sys-error-color-role, #e53935)' }} />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-h1">Still verifying...</h1>
              <p className="text-body" style={{ color: 'var(--color-ink-muted)' }}>
                Your payment is taking longer than expected. It should be confirmed shortly. Check your orders later.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-full p-4" style={{ backgroundColor: 'var(--sys-neutral-container-low)' }}>
              <Loader2 size={48} className="spinner" style={{ color: 'var(--color-brand)' }} />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-h1">Verifying Payment...</h1>
              <p className="text-body" style={{ color: 'var(--color-ink-muted)' }}>
                Please wait while we confirm your payment. This should only take a few seconds.
              </p>
            </div>
          </>
        )}

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
