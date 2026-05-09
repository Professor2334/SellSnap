'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/FormPrimitives';
import { updateBusinessName, createFirstProduct } from '@/app/actions/onboarding';
import { Loader2, ArrowRight, ArrowLeft, ShoppingBag, Store, Zap, ShieldCheck, BarChart3, Check } from 'lucide-react';
import { clsx } from 'clsx';

export default function OnboardingClient({ userName }: { userName: string }) {
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  // Step 2 state
  const [businessName, setBusinessName] = React.useState('');

  // Step 3 state
  const [productName, setProductName] = React.useState('');
  const [productPrice, setProductPrice] = React.useState('');

  async function handleStep1() {
    setStep(2);
  }

  async function handleStep2(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateBusinessName(formData);

    setLoading(false);
    if (result.success) {
      setStep(3);
    } else {
      setError(result.error || 'Failed to update business name');
    }
  }

  async function handleStep3(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createFirstProduct(formData);

    setLoading(false);
    if (result.success) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setError(result.error || 'Failed to create product');
    }
  }

  const handleSkip = () => {
    router.push('/dashboard');
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStepper = () => (
    <div className="onboarding-step-indicator" style={{ marginBottom: '24px' }}>
      {[1, 2, 3].map((s) => (
        <div 
          key={s}
          className={clsx(
            "onboarding-dot",
            step === s && "active",
            step > s && "completed"
          )} 
          style={{ 
            backgroundColor: step === s ? 'var(--color-brand)' : (step > s ? 'var(--color-brand)' : 'var(--color-border)'),
            width: '8px',
            height: '8px'
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="onboarding-screen">
      <div className="onboarding-container" style={{ maxWidth: '605px', width: '100%', margin: '0 auto' }}>
        
        {/* Brand Logo Header */}
        <div className="onboarding-logo" style={{ fontSize: '24px', marginBottom: '16px' }}>SellSnap</div>

        {/* Step Indicator Above */}
        <div className="text-center text-ink-subtle font-bold tracking-widest text-caption uppercase mb-4" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
          Step {step} of 3
        </div>

        {/* Progress Dots */}
        {renderStepper()}

        {/* Error State */}
        {error && (
          <div className="onboarding-error bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center text-sm font-semibold border border-red-100 animate-fade-in-up">
            {error}
          </div>
        )}

        {/* The Card */}
        <div className="onboarding-card animate-fade-in-up" style={{ padding: '48px 40px' }}>
          {step === 1 && (
              <div className="flex flex-col items-center">
              <div className="text-center" style={{ marginBottom: '15px' }}>
                <h2 className="text-h1 mb-2 tracking-tight" style={{ color: 'var(--sys-on-neutral-color-role)', fontSize: '28px', fontWeight: '700' }}>
                  Welcome, {userName.split(' ')[0]}!
                </h2>
                <p style={{ color: 'var(--sys-outline-color-role)', fontSize: '13.5px', lineHeight: '1.6', fontWeight: '400' }}>
                  Turn any product into a shareable payment link.
                </p>
              </div>

              <div className="flex flex-col w-full max-w-sm" style={{ gap: '20px', marginBottom: '56px' }}>
                <div className="flex items-start" style={{ gap: '22px' }}>
                  <div className="flex-shrink-0 mt-1" style={{ color: 'var(--color-brand)' }}>
                    <Zap size={22} />
                  </div>
                  <div>
                    <h3 className="text-ink" style={{ fontSize: '16px', fontWeight: '700', marginBottom: '5px' }}>Instant links</h3>
                    <p style={{ color: 'var(--sys-outline-color-role)', fontSize: '13.5px', lineHeight: '1.6', fontWeight: '400' }}>Create and share product links in seconds.</p>
                  </div>
                </div>
                <div className="flex items-start" style={{ gap: '22px' }}>
                  <div className="flex-shrink-0 mt-1" style={{ color: 'var(--color-brand)' }}>
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h3 className="text-ink" style={{ fontSize: '16px', fontWeight: '700', marginBottom: '2px' }}>Secure payments</h3>
                    <p style={{ color: 'var(--sys-outline-color-role)', fontSize: '13.5px', lineHeight: '1.6', fontWeight: '400' }}>Trusted payments powered by Flutterwave.</p>
                  </div>
                </div>
                <div className="flex items-start" style={{ gap: '22px' }}>
                  <div className="flex-shrink-0 mt-1" style={{ color: 'var(--color-brand)' }}>
                    <BarChart3 size={22} />
                  </div>
                  <div>
                    <h3 className="text-ink" style={{ fontSize: '16px', fontWeight: '700', marginBottom: '2px' }}>Track everything</h3>
                    <p style={{ color: 'var(--sys-outline-color-role)', fontSize: '13.5px', lineHeight: '1.6', fontWeight: '400' }}>Monitor orders, payments, and activity easily.</p>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col items-center gap-6 mt-4">
                <Button 
                  onClick={handleStep1} 
                  className="btn-primary btn-lg btn-full rounded-xl"
                  style={{ height: '56px', fontSize: '16px', paddingLeft: '28px', paddingRight: '28px' }}
                >
                  Let&apos;s get started<ArrowRight size={20} />
                </Button>
                <button 
                  onClick={handleSkip}
                  className="hover:text-brand transition-colors"
                  style={{ 
                    color: 'var(--sys-outline-color-role)',
                    fontSize: '14px', 
                    fontWeight: '500',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    outline: 'none'
                  }}
                >
                  Skip for now
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-border" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-brand)' }}>
                <Store size={32} />
              </div>
              
              <div className="text-center mb-10">
                <h2 className="text-h1 text-ink mb-3 tracking-tight" style={{ fontSize: '28px', fontWeight: '700' }}>Business Setup</h2>
                <p className="text-ink-muted text-body leading-relaxed" style={{ fontSize: '15px' }}>
                  What should customers see as your business name on payment links?
                </p>
              </div>

              <form onSubmit={handleStep2} className="w-full max-w-sm">
                <div className="mb-10">
                  <label htmlFor="businessName" className="input-label mb-2 block" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-ink-muted)' }}>Business Name</label>
                  <input
                    id="businessName"
                    name="businessName"
                    placeholder="e.g. Sanni's Electronics"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    autoFocus
                    className="input-field w-full"
                    style={{ height: '52px', borderRadius: '12px', border: '1.5px solid var(--color-border)', fontSize: '16px' }}
                  />
                </div>
                
                <div className="w-full flex flex-col items-center gap-4">
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="btn-primary btn-lg btn-full rounded-xl"
                    style={{ height: '56px', fontSize: '16px' }}
                  >
                    {loading ? <Loader2 className="spinner mr-2" /> : 'Continue'}
                  </Button>
                  <button 
                    type="button"
                    onClick={handleSkip}
                    className="hover:text-brand transition-colors"
                    style={{ 
                      color: 'var(--sys-outline-color-role)',
                      fontSize: '14px', 
                      fontWeight: '500',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      outline: 'none'
                    }}
                  >
                    Skip for now
                  </button>
                  <button 
                    type="button"
                    onClick={handleBack}
                    className="text-ink-muted hover:text-brand font-semibold text-body-sm transition-colors"
                    style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-border" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-brand)' }}>
                <ShoppingBag size={32} />
              </div>

              <div className="text-center mb-10">
                <h2 className="text-h1 text-ink mb-3 tracking-tight" style={{ fontSize: '28px', fontWeight: '700' }}>First Product Link</h2>
                <p className="text-ink-muted text-body leading-relaxed" style={{ fontSize: '15px' }}>
                  Let&apos;s create your first payment link to share immediately.
                </p>
              </div>

              <form onSubmit={handleStep3} className="w-full max-w-sm">
                <div className="space-y-6 mb-10">
                  <div>
                    <label htmlFor="name" className="input-label mb-2 block" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-ink-muted)' }}>Product Name</label>
                    <input
                      id="name"
                      name="name"
                      placeholder="e.g. Wireless Headphones"
                      required
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      autoFocus
                      className="input-field w-full"
                      style={{ height: '52px', borderRadius: '12px', border: '1.5px solid var(--color-border)', fontSize: '16px' }}
                    />
                  </div>
                  <div>
                    <label htmlFor="price" className="input-label mb-2 block" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-ink-muted)' }}>Price (₦)</label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="5000"
                      required
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      className="input-field w-full"
                      style={{ height: '52px', borderRadius: '12px', border: '1.5px solid var(--color-border)', fontSize: '16px' }}
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col items-center gap-4">
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="btn-primary btn-lg btn-full rounded-xl"
                    style={{ height: '56px', fontSize: '16px' }}
                  >
                    {loading ? <Loader2 className="spinner mr-2" /> : 'Complete Setup'}
                  </Button>
                  <button 
                    type="button"
                    onClick={handleSkip}
                    className="hover:text-brand transition-colors"
                    style={{ 
                      color: 'var(--sys-outline-color-role)',
                      fontSize: '14px', 
                      fontWeight: '500',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      outline: 'none'
                    }}
                  >
                    Skip for now
                  </button>
                  <button 
                    type="button"
                    onClick={handleBack}
                    className="text-ink-muted hover:text-brand font-semibold text-body-sm transition-colors"
                    style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}