'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/FormPrimitives';
import { createFirstProduct } from '@/app/actions/onboarding';
import { Loader2, ArrowRight, ArrowLeft, ShoppingBag, Store, Zap, ShieldCheck, BarChart3, Check, Info } from 'lucide-react';
import { clsx } from 'clsx';

export default function OnboardingClient({ userName, businessName: initialBusinessName }: { userName: string; businessName: string }) {
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  // Step 3 state
  const [productName, setProductName] = React.useState('');
  const [productPrice, setProductPrice] = React.useState('');

  async function handleStep1() {
    setStep(2);
  }

  function handleStep2Continue() {
    setStep(3);
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
            backgroundColor: step === s ? 'var(--color-brand)' : 'var(--color-border)',
            width: step === s ? '10px' : '7px',
            height: step === s ? '10px' : '7px',
            transition: 'all 0.3s ease'
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="onboarding-screen">
      <div className="onboarding-container" style={{ maxWidth: '605px', width: '100%', margin: '0 auto' }}>
        
        {/* Brand Logo Header */}
        <div className="onboarding-logo" style={{ fontSize: '24px', marginBottom: '8px' }}>SellSnap</div>



        {/* Progress Dots */}
        {renderStepper()}

        {/* Error State */}
        {error && (
          <div className="onboarding-error bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center text-sm font-semibold border border-red-100 animate-fade-in-up">
            {error}
          </div>
        )}

        {/* The Card */}
        <div 
          className="onboarding-card animate-fade-in-up" 
          style={{ 
            padding: '40px 40px',
            border: step === 1 ? 'none' : undefined,
            outline: step === 1 ? 'none' : undefined,
            boxShadow: step === 1 ? 'none' : undefined 
          }}
        >
          {step === 1 && (
              <div className="flex flex-col items-center">
              <div className="text-center" style={{ marginBottom: '15px' }}>
                <h2 className="text-h1 mb-2 tracking-tight" style={{ color: 'var(--sys-on-neutral-color-role)', fontSize: '28px', fontWeight: '700' }}>
                  Welcome, {userName.split(' ')[0]}!
                </h2>
                <p style={{ color: 'var(--sys-on-neutral-variant-role)', fontSize: '14px', lineHeight: '1.6', fontWeight: '450' }}>
                  Turn any product into a shareable payment link.
                </p>
              </div>


              <div className="w-full flex flex-col items-center gap-6 mt-4">
                <Button 
                  onClick={handleStep1} 
                  className="btn-primary btn-lg rounded-xl"
                  style={{ height: '56px', fontSize: '16px', paddingLeft: '28px', paddingRight: '28px', width: '100%', maxWidth: '400px' }}
                >
                  Let&apos;s get started<ArrowRight size={20} />
                </Button>
                <button 
                  onClick={handleSkip}
                  className="hover:text-brand hover-underline transition-colors"
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
            <div className="flex flex-col items-center w-full">
              <div className="text-center mb-6">
                <h2 className="text-h1 text-ink mb-2 tracking-tight" style={{ fontSize: '24px', fontWeight: '700' }}>Your profile looks great 👤</h2>
                <p className="text-ink-muted text-body leading-relaxed" style={{ fontSize: '14px', maxWidth: '380px', margin: '0 auto' }}>
                  Here's how buyers will see your seller details on every product page. You can update these anytime from Settings.
                </p>
              </div>

              <div className="w-full rounded-2xl p-6 flex flex-col items-center mb-4" style={{ backgroundColor: 'var(--sys-neutral-container-low)' }}>
                <div className="flex items-center justify-center rounded-full mb-6" style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-brand)', color: 'white', border: '3px solid var(--color-bg)', outline: '2px solid var(--color-brand)', outlineOffset: '2px', fontSize: '24px', fontWeight: '600' }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                
                <div className="w-full bg-white rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
                  <div className="flex justify-between items-center p-4 border-b border-border">
                    <span className="text-body-sm text-ink-muted font-medium">Full name</span>
                    <span className="text-body-sm text-ink font-semibold">{userName}</span>
                  </div>
                  <div className="flex justify-between items-center p-4">
                    <span className="text-body-sm text-ink-muted font-medium">Business name</span>
                    <span className="text-body-sm text-ink font-semibold">{initialBusinessName || userName}</span>
                  </div>
                </div>
              </div>

              <div className="w-full flex items-center gap-3 p-3 rounded-xl mb-6" style={{ backgroundColor: 'var(--sys-neutral-container-low)', opacity: 0.9 }}>
                <div style={{ color: 'var(--color-brand)' }}>
                  <Info size={18} />
                </div>
                <span className="text-body-sm" style={{ color: 'var(--sys-on-neutral-variant-role)' }}>Your payment link will show your business name to buyers.</span>
              </div>

              <div className="w-full flex flex-col gap-3">
                <Button 
                  onClick={handleStep2Continue} 
                  className="btn-primary btn-lg btn-full rounded-xl"
                  style={{ height: '56px', fontSize: '16px' }}
                >
                  Looks good, continue →
                </Button>
                <div className="flex items-center justify-between">
                  <button 
                    type="button"
                    onClick={handleBack}
                    className="hover:text-brand transition-colors"
                    style={{ 
                      color: 'var(--sys-outline-color-role)',
                      fontSize: '14px', 
                      fontWeight: '500',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      outline: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ArrowLeft size={16} /> Go back
                  </button>
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
                    Skip
                  </button>
                </div>
              </div>
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