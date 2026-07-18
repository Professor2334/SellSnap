import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function CheckoutLoading() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface)', display: 'flex', justifyContent: 'center', paddingBottom: '96px', paddingTop: '48px' }}>
      <div style={{ width: '100%', maxWidth: '672px', margin: '0 auto', padding: '0 24px' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', borderRadius: '24px' }}>
          {/* Image Placeholder */}
          <div style={{ width: '100%', aspectRatio: '1 / 1', backgroundColor: 'var(--color-border)' }}></div>

          {/* Content Placeholder */}
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Skeleton style={{ height: '16px', width: '128px' }} />
              <Skeleton style={{ height: '32px', width: '256px' }} />
            </div>

            <Skeleton style={{ height: '40px', width: '160px', marginTop: '16px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '24px', borderTop: '1px solid var(--color-border)' }}>
              <Skeleton style={{ height: '16px', width: '100%' }} />
              <Skeleton style={{ height: '16px', width: '83%' }} />
              <Skeleton style={{ height: '16px', width: '66%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Button Placeholder for Mobile (Hidden on desktop in actual app via CSS, but we'll simulate the fixed block) */}
      <div style={{ position: 'fixed', bottom: '0', left: '0', right: '0', padding: '16px', backgroundColor: 'var(--color-bg)', borderTop: '1px solid var(--color-border)', zIndex: 10 }}>
        <Skeleton style={{ height: '56px', width: '100%', borderRadius: '12px' }} />
      </div>
    </div>
  );
}
