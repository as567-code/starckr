import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import { sendResetPasswordEmail } from './api.ts';
import AlertDialog from '../components/AlertDialog.tsx';
import { emailRegex, InputErrorMessage } from '../util/inputvalidation.ts';
import { ThemeToggle } from '../components/ThemeToggle.tsx';

/**
 * A page allowing users to input their email so a reset password link can be
 * sent to them
 */
function EmailResetPasswordPage() {
  const defaultShowErrors = {
    email: false,
    alert: false,
  };
  const defaultErrorMessages = {
    email: '',
    alert: '',
  };

  const [email, setEmail] = useState('');
  const [showError, setShowErrorState] = useState(defaultShowErrors);
  const [errorMessage, setErrorMessageState] = useState(defaultErrorMessages);
  const navigate = useNavigate();

  const setErrorMessage = (field: string, msg: string) => {
    setErrorMessageState((prevState) => ({
      ...prevState,
      ...{ [field]: msg },
    }));
  };
  const setShowError = (field: string, show: boolean) => {
    setShowErrorState((prevState) => ({
      ...prevState,
      ...{ [field]: show },
    }));
  };

  const alertTitle = 'Error';
  const handleAlertClose = () => {
    setShowError('alert', false);
  };

  const validateInputs = () => {
    setShowErrorState(defaultShowErrors);
    setErrorMessageState(defaultErrorMessages);

    if (!email) {
      setErrorMessage('email', InputErrorMessage.MISSING_INPUT);
      setShowError('email', true);
      return false;
    }
    if (!email.match(emailRegex)) {
      setErrorMessage('email', InputErrorMessage.INVALID_EMAIL);
      setShowError('email', true);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (validateInputs()) {
      sendResetPasswordEmail(email)
        .then(() => {
          navigate('/');
        })
        .catch((e) => {
          setShowError('alert', true);
          setErrorMessage('alert', e.message);
        });
    }
  };

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
          Reset your password
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          Enter your email and we&apos;ll send you a reset link.
        </Typography>

        <TextField
          fullWidth
          value={email}
          error={showError.email}
          helperText={errorMessage.email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          label="Email"
          required
          placeholder="Email Address"
          sx={{ mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          onClick={() => handleSubmit()}
          sx={{ py: 1.5, fontWeight: 600 }}
        >
          Send Reset Link
        </Button>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            <RouterLink to="/" style={{ color: '#3b82f6' }}>
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

export default EmailResetPasswordPage;
