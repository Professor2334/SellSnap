'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    let currentTheme: Theme = 'system';
    
    // Read stored theme synchronously during initial effect execution
    try {
      const storedTheme = localStorage.getItem('sellsnap-theme') as Theme | null;
      if (storedTheme) {
        currentTheme = storedTheme;
        if (theme === 'system') { // Only update state if it hasn't been changed yet
           setThemeState(storedTheme);
        } else {
           currentTheme = theme;
        }
      } else {
         currentTheme = theme;
      }
    } catch (e) {
      currentTheme = theme;
    }

    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = (themeToApply: Theme) => {
      const resolvedDark = themeToApply === 'dark' || (themeToApply === 'system' && mediaQuery.matches);
      setIsDark(resolvedDark);
      
      if (resolvedDark) {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.setAttribute('data-theme', 'light');
      }
    };

    applyTheme(currentTheme);

    const listener = () => {
      if (currentTheme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem('sellsnap-theme', newTheme);
      setThemeState(newTheme);
    } catch (e) {
      // ignore
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
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
