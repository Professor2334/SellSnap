'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Card, Input } from '@/components/ui/FormPrimitives';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginContent() {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await signIn('credentials', {
      email,
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

  return (
    <main className="flex items-center justify-center min-h-screen container">
      <Card className="w-full max-w-md flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-h1">Welcome Back</h1>
          <p className="text-body-sm" style={{ color: 'var(--color-ink-muted)' }}>
            Log in to manage your products
          </p>
        </div>

        {message && (
          <div style={{ backgroundColor: 'var(--sys-success-conatiner-role)', padding: '12px', borderRadius: '8px', color: 'var(--sys-on-success-container-role)', fontSize: '14px' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Email Address" name="email" type="email" required placeholder="john@example.com" />
          <Input label="Password" name="password" type="password" required placeholder="••••••••" />
           
          {error && <p className="text-caption" style={{ color: 'var(--color-danger)' }}>{error}</p>}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>

        <p className="text-body-sm text-center">
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: 'var(--color-brand)', fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </Card>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
