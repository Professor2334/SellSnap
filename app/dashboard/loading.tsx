import React from 'react';

export default function DashboardLoading() {
  const skeletonBase = {
    backgroundColor: 'color-mix(in srgb, var(--color-ink) 4%, transparent)',
    borderRadius: '8px',
  };

  return (
    <div className="animate-pulse" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '24px', gap: '32px', maxWidth: '1024px', margin: '0 auto' }}>
      {/* Header Skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ ...skeletonBase, height: '32px', width: '180px' }}></div>
        <div style={{ ...skeletonBase, height: '16px', width: '240px' }}></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ 
            height: '128px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between', 
            padding: '24px', 
            backgroundColor: 'var(--sys-neutral-container-low)',
            borderRadius: '16px',
            border: '1px solid color-mix(in srgb, var(--color-border) 40%, transparent)'
          }}>
            <div style={{ ...skeletonBase, height: '16px', width: '96px' }}></div>
            <div style={{ ...skeletonBase, height: '32px', width: '128px' }}></div>
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div style={{ 
        height: '384px', 
        width: '100%', 
        backgroundColor: 'var(--sys-neutral-container-low)', 
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid color-mix(in srgb, var(--color-border) 40%, transparent)'
      }}>
        <div style={{ ...skeletonBase, height: '24px', width: '128px', marginBottom: '24px' }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid color-mix(in srgb, var(--color-border) 40%, transparent)' }}>
              <div style={{ ...skeletonBase, height: '48px', width: '48px', borderRadius: '12px' }}></div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ ...skeletonBase, height: '16px', width: '30%' }}></div>
                <div style={{ ...skeletonBase, height: '12px', width: '20%' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
