import React, { useState } from 'react';
import {
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Rating,
  Box,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const ProductList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data - replace with API call
  const products = [
    {
      id: 1,
      name: 'Product 1',
      description: 'Description for product 1',
      price: 29.99,
      rating: 4.5,
      image: 'https://via.placeholder.com/200',
      seller: 'John Doe',
    },
    {
      id: 2,
      name: 'Product 2',
      description: 'Description for product 2',
      price: 39.99,
      rating: 4.0,
      image: 'https://via.placeholder.com/200',
      seller: 'Jane Smith',
    },
    // Add more mock products as needed
  ];

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAddToCart = (productId) => {
    // Implement add to cart functionality
    console.log('Adding product to cart:', productId);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Product List
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  Ksh{product.price.toFixed(2)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={product.rating} precision={0.5} readOnly />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({product.rating})
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Seller: {product.seller}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => handleAddToCart(product.id)}
                  fullWidth
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductList;
