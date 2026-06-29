'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Loader2, Copy, Share, ChevronRight, Package, Image as ImageIcon, Landmark } from 'lucide-react';

// Feature 1: Create Product UI
export function CreateProductUI() {
  const [phase, setPhase] = React.useState<'idle' | 'uploaded' | 'creating'>('idle');

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (phase === 'idle') {
      timeout = setTimeout(() => setPhase('uploaded'), 2500);
    } else if (phase === 'uploaded') {
      timeout = setTimeout(() => setPhase('creating'), 2000);
    } else if (phase === 'creating') {
      timeout = setTimeout(() => setPhase('idle'), 2500);
    }
    return () => clearTimeout(timeout);
  }, [phase]);

  return (
    <div className="create-product-card">
      <div className="create-product-header">
        <div className="create-product-title">New Product</div>
        <div className="create-product-subtitle">Upload an image and set your price.</div>
      </div>
      
      <div className="create-product-upload">
        <AnimatePresence mode="wait">
          {phase === 'idle' ? (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="create-product-preview"
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="create-product-upload-icon">
                  <ImageIcon size={18} />
                </div>
                <span className="create-product-upload-text">Add Image</span>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="uploaded"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="create-product-preview"
            >
              <div className="create-product-preview-bg">
                <ImageIcon size={32} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      <Button 
        variant="primary" 
        fullWidth 
        style={{ height: '44px', borderRadius: '12px', fontSize: '15px' }}
        disabled={phase === 'creating'}
      >
        {phase === 'creating' ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Loader2 size={18} className="animate-spin" />
            Creating...
          </span>
        ) : (
          'Create Product'
        )}
      </Button>
    </div>
  );
}

