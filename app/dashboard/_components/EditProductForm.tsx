'use client';

import * as React from 'react';
import { updateProduct } from '@/app/actions/products';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';

export function EditProductForm({ product }: { product: any }) {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string | null>(product.imageUrl || null);
  
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // State for live preview
  const [productName, setProductName] = React.useState(product.name || '');
  const [productPrice, setProductPrice] = React.useState(product.price ? String(product.price) : '');
  const [productDescription, setProductDescription] = React.useState(product.description || '');
  
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const name = productName.trim();
    const price = productPrice.trim();

    if (!name) {
      setError('Product name is required');
      return;
    }
    if (!price || Number(price) < 1) {
      setError('Price must be at least 1');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await updateProduct(product.id, formData);

      if (result.success) {
        router.push('/dashboard?tab=products');
        router.refresh(); // Ensure the dashboard reloads with new data
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('update product error', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: 'var(--color-bg)' }}>
      <main className="w-full flex-1 mx-auto" style={{ maxWidth: '1100px', padding: '32px 24px', paddingBottom: '64px' }}>
        
        {/* Header */}
        <div 
          style={{ 
            position: 'sticky',
            top: 0,
            zIndex: 40,
            backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.85)' : 'var(--color-bg)',
            backdropFilter: isScrolled ? 'blur(12px)' : 'none',
            WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'none',
            borderBottom: 'none',
            margin: '0 -24px 32px -24px',
            padding: isScrolled ? '16px 24px' : '24px 24px 16px 24px',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h1 className="text-display font-bold text-ink" style={{ 
              marginBottom: isScrolled ? '0px' : '8px',
              transition: 'margin 0.2s ease',
            }}>Edit Product</h1>
            <div style={{
              display: 'grid',
              gridTemplateRows: isScrolled ? '0fr' : '1fr',
              transition: 'all 0.2s ease',
              opacity: isScrolled ? 0 : 1,
            }}>
              <div style={{ overflow: 'hidden' }}>
                <p className="text-body-sm text-ink-muted" style={{ maxWidth: '420px', opacity: 0.9 }}>
                  Update your product details and changes will reflect on the live link.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <form id="edit-product-form" onSubmit={handleSubmit} className="w-full">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', width: '100%' }}>
            
            {/* Left Column - Form Fields */}
            <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '64px' }}>
              
              {/* Product Details Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <h2 className="text-h2 font-semibold text-ink" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>Product Details</h2>
                
                <div>
                  <label htmlFor="name" className="input-label block font-medium text-ink-muted" style={{ display: 'block', marginBottom: '16px', opacity: 0.8 }}>Product Name</label>
                  <input
                    id="name"
                    name="name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Handmade Earrings"
                    required
                    className="input-field w-full dashboard-input-soft"
                    style={{ height: '48px', borderRadius: '12px', fontSize: '0.9375rem', backgroundColor: 'var(--sys-neutral-container-lowest)' }}
                  />
                </div>

                <div>
                  <label htmlFor="description" className="input-label block font-medium text-ink-muted" style={{ display: 'block', marginBottom: '16px', opacity: 0.8 }}>Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Include size, material, colour, condition or anything customers should know."
                    className="input-field w-full dashboard-input-soft"
                    style={{ height: '110px', borderRadius: '12px', fontSize: '0.9375rem', padding: '16px', resize: 'none', backgroundColor: 'var(--sys-neutral-container-lowest)' }}
                  />
                </div>
              </div>

              {/* Pricing Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <h2 className="text-h2 font-semibold text-ink" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>Pricing</h2>
                
                <div>
                  <label htmlFor="price" className="input-label block font-medium text-ink-muted" style={{ display: 'block', marginBottom: '16px', opacity: 0.8 }}>Price (₦)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} className="text-ink-muted font-medium">₦</span>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      placeholder="0.00"
                      required
                      className="input-field w-full dashboard-input-soft"
                      style={{ height: '48px', borderRadius: '12px', fontSize: '0.9375rem', paddingLeft: '32px', backgroundColor: 'var(--sys-neutral-container-lowest)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <h2 className="text-h2 font-semibold text-ink" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>Media</h2>
                
                <div>
                  <label className="input-label block font-medium text-ink-muted" style={{ display: 'block', marginBottom: '16px', opacity: 0.8 }}>Product Image</label>
                  <div 
                    className="w-full flex flex-col items-center justify-center cursor-pointer overflow-hidden upload-zone-soft"
                    style={{ 
                      height: imagePreview ? 'auto' : '220px', 
                      borderRadius: '16px'
                    }}
                  >
                    <input type="file" name="image" id="product-image" accept="image/png, image/jpeg, image/webp" style={{ display: 'none' }} onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setImagePreview(ev.target?.result as string);
                        reader.readAsDataURL(file);
                      }
                    }} />
                    <label htmlFor="product-image" className="flex flex-col items-center justify-center cursor-pointer w-full h-full" style={{ padding: '40px 24px' }}>
                      {imagePreview ? (
                        <div style={{ position: 'relative', width: '100%' }}>
                          <img src={imagePreview} alt="Preview" className="w-full object-cover" style={{ maxHeight: '400px', borderRadius: '12px' }} />
                          <div style={{ 
                            position: 'absolute', top: '16px', right: '16px', 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(4px)',
                            padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--color-border)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer'
                          }}>
                            <span className="text-caption font-medium text-ink-muted">Click to replace</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center gap-2">
                          <div style={{ 
                            width: '56px', height: '56px', borderRadius: '50%', 
                            backgroundColor: 'var(--sys-neutral-container-low)', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '4px'
                          }}>
                            <Upload size={24} className="text-brand" />
                          </div>
                          <div>
                            <p className="text-body font-medium text-ink" style={{ marginBottom: '4px' }}>Click to upload or drag and drop</p>
                            <p className="text-body-sm text-ink-muted">PNG, JPG or WEBP (max. 5MB)</p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
              
              {error && (
                <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'color-mix(in srgb, var(--color-danger) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--color-danger) 20%, transparent)' }}>
                  <p className="text-body-sm" style={{ color: 'var(--color-danger)' }}>{error}</p>
                </div>
              )}
              
              <div style={{ marginTop: '-24px' }}>
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="btn-primary w-full"
                  style={{ height: '52px', borderRadius: '12px', fontWeight: 600, fontSize: '1rem' }}
                >
                  {loading ? <Loader2 className="spinner mr-2" size={20} /> : 'Save Changes'}
                </Button>
              </div>

            </div>
            
            {/* Right Column - Live Preview */}
            <div style={{ flex: '1 1 350px', maxWidth: '380px', alignSelf: 'stretch' }}>
              
              <div style={{ position: 'sticky', top: '120px', display: 'flex', flexDirection: 'column', gap: '24px', height: 'max-content' }}>
                <h3 className="text-body font-semibold text-ink-muted" style={{ marginBottom: '-8px' }}>Preview</h3>
                
                {/* Live Product Card */}
                <div className="card-container overflow-hidden p-0 card-soft" style={{ borderRadius: '16px' }}>
                  {/* Image Area */}
                  <div className="w-full flex items-center justify-center" style={{ aspectRatio: '1/1', borderBottom: '1px solid color-mix(in srgb, var(--color-ink) 8%, transparent)', backgroundColor: 'var(--color-surface)', position: 'relative' }}>
                    {imagePreview ? (
                       <img src={imagePreview} alt="Live Preview" className="w-full h-full object-cover" />
                    ) : (
                       <ImageIcon size={48} className="text-ink-subtle" style={{ opacity: 0.3 }} />
                    )}
                  </div>
                  
                  {/* Content Area */}
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <h4 className="text-h2 font-bold text-ink" style={{ marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {productName || "Your product name"}
                      </h4>
                      <p className="text-brand font-bold text-h2">
                        ₦{productPrice ? Number(productPrice).toLocaleString() : "0"}
                      </p>
                    </div>
                    
                    <p className="text-body-sm text-ink-muted" style={{ opacity: 0.9, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {productDescription || "A short description will appear here."}
                    </p>
                    
                    <Button variant="primary" size="lg" className="w-full" style={{ marginTop: '8px', cursor: 'default', pointerEvents: 'none', opacity: 0.9 }}>
                      Pay Now
                    </Button>
                  </div>
                </div>

                {/* Helper Card */}
                <div style={{ padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px', backgroundColor: 'color-mix(in srgb, var(--color-success) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--color-success) 20%, transparent)' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <p className="text-body-sm text-ink-muted font-medium" style={{ paddingTop: '2px' }}>
                    Changes are automatically updated on your live payment link.
                  </p>
                </div>
              </div>
              
            </div>
          </div>
        </form>
      </main>

    </div>
  );
}
