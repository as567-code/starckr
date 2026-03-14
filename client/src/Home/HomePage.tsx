import React from 'react';
import Button from '@mui/material/Button';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Typography, Grid } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../util/redux/hooks.ts';
import {
  logout as logoutAction,
  selectUser,
} from '../util/redux/userSlice.ts';
import { logout as logoutApi } from './api.tsx';
import ScreenGrid from '../components/ScreenGrid.tsx';
import PrimaryButton from '../components/buttons/PrimaryButton.tsx';
import { AppLayout } from '../components/AppLayout';

interface PromoteButtonProps {
  isAdmin: boolean;
  navigator: NavigateFunction;
}

/**
 * A button which links to the admin dashboard when the user has an admin role.
 * @param isAdmin - whether the user holds an admin or superadmin role
 * @param navigator - a function which navigates to a new page
 */
function AdminDashboardButton({ isAdmin, navigator }: PromoteButtonProps) {
  if (!isAdmin) return null;
  return (
    <PrimaryButton
      variant="contained"
      onClick={() => navigator('/users', { replace: true })}
    >
      View all users
    </PrimaryButton>
  );
}

/**
 * The HomePage of the user dashboard. Displays a welcome message, a logout
 * button, and a link to the admin dashboard for admin users.
 */
function HomePage() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigator = useNavigate();

  const isAdmin = !!(
    user.roles?.includes('admin') || user.roles?.includes('superadmin')
  );

  const logoutDispatch = () => dispatch(logoutAction());
  const handleLogout = async () => {
    if (await logoutApi()) {
      logoutDispatch();
      navigator('/login', { replace: true });
    }
  };

  const message = `Welcome to the Boilerplate, ${user.firstName} ${user.lastName}!`;
  return (
    <AppLayout>
      <ScreenGrid>
        <Typography variant="h2">{message}</Typography>
        <Grid item container justifyContent="center">
          <AdminDashboardButton isAdmin={isAdmin} navigator={navigator} />
        </Grid>
        <Grid item container justifyContent="center">
          <Button onClick={handleLogout}>Logout</Button>
        </Grid>
      </ScreenGrid>
    </AppLayout>
  );
}

export default HomePage;
