'use client';

import { useTheme, type Theme } from '@/app/providers/ThemeProvider';

const ICONS = {
  light: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  dark: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  system: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <polyline points="8 21 12 17 16 21" />
    </svg>
  ),
};

const LABELS = {
  light: 'Light mode',
  dark: 'Dark mode',
  system: 'Auto (System)',
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const currentTheme = theme || 'system';

  return (
    <button
      onClick={handleToggle}
      aria-label="Toggle theme"
      title={LABELS[currentTheme]}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'transparent',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--color-ink-muted)',
        transition: 'background-color 200ms ease, color 200ms ease, transform 150ms ease',
        outlineOffset: '2px',
      }}
      onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.backgroundColor = 'var(--sys-neutral-container-low)';
        e.currentTarget.style.color = 'var(--color-ink)';
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = 'var(--color-ink-muted)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.transform = 'scale(0.92)';
      }}
      onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {ICONS[currentTheme]}
    </button>
  );
}
