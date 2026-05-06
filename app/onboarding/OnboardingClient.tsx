'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/FormPrimitives';
import { updateBusinessName, createFirstProduct } from '@/app/actions/onboarding';
import { Loader2, ArrowRight, ShoppingBag, Store, Zap, ShieldCheck, BarChart3, Check } from 'lucide-react';
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
      <div className="onboarding-container max-w-xl">
        
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
        <div className="onboarding-card animate-fade-in-up" style={{ padding: '40px 32px' }}>
          {step === 1 && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-sm" style={{ backgroundColor: 'var(--sys-primary-container-role)', color: 'var(--color-brand)' }}>
                <Zap size={32} fill="var(--color-brand)" strokeWidth={0} />
              </div>
              
              <div className="text-center mb-10">
                <h2 className="text-h1 text-ink mb-3" style={{ fontSize: '28px', fontWeight: '700' }}>
                  Welcome, {userName.split(' ')[0]}! 🎉
                </h2>
                <p className="text-ink-muted text-body leading-relaxed" style={{ fontSize: '15px' }}>
                  SellSnap turns any product into a shareable payment link in seconds. Share it on WhatsApp or Instagram — no store needed.
                </p>
              </div>

              <div className="space-y-6 mb-12 w-full max-w-sm">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 mt-1" style={{ color: 'var(--color-brand)' }}>
                    <Zap size={20} />
                  </div>
                  <div>
                    <h3 className="text-ink font-bold mb-1" style={{ fontSize: '15px' }}>Instant links</h3>
                    <p className="text-ink-muted text-body-sm" style={{ fontSize: '13px', lineHeight: '1.5' }}>Generate a unique payment link for any product in under a minute.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 mt-1" style={{ color: 'var(--color-brand)' }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-ink font-bold mb-1" style={{ fontSize: '15px' }}>Secure payments</h3>
                    <p className="text-ink-muted text-body-sm" style={{ fontSize: '13px', lineHeight: '1.5' }}>Powered by Flutterwave — trusted by millions across Africa.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 mt-1" style={{ color: 'var(--color-brand)' }}>
                    <BarChart3 size={20} />
                  </div>
                  <div>
                    <h3 className="text-ink font-bold mb-1" style={{ fontSize: '15px' }}>Track everything</h3>
                    <p className="text-ink-muted text-body-sm" style={{ fontSize: '13px', lineHeight: '1.5' }}>See every order and payment from your personal dashboard.</p>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col items-center gap-4">
                <Button 
                  onClick={handleStep1} 
                  className="btn-primary btn-lg btn-full rounded-xl"
                  style={{ height: '56px', fontSize: '16px' }}
                >
                  Let&apos;s get started <ArrowRight size={20} className="ml-2" />
                </Button>
                <button 
                  onClick={handleSkip}
                  className="text-ink-muted hover:text-brand font-semibold text-body-sm transition-colors"
                  style={{ fontSize: '13px' }}
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
                    className="text-ink-muted hover:text-brand font-semibold text-body-sm transition-colors"
                    style={{ fontSize: '13px' }}
                  >
                    Skip for now
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

                <div className="w-full">
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="btn-primary btn-lg btn-full rounded-xl"
                    style={{ height: '56px', fontSize: '16px' }}
                  >
                    {loading ? <Loader2 className="spinner mr-2" /> : 'Complete Setup'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
