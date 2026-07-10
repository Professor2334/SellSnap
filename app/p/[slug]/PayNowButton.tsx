'use client';

import * as React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function PayNowButton({ slug }: { slug: string }) {
  const [loading, setLoading] = React.useState(false);

  async function handlePay() {
    setLoading(true);
    // Navigate to the payment init route — it creates the order and redirects to Flutterwave
    window.location.href = `/api/payments/initialize?slug=${encodeURIComponent(slug)}`;
  }

  return (
    <Button
      variant="primary"
      size="lg"
      fullWidth
      onClick={handlePay}
      disabled={loading}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
    >
      {loading ? (
        <>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ transform: 'translateY(1px)' }}>Redirecting to payment…</span>
        </>
      ) : (
        <>
          <ShieldCheck size={20} />
          <span style={{ transform: 'translateY(1px)' }}>Pay Now</span>
        </>
      )}
    </Button>
  );
}
