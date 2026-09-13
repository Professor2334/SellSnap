import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './trust-section.css';
import './story-section.css';
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
        <meta name="color-scheme" content="light" />
      </head>
      <body className={inter.variable}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

