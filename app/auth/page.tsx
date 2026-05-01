'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';
import { signUp } from '@/app/actions/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/FormPrimitives';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

type AuthMode = 'login' | 'signup';

function AuthContent() {
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<{ name?: string; email?: string; businessName?: string; password?: string }>({});
  const [loading, setLoading] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [nameDone, setNameDone] = React.useState(false);
  const [emailDone, setEmailDone] = React.useState(false);
  const [businessDone, setBusinessDone] = React.useState(false);
  const [passwordDone, setPasswordDone] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [loginEmailDone, setLoginEmailDone] = React.useState(false);
  const [loginPasswordDone, setLoginPasswordDone] = React.useState(false);

  const [passwordReqs, setPasswordReqs] = React.useState<{ min: boolean; upper: boolean; lower: boolean; number: boolean; special: boolean } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get('mode') as AuthMode) || 'signup';
  const message = searchParams.get('message');
  const nameInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (mode === 'signup' && step === 1) {
      nameInputRef.current?.focus();
    }
  }, [mode, step]);

  function setMode(m: AuthMode) {
    setStep(1);
    setFieldErrors({});
    setNameDone(false);
    setEmailDone(false);
    setBusinessDone(false);
    setPasswordDone(false);
    setPasswordReqs(null);
    setLoginEmailDone(false);
    setLoginPasswordDone(false);
    router.push(`/auth?mode=${m}`);
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const emailVal = (formData.get('email') as string).trim();
    const password = (formData.get('password') as string).trim();

    const errors: { email?: string; password?: string } = {};
    if (!emailVal) errors.email = 'fields cannot be empty';
    if (!password) errors.password = 'fields cannot be empty';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);

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

  function handleNameChange(value: string) {
    const trimmed = value.trim();
    if (trimmed.length > 0 && trimmed.length < 2) {
      setFieldErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters' }));
    } else {
      setFieldErrors(prev => ({ ...prev, name: undefined }));
    }
  }

  function handleEmailChange(value: string) {
    const trimmed = value.trim();
    if (trimmed.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setFieldErrors(prev => ({ ...prev, email: 'Enter a valid Email address' }));
    } else {
      setFieldErrors(prev => ({ ...prev, email: undefined }));
    }
  }

  function handleNameBlur(value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      setFieldErrors(prev => ({ ...prev, name: 'This field cannot be empty' }));
    } else if (trimmed.length >= 2) {
      setNameDone(true);
    }
  }

  function handleEmailBlur(value: string) {
    const trimmed = value.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailDone(true);
    }
  }

  function handleBusinessChange(value: string) {
    if (value.trim().length > 0) {
      setFieldErrors(prev => ({ ...prev, businessName: undefined }));
    }
  }

  function handleBusinessBlur(value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      setFieldErrors(prev => ({ ...prev, businessName: 'This field cannot be empty' }));
    } else {
      setBusinessDone(true);
    }
  }

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

  function handlePasswordBlur(value: string) {
    if (!value.trim()) {
      setFieldErrors(prev => ({ ...prev, password: 'This field cannot be empty' }));
    } else if (validatePassword(value)) {
      setPasswordDone(true);
    }
  }

  function handleStep1(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nameVal = (formData.get('name') as string).trim();
    const emailVal = (formData.get('email') as string).trim();

    const errors: { name?: string; email?: string } = {};
    if (!nameVal) errors.name = 'Field cannot be empty';
    if (!emailVal) errors.email = 'Field cannot be empty';

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setName(nameVal);
    setEmail(emailVal);
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
          {error && (
            <p className="auth-form-error-banner" role="alert">
              {error}
            </p>
          )}
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
          <form onSubmit={handleLogin} className="auth-form" noValidate onFocus={() => setError(null)}>
            <Input
              id="login-email"
              label="Enter Email"
              name="email"
              type="email"
              required
              placeholder="john@example.com"
              autoComplete="email"
              error={fieldErrors.email}
              className={loginEmailDone ? 'input-field-completed' : undefined}
              onChange={e => { if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.currentTarget.value.trim())) setFieldErrors(prev => ({ ...prev, email: undefined })); }}
              onBlur={e => { if (!e.currentTarget.value.trim()) setFieldErrors(prev => ({ ...prev, email: 'This field cannot be empty' })); else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.currentTarget.value.trim())) setLoginEmailDone(true); }}
            />
            <div className="password-input-wrapper">
              <Input
                id="login-password"
                label="Enter Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                autoComplete="current-password"
                error={fieldErrors.password}
                className={loginPasswordDone ? 'input-field-completed' : undefined}
                onBlur={e => { if (e.currentTarget.value.trim()) setLoginPasswordDone(true); }}
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

            <div style={{ textAlign: 'right', marginTop: '-12px' }}>
              <Link href="/auth/forgot-password" className="auth-form-link-small">Forgot password?</Link>
            </div>

            <Button
              id="login-submit"
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
            >
              {loading ? <Loader2 size={20} className="spinner" /> : 'Log in'}
            </Button>
          </form>
        ) : step === 1 ? (
          <form onSubmit={handleStep1} className="auth-form" noValidate onFocus={() => setError(null)}>
            <Input
              ref={nameInputRef}
              id="signup-name"
              label="Enter Full Name"
              name="name"
              required
              placeholder="John Doe"
              autoComplete="name"
              error={fieldErrors.name}
              className={nameDone ? 'input-field-completed' : undefined}
              onChange={e => handleNameChange(e.currentTarget.value)}
              onBlur={e => handleNameBlur(e.currentTarget.value)}
            />
            <Input
              id="signup-email"
              label="Enter Email"
              name="email"
              type="email"
              required
              placeholder="john@example.com"
              autoComplete="email"
              error={fieldErrors.email}
              className={emailDone ? 'input-field-completed' : undefined}
              onChange={e => handleEmailChange(e.currentTarget.value)}
              onBlur={e => handleEmailBlur(e.currentTarget.value)}
            />

            <Button type="submit" fullWidth size="lg">
              Continue <ArrowRight size={18} style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="auth-form" noValidate onFocus={() => setError(null)}>
            <Input
              id="signup-business"
              label="Enter Business Name"
              name="businessName"
              placeholder="John's Shop"
              autoComplete="organization"
              error={fieldErrors.businessName}
              className={businessDone ? 'input-field-completed' : undefined}
              onChange={e => handleBusinessChange(e.currentTarget.value)}
              onBlur={e => handleBusinessBlur(e.currentTarget.value)}
            />
            <div className="password-input-wrapper">
              <Input
                id="signup-password"
                label="Choose Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                autoComplete="new-password"
                error={fieldErrors.password}
                className={passwordDone ? 'input-field-completed' : undefined}
                onChange={e => handlePasswordChange(e.currentTarget.value)}
                onBlur={e => handlePasswordBlur(e.currentTarget.value)}
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

            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </Button>

            <button
              type="button"
              className="auth-form-link"
              onClick={() => {
                setStep(1);
                setError(null);
                setFieldErrors({});
                setNameDone(false);
                setEmailDone(false);
                setBusinessDone(false);
                setPasswordDone(false);
                setPasswordReqs(null);
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
