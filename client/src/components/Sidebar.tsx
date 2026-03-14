import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAppDispatch } from '../util/redux/hooks.ts';
import { logout as logoutAction } from '../util/redux/userSlice.ts';
import { logout as logoutApi } from '../Home/api.tsx';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { label: 'Home', path: '/home' },
  { label: 'Admin', path: '/users' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    if (await logoutApi()) {
      dispatch(logoutAction());
      navigate('/login', { replace: true });
    }
  };

  return (
    <Box
      sx={{
        width: 220,
        flexShrink: 0,
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={700}>
          Stackr
        </Typography>
        <ThemeToggle />
      </Box>
      <Divider />
      <List sx={{ flex: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                '&.active': {
                  bgcolor: 'action.selected',
                  color: 'primary.main',
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}
        >
          Sign out
        </Button>
      </Box>
    </Box>
  );
}
