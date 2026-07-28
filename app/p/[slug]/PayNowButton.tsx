'use client';

import * as React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function PayNowButton({ slug }: { slug: string }) {
  const [loading, setLoading] = React.useState(false);

  async function handlePay() {
    setLoading(true);
    try {
      const res = await fetch(`/api/payments/initialize?slug=${encodeURIComponent(slug)}`);
      const responseData = await res.json();
      
      if (!responseData.success) {
        throw new Error(responseData.error || 'Failed to initialize payment');
      }

      const { data } = responseData;
      
      // Try using the Flutterwave script if it's available globally
      if (typeof window !== 'undefined' && (window as any).FlutterwaveCheckout) {
        (window as any).FlutterwaveCheckout({
          public_key: data.public_key,
          tx_ref: data.tx_ref,
          amount: data.amount,
          currency: data.currency,
          customer: {
            email: data.customer_email,
            name: data.customer_name,
          },
          customizations: {
            title: data.title,
            description: data.description,
          },
          callback: function (payment_response: any) {
            // Check if payment was successful based on the inline response
            // Flutterwave might use 'successful' or 'success' depending on the API version
            if (payment_response.status === 'successful' || payment_response.status === 'success') {
              const url = new URL(data.redirect_url);
              if (payment_response.tx_ref) url.searchParams.set('tx_ref', payment_response.tx_ref);
              else if (data.tx_ref) url.searchParams.set('tx_ref', data.tx_ref);
              
              if (payment_response.transaction_id) url.searchParams.set('transaction_id', payment_response.transaction_id);
              
              window.location.href = url.toString();
            } else {
              setLoading(false);
            }
          },
          onclose: function() {
            setLoading(false);
          }
        });
      } else {
        // Fallback to the server redirect if script didn't load
        window.location.href = data.redirect_url;
      }
    } catch (e) {
      console.error(e);
      window.location.href = `/p/${slug}?error=payment_init_failed`;
    }
  }

  return (
    <>
      {/* Inject Flutterwave v3 Inline Script */}
      <script src="https://checkout.flutterwave.com/v3.js" async></script>
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
            <span style={{ transform: 'translateY(1px)' }}>Processing…</span>
          </>
        ) : (
          <>
            <ShieldCheck size={20} />
            <span style={{ transform: 'translateY(1px)' }}>Pay Now</span>
          </>
        )}
      </Button>
    </>
  );
}
