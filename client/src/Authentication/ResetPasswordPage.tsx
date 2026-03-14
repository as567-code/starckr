import React, { useState } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import { resetPassword } from './api.ts';
import { InputErrorMessage, passwordRegex } from '../util/inputvalidation.ts';
import AlertDialog from '../components/AlertDialog.tsx';
import { ThemeToggle } from '../components/ThemeToggle.tsx';

/**
 * A page that allows users to reset their password by inputting a new password
 * into a form.
 */
function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const defaultValues = {
    password: '',
    confirmPassword: '',
  };
  const defaultShowErrors = {
    password: false,
    confirmPassword: false,
    alert: false,
  };
  const defaultErrorMessages = {
    password: '',
    confirmPassword: '',
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

    if (!values.password.match(passwordRegex)) {
      setErrorMessage('password', InputErrorMessage.INVALID_PASSWORD);
      setShowError('password', true);
      isValid = false;
    }
    if (!(values.password === values.confirmPassword)) {
      setErrorMessage('confirmPassword', InputErrorMessage.PASSWORD_MISMATCH);
      setShowError('confirmPassword', true);
      isValid = false;
    }
    return isValid;
  };

  const alertTitle = 'Error';
  const handleAlertClose = () => {
    setShowError('alert', false);
  };

  async function handleSubmit() {
    if (validateInputs()) {
      resetPassword(values.password, token || 'missing token')
        .then(() => {
          navigate('/');
        })
        .catch((e) => {
          setErrorMessage('alert', e.message);
          setShowError('alert', true);
        });
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        position: 'relative',
        p: 4,
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
          Set new password
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          Choose a strong password for your account.
        </Typography>

        <TextField
          fullWidth
          error={showError.password}
          helperText={errorMessage.password}
          type="password"
          required
          label="New Password"
          value={values.password}
          onChange={(e) => setValue('password', e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          error={showError.confirmPassword}
          helperText={errorMessage.confirmPassword}
          type="password"
          required
          label="Confirm Password"
          value={values.confirmPassword}
          onChange={(e) => setValue('confirmPassword', e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          onClick={() => handleSubmit()}
          sx={{ mt: 3, py: 1.5, fontWeight: 600 }}
        >
          Reset Password
        </Button>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            <RouterLink to="/login" style={{ color: '#3b82f6' }}>
              Back to Login
            </RouterLink>
          </Typography>
        </Box>
      </motion.div>

      <AlertDialog
        showAlert={showError.alert}
        title={alertTitle}
        message={errorMessage.alert}
        onClose={handleAlertClose}
      />
    </Box>
  );
}

export default ResetPasswordPage;
