import React, { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import {
  emailRegex,
  InputErrorMessage,
  nameRegex,
  passwordRegex,
} from '../util/inputvalidation.ts';
import { registerInvite } from './api.ts';
import AlertDialog from '../components/AlertDialog.tsx';
import { ThemeToggle } from '../components/ThemeToggle.tsx';
import { useData } from '../util/api.tsx';

/**
 * A page users visit to be able to register for a new account by inputting
 * fields such as their name, email, and password.
 */
function InviteRegisterPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  const defaultShowErrors = {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
    alert: false,
  };
  const defaultErrorMessages = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    alert: '',
  };
  type ValueType = keyof typeof values;

  const [values, setValueState] = useState(defaultValues);
  const [showError, setShowErrorState] = useState(defaultShowErrors);
  const [errorMessage, setErrorMessageState] = useState(defaultErrorMessages);
  const [alertTitle, setAlertTitle] = useState('Error');
  const [isRegistered, setRegistered] = useState(false);
  const [validToken, setValidToken] = useState(true);
  const [email, setEmail] = useState('');

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

  const invite = useData(`admin/invite/${token}`);
  useEffect(() => {
    if (!invite?.data && invite !== null) {
      setValidToken(false);
    } else {
      setEmail(invite?.data?.email);
      setValue('email', invite?.data?.email);
    }
  }, [invite]);

  const handleAlertClose = () => {
    if (isRegistered) {
      navigate('/login');
    }
    setShowError('alert', false);
  };

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

    if (!values.firstName.match(nameRegex)) {
      setErrorMessage('firstName', InputErrorMessage.INVALID_NAME);
      setShowError('firstName', true);
      isValid = false;
    }
    if (!values.lastName.match(nameRegex)) {
      setErrorMessage('lastName', InputErrorMessage.INVALID_NAME);
      setShowError('lastName', true);
      isValid = false;
    }
    if (!values.email.match(emailRegex)) {
      setErrorMessage('email', InputErrorMessage.INVALID_EMAIL);
      setShowError('email', true);
      isValid = false;
    }
    if (!values.password.match(passwordRegex)) {
      setErrorMessage('password', InputErrorMessage.INVALID_PASSWORD);
      setShowError('password', true);
      isValid = false;
    }
    if (!(values.confirmPassword === values.password)) {
      setErrorMessage('confirmPassword', InputErrorMessage.PASSWORD_MISMATCH);
      setShowError('confirmPassword', true);
      isValid = false;
    }

    return isValid;
  };

  async function handleSubmit() {
    if (validateInputs() && token) {
      registerInvite(
        values.firstName,
        values.lastName,
        values.email,
        values.password,
        token,
      )
        .then(() => {
          setShowError('alert', true);
          setAlertTitle('');
          setRegistered(true);
          setErrorMessage('alert', 'Account created, please log in');
        })
        .catch((e) => {
          setShowError('alert', true);
          setErrorMessage('alert', e.message);
        });
    }
  }

  if (!validToken) {
    return (
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.default',
          p: 4,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Invalid Invite Token
        </Typography>
      </Box>
    );
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
          Stackr
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
          style={{ width: '100%', maxWidth: 440 }}
        >
          <Typography variant="h4" fontWeight={700} mb={1}>
            You&apos;re invited
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Complete your registration below.
          </Typography>

          <TextField
            fullWidth
            size="small"
            type="text"
            required
            label="Email"
            value={email}
            disabled
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              error={showError.firstName}
              helperText={errorMessage.firstName}
              size="small"
              type="text"
              required
              label="First Name"
              value={values.firstName}
              onChange={(e) => setValue('firstName', e.target.value)}
            />
            <TextField
              fullWidth
              error={showError.lastName}
              helperText={errorMessage.lastName}
              size="small"
              type="text"
              required
              label="Last Name"
              value={values.lastName}
              onChange={(e) => setValue('lastName', e.target.value)}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              error={showError.password}
              helperText={errorMessage.password}
              size="small"
              type="password"
              required
              label="Password"
              value={values.password}
              onChange={(e) => setValue('password', e.target.value)}
            />
            <TextField
              fullWidth
              error={showError.confirmPassword}
              helperText={errorMessage.confirmPassword}
              size="small"
              type="password"
              required
              label="Confirm Password"
              value={values.confirmPassword}
              onChange={(e) => setValue('confirmPassword', e.target.value)}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            onClick={() => handleSubmit()}
            sx={{ mt: 3, py: 1.5, fontWeight: 600 }}
          >
            Register
          </Button>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              <RouterLink to="/login" style={{ color: '#3b82f6' }}>
                Back to Login
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

export default InviteRegisterPage;
