import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import { useAppDispatch } from '../util/redux/hooks.ts';
import { login as loginRedux } from '../util/redux/userSlice.ts';
import { emailRegex, InputErrorMessage } from '../util/inputvalidation.ts';
import { loginUser } from './api.ts';
import AlertDialog from '../components/AlertDialog.tsx';
import { ThemeToggle } from '../components/ThemeToggle.tsx';

/**
 * A page allowing users to input their email and password to login. The default
 * starting page of the application
 */
function LoginPage() {
  const navigate = useNavigate();

  const defaultValues = {
    email: '',
    password: '',
  };
  const defaultShowErrors = {
    email: false,
    password: false,
    alert: false,
  };
  const defaultErrorMessages = {
    email: '',
    password: '',
    alert: '',
  };
  type ValueType = keyof typeof values;

  const [values, setValueState] = useState(defaultValues);
  const [showError, setShowErrorState] = useState(defaultShowErrors);
  const [errorMessage, setErrorMessageState] = useState(defaultErrorMessages);

  const setValue = (field: string, value: string) => {
    setValueState((prevState) => ({
      ...prevState,
      ...{ [field]: value },
    }));
  };
  const setShowError = (field: string, show: boolean) => {
    setShowErrorState((prevState) => ({
      ...prevState,
      ...{ [field]: show },
    }));
  };
  const setErrorMessage = (field: string, msg: string) => {
    setErrorMessageState((prevState) => ({
      ...prevState,
      ...{ [field]: msg },
    }));
  };

  const alertTitle = 'Error';
  const handleAlertClose = () => {
    setShowError('alert', false);
  };

  const dispatch = useAppDispatch();
  function dispatchUser(
    userEmail: string,
    firstName: string,
    lastName: string,
    admin: boolean,
  ) {
    dispatch(loginRedux({ email: userEmail, firstName, lastName, admin }));
  }

  const clearErrorMessages = () => {
    setShowErrorState(defaultShowErrors);
    setErrorMessageState(defaultErrorMessages);
  };

  const validateInputs = () => {
    clearErrorMessages();
    let isValid = true;

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const valueTypeString in values) {
      const valueType = valueTypeString as ValueType;
      if (!values[valueType]) {
        setErrorMessage(valueTypeString, InputErrorMessage.MISSING_INPUT);
        setShowError(valueTypeString, true);
        isValid = false;
      }
    }

    if (!values.email.match(emailRegex)) {
      setErrorMessage('email', InputErrorMessage.INVALID_EMAIL);
      setShowError('email', true);
      isValid = false;
    }
    if (!values.password) {
      setErrorMessage('password', InputErrorMessage.MISSING_INPUT);
      setShowError('password', true);
      isValid = false;
    }

    return isValid;
  };

  async function handleSubmit() {
    if (validateInputs()) {
      loginUser(values.email, values.password)
        .then((user) => {
          dispatchUser(
            user.email!,
            user.firstName!,
            user.lastName!,
            user.admin!,
          );
          navigate('/home');
        })
        .catch((e) => {
          setShowError('alert', true);
          setErrorMessage('alert', e.message);
        });
    }
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Brand panel — hidden on mobile */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #0a0a0a 100%)',
          p: 6,
        }}
      >
        <Typography variant="h3" fontWeight={700} color="white">
          Aditya App
        </Typography>
        <Typography
          variant="body1"
          color="grey.500"
          mt={2}
          textAlign="center"
          maxWidth={320}
        >
          Your full-stack TypeScript starter — built for speed.
        </Typography>
      </Box>

      {/* Form panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <ThemeToggle />
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: 400 }}
        >
          <Typography variant="h4" fontWeight={700} mb={1}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Sign in to your account
          </Typography>

          <TextField
            fullWidth
            error={showError.email}
            helperText={errorMessage.email}
            type="email"
            required
            label="Email"
            value={values.email}
            onChange={(e) => setValue('email', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            error={showError.password}
            helperText={errorMessage.password}
            type="password"
            required
            label="Password"
            value={values.password}
            onChange={(e) => setValue('password', e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            onClick={() => handleSubmit()}
            sx={{ mt: 3, py: 1.5, fontWeight: 600 }}
          >
            Sign in
          </Button>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              <RouterLink to="/email-reset" style={{ color: 'inherit' }}>
                Forgot password?
              </RouterLink>
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              No account?{' '}
              <RouterLink to="/register" style={{ color: '#3b82f6' }}>
                Create one
              </RouterLink>
            </Typography>
          </Box>
        </motion.div>
      </Box>

      <AlertDialog
        showAlert={showError.alert}
        title={alertTitle}
        message={errorMessage.alert}
        onClose={handleAlertClose}
      />
    </Box>
  );
}

export default LoginPage;
