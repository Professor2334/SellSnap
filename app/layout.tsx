import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '../tokens/dark-tokens.css';
import './trust-section.css';
import './story-section.css';
import { ThemeProvider } from '@/app/providers/ThemeProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'SellSnap | Sell with speed',
  description: 'Instant payment links for Nigerian small businesses.',
};

// Dark mode is intentionally excluded per design-system.md

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script runs synchronously before first paint to prevent FOUC */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('sellsnap-theme');var dark=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',dark?'dark':'light');}catch(e){}})();`
        }} />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={inter.variable}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

