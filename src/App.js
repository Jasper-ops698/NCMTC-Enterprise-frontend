import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { lightTheme, darkTheme } from './components/auth/theme';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import AdminDashboard from './components/admin';
import { CartProvider } from './context/CartContext';
import Services from "./components/Services";
import "./components/Services.css";

// Wrap routes with AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/product/:productId" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/services" element={<Services />} />
    </Routes>
  );
};

function App() {
  const [darkMode, setDarkMode] = React.useState(false);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <CartProvider>
          <Router>
            <Navbar darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />
            <AnimatePresence mode="wait">
              <AnimatedRoutes />
            </AnimatePresence>
          </Router>
        </CartProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
