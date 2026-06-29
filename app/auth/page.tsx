'use client';

import * as React from 'react';
import { signIn, getSession } from 'next-auth/react';
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
  const [googleLoading, setGoogleLoading] = React.useState(false);
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

  // Clear any stale validation errors when the mode changes (e.g. blur fires
  // on the name input right before the "Log in" click handler runs, producing
  // a spurious "field cannot be empty" message on the login form).
  React.useEffect(() => {
    setFieldErrors({});
    setError(null);
  }, [mode]);

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

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err) {
      setError('Failed to authenticate with Google');
      setGoogleLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const emailVal = (formData.get('email') as string).trim().toLowerCase();
    const password = (formData.get('password') as string);

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
      setError(result.error);
    } else {
      router.push('/dashboard');
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

    if (result.success) {
      const password = formData.get('password') as string;
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError(signInResult.error);
        setLoading(false);
      } else {
        router.push('/onboarding');
      }
    } else {
      setLoading(false);
      setError(result.error || 'Something went wrong');
    }
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
          {error && (
            <p className="auth-form-error-banner" role="alert" style={{ marginBottom: '16px' }}>
              {error}
            </p>
          )}
          <div className="auth-brand-name-refined">SellSnap</div>
          <h1 className="auth-form-title-refined">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h1>
        </div>

        {message && (
          <div className="auth-success-banner auth-stagger-1" role="status" style={{ marginBottom: '24px' }}>
            {message}
          </div>
        )}

        <div className="auth-stagger-2" style={{ marginBottom: '8px' }}>
          <Button
            type="button"
            fullWidth
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            className="google-auth-btn-refined"
          >
            {googleLoading ? (
              <Loader2 size={20} className="spinner" />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </Button>
        </div>

        <div className="auth-divider auth-stagger-3">
          <div className="auth-divider-line"></div>
          <div className="auth-divider-text">OR</div>
          <div className="auth-divider-line"></div>
        </div>

        <div className="auth-stagger-4">
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="auth-form" noValidate onFocus={() => setError(null)}>
              <Input
                id="login-email"
                label="Email address"
                name="email"
                type="email"
                required
                placeholder="john@example.com"
                autoComplete="email"
                error={fieldErrors.email}
                className={`auth-input-refined ${loginEmailDone ? 'input-field-completed' : ''}`}
                onChange={e => { if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.currentTarget.value.trim())) setFieldErrors(prev => ({ ...prev, email: undefined })); }}
                onBlur={e => { if (!e.currentTarget.value.trim()) setFieldErrors(prev => ({ ...prev, email: 'This field cannot be empty' })); else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.currentTarget.value.trim())) setLoginEmailDone(true); }}
              />
              <div className="password-input-wrapper">
                <Input
                  id="login-password"
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  error={fieldErrors.password}
                  className={`auth-input-refined ${loginPasswordDone ? 'input-field-completed' : ''}`}
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
                style={{ height: '56px', borderRadius: '12px' }}
              >
                {loading ? <Loader2 size={20} className="spinner" /> : 'Log in'}
              </Button>
            </form>
          ) : step === 1 ? (
            <form onSubmit={handleStep1} className="auth-form" noValidate onFocus={() => setError(null)}>
              <Input
                ref={nameInputRef}
                id="signup-name"
                label="Full name"
                name="name"
                required
                placeholder="John Doe"
                autoComplete="name"
                error={fieldErrors.name}
                className={`auth-input-refined ${nameDone ? 'input-field-completed' : ''}`}
                onChange={e => handleNameChange(e.currentTarget.value)}
                onBlur={e => handleNameBlur(e.currentTarget.value)}
              />
              <Input
                id="signup-email"
                label="Email address"
                name="email"
                type="email"
                required
                placeholder="john@example.com"
                autoComplete="email"
                error={fieldErrors.email}
                className={`auth-input-refined ${emailDone ? 'input-field-completed' : ''}`}
                onChange={e => handleEmailChange(e.currentTarget.value)}
                onBlur={e => handleEmailBlur(e.currentTarget.value)}
              />

              <Button type="submit" fullWidth size="lg" style={{ height: '56px', borderRadius: '12px' }}>
                Continue <span className="auth-continue-arrow"><ArrowRight size={18} style={{ verticalAlign: 'middle', marginLeft: '8px' }} /></span>
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
                className={`auth-input-refined ${businessDone ? 'input-field-completed' : ''}`}
                onChange={e => handleBusinessChange(e.currentTarget.value)}
                onBlur={e => handleBusinessBlur(e.currentTarget.value)}
              />
              <div className="password-input-wrapper">
                <Input
                  id="signup-password"
                  label="Create password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  autoComplete="new-password"
                  error={fieldErrors.password}
                  className={`auth-input-refined ${passwordDone ? 'input-field-completed' : ''}`}
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

              <Button type="submit" fullWidth size="lg" disabled={loading} style={{ height: '56px', borderRadius: '12px' }}>
                {loading ? <Loader2 size={20} className="spinner" /> : 'Create account'}
              </Button>

              <button
                type="button"
                className="auth-form-link"
                style={{ marginTop: '16px' }}
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

          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'var(--color-ink-muted)' }}>
            {mode === 'login' ? (
              <>
                <span style={{ fontWeight: 400 }}>Don&apos;t have an account?</span>{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--color-brand)', fontWeight: 500, cursor: 'pointer', padding: 0 }}
                >
                  Create account
                </button>
              </>
            ) : (
              <>
                <span style={{ fontWeight: 400 }}>Already have an account?</span>{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--color-brand)', fontWeight: 500, cursor: 'pointer', padding: 0 }}
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </div>
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
