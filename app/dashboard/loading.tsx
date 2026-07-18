import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="dashboard-view-container" style={{ padding: '24px', maxWidth: '1024px', margin: '0 auto' }}>
      {/* Header Skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Skeleton style={{ height: '32px', width: '180px' }} />
        <Skeleton style={{ height: '16px', width: '240px' }} />
      </div>

      {/* Stats Cards Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-stat">
            <Skeleton style={{ height: '16px', width: '96px', marginBottom: '8px' }} />
            <Skeleton style={{ height: '32px', width: '128px' }} />
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)' }}>
           <Skeleton style={{ height: '24px', width: '128px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px', borderBottom: i !== 5 ? '1px solid var(--color-border)' : 'none' }}>
              <Skeleton style={{ height: '48px', width: '48px', borderRadius: '12px' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Skeleton style={{ height: '16px', width: '30%' }} />
                <Skeleton style={{ height: '12px', width: '20%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