// Feature 2: Share Link UI
export function ShareLinkUI() {
  const [copied, setCopied] = React.useState(false);
  const [typedLink, setTypedLink] = React.useState('');
  const [showActions, setShowActions] = React.useState(false);
  const fullLink = 'sellsnap.link/premium-bag';

  React.useEffect(() => {
    let currentLength = 0;
    const interval = setInterval(() => {
      currentLength++;
      setTypedLink(fullLink.substring(0, currentLength));
      if (currentLength >= fullLink.length) {
        clearInterval(interval);
        setTimeout(() => setShowActions(true), 400);
      }
    }, 40); // typing speed
    
    // Copy animation loop
    let copyInterval: NodeJS.Timeout;
    if (showActions) {
      copyInterval = setInterval(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }, 5000);
    }
    
    return () => {
      clearInterval(interval);
      if (copyInterval) clearInterval(copyInterval);
    };
  }, [showActions]);

  return (
    <div className="share-link-card">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="share-link-icon-wrap"
      >
        <CheckCircle2 size={32} />
      </motion.div>
      
      <div className="share-link-title">Product Created!</div>
      <div className="share-link-subtitle">Your payment link is ready to share.</div>
      
      <div className="share-link-box">
        <div className="share-link-text">{typedLink}</div>
        <AnimatePresence>
          {showActions && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="share-link-actions"
            >
              <button 
                className="share-link-btn primary"
                onClick={() => setCopied(true)}
              >
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              </button>
              <button className="share-link-btn">
                <Share size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Feature 3: Receive Secure Payments UI
export function ReceivePaymentUI() {
  const [phase, setPhase] = React.useState<'counting' | 'idle' | 'paying' | 'success'>('counting');
  const [amount, setAmount] = React.useState(0);
  const targetAmount = 45000;

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    if (phase === 'counting') {
      const duration = 800; // 0.8s
      const steps = 20;
      const stepValue = targetAmount / steps;
      let current = 0;
      
      interval = setInterval(() => {
        current += stepValue;
        if (current >= targetAmount) {
          setAmount(targetAmount);
          clearInterval(interval);
          setPhase('idle');
        } else {
          setAmount(Math.floor(current));
        }
      }, duration / steps);
    } else if (phase === 'idle') {
      timeout = setTimeout(() => setPhase('paying'), 1500);
    } else if (phase === 'paying') {
      timeout = setTimeout(() => setPhase('success'), 2000);
    } else if (phase === 'success') {
      timeout = setTimeout(() => {
        setAmount(0);
        setPhase('counting');
      }, 2500);
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [phase]);

  const formattedAmount = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount);

  return (
    <div className="receive-payment-wrapper">
      <AnimatePresence mode="wait">
        {phase !== 'success' ? (
          <motion.div 
            key="checkout"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="receive-payment-card"
          >
            <div className="receive-payment-header">
              <div className="receive-payment-thumb">
                <Package size={24} />
              </div>
              <div className="receive-payment-info">
                <div className="receive-payment-title">Premium Leather Bag</div>
                <div className="receive-payment-seller">By LeatherWorks NG</div>
              </div>
            </div>
            
            <div className="receive-payment-divider"></div>
            
            <div className="receive-payment-amount-wrap">
              <div className="receive-payment-amount-label">Total Amount</div>
              <div className="receive-payment-amount">{formattedAmount}</div>
            </div>
            
            <div style={{ minHeight: '44px' }}>
              <AnimatePresence>
                {(phase === 'idle' || phase === 'paying') && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <button 
                      className="btn btn-primary receive-payment-cta"
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', pointerEvents: 'none' }}
                      disabled={phase === 'paying'}
                    >
                      {phase === 'idle' ? 'Pay Now' : (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Processing...
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="receive-payment-card"
            style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px', minHeight: '280px' }}
          >
            <div className="share-link-icon-wrap" style={{ marginBottom: '16px' }}>
              <CheckCircle2 size={32} />
            </div>
            <div className="receive-payment-title" style={{ fontSize: '20px' }}>Payment Successful</div>
            <div className="receive-payment-seller" style={{ fontSize: '14px' }}>Receipt sent to email</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Feature 4: Manage Orders UI
export function ManageOrdersUI() {
  const [showNew, setShowNew] = React.useState(false);
  const [status, setStatus] = React.useState<'Pending' | 'Paid'>('Pending');

  React.useEffect(() => {
    let timeout1: NodeJS.Timeout;
    let timeout2: NodeJS.Timeout;
    let timeout3: NodeJS.Timeout;

    const cycle = () => {
      setShowNew(false);
      setStatus('Pending');
      
      timeout1 = setTimeout(() => setShowNew(true), 800);
      timeout2 = setTimeout(() => setStatus('Paid'), 2800);
      timeout3 = setTimeout(cycle, 5000);
    };

    cycle();

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, []);

  return (
    <div className="manage-orders-card">
      <div className="manage-orders-header">
        <div className="manage-orders-title">Recent Orders</div>
        <div className="manage-orders-badge">1 New</div>
      </div>
      
      <div className="manage-orders-list">
        <AnimatePresence>
          {showNew && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="manage-orders-row new-order"
            >
              <div className="manage-orders-item">
                <div className="manage-orders-icon">
                  <Package size={18} />
                </div>
                <div className="manage-orders-details">
                  <div className="manage-orders-name">Premium Leather Bag</div>
                  <div className="manage-orders-meta">Just now • ₦45,000</div>
                </div>
              </div>
              <motion.div 
                animate={status === 'Paid' ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
                className={`status-badge ${status.toLowerCase()}`}
              >
                {status === 'Paid' && <CheckCircle2 size={12} />}
                {status}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Static previous orders */}
        <div className="manage-orders-row" style={{ opacity: 0.7 }}>
          <div className="manage-orders-item">
            <div className="manage-orders-icon">
              <Package size={18} />
            </div>
            <div className="manage-orders-details">
              <div className="manage-orders-name">Minimalist Watch</div>
              <div className="manage-orders-meta">2 hours ago • ₦32,000</div>
            </div>
          </div>
          <div className="status-badge paid">
            <CheckCircle2 size={12} />
            Paid
          </div>
        </div>
        
        <div className="manage-orders-row" style={{ opacity: 0.4 }}>
          <div className="manage-orders-item">
            <div className="manage-orders-icon">
              <Package size={18} />
            </div>
            <div className="manage-orders-details">
              <div className="manage-orders-name">Canvas Tote Bag</div>
              <div className="manage-orders-meta">Yesterday • ₦15,000</div>
            </div>
          </div>
          <div className="status-badge paid">
            <CheckCircle2 size={12} />
            Paid
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature 5: Withdraw Earnings UI
export function WithdrawEarningsUI() {
  const [phase, setPhase] = React.useState<'counting' | 'idle' | 'withdrawing' | 'success'>('counting');
  const [amount, setAmount] = React.useState(0);
  const targetAmount = 125500;

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    if (phase === 'counting') {
      const duration = 1200; // 1.2s
      const steps = 30;
      const stepValue = targetAmount / steps;
      let current = 0;
      
      interval = setInterval(() => {
        current += stepValue;
        if (current >= targetAmount) {
          setAmount(targetAmount);
          clearInterval(interval);
          setPhase('idle');
        } else {
          setAmount(Math.floor(current));
        }
      }, duration / steps);
    } else if (phase === 'idle') {
      timeout = setTimeout(() => setPhase('withdrawing'), 1800);
    } else if (phase === 'withdrawing') {
      timeout = setTimeout(() => setPhase('success'), 1500);
    } else if (phase === 'success') {
      timeout = setTimeout(() => {
        setAmount(0);
        setPhase('counting');
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [phase]);

  const formattedAmount = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount);

  return (
    <div className="withdraw-card">
      <div className="withdraw-balance-section">
        <div className="withdraw-balance-label">
          Available Balance
          <div className="withdraw-balance-indicator"></div>
        </div>
        <div className="withdraw-balance-amount">
          {phase === 'success' ? '₦0' : formattedAmount}
        </div>
      </div>
      
      <div className="withdraw-bank-card">
        <div className="withdraw-bank-left">
          <div className="withdraw-bank-icon-wrap">
            <Landmark size={18} />
          </div>
          <div className="withdraw-bank-info">
            <div className="withdraw-bank-name">GTBank</div>
            <div className="withdraw-bank-acc">**** 4321</div>
          </div>
        </div>
        <ChevronRight size={18} className="withdraw-bank-chevron" />
      </div>

      <AnimatePresence mode="wait">
        {phase !== 'success' ? (
          <motion.div key="action" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button 
              className="btn btn-primary"
              style={{ width: '100%', height: '48px', fontSize: '15px', pointerEvents: 'none' }}
              disabled={phase === 'withdrawing'}
            >
              {phase === 'idle' || phase === 'counting' ? 'Withdraw Funds' : (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="success" 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-2 text-center"
          >
            <div className="share-link-icon-wrap" style={{ width: '48px', height: '48px', marginBottom: '12px' }}>
              <CheckCircle2 size={24} />
            </div>
            <div className="manage-orders-name">Withdrawal Initiated</div>
            <div className="manage-orders-meta">Funds are on the way to your bank.</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
