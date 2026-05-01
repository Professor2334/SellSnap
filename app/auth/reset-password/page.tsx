'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/FormPrimitives';
import { Eye, EyeOff } from 'lucide-react';
import { resetPassword } from '@/app/actions/auth';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<{ password?: string }>({});
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordReqs, setPasswordReqs] = React.useState<{ min: boolean; upper: boolean; lower: boolean; number: boolean; special: boolean } | null>(null);

  function validatePassword(value: string): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value);
  }

  function handlePasswordChange(value: string) {
    if (value.length > 0) {
      setPasswordReqs({
        min: value.length >= 8,
        upper: /[A-Z]/.test(value),
        lower: /[a-z]/.test(value),
        number: /\d/.test(value),
        special: /[\W_]/.test(value),
      });
      setFieldErrors(prev => ({ ...prev, password: undefined }));
    } else {
      setPasswordReqs(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Invalid reset link');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;

    if (!validatePassword(password)) {
      setFieldErrors({ password: 'Password does not meet requirements' });
      return;
    }

    formData.append('token', token);
    setLoading(true);

    const result = await resetPassword(formData);

    setLoading(false);
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Something went wrong');
    }
  }

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center py-12 px-4 bg-bg">
        <div className="auth-card">
          <div className="auth-form-header">
            <div className="auth-brand-name">SellSnap</div>
            <h1 className="auth-form-title">Invalid link</h1>
          </div>
          <p className="auth-form-subtitle" style={{ textAlign: 'center' }}>
            This reset link is invalid or missing.
          </p>
          <Link href="/auth/forgot-password" className="auth-form-link" style={{ textAlign: 'center' }}>
            Request a new reset link
          </Link>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center py-12 px-4 bg-bg">
        <div className="auth-card">
          <div className="auth-form-header">
            <div className="auth-brand-name">SellSnap</div>
            <h1 className="auth-form-title">Password reset</h1>
          </div>
          <p className="auth-form-subtitle" style={{ textAlign: 'center' }}>
            Your password has been reset successfully.
          </p>
          <Link href="/auth?mode=login" className="auth-form-link" style={{ textAlign: 'center' }}>
            Log in
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
          <h1 className="auth-form-title">Set new password</h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="password-input-wrapper">
            <Input
              id="new-password"
              label="New Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              autoComplete="new-password"
              error={fieldErrors.password}
              onChange={e => handlePasswordChange(e.currentTarget.value)}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {passwordReqs && (
            <ul className="password-reqs">
              {!passwordReqs.upper && <li>Password must contain at least one uppercase letter</li>}
              {passwordReqs.upper && !passwordReqs.lower && <li>Password must contain at least a lowercase letter</li>}
              {passwordReqs.upper && passwordReqs.lower && !passwordReqs.number && <li>Password must contain at least 1 number</li>}
              {passwordReqs.upper && passwordReqs.lower && passwordReqs.number && !passwordReqs.special && <li>Password must contain at least a special character</li>}
              {passwordReqs.upper && passwordReqs.lower && passwordReqs.number && passwordReqs.special && !passwordReqs.min && <li>Password must contain at least 8 character</li>}
            </ul>
          )}

          {error && (
            <p className="auth-form-error" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? 'Resetting…' : 'Reset password'}
          </Button>
        </form>

        <p className="auth-form-footer">
          <Link href="/auth?mode=login" className="auth-form-link">
            Back to login
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="auth-loading">Loading…</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
