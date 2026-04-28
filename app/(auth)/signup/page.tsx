'use client';

import * as React from 'react';
import { signUp } from '@/app/actions/auth';
import { Button } from '@/components/ui/Button';
import { Card, Input } from '@/components/ui/FormPrimitives';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signUp(formData);

    setLoading(false);
    if (result.success) {
      router.push('/login?message=Account created successfully. Please log in.');
    } else {
      setError(result.error || 'Something went wrong');
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen container">
      <Card className="w-full max-w-md flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-h1">Join SellSnap</h1>
          <p className="text-body-sm" style={{ color: 'var(--color-ink-muted)' }}>
            Start selling in minutes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Full Name" name="name" required placeholder="John Doe" />
          <Input label="Business Name" name="businessName" placeholder="John's Shop" />
          <Input label="Email Address" name="email" type="email" required placeholder="john@example.com" />
          <Input label="Password" name="password" type="password" required placeholder="••••••••" />
          
          {error && <p className="text-caption" style={{ color: 'var(--color-danger)' }}>{error}</p>}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-body-sm text-center">
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--color-brand)', fontWeight: 600 }}>
            Log in
          </Link>
        </p>
      </Card>
    </main>
  );
}
