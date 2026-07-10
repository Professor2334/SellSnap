'use client';

import * as React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';

export function PayNowButton({ slug }: { slug: string }) {
  const [loading, setLoading] = React.useState(false);

  async function handlePay() {
    setLoading(true);
    // Navigate to the payment init route — it creates the order and redirects to Flutterwave
    window.location.href = `/api/payments/initialize?slug=${encodeURIComponent(slug)}`;
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      style={{
        width: '100%',
        height: '56px',
        backgroundColor: loading ? 'var(--color-brand-hover)' : 'var(--color-brand)',
        color: '#fff',
        border: 'none',
        borderRadius: '14px',
        fontSize: '17px',
        fontWeight: 700,
        fontFamily: 'inherit',
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        transition: 'all 0.2s ease',
        boxShadow: loading ? 'none' : '0 4px 16px rgba(26, 127, 60, 0.35)',
        opacity: loading ? 0.8 : 1,
        letterSpacing: '-0.01em',
      }}
    >
      {loading ? (
        <>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          Redirecting to payment…
        </>
      ) : (
        <>
          <ShieldCheck size={20} />
          Pay Now
        </>
      )}
    </button>
  );
}
