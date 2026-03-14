import { createTheme, Theme } from '@mui/material/styles';

export const darkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#0a0a0a', paper: '#111111' },
    primary: { main: '#3b82f6' },
    secondary: { main: '#8b5cf6' },
    text: { primary: '#ffffff', secondary: '#a1a1aa' },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
  },
  shape: { borderRadius: 8 },
});

export const lightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#fafafa', paper: '#ffffff' },
    primary: { main: '#3b82f6' },
    secondary: { main: '#8b5cf6' },
    text: { primary: '#111111', secondary: '#6b7280' },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
  },
  shape: { borderRadius: 8 },
});
