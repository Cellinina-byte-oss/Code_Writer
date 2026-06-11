import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Theme, getThemeById, getDefaultTheme, STORAGE_KEYS, themes } from '../constants/theme';

interface ThemeContextType {
  theme: Theme;
  themeId: string;
  availableThemes: Theme[];
  setTheme: (themeId: string) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME_ID);
    return saved || getDefaultTheme().id;
  });

  const theme = getThemeById(themeId);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--theme-${key}`, value);
      }
    });
    localStorage.setItem(STORAGE_KEYS.THEME_ID, themeId);
  }, [theme, themeId]);

  const setTheme = useCallback((newThemeId: string) => {
    if (themes.some(t => t.id === newThemeId)) {
      setThemeIdState(newThemeId);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{
      theme,
      themeId,
      availableThemes: themes,
      setTheme,
      isDark: theme.type === 'dark'
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
