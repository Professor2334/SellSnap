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
      <main className="min-h-screen flex items-center justify-center py-12 px-4 bg-bg">
        <div className="auth-card">
          <div className="auth-form-header">
            <div className="auth-brand-name">SellSnap</div>
            <h1 className="auth-form-title">Check your email</h1>
          </div>
          <p className="auth-form-subtitle" style={{ textAlign: 'center' }}>
            If an account exists with that email, we&apos;ve sent a password reset link.
          </p>
          <Link href="/auth?mode=login" className="auth-form-link" style={{ textAlign: 'center' }}>
            Back to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4 bg-bg">
      <div className="auth-card">
        <div className="auth-form-header">
          <div className="auth-brand-name">SellSnap</div>
          <h1 className="auth-form-title">Reset your password</h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <Input
            id="reset-email"
            label="Enter Email"
            name="email"
            type="email"
            required
            placeholder="john@example.com"
            autoComplete="email"
            error={error || undefined}
          />
          <Button type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>

        <p className="auth-form-footer">
          Remember your password?{' '}
          <Link href="/auth?mode=login" className="auth-form-link">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
