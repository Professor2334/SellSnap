import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center', backgroundColor: 'var(--color-bg)' }}>
      <h1 className="text-display font-bold text-ink" style={{ marginBottom: 16 }}>404 - Page Not Found</h1>
      <p className="text-body text-ink-muted" style={{ maxWidth: 400, marginBottom: 32 }}>
        We couldn&apos;t find the page or product you&apos;re looking for. It may have been moved or deleted.
      </p>
      <Link href="/">
        <Button variant="primary" size="lg">Return Home</Button>
      </Link>
    </div>
  );
}
