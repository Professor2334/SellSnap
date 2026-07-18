import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './trust-section.css';
import './story-section.css';
import '../tokens/dark-tokens.css';
import { ThemeProvider } from '@/app/providers/ThemeProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'SellSnap | Sell with speed',
  description: 'Instant payment links for Nigerian small businesses.',
};

// Critical dark-mode CSS injected inline so the browser has it
// BEFORE external stylesheets load. This is what prevents the flash.
const criticalDarkCSS = `
html[data-theme="dark"] {
  --color-bg: #0d0d0d;
  --color-surface: #171717;
  --color-ink: #f0f0f0;
  --color-ink-muted: #9a9a9a;
  --color-ink-subtle: #5c5c5c;
  --color-border: rgba(255,255,255,0.08);
  --color-brand: #003ce6;
  --color-success: #4ade80;
  --color-warning: #fbbf24;
  --color-danger: #f87171;
  --dk-card-bg: #1a1a1a;
  --dk-card-elevated-bg: #222222;
  --dk-sidebar-bg: #141414;
  --dk-input-bg: #141414;
  --dk-input-border: rgba(255,255,255,0.08);
  --dk-dropdown-bg: rgba(30,30,30,0.95);
  --sys-outline-variant-color-role: rgba(255,255,255,0.08);
  --sys-neutral-container-lowest: #141414;
  --sys-on-neutral-color-role: #f0f0f0;
  --sys-on-neutral-variant-role: #9a9a9a;
  --sys-on-primary-color-role: #ffffff;
  --primitive-neutral98: #171717;
}
html[data-theme="dark"],
html[data-theme="dark"] body {
  background-color: #0d0d0d !important;
  color: #f0f0f0;
}
`;

// Injected synchronously before React hydration to prevent flash.
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('sellsnap-theme') || 'system';
    var isDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />
        {/* 1. Synchronous script — sets data-theme before any paint */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* 2. Critical dark CSS — inline so it's available immediately,
               before external stylesheets finish loading */}
        <style dangerouslySetInnerHTML={{ __html: criticalDarkCSS }} />
      </head>
      <body className={inter.variable}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

