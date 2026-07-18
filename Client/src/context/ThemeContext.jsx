import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTheme, setTheme } from '../shared/utils/storage';
import { setThemeColorsMode } from '../theme/colors';

const ThemeContext = createContext({
  theme:       'light',
  isDark:      false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState('light');

  useEffect(() => {
    getTheme().then((saved) => {
      if (saved) {
        setThemeState(saved);
        setThemeColorsMode(saved);
      }
    });
  }, []);

  const toggleTheme = async () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setThemeState(next);
    setThemeColorsMode(next);
    await setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
