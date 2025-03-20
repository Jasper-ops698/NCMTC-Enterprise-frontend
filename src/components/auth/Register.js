import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  InputAdornment,
  Avatar,
  useTheme,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Visibility, VisibilityOff, CloudUpload } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios

const steps = ['Account Details', 'Profile Picture', 'Additional Info'];

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    profilePicture: null,
    isSeller: false,
    businessName: '',
    businessDescription: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const theme = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        setError('File size should not exceed 5MB');
        return;
      }
      setFormData({ ...formData, profilePicture: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      console.log('Sending registration request...');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register/`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        timeout: 30000, // 30 seconds timeout
        validateStatus: function (status) {
          return status >= 200 && status < 500; // Accept all responses to handle them manually
        }
      });

      console.log('Registration response:', response);

      if (response.status === 201) {
        // Handle successful registration
        window.location.href = '/verify-email';
      } else {
        throw new Error(response.data?.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error details:', err.response || err);
      let errorMessage;
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Registration request timed out. Please try again.';
      } else if (err.response) {
        // The server responded with a status code outside of 2xx
        errorMessage = err.response.data?.error || 'Registration failed';
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request
        errorMessage = err.message || 'An error occurred during registration';
      }
      
      setError(errorMessage);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={Boolean(error)}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
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
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-picture"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="profile-picture">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUpload />}
                sx={{ mb: 2 }}
              >
                Upload Profile Picture
              </Button>
            </label>
            {previewUrl && (
              <Box sx={{ mt: 2 }}>
                <Avatar
                  src={previewUrl}
                  sx={{ width: 100, height: 100, margin: '0 auto' }}
                />
              </Box>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <TextField
              fullWidth
              margin="normal"
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Are you registering as a seller?
              </Typography>
              <Box>
                <Button
                  variant={formData.isSeller ? "contained" : "outlined"}
                  onClick={() => handleChange({ target: { name: 'isSeller', value: true } })}
                  sx={{ mr: 1 }}
                >
                  Yes
                </Button>
                <Button
                  variant={!formData.isSeller ? "contained" : "outlined"}
                  onClick={() => handleChange({ target: { name: 'isSeller', value: false } })}
                >
                  No
                </Button>
              </Box>
            </Box>
            {formData.isSeller && (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Business Name"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required={formData.isSeller}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Business Description"
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required={formData.isSeller}
                  helperText="Describe your business, products, or services"
                />
              </>
            )}
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 600,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Create Account
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
          >
            {activeStep === steps.length - 1 ? 'Register' : 'Next'}
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link to="/login" style={{ color: theme.palette.primary.main }}>
              Sign In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
