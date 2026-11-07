import { createContext, useContext, useEffect, useState } from 'react';
const STORAGE_KEY = 'migrant_community_theme';
const ThemeContext = createContext(null);
function getInitialTheme() {
  if (typeof window === 'undefined') return 'system';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
  } catch {
    // ignore localStorage errors (e.g. sandboxed iframe or private browsing)
  }
  return 'system';
}
function getSystemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
export function ThemeProvider({
  children
}) {
  const [theme, setThemeState] = useState(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState(() => {
    const initial = getInitialTheme();
    return initial === 'system' ? getSystemTheme() : initial;
  });

  // Apply theme to document element
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateResolvedTheme = () => {
      const activeResolved = theme === 'system' ? mediaQuery.matches ? 'dark' : 'light' : theme;
      setResolvedTheme(activeResolved);
      const root = document.documentElement;
      if (activeResolved === 'dark') {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };
    updateResolvedTheme();
    const handleSystemChange = () => {
      if (theme === 'system') {
        updateResolvedTheme();
      }
    };
    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);
  const setTheme = newTheme => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // ignore storage errors
    }
  };
  const toggleTheme = () => {
    // If currently dark (either via 'dark' or system dark), switch to light, else dark
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };
  return <ThemeContext.Provider value={{
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme
  }}>
      {children}
    </ThemeContext.Provider>;
}
export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
