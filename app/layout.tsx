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
        {/* Synchronous theme script — must be first child of <head> */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={inter.variable}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

