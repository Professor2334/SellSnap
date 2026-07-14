'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/FormPrimitives';
import { Button } from '@/components/ui/Button';
import { updateSettings, disconnectGoogle, signOutAllDevices } from '@/app/actions/settings';

export function SettingsClient({ user, hasGoogleAccount }: { user: any; hasGoogleAccount: boolean }) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    businessName: user.businessName || '',
    businessDescription: user.businessDescription || '',
    supportEmail: user.supportEmail || '',
    supportPhone: user.supportPhone || '',
    businessAddress: user.businessAddress || '',
    currency: user.currency || 'NGN',
    timeZone: user.timeZone || 'Africa/Lagos',
    dateFormat: user.dateFormat || 'DD/MM/YYYY',
  });
  
  const [initialData, setInitialData] = useState(formData);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  type SettingsView = 'settings' | 'support' | 'terms' | 'privacy';
  const [activeView, setActiveView] = useState<SettingsView>('settings');

  // For security card form (does not trigger global save)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setToast(null);
    const res = await updateSettings(formData);
    setIsSaving(false);
    
    if (res.success) {
      setInitialData(formData);
      setToast({ message: 'Settings updated successfully.', type: 'success' });
      setTimeout(() => setToast(null), 3000);
      router.refresh();
    } else {
      setToast({ message: res.error || 'Failed to save settings.', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditingProfile(false);
  };

  const nameParts = (formData.name || 'Merchant').split(' ').filter(Boolean);
  const initials = (nameParts.length >= 2
    ? nameParts[0][0] + nameParts[1][0]
    : (nameParts[0]?.[0] || 'U') + (nameParts[0]?.[1] || '')
  ).toUpperCase();

  if (activeView === 'support') return <SupportView onBack={() => setActiveView('settings')} />;
  if (activeView === 'terms') return <TermsView onBack={() => setActiveView('settings')} />;
  if (activeView === 'privacy') return <PrivacyView onBack={() => setActiveView('settings')} />;

  return (
    <div className="flex flex-col relative pb-24 h-full w-full">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 ${toast.type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}`}>
            {toast.type === 'success' ? <Icon name="Success" size={20} /> : <Icon name="Security" size={20} />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="dashboard-page-header">
        <div>
          <h1 className="text-display font-bold text-ink" style={{ marginBottom: 8 }}>Settings</h1>
          <p className="text-body-sm text-ink-muted max-w-2xl">
            Manage your account preferences and security settings.
          </p>
        </div>
        {hasChanges && (
          <div className="flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
            <Button variant="secondary" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      <div className="settings-grid">
        
        {/* LEFT COLUMN */}
        <div className="settings-column">
          
          {/* Profile Information Card */}
          <div className="settings-card">
            <div className="flex items-center gap-2 mb-6 sm:mb-8">
              <Icon name="User" size={20} className="text-brand" />
              <h2 className="text-body font-bold text-ink">Profile Information</h2>
            </div>

            {isEditingProfile ? (
              <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                <Input label="Full Name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
                <Input label="Email Address" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
                <Input label="Phone Number (optional)" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                
                <h3 className="text-body font-bold text-ink mt-2">Business Details</h3>
                <Input label="Business Name" value={formData.businessName} onChange={(e) => handleChange('businessName', e.target.value)} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink">Business Description</label>
                  <textarea
                    className="w-full"
                    style={{ minHeight: '100px', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-ink)', fontSize: '0.9375rem', fontFamily: 'inherit', outline: 'none', resize: 'vertical' }}
                    value={formData.businessDescription}
                    onChange={(e) => handleChange('businessDescription', e.target.value)}
                    placeholder="Briefly describe what you sell..."
                  />
                </div>
                
                <div className="h-px bg-border w-full my-2" />
                <div className="flex justify-start gap-3 w-full sm:w-auto">
                  <Button variant="primary" className="btn-full-mobile" onClick={() => setIsEditingProfile(false)}>Done</Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center animate-in fade-in duration-300 gap-4 sm:gap-6 w-full pt-4 pb-2">
                <div 
                  className="flex items-center justify-center text-2xl font-bold flex-shrink-0"
                  style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--sys-primary-container-role)', color: 'var(--sys-on-primary-container-role)' }}
                >
                  {initials}
                </div>
                <div className="flex flex-col items-center min-w-0 w-full max-w-md">
                  <h3 className="text-h2 font-bold text-ink truncate mb-1 text-center w-full">{formData.name}</h3>
                  <div className="text-ink-subtle text-body-sm truncate mb-6 text-center w-full">
                    {formData.email}
                  </div>
                  <div className="flex justify-center w-full">
                    <Button variant="primary" className="btn-full-mobile" onClick={() => setIsEditingProfile(true)}>Edit Profile</Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preferences Card */}
          {/* Preferences Card */}
          <div className="settings-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
              <Icon name="Settings" size={20} className="text-brand" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-ink)', margin: 0 }}>Preferences</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Currency */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '8px' }}>Currency</label>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-subtle)', marginBottom: '16px', marginTop: 0 }}>Display currency for your store</p>
                <select
                  className="input-field"
                  style={{
                    height: '48px',
                    padding: '0 16px',
                    borderRadius: '10px',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    width: '100%',
                    appearance: 'none',
                    cursor: 'pointer',
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="none" stroke="%230F1115" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"></polyline></svg>')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                    backgroundSize: '16px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-ink)'
                  }}
                  value={formData.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                >
                  <option value="NGN">NGN (₦)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
              
              <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--color-border)', opacity: 0.3, marginTop: '24px', marginBottom: '24px' }} />
              
              {/* Time Zone */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '8px' }}>Time Zone</label>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-subtle)', marginBottom: '16px', marginTop: 0 }}>Time zone for orders and analytics</p>
                <select
                  className="input-field"
                  style={{
                    height: '48px',
                    padding: '0 16px',
                    borderRadius: '10px',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    width: '100%',
                    appearance: 'none',
                    cursor: 'pointer',
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="none" stroke="%230F1115" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"></polyline></svg>')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                    backgroundSize: '16px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-ink)'
                  }}
                  value={formData.timeZone}
                  onChange={(e) => handleChange('timeZone', e.target.value)}
                >
                  <option value="Africa/Lagos">WAT (Lagos)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>

              <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--color-border)', opacity: 0.3, marginTop: '24px', marginBottom: '24px' }} />

              {/* Date Format */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '8px' }}>Date Format</label>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-subtle)', marginBottom: '16px', marginTop: 0 }}>Format for displaying dates</p>
                <select
                  className="input-field"
                  style={{
                    height: '48px',
                    padding: '0 16px',
                    borderRadius: '10px',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    width: '100%',
                    appearance: 'none',
                    cursor: 'pointer',
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="none" stroke="%230F1115" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"></polyline></svg>')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                    backgroundSize: '16px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-ink)'
                  }}
                  value={formData.dateFormat}
                  onChange={(e) => handleChange('dateFormat', e.target.value)}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>

            <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--color-border)', opacity: 0.5, marginTop: '32px', marginBottom: '24px' }} />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="primary" 
                onClick={handleSave} 
                disabled={isSaving || !(formData.currency !== initialData.currency || formData.timeZone !== initialData.timeZone || formData.dateFormat !== initialData.dateFormat)}
                className="btn-full-mobile"
                style={{ height: '44px', paddingLeft: '24px', paddingRight: '24px', borderRadius: '10px', fontWeight: 500 }}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="settings-column">
          
          {/* Security Card */}
          <div className="settings-card">
            <div className="flex items-center gap-2 mb-6">
              <Icon name="Security" size={20} className="text-brand" />
              <h2 className="text-body font-bold text-ink">Security</h2>
            </div>
            
            <div className="flex flex-col gap-6">
              <h3 className="text-sm font-bold text-ink">Change Password</h3>
              
              {hasGoogleAccount ? (
                <div className="p-4 bg-primary-container rounded-lg">
                  <p className="text-sm text-ink-subtle mb-3">You sign in using your Google account.</p>
                  <Button variant="danger" size="sm" onClick={async () => {
                    const res = await disconnectGoogle();
                    if (res.success) {
                      setToast({ message: 'Google account disconnected.', type: 'success' });
                      setTimeout(() => setToast(null), 3000);
                      router.refresh();
                    }
                  }}>Disconnect Google</Button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4" style={{ width: '100%' }}>
                    <div style={{ width: '100%' }}>
                      <Input 
                        placeholder="Current Password" 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        style={{ borderColor: 'color-mix(in srgb, var(--color-border) 85%, transparent)', width: '100%' }}
                      />
                    </div>
                    <div style={{ width: '100%' }}>
                      <Input 
                        placeholder="New Password" 
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{ borderColor: 'color-mix(in srgb, var(--color-border) 85%, transparent)', width: '100%' }}
                      />
                    </div>
                  </div>
                  <div>
                    <Button variant="secondary" className="btn-full-mobile">Update Password</Button>
                  </div>
                </div>
              )}
            </div>

            <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--color-border)', opacity: 0.5, marginTop: '20px', marginBottom: '20px' }} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-ink">Sign Out</h3>
                <p className="text-body-sm text-ink-subtle">End your session on this device.</p>
              </div>
              <div className="w-full sm:w-auto">
                <Button 
                  variant="danger" 
                  onClick={async () => {
                    const res = await signOutAllDevices();
                    if (res.success) {
                      router.push('/login');
                    }
                  }}
                  className="btn-full-mobile"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Support & Legal Card */}
          <div className="settings-card" style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Icon name="Support" size={20} className="text-brand" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-ink)', margin: 0 }}>Support & Legal</h2>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-subtle)', marginBottom: '32px', marginTop: 0 }}>
              Get help, review our policies, and learn how SellSnap works.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Contact Support */}
              <button 
                onClick={() => setActiveView('support')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px', borderRadius: '10px', padding: '0 16px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s', width: '100%', textAlign: 'left' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--sys-surface-container-low-role)'; const c = e.currentTarget.querySelector('.chevron') as HTMLElement; if (c) c.style.transform = 'translateX(4px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; const c = e.currentTarget.querySelector('.chevron') as HTMLElement; if (c) c.style.transform = 'translateX(0)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon name="Support" size={18} className="text-brand" />
                  <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-ink)' }}>Contact Support</span>
                </div>
                <Icon name="ChevronRight" size={18} className="text-ink-subtle chevron" style={{ transition: 'transform 0.2s' }} />
              </button>
              
              <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--color-border)', opacity: 0.3, margin: '8px 0' }} />

              {/* Terms of Service */}
              <button 
                onClick={() => setActiveView('terms')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px', borderRadius: '10px', padding: '0 16px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s', width: '100%', textAlign: 'left' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--sys-surface-container-low-role)'; const c = e.currentTarget.querySelector('.chevron') as HTMLElement; if (c) c.style.transform = 'translateX(4px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; const c = e.currentTarget.querySelector('.chevron') as HTMLElement; if (c) c.style.transform = 'translateX(0)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon name="Terms" size={18} className="text-ink-subtle" />
                  <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-ink)' }}>Terms of Service</span>
                </div>
                <Icon name="ChevronRight" size={18} className="text-ink-subtle chevron" style={{ transition: 'transform 0.2s' }} />
              </button>

              <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--color-border)', opacity: 0.3, margin: '8px 0' }} />

              {/* Privacy Policy */}
              <button 
                onClick={() => setActiveView('privacy')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px', borderRadius: '10px', padding: '0 16px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s', width: '100%', textAlign: 'left' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--sys-surface-container-low-role)'; const c = e.currentTarget.querySelector('.chevron') as HTMLElement; if (c) c.style.transform = 'translateX(4px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; const c = e.currentTarget.querySelector('.chevron') as HTMLElement; if (c) c.style.transform = 'translateX(0)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon name="Security" size={18} className="text-ink-subtle" />
                  <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-ink)' }}>Privacy Policy</span>
                </div>
                <Icon name="ChevronRight" size={18} className="text-ink-subtle chevron" style={{ transition: 'transform 0.2s' }} />
              </button>
            </div>
          </div>
        </div>
        
      </div>

    </div>
  );
}

function SupportView({ onBack }: { onBack: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [supportData, setSupportData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setSupportData({ name: '', email: '', subject: '', message: '' }); }, 3000);
    }, 1500);
  };

  return (
    <div className="flex flex-col relative pb-24 h-full w-full animate-in fade-in duration-300">
      <div className="dashboard-page-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
        <div className="hide-on-desktop w-full" style={{ marginBottom: '16px' }}>
          <button aria-label="Go back" onClick={onBack} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', cursor: 'pointer', color: 'var(--color-ink)', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--sys-surface-container-low-role)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg)'}>
            <Icon name="ChevronLeft" size={20} />
          </button>
        </div>
        <div>
          <h1 className="text-display font-bold text-ink" style={{ marginBottom: 4 }}>Contact Support</h1>
          <p className="text-body-sm text-ink-muted">Need help with your SellSnap account? Our support team is here to assist you.</p>
        </div>
      </div>

      <div style={{ maxWidth: '800px', paddingTop: '16px' }}>
        <p style={{ fontSize: '1rem', color: 'var(--color-ink-subtle)', lineHeight: 1.6, marginBottom: '40px' }}>
          Expect a response within 24 hours. Alternatively, you can email us directly at support@sellsnap.com.
        </p>

        <div className="settings-card" style={{ padding: '40px' }}>
          {submitted ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 0', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--sys-success-container-role)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Icon name="Success" size={24} className="text-success" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '8px' }}>Message Sent!</h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-ink-subtle)' }}>We've received your request and will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6 w-full">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
                <div className="flex-1 flex flex-col gap-2 w-full">
                  <label style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-ink)' }}>Name</label>
                  <div className="w-full"><Input required placeholder="Your name" value={supportData.name} onChange={(e) => setSupportData(prev => ({ ...prev, name: e.target.value }))} /></div>
                </div>
                <div className="flex-1 flex flex-col gap-2 w-full">
                  <label style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-ink)' }}>Email</label>
                  <div className="w-full"><Input required type="email" placeholder="you@example.com" value={supportData.email} onChange={(e) => setSupportData(prev => ({ ...prev, email: e.target.value }))} /></div>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-ink)' }}>Subject</label>
                <div className="w-full"><Input required placeholder="How can we help?" value={supportData.subject} onChange={(e) => setSupportData(prev => ({ ...prev, subject: e.target.value }))} /></div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-ink)' }}>Message</label>
                <textarea 
                  required
                  className="w-full"
                  style={{ minHeight: '140px', padding: '16px', borderRadius: '10px', border: '1.5px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-ink)', fontSize: '1rem', fontFamily: 'inherit', outline: 'none', resize: 'vertical' }}
                  placeholder="Please describe your issue in detail..."
                  value={supportData.message}
                  onChange={(e) => setSupportData(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
              <div className="flex sm:justify-end mt-2 sm:mt-0 w-full">
                <Button type="submit" variant="primary" disabled={isSubmitting} className="btn-full-mobile w-full sm:w-auto" style={{ height: '48px', padding: '0 32px', borderRadius: '10px', fontSize: '0.9375rem', fontWeight: 500 }}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function TermsView({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col relative pb-24 h-full w-full animate-in fade-in duration-300">
      <div className="dashboard-page-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
        <div className="hide-on-desktop w-full" style={{ marginBottom: '16px' }}>
          <button aria-label="Go back" onClick={onBack} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', cursor: 'pointer', color: 'var(--color-ink)', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--sys-surface-container-low-role)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg)'}>
            <Icon name="ChevronLeft" size={20} />
          </button>
        </div>
        <div>
          <h1 className="text-display font-bold text-ink" style={{ marginBottom: 4 }}>Terms of Service</h1>
          <p className="text-body-sm text-ink-muted">Last Updated: October 2023</p>
        </div>
      </div>
      
      <div style={{ maxWidth: '720px', paddingTop: '16px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: 'var(--color-ink-muted)', lineHeight: 1.7, fontWeight: 400 }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: 'var(--color-ink)' }}>1. Introduction</h2>
            <p>Welcome to SellSnap. These Terms of Service govern your use of our platform. By creating an account and generating payment links through SellSnap, you agree to abide by these terms. SellSnap is designed exclusively to help merchants create products, generate shareable payment links, and manage incoming customer orders quickly and securely.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: 'var(--color-ink)' }}>2. User Accounts & Eligibility</h2>
            <p>To use SellSnap, you must be a registered business or an individual over 18 capable of forming a binding contract. You are responsible for safeguarding your account credentials. You must provide accurate business information and maintain the security of your SellSnap account.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: 'var(--color-ink)' }}>3. Merchant Responsibilities</h2>
            <p>As a merchant on SellSnap, you are solely responsible for the products you list, the accuracy of your descriptions, and fulfilling orders once a payment is confirmed. SellSnap provides the payment link infrastructure but is not a party to the transaction between you and your buyers.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: 'var(--color-ink)' }}>4. Payments & Transactions</h2>
            <p>All payments generated via SellSnap links are processed securely through our trusted payment gateway partners (e.g., Flutterwave). SellSnap does not hold your funds. We reserve the right to delay or decline transactions that trigger our automated fraud detection systems to protect both you and your buyers.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: 'var(--color-ink)' }}>5. Prohibited Activities</h2>
            <p>You may not use SellSnap to sell illegal goods, counterfeit items, or highly regulated products without authorization. You must not attempt to manipulate the platform, bypass security measures, or use our payment links to facilitate money laundering or fraudulent activities.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: 'var(--color-ink)' }}>6. Account Suspension & Termination</h2>
            <p>We reserve the right to suspend or terminate your account immediately if we detect a violation of these Terms of Service, a high volume of chargebacks, or suspicious activity. In such cases, outstanding links will be deactivated.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

function PrivacyView({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col relative pb-24 h-full w-full animate-in fade-in duration-300">
      <div className="dashboard-page-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
        <div className="hide-on-desktop w-full" style={{ marginBottom: '16px' }}>
          <button aria-label="Go back" onClick={onBack} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', cursor: 'pointer', color: 'var(--color-ink)', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--sys-surface-container-low-role)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg)'}>
            <Icon name="ChevronLeft" size={20} />
          </button>
        </div>
        <div>
          <h1 className="text-display font-bold text-ink" style={{ marginBottom: 4 }}>Privacy Policy</h1>
          <p className="text-body-sm text-ink-muted">Last Updated: October 2023</p>
        </div>
      </div>
      
      <div style={{ maxWidth: '720px', paddingTop: '16px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', color: 'var(--color-ink-muted)', lineHeight: 1.7, fontWeight: 400 }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: 'var(--color-ink)' }}>1. Information We Collect</h2>
            <p>When you register for SellSnap, we collect basic account information including your name, email address, and business details. When you create products, we store the product metadata, descriptions, and uploaded images necessary to generate your payment links.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: 'var(--color-ink)' }}>2. Order & Buyer Information</h2>
            <p>When a buyer interacts with your SellSnap payment link, we securely collect the transaction details necessary to verify the payment and notify you. We do not store sensitive payment card details; these are handled directly by our certified payment processors.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: 'var(--color-ink)' }}>3. How We Use Your Data</h2>
            <p>We use your data strictly to provide the SellSnap service: generating secure product links, verifying incoming payments, updating your dashboard, and sending transactional email notifications regarding your orders and account security.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: 'var(--color-ink)' }}>4. Data Protection</h2>
            <p>We implement industry-standard security measures, including encryption in transit and at rest, to protect your account and product data. Your dashboard is protected by secure authentication protocols to prevent unauthorized access.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px', color: 'var(--color-ink)' }}>5. Data Retention</h2>
            <p>We retain your account and order history for as long as your account remains active. If you choose to delete your SellSnap account, your personal information and product links will be permanently removed from our active systems within 30 days.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
