import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { verifyAccount } from './api.ts';
import { ThemeToggle } from '../components/ThemeToggle.tsx';

/**
 * A page users visit to verify their account. Page should be accessed via
 * a link sent to their email and the path should contain a token as a query
 * param for this page to use to make the correct server request.
 */
function VerifyAccountPage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { token } = useParams();

  useEffect(() => {
    verifyAccount(token || 'missing token')
      .then(() => {
        setMessage('Account successfully verified!');
        setLoading(false);
      })
      .catch(() => {
        setMessage('Unable to verify account');
        setLoading(false);
      });
  }, [token]);

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

      {loading ? (
        <CircularProgress />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ textAlign: 'center' }}
        >
          <Typography variant="h4" fontWeight={700} mb={3}>
            {message}
          </Typography>
          <Button
            href="/login"
            variant="contained"
            size="large"
            sx={{ py: 1.5, px: 4, fontWeight: 600 }}
          >
            Back to Login
          </Button>
        </motion.div>
      )}
    </Box>
  );
}

export default VerifyAccountPage;
