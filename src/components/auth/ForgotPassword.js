import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { pageVariants, pageTransition } from './animations';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/forgot-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to process request');
      }

      setStatus({
        type: 'success',
        message: 'Password reset instructions have been sent to your email.',
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message,
      });
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          p: isMobile ? 2 : 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: isMobile ? 2 : 4,
            width: '100%',
            maxWidth: 400,
            borderRadius: 2,
          }}
        >
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            align="center" 
            gutterBottom
          >
            Forgot Password
          </Typography>
          <Typography 
            variant={isMobile ? "body2" : "body1"} 
            align="center" 
            sx={{ mb: 3 }}
          >
            Enter your email address and we'll send you instructions to reset your password.
          </Typography>

          {status.message && (
            <Alert severity={status.type} sx={{ mb: 2 }}>
              {status.message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size={isMobile ? "small" : "medium"}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              size={isMobile ? "small" : "medium"}
            >
              Send Reset Instructions
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant={isMobile ? "body2" : "body1"}>
              Remember your password?{' '}
              <Link to="/login" style={{ color: theme.palette.primary.main }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </motion.div>
  );
};

export default ForgotPassword;
