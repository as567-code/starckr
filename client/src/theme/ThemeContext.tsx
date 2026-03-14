import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from './theme';

type ColorMode = 'dark' | 'light';

interface ThemeContextValue {
  colorMode: ColorMode;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colorMode: 'dark',
  toggleColorMode: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    const stored = localStorage.getItem('colorMode');
    return stored === 'dark' || stored === 'light' ? stored : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('colorMode', colorMode);
  }, [colorMode]);

  const toggleColorMode = () =>
    setColorMode((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ colorMode, toggleColorMode }}>
      <MuiThemeProvider theme={colorMode === 'dark' ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
