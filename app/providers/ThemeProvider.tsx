'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/** Resolve whether a given preference results in a dark UI. */
function resolveIsDark(preference: Theme): boolean {
  if (preference === 'dark') return true;
  if (preference === 'light') return false;
  // 'system'
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

/** Apply data-theme to the document root immediately. */
function applyToDOM(dark: boolean): void {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Start with safe SSR-friendly defaults — never read the DOM or localStorage here.
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [theme, setThemeState] = useState<Theme>('system');

  // On first mount: read persisted preference and sync everything up.
  useEffect(() => {
    let stored: Theme = 'system';
    try {
      const v = localStorage.getItem('sellsnap-theme') as Theme | null;
      if (v === 'light' || v === 'dark' || v === 'system') stored = v;
    } catch {
      // localStorage unavailable — stay on 'system'
    }
    const dark = resolveIsDark(stored);
    setThemeState(stored);
    setIsDark(dark);
    applyToDOM(dark);
    setMounted(true);

    // Follow OS preference changes when on 'system' mode.
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onMQChange = (e: MediaQueryListEvent) => {
      // Only react if the user hasn't pinned a specific theme.
      let current: Theme = 'system';
      try {
        const v = localStorage.getItem('sellsnap-theme') as Theme | null;
        if (v === 'light' || v === 'dark' || v === 'system') current = v;
      } catch { /* ignore */ }
      if (current === 'system') {
        setIsDark(e.matches);
        applyToDOM(e.matches);
      }
    };
    mq.addEventListener('change', onMQChange);
    return () => mq.removeEventListener('change', onMQChange);
  }, []);

  const setTheme = (newTheme: Theme) => {
    // Persist preference.
    try {
      localStorage.setItem('sellsnap-theme', newTheme);
    } catch {
      // ignore
    }
    // Apply immediately — no waiting for a useEffect cycle.
    const dark = resolveIsDark(newTheme);
    setThemeState(newTheme);
    setIsDark(dark);
    applyToDOM(dark);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
