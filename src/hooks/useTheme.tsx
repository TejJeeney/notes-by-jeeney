
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

type Theme = 'light' | 'dark' | 'custom';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  customColors: Record<string, string>;
  setCustomColors: (colors: Record<string, string>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [customColors, setCustomColorsState] = useState<Record<string, string>>({});
  const { user } = useAuth();

  // Load theme from database or localStorage
  useEffect(() => {
    if (user) {
      loadUserPreferences();
    } else {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) {
        setThemeState(savedTheme);
        applyTheme(savedTheme);
      }
    }
  }, [user]);

  const loadUserPreferences = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_preferences')
      .select('theme, custom_theme')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setThemeState(data.theme as Theme);
      setCustomColorsState(data.custom_theme || {});
      applyTheme(data.theme as Theme, data.custom_theme || {});
    }
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme, customColors);
    
    if (user) {
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          theme: newTheme,
          custom_theme: customColors,
        });
    } else {
      localStorage.setItem('theme', newTheme);
    }
  };

  const setCustomColors = async (colors: Record<string, string>) => {
    setCustomColorsState(colors);
    applyTheme(theme, colors);
    
    if (user) {
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          theme,
          custom_theme: colors,
        });
    }
  };

  const applyTheme = (theme: Theme, colors: Record<string, string> = {}) => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply custom colors if theme is custom
    if (theme === 'custom' && Object.keys(colors).length > 0) {
      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      customColors,
      setCustomColors,
    }}>
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
