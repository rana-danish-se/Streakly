import { createContext, useContext, useEffect, useState } from 'react';

const themeConfig = {
  light: {
    bg: "#F8FAFC",
    card: "#FFFFFF",
    text: "#0F172A",
    primary: "#6366F1",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
  },
  dark: {
    bg: "#020617",
    card: "#020617",
    text: "#E5E7EB",
    primary: "#818CF8",
    success: "#4ADE80",
    warning: "#FBBF24",
    danger: "#F87171",
  }
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Derive current theme colors directly from state to avoid useEffect sync state updates
  const currentThemeColors = themeConfig[theme];

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeConfig, currentThemeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};
