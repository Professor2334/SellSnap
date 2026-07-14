'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  const router = useRouter();
  
  let txRef = searchParams.get('tx_ref');
  let transactionId = searchParams.get('transaction_id');

  // Flutterwave occasionally encodes the entire response into a "resp" JSON query parameter
  const respParam = searchParams.get('resp');
  if (respParam && !txRef) {
    try {
      // The resp param might be URL encoded, but searchParams.get already decodes it once.
      const parsed = JSON.parse(respParam);
      if (parsed.tx_ref) txRef = parsed.tx_ref;
      if (parsed.transaction_id || parsed.id) transactionId = String(parsed.transaction_id || parsed.id);
    } catch (e) {
      console.error('Failed to parse Flutterwave resp parameter:', e);
    }
  }

  const [status, setStatus] = React.useState<'PENDING' | 'PAID' | 'FAILED' | 'TIMEOUT'>('PENDING');

  // Temporary debug logging
  React.useEffect(() => {
    console.log('[DEBUG - Success Page] Full URL:', window.location.href);
    console.log('[DEBUG - Success Page] txRef:', txRef);
    console.log('[DEBUG - Success Page] transactionId:', transactionId);
  }, [txRef, transactionId]);

  React.useEffect(() => {
    if (!txRef) return;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 60;

    const poll = async () => {
      if (cancelled || attempts >= maxAttempts) {
        if (!cancelled) setStatus('TIMEOUT');
        return;
      }

      attempts++;

      try {
        // Always try direct Flutterwave verification first
        // Pass both tx_ref and transaction_id (which may be null)
        const verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tx_ref: txRef, transaction_id: transactionId }),
        });
        
        const verifyData = await verifyRes.json();
        console.log('[DEBUG - Success Page] /api/payments/verify response:', verifyData);
        
        if (verifyData.status === 'PAID') {
          setStatus('PAID');
          return;
        }
        
        if (verifyData.status === 'FAILED') {
          setStatus('FAILED');
          return;
        }

        if (verifyData.status === 'PENDING') {
          // Do nothing, just continue polling
        } else if (verifyData.success === false && attempts > 3) {
          // If the verification explicitly fails with an error (like DB connection failure)
          // and we've tried a few times, assume it failed.
          console.warn('[DEBUG - Success Page] Verification explicitly failed after 3 attempts');
          setStatus('FAILED');
          return;
        }

        // Also check local DB in case webhook already updated it
        const statusRes = await fetch(`/api/payments/status?tx_ref=${encodeURIComponent(txRef!)}`);
        const statusData = await statusRes.json();
        if (statusData.status === 'PAID') {
          setStatus('PAID');
          return;
        }
        if (statusData.status === 'FAILED') {
          setStatus('FAILED');
          return;
        }
      } catch {
        // retry on network error
      }

      // Poll every 3 seconds to avoid hammering the API
      setTimeout(poll, 3000);
    };

    poll();
    return () => { cancelled = true; };
  }, [txRef, transactionId]);

  // Redirect to home if no transaction reference (instead of notFound() which crashes in client components)
  React.useEffect(() => {
    if (!txRef) {
      router.replace('/');
    }
  }, [txRef, router]);

  if (!txRef) {
    return (
      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center flex flex-col items-center gap-6">
          <Loader2 size={48} className="spinner" style={{ color: 'var(--color-brand)' }} />
        </div>
      </main>
    );
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
        ) : status === 'FAILED' ? (
          <>
            <div className="rounded-full p-4" style={{ backgroundColor: 'var(--sys-error-container-role, #fce4ec)' }}>
              <Loader2 size={48} style={{ color: 'var(--sys-error-color-role, #e53935)' }} />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-h1">Verification Failed</h1>
              <p className="text-body" style={{ color: 'var(--color-ink-muted)' }}>
                We could not verify your payment. If you were charged, please contact support with your transaction reference.
              </p>
            </div>
            <Button 
              fullWidth 
              variant="secondary" 
              onClick={() => {
                setStatus('PENDING');
              }}
            >
              Try Verifying Again
            </Button>
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
