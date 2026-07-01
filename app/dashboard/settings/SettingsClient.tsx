'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/FormPrimitives';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { updateSettings, disconnectGoogle, signOutAllDevices } from '@/app/actions/settings';

type Section = 'Profile' | 'Business' | 'Security' | 'Notifications' | 'Preferences';

const sections: { id: Section; label: string; icon: any }[] = [
  { id: 'Profile', label: 'Profile', icon: 'User' },
  { id: 'Business', label: 'Business', icon: 'Products' },
  { id: 'Security', label: 'Security', icon: 'Security' },
  { id: 'Notifications', label: 'Notifications', icon: 'Email' },
  { id: 'Preferences', label: 'Preferences', icon: 'Settings' },
];

export function SettingsClient({ user, hasGoogleAccount }: { user: any; hasGoogleAccount: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const querySection = searchParams.get('section');
  const initialSection = (querySection 
    ? querySection.charAt(0).toUpperCase() + querySection.slice(1).toLowerCase() 
    : 'Profile') as Section;

  const [activeSection, setActiveSection] = useState<Section>(
    sections.some(s => s.id === initialSection) ? initialSection : 'Profile'
  );

  useEffect(() => {
    if (querySection) {
      const parsed = (querySection.charAt(0).toUpperCase() + querySection.slice(1).toLowerCase()) as Section;
      if (sections.some(s => s.id === parsed)) {
        setActiveSection(parsed);
      }
    }
  }, [querySection]);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    businessName: user.businessName || '',
    businessDescription: user.businessDescription || '',
    supportEmail: user.supportEmail || '',
    supportPhone: user.supportPhone || '',
    businessAddress: user.businessAddress || '',
    notifyOrderReceived: user.notifyOrderReceived ?? true,
    notifyPaymentSuccess: user.notifyPaymentSuccess ?? true,
    notifyWelcome: user.notifyWelcome ?? true,
    notifyProductUpdates: user.notifyProductUpdates ?? true,
    notifyMarketing: user.notifyMarketing ?? false,
    currency: user.currency || 'NGN',
    timeZone: user.timeZone || 'Africa/Lagos',
    dateFormat: user.dateFormat || 'DD/MM/YYYY',
  });
  
  const [initialData, setInitialData] = useState(formData);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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
  };

  return (
    <div className="flex flex-col relative pb-24 h-full">
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
      <div className="mb-8">
        <h1 className="text-display text-ink tracking-tight mb-2">Settings</h1>
        <p className="text-body text-ink-subtle max-w-2xl">
          Manage your account, business information and preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 flex-1">
        {/* Left Nav */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <nav className="flex flex-col gap-2 sticky top-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`sidebar-link ${activeSection === section.id ? 'active' : ''}`}
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                <Icon name={section.icon} size={20} />
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Right Content */}
        <main className="flex-1 max-w-3xl">
          <div className="bg-bg rounded-[20px] p-6 lg:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border-none">
            {activeSection === 'Profile' && (
              <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                <h2 className="text-h2 text-ink mb-2">Profile Information</h2>
                <div className="flex items-center gap-6 mb-4">
                  <div className="w-20 h-20 rounded-full bg-brand text-white flex items-center justify-center text-2xl font-bold">
                    {formData.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <Button variant="secondary" size="sm">Change Photo</Button>
                    <p className="text-xs text-ink-subtle mt-2">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Full Name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
                  <Input label="Email Address" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
                  <Input label="Phone Number (optional)" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                </div>
              </div>
            )}

            {activeSection === 'Business' && (
              <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                <h2 className="text-h2 text-ink mb-2">Business Details</h2>
                <Input label="Business Name" value={formData.businessName} onChange={(e) => handleChange('businessName', e.target.value)} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink">Business Description</label>
                  <textarea
                    className="w-full rounded-lg  bg-transparent px-3 py-2 text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand min-h-[100px]"
                    value={formData.businessDescription}
                    onChange={(e) => handleChange('businessDescription', e.target.value)}
                    placeholder="Briefly describe what you sell..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Support Email" type="email" value={formData.supportEmail} onChange={(e) => handleChange('supportEmail', e.target.value)} />
                  <Input label="Support Phone" value={formData.supportPhone} onChange={(e) => handleChange('supportPhone', e.target.value)} />
                </div>
                <Input label="Business Address (optional)" value={formData.businessAddress} onChange={(e) => handleChange('businessAddress', e.target.value)} />
              </div>
            )}

            {activeSection === 'Security' && (
              <div className="flex flex-col gap-8 animate-in fade-in duration-300">
                <div>
                  <h2 className="text-h2 text-ink mb-4">Security Settings</h2>
                  <div className="flex flex-col gap-4">
                    <Button variant="secondary">Change Password</Button>
                    {hasGoogleAccount ? (
                      <div className="flex items-center justify-between p-4 bg-primary-container rounded-lg ">
                        <div className="flex flex-col">
                          <span className="font-medium text-ink">Google Account Connected</span>
                          <span className="text-xs text-ink-subtle">You can sign in using your Google account.</span>
                        </div>
                        <Button variant="danger" size="sm" onClick={async () => {
                          const res = await disconnectGoogle();
                          if (res.success) {
                            setToast({ message: 'Google account disconnected.', type: 'success' });
                            setTimeout(() => setToast(null), 3000);
                            router.refresh();
                          }
                        }}>Disconnect</Button>
                      </div>
                    ) : (
                      <div className="p-4 bg-surface rounded-lg  flex items-center justify-between">
                        <span className="text-sm text-ink-subtle">No Google account connected.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className=" pt-8">
                  <h3 className="text-h2 text-ink mb-2">Active Sessions</h3>
                  <p className="text-body-sm text-ink-subtle mb-4">Manage your active sessions across all devices.</p>
                  <Button variant="danger" onClick={async () => {
                    const res = await signOutAllDevices();
                    if (res.success) {
                      setToast({ message: 'Signed out of all devices.', type: 'success' });
                      setTimeout(() => setToast(null), 3000);
                      router.push('/login');
                    }
                  }}>Sign out of all devices</Button>
                </div>
              </div>
            )}

            {activeSection === 'Notifications' && (
              <div className="flex flex-col gap-2 animate-in fade-in duration-300">
                <h2 className="text-h2 text-ink mb-4">Notification Preferences</h2>
                <Toggle
                  label="Order Received Emails"
                  description="Get notified immediately when a buyer places a new order."
                  checked={formData.notifyOrderReceived}
                  onChange={(val) => handleChange('notifyOrderReceived', val)}
                />
                <hr className="border-border my-2" />
                <Toggle
                  label="Payment Successful Emails"
                  description="Receive confirmations when a payment is processed successfully."
                  checked={formData.notifyPaymentSuccess}
                  onChange={(val) => handleChange('notifyPaymentSuccess', val)}
                />
                <hr className="border-border my-2" />
                <Toggle
                  label="Welcome Emails"
                  description="Receive helpful onboarding tips and platform guides."
                  checked={formData.notifyWelcome}
                  onChange={(val) => handleChange('notifyWelcome', val)}
                />
                <hr className="border-border my-2" />
                <Toggle
                  label="Product Updates"
                  description="Hear about new features and improvements to SellSnap."
                  checked={formData.notifyProductUpdates}
                  onChange={(val) => handleChange('notifyProductUpdates', val)}
                />
                <hr className="border-border my-2" />
                <Toggle
                  label="Marketing Emails"
                  description="Receive promotional offers and growth tips."
                  checked={formData.notifyMarketing}
                  onChange={(val) => handleChange('notifyMarketing', val)}
                />
              </div>
            )}

            {activeSection === 'Preferences' && (
              <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                <h2 className="text-h2 text-ink mb-4">Platform Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-ink">Default Currency</label>
                    <select
                      className="w-full rounded-lg  bg-transparent px-3 py-2 text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      value={formData.currency}
                      onChange={(e) => handleChange('currency', e.target.value)}
                    >
                      <option value="NGN">Nigerian Naira (₦)</option>
                      <option value="USD">US Dollar ($)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-ink">Time Zone</label>
                    <select
                      className="w-full rounded-lg  bg-transparent px-3 py-2 text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      value={formData.timeZone}
                      onChange={(e) => handleChange('timeZone', e.target.value)}
                    >
                      <option value="Africa/Lagos">West Africa Time (Lagos)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-ink">Date Format</label>
                    <select
                      className="w-full rounded-lg  bg-transparent px-3 py-2 text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      value={formData.dateFormat}
                      onChange={(e) => handleChange('dateFormat', e.target.value)}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Sticky Footer */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-bg  shadow-[0_-4px_16px_rgba(0,0,0,0.03)] z-40 animate-in slide-in-from-bottom-full duration-300">
          <div className="max-w-4xl mx-auto flex items-center justify-between px-4 lg:px-8">
            <span className="text-sm text-ink-subtle font-medium hidden sm:block">You have unsaved changes.</span>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Button variant="secondary" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
              <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
