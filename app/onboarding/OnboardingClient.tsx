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
    setLoading(true);
    const result = await skipOnboarding();
    
    if (result.success) {
      await update({ isOnboarded: true });
      router.push('/dashboard');
      router.refresh();
    } else {
      setError(result.error || 'Failed to skip onboarding');
      setLoading(false);
    }
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
    <div className="onboarding-screen" style={{ position: 'relative' }}>
      {/* Decorative Premium Background */}
      <div className="onboarding-bg-container">
        <div className="onboarding-glow-center" />
        <div className="onboarding-edge-pattern-left" />
        <div className="onboarding-edge-pattern-right" />
        <div className="onboarding-floating-shape onboarding-shape-1" />
        <div className="onboarding-floating-shape onboarding-shape-2" />
        <div className="onboarding-floating-shape onboarding-shape-3" />
      </div>

      <div className="onboarding-container" style={{ maxWidth: '605px', width: '100%', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
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
            padding: step === 3 ? '24px 40px' : '40px 40px',
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            backgroundColor: 'transparent'
          }}
        >
          {step === 1 && (
              <div key={1} className="animate-fade-in-up flex flex-col items-center">
              <div className="text-center" style={{ marginBottom: '15px' }}>
                <h2 className="onboarding-step1-title text-h1 mb-2 tracking-tight" style={{ color: 'var(--sys-on-neutral-color-role)', fontSize: '28px', fontWeight: '700', lineHeight: '1' }}>
                  Welcome, {userName.split(' ')[0]}!
                </h2>
                <p style={{ color: 'var(--sys-on-neutral-variant-role)', fontSize: '14px', fontWeight: '400' }}>
                  Turn any product into a shareable payment link.
                </p>
              </div>


              <div className="w-full flex flex-col items-center gap-6 mt-4">
                <Button 
                  onClick={handleStep1} 
                  className="btn-primary btn-lg rounded-xl onboarding-step1-btn"
                  style={{ height: '56px', fontSize: '16px', paddingLeft: '28px', paddingRight: '28px', width: '100%', maxWidth: '400px' }}
                >
                  Let&apos;s Get Started
                </Button>
                <button 
                  onClick={handleSkip}
                  className="hover:text-brand hover-underline transition-colors"
                  style={{ 
                    color: 'var(--sys-outline-color-role)',
                    fontSize: '14px', 
                    fontWeight: '500',
                    opacity: 0.92,
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
            <div key={2} className="animate-fade-in-up flex flex-col items-center w-full">
              <div className="text-center mb-10">
                <h2 className="onboarding-step2-title text-h1 mb-2 tracking-tight" style={{ color: 'var(--sys-on-neutral-color-role)', fontSize: '24px', fontWeight: '700', lineHeight: '1' }}>Your Profile Looks Great</h2>
                <p style={{ color: 'var(--sys-on-neutral-variant-role)', fontSize: '14px', fontWeight: '400', maxWidth: '380px', margin: '0 auto', marginBottom: '10px' }}>
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
                marginBottom: '32px',
                backgroundColor: 'var(--sys-neutral-container-low)' 
              }}>
                <div style={{ 
                  width: '100%', 
                  backgroundColor: 'var(--sys-neutral-container-lowest)', 
                  borderRadius: '12px', 
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: '14px', fontWeight: '400', color: 'var(--sys-on-neutral-variant-role)' }}>Full name</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--sys-on-neutral-color-role)' }}>{userName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '400', color: 'var(--sys-on-neutral-variant-role)' }}>Business name</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--sys-on-neutral-color-role)' }}>{initialBusinessName || userName}</span>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col gap-8">
                <Button 
                  onClick={handleStep2Continue} 
                  className="btn-primary btn-lg btn-full rounded-xl"
                  style={{ height: '56px', fontSize: '16px' }}
                >
                  Looks Good, Continue
                </Button>
                <div className="flex items-center justify-between px-2 pb-4">
                  <button 
                    type="button"
                    onClick={handleBack}
                    className="hover:text-brand hover-underline transition-colors text-body-sm"
                    style={{ 
                      color: 'var(--sys-outline-color-role)',
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
                    className="hover:text-brand hover-underline transition-colors text-body-sm"
                    style={{ 
                      color: 'var(--sys-outline-color-role)',
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
            <div key={3} className="animate-fade-in-up flex flex-col w-full text-left">
              <div className="mb-6">
                <h2 className="onboarding-step3-title text-h1 text-ink mb-1 tracking-tight" style={{ fontSize: '24px', fontWeight: '700', lineHeight: '1' }}>Create Your First Product</h2>
                  <p className="onboarding-step3-desc" style={{ color: 'var(--sys-on-neutral-variant-role)', fontSize: '14px', fontWeight: '400' }}>
                    Add a product to generate a shareable payment link instantly.
                  </p>
              </div>

              <form onSubmit={handleStep3} className="w-full" noValidate onFocus={() => setError(null)}>
                <div className="flex flex-col gap-5 mb-8">
                  <Input
                    id="name"
                    name="name"
                    label="Product Name"
                    placeholder="e.g. Handmade Earrings"
                    value={productName}
                    onChange={(e) => { setProductName(e.target.value); setFieldErrors(prev => ({ ...prev, name: undefined })); }}
                    onBlur={(e) => { if (!e.currentTarget.value.trim()) setFieldErrors(prev => ({ ...prev, name: 'Field cannot be empty' })); }}
                    autoFocus
                    error={fieldErrors.name}
                  />

                  <div>
                    <label htmlFor="description" className="input-label mb-3 block" style={{ fontSize: '13px', fontWeight: '400', color: 'var(--sys-on-neutral-variant-role)' }}>Description</label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Describe your product — material, size, what makes it special..."
                      value={productDescription}
                      onChange={(e) => { setProductDescription(e.target.value); setFieldErrors(prev => ({ ...prev, description: undefined })); }}
                      onBlur={(e) => { if (!e.currentTarget.value.trim()) setFieldErrors(prev => ({ ...prev, description: 'Field cannot be empty' })); }}
                      className={clsx('input-field w-full', fieldErrors.description && 'input-error')}
                      style={{ height: '96px', borderRadius: '12px', border: '1px solid var(--color-border)', fontSize: '14px', padding: '12px 16px', resize: 'none' }}
                    />
                    {fieldErrors.description && (
                      <p className="input-error-text" style={{ marginTop: '4px' }}>{fieldErrors.description}</p>
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
                    error={fieldErrors.price}
                  />


                  <div>
                    <label className="input-label mb-3 block" style={{ fontSize: '13px', fontWeight: '400', color: 'var(--sys-on-neutral-variant-role)' }}>Product Image</label>
                    <div 
                      className="upload-zone w-full flex flex-col items-center justify-center rounded-xl overflow-hidden"
                      style={{ height: imagePreview ? 'auto' : '100px', border: '1px dashed var(--sys-outline-variant-color-role)', cursor: 'pointer' }}
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
                            <Upload size={20} className="mb-2" style={{ color: 'var(--sys-on-neutral-variant-role)' }} />
                            <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--sys-on-neutral-color-role)' }}>Click or drag file to upload</span>
                            <span style={{ fontSize: '11px', color: 'var(--sys-on-neutral-variant-role)', marginTop: '2px' }}>Max size 5MB</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="w-full flex flex-col items-center gap-4">
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="btn-primary btn-lg btn-full rounded-xl"
                    style={{ height: '56px', fontSize: '16px', backgroundColor: 'var(--color-brand)' }}
                  >
                    {loading ? <Loader2 className="spinner mr-2" /> : 'Create Product'}
                  </Button>
                  <button 
                    type="button"
                    onClick={handleSkip}
                    className="hover:text-brand hover-underline transition-colors text-body-sm"
                    style={{ 
                      color: 'var(--sys-outline-color-role)',
                      fontWeight: '500',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      outline: 'none',
                      marginTop: '8px'
                    }}
                  >
                    Skip for now, I&apos;ll do this later
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