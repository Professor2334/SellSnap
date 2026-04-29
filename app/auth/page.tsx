'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';
import { signUp } from '@/app/actions/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/FormPrimitives';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

type AuthMode = 'login' | 'signup';

function AuthContent() {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get('mode') as AuthMode) || 'signup';
  const message = searchParams.get('message');

  function setMode(m: AuthMode) {
    setStep(1);
    router.push(`/auth?mode=${m}`);
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const emailVal = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await signIn('credentials', {
      email: emailVal,
      password,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  }

  function handleStep1(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setName(formData.get('name') as string);
    setEmail(formData.get('email') as string);
    setError(null);
    setStep(2);
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append('name', name);
    formData.append('email', email);
    const result = await signUp(formData);

    setLoading(false);
    if (result.success) {
      setStep(1);
      setName('');
      setEmail('');
      setMode('login');
    } else {
      setError(result.error || 'Something went wrong');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4 bg-bg">
      <div className="auth-card">
        <div className="auth-form-header">
          <div className="auth-brand-name">SellSnap</div>
          <h1 className="auth-form-title">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h1>
        </div>

        {message && (
          <div className="auth-success-banner" role="status">
            {message}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="auth-form">
            <Input
              id="login-email"
              label="Enter Email"
              name="email"
              type="email"
              required
              placeholder="john@example.com"
              autoComplete="email"
            />
            <Input
              id="login-password"
              label="Enter Password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />

            {error && (
              <p className="auth-form-error" role="alert">
                {error}
              </p>
            )}

            <Button
              id="login-submit"
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
            >
              {loading ? 'Logging in…' : 'Log in'}
            </Button>
          </form>
        ) : step === 1 ? (
          <form onSubmit={handleStep1} className="auth-form">
            <Input
              id="signup-name"
              label="Enter Full Name"
              name="name"
              required
              placeholder="John Doe"
              autoComplete="name"
            />
            <Input
              id="signup-email"
              label="Enter Email"
              name="email"
              type="email"
              required
              placeholder="john@example.com"
              autoComplete="email"
            />

            {error && (
              <p className="auth-form-error" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" fullWidth size="lg">
              Continue
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="auth-form">
            <Input
              id="signup-business"
              label="Enter Business Name"
              name="businessName"
              placeholder="John's Shop (optional)"
              autoComplete="organization"
            />
            <Input
              id="signup-password"
              label="Choose Password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              autoComplete="new-password"
            />

            {error && (
              <p className="auth-form-error" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </Button>

            <button
              type="button"
              className="auth-form-link"
              onClick={() => {
                setStep(1);
                setError(null);
              }}
            >
              ← Back
            </button>
          </form>
        )}

        <p className="auth-form-footer">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                className="auth-form-link"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
              >
                Sign up free
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                className="auth-form-link"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="auth-loading">Loading…</div>}>
      <AuthContent />
    </Suspense>
  );
}
