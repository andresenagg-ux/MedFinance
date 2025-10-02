import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = 'theme';

function getStoredTheme(): ThemeMode | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return null;
}

function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(() => getStoredTheme() ?? getSystemTheme());
  const [isUserPreference, setIsUserPreference] = useState<boolean>(() => getStoredTheme() !== null);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (!isUserPreference || typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [isUserPreference, theme]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event: MediaQueryListEvent) => {
      if (!isUserPreference) {
        setThemeState(event.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [isUserPreference]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setIsUserPreference(true);
    setThemeState(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsUserPreference(true);
    setThemeState((current: ThemeMode) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [setTheme, theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
