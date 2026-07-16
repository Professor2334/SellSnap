'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error internally for debugging, do not expose to users
    console.error('[Error Boundary] Unhandled error:', error);
  }, [error]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center', backgroundColor: 'var(--color-bg)' }}>
      <h1 className="text-display font-bold text-ink" style={{ marginBottom: 16 }}>Something went wrong</h1>
      <p className="text-body text-ink-muted" style={{ maxWidth: 400, marginBottom: 32 }}>
        An unexpected error occurred. We&apos;re sorry for the inconvenience. Please try again.
      </p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        <Button variant="primary" size="lg" onClick={() => reset()}>
          Try again
        </Button>
        <Button variant="secondary" size="lg" onClick={() => window.location.href = '/'}>
          Go Home
        </Button>
      </div>
    </div>
  );
}
