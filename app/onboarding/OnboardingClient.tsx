'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/FormPrimitives';
import { createFirstProduct, skipOnboarding } from '@/app/actions/onboarding';
import { Loader2, ArrowLeft, ShoppingBag, Store, Zap, ShieldCheck, BarChart3, Check, Info, Upload } from 'lucide-react';
import { clsx } from 'clsx';

export default function OnboardingClient({ userName, businessName: initialBusinessName }: { userName: string; businessName: string }) {
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [skipLoading, setSkipLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const router = useRouter();
  const { update } = useSession();

  // Step 3 state
  const [productName, setProductName] = React.useState('');
  const [productPrice, setProductPrice] = React.useState('');
  const [productDescription, setProductDescription] = React.useState('');
  const [fieldErrors, setFieldErrors] = React.useState<{ name?: string; price?: string; description?: string }>({});

  async function handleStep1() {
    setStep(2);
  }

  function handleStep2Continue() {
    setStep(3);
  }

  async function handleStep3(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const errors: { name?: string; price?: string; description?: string } = {};
    if (!productName.trim()) errors.name = 'Field cannot be empty';
    if (!productDescription.trim()) errors.description = 'Field cannot be empty';
    if (!productPrice.trim()) errors.price = 'Field cannot be empty';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await createFirstProduct(formData);

    setLoading(false);
    if (result.success) {
      await update({ isOnboarded: true });
      router.push('/dashboard');
      router.refresh();
    } else {
      setError(result.error || 'Failed to create product');
    }
  }

  const handleSkip = async () => {
    setSkipLoading(true);
    const result = await skipOnboarding();
    
    if (result.success) {
      await update({ isOnboarded: true });
      router.push('/dashboard');
      router.refresh();
    } else {
      setError(result.error || 'Failed to skip onboarding');
      setSkipLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStepper = () => (
    <div className="onboarding-step-indicator-wrapper" style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--sys-on-neutral-variant-role)', marginBottom: '12px' }}>
        Step {step} of 3
      </span>
      <div style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '200px' }}>
        {[1, 2, 3].map((s) => (
          <div 
            key={s}
            style={{ 
              flex: 1,
              height: '4px',
              borderRadius: '2px',
              backgroundColor: step >= s ? 'var(--color-brand)' : 'var(--color-border)',
              opacity: step >= s ? 1 : 0.4,
              transition: 'all 300ms ease-out'
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="onboarding-screen" style={{ position: 'relative' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .premium-setup-btn {
          transition: all 200ms ease !important;
        }
        .premium-setup-btn:hover {
          transform: scale(1.01) translateY(-2px);
          box-shadow: 0 4px 14px rgba(26, 127, 60, 0.25);
        }
        .premium-setup-btn:active {
          transform: scale(0.99) translateY(0);
        }
        .onboarding-premium-fade {
          animation: onboardingPremiumFade 500ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes onboardingPremiumFade {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .wave-emoji {
          animation: waveAnimation 2.5s infinite;
          transform-origin: 70% 70%;
          display: inline-block;
          font-weight: normal;
          font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Segoe UI Symbol", sans-serif;
          -webkit-text-stroke: 0;
        }
        @keyframes waveAnimation {
          0% { transform: rotate(0.0deg) }
          10% { transform: rotate(14.0deg) }
          20% { transform: rotate(-8.0deg) }
          30% { transform: rotate(14.0deg) }
          40% { transform: rotate(-4.0deg) }
          50% { transform: rotate(10.0deg) }
          60% { transform: rotate(0.0deg) }
          100% { transform: rotate(0.0deg) }
        }
        .onboarding-step3 .input-label {
          font-weight: 500 !important;
          opacity: 0.8;
        }
        .premium-input {
          height: 54px;
          padding-left: 20px !important;
          padding-right: 20px !important;
          transition: all 200ms ease !important;
        }
        textarea.premium-input {
          height: auto;
        }
        .premium-input:focus {
          border-color: var(--color-brand) !important;
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand) 15%, transparent) !important;
        }
        .premium-input::placeholder {
          opacity: 0.4 !important;
        }
        .onboarding-step3 .input-error-text {
          font-size: 13px !important;
          margin-top: 6px !important;
          animation: errorFadeIn 300ms ease-out forwards;
        }
        @keyframes errorFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .premium-upload-zone {
          transition: all 200ms ease !important;
          border: 1.5px dashed var(--sys-outline-variant-color-role) !important;
        }
        .premium-upload-zone:hover {
          background-color: color-mix(in srgb, var(--color-brand) 4%, transparent) !important;
          border-color: color-mix(in srgb, var(--color-brand) 30%, transparent) !important;
        }
      `}} />
      {/* Decorative Premium Background */}
      <div className="onboarding-bg-container">
        <div className="onboarding-glow-center" />
        <div className="onboarding-edge-pattern-left" />
        <div className="onboarding-edge-pattern-right" />
        <div className="onboarding-floating-shape onboarding-shape-1" />
        <div className="onboarding-floating-shape onboarding-shape-2" />
        <div className="onboarding-floating-shape onboarding-shape-3" />
      </div>

      <div className="onboarding-container" style={{ maxWidth: '540px', width: '100%', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        {/* Brand Logo Header */}
        <div className="onboarding-logo" style={{ fontSize: '24px', marginBottom: '32px', textAlign: 'center' }}>SellSnap</div>



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
          className="onboarding-card onboarding-premium-fade" 
          style={{ 
            padding: step === 3 ? '24px 40px' : '40px 40px',
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            backgroundColor: 'transparent'
          }}
        >
          {step === 1 && (
              <div key={1} className="onboarding-premium-fade flex flex-col items-center">
              <div className="text-center" style={{ marginBottom: '32px' }}>
                <h2 className="onboarding-step1-title tracking-tight" style={{ color: 'var(--sys-on-neutral-color-role)', fontSize: '28px', fontWeight: '700', lineHeight: '1.2', marginBottom: '16px' }}>
                  Welcome to SellSnap <span className="wave-emoji">👋</span>
                </h2>
                <div style={{ lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '480px', margin: '0 auto' }}>
                  <p style={{ color: 'var(--sys-on-neutral-color-role)', fontSize: '16px', fontWeight: '500' }}>
                    Hi {userName.split(' ')[0]}, let's get your store ready in less than a minute.
                  </p>
                  <p style={{ color: 'var(--sys-on-neutral-variant-role)', fontSize: '15px', fontWeight: '400', opacity: 0.85 }}>
                    We'll help you create your first product and start accepting payments in minutes.
                  </p>
                </div>
              </div>

              <div className="w-full flex flex-col items-center gap-4">
                <Button 
                  onClick={handleStep1} 
                  disabled={loading || skipLoading}
                  className="btn-primary btn-lg rounded-xl premium-setup-btn"
                  style={{ height: '56px', fontSize: '16px', paddingLeft: '28px', paddingRight: '28px', width: '100%', maxWidth: '400px' }}
                >
                  Start Setup &rarr;
                </Button>
                <button 
                  onClick={handleSkip}
                  disabled={loading || skipLoading}
                  className="hover:text-brand transition-colors"
                  style={{ 
                    color: 'var(--sys-outline-color-role)',
                    fontSize: '13px', 
                    fontWeight: '400',
                    opacity: 0.65,
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: '8px',
                    outline: 'none',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  {skipLoading && <Loader2 className="spinner" size={14} />}
                  Skip for now
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div key={2} className="onboarding-premium-fade flex flex-col items-center w-full" style={{ marginTop: '24px' }}>
              <div className="text-center" style={{ marginBottom: '36px' }}>
                <h2 className="onboarding-step2-title tracking-tight" style={{ color: 'var(--sys-on-neutral-color-role)', fontSize: '24px', fontWeight: '700', lineHeight: '1', marginBottom: '16px' }}>
                  Your Profile Looks Great
                </h2>
                <p style={{ color: 'var(--sys-on-neutral-variant-role)', fontSize: '15px', fontWeight: '400', opacity: 0.75, maxWidth: '380px', margin: '0 auto' }}>
                  How buyers see you. Update anytime.
                </p>
              </div>

              <div style={{ 
                width: '100%', 
                borderRadius: '16px', 
                paddingLeft: '24px', 
                paddingRight: '24px', 
                paddingBottom: '24px', 
                paddingTop: '76px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                marginBottom: '40px',
                backgroundColor: 'var(--sys-neutral-container-low)' 
              }}>
                <div style={{ 
                  width: '100%', 
                  backgroundColor: 'var(--sys-neutral-container-lowest)', 
                  borderRadius: '12px', 
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(0, 0, 0, 0.04)' }}>
                    <span style={{ fontSize: '14px', fontWeight: '400', color: 'var(--sys-on-neutral-variant-role)', opacity: 0.7 }}>Full name</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--sys-on-neutral-color-role)' }}>{userName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '400', color: 'var(--sys-on-neutral-variant-role)', opacity: 0.7 }}>Business name</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--sys-on-neutral-color-role)' }}>{initialBusinessName || userName}</span>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col" style={{ gap: '20px' }}>
                <Button 
                  onClick={handleStep2Continue} 
                  disabled={loading || skipLoading}
                  className="btn-primary btn-lg btn-full rounded-xl premium-setup-btn"
                  style={{ height: '56px', fontSize: '16px' }}
                >
                  Looks Good, Continue
                </Button>
                <div className="flex items-center justify-between px-2 pb-2">
                  <button 
                    type="button"
                    onClick={handleBack}
                    disabled={loading || skipLoading}
                    className="hover:text-brand transition-colors"
                    style={{ 
                      color: 'var(--sys-outline-color-role)',
                      fontSize: '14px',
                      fontWeight: '500',
                      opacity: 0.75,
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      padding: '8px',
                      outline: 'none',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button 
                    type="button"
                    onClick={handleSkip}
                    disabled={loading || skipLoading}
                    className="hover:text-brand transition-colors"
                    style={{ 
                      color: 'var(--sys-outline-color-role)',
                      fontSize: '14px',
                      fontWeight: '500',
                      opacity: 0.75,
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      padding: '8px',
                      outline: 'none',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    {skipLoading && <Loader2 className="spinner" size={14} />}
                    Skip
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div key={3} className="onboarding-premium-fade onboarding-step3 flex flex-col w-full text-left">
              <div style={{ marginBottom: '36px' }}>
                <h2 className="onboarding-step3-title tracking-tight" style={{ color: 'var(--sys-on-neutral-color-role)', fontSize: '24px', fontWeight: '700', lineHeight: '1', marginBottom: '16px' }}>
                  Create Your First Product
                </h2>
                <p className="onboarding-step3-desc" style={{ color: 'var(--sys-on-neutral-variant-role)', fontSize: '15px', fontWeight: '400', opacity: 0.75 }}>
                  Add a product to generate a shareable payment link instantly.
                </p>
              </div>

              <form onSubmit={handleStep3} className="w-full" noValidate onFocus={() => setError(null)}>
                <div className="flex flex-col" style={{ gap: '24px', marginBottom: '40px' }}>
                  <Input
                    id="name"
                    name="name"
                    label="Product Name"
                    placeholder="e.g. Handmade Earrings"
                    value={productName}
                    onChange={(e) => { setProductName(e.target.value); setFieldErrors(prev => ({ ...prev, name: undefined })); }}
                    onBlur={(e) => { if (!e.currentTarget.value.trim()) setFieldErrors(prev => ({ ...prev, name: 'Field cannot be empty' })); }}
                    autoFocus
                    className="premium-input"
                    error={fieldErrors.name}
                  />

                  <div>
                    <label htmlFor="description" className="input-label mb-3 block" style={{ fontSize: '13px', fontWeight: '500', color: 'var(--sys-on-neutral-color-role)', opacity: 0.8 }}>Description</label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Describe your product — material, size, what makes it special..."
                      value={productDescription}
                      onChange={(e) => { setProductDescription(e.target.value); setFieldErrors(prev => ({ ...prev, description: undefined })); }}
                      onBlur={(e) => { if (!e.currentTarget.value.trim()) setFieldErrors(prev => ({ ...prev, description: 'Field cannot be empty' })); }}
                      className={clsx('input-field w-full premium-input', fieldErrors.description && 'input-error')}
                      style={{ minHeight: '120px', borderRadius: '12px', border: '1px solid var(--color-border)', fontSize: '14px', paddingTop: '16px', paddingBottom: '16px', resize: 'none' }}
                    />
                    {fieldErrors.description && (
                      <p className="input-error-text" style={{ marginTop: '6px' }}>{fieldErrors.description}</p>
                    )}
                  </div>

                  <Input
                    id="price"
                    name="price"
                    label="Price (NGN)"
                    type="number"
                    placeholder="e.g. 5000"
                    value={productPrice}
                    onChange={(e) => { setProductPrice(e.target.value); setFieldErrors(prev => ({ ...prev, price: undefined })); }}
                    onBlur={(e) => { if (!e.currentTarget.value.trim()) setFieldErrors(prev => ({ ...prev, price: 'Field cannot be empty' })); }}
                    className="premium-input"
                    error={fieldErrors.price}
                  />

                  <div>
                    <label className="input-label mb-3 block" style={{ fontSize: '13px', fontWeight: '500', color: 'var(--sys-on-neutral-color-role)', opacity: 0.8 }}>Product Image</label>
                    <div 
                      className="upload-zone premium-upload-zone w-full flex flex-col items-center justify-center rounded-xl overflow-hidden"
                      style={{ height: imagePreview ? 'auto' : '120px', cursor: 'pointer' }}
                      onClick={() => document.getElementById('product-image')?.click()}
                    >
                      <input type="file" name="image" id="product-image" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => setImagePreview(ev.target?.result as string);
                          reader.readAsDataURL(file);
                        }
                      }} />
                      <label htmlFor="product-image" className="flex flex-col items-center w-full h-full justify-center" style={{ cursor: 'pointer', width: '100%', height: '100%' }}>
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full object-cover" style={{ maxHeight: '240px', borderRadius: '12px' }} />
                        ) : (
                          <>
                            <Upload size={24} className="mb-2" style={{ color: 'var(--sys-on-neutral-variant-role)' }} />
                            <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--sys-on-neutral-color-role)' }}>Click or drag file to upload</span>
                            <span style={{ fontSize: '12px', color: 'var(--sys-on-neutral-variant-role)', marginTop: '4px' }}>Max size 5MB</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="w-full flex flex-col" style={{ gap: '24px' }}>
                  <Button 
                    type="submit" 
                    disabled={loading || skipLoading} 
                    className="btn-primary btn-lg btn-full rounded-xl premium-setup-btn"
                    style={{ height: '56px', fontSize: '16px' }}
                  >
                    {loading ? <Loader2 className="spinner mr-2" /> : 'Create Product'}
                  </Button>
                  <div className="flex items-center justify-between px-2 pb-2">
                    <button 
                      type="button"
                      onClick={handleBack}
                      disabled={loading || skipLoading}
                      className="hover:text-brand transition-colors"
                      style={{ 
                        color: 'var(--sys-outline-color-role)',
                        fontSize: '14px',
                        fontWeight: '500',
                        opacity: 0.75,
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        padding: '8px',
                        outline: 'none',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button 
                      type="button"
                      onClick={handleSkip}
                      disabled={loading || skipLoading}
                      className="hover:text-brand transition-colors"
                      style={{ 
                        color: 'var(--sys-outline-color-role)',
                        fontSize: '14px',
                        fontWeight: '500',
                        opacity: 0.75,
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        padding: '8px',
                        outline: 'none',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      {skipLoading && <Loader2 className="spinner" size={14} />}
                      I'll do this later
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}