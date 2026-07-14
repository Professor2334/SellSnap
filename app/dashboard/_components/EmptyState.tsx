import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <div>
          <h3 className="text-h2 font-bold text-ink" style={{ marginBottom: 4 }}>{title}</h3>
          <p className="text-body-sm text-ink-muted" style={{ maxWidth: 300, margin: '0 auto', opacity: 0.85 }}>
            {description}
          </p>
        </div>
        {actionLabel && actionHref && (
          <Link href={actionHref} className="btn-full-mobile" style={{ marginTop: 12 }}>
            <Button size="md" variant="primary" className="btn-full-mobile">{actionLabel}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
