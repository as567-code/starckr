import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeContext } from '../theme/ThemeContext';

export function ThemeToggle() {
  const { colorMode, toggleColorMode } = useThemeContext();
  return (
    <Tooltip title={colorMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton onClick={toggleColorMode} color="inherit" aria-label="toggle color mode">
        {colorMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
