import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { pageVariants, pageTransition } from './animations';

const ResetPassword = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setStatus({
        type: 'error',
        message: 'Passwords do not match',
      });
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      setStatus({
        type: 'success',
        message: 'Password has been successfully reset. You can now login with your new password.',
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
            Reset Password
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
              label="New Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              size={isMobile ? "small" : "medium"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size={isMobile ? "small" : "medium"}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
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
              Reset Password
            </Button>
          </form>

          {status.type === 'success' && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant={isMobile ? "body2" : "body1"}>
                <Link to="/login" style={{ color: theme.palette.primary.main }}>
                  Return to Login
                </Link>
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </motion.div>
  );
};

export default ResetPassword;
