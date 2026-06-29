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
            <h1 className="auth-form-title-refined">Invalid link</h1>
          </div>
          <p className="auth-form-subtitle auth-stagger-2" style={{ textAlign: 'center', marginBottom: '24px' }}>
            This reset link is invalid or missing.
          </p>
          <div className="auth-stagger-3" style={{ display: 'flex', justifyContent: 'center' }}>
            <Link href="/auth/forgot-password" className="auth-form-link" style={{ fontWeight: 500 }}>
              Request a new reset link
            </Link>
          </div>
        </div>
      </main>
    );
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
            <h1 className="auth-form-title-refined">Password reset</h1>
          </div>
          <p className="auth-form-subtitle auth-stagger-2" style={{ textAlign: 'center', marginBottom: '24px' }}>
            Your password has been reset successfully.
          </p>
          <div className="auth-stagger-3" style={{ display: 'flex', justifyContent: 'center' }}>
            <Link href="/auth?mode=login" className="auth-form-link" style={{ fontWeight: 500 }}>
              Log in
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
          <h1 className="auth-form-title-refined">Set new password</h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form auth-stagger-2" noValidate>
          <div className="password-input-wrapper auth-input-refined" style={{ marginBottom: '16px' }}>
            <Input
              id="new-password"
              label="New password"
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
            <ul className="password-reqs" style={{ marginBottom: '16px' }}>
              {!passwordReqs.upper && <li>Password must contain at least one uppercase letter</li>}
              {passwordReqs.upper && !passwordReqs.lower && <li>Password must contain at least a lowercase letter</li>}
              {passwordReqs.upper && passwordReqs.lower && !passwordReqs.number && <li>Password must contain at least 1 number</li>}
              {passwordReqs.upper && passwordReqs.lower && passwordReqs.number && !passwordReqs.special && <li>Password must contain at least a special character</li>}
              {passwordReqs.upper && passwordReqs.lower && passwordReqs.number && passwordReqs.special && !passwordReqs.min && <li>Password must contain at least 8 character</li>}
            </ul>
          )}

          {error && (
            <p className="auth-form-error-banner" role="alert" style={{ marginBottom: '16px' }}>
              {error}
            </p>
          )}

          <Button type="submit" fullWidth size="lg" disabled={loading} style={{ height: '56px', borderRadius: '12px' }}>
            {loading ? 'Resetting…' : 'Reset password'}
          </Button>
        </form>

        <p className="auth-form-footer auth-stagger-3" style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link href="/auth?mode=login" style={{ color: 'var(--color-brand)', fontWeight: 500 }}>
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
