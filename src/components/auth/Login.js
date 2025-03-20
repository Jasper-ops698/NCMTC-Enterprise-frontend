import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  IconButton,
  InputAdornment,
  Divider,
  Stack,
} from '@mui/material';
import { Visibility, VisibilityOff, Facebook } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FacebookLogin from '@greatsumini/react-facebook-login';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login/`, formData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleFacebookSuccess = async (response) => {
    try {
      const { accessToken, userID } = response;
      const apiResponse = await axios.post('/api/auth/facebook/', {
        access_token: accessToken,
        user_id: userID,
      });
      if (apiResponse.data.token) {
        localStorage.setItem('token', apiResponse.data.token);
        navigate('/');
      }
    } catch (err) {
      setError('Facebook login failed');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            error={Boolean(error)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={Boolean(error)}
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
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>

          <Divider sx={{ my: 2 }}>OR</Divider>

          <Stack spacing={2}>
            <FacebookLogin
              appId="your-facebook-app-id"
              onSuccess={handleFacebookSuccess}
              onFail={(error) => {
                console.log('Facebook Login Failed!', error);
                setError('Facebook login failed');
              }}
              render={({ onClick }) => (
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: '#1877F2',
                    '&:hover': {
                      backgroundColor: '#0b5fcc',
                    },
                  }}
                  startIcon={<Facebook />}
                  onClick={onClick}
                >
                  Continue with Facebook
                </Button>
              )}
            />
          </Stack>

          <Button
            fullWidth
            onClick={() => navigate('/register')}
            sx={{ mt: 2 }}
          >
            Don't have an account? Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
