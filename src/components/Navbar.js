import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  Badge,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import logo from '../assets/logo.jpg';

const Navbar = ({ darkMode, onToggleDarkMode }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { getItemCount } = useCart();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Box component="img" src={logo} alt="Logo" sx={{ 
          flexGrow: 0,
          height: 40,
          cursor: 'pointer'
        }} onClick={() => navigate('/')} />

        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2, ml: 'auto' }}>
          <Button color="inherit" component={Link} to="/products">
            Products
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/register">
            Register
          </Button>
        </Box>

        <IconButton 
          color="inherit" 
          onClick={onToggleDarkMode}
          sx={{ ml: 1 }}
        >
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        <IconButton 
          color="inherit"
          component={Link}
          to="/cart"
          sx={{ ml: 1 }}
        >
          <Badge badgeContent={getItemCount()} color="error">
            <CartIcon />
          </Badge>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleNavigate('/products')}>Products</MenuItem>
          <MenuItem onClick={() => handleNavigate('/login')}>Login</MenuItem>
          <MenuItem onClick={() => handleNavigate('/register')}>Register</MenuItem>
          <MenuItem onClick={() => handleNavigate('/cart')}>Cart</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
