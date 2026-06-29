'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/FormPrimitives';
import { forgotPassword } from '@/app/actions/auth';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await forgotPassword(formData);

    setLoading(false);
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Something went wrong');
    }
  }

  if (success) {
    return (
      <main className="auth-page-refined">
        <div className="auth-bg-container">
          <div className="auth-glow-center"></div>
          <div className="auth-orb-tl"></div>
          <div className="auth-orb-br"></div>
          <div className="auth-edge-pattern-left"></div>
          <div className="auth-edge-pattern-right"></div>
          <div className="auth-floating-shape auth-shape-1"></div>
          <div className="auth-floating-shape auth-shape-2"></div>
          <div className="auth-floating-shape auth-shape-3"></div>
        </div>
        <div className="auth-form-container">
          <div className="auth-header-refined auth-stagger-1">
            <Link href="/" className="auth-brand-name-refined" style={{ textDecoration: 'none' }}>SellSnap</Link>
            <h1 className="auth-form-title-refined">Check your email</h1>
          </div>
          <p className="auth-form-subtitle auth-stagger-2" style={{ textAlign: 'center', marginBottom: '24px' }}>
            If an account exists with that email, we&apos;ve sent a password reset link.
          </p>
          <div className="auth-stagger-3" style={{ display: 'flex', justifyContent: 'center' }}>
            <Link href="/auth?mode=login" className="auth-form-link" style={{ fontWeight: 500 }}>
              Back to login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page-refined">
      <div className="auth-bg-container">
        <div className="auth-glow-center"></div>
        <div className="auth-orb-tl"></div>
        <div className="auth-orb-br"></div>
        <div className="auth-edge-pattern-left"></div>
        <div className="auth-edge-pattern-right"></div>
        <div className="auth-floating-shape auth-shape-1"></div>
        <div className="auth-floating-shape auth-shape-2"></div>
        <div className="auth-floating-shape auth-shape-3"></div>
      </div>
      
      <div className="auth-form-container">
        <div className="auth-header-refined auth-stagger-1">
          <Link href="/" className="auth-brand-name-refined" style={{ textDecoration: 'none' }}>SellSnap</Link>
          <h1 className="auth-form-title-refined">Reset your password</h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form auth-stagger-2" noValidate>
          <div className="auth-input-refined" style={{ marginBottom: '24px' }}>
            <Input
              id="reset-email"
              label="Email address"
              name="email"
              type="email"
              required
              placeholder="john@example.com"
              autoComplete="email"
              error={error || undefined}
            />
          </div>
          <Button type="submit" fullWidth size="lg" disabled={loading} style={{ height: '56px', borderRadius: '12px' }}>
            {loading ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>

        <p className="auth-form-footer auth-stagger-3" style={{ textAlign: 'center', marginTop: '32px' }}>
          Remember your password?{' '}
          <Link href="/auth?mode=login" style={{ color: 'var(--color-brand)', fontWeight: 500 }}>
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
